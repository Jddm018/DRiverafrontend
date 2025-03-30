import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner, faCheckCircle, faExclamationTriangle, faSearch } from '@fortawesome/free-solid-svg-icons';
import './EditarProductos.css';

const EditarProducto = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        description: '',
        price: '',
        images: null,
        category: ''
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({
        show: false,
        message: '',
        type: ''
    });
    const [searchTerm, setSearchTerm] = useState('');

    // Función para formatear números con separadores de miles
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('es-CO', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(value);
    };

    // Función para parsear el valor numérico (remover puntos)
    const parseCurrency = (value) => {
        return value.replace(/\./g, '');
    };

    // Obtener productos y categorías al cargar el componente
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('http://localhost:8080/api/product'),
                    fetch('http://localhost:8080/api/categories')
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Error al cargar datos');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData.products);
                setCategories(categoriesData.categories);
            } catch (error) {
                console.error('Error:', error);
                setNotification({
                    show: true,
                    message: 'Error al cargar datos',
                    type: 'error'
                });
            }
        };
        fetchData();
    }, []);
    // Manejar búsqueda de productos
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };
    // Filtrar productos según término de búsqueda
    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    // Seleccionar producto para edición
    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            title: product.title || '',
            description: product.description,
            price: formatCurrency(product.price), 
            images: null,
            category: product.category._id
        });
    };
    // Manejar cambios en el formulario
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        // Manejo especial para el campo de precio
        if (name === 'price') {
            // Permitir solo números y remover cualquier caracter no numérico
            const numericValue = value.replace(/[^0-9]/g, '');
            // Formatear como COP solo si hay un valor
            const formattedValue = numericValue ? formatCurrency(numericValue) : '';
            setFormData(prev => ({
                ...prev,
                [name]: formattedValue
            }));
            } else {
                setFormData(prev => ({
                ...prev,
                [name]: files ? files[0] : value
            }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nombre es requerido';
        if (!formData.price) newErrors.price = 'Precio es requerido';
        else if (isNaN(parseCurrency(formData.price))) newErrors.price = 'Precio inválido';
        if (!formData.category) newErrors.category = 'Categoría es requerida';
        if (!formData.description) newErrors.description = 'Descripción es requerida';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Obtener token de autenticación
    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setNotification({
                show: true,
                message: 'No estás autenticado',
                type: 'error'
            });
            return null;
        }
        return token;
    };

    // Enviar formulario de actualización
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setNotification({ show: false, message: '', type: '' });

        const token = getToken();
        if (!token) {
        setIsSubmitting(false);
        return;
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('title', formData.title);
        // Parsear el precio antes de enviar (remover puntos)
        formDataToSend.append('price', parseCurrency(formData.price));
        formDataToSend.append('category', formData.category);
        formDataToSend.append('description', formData.description);
        if (formData.images) formDataToSend.append('uploadFile', formData.images);

        try {
        const response = await fetch(`http://localhost:8080/api/product/${selectedProduct._id}`, {
            method: 'PUT',
            headers: {
            'x-token': token
            },
            body: formDataToSend
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al actualizar producto');
        }

        setNotification({
            show: true,
            message: 'Producto actualizado exitosamente',
            type: 'success'
        });

        // Actualizar lista de productos
        const updatedProducts = products.map(p => 
            p._id === selectedProduct._id ? data.product : p
        );
        setProducts(updatedProducts);

        } catch (error) {
        console.error('Error:', error);
        setNotification({
            show: true,
            message: error.message || 'Error al conectar con el servidor',
            type: 'error'
        });
        } finally {
        setIsSubmitting(false);
        }
    };

    // Limpiar selección
    const handleClearSelection = () => {
        setSelectedProduct(null);
        setFormData({
        name: '',
        title: '',
        description: '',
        price: '',
        images: null,
        category: ''
        });
        setErrors({});
    };

    return (
        <div className="producto-container">
            <h2 className="producto-title"><FontAwesomeIcon icon={faSave} className="icon" />Editar Producto Existente</h2>
            {notification.show && (
                <div className={`notification ${notification.type}`}><FontAwesomeIcon icon={notification.type === 'success' ? faCheckCircle : faExclamationTriangle} className="icon" />
                    {notification.message}
                </div>
            )}
        <div className="search-container">
            <div className="search-box"><FontAwesomeIcon icon={faSearch} className="search-icon" />
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={handleSearch} />
            </div>
        </div>
        <div className="editar-producto-grid">
            <div className="lista-productos">
                <h3>Productos Disponibles</h3>
                <ul>
                    {filteredProducts.map(product => (
                        <li key={product._id} onClick={() => handleSelectProduct(product)} className={selectedProduct?._id === product._id ? 'selected' : ''}>
                            <div className="product-item">
                                <img src={`http://localhost:8080/uploads/products/${product.images}`} alt={product.name} className="product-thumbnail"/>
                                <div className="product-info">
                                    <span className="product-name">{product.name}</span>
                                    <span className="product-price">${formatCurrency(product.price)} COP</span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="form-container">
                {selectedProduct ? (
                    <form onSubmit={handleSubmit} className="producto-form">
                        <div className="form-group">
                            <label>Nombre del Producto *</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'input-error' : ''}/>
                            {errors.name && <span className="error-message">{errors.name}</span>}
                        </div>
                        <div className="form-group">
                            <label>Título del Producto</label>
                            <input type="text" name="title" value={formData.title} onChange={handleChange}/>
                        </div>
                        <div className="form-group">
                            <label>Precio (COP) *</label>
                            <input type="text" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'input-error' : ''}/>
                            {errors.price && <span className="error-message">{errors.price}</span>}
                        </div>
                        <div className="form-group">
                            <label>Categoría *</label>
                            <select name="category" value={formData.category} onChange={handleChange} className={errors.category ? 'input-error' : ''}>
                                <option value="">Seleccione una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                                ))}
                            </select>
                            {errors.category && <span className="error-message">{errors.category}</span>}
                        </div>
                        <div className="form-group">
                            <label>Descripción *</label>
                            <textarea name="description" value={formData.description} onChange={handleChange} className={errors.description ? 'input-error' : ''}/>
                            {errors.description && <span className="error-message">{errors.description}</span>}
                        </div>
                        <div className="form-group">
                            <label>Nueva Imagen (Opcional)</label>
                            <input type="file" name="images" onChange={handleChange} accept="image/*"/>
                            <small className="file-hint">
                                Dejar en blanco para mantener la imagen actual: {selectedProduct.images}
                            </small>
                        </div>
                        <div className="form-actions">
                            <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <FontAwesomeIcon icon={faSpinner} spin /> Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <FontAwesomeIcon icon={faSave} /> Guardar Cambios
                                    </>
                                )}
                            </button>
                            <button type="button" className="btn-secondary" onClick={handleClearSelection} disabled={isSubmitting}>
                                <FontAwesomeIcon icon={faTimes} /> Cancelar
                            </button>
                        </div>
                    </form>
                    ) : (
                        <div className="no-selection">
                            <p>Selecciona un producto de la lista para editarlo</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditarProducto;