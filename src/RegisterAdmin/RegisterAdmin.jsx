import React, { useState } from 'react';
import "@fortawesome/fontawesome-free/css/all.min.css";
import './RegisterAdmin.css';

const RegisterAdmin = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log('Iniciando registro de administrador...');
        
            // Validaciones básicas
            if (password !== confirmPassword) {
                throw new Error('Las contraseñas no coinciden');
            }

            if (password.length < 6) {
                throw new Error('La contraseña debe tener al menos 6 caracteres');
            }

            const data = {
                name,
                email,
                password,
                role: 'ADMIN_ROLE'
            };

            console.log('Datos a enviar:', data);

            // Obtenemos el token del admin logueado
            const token = localStorage.getItem('token');
            console.log('Token obtenido:', token ? '*****' : 'NO HAY TOKEN');
            
            if (!token) {
                throw new Error('No autorizado - Token no encontrado');
            }

            const API_URL = 'http://localhost:8080/api/registeradmins';
            console.log('Enviando solicitud a:', API_URL);

            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token
                },
                body: JSON.stringify(data),
            });

            console.log('Respuesta recibida. Status:', response.status);

            // Intentamos parsear la respuesta solo si hay contenido
            let responseData = {};
            try {
                const text = await response.text();
                responseData = text ? JSON.parse(text) : {};
                console.log('Datos de respuesta:', responseData);
            } catch (parseError) {
                console.error('Error al parsear respuesta:', parseError);
            }

            if (!response.ok) {
                console.error('Error en la respuesta:', {
                status: response.status,
                statusText: response.statusText,
                data: responseData
                });
                
                let errorMsg = responseData.msg || 'Error al registrar administrador';
                if (response.status === 404) {
                errorMsg = 'Endpoint no encontrado (404). Verifica la URL del servidor.';
                } else if (response.status === 401) {
                errorMsg = 'No autorizado. Token inválido o expirado.';
                } else if (response.status === 403) {
                errorMsg = 'No tienes permisos para esta acción.';
                }
                
                throw new Error(errorMsg);
            }

            // Mostrar mensaje de éxito
            setMessage('Administrador registrado correctamente');
            setError(null);
        
            // Limpiar formulario
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

        } catch (error) {
        console.error('Error completo:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        
        setMessage('');
        setError(error.message || 'Error al registrar administrador. Verifica los datos ingresados.');
        }
    };

    return (
        <div className="register-admin-page">
            <div className="register-container">
                <div className="register-box admin-box">
                    <div className="logo">
                        <i className="fas fa-user-shield"></i>
                    </div>
                    <h2>Registro de Administrador</h2>
                    <form onSubmit={handleSubmit}>
                        {/* Fila 1: Nombre y Email */}
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="name">
                                    <i className="fas fa-user"></i> Nombre completo
                                </label>
                                <input type="text" id="name" placeholder="Ingresa el nombre completo" value={name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                            <div className="input-group">
                                <label htmlFor="email">
                                    <i className="fas fa-envelope"></i> Email
                                </label>
                                <input type="email" id="email" placeholder="Ingresa el email corporativo" value={email} onChange={(e) => setEmail(e.target.value)} required/>
                            </div>
                        </div>
                        {/* Fila 2: Contraseña y Confirmar Contraseña */}
                        <div className="input-row">
                            <div className="input-group">
                                <label htmlFor="password">
                                    <i className="fas fa-lock"></i> Contraseña
                                </label>
                                <input type="password" id="password" placeholder="Mínimo 6 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6"/>
                            </div>
                            <div className="input-group">
                                <label htmlFor="confirmPassword">
                                    <i className="fas fa-lock"></i> Confirmar Contraseña
                                </label>
                                <input type="password" id="confirmPassword" placeholder="Confirma la contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength="6" />
                            </div>
                        </div>
                        {/* Mensajes de feedback */}
                        {message && (
                            <div className="success-message">
                                <i className="fas fa-check-circle"></i> {message}
                            </div>
                        )}
                            
                        {error && (
                            <div className="error-message">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}
                            
                        <button type="submit" className="admin-btn">
                            <i className="fas fa-user-plus"></i> Registrar Administrador
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterAdmin;