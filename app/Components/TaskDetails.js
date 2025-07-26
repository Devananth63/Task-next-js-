"use client";
export default function TaskDetails({ task }) {
  if (!task) return <div>Task not found.</div>;
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>{task.title}</h2>
      <p>{task.description}</p>
    </div>
  );
}
