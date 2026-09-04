import React, { useState, useEffect } from 'react';

export default function TemplatePage({ config }) {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(-1);
  const [quizIndex, setQuizIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

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
      {step === -1 && (
        <div className="envelope-scene">
          <div className={`envelope ${step >= 0 ? 'open' : ''}`} onClick={() => setStep(0)}>
            <div className="envelope-body"></div>
            <div className="envelope-flap"></div>
            <div className="envelope-letter"><span className="envelope-text">Something for you... 💌</span></div>
            <span className="envelope-hint">Tap to open ✉️</span>
          </div>
        </div>
      )}
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
      {step === 1 && (
        <div className="quiz-container">
          <div className="quiz-card glass-card">
            <span className="step-indicator">Question {quizIndex + 1} of {config.questions.length}</span>
            <h2 className="quiz-heading">{config.questions[quizIndex].q}</h2>
            <div className="options-container">
              {config.questions[quizIndex].options && config.questions[quizIndex].options.map((opt, i) => (
                <button key={i} className="option-btn" onClick={() => {
                  setAnswers({ ...answers, [quizIndex]: opt });
                  if (quizIndex < config.questions.length - 1) setQuizIndex(quizIndex + 1);
                  else setStep(2);
                }}>{opt}</button>
              ))}
            </div>
            {config.questions[quizIndex].type === 'text' && (
              <div className="answer-input-container">
                <input type="text" className="answer-input" placeholder="Tulis jawapan awak di sini..." value={answers[`${quizIndex}_text`] || ''} onChange={(e) => setAnswers({ ...answers, [`${quizIndex}_text`]: e.target.value })} />
                <button className="btn-primary" onClick={() => {
                  if (quizIndex < config.questions.length - 1) setQuizIndex(quizIndex + 1);
                  else setStep(2);
                }}>Save & Next →</button>
              </div>
            )}
          </div>
        </div>
      )}
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
