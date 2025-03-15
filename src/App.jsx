import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar/Navbar.jsx'; 
import Home from './Home/Home.jsx';
//import Products from './pages/Products'; // Importa la página de productos
//import Cart from './pages/Cart'; // Importa la página del carrito
//import Admin from './pages/Admin'; // Importa la página de administrador
//import PurchaseHistory from './pages/PurchaseHistory'; // Importa la página de historial de compras
import './App.css';
import Footer from './Footer/Footer.jsx';
import Login from './Login/Login.jsx';
import Register from './Register/Register.jsx';

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <div className="main-content"> {/* Contenedor para el contenido principal */}
                    {/* Define las rutas de la aplicación */}
                    <Routes>
                        <Route path="/" element={<Home />}/>
                        <Route path="/Inicio" element={<Home />}/>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;