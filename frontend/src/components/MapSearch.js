import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

function MapSearch() {
  const [location, setLocation] = useState('');
  const [results, setResults] = useState({ donors: [], blood_banks: [] });
  const [error, setError] = useState(null);
  const [mapCenter, setMapCenter] = useState([13.0827, 80.2707]); // Default: Chennai
  const [donorCoords, setDonorCoords] = useState([]);
  const mapRef = useRef();

  // Geocode location using Nominatim
  const geocodeLocation = async (address) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: `${address}, Tamil Nadu, India`,
          format: 'json',
          limit: 1,
        },
      });
      if (response.data.length > 0) {
        return {
          lat: parseFloat(response.data[0].lat),
          lng: parseFloat(response.data[0].lon),
        };
      }
      return null;
    } catch (err) {
      console.error('Geocoding error:', err);
      return null;
    }
  };

  // Handle location input change
  const handleChange = (e) => {
    setLocation(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!location.trim()) {
      setError('Please enter a location in Tamil Nadu (e.g., Chennai, Coimbatore).');
      return;
    }

    try {
      setError(null);
      const response = await axios.post('http://localhost:5000/api/nearby', { location }, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Nearby results:', response.data);
      setResults(response.data);

      // Geocode donor locations
      const coordsPromises = response.data.donors.map(async (donor) => {
        const coords = await geocodeLocation(donor.contact);
        return coords ? { ...donor, lat: coords.lat, lng: coords.lng } : null;
      });
      const coordsResults = (await Promise.all(coordsPromises)).filter(coord => coord);
      setDonorCoords(coordsResults);

      // Update map center
      let newCenter = [13.0827, 80.2707]; // Default: Chennai
      if (response.data.blood_banks.length > 0) {
        newCenter = [response.data.blood_banks[0].lat, response.data.blood_banks[0].lng];
      } else if (coordsResults.length > 0) {
        newCenter = [coordsResults[0].lat, coordsResults[0].lng];
      } else {
        const locationCoords = await geocodeLocation(location);
        if (locationCoords) newCenter = [locationCoords.lat, locationCoords.lng];
      }
      setMapCenter(newCenter);

      // Update map view
      if (mapRef.current) {
        mapRef.current.setView(newCenter, 10);
      }
    } catch (err) {
      console.error('Error fetching nearby data:', err);
      setError('Failed to fetch nearby data. Please try again.');
    }
  };

  // Custom CSS
  const customStyles = `
    .map-search-container {
      padding: 40px 0;
      background: #f8f9fa;
    }
    .map-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .main-content {
      max-width: 1000px;
      margin: 0 auto;
    }
    .section-title {
      color: #6b48ff;
      font-weight: 600;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .leaflet-container {
      height: 400px;
      width: 100%;
      border-radius: 10px;
      margin-bottom: 20px;
    }
    .results-table {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    .table th {
      background-color: #6b48ff;
      color: white;
    }
    .form-group label {
      font-weight: 500;
      color: #333;
    }
    .btn-custom {
      background: #ff6b6b;
      color: white;
      border: none;
    }
    .btn-custom:hover {
      background: #e65b5b;
    }
    .alert-error {
      background-color: #f8d7da;
      color: #721c24;
      border: 1px solid #f5c6cb;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
    }
    .footer-bg {
      background: #2c2c2c;
      color: #f8f9fa;
      padding: 20px 0;
    }
    .footer-bg a {
      color: #ff6b6b;
      text-decoration: none;
    }
    .footer-bg a:hover {
      text-decoration: underline;
    }
  `;

  return (
    <div className="min-vh-100">
      {/* Custom CSS */}
      <style>{customStyles}</style>

      {/* Header */}
      <header className="map-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Find Nearby Blood Donors & Banks</h1>
          <p className="lead">
            Enter your location in Tamil Nadu to find nearby donors and blood banks.
          </p>
        </div>
      </header>

      {/* Map Search Content */}
      <div className="map-search-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              {/* Location Input Form */}
              <h2 className="section-title">1. Enter Your Location</h2>
              <form onSubmit={handleSubmit} className="mb-4">
                <div className="form-group mb-3">
                  <label htmlFor="location">City or Address (Tamil Nadu)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={location}
                    onChange={handleChange}
                    placeholder="e.g., Chennai, Coimbatore"
                    required
                  />
                </div>
                <button type="submit" className="btn btn-custom">Find Nearby</button>
                {error && <div className="alert-error">{error}</div>}
              </form>

              {/* Map */}
              <h2 className="section-title">2. Map View</h2>
              <MapContainer
                center={mapCenter}
                zoom={10}
                style={{ height: '400px', width: '100%' }}
                whenCreated={(mapInstance) => { mapRef.current = mapInstance; }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {donorCoords.map((donor, index) => (
                  <Marker
                    key={`donor-${index}`}
                    position={[donor.lat, donor.lng]}
                    icon={L.icon({
                      iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                      shadowSize: [41, 41],
                    })}
                  >
                    <Popup>
                      <b>Donor: {donor.name}</b><br />
                      Blood Type: {donor.bloodType}<br />
                      Contact: {donor.contact}
                    </Popup>
                  </Marker>
                ))}
                {results.blood_banks.map((bb, index) => (
                  <Marker
                    key={`bb-${index}`}
                    position={[bb.lat, bb.lng]}
                    icon={L.icon({
                      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
                      iconSize: [25, 41],
                      iconAnchor: [12, 41],
                      popupAnchor: [1, -34],
                      shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
                      shadowSize: [41, 41],
                    })}
                  >
                    <Popup>
                      <b>{bb.name}</b><br />
                      Address: {bb.address}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>

              {/* Results */}
              <h2 className="section-title">3. Nearby Donors</h2>
              <div className="results-table">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Contact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.donors.length > 0 ? (
                      results.donors.map((donor) => (
                        <tr key={donor.id}>
                          <td>{donor.id}</td>
                          <td>{donor.name}</td>
                          <td>{donor.bloodType}</td>
                          <td>{donor.contact}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No donors found nearby.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              <h2 className="section-title">4. Nearby Blood Banks & Hospitals</h2>
              <div className="results-table">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.blood_banks.length > 0 ? (
                      results.blood_banks.map((bb, index) => (
                        <tr key={index}>
                          <td>{bb.name}</td>
                          <td>{bb.address}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="2">No blood banks found nearby.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-bg">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} Vital Flow. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/" className="me-3">Home</Link>
            <Link to="/about">About Us</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/contact">Contact Us</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MapSearch;