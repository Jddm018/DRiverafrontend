import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './Fijar.css';

const Fijar = () => {
    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        setVisible(window.scrollY > 2); // aparece después de 100px
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);

    return (
        <button
            className={`scroll-to-top ${visible ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Scroll to top"
        >
            <FontAwesomeIcon icon={faArrowUp} />
        </button>
    );
};

export default Fijar;
