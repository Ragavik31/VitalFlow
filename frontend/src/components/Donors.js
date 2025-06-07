import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Inline script to load Bootstrap via CDN
const styleScript = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

if (document.head.innerHTML.indexOf('bootstrap.min.css') === -1) {
  document.head.insertAdjacentHTML('beforeend', styleScript);
}

function Donors() {
  const [donors, setDonors] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    bloodType: '',
    contact: '',
    city: '', // New field
    lastDonation: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // List of major cities in Tamil Nadu for the dropdown
  const tamilNaduCities = [
    'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Vellore', 'Erode', 
    'Thoothukudi', 'Dindigul', 'Thanjavur', 'Karur', 'Nagercoil', 'Kanyakumari', 'Kanchipuram', 
    'Namakkal', 'Sivakasi', 'Virudhunagar', 'Cuddalore', 'Tiruppur'
  ];

  useEffect(() => {
    axios.get('http://localhost:5000/api/donors')
      .then(response => {
        console.log('Donors fetched:', response.data);
        setDonors(response.data);
      })
      .catch(error => {
        console.error('Error fetching donors:', error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      console.log('Form validation failed:', formData);
      return;
    }

    if (!formData.name || !formData.bloodType || !formData.contact || !formData.city) {
      setSubmitStatus('error');
      console.log('Missing required fields:', formData);
      return;
    }

    try {
      console.log('Submitting donor data:', formData);
      const response = await axios.post('http://localhost:5000/api/donors', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Server response:', response.data);
      setSubmitStatus('success');
      setFormData({ name: '', bloodType: '', contact: '', city: '', lastDonation: '' });
      const newResponse = await axios.get('http://localhost:5000/api/donors');
      setDonors(newResponse.data);
    } catch (error) {
      console.error('Error adding donor:', error.response ? error.response.data : error.message);
      setSubmitStatus('error');
    }
  };

  const customStyles = `
    .donors-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .donors-container {
      padding: 40px 0;
    }
    .main-content {
      padding: 20px;
      max-width: 1000px;
      margin: 0 auto;
    }
    .section-title {
      color: #6b48ff;
      font-weight: 600;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .donor-table {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }
    .table th {
      background-color: #6b48ff;
      color: white;
    }
    .table td {
      vertical-align: middle;
    }
    .donor-form {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
      color: white;
    }
    .alert-success {
      background-color: #d4edda;
      color: #155724;
      border: 1px solid #c3e6cb;
      padding: 10px;
      margin-top: 10px;
      border-radius: 5px;
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
      <style>{customStyles}</style>

      <header className="donors-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Donors</h1>
          <p className="lead">
            Meet the generous donors supporting Vital Flow’s mission.
          </p>
        </div>
      </header>

      <div className="donors-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              <h2 className="section-title">1. Our Donors</h2>
              <div className="donor-table">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Contact</th>
                      <th>City</th>
                      <th>Last Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.map((donor) => (
                      <tr key={donor.id}>
                        <td>{donor.id}</td>
                        <td>{donor.name}</td>
                        <td>{donor.bloodType}</td>
                        <td>{donor.contact}</td>
                        <td>{donor.city || 'N/A'}</td>
                        <td>{donor.lastDonation || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="section-title">2. Add New Donor</h2>
              <div className="donor-form">
                <form className="needs-validation" noValidate onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">Please enter the donor's name.</div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="bloodType">Blood Type</label>
                    <select
                      className="form-control"
                      id="bloodType"
                      name="bloodType"
                      value={formData.bloodType}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                    <div className="invalid-feedback">Please select a blood type.</div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="contact">Contact</label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact"
                      name="contact"
                      value={formData.contact}
                      onChange={handleChange}
                      required
                    />
                    <div className="invalid-feedback">Please enter a contact number or email.</div>
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="city">City (Tamil Nadu)</label>
                    <select
                      className="form-control"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select City</option>
                      {tamilNaduCities.map((city) => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <div className="invalid-feedback">Please select a city in Tamil Nadu.</div>
                  </div>
                  <div className="form-group mb-4">
                    <label htmlFor="lastDonation">Last Donation (Optional)</label>
                    <input
                      type="date"
                      className="form-control"
                      id="lastDonation"
                      name="lastDonation"
                      value={formData.lastDonation}
                      onChange={handleChange}
                    />
                  </div>
                  <button type="submit" className="btn btn-custom">
                    Add Donor
                  </button>
                  {submitStatus === 'success' && (
                    <div className="alert-success mt-3">Donor added successfully!</div>
                  )}
                  {submitStatus === 'error' && (
                    <div className="alert-error mt-3">Failed to add donor. Please try again.</div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer-bg">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} Vital Flow. All rights reserved.</p>
          <div className="mt-2">
            <a href="/" className="me-3">Home</a>
            <a href="/about">About Us</a>
            <a href="/privacy">Privacy Policy</a>
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Donors;