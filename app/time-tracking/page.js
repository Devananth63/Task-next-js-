  "use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TimeTracking() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
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

  const markComplete = async (taskId) => {
    try {
      await fetch(`/api/tasks/${taskId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      fetchTasks(); // Refresh the list
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1>Time Tracking Dashboard</h1>
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>⏰ Time Tracking Dashboard</h1>
        <p>Monitor your tasks and deadlines in real-time</p>
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
          <div className="stat-number">{tasks.filter(t => t.dueAt && new Date(t.dueAt) < new Date()).length}</div>
          <div className="stat-label">Overdue</div>
        </div>
      </div>

      <div className="tasks-section">
        <h2>Your Tasks</h2>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Tasks will appear here when assigned.</p>
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
                </div>

                {task.status !== 'completed' && (
                  <button 
                    className="btn-primary"
                    onClick={() => markComplete(task._id)}
                    disabled={task.dueAt && new Date(task.dueAt) < new Date()}
                  >
                    {task.dueAt && new Date(task.dueAt) < new Date() ? 'Time Expired' : 'Mark Complete'}
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 