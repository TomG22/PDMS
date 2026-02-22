import { useEffect, useState } from "react";

function RoutesTest() {
  // State to store tasks fetched from the backend
  const [tasks, setTasks] = useState([]);

  // Fetch tasks when the component mounts
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/tasks/"); // Backend endpoint
        const data = await response.json();
        setTasks(data); // Update state with fetched tasks
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, []); // Run once on component mount

  return (
    <div>
      <h2>Tasks:</h2>
      {/* Render tasks */}
      <ul>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <li key={task.id}>
              {task.name} {task.completed ? "(Completed)" : "(Pending)"}
            </li>
          ))
        ) : (
          <li>No tasks to display.</li>
        )}
      </ul>
    </div>
  );
}

export default RoutesTest;
