import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, Navigate } from 'react-router-dom';
import Envelope from './components/Envelope';
import Quiz from './components/Quiz';
import './index.css';

import birthdayConfig from './config/birthday-party.json';
import eventConfig from './config/event.json';
import weddingConfig from './config/wedding.json';
import formalConfig from './config/formal.json';

const TEMPLATES = {
  'birthday-party': birthdayConfig,
  'event': eventConfig,
  'wedding': weddingConfig,
  'formal': formalConfig,
};

function TemplatePage() {
  const { templateId } = useParams();
  const config = TEMPLATES[templateId];
  const [step, setStep] = useState(-1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  if (!config) return <Navigate to="/" replace />;

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-hearts">
          <span className="loading-heart">♥</span>
          <span className="loading-heart">♥</span>
          <span className="loading-heart">♥</span>
        </div>
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: '100%' }} />
        </div>
        <p className="loading-text">Loading something special...</p>
      </div>
    );
  }

  return (
    <div className="fade-in-card">
      {step === -1 && <Envelope onOpen={() => setStep(0)} />}
      {step === 0 && (
        <div className="quiz-container">
          <div className="quiz-card glass-card">
            <span className="step-indicator">Step 1 of 3</span>
            <h1 className="quiz-heading"><span className="typewriter">{config.name}</span></h1>
            <p style={{ color: 'var(--muted-rose)', marginBottom: '1.5rem' }}>This is something special I made for you.</p>
            <button className="btn-primary" onClick={() => setStep(1)}>Open envelope ✉️</button>
          </div>
        </div>
      )}
      {step === 1 && <Quiz config={config} onComplete={() => setStep(2)} />}
      {step === 2 && (
        <div className="quiz-container">
          <div className="quiz-card glass-card" style={{ textAlign: 'center' }}>
            <span className="success-checkmark" style={{ marginBottom: '1rem' }} />
            <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--primary-brown)' }}>Thank you! 💕</h1>
            <p style={{ color: 'var(--muted-rose)' }}>Your responses have been saved.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function LandingPage() {
  return (
    <div className="landing-page">
      <h1>🎂 Digital Invitation Templates</h1>
      <p>Personal, interactive, and unforgettable</p>
      <div className="template-grid">
        {Object.entries(TEMPLATES).map(([id, tmpl]) => (
          <a key={id} href={`/${id}`} className="template-card glass-card">
            <h3>{tmpl.name}</h3>
            <p>RM{tmpl.price}</p>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/:templateId" element={<TemplatePage />} />
      </Routes>
    </BrowserRouter>
  );
}
