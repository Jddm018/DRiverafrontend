import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Carrito.css';

function Carrito() {
    const [cart, setCart] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            try {
                const parsedCart = JSON.parse(storedCart);
                setCart(parsedCart);
                calculateTotalPrice(parsedCart);
            } catch (error) {
                console.error('Error parsing cart data:', error);
            }
        }
    }, []);

    const calculateTotalPrice = (cart) => {
        const totalPrice = cart.reduce((acc, curr) => acc + (curr.price * curr.quantity), 0);
        setTotalPrice(totalPrice);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const handleCheckout = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate('/pay', {
                state: {
                    totalPrice,
                    cart
                }
            });
        }, 1000);
    };

    const decreaseQuantity = (index) => {
        const updatedCart = [...cart];
        if (updatedCart[index].quantity > 1) {
            updatedCart[index].quantity--;
            setCart(updatedCart);
            localStorage.setItem('cart', JSON.stringify(updatedCart));
            calculateTotalPrice(updatedCart);
        }
    };

    const increaseQuantity = (index) => {
        const updatedCart = [...cart];
        updatedCart[index].quantity++;
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const removeFromCart = (index) => {
        const updatedCart = cart.filter((_, i) => i !== index);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        calculateTotalPrice(updatedCart);
    };

    const clearCart = () => {
        setCart([]);
        setTotalPrice(0);
        localStorage.removeItem('cart');
    };

    return (
        <div className="container">
            <h2>Carrito de Compras</h2>
            {cart.length === 0 ? (
                <p style={{textAlign: 'center', margin: '40px 0'}}>Tu carrito está vacío</p>
            ) : (
                <>
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="th">Imagen</th>
                                <th className="th">Producto</th>
                                <th className="th">Precio</th>
                                <th className="th">Cantidad</th>
                                <th className="th">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cart.map((item, index) => (
                                <tr key={index}>
                                    <td className="td" data-label="Imagen">
                                        <img src={`http://localhost:8080/uploads/products/${item.images}`} alt={item.name} className="img" />
                                    </td>
                                    <td className="td" data-label="Producto">{item.name}</td>
                                    <td className="td" data-label="Precio">
                                        <span>{formatPrice(item.price)}</span> <span>COP</span>
                                    </td>
                                    <td className="td" data-label="Cantidad">
                                        <div className="quantityContainer">
                                            <button onClick={() => decreaseQuantity(index)} className="quantityButton">-</button>
                                            <span className="quantity">{item.quantity}</span>
                                            <button onClick={() => increaseQuantity(index)} className="quantityButton">+</button>
                                        </div>
                                    </td>
                                    <td className="td" data-label="Acciones">
                                        <button onClick={() => removeFromCart(index)} className="actionButton">Eliminar</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="cardTotal">
                        <h4>Precio final de compra</h4>
                        <p>Total: <span>{formatPrice(totalPrice)}</span> <span>COP</span></p>
                    </div>
                    <div className="divButton">
                        <button onClick={handleCheckout} className="checkoutButton" disabled={loading || cart.length === 0}>
                            {loading ? 'Procediendo al pago...' : 'Continuar Compra'}
                        </button>
                        <button onClick={clearCart} className="clearCartButton" disabled={cart.length === 0}>Vaciar Carrito</button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Carrito;