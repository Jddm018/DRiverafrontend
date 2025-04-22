import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx'; 
import Home from './Home/Home.jsx';
import Categorias from './Categorias/Categorias.jsx'; 
import Productos from './Productos/Productos.jsx';
import Detalles from './Detalles/Detalles.jsx';
import Carrito from './Carrito/Carrito.jsx';
import Cliente from './Cliente/Cliente.jsx';
import Pago from './Pago/Pago.jsx';
import Factura from './Factura/Factura.jsx';
import Admin from './Admin/Admin.jsx'; 
import CrearProductos from './Crear_Productos/CrearProductos.jsx';
import EditarProductos from './Editar_Productos/EditarProductos.jsx'
import Historial from './Historial/Historial.jsx';
import './App.css';
import Footer from './Footer/Footer.jsx';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';
import RegisterAdmin from './RegisterAdmin/RegisterAdmin';
import EditarAdmin from './EditarAdmin/EditarAdmin.jsx';
import CrearProveedor from './CrearProveedor/CrearProveedor.jsx';
import Fijar from './Fijar/Fijar.jsx';
import EditarProveedor from './EditarProveedor/EditarProveedor.jsx';
import GenerarCompra from './GenerarCompra/GenerarCompra.jsx';
import Recomendacion from './Recomendacion/Recomendacion.jsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Fijar />
                <div className="main-content"> {/* Contenedor para el contenido principal */}
                    {/* Define las rutas de la aplicación */}
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/Inicio" element={<Home />}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/productos" element={<Categorias />} />
                        <Route path="/category/:categoryId" element={<Productos />} />
                        <Route path="/product/:id" element={<Detalles />} />
                        <Route path="/historial" element={<Historial />} />
                        <Route path="/cart" element={<Carrito />} />
                        <Route path="/pay" element={<Cliente />} />
                        <Route path="/pago" element={<Pago />} />
                        <Route path="/factura" element={<Factura />} />
                        <Route path="/admin" element={<Admin />} />
                        <Route path='/admin/crear_productos' element={<CrearProductos />} />
                        <Route path='/admin/editar_productos' element={<EditarProductos />} />
                        <Route path='/admin/crear_admin' element={<RegisterAdmin />} />
                        <Route path='/admin/editar_admin' element={<EditarAdmin />} />
                        <Route path='/admin/crear_proveedor' element={<CrearProveedor />} />
                        <Route path='/admin/editar_proveedor' element={<EditarProveedor />} />
                        <Route path='/admin/generar_compra' element={<GenerarCompra />} />
                        <Route path='/recomendacion' element={<Recomendacion />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;