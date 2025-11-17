import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const Marketplace = ({ user }) => {
  const { t } = useTranslation();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // -------------------- MOCK VENDORS --------------------
  const mockVendors = [
    {
      id: 1,
      name: "Green Earth Store",
      category: "General",
      description: "Eco-friendly products for everyday use",
      rating: 4.8,
      discount: "15% off for EcoAware users",
      image: "🌍",
      location: "Downtown",
      contact: "contact@greenearth.com",
      website: "www.greenearth.com",
      products: ["Bamboo Toothbrushes", "Reusable Bags", "Solar Chargers"],
      verified: true
    },
    {
      id: 2,
      name: "Zero Waste Co.",
      category: "Zero Waste",
      description: "Complete zero-waste lifestyle solutions",
      rating: 4.9,
      discount: "20% off bulk orders",
      image: "♻️",
      location: "City Center",
      contact: "hello@zerowaste.co",
      website: "www.zerowaste.co",
      products: ["Compost Bins", "Reusable Containers", "Organic Cleaners"],
      verified: true
    },
    {
      id: 3,
      name: "Bamboo Basics",
      category: "Bamboo Products",
      description: "Premium bamboo products for sustainable living",
      rating: 4.7,
      discount: "10% off first purchase",
      image: "🎋",
      location: "Mall Road",
      contact: "info@bamboobasics.com",
      website: "www.bamboobasics.com",
      products: ["Bamboo Cutlery", "Bamboo Bottles", "Bamboo Fiber Clothes"],
      verified: false
    },
    {
      id: 4,
      name: "Solar Solutions",
      category: "Renewable Energy",
      description: "Solar panels and renewable energy systems",
      rating: 4.6,
      discount: "Free consultation",
      image: "☀️",
      location: "Industrial Area",
      contact: "support@solarsolutions.in",
      website: "www.solarsolutions.in",
      products: ["Solar Panels", "Solar Lights", "Power Banks"],
      verified: true
    },
    {
      id: 5,
      name: "Organic Garden",
      category: "Organic Food",
      description: "Fresh organic produce and gardening supplies",
      rating: 4.5,
      discount: "Free delivery on ₹500+",
      image: "🥬",
      location: "Farm House",
      contact: "orders@organicgarden.in",
      website: "www.organicgarden.in",
      products: ["Organic Vegetables", "Seeds", "Fertilizers"],
      verified: true
    },
    {
      id: 6,
      name: "EcoFashion Hub",
      category: "Clothing",
      description: "Sustainable and ethical fashion brands",
      rating: 4.4,
      discount: "25% off seasonal sale",
      image: "👕",
      location: "Fashion Street",
      contact: "style@ecofashion.com",
      website: "www.ecofashion.com",
      products: ["Organic Cotton Wear", "Recycled Fabric", "Hemp Clothing"],
      verified: false
    }
  ];

  // -------------------- LOAD VENDORS --------------------
  useEffect(() => {
    loadVendors();
  }, []);

const loadVendors = async () => {
  try {
    const response = await axios.get('/api/vendors');
    const apiVendors = response.data.vendors || [];
    setVendors(apiVendors.length ? apiVendors : mockVendors); // fallback to mock
  } catch (error) {
    console.error('Error loading vendors:', error);
    setVendors(mockVendors); // fallback
  } finally {
    setLoading(false);
  }
};
  const categories = ['all', 'General', 'Zero Waste', 'Bamboo Products', 'Renewable Energy', 'Organic Food', 'Clothing'];

  const filteredVendors = vendors.filter(vendor => {
    const matchesCategory = filter === 'all' || vendor.category === filter;
    const matchesSearch =
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getRatingStars = (rating) => {
    return '⭐'.repeat(Math.floor(rating)) + (rating % 1 ? '⭐' : '');
  };

  if (loading) {
    return (
      <div className="container mt-4">
        <div className="text-center">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">{t('loading')}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      {/* Header */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card bg-success text-white">
            <div className="card-body">
              <h2 className="card-title">🛒 {t('marketplace')}</h2>
              <p className="card-text">
                Discover eco-friendly vendors and sustainable products
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <span className="input-group-text">🔍</span>
            <input
              type="text"
              className="form-control"
              placeholder="Search vendors or products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats */}

      {/* Vendors Grid */}
      <div className="row">
        {filteredVendors.map(vendor => (
          <div key={vendor.id} className="col-lg-4 col-md-6 mb-4">
            <div className="card h-100 shadow-sm border-0">
              {vendor.verified && (
                <div className="position-absolute top-0 end-0 m-2">
                  <span className="badge bg-success">✓ Verified</span>
                </div>
              )}

              <div className="card-body">
                <div className="text-center mb-3">
                  <div style={{ fontSize: '3rem' }}>
                    {vendor.image}
                  </div>
                  <h5 className="card-title mt-2">{vendor.name}</h5>
                  <small className="badge bg-light text-dark">
                    {vendor.category}
                  </small>
                </div>

                <div className="text-center mb-3">
                  <div className="mb-1">
                    {getRatingStars(vendor.rating)}
                    <small className="text-muted ms-1">({vendor.rating})</small>
                  </div>
                  <small className="text-muted">📍 {vendor.location}</small>
                </div>

                <p className="card-text text-muted small">
                  {vendor.description}
                </p>

                {vendor.discount && (
                  <div className="alert alert-warning py-2 small">
                    🎉 {vendor.discount}
                  </div>
                )}

                <div className="mb-3">
                  <h6 className="small fw-bold">Popular Products:</h6>
                  <div className="d-flex flex-wrap gap-1">
                    {vendor.products.slice(0, 3).map((product, idx) => (
                      <span key={idx} className="badge bg-light text-dark small">
                        {product}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="card-footer bg-transparent">
                <div className="row g-2">
                  <div className="col-6">
                    <button
                      className="btn btn-outline-primary btn-sm w-100"
                      onClick={() => window.open(`mailto:${vendor.contact}`, '_blank')}
                    >
                      📧 Contact
                    </button>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-success btn-sm w-100"
                      onClick={() => window.open(`https://${vendor.website}`, '_blank')}
                    >
                      🌐 Visit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredVendors.length === 0 && (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem' }}>🔍</div>
          <h4 className="text-muted">No vendors found</h4>
          <p className="text-muted">Try adjusting your search or filter criteria</p>
          <button
            className="btn btn-primary"
            onClick={() => {
              setSearchTerm('');
              setFilter('all');
            }}
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Join as Vendor CTA */}
      <div className="card mt-5 bg-light">
        <div className="card-body text-center">
          <h5 className="card-title">🤝 Want to join our marketplace?</h5>
          <p className="card-text">
            If you're an eco-friendly business owner, partner with us to reach more conscious consumers.
          </p>
          <button className="btn btn-success">
            Become a Partner Vendor
          </button>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
