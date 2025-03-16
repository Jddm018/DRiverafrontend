import React, { useState } from "react";
import { Link } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./Login.css"; // Importa los estilos específicos del Login

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const data = {
                email,
                password,
            };

            // Llamada a la API para iniciar sesión
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();
            
            // Verificar si la respuesta es exitosa
            if (!response.ok) {
                throw new Error(responseData.msg || "Error al iniciar sesión");
            }

            // Guardar el token y el rol en localStorage
            localStorage.setItem("token", responseData.token);
            if (responseData.role) {
            localStorage.setItem("role", responseData.role);
            }

            // Redirigir a /productos y refrescar la página
            window.location.href = "/productos";
        } catch (error) {
            console.error("Error al iniciar sesión:", error);
            setError("Error al iniciar sesión. Por favor, verifica tus credenciales.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-box">
                    <div className="logo">
                        <i className="fas fa-user-circle"></i>
                    </div>
                    <h2>Iniciar Sesión</h2>
                    <form onSubmit={handleSubmit}>
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
                            required />
                        </div>
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
                            required />
                        </div>
                        {error && <p className="error-message">{error}</p>}
                        <button type="submit">
                            Ingresar <i className="fas fa-arrow-right"></i>
                        </button>
                    </form>
                    <div className="links">
                        <Link to="/forgot-password">¿Olvidaste tu contraseña?</Link>
                        <Link to="/register">Regístrate</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;