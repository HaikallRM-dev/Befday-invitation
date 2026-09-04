import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Quiz({ config, onComplete }) {
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [hearts, setHearts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const clickAudioRef = useRef(null);
  const questions = config.questions;

  const createHeartBurst = (x, y) => {
    const id = Date.now();
    setHearts(prev => [...prev, { id, x, y }]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000);
  };

  const handleAnswer = (option, needsTextInput) => {
    setSelectedAnswers({ ...selectedAnswers, [quizIndex]: option });
    setQuizFeedback(questions[quizIndex].feedback || '');
    createHeartBurst(0, 0);
    
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
    <motion.div
      className="fade-in-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      key={quizIndex}
    >
      <span className="step-indicator">Question {quizIndex + 1} of {questions.length}</span>
      <h2 className="quiz-heading">{questions[quizIndex].q}</h2>
      
      <div className="options-container">
        {questions[quizIndex].options && questions[quizIndex].options.map((opt, i) => (
          <button
            key={i}
            className={`option-hover ${selectedAnswers[quizIndex] === opt ? 'option-selected' : ''}`}
            onClick={() => handleAnswer(opt)}
          >
            {opt}
          </button>
        ))}
      </div>

      {questions[quizIndex].type === 'text' && (
        <div className="answer-input-container" style={{ marginTop: '1rem' }}>
          <input
            type="text"
            className="answer-input"
            placeholder="Tulis jawapan awak di sini..."
            value={selectedAnswers[`${quizIndex}_text`] || ''}
            onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [`${quizIndex}_text`]: e.target.value })}
          />
          <button
            className="btn-primary"
            style={{ marginTop: '0.8rem' }}
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
        <div className="answer-input-container" style={{ marginTop: '1rem' }}>
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
        <motion.div
          className="quiz-feedback"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          {quizFeedback}
        </motion.div>
      )}
    </motion.div>
  );
}
