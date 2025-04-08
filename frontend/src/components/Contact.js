import React, { useState } from 'react';
import axios from 'axios';

// Inline script to load Bootstrap via CDN
const styleScript = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

// Add this script to the document head (only once, for demo purposes)
if (document.head.innerHTML.indexOf('bootstrap.min.css') === -1) {
  document.head.insertAdjacentHTML('beforeend', styleScript);
}

function Contact() {
  // State for form fields and submission status
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/messages', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error saving message:', error);
    }
  };

  // Custom CSS (embedded in a <style> tag for this example)
  const customStyles = `
    .contact-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .contact-container {
      padding: 40px 0;
    }
    .main-content {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .section-title {
      color: #6b48ff;
      font-weight: 600;
      margin-top: 30px;
      margin-bottom: 10px;
    }
    .contact-info {
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
      {/* Custom CSS */}
      <style>{customStyles}</style>

      {/* Header Section */}
      <header className="contact-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Contact Us</h1>
          <p className="lead">
            Get in touch with Vital Flow for support or inquiries.
          </p>
        </div>
      </header>

      {/* Contact Content */}
      <div className="contact-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              {/* Contact Information */}
              <h2 className="section-title">1. How to Contact Us</h2>
              <div className="contact-info mb-5">
                <p><i className="bi bi-geo-alt-fill me-2 text-primary"></i>Address: 123 Vital Flow Lane, Health City, HC 45678</p>
                <p><i className="bi bi-envelope-fill me-2 text-primary"></i>Email: <a href="mailto:vitalflow@bloodbank.com">vitalflow@bloodbank.com</a></p>
                <p><i className="bi bi-telephone-fill me-2 text-primary"></i>Phone: +1-800-VITALFLOW (848-2536)</p>
                <p><i className="bi bi-clock-fill me-2 text-primary"></i>Open 24 Hours</p>
              </div>

              {/* Contact Form */}
              <h2 className="section-title">2. Send Us a Message</h2>
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
                  <div className="invalid-feedback">Please enter your name.</div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a valid email.</div>
                </div>
                <div className="form-group mb-3">
                  <label htmlFor="subject">Subject</label>
                  <input
                    type="text"
                    className="form-control"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                  <div className="invalid-feedback">Please enter a subject.</div>
                </div>
                <div className="form-group mb-4">
                  <label htmlFor="message">Message</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    required
                  ></textarea>
                  <div className="invalid-feedback">Please enter your message.</div>
                </div>
                <button type="submit" className="btn btn-custom">
                  Submit
                </button>
                {submitStatus === 'success' && (
                  <div className="alert-success mt-3">Message sent successfully!</div>
                )}
                {submitStatus === 'error' && (
                  <div className="alert-error mt-3">Failed to send message. Please try again.</div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-bg">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} Vital Flow. All rights reserved.</p>
          <div className="mt-2">
            <a href="/" className="me-3">Home</a>
            <a href="/privacy">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Contact;