import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './Detalles.css';
//import Carousel from './Carousel'; // Asegúrate de que la ruta sea correcta

function Detalles() {
    const { id } = useParams();
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

  // Nuevo estado para el texto del botón
    const [buttonText, setButtonText] = useState('Agregar al carrito');

    useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));  // Guardar el carrito en localStorage
    }, [cart]);

    const addToCart = (newItem) => {
        const updatedCart = [...cart];
        const existingItemIndex = updatedCart.findIndex(item => item._id === newItem._id); // Usamos _id para MongoDB

        if (existingItemIndex >= 0) {
      // Si el producto ya está en el carrito, incrementar su cantidad
            updatedCart[existingItemIndex].quantity += 1;
        } else {
      // Si no está en el carrito, agregarlo con cantidad 1
            updatedCart.push({ ...newItem, quantity: 1 });
        }

        // Actualizar el estado y guardar el carrito en localStorage
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));

        // Cambiar el texto del botón a "Añadido al carrito"
        setButtonText('Añadido al carrito');

        // Restaurar el texto original después de 4 segundos
        setTimeout(() => {
            setButtonText('Agregar al carrito');
        }, 4000);
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`http://localhost:8080/api/product/${id}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
            const productData = await response.json();
                setProduct(productData);
            } catch (error) {
            console.error('Error fetching product:', error);
            }
        };
        fetchProduct();
    }, [id]);

    if (!product) {
        return <p>Loading...</p>;
    }

  // Separar la descripción en párrafos usando puntos seguidos
    const formattedDescription = product.description.split('.').map((sentence, index) => {
        if (index === 0) return <span key={index}>{sentence.trim()}</span>; // Mantener el primer párrafo como un span
        return <p key={index}>{sentence.trim()}</p>; // Alinear los siguientes en párrafos
    });

    return (
        <div className="product-view-container">
            <div className="product-details">
                <div className="product-image-container">
                    <img
                        src={`http://localhost:8080/uploads/products/${product.images}`}
                        alt={product.name}
                        className="product-image"
                    />
                </div>
                <div className="product-info">
                    <h1 className="product-title">{product.name}</h1>
                    <p className="product-category">{product.category?.name || product.category}</p>
                    <p className="free-shipping">Envío Gratis</p>
                    <p className="product-price">Precio: ${new Intl.NumberFormat('es-CO').format(product.price)} COP</p>
                    <p className="inventory-info">Inventario: {product.stock} unidades disponibles</p>
                    <button
                        onClick={() => addToCart({ ...product, _id: product._id })}
                        className="add-to-cart-button"
                    >
                        {buttonText}
                    </button>
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
