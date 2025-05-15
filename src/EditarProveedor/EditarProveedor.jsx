import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faSpinner, faSave, faTimes, faSearch, faBuilding, faUser, faEnvelope, faPhone, faBox, faMapMarkerAlt, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import './EditarProveedor.css';

const EditarProveedor = () => {
    const [providers, setProviders] = useState([]);
    const [selectedProvider, setSelectedProvider] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        company: '',
        contact: '',
        email: '',
        phone: '',
        productexport: '',
        address: '',
        state: true
    });
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [showList, setShowList] = useState(true);

    // Detectar cambios en el tamaño de la pantalla
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Cargar lista de proveedores
    useEffect(() => {
        const fetchProviders = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/providers');
                if (!response.ok) throw new Error('Error al cargar proveedores');
                const data = await response.json();
                setProviders(data.providers);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProviders();
    }, []);

    // Filtrar proveedores
    const filteredProviders = providers.filter(provider => 
        provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        provider.company.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Manejar selección de proveedor
    const handleSelectProvider = (provider) => {
        setSelectedProvider(provider);
        setFormData({
            name: provider.name,
            company: provider.company,
            contact: provider.contact,
            email: provider.email,
            phone: provider.phone,
            productexport: provider.productexport,
            address: provider.address,
            state: provider.state
        });
        setError(null);
        setSuccessMessage(null);
        
        if (isMobile) {
            setShowList(false);
        }
    };

    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Guardar cambios
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccessMessage(null);
    
        try {
            const response = await fetch(`http://localhost:8080/api/providers/${selectedProvider.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al actualizar proveedor');
            }

            const updatedProvider = await response.json();
            setProviders(providers.map(p => 
                p.id === selectedProvider.id ? updatedProvider.provider : p
            ));
            setSelectedProvider(updatedProvider.provider);
            setSuccessMessage('Los cambios se guardaron correctamente');
            
            setTimeout(() => {
                setSuccessMessage(null);
            }, 5000);
            
        } catch (err) {
            setError(err.message || 'Ocurrió un error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    };

    // Volver a la lista en móvil
    const handleBackToList = () => {
        setShowList(true);
        setSelectedProvider(null);
    };

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <FontAwesomeIcon icon={faSpinner} spin size="2x" />
                </div>
                <p>Cargando proveedores...</p>
            </div>
        );
    }

    return (
        <div className="ep-main-container">
            <div className="ep-edit-provider-container">
                <div className="ep-header-section">
                    <h1 className="ep-main-title">Editar Proveedor Existente</h1>
                    <div className="ep-search-container">
                        <FontAwesomeIcon icon={faSearch} className="ep-search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="ep-search-input"
                        />
                    </div>
                </div>

                <div className="ep-content-wrapper">
                    {/* Panel izquierdo - Lista de proveedores */}
                    {(!isMobile || showList) && (
                        <div className="ep-providers-list-section">
                            <h2 className="ep-section-title">Proveedores Disponibles</h2>
                            <div className="ep-providers-list-container">
                                {filteredProviders.length === 0 ? (
                                <div className="ep-empty-state">
                                    {searchTerm ? 'No se encontraron resultados' : 'No hay proveedores registrados'}
                                </div>
                                ) : (
                                    filteredProviders.map(provider => (
                                        <div
                                            key={provider.id}
                                            className={`ep-provider-card ${selectedProvider?.id === provider.id ? 'active' : ''}`}
                                            onClick={() => handleSelectProvider(provider)}
                                        >
                                            <div className="ep-provider-main-info">
                                                <h3 className="ep-provider-name">{provider.name}</h3>
                                                <p className="ep-provider-company">
                                                    <FontAwesomeIcon icon={faBuilding} /> {provider.company}
                                                </p>
                                            </div>
                                            <div className="ep-provider-secondary-info">
                                                <p className="ep-product-export">
                                                    <FontAwesomeIcon icon={faBox} /> {provider.productexport}
                                                </p>
                                                <button 
                                                    className="ep-edit-btn"
                                                    onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSelectProvider(provider);
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Panel derecho - Formulario de edición */}
                    {(!isMobile || !showList) && (
                        <div className="ep-edit-form-section">
                            {isMobile && (
                                <button className="ep-back-button" onClick={handleBackToList}>
                                    <FontAwesomeIcon icon={faTimes} /> Volver a la lista
                                </button>
                            )}
                            
                            {selectedProvider ? (
                                <>
                                <div className="ep-form-header">
                                    <h2 className="ep-form-title">Editar Información del Proveedor</h2>
                                    <p className="ep-form-subtitle">Modifica los detalles del proveedor seleccionado</p>
                                </div>

                                {error && (
                                    <div className="ep-alert-message error">
                                        <FontAwesomeIcon icon={faExclamationCircle} />
                                        <span>{error}</span>
                                    </div>
                                )}
                                
                                {successMessage && (
                                    <div className="ep-alert-message success">
                                        <FontAwesomeIcon icon={faCheckCircle} />
                                        <span>{successMessage}</span>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="ep-provider-form">
                                    <div className="ep-form-section ep-table-view">
                                        <h3 className="ep-form-section-title">
                                            <FontAwesomeIcon icon={faUser} /> Información Básica
                                        </h3>
                                        <table className="ep-form-table">
                                            <thead>
                                                <tr>
                                                    <th>Nombre</th>
                                                    <th>Empresa</th>
                                                    <th>Contacto</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faUser} />
                                                                <input
                                                                    type="text"
                                                                    name="name"
                                                                    value={formData.name}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faBuilding} />
                                                                <input
                                                                    type="text"
                                                                    name="company"
                                                                    value={formData.company}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faUser} />
                                                                <input
                                                                    type="text"
                                                                    name="contact"
                                                                    value={formData.contact}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="ep-form-section ep-table-view">
                                        <h3 className="ep-form-section-title">
                                            <FontAwesomeIcon icon={faEnvelope} /> Información de Contacto
                                        </h3>
                                        <table className="ep-form-table">
                                            <thead>
                                                <tr>
                                                    <th>Email</th>
                                                    <th>Teléfono</th>
                                                    <th>Dirección</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faEnvelope} />
                                                                <input
                                                                    type="email"
                                                                    name="email"
                                                                    value={formData.email}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faPhone} />
                                                                <input
                                                                    type="text"
                                                                    name="phone"
                                                                    value={formData.phone}
                                                                    onChange={handleChange}
                                                                    required
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div className="ep-form-group">
                                                            <div className="ep-input-with-icon">
                                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                                <input
                                                                    type="text"
                                                                    name="address"
                                                                    value={formData.address}
                                                                    onChange={handleChange}
                                                                />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>

                                    <div className="ep-form-section">
                                        <h3 className="ep-form-section-title">
                                            <FontAwesomeIcon icon={faBox} /> Información Comercial
                                        </h3>
                                        <div className="ep-form-group">
                                            <label className="ep-input-label">Producto de Exportación</label>
                                            <div className="ep-input-with-icon">
                                                <FontAwesomeIcon icon={faBox} />
                                                <input
                                                    type="text"
                                                    name="productexport"
                                                    value={formData.productexport}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="ep-form-group ep-switch-group">
                                            <label className="ep-switch">
                                                <input
                                                    type="checkbox"
                                                    name="state"
                                                    checked={formData.state}
                                                    onChange={handleChange}
                                                />
                                                <span className="ep-slider round"></span>
                                            </label>
                                            <span className="ep-switch-label">Proveedor activo</span>
                                        </div>
                                    </div>

                                    <div className="ep-form-actions">
                                        <button
                                            type="button"
                                            className="ep-cancel-btn"
                                            onClick={() => isMobile ? handleBackToList() : setSelectedProvider(null)}
                                            disabled={saving}
                                        >
                                            <FontAwesomeIcon icon={faTimes} /> Cancelar
                                        </button>
                                        <button type="submit" className="ep-save-btn" disabled={saving}>
                                            {saving ? (
                                                <>
                                                    <FontAwesomeIcon icon={faSpinner} spin /> Guardando...
                                                </>
                                            ) : (
                                                <>
                                                    <FontAwesomeIcon icon={faSave} /> Guardar Cambios
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                                </>
                            ) : (
                                <div className="ep-no-selection-prompt">
                                    <FontAwesomeIcon icon={faEdit} className="ep-prompt-icon" />
                                    <h3>Selecciona un proveedor</h3>
                                    <p>Haz clic en un proveedor de la lista para editarlo</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditarProveedor;