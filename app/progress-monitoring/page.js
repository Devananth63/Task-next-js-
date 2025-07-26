"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProgressMonitoring() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksResponse, usersResponse] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/users')
      ]);
      
      const tasksData = await tasksResponse.json();
      const usersData = await usersResponse.json();
      
      setTasks(tasksData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTimeRemaining = (dueAt) => {
    if (!dueAt) return "No due time";
    
    const now = new Date();
    const due = new Date(dueAt);
    const diff = due - now;
    
    if (diff <= 0) return "Time Up";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours} hr${hours > 1 ? 's' : ''} left`;
    if (minutes > 0) return `${minutes} min${minutes > 1 ? 's' : ''} left`;
    return "Less than 1 min left";
  };

  const getStatusColor = (status, dueAt) => {
    if (status === "completed") return "status-complete";
    if (dueAt && new Date(dueAt) < new Date()) return "status-timeup";
    return "status-pending";
  };

  const getUserName = (userId) => {
    const user = users.find(u => u._id === userId);
    return user ? user.name : 'Unknown User';
  };

  const getCompletionRate = () => {
    if (tasks.length === 0) return 0;
    return Math.round((tasks.filter(t => t.status === 'completed').length / tasks.length) * 100);
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Progress Monitoring Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>📊 Progress Monitoring Dashboard</h1>
        <p>Track all tasks and team performance in real-time</p>
        <Link href="/">
          <button className="btn-secondary">← Back to Home</button>
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{tasks.filter(t => t.status === 'completed').length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{tasks.filter(t => t.status === 'pending').length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-box">
          <div className="stat-number">{getCompletionRate()}%</div>
          <div className="stat-label">Completion Rate</div>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${getCompletionRate()}%` }}
          ></div>
        </div>
        <p className="progress-text">Overall Progress: {getCompletionRate()}% Complete</p>
      </div>

      <div className="tasks-section">
        <h2>All Tasks Overview</h2>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Create some tasks to see progress.</p>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <div key={task._id} className={`task-card ${getStatusColor(task.status, task.dueAt)}`}>
                <div className="task-header">
                  <h3>{task.title}</h3>
                  <span className={`status-badge ${getStatusColor(task.status, task.dueAt)}`}>
                    {task.status === 'completed' ? '✅ Completed' : 
                     task.dueAt && new Date(task.dueAt) < new Date() ? '⏰ Time Up' : '⏳ Pending'}
                  </span>
                </div>
                
                <p className="task-description">{task.description}</p>
                
                <div className="task-details">
                  <div className="detail-item">
                    <strong>Assigned To:</strong> {getUserName(task.assignedTo)}
                  </div>
                  <div className="detail-item">
                    <strong>Assigned:</strong> {task.assignedAt ? new Date(task.assignedAt).toLocaleString() : 'Not set'}
                  </div>
                  <div className="detail-item">
                    <strong>Due:</strong> {task.dueAt ? new Date(task.dueAt).toLocaleString() : 'Not set'}
                  </div>
                  <div className="detail-item">
                    <strong>Time Remaining:</strong> 
                    <span className={getStatusColor(task.status, task.dueAt)}>
                      {getTimeRemaining(task.dueAt)}
                    </span>
                  </div>
                  {task.durationHours && (
                    <div className="detail-item">
                      <strong>Duration:</strong> {task.durationHours} hour{task.durationHours > 1 ? 's' : ''}
                    </div>
                  )}
                  {task.userMessage && (
                    <div className="detail-item">
                      <strong>User Message:</strong> {task.userMessage}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="users-section">
        <h2>Team Performance</h2>
        <div className="users-grid">
          {users.map((user) => {
            const userTasks = tasks.filter(t => t.assignedTo === user._id);
            const completedTasks = userTasks.filter(t => t.status === 'completed');
            const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;
            
            return (
              <div key={user._id} className="user-card">
                <div className="user-info">
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
                <div className="user-stats">
                  <div className="user-stat">
                    <span className="stat-label">Tasks Assigned:</span>
                    <span className="stat-value">{userTasks.length}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-label">Completed:</span>
                    <span className="stat-value">{completedTasks.length}</span>
                  </div>
                  <div className="user-stat">
                    <span className="stat-label">Completion Rate:</span>
                    <span className="stat-value">{completionRate}%</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 