import React from 'react';

// Inline script to load Bootstrap via CDN
const styleScript = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

// Add this script to the document head (only once, for demo purposes)
if (document.head.innerHTML.indexOf('bootstrap.min.css') === -1) {
  document.head.insertAdjacentHTML('beforeend', styleScript);
}

function About() {
  // Custom CSS (embedded in a <style> tag for this example)
  const customStyles = `
    .about-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .about-container {
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
    .about-info {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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
      <header className="about-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">About Us</h1>
          <p className="lead">
            Learn more about Vital Flow and our mission to save lives.
          </p>
        </div>
      </header>

      {/* About Content */}
      <div className="about-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              {/* Mission */}
              <h2 className="section-title">1. Our Mission</h2>
              <div className="about-info mb-5">
                <p>
                  At Vital Flow, our mission is to ensure a steady and safe blood supply for communities in need. We strive to connect donors with recipients, streamline blood management, and promote life-saving donations through innovative technology and community engagement.
                </p>
              </div>

              {/* History */}
              <h2 className="section-title">2. Our History</h2>
              <div className="about-info mb-5">
                <p>
                  Founded in 2015, Vital Flow began as a small initiative to address blood shortages in Health City. Over the years, we have grown into a trusted organization, serving thousands of patients and partnering with hospitals and donors across the region.
                </p>
              </div>

              {/* Our Team */}
              <h2 className="section-title">3. Our Team</h2>
              <div className="about-info">
                <p>
                  Our dedicated team includes medical professionals, IT experts, and community outreach specialists. Led by Dr. Jane Doe, our staff works tirelessly to ensure every drop of blood reaches those who need it most.
                </p>
                <ul className="list-unstyled mt-2">
                  <li><i className="bi bi-person-fill me-2 text-primary"></i>Dr. Jane Doe - Chief Medical Officer</li>
                  <li><i className="bi bi-person-fill me-2 text-primary"></i>John Smith - IT Lead</li>
                  <li><i className="bi bi-person-fill me-2 text-primary"></i>Sarah Lee - Community Coordinator</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer-bg">
        <div className="container text-center">
          <p>© {new Date().getFullYear()} Vital Flow. All rights reserved.</p>
          <div className="mt-2"><p>
            <a href="/" className="me-3">Home  </a> <a href="/privacy">Privacy Policy  </a>  <a href="/contact">Contact Us</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default About;