import React, { useState, useEffect } from 'react';
import { useSnackbar } from 'notistack';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faUserShield, faTrashAlt, faSpinner, faExclamationCircle, faTimes, faCheck, faCircle, faUserCircle, faSearch } from '@fortawesome/free-solid-svg-icons';
import './EditarAdmin.css';

const EditarAdmin = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        const response = await fetch('http://localhost:8080/api/user', {
          headers: {
            'x-token': token,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Error al cargar usuarios');
        }

        const data = await response.json();
        
        const adminUsers = Array.isArray(data.users) 
          ? data.users.filter(user => user.roleId === 2)
          : [];
        
        setAdmins(adminUsers);

      } catch (error) {
        console.error('Error al cargar administradores:', error);
        enqueueSnackbar(error.message, { 
          variant: 'error',
          autoHideDuration: 5000
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, [enqueueSnackbar]);

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;

    try {
      setDeletingId(adminToDelete.id);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:8080/api/user/${adminToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'x-token': token,
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.msg || 'No se pudo eliminar el administrador');
      }

      setAdmins(admins.filter(admin => admin.id !== adminToDelete.id));
      enqueueSnackbar(result.msg || 'Administrador eliminado correctamente', {
        variant: 'success',
        autoHideDuration: 3000
      });

    } catch (error) {
      enqueueSnackbar(error.message, {
        variant: 'error',
        autoHideDuration: 5000
      });
    } finally {
      setDeletingId(null);
      setAdminToDelete(null);
      setShowConfirmModal(false);
    }
  };

  const handleCancelDelete = () => {
    setAdminToDelete(null);
    setShowConfirmModal(false);
  };

  const filteredAdmins = admins.filter(admin => 
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stringToColor = (string) => {
    let hash = 0;
    for (let i = 0; i < string.length; i++) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 60%)`;
    return color;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="spin-animation" />
        <p className="fade-in">Cargando lista de administradores...</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="header-content">
          <div className="admin-title">
            <FontAwesomeIcon icon={faUserShield} className="header-icon" />
            <span className="title-text">Administradores Registrados</span>
          </div>
          <div className="header-controls">
            <div className="admin-count-badge">
              {admins.length} {admins.length === 1 ? 'Admin' : 'Admins'}
            </div>
            <div className="search-container">
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
              <input
                type="text"
                placeholder="Buscar administradores..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
          </div>
        </div>
      </div>

      {filteredAdmins.length === 0 ? (
        <div className="no-admins-container">
          <div className="empty-state fade-in">
            <FontAwesomeIcon icon={faUserCircle} className="empty-icon" />
            <h3>
              {searchTerm ? 'No se encontraron coincidencias' : 'No hay administradores registrados'}
            </h3>
            {searchTerm && <p>No hay resultados para "{searchTerm}"</p>}
          </div>
        </div>
      ) : (
        <div className="admin-cards-container fade-in">
          {filteredAdmins.map((admin, index) => (
            <div key={admin.id} className={`admin-card delay-${index % 4}`}>
              <div className="card-main-content">
                <div className="admin-avatar" style={{ backgroundColor: stringToColor(admin.name) }}>
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <div className="admin-info">
                  <h3>{admin.name}</h3>
                  <div className="admin-meta">
                    <div className={`admin-status ${admin.state ? 'active' : 'inactive'}`}>
                      <FontAwesomeIcon icon={faCircle} className="status-icon" />
                      {admin.state ? 'Activo' : 'Inactivo'}
                    </div>
                    <div className="admin-email">
                      <FontAwesomeIcon icon={faEnvelope} className="email-icon" />
                      <span>{admin.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button 
                  onClick={() => {
                    setAdminToDelete(admin);
                    setShowConfirmModal(true);
                  }}
                  className="delete-btn"
                  disabled={deletingId === admin.id}
                >
                  {deletingId === admin.id ? (
                    <FontAwesomeIcon icon={faSpinner} spin />
                  ) : (
                    <FontAwesomeIcon icon={faTrashAlt} />
                  )}
                  <span>Eliminar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Confirmación */}
      {showConfirmModal && (
        <div className="confirm-modal-overlay fade-in">
          <div className="confirm-modal slide-up">
            <div className="confirm-modal-header">
              <h3>Confirmar Eliminación</h3>
            </div>
            <div className="confirm-modal-body">
              <FontAwesomeIcon icon={faExclamationCircle} className="warning-icon pulse" />
              <p>¿Estás seguro de eliminar al administrador <strong>{adminToDelete?.name}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
            </div>
            <div className="confirm-modal-footer">
              <button 
                onClick={handleCancelDelete}
                className="cancel-button hover-grow"
              >
                <FontAwesomeIcon icon={faTimes} /> Cancelar
              </button>
              <button 
                onClick={handleConfirmDelete}
                className="confirm-button hover-grow"
                disabled={deletingId === adminToDelete?.id}
              >
                {deletingId === adminToDelete?.id ? (
                  <FontAwesomeIcon icon={faSpinner} spin />
                ) : (
                  <FontAwesomeIcon icon={faCheck} />
                )} Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditarAdmin;