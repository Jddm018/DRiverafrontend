import React from "react";
import "./QuienesSomos.css";
import equipoImg from "../img/equipo3.jpeg";
import misionImg from "../img/mision.png";
import visionImg from "../img/vision2.png";

const QuienesSomos = () => {
  return (
    <div className="drivera-about-container">
      <header className="drivera-about-header">
        <div className="drivera-header-content">
          <h1>Conoce más sobre <span className="drivera-brand">DRivera</span></h1>
          <p className="drivera-tagline">Líderes en equipamiento profesional para gastronomía</p>
          <div className="drivera-header-decoration"></div>
        </div>
      </header>

      {/* Sección Quiénes Somos */}
      <section className="drivera-about-section">
        <div className="drivera-image-container soft-shadow">
          <img src={equipoImg} alt="Equipo de DRivera" className="drivera-image-full" />
        </div>
        <div className="drivera-text-content">
          <h2 className="drivera-section-title">
            <span className="drivera-title-number">01</span>
            <span>Quiénes Somos</span>
          </h2>
          <p className="drivera-section-text">
            En <strong>DRivera</strong> nos especializamos en ofrecer productos de cocina industrial
            de la más alta calidad...
          </p>
          <div className="drivera-section-decoration"></div>
        </div>
      </section>

      {/* Sección Misión */}
      <section className="drivera-about-section">
        <div className="drivera-text-content">
          <h2 className="drivera-section-title">
            <span className="drivera-title-number">02</span>
            <span>Misión</span>
          </h2>
          <p className="drivera-section-text">
            Nuestra misión es ser el <strong> aliado estratégico</strong> de negocios gastronómicos en Cartagena y más allá, proporcionando soluciones integrales y productos de cocina industrial de la más alta calidad que impulsen su eficiencia, rentabilidad y crecimiento sostenible.
          </p>
          <div className="drivera-section-decoration"></div>
        </div>
        <div className="drivera-image-container soft-shadow">
          <img src={misionImg} alt="Utensilios profesionales" className="drivera-image-full" />
        </div>
      </section>

      {/* Sección Visión */}
      <section className="drivera-about-section">
        <div className="drivera-image-container soft-shadow">
          <img src={visionImg} alt="Tecnología en cocinas industriales" className="drivera-image-full" />
        </div>
        <div className="drivera-text-content">
          <h2 className="drivera-section-title">
            <span className="drivera-title-number">03</span>
            <span>Visión</span>
          </h2>
          <p className="drivera-section-text">
            Para el 2030, buscamos ser <strong>referentes en Latinoamérica</strong> como el aliado estratégico líder para negocios gastronómicos, reconocidos por ofrecer productos de cocina industrial de vanguardia, soluciones innovadoras y un servicio excepcional que impulse el éxito y la excelencia culinaria en la región.
          </p>
          <div className="drivera-section-decoration"></div>
        </div>
      </section>
    </div>
  );
};

export default QuienesSomos;