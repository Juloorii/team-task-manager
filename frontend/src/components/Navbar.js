import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>Team Task Manager</div>
      <div style={styles.links}>
        <Link style={styles.link} to="/dashboard">Dashboard</Link>
        <Link style={styles.link} to="/projects">Projects</Link>
        <Link style={styles.link} to="/tasks">Tasks</Link>
        <span style={styles.user}>👤 {user?.name} ({user?.role})</span>
        <button style={styles.button} onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

const styles = {
  nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 20px', backgroundColor: '#333', color: 'white' },
  brand: { fontSize: '20px', fontWeight: 'bold', color: 'white' },
  links: { display: 'flex', alignItems: 'center', gap: '15px' },
  link: { color: 'white', textDecoration: 'none', fontSize: '14px' },
  user: { color: '#aaa', fontSize: '14px' },
  button: { padding: '6px 12px', backgroundColor: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};

export default Navbar;