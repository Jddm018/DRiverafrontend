import React, { useEffect, useState } from 'react';
import './Categorias.css';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

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
    const navigate = useNavigate();

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
                console.log('Fetching categories...');
                const response = await fetch('http://localhost:8080/api/categories');
                console.log('Response:', response);

                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }

                const data = await response.json();
                console.log('Categories data:', data);

                const categoriesData = data.categories || data;
                setCategories(categoriesData);
            } catch (err) {
                console.error('Error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) return <div className="loading">Cargando categorías...</div>;
    if (error) return <div className="error">Error: {error}</div>;

    const displayCategories = Array.isArray(categories) ? categories.slice(0, 6) : [];

    return (
        <div className="product-cards">
            <div className="header-with-back">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h2>Nuestras Categorías</h2>
            </div>
            <div className="cards-container">
                {displayCategories.map((category, index) => {
                    console.log('Categoría completa:', category);

                    const categoryId = category.id;
                    if (!categoryId) {
                        console.warn('❌ Categoría sin ID válido:', category);
                        return null;
                    }

                    return (
                        <Link 
                            to={`/category/${categoryId}`} 
                            key={categoryId} 
                            className="product-card"
                        >
                            <div className="card-image">
                                <img
                                    src={productImages[index] || otroImage}
                                    alt={category.name}
                                    onError={(e) => {
                                        e.target.src = otroImage;
                                    }}
                                />
                            </div>
                            <div className="card-content">
                                <h3>{category.name}</h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default Categorias;