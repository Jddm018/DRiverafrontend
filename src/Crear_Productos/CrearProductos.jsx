import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './CrearProductos.css';

const CrearProducto = () => {
    const [product, setProduct] = useState({
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
        type: '' // 'success' o 'error'
    });

    // Obtener categorías al cargar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories);
                } else {
                    throw new Error('Error al obtener categorías');
                }
            } catch (error) {
                console.error('Error:', error);
                setNotification({
                    show: true,
                    message: 'Error al cargar categorías',
                    type: 'error'
                });
            }
        };
        fetchCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: files ? files[0] : value
        }));
        // Limpiar errores al cambiar
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!product.name.trim()) newErrors.name = 'Nombre es requerido';
        if (!product.price) newErrors.price = 'Precio es requerido';
        else if (isNaN(product.price) || parseFloat(product.price) <= 0) newErrors.price = 'Precio inválido';
        if (!product.category) newErrors.category = 'Categoría es requerida';
        if (!product.description) newErrors.description = 'Descripción es requerida';
        if (!product.images) newErrors.images = 'Imagen es requerida';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const getToken = () => {
        return localStorage.getItem('token');
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setIsSubmitting(true);
        setNotification({ show: false, message: '', type: '' });
        const token = getToken();
        if (!token) {
            setNotification({
                show: true,
                message: 'No estás autenticado',
                type: 'error'
            });
            setIsSubmitting(false);
            return;
        }
        const formData = new FormData();
        formData.append('name', product.name);
        formData.append('title', product.title);
        formData.append('price', product.price);
        formData.append('category', product.category);
        formData.append('description', product.description);
        formData.append('uploadFile', product.images);
        try {
            const response = await fetch('http://localhost:8080/api/product/', {
                method: 'POST',
                headers: {
                    'x-token': token
                },
                body: formData
            });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al crear producto');
        }

        setNotification({
            show: true,
            message: 'Producto creado exitosamente. Te notificaremos cuando haya stock disponible.',
            type: 'success'
        });

        // Resetear formulario después de creación exitosa
        setProduct({
            name: '',
            title: '',
            description: '',
            price: '',
            images: null,
            category: ''
        });

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

    const handleResetForm = () => {
        setProduct({
            name: '',
            title: '',
            description: '',
            price: '',
            images: null,
            category: ''
        });
        setErrors({});
        setNotification({ show: false, message: '', type: '' });
    };

    return (
        <div className="producto-container">
            <h2 className="producto-title"><FontAwesomeIcon icon={faSave} className="icon" />
                Crear Nuevo Producto
            </h2>
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <FontAwesomeIcon 
                    icon={notification.type === 'success' ? faCheckCircle : faExclamationTriangle} 
                    className="icon" />
                    {notification.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="producto-form">
                <div className="form-group">
                    <label>Nombre del Producto *</label>
                    <input type="text" name="name" value={product.name} onChange={handleChange}
                    className={errors.name ? 'input-error' : ''} />
                    {errors.name && <span className="error-message">{errors.name}</span>}
                </div>
                <div className="form-group">
                    <label>Título del Producto</label>
                    <input type="text" name="title" value={product.title} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label>Precio (COP) *</label>
                    <input type="number" name="price" value={product.price} onChange={handleChange} min="0"
                    step="50" className={errors.price ? 'input-error' : ''}/>
                    {errors.price && <span className="error-message">{errors.price}</span>}
                </div>
                <div className="form-group">
                    <label>Categoría *</label>
                    <select name="category" value={product.category} onChange={handleChange} className={errors.category ? 'input-error' : ''}>
                        <option value="">Seleccione una categoría</option>
                        {categories.map(cat => (
                            <option key={cat._id} value={cat._id}>{cat.name}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error-message">{errors.category}</span>}
                </div>
                <div className="form-group">
                    <label>Descripción *</label>
                    <textarea name="description" value={product.description} onChange={handleChange}
                        className={errors.description ? 'input-error' : ''}/>
                    {errors.description && <span className="error-message">{errors.description}</span>}
                </div>
                <div className="form-group">
                    <label>Imagen del Producto *</label>
                    <input type="file" name="images" onChange={handleChange} accept="image/*" className={errors.images ? 'input-error' : ''}/>
                    {errors.images && <span className="error-message">{errors.images}</span>}
                    <small className="file-hint">Formatos: JPG, PNG, GIF (Max. 5MB)</small>
                </div>
                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                            <>
                                <FontAwesomeIcon icon={faSpinner} spin /> Procesando...
                            </>
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faSave} /> Guardar Producto
                            </>
                        )}
                    </button>
                    <button type="button" className="btn-secondary" onClick={handleResetForm} disabled={isSubmitting}>
                        <FontAwesomeIcon icon={faTimes} /> Limpiar Formulario
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CrearProducto;