import React, { useState, useEffect } from 'react';
import './Historial.css';

const Historial = () => {
  const [compras, setCompras] = useState([]);
  const [expandedCompra, setExpandedCompra] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCompras = async () => {
      try {
        const userData = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (!userData || !token) {
          console.warn('No hay token o usuario, pero se continuará sin redirección.');
          setCompras([]);
          setLoading(false);
          return;
        }

        const user = JSON.parse(userData);
        const userId = user.uid || user.id;

        if (!userId) {
          console.warn('ID de usuario inválido.');
          setCompras([]);
          setLoading(false);
          return;
        }

        const response = await fetch(`http://localhost:8080/api/buy/byuser/${userId}`, {
          headers: {
            'x-token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          const errorRes = await response.json();
          console.warn('Error desde el servidor:', errorRes);
          setCompras([]);
          return;
        }

        const data = await response.json();
        console.log('API buys:', data.buys);
        setCompras(data.buys || []);
      } catch (error) {
        console.error('Error en la solicitud:', error);
        setError('Hubo un problema al cargar el historial');
      } finally {
        setLoading(false);
      }
    };

    fetchCompras();
  }, []);

  const toggleDetails = (compraId) => {
    setExpandedCompra(expandedCompra === compraId ? null : compraId);
  };

  if (loading) {
    return (
      <div className="contenedor-de-compras">
        <h2 className="title">Historial de Compras</h2>
        <p>Cargando tu historial...</p>
      </div>
    );
  }

  return (
    <div className="contenedor-de-compras">
      <h2 className="title">Historial de Compras</h2>

      {error && <p className="error-message">{error}</p>}

      <p className="compras-info">
        <strong>Número de compras realizadas:</strong> {compras.length}
      </p>

      {compras.length > 0 ? (
        compras.map((compra) => (
          <div className="card" key={compra.id}>
            <div className="card-header">
              <p>
                <strong className="info-item">ID de la compra:</strong> {compra.id}
              </p>
              <p>
                <strong className="info-item">Fecha:</strong>{' '}
                {new Date(compra.date).toLocaleDateString()}
              </p>
              <p>
                <strong className="info-item">Pedido:</strong> #{compra.pay.id}
              </p>
              <p>
                <strong className="info-item">Pagado:</strong>{' '}
                ${Number(compra.pay.amountpay).toLocaleString()}
              </p>
              <button
                className="btn-ver-detalles"
                onClick={() => toggleDetails(compra.id)}
              >
                {expandedCompra === compra.id
                  ? 'Ver menos detalles'
                  : 'Ver más detalles'}
              </button>
            </div>

            {expandedCompra === compra.id && (
              <div className="card-details">
                <h2>Detalles de la Compra</h2>
                <p>
                  <strong className="info-item">Cliente:</strong>{' '}
                  {compra.client.name} (DNI: {compra.client.dni})
                </p>
                <p>
                  <strong className="info-item">Teléfono:</strong>{' '}
                  {compra.client.phone}
                </p>
                <p>
                  <strong className="info-item">Dirección:</strong>{' '}
                  {compra.client.address}
                </p>
                <p>
                  <strong className="info-item">Pago realizado el día:</strong>{' '}
                  {new Date(compra.pay.date).toLocaleDateString()}
                </p>
                <p>
                  <strong className="info-item">Total:</strong>{' '}
                  ${Number(compra.pay.amountpay).toLocaleString()}
                </p>

                <table>
                  <thead>
                    <tr>
                      <th>Producto ID</th>
                      <th>Cantidad</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(compra.buyItems || []).map((item, idx) => (
                      <tr key={idx}>
                        <td>{item.productId}</td>
                        <td>{item.quantity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No tienes compras registradas.</p>
      )}
    </div>
  );
};

export default Historial;
