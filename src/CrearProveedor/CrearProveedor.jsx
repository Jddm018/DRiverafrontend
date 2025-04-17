import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import './CrearProveedor.css';

const CrearProveedor = () => {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    contact: '',
    email: '',
    phone: '',
    productexport: '',
    address: ''
  });
  
  const [mensaje, setMensaje] = useState('');
  const [error, setError] = useState('');

  // Maneja el cambio en los campos del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Función para enviar el formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMensaje('');

    // Validación simple de que los campos obligatorios no estén vacíos
    const { name, company, contact, email, phone, productexport } = formData;
    if (!name || !company || !contact || !email || !phone || !productexport) {
      setError('Por favor, complete todos los campos obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.msg || 'Error al crear el proveedor.');
      } else {
        setMensaje('Proveedor creado exitosamente.');
        // Reiniciar formulario en caso de éxito
        setFormData({
          name: '',
          company: '',
          contact: '',
          email: '',
          phone: '',
          productexport: '',
          address: ''
        });
      }
    } catch (error) {
      setError('Error de red: no se pudo conectar al servidor.');
      console.error('Error en fetch:', error);
    }
  };

  return (
    <div className="crear-proveedor">
      <h2>Crear Proveedor</h2>
      {mensaje && <div className="mensaje-exito">{mensaje}</div>}
      {error && <div className="mensaje-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Nombre:</label>
          <input 
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ingrese el nombre"
          />
        </div>
        <div>
          <label htmlFor="company">Empresa:</label>
          <input 
            type="text"
            id="company"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Ingrese el nombre de la empresa"
          />
        </div>
        <div>
          <label htmlFor="contact">Contacto:</label>
          <input 
            type="text"
            id="contact"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Ingrese el contacto"
          />
        </div>
        <div>
          <label htmlFor="email">Correo electrónico:</label>
          <input 
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese el correo electrónico"
          />
        </div>
        <div>
          <label htmlFor="phone">Teléfono:</label>
          <input 
            type="text"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Ingrese el teléfono"
          />
        </div>
        <div>
          <label htmlFor="productexport">Producto Exportado:</label>
          <input 
            type="text"
            id="productexport"
            name="productexport"
            value={formData.productexport}
            onChange={handleChange}
            placeholder="Ingrese el producto exportado"
          />
        </div>
        <div>
          <label htmlFor="address">Dirección:</label>
          <input 
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Ingrese la dirección (opcional)"
          />
        </div>
        <button type="submit">
          <FontAwesomeIcon icon={faPlus} /> Crear Proveedor
        </button>
      </form>
    </div>
  );
};

export default CrearProveedor;
