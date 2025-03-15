import React from 'react';
import Hero from '../Hero/Hero.jsx';
import Testimonials from '../Testimonios/Testimonials.jsx';
import './Home.css';

const Home = () => {
    return (
        <div className="home">
            <Hero /> {/* Sección Hero */}
            <Testimonials /> {/* Sección Testimonials */}
        </div>
    );
};

export default Home;