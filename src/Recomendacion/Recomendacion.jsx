import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Recomendacion.css';

const categoryMapping = {
  'Estufas': 'Estufas',
  'Freidoras': 'Freidoras',
  'Barbacoas Y Planchas': 'Barbacoas_y_planchas',
  'Campanas Y Extractores': 'Campanas_y_extractores',
  'Otros Equipos': 'Otros_equipos'
};

const Recomendacion = () => {
  const { id: paramId } = useParams();
  const [ID_Cliente, setID_Cliente] = useState('');
  const [Historial_Compras, setHistorial_Compras] = useState('');
  const [Monto_Promedio, setMonto_Promedio] = useState('');
  const [Frecuencia_Compra, setFrecuencia_Compra] = useState('');
  const [Categoria_Favorita, setCategoria_Favorita] = useState('');
  const [Categoria_Favorita_ID, setCategoria_Favorita_ID] = useState('');
  const [Ultima_Compra, setUltima_Compra] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  const [error, setError] = useState('');
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [clientDataLoading, setClientDataLoading] = useState(false);
  const [clientId, setClientId] = useState(null);
  const navigate = useNavigate();

  // 1) Obtener clientId de params o localStorage
  const getClientId = useCallback(() => {
    const stored = localStorage.getItem('clientId');
    return paramId || stored || null;
  }, [paramId]);

  useEffect(() => {
    const cId = getClientId();
    setClientId(cId);
    setID_Cliente(cId || '');
  }, [getClientId]);

  // 2) Cargar categorías
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch('http://localhost:8080/api/categories');
        const json = await resp.json();
        const list = Array.isArray(json)
          ? json
          : Array.isArray(json.data)
            ? json.data
            : Array.isArray(json.categories)
              ? json.categories
              : [];
        setCategories(list);
      } catch {
        setCategories([]);
      }
    })();
  }, []);

  // 3) Función unificada: POST /client/{id} devuelve datos + recomendación + confianza
  const fetchClientAndRecommendation = useCallback(async () => {
    if (!clientId) return;

    setClientDataLoading(true);
    setError('');

    try {
      const resp = await fetch(
        `http://localhost:8081/api/recomendation/client/${clientId}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({}) // body vacío, tu controller no lo usa
        }
      );
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error(`Error ${resp.status}: ${txt}`);
      }
      const data = await resp.json();

      // 3a) Rellenar campos del formulario
      setHistorial_Compras(data.historialCompras?.toString() || '');
      setMonto_Promedio(data.montoPromedio != null
        ? data.montoPromedio.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : ''
      );
      setFrecuencia_Compra(data.frecuenciaCompra?.toString() || '');
      setUltima_Compra(data.ultimaCompra?.toString() || '');

      // 3b) Categoría favorita
      const backCat = data.categoriaFavorita;
      if (backCat) {
        const frontCat = Object.keys(categoryMapping)
          .find(k => categoryMapping[k] === backCat) || backCat;
        setCategoria_Favorita(frontCat);

        const sel = categories.find(cat =>
          [cat.nombre, cat.name, cat.categoryName].includes(frontCat)
        );
        if (sel) setCategoria_Favorita_ID(sel.id || sel.categoryId || '');
      }

      // 3c) Recomendación y confianza
      setRecommendation({
        recomendacion: data.recomendacion,
        confianza: data.confianza
      });

      // 3d) Si es positiva, cargar productos recomendados
      if (
        data.recomendacion?.toLowerCase().includes('sí') ||
        data.recomendacion?.toLowerCase().includes('si') ||
        data.recomendacion?.toLowerCase().includes('yes')
      ) {
        if (Categoria_Favorita_ID) {
          setProductsLoading(true);
          const prodResp = await fetch(
            `http://localhost:8080/api/product/category/${Categoria_Favorita_ID}`
          );
          const prodJson = await prodResp.json();
          setRecommendedProducts(Array.isArray(prodJson)
            ? prodJson
            : prodJson.products || prodJson.items || []
          );
          setProductsLoading(false);
        }
      }

    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setClientDataLoading(false);
      setLoading(false);
    }
  }, [clientId, categories, Categoria_Favorita_ID]);

  // 4) Al cambiar clientId, obtener datos + recomendación
  useEffect(() => {
    fetchClientAndRecommendation();
  }, [fetchClientAndRecommendation]);

  // 5) Botón “Generar Recomendación” sólo re-dispara la misma función
  const handlePredict = () => {
    setLoading(true);
    setRecommendation(null);
    fetchClientAndRecommendation();
  };

  const resetForm = () => {
    setRecommendation(null);
    setRecommendedProducts([]);
    setError('');
  };

  const handleViewRecommendedProducts = () => {
    if (Categoria_Favorita_ID) {
      navigate(`/category/${Categoria_Favorita_ID}`);
    } else {
      setError('No se pudo determinar la categoría seleccionada');
    }
  };

  return (
    <div className="recomendacion-container">
      {!recommendation ? (
        <div className="recomendacion-card">
          <div className="header-section">
            <h1 className="recomendacion-title">Recomendación de Productos</h1>
            <p className="recomendacion-subtitle">
              Complete los datos del cliente para generar un análisis predictivo
            </p>
          </div>

          {(clientDataLoading || loading) && (
            <div className="loading-message">
              <svg className="spinner" viewBox="0 0 50 50">
                <circle
                  cx="25"
                  cy="25"
                  r="20"
                  fill="none"
                  stroke="#3498db"
                  strokeWidth="5"
                />
              </svg>
              <p>{clientDataLoading ? 'Cargando datos...' : 'Generando...'}</p>
            </div>
          )}

          <div className="form-fields">
            {/* ID Cliente */}
            <div className="form-row">
              <label>ID Cliente</label>
              <input
                type="text"
                value={ID_Cliente}
                disabled
                className="form-input"
              />
            </div>

            {/* Historial */}
            <div className="form-row">
              <label>Historial de Compras (unidades)</label>
              <input
                type="text"
                value={Historial_Compras}
                disabled
                className="form-input"
              />
            </div>

            {/* Monto */}
            <div className="form-row">
              <label>Monto promedio (COP)</label>
              <input
                type="text"
                value={Monto_Promedio}
                disabled
                className="form-input"
              />
            </div>

            {/* Frecuencia */}
            <div className="form-row">
              <label>Frecuencia de compras (mensual)</label>
              <input
                type="text"
                value={Frecuencia_Compra}
                disabled
                className="form-input"
              />
            </div>

            {/* Categoría favorita */}
            <div className="form-row">
              <label>Categoría favorita</label>
              <input
                type="text"
                value={Categoria_Favorita}
                disabled
                className="form-input"
              />
            </div>

            {/* Última compra */}
            <div className="form-row">
              <label>Días desde última compra</label>
              <input
                type="text"
                value={Ultima_Compra}
                disabled
                className="form-input"
              />
            </div>
          </div>

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}

          <div className="actions">
            <button
              onClick={handlePredict}
              disabled={clientDataLoading || loading}
              className="btn btn-primary"
            >
              Generar Recomendación
            </button>
          </div>
        </div>
      ) : (
        <div className="result-card">
          <h1 className="result-title">Resultado de Predicción:</h1>
          <p className="confidence">Confianza: {recommendation.confianza}</p>
          <div className="divider" />
          <p className="recommendation-text">
            Recomendación: <span>{recommendation.recomendacion}</span>
          </p>

          {recommendedProducts.length > 0 && (
            <div className="product-recommendation">
              <p>Productos Recomendados:</p>
              {productsLoading ? (
                <p>Cargando productos...</p>
              ) : (
                <div className="product-list">
                  {recommendedProducts.map((p) => (
                    <div key={p.id} className="product-item">
                      <p>{p.name || p.productName}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="error-message">
              <p>⚠️ {error}</p>
            </div>
          )}

          <div className="actions">
            <button onClick={resetForm} className="btn btn-secondary">
              Realizar otra consulta
            </button>
            {recommendedProducts.length > 0 && (
              <button
                onClick={handleViewRecommendedProducts}
                className="btn btn-primary"
              >
                Ver Productos
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Recomendacion;
