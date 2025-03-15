import React from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const testimonials = [
        {
            id: 1,
            quote: "¡Excelente servicio y productos de alta calidad!",
            author: "Juan Pérez",
        },
        {
            id: 2,
            quote: "Rápido y confiable. ¡Volveré a comprar!",
            author: "María Gómez",
        },
        {
            id: 3,
            quote: "La mejor experiencia de compra en línea.",
            author: "Carlos López",
        },
        {
            id: 4,
            quote: "Envío rápido y productos bien empaquetados.",
            author: "Ana Martínez",
        },
    ];

    return (
        <section className="testimonials">
            <h2>Lo que dicen nuestros clientes</h2>
            <div className="testimonials-grid">
                {testimonials.map((testimonial) => (
                    <div key={testimonial.id} className="testimonial-card">
                        <p>"{testimonial.quote}"</p>
                        <p className="author">- {testimonial.author}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Testimonials;