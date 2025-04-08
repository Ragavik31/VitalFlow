import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2'; // Import Bar chart
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'; // Register Chart.js components

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Inline script to load Bootstrap via CDN
const styleScript = `
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
`;

if (document.head.innerHTML.indexOf('bootstrap.min.css') === -1) {
  document.head.insertAdjacentHTML('beforeend', styleScript);
}

function Dashboard({ username }) {
  // State for dashboard data
  const [donorsCount, setDonorsCount] = useState(0);
  const [receiversCount, setReceiversCount] = useState(0);
  const [donors, setDonors] = useState([]); // Full donor list
  const [receivers, setReceivers] = useState([]); // Full receiver list
  const [chartData, setChartData] = useState({});

  // Fetch data from backend
  useEffect(() => {
    // Fetch donors
    axios.get('http://localhost:5000/api/donors')
      .then(response => {
        console.log('Donors fetched:', response.data);
        setDonorsCount(response.data.length);
        setDonors(response.data);

        // Process donor data for chart
        const donorBloodTypes = response.data.reduce((acc, donor) => {
          acc[donor.bloodType] = (acc[donor.bloodType] || 0) + 1;
          return acc;
        }, {});
        
        // Fetch receivers
        axios.get('http://localhost:5000/api/receivers')
          .then(res => {
            console.log('Receivers fetched:', res.data);
            setReceiversCount(res.data.length);
            setReceivers(res.data);

            // Process receiver data for chart
            const receiverBloodTypes = res.data.reduce((acc, receiver) => {
              acc[receiver.bloodType] = (acc[receiver.bloodType] || 0) + 1;
              return acc;
            }, {});

            // Prepare chart data
            const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            const donorCounts = bloodTypes.map(type => donorBloodTypes[type] || 0);
            const receiverCounts = bloodTypes.map(type => receiverBloodTypes[type] || 0);

            setChartData({
              labels: bloodTypes,
              datasets: [
                {
                  label: 'Blood Donated',
                  data: donorCounts,
                  backgroundColor: 'rgba(255, 107, 107, 0.6)', // Red shade
                  borderColor: 'rgba(255, 107, 107, 1)',
                  borderWidth: 1,
                },
                {
                  label: 'Blood Received',
                  data: receiverCounts,
                  backgroundColor: 'rgba(107, 72, 255, 0.6)', // Purple shade
                  borderColor: 'rgba(107, 72, 255, 1)',
                  borderWidth: 1,
                },
              ],
            });
          })
          .catch(error => {
            console.error('Error fetching receivers:', error);
          });
      })
      .catch(error => {
        console.error('Error fetching donors:', error);
      });
  }, []);

  // Chart options
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Blood Donation and Reception Frequency by Blood Type',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Count',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Blood Type',
        },
      },
    },
  };

  // Custom CSS
  const customStyles = `
    .dashboard-header {
      background: linear-gradient(135deg, #6b48ff, #ff6b6b);
      color: white;
      padding: 60px 0;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    .dashboard-container {
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
    .summary-card {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 20px;
    }
    .recent-table {
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
    .chart-container {
      background: #f8f9fa;
      padding: 20px;
      border-radius: 10px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
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
      <header className="dashboard-header text-center">
        <div className="container">
          <h1 className="display-4 fw-bold">Dashboard</h1>
          <p className="lead">
            Welcome, {username}! This is our VitalFlow contributions here.
          </p>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="dashboard-container">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 main-content">
              {/* Summary Section */}
              <h2 className="section-title">1. Your Summary</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="summary-card">
                    <h3>Total Donors</h3>
                    <p className="display-6">{donorsCount}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="summary-card">
                    <h3>Total Receivers</h3>
                    <p className="display-6">{receiversCount}</p>
                  </div>
                </div>
              </div>

              {/* Blood Donation and Reception Graph */}
              <h2 className="section-title">2. Blood Donation and Reception Frequency</h2>
              <div className="chart-container">
                {chartData.labels ? (
                  <Bar data={chartData} options={chartOptions} />
                ) : (
                  <p>Loading chart data...</p>
                )}
              </div>

              {/* Full Donors List */}
              <h2 className="section-title">3. All Donors</h2>
              <div className="recent-table">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Last Donation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donors.length > 0 ? (
                      donors.map((donor) => (
                        <tr key={donor.id}>
                          <td>{donor.id}</td>
                          <td>{donor.name}</td>
                          <td>{donor.bloodType}</td>
                          <td>{donor.lastDonation || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No donors found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Full Receivers List */}
              <h2 className="section-title">4. All Receivers</h2>
              <div className="recent-table">
                <table className="table table-striped table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Blood Type</th>
                      <th>Last Received</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivers.length > 0 ? (
                      receivers.map((receiver) => (
                        <tr key={receiver.id}>
                          <td>{receiver.id}</td>
                          <td>{receiver.name}</td>
                          <td>{receiver.bloodType}</td>
                          <td>{receiver.lastReceived || 'N/A'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4">No receivers found.</td>
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

export default Dashboard;