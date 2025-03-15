import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Sección de enlaces rápidos */}
                <div className="footer-section">
                    <h3>Enlaces rápidos</h3>
                    <ul>
                        <li><a href="/Inicio">Inicio</a></li>
                        <li><a href="/products">Productos</a></li>
                        <li><a href="/purchase_history">Historial de Compras</a></li>
                        <li><a href="/login">Iniciar Sesión</a></li>
                    </ul>
                </div>

                {/* Sección de redes sociales */}
                <div className="footer-section">
                    <h3>Redes sociales</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faFacebook} />
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faTwitter} />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FontAwesomeIcon icon={faInstagram} />
                        </a>
                    </div>
                </div>
            </div>

            {/* Derechos de autor */}
            <div className="footer-copy">
                <p>&copy; 2025 D Rivera s.a.s. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;