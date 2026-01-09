import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    } as React.CSSProperties,
    content: {
      textAlign: 'center' as const,
      backgroundColor: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
      maxWidth: '500px',
      width: '100%'
    } as React.CSSProperties,
    title: {
      fontSize: '6rem',
      fontWeight: 700,
      color: '#dc3545',
      margin: 0,
      lineHeight: 1
    } as React.CSSProperties,
    subtitle: {
      fontSize: '2rem',
      fontWeight: 600,
      color: '#333',
      margin: '20px 0 10px'
    } as React.CSSProperties,
    message: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '30px',
      lineHeight: '1.5'
    } as React.CSSProperties,
    button: {
      display: 'inline-block',
      backgroundColor: '#007bff',
      color: 'white',
      padding: '12px 30px',
      borderRadius: '6px',
      textDecoration: 'none',
      fontWeight: 500,
      fontSize: '1rem',
      transition: 'background-color 0.3s ease'
    } as React.CSSProperties
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>404</h1>
        <h2 style={styles.subtitle}>Page Not Found</h2>
        <p style={styles.message}>
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/" style={styles.button}>
          Return to Feed
        </Link>
      </div>
    </div>
  );
};

export default NotFound;