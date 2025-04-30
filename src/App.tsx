import React from 'react';
import MainMenu from './Components/frontend/MainMenu';
import ParticlesBackground from './Components/frontend/ParticleBackground';
import './Components/frontend/css/Title.css';

function App() {
    return (
        <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
            {/* Particle background */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <ParticlesBackground />
            </div>

            {/* Nội dung */}
            <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 className="page-title">What's for dinner?</h2>
                <MainMenu />
            </div>
        </div>
    );
}

export default App;
