import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faShoppingCart, 
  faDoorOpen, 
  faUser, 
  faBookOpen,
  faChartLine,
  faUserCog,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import './Navbar.css';
import Logo_Rivera from "../img/Logo d1.png";

const Navbar = () => {
    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const ADMIN_ROLE = 2; // ID numérico del rol de administrador

    // Efecto para manejar el scroll
    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

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

                        if (data.roleId === ADMIN_ROLE) {
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
        localStorage.removeItem('user');
        localStorage.removeItem('paymentResponse');
        localStorage.removeItem('clientId');
        navigate('/');
        setIsAdmin(false);
        setMobileMenuOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
            <div className="navbar-logo">
                <Link to="/">
                    <img src={Logo_Rivera} alt="Logo Rivera" />
                </Link>
            </div>
            
            {/* Botón del menú hamburguesa para móviles */}
            <div className="mobile-menu-icon" onClick={toggleMobileMenu}>
                <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} size="lg" />
            </div>
            
            <ul className={`navbar-links ${mobileMenuOpen ? 'active' : ''}`}>
                <li>
                    <Link to="/Inicio" className="nav-link" title="Inicio" onClick={() => setMobileMenuOpen(false)}>
                        Inicio
                    </Link>
                </li>
                <li>
                    <Link to="/productos" className="nav-link" title="Productos" onClick={() => setMobileMenuOpen(false)}>
                        Productos
                    </Link>
                </li>
                <li>
                    <Link to="/recomendacion" className="nav-link" title="Recomendacion" onClick={() => setMobileMenuOpen(false)}>
                        Recomendados
                    </Link>
                </li>
                <li>
                    <Link to="/quienes_somos" className="nav-link" title="Quienes Somos" onClick={() => setMobileMenuOpen(false)}>
                        ¿Quienes Somos?
                    </Link>
                </li>
                <li>
                    <a 
                        href="https://app.powerbi.com/view?r=eyJrIjoiNDgyN2M2ODctZDk0OC00YWEzLTk4NDMtM2QwNTlkMDExY2UxIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="nav-link" 
                        title="Power BI"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FontAwesomeIcon icon={faChartLine} size="lg" />
                    </a>
                </li>
                <li>
                    <Link to="/historial" className="nav-link" title="Historial de Compras" onClick={() => setMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faBookOpen} size="lg" />
                    </Link>
                </li>
                {console.log("user",user)}
                
                {/* Mostrar "Iniciar Sesión" si no está logueado */}
                {!isLoggedIn() && (
                    <li>
                        <Link to="/login" className="nav-link" title="Iniciar Sesión" onClick={() => setMobileMenuOpen(false)}>
                            <FontAwesomeIcon icon={faUser} size="lg" />
                        </Link>
                    </li>
                )}

                {/* Mostrar "Panel de Administrador" si es admin */}
                {isAdmin && (
                    <li>
                        <Link to="/admin" className="nav-link" title="Panel de Administrador" onClick={() => setMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faUserCog} size="lg" />
                        </Link>
                    </li>
                )}

                {/* Mostrar "Carrito" */}
                <li>
                    <Link to="/cart" className="nav-link" title="Carrito de Compras" onClick={() => setMobileMenuOpen(false)}>
                        <FontAwesomeIcon icon={faShoppingCart} size="lg" />
                    </Link>
                </li>

                {/* Mostrar "Cerrar Sesión" si está logueado */}
                {isLoggedIn() && (
                    <li>
                        <div onClick={logout} className="nav-link logout-button" title="Cerrar Sesión">
                            <FontAwesomeIcon icon={faDoorOpen} size="lg" />
                        </div>
                    </li>
                )}
            </ul>
        </nav>
    );
};

export default Navbar;