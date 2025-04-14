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
        categoryId: ''
    });
    const [categories, setCategories] = useState([]);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: '' });
    const [searchTerm, setSearchTerm] = useState('');

    // Formatear números con separadores de miles
    const formatCurrency = (value) =>
        new Intl.NumberFormat('es-CO', { minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(value);

    // Parsear valor numérico (remover puntos)
    const parseCurrency = (value) => value.replace(/\./g, '');

    // Cargar productos y categorías
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, catRes] = await Promise.all([
                    fetch('http://localhost:8080/api/product'),
                    fetch('http://localhost:8080/api/categories')
                ]);
                if (!prodRes.ok || !catRes.ok) throw new Error('Error al cargar datos');

                const { products: prodList } = await prodRes.json();
                const { categories: catList } = await catRes.json();
                setProducts(prodList);
                setCategories(catList);
            } catch (err) {
                console.error(err);
                setNotification({ show: true, message: 'Error al cargar datos', type: 'error' });
            }
        };
        fetchData();
    }, []);

    const handleSearch = (e) => setSearchTerm(e.target.value);
    const filteredProducts = products.filter(p => p?.name?.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleSelectProduct = (product) => {
        setSelectedProduct(product);
        setFormData({
            name: product.name,
            title: product.title || '',
            description: product.description,
            price: formatCurrency(product.price),
            images: null,
            categoryId: product.categoryId.toString()
        });
        setErrors({});
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'price') {
            const numeric = value.replace(/[^0-9]/g, '');
            setFormData(prev => ({ ...prev, [name]: numeric ? formatCurrency(numeric) : '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
        }
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const validateForm = () => {
        const newErr = {};
        if (!formData.name.trim()) newErr.name = 'Nombre es requerido';
        if (!formData.price) newErr.price = 'Precio es requerido';
        else if (isNaN(parseCurrency(formData.price))) newErr.price = 'Precio inválido';
        if (!formData.categoryId) newErr.categoryId = 'Categoría es requerida';
        if (!formData.description) newErr.description = 'Descripción es requerida';

        setErrors(newErr);
        return Object.keys(newErr).length === 0;
    };

    const getToken = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setNotification({ show: true, message: 'No estás autenticado', type: 'error' });
            return null;
        }
        return token;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        setNotification({ show: false, message: '', type: '' });

        const token = getToken();
        if (!token) { setIsSubmitting(false); return; }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('title', formData.title);
        formDataToSend.append('price', parseCurrency(formData.price));
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('description', formData.description);
        if (formData.images) formDataToSend.append('uploadFile', formData.images);

        // DEBUG: mostrar contenido de FormData
        for (let [k, v] of formDataToSend.entries()) console.log(k, v);

        try {
            const res = await fetch(`http://localhost:8080/api/product/${selectedProduct.id}`, {
                method: 'PUT',
                headers: { 'x-token': token },
                body: formDataToSend
            });
            const data = await res.json();
            console.log('Status:', res.status, 'Body:', data);

            if (!res.ok) throw new Error(data.message || 'Error al actualizar producto');

            setNotification({ show: true, message: 'Producto actualizado exitosamente', type: 'success' });
            setProducts(products.map(p => p.id === selectedProduct.id ? data : p));
        } catch (err) {
            console.error(err);
            setNotification({ show: true, message: err.message || 'Error de servidor', type: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedProduct(null);
        setFormData({ name: '', title: '', description: '', price: '', images: null, categoryId: '' });
        setErrors({});
    };

    return (
        <div className="producto-container">
            <h2 className="producto-title">
                <FontAwesomeIcon icon={faSave} className="icon" /> Editar Producto Existente
            </h2>
            {notification.show && (
                <div className={`notification ${notification.type}`}>
                    <FontAwesomeIcon icon={notification.type === 'success' ? faCheckCircle : faExclamationTriangle} className="icon" />
                    {notification.message}
                </div>
            )}
            <div className="search-container">
                <div className="search-box">
                    <FontAwesomeIcon icon={faSearch} className="search-icon" />
                    <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={handleSearch} />
                </div>
            </div>
            <div className="editar-producto-grid">
                <div className="lista-productos">
                    <h3>Productos Disponibles</h3>
                    <ul>
                        {filteredProducts.map(product => (
                            <li key={product.id} onClick={() => handleSelectProduct(product)} className={selectedProduct?.id === product.id ? 'selected' : ''}>
                                <div className="product-item">
                                    <img src={`http://localhost:8080/uploads/products/${product.images}`} alt={product.name} className="product-thumbnail" />
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
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className={errors.name ? 'input-error' : ''} />
                                {errors.name && <span className="error-message">{errors.name}</span>}
                            </div>
                            <div className="form-group">
                                <label>Título del Producto</label>
                                <input type="text" name="title" value={formData.title} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Precio (COP) *</label>
                                <input type="text" name="price" value={formData.price} onChange={handleChange} className={errors.price ? 'input-error' : ''} />
                                {errors.price && <span className="error-message">{errors.price}</span>}
                            </div>
                            <div className="form-group">
                                <label>Categoría *</label>
                                <select name="categoryId" value={formData.categoryId} onChange={handleChange} className={errors.categoryId ? 'input-error' : ''}>
                                    <option value="">Seleccione una categoría</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                                {errors.categoryId && <span className="error-message">{errors.categoryId}</span>}
                            </div>
                            <div className="form-group">
                                <label>Descripción *</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className={errors.description ? 'input-error' : ''} />
                                {errors.description && <span className="error-message">{errors.description}</span>}
                            </div>
                            <div className="form-group">
                                <label>Nueva Imagen (Opcional)</label>
                                <input type="file" name="images" onChange={handleChange} accept="image/*" />
                                <small className="file-hint">Dejar en blanco para mantener la imagen actual: {selectedProduct.images}</small>
                            </div>
                            <div className="form-actions">
                                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                                    {isSubmitting ? <><FontAwesomeIcon icon={faSpinner} spin /> Actualizando...</> : <><FontAwesomeIcon icon={faSave} /> Guardar Cambios</>}
                                </button>
                                <button type="button" className="btn-secondary" onClick={handleClearSelection} disabled={isSubmitting}>
                                    <FontAwesomeIcon icon={faTimes} /> Cancelar
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="no-selection"><p>Selecciona un producto de la lista para editarlo</p></div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditarProducto;
