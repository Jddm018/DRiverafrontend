import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Productos.css';

const Productos = () => {
    const { categoryId } = useParams(); // Obtiene el ID de la categoría de la URL
    const [productos, setProductos] = useState([]);
    const [categoriaNombre, setCategoriaNombre] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Función para formatear el precio con puntos y agregar COP
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'decimal',
            minimumFractionDigits: 0,
        }).format(price) + ' COP';
    };

    useEffect(() => {
        const fetchProductosPorCategoria = async () => {
            try {
                // Obtener los productos de la categoría
                const responseProductos = await fetch(`http://localhost:8080/api/product/category/${categoryId}`);
                if (!responseProductos.ok) {
                    throw new Error('Error al cargar los productos');
                }
                const dataProductos = await responseProductos.json();
                setProductos(dataProductos.products);

                // Obtener el nombre de la categoría
                const responseCategoria = await fetch(`http://localhost:8080/api/categories/${categoryId}`);
                if (!responseCategoria.ok) {
                    throw new Error('Error al cargar la categoría');
                }
                const dataCategoria = await responseCategoria.json();
                setCategoriaNombre(dataCategoria.name); // Ajusta según la estructura de tu respuesta
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
            <h1>Productos en la categoría de {categoriaNombre}</h1>
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