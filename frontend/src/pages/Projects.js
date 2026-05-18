import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const Projects = () => {
  const { token, user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/projects`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data);
    } catch (err) {
      console.error(err);
    }
  };

// eslint-disable-next-line
    useEffect(() => { fetchProjects(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/projects`,
        { name, description },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName('');
      setDescription('');
      setMessage('Project created!');
      fetchProjects();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error');
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={styles.container}>
        <h2>Projects</h2>
        {user?.role === 'admin' && (
          <div style={styles.form}>
            <h3>Create New Project</h3>
            {message && <p style={styles.message}>{message}</p>}
            <form onSubmit={handleCreate}>
              <input style={styles.input} placeholder="Project Name" value={name} onChange={e => setName(e.target.value)} required />
              <input style={styles.input} placeholder="Description" value={description} onChange={e => setDescription(e.target.value)} />
              <button style={styles.button} type="submit">Create Project</button>
            </form>
          </div>
        )}
        <div style={styles.list}>
          {projects.map(project => (
            <div key={project.id} style={styles.card}>
              <h3>{project.name}</h3>
              <p>{project.description || 'No description'}</p>
              <p>Tasks: {project.tasks?.length || 0}</p>
              <p>Created by: {project.createdBy?.name}</p>
              {user?.role === 'admin' && (
                <button style={styles.deleteBtn} onClick={() => handleDelete(project.id)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: { padding: '20px' },
  form: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', marginBottom: '20px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ddd', boxSizing: 'border-box' },
  button: { padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' },
  deleteBtn: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  list: { display: 'flex', gap: '20px', flexWrap: 'wrap' },
  card: { backgroundColor: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', minWidth: '250px' },
  message: { color: 'green' }
};

export default Projects;