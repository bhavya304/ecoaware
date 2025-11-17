import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

// Fix default marker issue in React-Leaflet
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const WasteTracking = ({ mode = "citizen", user }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Worker state
  const [vehicleId, setVehicleId] = useState("");
  const [status, setStatus] = useState("Idle");

  // Fetch vehicles from backend
  const fetchVehicles = async () => {
    try {
      const res = await axios.get("/api/waste-tracking/vehicles");
      setVehicles(res.data.vehicles || []);
    } catch (err) {
      console.error("Error fetching vehicle data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
    const interval = setInterval(fetchVehicles, 15000); // refresh every 15s
    return () => clearInterval(interval);
  }, []);

  // Worker: Update location + status via backend
  const updateWorkerLocation = async () => {
    if (!navigator.geolocation) {
      alert("❌ Geolocation is not supported by your browser");
      return;
    }

    if (!vehicleId) {
      alert("❌ Please enter Vehicle ID");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await axios.post(
            "/api/waste-tracking/vehicles/update",
            {
              id: vehicleId,
              status,
              lat: latitude,
              lng: longitude,
            }
          );

          const updatedVehicle = response.data.vehicle;

          setVehicles((prev) => {
            const others = prev.filter((v) => v.id !== updatedVehicle.id);
            return [...others, updatedVehicle];
          });

          alert("✅ Vehicle location & status updated successfully!");
        } catch (err) {
          console.error(err);
          alert("❌ Failed to update vehicle. Check console for details.");
        }
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("❌ Failed to fetch location. Please allow location access.");
      }
    );
  };

  return (
    <div className="waste-tracking-page p-3">
      <h2 className="mb-3">🚛 Waste Tracking Dashboard</h2>

      {/* Worker Mode Panel */}
      {mode === "worker" && (
        <div className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">Worker Controls</h5>
            <div className="mb-2">
              <label className="form-label">Vehicle ID</label>
              <input
                type="text"
                className="form-control"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                placeholder="Enter Vehicle ID"
              />
            </div>
            <div className="mb-2">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Idle">Idle</option>
                <option value="Collecting">Collecting</option>
                <option value="Transporting">Transporting</option>
                <option value="Unloading">Unloading</option>
              </select>
            </div>
            <button
              className="btn btn-success w-100"
              onClick={updateWorkerLocation}
            >
              📍 Update My Location
            </button>
          </div>
        </div>
      )}

      {/* Map */}
      {loading ? (
        <p>Loading live vehicle data...</p>
      ) : (
        <MapContainer
          center={[17.385044, 78.486671]}
          zoom={12}
          style={{ height: "500px", width: "100%", borderRadius: "8px" }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[
                vehicle.currentLocation?.lat || vehicle.lat,
                vehicle.currentLocation?.lng || vehicle.lng,
              ]}
            >
              <Popup>
                <strong>Vehicle ID:</strong> {vehicle.id} <br />
                <strong>Status:</strong> {vehicle.status} <br />
                <strong>Last Updated:</strong>{" "}
                {new Date(vehicle.lastUpdated).toLocaleString()}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </div>
  );
};

export default WasteTracking;
