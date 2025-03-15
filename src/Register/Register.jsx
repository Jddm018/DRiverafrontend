import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './Register.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (password !== confirmPassword) {
        throw new Error('Las contraseñas no coinciden');
      }

      const data = {
        name,
        email,
        password,
      };

      const response = await fetch('http://localhost:8080/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.msg || 'Error al registrar usuario');
      }

      setMessage('Usuario registrado exitosamente');
      setError(null);
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');

    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMessage('');
      setError(error.message || 'Error al registrar usuario. Verifica los datos ingresados.');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-box">
          <div className="logo">
            <i className="fas fa-user-plus"></i>
          </div>
          <h2>Registro</h2>
          <form onSubmit={handleSubmit}>
            {/* Fila 1: Nombre y Email */}
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="name">
                  <i className="fas fa-user"></i> Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  placeholder="Ingresa tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">
                  <i className="fas fa-envelope"></i> Email
                </label>
                <input
                  type="email"
                  id="email"
                  placeholder="Ingresa tu email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            {/* Fila 2: Contraseña y Confirmar Contraseña */}
            <div className="input-row">
              <div className="input-group">
                <label htmlFor="password">
                  <i className="fas fa-lock"></i> Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="confirmPassword">
                  <i className="fas fa-lock"></i> Confirmar Contraseña
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            {message && <p className="message">{message}</p>}
            {error && <p className="error">{error}</p>}
            <button type="submit">Registrarse</button>
          </form>
          <div className="links">
            <p>¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;