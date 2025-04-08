import React from 'react';
import { Link } from 'react-router-dom'; // Use Link for client-side navigation

// Inline script to load Bootstrap via CDN
const styleScript = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

// Add this script to the document head (only once, for demo purposes)
if (document.head.innerHTML.indexOf('bootstrap.min.css') === -1) {
  document.head.insertAdjacentHTML('beforeend', styleScript);
}

function Home({ isAuthenticated, username }) { // Accept isAuthenticated and username as props
  // Custom CSS (embedded in a <style> tag for this example)
  const customStyles = `
    .hero-bg {
      background: linear-gradient(135deg, #ff6b6b, #4ecdc4);
      color: white;
      padding: 100px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .card-custom {
      transition: transform 0.3s, box-shadow 0.3s;
    }
    .card-custom:hover {
      transform: translateY(-10px);
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
    }
    .cta-bg {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 50px 0;
      border-radius: 15px;
    }
    .footer-bg {
      background: #2c2c2c;
      color: #f8f9fa;
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

      {/* Hero Section */}
      <section className="hero-bg text-center">
        <div className="container">
          <h1 className="display-3 fw-bold">
            Welcome {isAuthenticated ? username : 'to Blood Bank'}
          </h1>
          <p className="lead mb-4">
            Saving lives, one donation at a time. Join us in our mission to ensure a steady blood supply for all!
          </p>
          <a href="#services" className="btn btn-light btn-lg shadow-sm">
            Discover Our Services
          </a>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5 text-primary">Our Life-Saving Services</h2>
          <div className="row g-4">
            {/* Donor Registration */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-person-plus-fill display-4 text-danger mb-3"></i>
                  <h4 className="card-title">Donor Registration</h4>
                  <p className="card-text">
                    Register as a donor with your details and blood type to contribute to our cause.
                  </p>
                </div>
              </div>
            </div>

            {/* Blood Stock Management */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-droplet-fill display-4 text-success mb-3"></i>
                  <h4 className="card-title">Blood Stock Management</h4>
                  <p className="card-text">
                    Track real-time blood stock levels by type to meet emergency needs efficiently.
                  </p>
                </div>
              </div>
            </div>

            {/* Request Management */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-clipboard-check display-4 text-warning mb-3"></i>
                  <h4 className="card-title">Request Management</h4>
                  <p className="card-text">
                    Process and deliver blood requests from hospitals and patients seamlessly.
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Alerts */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-bell-fill display-4 text-info mb-3"></i>
                  <h4 className="card-title">Emergency Alerts</h4>
                  <p className="card-text">
                    Get notified for urgent blood needs and coordinate with donors quickly.
                  </p>
                </div>
              </div>
            </div>

            {/* Blood Testing */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-shield-fill-check display-4 text-primary mb-3"></i>
                  <h4 className="card-title">Blood Testing</h4>
                  <p className="card-text">
                    Ensure safety with thorough testing for diseases and compatibility.
                  </p>
                </div>
              </div>
            </div>

            {/* Donor Campaigns */}
            <div className="col-md-4">
              <div className="card card-custom h-100">
                <div className="card-body text-center">
                  <i className="bi bi-people-fill display-4 text-secondary mb-3"></i>
                  <h4 className="card-title">Donor Campaigns</h4>
                  <p className="card-text">
                    Participate in or organize drives to boost community donations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-bg my-5">
        <div className="container text-center">
          <h2 className="h3 mb-3">Be a Hero—Donate Today!</h2>
          <p className="mb-4">
            Every drop of blood can save a life. Register as a donor or request assistance now.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <Link to="/" className="btn btn-outline-light btn-lg shadow-sm">
              Become a Donor
            </Link>
            <Link to="/" className="btn btn-outline-light btn-lg shadow-sm">
              Request Blood
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-bg py-4">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} Blood Bank Management System. All rights reserved.</p>
          <div className="mt-2">
            <Link to="/contact" className="me-3">
              Contact Us
            </Link>
            <Link to="/privacy">
              Privacy Policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;