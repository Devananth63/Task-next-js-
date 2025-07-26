"use client";

import Link from "next/link";

export default function Home() {
  const handleFeatureClick = (feature) => {
    switch(feature) {
      case 'task-management':
        // Navigate to task management page
        window.location.href = '/task-management';
        break;
      case 'time-tracking':
        // Navigate to time tracking page
        window.location.href = '/time-tracking';
        break;
      case 'progress-monitoring':
        // Navigate to progress monitoring page
        window.location.href = '/progress-monitoring';
        break;
      default:
        break;
    }
  };

  return (
    <div className="home-container">
      <div className="hero-section">
        <h1 className="main-title">Internal Task Assignment Tool</h1>
        <p className="subtitle">Streamline your workflow with efficient task management</p>
      </div>
      
      <div className="cards-container">
        <div className="card admin-card">
          <div className="card-icon">👨‍💼</div>
          <h2>Admin Panel</h2>
          <p>Manage tasks, users, and monitor progress</p>
          <div className="card-buttons">
            <Link href="/login">
              <button className="btn-primary">Login</button>
            </Link>
            <Link href="/adminRegister">
              <button className="btn-secondary">Register</button>
            </Link>
          </div>
        </div>

        <div className="card user-card">
          <div className="card-icon">👤</div>
          <h2>User Portal</h2>
          <p>View tasks, update status, and track deadlines</p>
          <div className="card-buttons">
            <Link href="/userLogin">
              <button className="btn-primary">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn-secondary">Register</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-box clickable" onClick={() => handleFeatureClick('task-management')}>
            <div className="feature-icon">📋</div>
            <h3>Task Management</h3>
            <p>Create, assign, and track tasks efficiently</p>
            <div className="feature-hint">Click to access →</div>
          </div>
          <div className="feature-box clickable" onClick={() => handleFeatureClick('time-tracking')}>
            <div className="feature-icon">⏰</div>
            <h3>Time Tracking</h3>
            <p>Monitor deadlines and time remaining</p>
            <div className="feature-hint">Click to access →</div>
          </div>
          <div className="feature-box clickable" onClick={() => handleFeatureClick('progress-monitoring')}>
            <div className="feature-icon">📊</div>
            <h3>Progress Monitoring</h3>
            <p>Real-time status updates and reporting</p>
            <div className="feature-hint">Click to access →</div>
          </div>
        </div>
      </div>
    </div>
  );
}
