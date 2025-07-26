"use client";
import { useEffect, useState } from "react";
import CreateTask from "../Components/CreateTask";
import LogoutButton from "../Components/LogoutButton";
import TaskTable from "../Components/TaskTable";

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [message, setMessage] = useState("");
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    fetch("/api/users")
      .then(res => res.json())
      .then(data => setUsers(data));
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    fetch("/api/tasks")
      .then(res => res.json())
      .then(data => setTasks(data));
  };

  const handleCreateTask = async (task) => {
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      setMessage("Task created!");
      fetchTasks();
    } else {
      setMessage("Failed to create task.");
    }
  };

  const handleDeleteTask = async (id) => {
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    fetchTasks();
  };

  const handleEditTask = (task) => {
    setEditTask(task);
  };

  const handleUpdateTask = async (task) => {
    const res = await fetch(`/api/tasks/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: task.title,
        description: task.description,
        assignedTo: task.assignedTo,
        status: task.status,
      }),
    });
    if (res.ok) {
      setEditTask(null);
      fetchTasks();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Admin Dashboard</h2>
        <LogoutButton />
      </div>
      <CreateTask users={users} onCreate={handleCreateTask} />
      {message && <p>{message}</p>}
      <TaskTable
        tasks={tasks}
        users={users}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        editTask={editTask}
        onSaveEdit={handleUpdateTask}
        onCancelEdit={() => setEditTask(null)}
      />
    </div>
  );
}

// EditTaskForm is now used inside TaskTable for inline editing
