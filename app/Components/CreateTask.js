"use client";
import { useEffect, useState } from "react";

export default function CreateTask({ users, onCreate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [assignedTo, setAssignedTo] = useState([]);
  const [durationHours, setDurationHours] = useState(1);
  const [startDateTime, setStartDateTime] = useState(() => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  });

  useEffect(() => {
    if (users.length > 0 && assignedTo.length === 0) {
      setAssignedTo([users[0]._id]);
    }
  }, [users]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const assignedAt = new Date(startDateTime);
    const dueAt = new Date(assignedAt.getTime() + durationHours * 60 * 60 * 1000);
    assignedTo.forEach(userId => {
      onCreate({
        title,
        description,
        assignedTo: userId,
        status: "pending",
        assignedAt: assignedAt.toISOString(),
        durationHours,
        dueAt: dueAt.toISOString()
      });
    });
    setTitle("");
    setDescription("");
    setDurationHours(1);
    setAssignedTo([]);
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    setStartDateTime(now.toISOString().slice(0, 16));
  };

  return (
    <div className="container">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Task Description"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />
        <label style={{ color: '#fff', marginBottom: 4 }}>Assign To (hold Ctrl/Cmd to select multiple):</label>
        <select
          multiple
          value={assignedTo}
          onChange={e => {
            const options = Array.from(e.target.selectedOptions, option => option.value);
            setAssignedTo(options);
          }}
          required
        >
          {users.map(user => (
            <option key={user._id} value={user._id}>
              {user.name} ({user.email})
            </option>
          ))}
        </select>
        <label style={{ color: '#fff', marginBottom: 4 }}>Start Date & Time:</label>
        <input
          type="datetime-local"
          value={startDateTime}
          onChange={e => setStartDateTime(e.target.value)}
          required
        />
        <input
          type="number"
          min="1"
          value={durationHours}
          onChange={e => setDurationHours(Number(e.target.value))}
          placeholder="Duration (hours)"
          required
        />
        <button type="submit">Create</button>
      </form>
    </div>
  );
}
