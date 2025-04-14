import React from 'react';
import { useLocation } from 'react-router-dom';
import './Factura.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' COP';
};

const Factura = () => {
  const location = useLocation();
  const { paymentResponse } = location.state || {};
  const storedPaymentResponse = JSON.parse(localStorage.getItem('paymentResponse'));
  const finalPaymentResponse = paymentResponse || storedPaymentResponse;

  console.log('Datos recibidos en Factura:', finalPaymentResponse);

  if (!finalPaymentResponse) {
    return (
      <div className="payment-success-container">
        <div className="payment-received-card">
          <h2 className="payment-success-title">Error en la Factura</h2>
          <p className="payment-success-message">No se encontraron datos de pago válidos.</p>
        </div>
      </div>
    );
  }

  // Ahora comprobamos buyItems en lugar de products
  if (!finalPaymentResponse.client || !finalPaymentResponse.pay || !finalPaymentResponse.buyItems) {
    return (
      <div className="payment-success-container">
        <div className="payment-received-card">
          <h2 className="payment-success-title">Error en la Factura</h2>
          <p className="payment-success-message">Los datos de pago están incompletos.</p>
        </div>
      </div>
    );
  }

  const { client, pay, buyItems, _id, total, date } = finalPaymentResponse;

  return (
    <div className="payment-success-container">
      <div className="payment-received-card">
        <h2 className="payment-success-title">Pago Realizado Exitosamente</h2>
        <p className="payment-success-message"><strong>ID de Pedido:</strong> {_id}</p>
        <p className="payment-success-message"><strong>Total:</strong> {formatPrice(total)}</p>
        <p className="payment-success-message"><strong>Fecha:</strong> {new Date(date).toLocaleString()}</p>

        <div className="client-details">
          <h3 className="section-header">Información del Cliente:</h3>
          <p><strong>Nombre:</strong> {client.name}</p>
          <p><strong>Documento de Identidad:</strong> {client.dni}</p>
          <p><strong>Teléfono:</strong> {client.phone}</p>
          <p><strong>Dirección:</strong> {client.address}</p>
        </div>

        <div className="payment-details">
          <h3 className="section-header">Detalles de Pago:</h3>
          <p><strong>Número de Pago:</strong> {pay.id}</p>
          <p><strong>Monto Pagado:</strong> {formatPrice(pay.amountpay)}</p>
          <p><strong>Fecha de Pago:</strong> {new Date(pay.date).toLocaleString()}</p>
        </div>

        <h3 className="section-header">Productos Comprados:</h3>
        <ul className="product-details-list">
          {buyItems.map((item, idx) => (
            <li className="product-details-item" key={idx}>
              {/* Aquí solo tienes quantity y productId; si necesitas nombre y precio tendrás que
                  o bien hacer un fetch adicional para obtener el producto,
                  o bien incluir esos datos en el objeto buyItems antes de llegar a esta pantalla */}
              <span className="product-details-name">Producto #{item.productId}</span> – 
              Cantidad: <span className="product-details-quantity">{item.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Factura;
