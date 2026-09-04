import React, { useState } from 'react';

export default function Quiz({ config, onComplete }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quizFeedback, setQuizFeedback] = useState('');
  const questions = config.questions;

  const handleAnswer = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [quizIndex]: option });
    setQuizFeedback(questions[quizIndex].feedback || '');
    setTimeout(() => {
      setQuizFeedback('');
      if (quizIndex < questions.length - 1) {
        setQuizIndex(quizIndex + 1);
      } else {
        onComplete(selectedAnswers);
      }
    }, 1500);
  };

  return (
    <div className="quiz-container">
      <div className="quiz-card glass-card">
        <span className="step-indicator">Question {quizIndex + 1} of {questions.length}</span>
        <h2 className="quiz-heading">{questions[quizIndex].q}</h2>
        
        <div className="options-container">
          {questions[quizIndex].options && questions[quizIndex].options.map((opt, i) => (
            <button
              key={i}
              className={`option-btn ${selectedAnswers[quizIndex] === opt ? 'selected' : ''}`}
              onClick={() => handleAnswer(opt)}
            >
              {opt}
            </button>
          ))}
        </div>

        {questions[quizIndex].type === 'text' && (
          <div className="answer-input-container">
            <input
              type="text"
              className="answer-input"
              placeholder="Tulis jawapan awak di sini..."
              value={selectedAnswers[`${quizIndex}_text`] || ''}
              onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [`${quizIndex}_text`]: e.target.value })}
            />
            <button
              className="btn-primary"
              onClick={() => {
                if (quizIndex < questions.length - 1) setQuizIndex(quizIndex + 1);
                else onComplete(selectedAnswers);
              }}
            >
              Save & Next →
            </button>
          </div>
        )}

        {questions[quizIndex].hasText && (
          <div className="answer-input-container">
            <input
              type="text"
              className="answer-input"
              placeholder="Tulis sebab awak di sini..."
              value={selectedAnswers[`${quizIndex}_text`] || ''}
              onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [`${quizIndex}_text`]: e.target.value })}
            />
          </div>
        )}

        {quizFeedback && (
          <div className="quiz-feedback">{quizFeedback}</div>
        )}

        {!questions[quizIndex].needsTextInput && (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button className="btn-secondary" onClick={() => quizIndex > 0 ? setQuizIndex(quizIndex - 1) : null}>← Back</button>
            <button className="btn-primary" onClick={() => {
              if (quizIndex < questions.length - 1) setQuizIndex(quizIndex + 1);
              else onComplete(selectedAnswers);
            }}>Skip →</button>
          </div>
        )}
      </div>
    </div>
  );
}
