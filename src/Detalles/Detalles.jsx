import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import './Detalles.css';

function Detalles() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [cart, setCart] = useState(() => {
        try {
            const storedCart = localStorage.getItem('cart');
            return storedCart ? JSON.parse(storedCart) : [];
        } catch (error) {
            console.error('Error al leer el carrito del almacenamiento local:', error);
            return [];
        }
    });

    const [buttonText, setButtonText] = useState('Agregar al carrito');

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (newItem) => {
        const updatedCart = [...cart];
        const existingItemIndex = updatedCart.findIndex(item => item.id === newItem.id);

        if (existingItemIndex >= 0) {
            updatedCart[existingItemIndex].quantity += 1;
        } else {
            updatedCart.push({ ...newItem, quantity: 1 });
        }

        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setButtonText('Añadido al carrito');

        setTimeout(() => {
            setButtonText('Agregar al carrito');
        }, 4000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/${id}`);
                if (!response.ok) {
                    throw new Error('Error al obtener el producto');
                }
                const productData = await response.json();
                setProduct(productData);
            } catch (error) {
                console.error('Error al obtener el producto:', error);
            }
        };

        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

    const formattedDescription = product.description
        ? product.description.split('.').map((sentence, index) => (
            <p key={index}>{sentence.trim()}</p>
        ))
        : null;

    return (
        <div className="product-view-container">
            <div className="header-with-back">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <FontAwesomeIcon icon={faArrowLeft} />
                </button>
            </div>
            <div className="product-details">
                <div className="product-image-container">
                    <img
                        src={`http://localhost:8080/uploads/products/${product.images}`}
                        alt={product.name}
                        className="product-image"
                    />
                    {product.stock === 0 && (
                        <div className="stock-badge">AGOTADO</div>
                    )}
                </div>
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-category">{product.category?.name || product.category}</p>
                    <p className="free-shipping">Envío Gratis</p>
                    <p className="product-price">Precio: {new Intl.NumberFormat('es-CO').format(product.price)} COP</p>
                    <p className={`inventory-info ${product.stock === 0 ? 'out-of-stock' : ''}`}>
                        {product.stock > 0
                            ? `Inventario: ${product.stock} unidades disponibles`
                            : 'Producto no disponible'}
                    </p>
                    {product.stock > 0 ? (
                        <button
                            onClick={() => addToCart(product)}
                            className="add-to-cart-button"
                        >
                            {buttonText}
                        </button>
                    ) : (
                        <button
                            className="add-to-cart-button out-of-stock-button"
                            disabled
                        >
                            No disponible
                        </button>
                    )}
                </div>
                <div className="product-description">
                    <h2>Descripción</h2>
                    {formattedDescription}
                </div>
            </div>
        </div>
    );
}

export default Detalles;
