import React from 'react';
import './Hero.css';


const Hero = () => {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Bienvenido a DRivera s.a.s</h1>
                <p>Encuentra los mejores productos al mejor precio.</p>
                <a href="/productos" className="cta-button">Explorar Productos</a>
            </div>
        </section>
    );
};

export default Hero;