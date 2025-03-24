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

    console.log("Datos recibidos desde location.state:", { cart, totalPrice, client }); // Depuración

    // Validación de los datos recibidos
    if (!cart || !totalPrice || !client) {
        return <div>Error: No se encontraron los datos del carrito o cliente. Vuelve a intentarlo.</div>;
    }

    const paymentData = {
        total: totalPrice,
        client: typeof client === 'string' ? client : client._id, // Usamos el ID del cliente
        products: cart.map(item => ({
            product: item._id, // Enviamos solo el ID del producto
            quantity: item.quantity,
        })),
    };

    console.log("Datos enviados al backend:", paymentData); // Depuración

    const handlePayment = async () => {
        try {
            const token = localStorage.getItem('token'); // Token de autenticación
            console.log("Token cargado:", token); // Depuración

            // Realiza la solicitud para procesar el pago
            const response = await fetch('http://localhost:8080/api/buy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-token': token,
                },
                body: JSON.stringify(paymentData),
            });

            console.log("Respuesta del backend (cruda):", response); // Depuración

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Error en el pago (detalles):', errorData); // Depuración
                throw new Error('Error en el pago');
            }

            // Respuesta del pago
            const data = await response.json();
            console.log("Respuesta del backend (procesada):", data); // Depuración
            setPaymentResponse(data); // Guardamos la respuesta del pago

            // Guardar paymentResponse en localStorage por si el usuario recarga la página
            localStorage.setItem('paymentResponse', JSON.stringify(data));

            // Redirigir a la factura con paymentResponse en el estado
            navigate('/factura', { state: { paymentResponse: data } });
        } catch (error) {
            console.error('Error en la solicitud de pago:', error);
            alert('Error al procesar el pago. Intenta de nuevo.');
        }
    };

    console.log("Estado paymentResponse:", paymentResponse); // Depuración

    return (
        <div className="payment-summary-container">
            <div className="payment-card">
                <h2>Resumen de la Compra</h2>
                <div className="summary-details">
                    <p><strong>Total:</strong> {formatPrice(totalPrice)}</p>
                    <p><strong>Cliente ID:</strong> {typeof client === 'string' ? client : client._id}</p>
                </div>

                {/* Mostrar los productos enviados al backend */}
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