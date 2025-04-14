import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faSpinner, faCheckCircle, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import './CrearProveedor.css';

const CrearProveedor = () => {
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
  
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({
    show: false,
    message: '',
    type: 'success'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'El nombre es obligatorio';
    if (!formData.company.trim()) newErrors.company = 'El nombre de la empresa es obligatorio';
    if (!formData.contact.trim()) newErrors.contact = 'El contacto es obligatorio';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo es obligatorio';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'El correo no es válido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    if (!formData.productexport.trim()) newErrors.productexport = 'Debe colocar el producto exportado';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || 'Error al registrar el proveedor');
      }

      showNotification('Proveedor registrado exitosamente', 'success');
      setFormData({
        name: '',
        company: '',
        contact: '',
        email: '',
        phone: '',
        productexport: '',
        address: '',
        state: true
      });
    } catch (error) {
      showNotification(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setNotification({
        ...notification,
        show: false
      });
    }, 5000);
  };

  return (
    <div className="provider-registration-container">
      <h1 className="registration-title">
        <FontAwesomeIcon icon={faSave} className="title-icon" />
        Registro de Nuevo Proveedor
      </h1>
      
      <div className="registration-form-container">
        <form onSubmit={handleSubmit} className="provider-form">
          <div className="form-group">
            <label htmlFor="name">Nombre del Proveedor*</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? 'input-error' : ''}
            />
            {errors.name && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.name}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="company">Nombre de la Empresa*</label>
            <input
              type="text"
              id="company"
              name="company"
              value={formData.company}
              onChange={handleInputChange}
              className={errors.company ? 'input-error' : ''}
            />
            {errors.company && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.company}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="contact">Persona de Contacto*</label>
            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              className={errors.contact ? 'input-error' : ''}
            />
            {errors.contact && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.contact}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.email}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="phone">Teléfono*</label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className={errors.phone ? 'input-error' : ''}
            />
            {errors.phone && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.phone}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="productexport">Producto que Exporta*</label>
            <input
              type="text"
              id="productexport"
              name="productexport"
              value={formData.productexport}
              onChange={handleInputChange}
              className={errors.productexport ? 'input-error' : ''}
            />
            {errors.productexport && <span className="error-message">
              <FontAwesomeIcon icon={faExclamationTriangle} /> {errors.productexport}
            </span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="address">Dirección (Opcional)</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              rows="3"
            />
          </div>
          
          <div className="form-actions">
            <button
              type="submit"
              className="submit-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin /> Registrando...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faSave} /> Registrar Proveedor
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <FontAwesomeIcon 
            icon={notification.type === 'success' ? faCheckCircle : faExclamationTriangle} 
            className="notification-icon" 
          />
          {notification.message}
        </div>
      )}
    </div>
  );
};

export default CrearProveedor;