"use client";
import Link from "next/link";

export default function TaskList({ tasks }) {
  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>List of Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            <Link href={`/${task._id}`}>{task.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
