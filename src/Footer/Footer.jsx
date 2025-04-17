import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Sección de enlaces rápidos */}
                <div className="footer-section">
                    <h3>Enlaces rápidos</h3>
                    <ul>
                        <li title='Inicio'><a href="/Inicio">Inicio</a></li>
                        <li title='Productos'><a href="/productos">Productos</a></li>
                        <li title='Historial de Compras'><a href="/historial">Historial de Compras</a></li>
                        <li title='Iniciar Sesión'><a href="/login">Iniciar Sesión</a></li>
                    </ul>
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
