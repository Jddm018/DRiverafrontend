import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Productos.css';

const Productos = () => {
    const { categoryId } = useParams();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' COP';
    };

    useEffect(() => {
        const fetchProductosPorCategoria = async () => {
            try {
                const responseProductos = await fetch(`http://localhost:8080/api/product/category/${categoryId}`);
                if (!responseProductos.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const dataProductos = await responseProductos.json();
                setProductos(dataProductos.products);

                const responseCategoria = await fetch(`http://localhost:8080/api/categories/${categoryId}`);
                if (!responseCategoria.ok) {
                    throw new Error('Error al cargar la categoría');
                }
                const dataCategoria = await responseCategoria.json();
                setCategoriaNombre(dataCategoria.name);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductosPorCategoria();
    }, [categoryId]);

    if (loading) return <p>Cargando productos...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="productos-categoria">
            <div className="header-with-back">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
                <h1>Productos en la categoría de {categoriaNombre}</h1>
            </div>
            <div className="productos">
                {productos.map((producto) => (
                    <Link key={producto.id} to={`/product/${producto.id}`} className="producto-link">
                        <div className="producto">
                            <img
                                src={`http://localhost:8080/uploads/products/${producto.images}`}
                                alt={producto.title}
                                className="producto-imagen"
                            />
                            <div className="producto-detalle">
                                <h2 className="producto-titulo">{producto.name}</h2>
                                <p className="producto-precio">{formatPrice(producto.price)}</p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Productos;