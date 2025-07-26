"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    durationHours: 1,
    startDateTime: new Date().toISOString().slice(0, 16)
  });

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

  const handleCreateTask = async (e) => {
    e.preventDefault();
    
    if (!newTask.assignedTo) {
      alert('Please select a user to assign the task to');
      return;
    }

    try {
      const assignedAt = new Date(newTask.startDateTime);
      const dueAt = new Date(assignedAt.getTime() + newTask.durationHours * 60 * 60 * 1000);
      
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTask.title,
          description: newTask.description,
          assignedTo: newTask.assignedTo,
          status: 'pending',
          assignedAt: assignedAt.toISOString(),
          durationHours: newTask.durationHours,
          dueAt: dueAt.toISOString()
        })
      });

      if (response.ok) {
        setNewTask({
          title: '',
          description: '',
          assignedTo: '',
          durationHours: 1,
          startDateTime: new Date().toISOString().slice(0, 16)
        });
        setShowCreateForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const deleteTask = async (taskId) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await fetch(`/api/tasks/${taskId}`, {
          method: 'DELETE'
        });
        fetchData();
      } catch (error) {
        console.error('Error deleting task:', error);
      }
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

  if (loading) {
    return (
      <div className="container">
        <h1>Task Management Dashboard</h1>
        <p>Loading data...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header-section">
        <h1>📋 Task Management Dashboard</h1>
        <p>Create, assign, and manage tasks efficiently</p>
        <div className="header-buttons">
          <button 
            className="btn-primary" 
            onClick={() => setShowCreateForm(!showCreateForm)}
          >
            {showCreateForm ? 'Cancel' : '+ Create New Task'}
          </button>
          <Link href="/">
            <button className="btn-secondary">← Back to Home</button>
          </Link>
        </div>
      </div>

      {showCreateForm && (
        <div className="create-task-form">
          <h2>Create New Task</h2>
          <form onSubmit={handleCreateTask}>
            <input
              type="text"
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Task Description"
              value={newTask.description}
              onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              required
            />
            <select
              value={newTask.assignedTo}
              onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
              required
            >
              <option value="">Select User to Assign</option>
              {users.map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
            <div className="form-row">
              <div className="form-group">
                <label>Start Date & Time:</label>
                <input
                  type="datetime-local"
                  value={newTask.startDateTime}
                  onChange={(e) => setNewTask({...newTask, startDateTime: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Duration (hours):</label>
                <input
                  type="number"
                  min="1"
                  value={newTask.durationHours}
                  onChange={(e) => setNewTask({...newTask, durationHours: Number(e.target.value)})}
                  required
                />
              </div>
            </div>
            <button type="submit" className="btn-primary">Create Task</button>
          </form>
        </div>
      )}

      <div className="tasks-section">
        <h2>All Tasks</h2>
        {tasks.length === 0 ? (
          <div className="no-tasks">
            <p>No tasks found. Create your first task to get started.</p>
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

                <div className="task-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => deleteTask(task._id)}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 