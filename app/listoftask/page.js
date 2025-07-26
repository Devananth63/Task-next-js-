"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ListOfTaskPage() {
  const router = useRouter();
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (userId) {
      fetch(`/api/tasks?userId=${userId}`)
        .then(res => res.json())
        .then(data => setTasks(data));
    }
  }, [userId]);

  const markComplete = async (taskId) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "complete" }),
    });
    setTasks(tasks.map(t => t._id === taskId ? { ...t, status: "complete" } : t));
  };

  // Logout function
  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.clear();
    }
    router.push("/");
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>Your Tasks</h2>
        <button onClick={handleLogout} style={{ background: "#c00", color: "#fff", border: "none", padding: "8px 16px", borderRadius: 4 }}>
          Logout
        </button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id} style={{ marginBottom: 10 }}>
            <b>{task.title}</b> - {task.description} - 
            <span style={{ marginLeft: 8, color: task.status === "complete" ? "green" : "orange" }}>
              {task.status === "complete" ? "Completed" : "Not Completed"}
            </span>
            <button
              onClick={() => markComplete(task._id)}
              style={{ marginLeft: 10 }}
              disabled={task.status === "complete"}
            >
              {task.status === "complete" ? "Done" : "Mark Complete"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
