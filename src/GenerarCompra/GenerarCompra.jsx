import React, { useState, useEffect, useCallback, useRef } from 'react';
import './GenerarCompra.css';

const PENDING_UPDATES_KEY = 'pendingStockUpdates';

export default function GenerarCompra() {
  // States principales
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSupplier, setSelectedSupplier] = useState('');
  const [desiredQuantity, setDesiredQuantity] = useState(0);
  const [isLoading, setIsLoading] = useState({
    products: false,
    suppliers: false,
    purchasing: false,
    updating: false
  });
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [currentStock, setCurrentStock] = useState(0);
  const [error, setError] = useState(null);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  // Notificaciones en lugar de alert()
  const [notification, setNotification] = useState({ message: '', type: '' });

  const updateIntervalRef = useRef(null);
  const token = localStorage.getItem('token');

  // Filtrar productos con stock bajo
  const lowStockProducts = Array.isArray(products)
    ? products.filter(p => p.stock <= 10)
    : [];

  // Fetch de productos
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, products: true }));
      setError(null);
      const resp = await fetch('http://localhost:8080/api/product');
      if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
      const data = await resp.json();
      setProducts(Array.isArray(data) ? data : data.products || []);
    } catch (err) {
      console.error(err);
      setError(`Error al cargar productos: ${err.message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, products: false }));
    }
  }, []);

  // Fetch de proveedores
  const fetchSuppliers = useCallback(async () => {
    try {
      setIsLoading(prev => ({ ...prev, suppliers: true }));
      setError(null);
      const resp = await fetch('http://localhost:8080/api/providers');
      if (!resp.ok) throw new Error(`Error HTTP: ${resp.status}`);
      const data = await resp.json();
      setSuppliers(Array.isArray(data) ? data : data.providers || []);
    } catch (err) {
      console.error(err);
      setError(`Error al cargar proveedores: ${err.message}`);
    } finally {
      setIsLoading(prev => ({ ...prev, suppliers: false }));
    }
  }, []);

  // Actualización de stock de un producto
  const updateProductStock = useCallback(async (id, newStock) => {
    try {
      setIsLoading(prev => ({ ...prev, updating: true }));
      const getRes = await fetch(`http://localhost:8080/api/product/${id}`);
      if (!getRes.ok) throw new Error(`Error al obtener producto: ${getRes.status}`);
      const prod = await getRes.json();
      const updated = { ...prod, stock: newStock };
      const putRes = await fetch(`http://localhost:8080/api/product/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-token': token },
        body: JSON.stringify(updated)
      });
      if (!putRes.ok) {
        const errData = await putRes.json();
        throw new Error(errData.message || `Error al actualizar stock: ${putRes.status}`);
      }
      return await putRes.json();
    } finally {
      setIsLoading(prev => ({ ...prev, updating: false }));
    }
  }, [token]);

  // Iniciar proceso gradual de reposición de stock
  const startStockUpdate = useCallback((productId, initStock, target, isResume = false) => {
    localStorage.setItem(
      PENDING_UPDATES_KEY,
      JSON.stringify({ productId, currentStock: initStock, desiredQuantity: target, startedAt: new Date().toISOString() })
    );

    setIsUpdatingStock(true);
    setPurchaseCompleted(true);

    if (!isResume) setCurrentStock(initStock);
    if (updateIntervalRef.current) clearInterval(updateIntervalRef.current);

    let current = initStock;

    const doUpdate = async () => {
      try {
        const next = current + 1;
        await updateProductStock(productId, next);
        setCurrentStock(next);
        setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: next } : p));
        if (selectedProduct?.id === productId) setSelectedProduct(prev => ({ ...prev, stock: next }));

        const pend = JSON.parse(localStorage.getItem(PENDING_UPDATES_KEY));
        if (pend) localStorage.setItem(PENDING_UPDATES_KEY, JSON.stringify({ ...pend, currentStock: next }));

        if (next >= target) {
          clearInterval(updateIntervalRef.current);
          setIsUpdatingStock(false);
          localStorage.removeItem(PENDING_UPDATES_KEY);
          updateIntervalRef.current = null;
          setNotification({ message: '¡Compra completada con éxito!', type: 'success' });
          await fetchProducts();
        }
        current = next;
      } catch {
        clearInterval(updateIntervalRef.current);
        setIsUpdatingStock(false);
        updateIntervalRef.current = null;
        setError('Error al actualizar stock. Intente nuevamente.');
      }
    };

    doUpdate();
    updateIntervalRef.current = setInterval(doUpdate, 5000);
  }, [fetchProducts, selectedProduct?.id, updateProductStock]);

  // Reanudar actualizaciones pendientes tras recarga
  const checkPendingUpdates = useCallback(async () => {
    const pend = JSON.parse(localStorage.getItem(PENDING_UPDATES_KEY)) || {};
    if (pend.productId) {
      try {
        const res = await fetch(`http://localhost:8080/api/product/${pend.productId}`);
        const prod = await res.json();
        if (prod.stock < pend.desiredQuantity) {
          startStockUpdate(pend.productId, prod.stock, pend.desiredQuantity, true);
          setNotification({ message: `Reanudando compra de ${prod.name}`, type: 'info' });
        } else {
          localStorage.removeItem(PENDING_UPDATES_KEY);
        }
      } catch {
        setError('Hubo un problema al reanudar la compra.');
        localStorage.removeItem(PENDING_UPDATES_KEY);
      }
    }
  }, [startStockUpdate]);

  // Efectos
  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
    checkPendingUpdates();
    return () => { if (updateIntervalRef.current) clearInterval(updateIntervalRef.current); };
  }, [fetchProducts, fetchSuppliers, checkPendingUpdates]);

  useEffect(() => {
    if (selectedProduct) {
      setCurrentStock(selectedProduct.stock);
      setDesiredQuantity(selectedProduct.stock + 1);
    }
  }, [selectedProduct]);

  // Handlers de UI
  const handleProductSelect = product => {
    setSelectedProduct(product);
    setSelectedSupplier('');
    setPurchaseCompleted(false);
  };

  const handleGeneratePurchase = () => {
    if (!selectedProduct) {
      setNotification({ message: 'Por favor selecciona un producto.', type: 'error' });
      return;
    }
    if (!selectedSupplier) {
      setNotification({ message: 'Por favor selecciona un proveedor.', type: 'error' });
      return;
    }
    if (desiredQuantity <= selectedProduct.stock) {
      setNotification({ message: `La cantidad debe ser mayor al stock actual (${selectedProduct.stock}).`, type: 'error' });
      return;
    }

    setNotification({ message: `Se envía la solicitud del producto ${selectedProduct.name} al proveedor.`, type: 'info' });
    setIsLoading(prev => ({ ...prev, purchasing: true }));
    startStockUpdate(selectedProduct.id, selectedProduct.stock, desiredQuantity);
    setIsLoading(prev => ({ ...prev, purchasing: false }));
  };

  const cancelStockUpdate = () => {
    if (updateIntervalRef.current) {
      clearInterval(updateIntervalRef.current);
      updateIntervalRef.current = null;
    }
    setIsUpdatingStock(false);
    localStorage.removeItem(PENDING_UPDATES_KEY);
    setPurchaseCompleted(false);
    setNotification({ message: 'Compra cancelada.', type: 'error' });
  };

  if (error) {
    return (
      <div className="purchase-simulator error">
        <h2>Error en la aplicación</h2>
        <p>{error}</p>
        <button onClick={() => setError(null)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="purchase-simulator">
      <h2>Compra de productos</h2>
      {/* Banner de notificación */}
      {notification.message && (
        <div className={`notification ${notification.type}`}>        
          <span>{notification.message}</span>
          <button className="notification-close" onClick={() => setNotification({ message: '', type: '' })}>
            ×
          </button>
        </div>
      )}

      <div className="purchase-content">
        {/* Sección Productos con pocas unidades */}
        <div className="product-selection">
          <h3>Productos con pocas unidades</h3>
          {isLoading.products ? (
            <p>Cargando productos...</p>
          ) : lowStockProducts.length === 0 ? (
            <p>No hay productos con pocas unidades</p>
          ) : (
            <ul className="product-list">
              {lowStockProducts.map(prod => (
                <li
                  key={prod.id}
                  className={`product-item ${selectedProduct?.id === prod.id ? 'selected' : ''}`}
                  onClick={() => handleProductSelect(prod)}
                >
                  <span className="product-name">{prod.name}</span>
                  <span className="product-stock">Stock: {prod.stock}</span>
                  {prod.price && <span className="product-price">Precio: ${prod.price}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>
        {/* Formulario de compra */}
        {selectedProduct && (
          <div className="purchase-form">
            <h3>Detalles de compra para: {selectedProduct.name}</h3>
            <div className="stock-info">
              <p>
                Stock actual: <span className="stock-value">{currentStock}</span>
              </p>
              {isUpdatingStock && (
                <>
                  <p className="stock-progress">
                    recibiendo productos... ({currentStock}/{desiredQuantity})
                  </p>
                  <button onClick={cancelStockUpdate} className="cancel-button">
                    Cancelar compra a proveedores
                  </button>
                </>
              )}
              {purchaseCompleted && !isUpdatingStock && (
                <p className="stock-complete">compra a proveedores completada!</p>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="supplier-select">Proveedor:</label>
              {isLoading.suppliers ? (
                <p>Cargando proveedores...</p>
              ) : (
                <select
                  id="supplier-select"
                  value={selectedSupplier}
                  onChange={e => setSelectedSupplier(e.target.value)}
                  disabled={isUpdatingStock}
                >
                  <option value="">Seleccione un proveedor</option>
                  {suppliers.map(sup => (
                    <option key={sup.id} value={sup.id}>
                      {sup.name} – {sup.contact || 'Sin contacto'}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="quantity-input">Cantidad deseada:</label>
              <input
                id="quantity-input"
                type="number"
                min={selectedProduct.stock + 1}
                value={desiredQuantity}
                onChange={e => setDesiredQuantity(
                  Math.max(
                    selectedProduct.stock + 1,
                    parseInt(e.target.value, 10) || selectedProduct.stock + 1
                  )
                )}
                disabled={isUpdatingStock}
              />
              <small>Mínimo: {selectedProduct.stock + 1}</small>
            </div>
            <button
              onClick={handleGeneratePurchase}
              disabled={
                isLoading.purchasing ||
                isLoading.updating ||
                isUpdatingStock ||
                !selectedSupplier
              }
              className="purchase-button"
            >
              {isLoading.purchasing ? 'Generando…' : 'Compra en proceso'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}