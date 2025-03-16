import React, { useEffect, useState } from 'react';
import './Categorias.css';
import { Link } from 'react-router-dom';

// Importa las imágenes directamente
import barbacoaImage from '../img/barbacoa.png'; 
import estufaImage from '../img/estufa.png'; 
import freidoraImage from '../img/freidor.png'; 
import campanaImage from '../img/campana.png'; 
import otroImage from '../img/otro.png'; 

const Categorias = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Proporciona tus imágenes aquí
    const productImages = [
        estufaImage,
        freidoraImage,
        barbacoaImage,
        campanaImage,
        otroImage,
    ];

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories'); // Cambia la URL según tu API
                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                const data = await response.json();
                setCategories(data.categories);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <p>Cargando categorías...</p>;
    if (error) return <p>{error}</p>;

    // Verifica si categories es un array antes de usar slice
    const displayCategories = Array.isArray(categories) ? categories.slice(0, 6) : [];

    return (
        <div className="product-cards">
            <h2>Nuestras Categorias</h2>
            <div className="cards-container">
                {displayCategories.map((category, index) => (
                    <Link to={`/category/${category._id}`} key={category._id} className="product-card">
                        <div className="card-image">
                            <img
                                src={productImages[index] ? productImages[index] : '../src/img/default-image.png'}
                                alt={category.name}
                            />
                        </div>
                        <div className="card-content">
                            <h3>{category.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Categorias;