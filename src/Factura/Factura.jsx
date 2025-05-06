import React from 'react';
import { useLocation } from 'react-router-dom';
import './Factura.css';

const formatPrice = (price) => {
  return new Intl.NumberFormat('es-CO', {
    style: 'decimal',
    minimumFractionDigits: 0,
  }).format(price) + ' COP';
};

const formatDate = (dateString) => {
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZoneName: 'short'
  };
  return new Date(dateString).toLocaleString('es-CO', options);
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

  const { 
    id,
    total,
    date,
    state,
    client,
    pay,
    buyItems,
    createdAt,
  } = finalPaymentResponse;

  return (
    <div className="payment-success-container">
      <div className="invoice-card">
        <header className="invoice-header">
          <h1 className="invoice-title">Compra Exitosa</h1>
          <div className="invoice-meta">
            <p><strong>N° Factura:</strong> {id}</p>
            <p><strong>Fecha:</strong> {formatDate(date)}</p>
            <p><strong>Estado:</strong> {state ? 'Activa' : 'Inactiva'}</p>
          </div>
        </header>

        <div className="invoice-sections">
          
          <section className="invoice-section">
            <h2 className="section-title">Información del Cliente</h2>
            <div className="section-content">
              <p><strong>Nombre:</strong> {client?.name || 'No disponible'}</p>
              {/* Agrega más campos si los recibes en la respuesta */}
            </div>
          </section>

          <section className="invoice-section">
            <h2 className="section-title">Detalles del Pago</h2>
            <div className="section-content">
              <p><strong>ID de Pago:</strong> {pay?.id}</p>
              <p><strong>Monto:</strong> {formatPrice(pay?.amountpay)}</p>
              <p><strong>Fecha de Pago:</strong> {formatDate(pay?.date)}</p>
              <p><strong>Estado:</strong> {pay?.state ? 'Aprobado' : 'Rechazado'}</p>
            </div>
          </section>

          <section className="invoice-section">
            <h2 className="section-title">Resumen de la Compra</h2>
            <div className="section-content">
              <table className="invoice-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Cantidad</th>
                  </tr>
                </thead>
                <tbody>
                  {buyItems.map((item, index) => (
                    <tr key={index}>
                      <td>Producto #{item.productId}</td>
                      <td>{item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="1"><strong>Total:</strong></td>
                    <td><strong>{formatPrice(total)}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        <footer className="invoice-footer">
          <p>Fecha de creación: {formatDate(createdAt)}</p>

        </footer>
      </div>
    </div>
  );
};

export default Factura;