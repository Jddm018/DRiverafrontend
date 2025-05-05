import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import './ProductRecom.css';

const ProductRecom = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sortBy, setSortBy] = useState('recent');
    const navigate = useNavigate(); // Hook para navegación

    // Verifica si una fecha pertenece al mes y año actual
    const isCurrentMonth = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        return (
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()
        );
    };

    // Formatea precio
    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP'
        }).format(price);
    };

    // Filtra y ordena productos
    const getSortedProducts = () => {
        const filtered = products.filter(product => isCurrentMonth(product.createdAt));
        if (sortBy === 'recent') {
            return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }
        return filtered;
    };

    // Fetch de productos
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/product');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                    setProducts(data.products);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching products:', error);
                    setError(error.message);
                    setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Función para ver detalles del producto
    const handleViewDetails = (productId) => {
        navigate(`/product/${productId}`);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Cargando productos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <p>Error al cargar los productos: {error}</p>
                <button onClick={() => window.location.reload()}>Reintentar</button>
            </div>
        );
    }

    return (
        <div className="product-table-container">
            <header className="pt-header">
                <h2 className="pt-title">Nuestros Productos Recomendados</h2>
                <div className="pt-controls">
                    <label className="pt-sort-label">Ordenar por:</label>
                    <select className="pt-sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="recent">Más recientes primero</option>
                        <option value="price_asc">Precio (menor a mayor)</option>
                        <option value="price_desc">Precio (mayor a menor)</option>
                    </select>
                </div>
            </header>

            <div className="pt-table-wrapper">
            <table className="pt-table">
                <thead>
                    <tr>
                        <th className="pt-th pt-col-image">Imagen</th>
                        <th className="pt-th">Nombre</th>
                        <th className="pt-th pt-col-price">Precio</th>
                        <th className="pt-th pt-col-stock">Disponibles</th>
                        <th className="pt-th">Categoría</th>
                        <th className="pt-th pt-col-actions">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {getSortedProducts().map((product) => (
                        <tr key={product.id} className="pt-tr">
                            <td className="pt-td">
                                <div className="pt-image-container">
                                    <img className="pt-product-image" src={`http://localhost:8080/uploads/products/${product.images[0]}`} alt={product.name} onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/80x60?text=Imagen+no+disponible';
                                        }}
                                    />
                                </div>
                                </td>
                                <td className="pt-td pt-product-name">{product.name}</td>
                                <td className="pt-td pt-product-price">{formatPrice(product.price)}</td>
                                <td className="pt-td">
                                    <span className={`pt-stock-badge ${product.stock < 10 ? 'pt-low-stock' : ''}`}>
                                        {product.stock} unidades
                                    </span>
                                </td>
                                <td className="pt-td pt-product-category">{product.category.name}</td>
                                <td className="pt-td">
                                    <button className="pt-details-btn" onClick={() => handleViewDetails(product.id)} >
                                        <span className="pt-btn-icon"></span> Ver Detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProductRecom;