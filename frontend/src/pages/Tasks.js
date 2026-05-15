import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Tasks = () => {
  const { token, user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedToId, setAssignedToId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [message, setMessage] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = async () => {
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/tasks', { headers }),
        axios.get('http://localhost:5000/api/projects', { headers })
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);
      if (user?.role === 'admin') {
        const usersRes = await axios.get('http://localhost:5000/api/users', { headers });
        setUsers(usersRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // eslint-disable-next-line
useEffect(() => { fetchAll(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/tasks',
        { title, description, projectId, assignedToId, dueDate },
        { headers }
      );
      setTitle(''); setDescription(''); setProjectId(''); setAssignedToId(''); setDueDate('');
      setMessage('Task created!');
      fetchAll();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.patch(`http://localhost:5000/api/tasks/${id}`, { status }, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${id}`, { headers });
      fetchAll();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Tasks</h2>
        {user?.role === 'admin' && (
          <div style={styles.form}>
            <h3>Create New Task</h3>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleCreate}>
              <input style={styles.input} placeholder="Task Title" value={title} onChange={e => setTitle(e.target.value)} required />
              <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <select style={styles.input} value={projectId} onChange={e => setProjectId(e.target.value)} required>
                <option value="">Select Project</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select style={styles.input} value={assignedToId} onChange={e => setAssignedToId(e.target.value)}>
                <option value="">Assign To (optional)</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input style={styles.input} type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
              <button style={styles.button} type="submit">Create Task</button>
            </form>
          </div>
        )}
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th>Title</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Due Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id} style={styles.row}>
                <td>{task.title}</td>
                <td>{task.project?.name}</td>
                <td>{task.assignedTo?.name || 'Unassigned'}</td>
                <td>
                  <select value={task.status} onChange={e => handleStatusChange(task.id, e.target.value)} style={styles.select}>
                    <option value="todo">Todo</option>
                    <option value="inprogress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </td>
                <td>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</td>
                <td>
                  {user?.role === 'admin' && (
                    <button style={styles.deleteBtn} onClick={() => handleDelete(task.id)}>Delete</button>
                  )}
                </td>
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
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '4px 8px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' },
  thead: { backgroundColor: '#f5f5f5' },
  row: { borderBottom: '1px solid #ddd' },
  select: { padding: '4px', borderRadius: '4px' },
  message: { color: 'green' }
};

export default Tasks;