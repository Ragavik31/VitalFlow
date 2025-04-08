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

function Privacy() {
  // Custom CSS (embedded in a <style> tag for this example)
  const customStyles = `
    .privacy-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .privacy-container {
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
      <header className="privacy-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Privacy Policy</h1>
          <p className="lead">
            Learn how we protect your personal information at Vital Flow.
          </p>
        </div>
      </header>

      {/* Privacy Policy Content */}
      <div className="privacy-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              <p className="text-muted mb-4">
                Last Updated: {new Date().toLocaleDateString()}
              </p>

              {/* Introduction */}
              <h2 id="introduction" className="section-title">1. Introduction</h2>
              <p>
                At Vital Flow, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website or services. By accessing or using our platform, you agree to the terms outlined here.
              </p>

              {/* Data Collection */}
              <h2 id="data-collection" className="section-title">2. Information We Collect</h2>
              <p>
                We may collect the following types of information:
                <ul className="list-unstyled mt-2">
                  <li><i className="bi bi-check-circle text-success me-2"></i>Personal Information (e.g., name, email, phone number, blood type) provided during donor registration.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Usage Data (e.g., IP address, browser type) collected automatically.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Request Details (e.g., blood type needed, location) from hospitals or patients.</li>
                </ul>
              </p>

              {/* How We Use Your Information */}
              <h2 id="data-usage" className="section-title">3. How We Use Your Information</h2>
              <p>
                Your information is used to:
                <ul className="list-unstyled mt-2">
                  <li><i className="bi bi-check-circle text-success me-2"></i>Manage donor registrations and blood donations.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Process and fulfill blood requests.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Send emergency alerts and campaign notifications.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Improve our services and ensure security.</li>
                </ul>
              </p>

              {/* Data Security */}
              <h2 id="data-security" className="section-title">4. Data Security</h2>
              <p>
                We implement robust security measures, including encryption and secure servers, to protect your data from unauthorized access, alteration, or disclosure. However, no online system is 100% secure, and we cannot guarantee absolute protection.
              </p>

              {/* User Rights */}
              <h2 id="user-rights" className="section-title">5. Your Rights</h2>
              <p>
                You have the right to:
                <ul className="list-unstyled mt-2">
                  <li><i className="bi bi-check-circle text-success me-2"></i>Access, update, or delete your personal information.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>Opt out of marketing communications.</li>
                  <li><i className="bi bi-check-circle text-success me-2"></i>File a complaint with a regulatory authority if needed.</li>
                </ul>
                To exercise these rights, contact us at <a href="mailto:vitalflow@bloodbank.com">vitalflow@bloodbank.com</a>.
              </p>

              {/* Changes to Policy */}
              <h2 id="changes" className="section-title">6. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy periodically. Any changes will be posted here with an updated "Last Updated" date. We encourage you to review this page regularly.
              </p>
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
            <a href="/contact">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Privacy;