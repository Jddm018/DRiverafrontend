import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Pago.css';

// Función para formatear precios
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(price) + ' COP';
};

const Pago = () => {
    const [paymentResponse, setPaymentResponse] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();
    const { cart, totalPrice, client } = location.state || {};

    console.log("Datos recibidos desde location.state:", { cart, totalPrice, client });

    if (!cart || !totalPrice || !client) {
        return <div>Error: No se encontraron los datos del carrito o cliente. Vuelve a intentarlo.</div>;
    }

    const paymentData = {
        total: totalPrice,
        client: Number(client.id || client), // Convertir ID del cliente a número
        products: cart.map(item => ({
            productId: Number(item.id), // Convertir ID del producto a número
            quantity: item.quantity,
        })),
    };

    console.log("Datos enviados al backend:", paymentData);

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token');
            console.log("Token cargado:", token);

            const response = await fetch('http://localhost:8080/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                body: JSON.stringify(paymentData),
            });

            console.log("Respuesta del backend (cruda):", response);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en el pago (detalles):', errorData);
                throw new Error('Error en el pago');
            }

            const data = await response.json();
            console.log("Respuesta del backend (procesada):", data);
            setPaymentResponse(data);

            localStorage.setItem('paymentResponse', JSON.stringify(data));
            navigate('/factura', { state: { paymentResponse: data } });
        } catch (error) {
            console.error('Error en la solicitud de pago:', error);
            alert('Error al procesar el pago. Intenta de nuevo.');
        }
    };

    console.log("Estado paymentResponse:", paymentResponse);

    return (
        <div className="payment-summary-container">
            <div className="payment-card">
                <h2>Resumen de la Compra</h2>
                <div className="summary-details">
                    <p><strong>Total:</strong> {formatPrice(totalPrice)}</p>
                    <p><strong>Cliente ID:</strong> {client.id || client}</p>
                </div>

                <div className="product-details">
                    <h3>Productos:</h3>
                    <ul>
                        {cart.map((item, index) => (
                            <li key={index}>
                                <span>Producto: {item.name}</span> - Cantidad: {item.quantity} - Precio: {formatPrice(item.price)}
                            </li>
                        ))}
                    </ul>
                </div>

                <button onClick={handlePayment} className="submit-button">Realizar Pago</button>
            </div>
        </div>
    );
};

export default Pago;
