import styles from "./TaskTable.module.css";
import { useState } from "react";

// Inline edit form for editing a task in the table
function EditTaskForm({ task, users, onSave, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [assignedTo, setAssignedTo] = useState(task.assignedTo);
  const [status, setStatus] = useState(task.status);

  return (
    <>
      <td>
        <input value={title} onChange={e => setTitle(e.target.value)} required style={{ width: 100 }} />
      </td>
      <td>
        <input value={description} onChange={e => setDescription(e.target.value)} required style={{ width: 150 }} />
      </td>
      <td>
        <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)}>
          {users.map(user => (
            <option key={user._id} value={user._id}>{user.name}</option>
          ))}
        </select>
      </td>
      <td>
        <input value={task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "-"} disabled style={{ width: 160, background: '#333', color: '#fff', border: 'none', textAlign: 'center' }} />
      </td>
      <td>
        <input value={task.userMessage || '-'} disabled style={{ width: 180, background: '#333', color: '#fff', border: 'none', textAlign: 'center' }} />
      </td>
      <td>
        <select value={status} onChange={e => setStatus(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="complete">Completed</option>
        </select>
      </td>
      <td>
        <button className={styles.actionBtn} onClick={() => onSave({ ...task, title, description, assignedTo, status })} style={{ marginRight: 5 }}>Save</button>
        <button className={styles.actionBtn} onClick={onCancel}>Cancel</button>
      </td>
    </>
  );
}

function getTaskStatus(task) {
  if (task.status === "complete") return "Completed";
  if (!task.dueAt || !task.assignedAt) return "Pending";
  const now = new Date();
  const dueAt = new Date(task.dueAt);
  if (isNaN(dueAt.getTime())) return "Pending";
  if (now > dueAt) return "Time Up";
  const hoursLeft = (dueAt - now) / (1000 * 60 * 60);
  if (hoursLeft < 1) {
    const mins = Math.max(1, Math.floor((dueAt - now) / (1000 * 60)));
    return `Pending (${mins} min${mins !== 1 ? 's' : ''} left)`;
  }
  const rounded = Math.ceil(hoursLeft);
  return `Pending (${rounded} hr${rounded !== 1 ? 's' : ''} left)`;
}

export default function TaskTable({ tasks, users, onEdit, onDelete, editTask, onSaveEdit, onCancelEdit }) {
  // Helper to get user name by id
  const getUserName = (id) => {
    const user = users.find(u => u._id === id || u._id?.toString() === id?.toString());
    return user ? user.name : "Unknown";
  };

  return (
    <div className={styles.tableContainer}>
      <h3>All Tasks</h3>
      <table className={styles.taskTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Assigned To</th>
            <th>Assigned At</th>
            <th>User Message</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => {
            const now = new Date();
            const dueAt = new Date(task.dueAt);
            const isTimeUp = now > dueAt && task.status !== "complete";
            return (
              <tr key={task._id}>
                {editTask && editTask._id === task._id ? (
                  <EditTaskForm
                    task={editTask}
                    users={users}
                    onSave={onSaveEdit}
                    onCancel={onCancelEdit}
                  />
                ) : (
                  <>
                    <td>{task.title}</td>
                    <td>{task.description}</td>
                    <td>{getUserName(task.assignedTo)}</td>
                    <td>{task.assignedAt ? new Date(task.assignedAt).toLocaleString() : "-"}</td>
                    <td>{task.userMessage || '-'}</td>
                    <td>
                      <span className={
                        task.status === "complete"
                          ? styles["status-complete"]
                          : isTimeUp
                            ? styles["status-timeup"]
                            : styles["status-pending"]
                      }>
                        {getTaskStatus(task)}
                      </span>
                    </td>
                    <td>
                      <button
                        className={styles.actionBtn}
                        onClick={() => onEdit(task)}
                        disabled={isTimeUp || task.status === "complete"}
                      >Edit</button>
                      <button
                        className={`${styles.actionBtn} ${styles.deleteBtn}`}
                        onClick={() => onDelete(task._id)}
                        disabled={isTimeUp || task.status === "complete"}
                      >Delete</button>
                    </td>
                  </>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
