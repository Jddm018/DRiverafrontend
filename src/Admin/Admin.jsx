import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBoxOpen, 
  faEdit, 
  faUserShield, 
  faTruck, 
  faUserCog,
  faUsers,
  faUserEdit
} from '@fortawesome/free-solid-svg-icons';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-container">
            <div className="admin-header">
                <div className="admin-icon">
                    <FontAwesomeIcon icon={faUserCog} size="2x" />
                </div>
                <h1 className="admin-title">Bienvenido al Panel de Administrador</h1>
            </div>
            <p className="admin-subtitle">Selecciona una opción del menú para comenzar.</p>
            <hr className="admin-divider" />
            <div className="menu-container-horizontal">
                {/* Crear Productos */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/crear_productos')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faBoxOpen} size="lg" />
                    </div>
                    <h2 className="option-title">Crear Productos</h2>
                    <p className="option-description">Agrega nuevos productos al catálogo</p>
                </div>
                
                {/* Editar Productos */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/editar_productos')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faEdit} size="lg" />
                    </div>
                    <h2 className="option-title">Editar Productos</h2>
                    <p className="option-description">Modifica productos existentes</p>
                </div>     
                
                {/* Crear Admin */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/crear_admin')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faUserShield} size="lg" />
                    </div>
                    <h2 className="option-title">Crear Admin</h2>
                    <p className="option-description">Gestiona cuentas de administrador</p>
                </div>
                
                {/* Editar Admin */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/editar_admin')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faUserEdit} size="lg" />
                    </div>
                    <h2 className="option-title">Editar Admin</h2>
                    <p className="option-description">Modifica administradores existentes</p>
                </div>
                
                {/* Crear Proveedor */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/crear_proveedor')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faTruck} size="lg" />
                    </div>
                    <h2 className="option-title">Crear Proveedor</h2>
                    <p className="option-description">Agrega nuevos proveedores</p>
                </div>
                
                {/* Editar Proveedor */}
                <div className="menu-option-horizontal" onClick={() => navigate('/admin/editar_proveedor')}>
                    <div className="option-icon">
                        <FontAwesomeIcon icon={faUsers} size="lg" />
                    </div>
                    <h2 className="option-title">Editar Proveedor</h2>
                    <p className="option-description">Modifica proveedores existentes</p>
                </div>
            </div>
        </div>
    );
};

export default Admin;