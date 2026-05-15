import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const [tasksRes, projectsRes] = await Promise.all([
          axios.get('https://team-task-manager-production-9319.up.railway.app/api/tasks', { headers }),
          axios.get('https://team-task-manager-production-9319.up.railway.app/api/projects', { headers })
        ]);
        setTasks(tasksRes.data);
        setProjects(projectsRes.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const inProgress = tasks.filter(t => t.status === 'inprogress').length;
  const done = tasks.filter(t => t.status === 'done').length;
  const overdue = tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'done').length;

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Dashboard</h2>
        <div style={styles.cards}>
          <div style={{...styles.card, backgroundColor: '#3498db'}}>
            <h3>Total Tasks</h3>
            <p style={styles.number}>{tasks.length}</p>
          </div>
          <div style={{...styles.card, backgroundColor: '#e67e22'}}>
            <h3>In Progress</h3>
            <p style={styles.number}>{inProgress}</p>
          </div>
          <div style={{...styles.card, backgroundColor: '#2ecc71'}}>
            <h3>Completed</h3>
            <p style={styles.number}>{done}</p>
          </div>
          <div style={{...styles.card, backgroundColor: '#e74c3c'}}>
            <h3>Overdue</h3>
            <p style={styles.number}>{overdue}</p>
          </div>
          <div style={{...styles.card, backgroundColor: '#9b59b6'}}>
            <h3>Projects</h3>
            <p style={styles.number}>{projects.length}</p>
          </div>
        </div>
        <h3>Recent Tasks</h3>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.slice(0, 5).map(task => (
              <tr key={task.id} style={styles.row}>
                <td>{task.title}</td>
                <td>{task.project?.name}</td>
                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                <td><span style={{...styles.badge, backgroundColor: task.status === 'done' ? '#2ecc71' : task.status === 'inprogress' ? '#e67e22' : '#3498db'}}>{task.status}</span></td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  cards: { display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' },
  card: { padding: '20px', borderRadius: '10px', color: 'white', minWidth: '150px', textAlign: 'center' },
  number: { fontSize: '40px', fontWeight: 'bold', margin: '0' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f5f5f5' },
  row: { borderBottom: '1px solid #ddd', padding: '10px' },
  badge: { padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px' }
};

export default Dashboard;