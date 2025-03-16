import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faDoorOpen, faUser, faBookOpen } from '@fortawesome/free-solid-svg-icons'; // Importa faSignInAlt
import './Navbar.css';
import Logo_Rivera from "../img/Logo d1.png";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    // Verifica si el usuario está logueado
    const isLoggedIn = () => {
        const token = localStorage.getItem('token');
        return token !== null;
    };

    // Obtiene los datos del usuario
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const response = await fetch('http://localhost:8080/api/user/byuser', {
                        headers: {
                            'x-token': token,
                            'Accept': 'application/json',
                            'Content-Type': 'multipart/form-data',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setUser(data);
                        localStorage.setItem("user", JSON.stringify(data));
                        if (data.role === "ADMIN_ROLE") {
                            setIsAdmin(true);
                        }
                    } else {
                        console.error('Failed to fetch user data');
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchUserData();
    }, []);

    // Cierra la sesión del usuario
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('cart');
        navigate('/');
        setIsAdmin(false);
    };

    return (
        <nav className="navbar">
            <div className="navbar-logo">
                <Link to="/">
                    <img src={Logo_Rivera} alt="Logo Rivera" />
                </Link>
            </div>
            <ul className="navbar-links">
                <li>
                    <Link to="/Inicio" className="nav-link" title="Inicio">
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to="/productos" className="nav-link" title="Productos">
                        Productos
                    </Link>
                </li>
                <li>
                    <Link to="/historial" className="nav-link" title="Historial de Compras">
                        <FontAwesomeIcon icon={faBookOpen} size="lg" />
                    </Link>
                </li>
                {console.log("user",user)}
                {/* Mostrar "Iniciar Sesión" si no está logueado */}
                {!isLoggedIn() && (
                    <li>
                        <Link to="/login" className="nav-link" title="Iniciar Sesión">
                            <FontAwesomeIcon icon={faUser} size="lg" /> {/* Ícono de inicio de sesión */}
                        </Link>
                    </li>
                )}
                {/* Mostrar "Panel de Administrador" si es admin */}
                {isAdmin && (
                    <li>
                        <Link to="/admin" className="nav-link" title="Panel de Administrador">
                            Panel de Admin
                        </Link>
                    </li>
                )}

                {/* Mostrar "Carrito" */}
                <li>
                    <Link to="/cart" className="nav-link" title="Carrito de Compras">
                        <FontAwesomeIcon icon={faShoppingCart} size="lg" /> {/* Ícono del carrito */}
                    </Link>
                </li>

                {/* Mostrar "Cerrar Sesión" si está logueado */}
                {isLoggedIn() && (
                    <li>
                        <div onClick={logout} className="nav-link logout-button" title="Cerrar Sesión">
                            <FontAwesomeIcon icon={faDoorOpen} size="lg" /> {/* Ícono de cierre de sesión */}
                        </div>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;