import React, { useState, useEffect } from 'react';
import './Recomendacion.css';

const Recomendacion = () => {
    const [ID_Cliente, setID_Cliente] = useState('');
    const [Historial_Compras, setHistorial_Compras] = useState(0);
    const [Monto_Promedio, setMonto_Promedio] = useState(0);
    const [Frecuencia_Compra, setFrecuencia_Compra] = useState(0);
    const [Categoria_Favorita, setCategoria_Favorita] = useState('');
    const [Ultima_Compra, setUltima_Compra] = useState(0);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recommendation, setRecommendation] = useState(null);
    const [error, setError] = useState('');

    // Cargar categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                
                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                
                const data = await response.json();
                
                // Extraer categorías de diferentes formatos posibles
                let categoriesData = [];
                if (Array.isArray(data)) {
                    categoriesData = data;
                } else if (data.data && Array.isArray(data.data)) {
                    categoriesData = data.data;
                } else if (data.categories && Array.isArray(data.categories)) {
                    categoriesData = data.categories;
                }

                setCategories(categoriesData);
            } catch (err) {
                setError(err.message || 'Error al cargar las categorías');
                setCategories([]);
            }
        };    
        fetchCategories();
    }, []);

    const handlePredict = async () => {
        if (!ID_Cliente || !Categoria_Favorita) {
            setError('Por favor complete todos los campos');
            return;
        }

        setLoading(true);
        setError('');
    
        try {
            const response = await fetch('http://localhost:8081/api/recomendacion/predecir', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    idCliente: ID_Cliente, // Cambiado a minúscula
                    historialCompras: Historial_Compras, // Cambiado a minúscula
                    montoPromedio: Monto_Promedio, // Cambiado a minúscula
                    frecuenciaCompra: Frecuencia_Compra, // Cambiado a minúscula
                    categoriaFavorita: Categoria_Favorita, // Cambiado a minúscula
                    ultimaCompra: Ultima_Compra // Cambiado a minúscula
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Error al generar la recomendación');
            }

            const data = await response.json();
            setRecommendation(data);
        } catch (err) {
            setError(err.message || 'Error al generar la recomendación');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setRecommendation(null);
    };

    return (
        <div className="recomendacion-container">
            {!recommendation ? (
                <div className="recomendacion-card">
                    <h1 className="recomendacion-title">Recomendación de Productos</h1>
                    <p className="recomendacion-subtitle">Análisis predictivo para clientes</p>
                    <div className="form-fields">
                        <div className="form-row">
                            <label>ID Cliente:</label>
                            <input type="text" value={ID_Cliente} onChange={(e) => setID_Cliente(e.target.value)} className="form-input" />
                        </div>
                        <div className="form-row">
                            <label>Historial Compras:</label>
                            <input type="number" value={Historial_Compras} onChange={(e) => setHistorial_Compras(parseInt(e.target.value) || 0)} className="form-input" min="0" />
                        </div>
                        <div className="form-row">
                            <label>Monto promedio (COP):</label>
                            <input type="number" value={Monto_Promedio} onChange={(e) => setMonto_Promedio(parseFloat(e.target.value) || 0)} className="form-input" min="0" step="1000" />
                        </div>
                        <div className="form-row">
                            <label>Frecuencia de compras en el mes:</label>
                            <input type="number" step="0" value={Frecuencia_Compra} onChange={(e) => setFrecuencia_Compra(parseFloat(e.target.value) || 0)} className="form-input" min="0" />
                        </div>
                        <div className="form-row">
                            <label>Categoría favorita:</label>
                            <select value={Categoria_Favorita} onChange={(e) => setCategoria_Favorita(e.target.value)} className="form-select" required >
                                <option value="">Seleccione una categoría</option>
                                {categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option 
                                            key={category.id || category.categoryId || category.nombre} 
                                            value={category.nombre || category.name || category.categoryName}>
                                            {category.nombre || category.name || category.categoryName || 'Categoría sin nombre'}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No hay categorías disponibles</option>
                                )}
                            </select>
                        </div>
                        <div className="form-row">
                            <label>Días desde última compra:</label>
                            <input type="number" value={Ultima_Compra} onChange={(e) => setUltima_Compra(parseInt(e.target.value) || 0)} className="form-input" min="0" />
                        </div>
                    </div>
                    {error && (
                        <div className="error-message">
                            <p>{error}</p>
                        </div>
                    )}
                    <button onClick={handlePredict} disabled={loading} className="btn btn-primary">
                        {loading ? 'Generando...' : 'Generar Recomendación'}
                    </button>
                </div>
            ) : (
                <div className="result-card">
                    <h1 className="result-title">Resultado de Recomendación</h1>
                    <p className="confidence">Confianza: {recommendation.confianza || 100}%</p>
                    <div className="divider"></div>
                        <h2 className="client-data-title">Datos del Cliente</h2>
                        <div className="data-grid">
                            <div className="data-item">
                            <p className="data-label">ID Cliente:</p>
                            <p className="data-value">{recommendation.ID_Cliente || ID_Cliente}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Historial Compras:</p>
                            <p className="data-value">{recommendation.Historial_Compras || Historial_Compras}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Monto Promedio:</p>
                            <p className="data-value">${(recommendation.Monto_Promedio || Monto_Promedio).toLocaleString('es-CO')}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Frecuencia:</p>
                            <p className="data-value">{recommendation.Frecuencia_Compra || Frecuencia_Compra}/mes</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Categoría Favorita:</p>
                            <p className="data-value">{recommendation.Categoria_Favorita || Categoria_Favorita}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Última Compra:</p>
                            <p className="data-value">{recommendation.Ultima_Compra || Ultima_Compra} días</p>
                        </div>
                    </div>
                    {recommendation.recomendacion && (
                        <div className="recommendation-section">
                            <h3 className="section-title">Recomendación:</h3>
                            <p className="recommendation-text">{recommendation.recomendacion}</p>
                        </div>
                    )}
                    <button onClick={resetForm} className="btn btn-secondary">
                        Volver a generar recomendación
                    </button>
                </div>
            )}
        </div>
    );
};

export default Recomendacion;