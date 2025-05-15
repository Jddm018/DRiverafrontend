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
                        <li title='Recomendacion'><a href="/recomendacion">Recomendacion</a></li>
                        <li title='¿Quienes Somos?'><a href="/quienes_somos">¿Quienes Somos?</a></li>
                        <li><a href="https://app.powerbi.com/view?r=eyJrIjoiNDgyN2M2ODctZDk0OC00YWEzLTk4NDMtM2QwNTlkMDExY2UxIiwidCI6IjlkMTJiZjNmLWU0ZjYtNDdhYi05MTJmLTFhMmYwZmM0OGFhNCIsImMiOjR9" target="_blank" rel="noopener noreferrer" className="nav-link" title="Power BI">Power BI</a></li>
                    </ul>
                </div>
            </div>

            {/* Derechos de autor */}
            <div className="footer-copy">
                <p>&copy; 2025 DRivera s.a.s. Todos los derechos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;
