import React from 'react';
import { useLocation } from 'react-router-dom';
import './Factura.css';

// Función para formatear precios
const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CO', {
        style: 'decimal',
        minimumFractionDigits: 0,
    }).format(price) + ' COP';
};

const Factura = () => {
    const location = useLocation();
    const { paymentResponse } = location.state || {};

    // Si paymentResponse no está en el estado, intenta recuperarlo del localStorage
    const storedPaymentResponse = JSON.parse(localStorage.getItem('paymentResponse'));
    const finalPaymentResponse = paymentResponse || storedPaymentResponse;

    // Verificar qué está recibiendo el componente
    console.log('Datos recibidos en Factura (location.state):', location.state); // Log para ver location.state
    console.log('Datos de paymentResponse:', finalPaymentResponse); // Log para ver paymentResponse

    // Verificar si paymentResponse está presente
    if (!finalPaymentResponse) {
        console.error('Error: paymentResponse no está definido.'); // Log de error
        return (
            <div className="payment-success-container">
                <div className="payment-received-card">
                    <h2 className="payment-success-title">Error en la Factura</h2>
                    <p className="payment-success-message">No se encontraron datos de pago válidos.</p>
                </div>
            </div>
        );
    }

    // Verificar si las propiedades necesarias están definidas
    if (!finalPaymentResponse.client || !finalPaymentResponse.pay || !finalPaymentResponse.products) {
        console.error('Error: Faltan propiedades en paymentResponse:', {
            client: finalPaymentResponse.client,
            pay: finalPaymentResponse.pay,
            products: finalPaymentResponse.products,
        }); // Log de error
        return (
            <div className="payment-success-container">
                <div className="payment-received-card">
                    <h2 className="payment-success-title">Error en la Factura</h2>
                    <p className="payment-success-message">Los datos de pago están incompletos.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-success-container">
            <div className="payment-received-card">
                <h2 className="payment-success-title">Pago Realizado Exitosamente</h2>
                <p className="payment-success-message"><strong>ID de Pedido:</strong> {finalPaymentResponse._id}</p>
                <p className="payment-success-message"><strong>Total:</strong> {formatPrice(finalPaymentResponse.total)}</p>
                <p className="payment-success-message"><strong>Fecha:</strong> {new Date(finalPaymentResponse.date).toLocaleString()}</p>

                <div className="client-details">
                    <h3 className="section-header">Información del Cliente:</h3>
                    <p><strong>Nombre:</strong> {finalPaymentResponse.client.name}</p>
                    <p><strong>Documento de Identidad:</strong> {finalPaymentResponse.client.dni}</p>
                    <p><strong>Teléfono:</strong> {finalPaymentResponse.client.phone}</p>
                    <p><strong>Dirección:</strong> {finalPaymentResponse.client.address}</p>
                </div>

                <div className="payment-details">
                    <h3 className="section-header">Detalles de Pago:</h3>
                    <p><strong>Número de Pago:</strong> {finalPaymentResponse.pay.numberpay}</p>
                    <p><strong>Monto Pagado:</strong> {formatPrice(finalPaymentResponse.pay.amountpay)}</p>
                    <p><strong>Fecha de Pago:</strong> {new Date(finalPaymentResponse.pay.date).toLocaleString()}</p>
                </div>

                <h3 className="section-header">Productos Comprados:</h3>
                <ul className="product-details-list">
                    {finalPaymentResponse.products.map((item) => (
                        <li className="product-details-item" key={item._id}>
                            <span className="product-details-name">{item.product.name}</span> - 
                            Cantidad: <span className="product-details-quantity">{item.quantity}</span> - 
                            Precio: <span className="product-details-price">
                                {item.product.price ? formatPrice(item.product.price) : "Precio no disponible"}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Factura;