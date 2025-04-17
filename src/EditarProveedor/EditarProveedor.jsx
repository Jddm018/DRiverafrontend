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
        <div className="main-container">
            <div className="edit-provider-container">
                <div className="header-section">
                    <h1 className="main-title">Editar Proveedor Existente</h1>
                    <div className="search-container">
                        <FontAwesomeIcon icon={faSearch} className="search-icon" />
                        <input
                            type="text"
                            placeholder="Buscar proveedor..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>
                </div>

                <div className="content-wrapper">
                    {/* Panel izquierdo - Lista de proveedores */}
                    <div className="providers-list-section">
                        <h2 className="section-title">Proveedores Disponibles</h2>
                        <div className="providers-list-container">
                            {filteredProviders.length === 0 ? (
                            <div className="empty-state">
                                {searchTerm ? 'No se encontraron resultados' : 'No hay proveedores registrados'}
                            </div>
                            ) : (
                                filteredProviders.map(provider => (
                                    <div
                                        key={provider.id}
                                        className={`provider-card ${selectedProvider?.id === provider.id ? 'active' : ''}`}
                                        onClick={() => handleSelectProvider(provider)}
                                    >
                                        <div className="provider-main-info">
                                            <h3 className="provider-name">{provider.name}</h3>
                                            <p className="provider-company">
                                                <FontAwesomeIcon icon={faBuilding} /> {provider.company}
                                            </p>
                                        </div>
                                        <div className="provider-secondary-info">
                                            <p className="product-export">
                                                <FontAwesomeIcon icon={faBox} /> {provider.productexport}
                                            </p>
                                            <button 
                                                className="edit-btn"
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

                    {/* Panel derecho - Formulario de edición */}
                    <div className="edit-form-section">
                        {selectedProvider ? (
                            <>
                            <div className="form-header">
                                <h2 className="form-title">Editar Información del Proveedor</h2>
                                <p className="form-subtitle">Modifica los detalles del proveedor seleccionado</p>
                            </div>

                            {error && (
                                <div className="alert-message error">
                                    <FontAwesomeIcon icon={faExclamationCircle} />
                                    <span>{error}</span>
                                </div>
                            )}
                            
                            {successMessage && (
                                <div className="alert-message success">
                                    <FontAwesomeIcon icon={faCheckCircle} />
                                    <span>{successMessage}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="provider-form">
                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FontAwesomeIcon icon={faUser} /> Información Básica
                                    </h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Nombre</label>
                                            <div className="input-with-icon">
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

                                        <div className="form-group">
                                            <label>Empresa</label>
                                            <div className="input-with-icon">
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

                                        <div className="form-group">
                                            <label>Contacto</label>
                                            <div className="input-with-icon">
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
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FontAwesomeIcon icon={faEnvelope} /> Información de Contacto
                                    </h3>
                                    <div className="form-grid">
                                        <div className="form-group">
                                            <label>Email</label>
                                            <div className="input-with-icon">
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

                                        <div className="form-group">
                                            <label>Teléfono</label>
                                            <div className="input-with-icon">
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

                                        <div className="form-group">
                                            <label>Dirección</label>
                                            <div className="input-with-icon">
                                                <FontAwesomeIcon icon={faMapMarkerAlt} />
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-section">
                                    <h3 className="form-section-title">
                                        <FontAwesomeIcon icon={faBox} /> Información Comercial
                                    </h3>
                                    <div className="form-group">
                                        <label>Producto de Exportación</label>
                                        <div className="input-with-icon">
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

                                    <div className="form-group switch-group">
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                name="state"
                                                checked={formData.state}
                                                onChange={handleChange}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                        <span className="switch-label">Proveedor activo</span>
                                    </div>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setSelectedProvider(null)}
                                        disabled={saving}
                                    >
                                        <FontAwesomeIcon icon={faTimes} /> Cancelar
                                    </button>
                                    <button type="submit" className="save-btn" disabled={saving}>
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
                            <div className="no-selection-prompt">
                                <FontAwesomeIcon icon={faEdit} className="prompt-icon" />
                                <h3>Selecciona un proveedor</h3>
                                <p>Haz clic en un proveedor de la lista para editarlo</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarProveedor;