import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapPage = ({ user }) => {
  const { t } = useTranslation();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newLocation, setNewLocation] = useState({
    name: '',
    type: 'recycling',
    address: '',
    description: ''
  });

  const defaultCenter = [17.3850, 78.4867]; // Hyderabad

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    try {
      const response = await axios.get('/api/locations');
      setLocations(response.data.locations || []);
    } catch (error) {
      console.error('Error loading locations:', error);
      setLocations(mockLocations);
    } finally {
      setLoading(false);
    }
  };

  const mockLocations = [
  // Recycling
  { id: 1, name: "Central Park Recycling Bin", type: "recycling", lat: 17.3850, lng: 78.4867, address: "Central Park, Hyderabad", description: "General recyclable materials accepted", verified: true, addedBy: "admin" },
  { id: 2, name: "Madhapur Recycling Hub", type: "recycling", lat: 17.4483, lng: 78.3915, address: "Madhapur, Hyderabad", description: "Plastic bottles, cans, and e-waste accepted", verified: false, addedBy: "worker2" },

  // Compost
  { id: 3, name: "Community Compost Center", type: "compost", lat: 17.4435, lng: 78.3772, address: "Gachibowli, Hyderabad", description: "Organic waste composting facility", verified: true, addedBy: "admin" },
  { id: 4, name: "EcoGarden Compost Site", type: "compost", lat: 17.4000, lng: 78.4800, address: "Secunderabad", description: "Accepts garden clippings and kitchen waste", verified: false, addedBy: "citizen2" },

  // Hazardous
  { id: 5, name: "Hazardous Waste Collection", type: "hazardous", lat: 17.3616, lng: 78.4747, address: "Industrial Area, Hyderabad", description: "Battery, electronic, and chemical waste", verified: false, addedBy: "worker1" },
  { id: 6, name: "E-Waste Drop Point", type: "hazardous", lat: 17.4200, lng: 78.5000, address: "Kukatpally, Hyderabad", description: "Accepts e-waste and CFL bulbs", verified: true, addedBy: "admin" },

  // Pickup
  { id: 7, name: "Mobile Pickup Point", type: "pickup", lat: 17.4126, lng: 78.4514, address: "Banjara Hills, Hyderabad", description: "Weekly pickup service available", verified: true, addedBy: "citizen1" },
  { id: 8, name: "Residential Pickup Spot", type: "pickup", lat: 17.4500, lng: 78.3800, address: "Ameerpet, Hyderabad", description: "Door-to-door pickup every Sunday", verified: false, addedBy: "worker3" }
];


  const handleAddLocation = async (e) => {
    e.preventDefault();

    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await axios.post('/api/locations', {
          ...newLocation,
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          userId: user.id
        });

        if (response.data.success) {
          setLocations([...locations, response.data.location]);
          setNewLocation({ name: '', type: 'recycling', address: '', description: '' });
          setShowAddForm(false);
          alert('📍 Location added successfully! It will be verified soon.');
        }
      } catch (error) {
        console.error('Error adding location:', error);
        alert('Failed to add location. Please try again.');
      }
    }, (error) => {
      alert("Unable to fetch GPS location. Please enable location services.");
      console.error(error);
    });
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'recycling': return '♻️';
      case 'compost': return '🌱';
      case 'hazardous': return '⚠️';
      case 'pickup': return '🚛';
      default: return '📍';
    }
  };

  const getLocationColor = (type) => {
    switch (type) {
      case 'recycling': return 'success';
      case 'compost': return 'warning';
      case 'hazardous': return 'danger';
      case 'pickup': return 'info';
      default: return 'secondary';
    }
  };

  const filteredLocations = locations.filter(location =>
    filter === 'all' || location.type === filter
  );

  const locationTypes = ['all', 'recycling', 'compost', 'hazardous', 'pickup'];

  if (loading) return (
    <div className="container mt-4 text-center">
      <div className="spinner-border text-success" role="status">
        <span className="visually-hidden">{t('loading')}</span>
      </div>
    </div>
  );

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-info text-white">
            <div className="card-body">
              <h2 className="card-title">🗺️ {t('recyclingMap')}</h2>
              <p className="card-text">Find recycling centers, compost facilities, and waste collection points near you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Filter Locations</h6>
              <div className="btn-group w-100" role="group">
                {locationTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`btn ${filter === type ? 'btn-primary' : 'btn-outline-primary'} btn-sm`}
                    onClick={() => setFilter(type)}
                  >
                    {type === 'all' ? 'All' : `${getLocationIcon(type)} ${type}`}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h6 className="card-title">Add New Location</h6>
              <button className="btn btn-success w-100" onClick={() => setShowAddForm(true)}>
                📍 Tag New Location
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <MapContainer center={defaultCenter} zoom={12} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />
                {filteredLocations.map(loc => (
                  <Marker key={loc.id} position={[loc.lat, loc.lng]} icon={L.icon({
                    iconUrl: `https://cdn.jsdelivr.net/npm/twemoji/2/svg/1f4cd.svg`,
                    iconSize: [30, 30],
                    iconAnchor: [15, 30]
                  })}>
                    <Popup>
                      <b>{loc.name}</b><br />
                      {loc.address}<br />
                      <small>{loc.description}</small>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Location List */}
      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Locations ({filteredLocations.length})</h5>
              <small className="text-muted">{filter === 'all' ? 'All Types' : filter}</small>
            </div>
            <div className="card-body">
              {filteredLocations.length === 0 ? (
                <div className="text-center py-4">
                  <div style={{ fontSize: '3rem' }}>📍</div>
                  <h5 className="text-muted">No locations found</h5>
                  <p className="text-muted">Try different filters or add a new location</p>
                </div>
              ) : (
                <div className="row">
                  {filteredLocations.map(location => (
                    <div key={location.id} className="col-lg-6 mb-3">
                      <div className={`card border-${getLocationColor(location.type)} h-100`}>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title">
                              <span className="me-2" style={{ fontSize: '1.5rem' }}>
                                {getLocationIcon(location.type)}
                              </span>
                              {location.name}
                            </h6>
                            {location.verified && <span className="badge bg-success">✓ Verified</span>}
                          </div>
                          <p className="card-text small"><strong>📍 Address:</strong> {location.address}</p>
                          {location.description && <p className="card-text small text-muted">{location.description}</p>}
                          <div className="d-flex justify-content-between align-items-center">
                            <span className={`badge bg-${getLocationColor(location.type)}`}>{location.type}</span>
                            <button 
                              className="btn btn-outline-primary btn-sm"
                              onClick={() => {
                                const url = `https://www.google.com/maps/search/?api=1&query=${location.lat},${location.lng}`;
                                window.open(url, '_blank');
                              }}
                            >
                              🧭 Directions
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Location Modal */}
      {showAddForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Location</h5>
                <button type="button" className="btn-close" onClick={() => setShowAddForm(false)}></button>
              </div>
              <form onSubmit={handleAddLocation}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Location Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Type *</label>
                    <select
                      className="form-select"
                      value={newLocation.type}
                      onChange={(e) => setNewLocation({ ...newLocation, type: e.target.value })}
                    >
                      <option value="recycling">♻️ Recycling Center</option>
                      <option value="compost">🌱 Compost Facility</option>
                      <option value="hazardous">⚠️ Hazardous Waste</option>
                      <option value="pickup">🚛 Pickup Point</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newLocation.address}
                      onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })}
                      placeholder="Street address or landmark"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="2"
                      value={newLocation.description}
                      onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                      placeholder="Additional details about this location"
                    ></textarea>
                  </div>
                  <div className="alert alert-info">
                    <small>💡 Tip: GPS will automatically detect your current location. Please allow location access on your device.</small>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
                  <button type="submit" className="btn btn-success">Add Location</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MapPage;
