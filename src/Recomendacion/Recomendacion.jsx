import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Recomendacion.css';

const Recomendacion = () => {
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
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                
                if (!response.ok) {
                    throw new Error('Error al cargar las categorías');
                }
                
                const data = await response.json();
                
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

    const handleCategoryChange = (e) => {
        const selectedCategoryName = e.target.value;
        const selectedCategory = categories.find(cat => 
            cat.nombre === selectedCategoryName || 
            cat.name === selectedCategoryName || 
            cat.categoryName === selectedCategoryName
        );
        
        setCategoria_Favorita(selectedCategoryName);
        setCategoria_Favorita_ID(selectedCategory?.id || selectedCategory?.categoryId || '');
    };

    const handleMontoChange = (e) => {
        const value = e.target.value.replace(/\./g, '');
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            const numberValue = value === '' ? '' : parseInt(value, 10);
            setMonto_Promedio(value === '' ? '' : numberValue.toLocaleString('es-CO'));
        }
    };

    const parseMontoToNumber = (monto) => {
        return monto ? parseInt(monto.replace(/\./g, ''), 10) : 0;
    };

    const handleNumericChange = (setter) => (e) => {
        const value = e.target.value;
        if (value === '' || /^[0-9\b]+$/.test(value)) {
            setter(value === '' ? '' : value);
        }
    };

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
                    idCliente: ID_Cliente,
                    historialCompras: Historial_Compras ? parseInt(Historial_Compras, 10) : 0,
                    montoPromedio: Monto_Promedio ? parseMontoToNumber(Monto_Promedio) : 0,
                    frecuenciaCompra: Frecuencia_Compra ? parseInt(Frecuencia_Compra, 10) : 0,
                    categoriaFavorita: Categoria_Favorita,
                    ultimaCompra: Ultima_Compra ? parseInt(Ultima_Compra, 10) : 0
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

    const handleViewRecommendedProducts = () => {
        if (Categoria_Favorita_ID) {
            navigate(`/category/${Categoria_Favorita_ID}`);
        } else {
            setError('No se pudo determinar la categoría seleccionada');
        }
    };

    const resetForm = () => {
        setRecommendation(null);
        setID_Cliente('');
        setHistorial_Compras('');
        setMonto_Promedio('');
        setFrecuencia_Compra('');
        setCategoria_Favorita('');
        setCategoria_Favorita_ID('');
        setUltima_Compra('');
    };

    const isPositiveRecommendation = () => {
        if (!recommendation || !recommendation.recomendacion) return false;
        return recommendation.recomendacion.toLowerCase().includes('sí') || 
               recommendation.recomendacion.toLowerCase().includes('si') ||
               recommendation.recomendacion.toLowerCase().includes('yes');
    };

    return (
        <div className="recomendacion-container">
            {!recommendation ? (
                <div className="recomendacion-card">
                    <div className="header-section">
                        <h1 className="recomendacion-title">Recomendación de Productos</h1>
                        <p className="recomendacion-subtitle">Complete los datos del cliente para generar un análisis predicion</p>
                    </div>
                    
                    <div className="form-fields">
                        {/* Primera fila con 3 campos */}
                        <div className="form-row-group">
                            <div className="form-row">
                                <label>ID Cliente</label>
                                <input 
                                    type="text" 
                                    value={ID_Cliente} 
                                    onChange={(e) => setID_Cliente(e.target.value)} 
                                    className="form-input"
                                    placeholder="Ej: 1" 
                                />
                            </div>
                            
                            <div className="form-row">
                                <label>Historial de Compras (unidades)</label>
                                <input 
                                    type="text" 
                                    value={Historial_Compras} 
                                    onChange={handleNumericChange(setHistorial_Compras)} 
                                    className="form-input"
                                    placeholder="Número total de compras"
                                    inputMode="numeric"
                                />
                            </div>
                            
                            <div className="form-row">
                                <label>Monto promedio (COP)</label>
                                <input 
                                    type="text" 
                                    value={Monto_Promedio} 
                                    onChange={handleMontoChange} 
                                    className="form-input"
                                    placeholder="Ej: 1.000.000"
                                    inputMode="numeric"
                                />
                            </div>
                        </div>
                        
                        {/* Segunda fila con otros 3 campos */}
                        <div className="form-row-group">
                            <div className="form-row">
                                <label>Frecuencia de compras (mensual)</label>
                                <input 
                                    type="text" 
                                    value={Frecuencia_Compra} 
                                    onChange={handleNumericChange(setFrecuencia_Compra)} 
                                    className="form-input"
                                    placeholder="Veces al mes"
                                    inputMode="numeric"
                                />
                            </div>
                            
                            <div className="form-row">
                                <label>Categoría favorita</label>
                                <select 
                                    value={Categoria_Favorita} 
                                    onChange={handleCategoryChange} 
                                    className="form-select"
                                    required
                                >
                                    <option value="">Seleccione una categoría</option>
                                    {categories.length > 0 ? (
                                        categories.map((category) => (
                                            <option 
                                                key={category.id || category.categoryId || category.nombre} 
                                                value={category.nombre || category.name || category.categoryName}
                                            >
                                                {category.nombre || category.name || category.categoryName || 'Categoría sin nombre'}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="" disabled>Cargando categorías...</option>
                                    )}
                                </select>
                            </div>
                            
                            <div className="form-row">
                                <label>Días desde última compra</label>
                                <input 
                                    type="text" 
                                    value={Ultima_Compra} 
                                    onChange={handleNumericChange(setUltima_Compra)} 
                                    className="form-input"
                                    placeholder="Número de días"
                                    inputMode="numeric"
                                />
                            </div>
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
                            disabled={loading} 
                            className={`btn btn-primary ${loading ? 'loading-pulse' : ''}`}
                        >
                            {loading ? (
                                <>
                                    <svg className="spinner" viewBox="0 0 50 50">
                                        <circle cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="5"></circle>
                                    </svg>
                                    Generando...
                                </>
                            ) : 'Generar Recomendación'}
                        </button>
                    </div>
                </div>
            ) : (
                <div className="result-card">
                    <h1 className="result-title">Resultado de Prediccion:</h1>
                    <p className="confidence">Confianza: {recommendation.confianza || 100}</p>
                    
                    <div className="divider"></div>
                    
                    <h2 className="client-data-title">Resumen del Cliente</h2>
                    <div className="data-grid">
                        <div className="data-item">
                            <p className="data-label">ID Cliente:</p>
                            <p className="data-value">{recommendation.ID_Cliente || ID_Cliente}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Compras totales:</p>
                            <p className="data-value">{recommendation.Historial_Compras || (Historial_Compras || '0')}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Monto promedio:</p>
                            <p className="data-value">{((recommendation.Monto_Promedio || parseMontoToNumber(Monto_Promedio)) || 0).toLocaleString('es-CO')} COP</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Frecuencia:</p>
                            <p className="data-value">{(recommendation.Frecuencia_Compra || (Frecuencia_Compra || '0'))}/mes</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Categoría favorita:</p>
                            <p className="data-value">{recommendation.Categoria_Favorita || Categoria_Favorita}</p>
                        </div>
                        <div className="data-item">
                            <p className="data-label">Última compra:</p>
                            <p className="data-value">{(recommendation.Ultima_Compra || (Ultima_Compra || '0'))} días</p>
                        </div>
                    </div>
                    
                    <div className="recommendation-section">
                        <h3 className="section-title">Es Usted Recomendable:</h3>
                        <p className="recommendation-text">
                            {recommendation.recomendacion || "No se pudo generar una recomendación específica."}
                        </p>
                    </div>
                    
                    <div className="actions">
                        {isPositiveRecommendation() ? (
                            <button 
                                onClick={handleViewRecommendedProducts} 
                                className="btn btn-primary"
                            >
                                Ver productos recomendados
                            </button>
                        ) : (
                            <div className="alert-message">
                                <p>🔍 Lo sentimos no muestra patrones de compra regulares.</p>
                            </div>
                        )}
                        
                        <button onClick={resetForm} className="btn btn-secondary">
                            Realizar nuevo análisis
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Recomendacion;