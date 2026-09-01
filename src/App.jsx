import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_step');
      return saved !== null ? parseInt(saved, 10) : -1;
    } catch { return -1; }
  });
  const [quizIndex, setQuizIndex] = useState(() => {
    try {
      const saved = localStorage.getItem('birthday_quiz');
      return saved !== null ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });
  const [selectedAnswers, setSelectedAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('birthday_answers') || '{}');
    } catch { return {}; }
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [envelopeOpen, setEnvelopeOpen] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [showShareToast, setShowShareToast] = useState(false);
  const [quizFeedback, setQuizFeedback] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('birthday_step', String(step));
      localStorage.setItem('birthday_quiz', String(quizIndex));
      localStorage.setItem('birthday_answers', JSON.stringify(selectedAnswers));
    } catch (e) { /* ignore */ }
  }, [step, quizIndex, selectedAnswers]);

  const quizQuestions = [
    { id: 1, question: "Who's more clingy?", options: ["You 🙈", "Me 🙋‍♂️", "Dua-dua sama je 💕"], feedback: "Haha, kita memang berpadu!" },
    { id: 2, question: "What's our all-time favourite memory together?", options: ["Masa jalan-jalan / dating santai", "Masa gelak ketawa sampai sakit perut", "Semua moment dengan awak!"], feedback: "Moment bersama awak adalah yang terbaik." },
    { id: 3, question: "Ingat lagi tak first date kita dekat mana?", options: ["Ingat sangat!", "Macam tak percaya dah lama kenal", "Mestilah ingat! ✨"], feedback: "First date kita memang special!" },
    { id: 4, question: "When was our first make-out?", options: ["First date!", "Tapi lama dah...", "Tak ingat, tapi mesti sweet 🥰"], feedback: "Waktu itu memang magical!" },
    { id: 5, question: "What's our favourite picture together?", options: ["Selfie pertama", "Gambar random masa jalan", "Semua gambar awak 😊"], feedback: "Setiap gambar kita ada cerita." },
    { id: 6, question: "What qualities do you want in me?", options: ["Sabar & penyayang", "Suka buat orang senyum", "Semua pakej lengkap!"], feedback: "Saya akan jadi yang terbaik untuk awak." },
    { id: 7, question: "What have you always wanted us to do?", options: ["Roadtrip / jalan-jalan cari makan", "Chill & layan movie", "Mencipta lebih banyak memori indah bersama"], feedback: "Kita akan buat semua itu!" },
    { id: 8, question: "What's your favourite thing about me?", options: ["Personaliti awak", "Cara awak treat orang", "Awak saja, keseluruhan 💛"], feedback: "Awak adalah segalanya untuk saya." },
    { id: 9, question: "Where do you see us in 5 years?", options: ["Masih sama seperti sekarang", "Lebih baik dari sekarang", "Bersama, dalam apa keadaan sekali pun"], feedback: "Saya nak bersamanya selama-lamanya." },
    { id: 10, question: "What's one word to describe us?", options: ["Soulmate", "Best friends", "Home 🏠"], feedback: "Awak adalah rumah saya." },
    { id: 11, question: "Why do you want to spend your birthday with me?", options: ["Sebab saya sayang awak", "Sebab masa bersama awak adalah terbaik", "Sebab awak adalah hadiah terbaik 🎁"], feedback: "Sebab awak adalah hadiah terbaik dalam hidup saya." }
  ];

  const memories = [
    { emoji: "📸", caption: "one of my favourite days" },
    { emoji: "😊", caption: "you being you" },
    { emoji: "😄", caption: "this one still makes me smile" },
    { emoji: "🎉", caption: "another random memory" }
  ];

  const handleEnvelopeClick = () => {
    setEnvelopeOpen(true);
    setTimeout(() => setStep(0), 1200);
  };

  const handleQuizAnswer = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [quizIndex]: option });
    setQuizFeedback(quizQuestions[quizIndex].feedback);
    setTimeout(() => {
      setQuizFeedback('');
      if (quizIndex < quizQuestions.length - 1) {
        setQuizIndex(quizIndex + 1);
      } else {
        setStep(3);
      }
    }, 1500);
  };

  const handleYes = () => {
    setShowConfetti(true);
    setStep(7);
    setTimeout(() => setShowConfetti(false), 4000);
  };

  const handleReset = () => {
    if (confirm('Reset semula dari mula? Semua jawapan akan dipadam.')) {
      localStorage.removeItem('birthday_step');
      localStorage.removeItem('birthday_quiz');
      localStorage.removeItem('birthday_answers');
      setStep(-1);
      setQuizIndex(0);
      setSelectedAnswers({});
      setEnvelopeOpen(false);
    }
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (musicPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(() => {});
      }
      setMusicPlaying(!musicPlaying);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setShowShareToast(true);
      setTimeout(() => setShowShareToast(false), 2000);
    } catch (e) {
      prompt('Copy link ini:', url);
    }
  };

  const floatingItems = ['♥', '✿', '✦', '♡', '❋', '✧', '♥', '✿', '♡', '✦', '❋', '✧'];

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-hearts">
          <span className="loading-heart">♥</span>
          <span className="loading-heart">♥</span>
          <span className="loading-heart">♥</span>
        </div>
        <p className="loading-text">Loading something special...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Hidden audio for music */}
      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/audio/2024/01/23/audio_1234567890.mp3" type="audio/mpeg" />
      </audio>

      {/* Floating Background */}
      <div className="floating-bg">
        {floatingItems.map((item, i) => (
          <span
            key={i}
            className="float-item"
            style={{
              left: `${(i * 8.3) % 100}%`,
              fontSize: `${1 + Math.random() * 1.5}rem`,
              animationDuration: `${8 + Math.random() * 6}s`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            {item}
          </span>
        ))}
      </div>

      {/* Music Toggle */}
      <button className={`music-toggle ${musicPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
        {musicPlaying ? '🔊' : '🔇'}
      </button>

      {/* Share Button */}
      <button className="share-button" onClick={handleShare}>
        📤
      </button>

      {/* Share Toast */}
      <AnimatePresence>
        {showShareToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{ position: 'fixed', top: '4rem', right: '1rem', background: '#7B5E57', color: '#FFFDFC', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', zIndex: 100 }}
          >
            Link disalin! 📋
          </motion.div>
        )}
      </AnimatePresence>

      {/* Confetti */}
      <AnimatePresence>
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="confetti"
                initial={{ y: -20, opacity: 1 }}
                animate={{
                  y: window.innerHeight + 20,
                  opacity: 0,
                  rotate: Math.random() * 720,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }}
                style={{
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#7B5E57', '#D9B8A5', '#B88B7D', '#FFFDFC', '#f97316', '#10b981'][i % 6],
                  width: `${6 + Math.random() * 8}px`,
                  height: `${6 + Math.random() * 8}px`,
                  borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* ENVELOPE SCENE (Step -1) */}
      {step === -1 && (
        <div className="envelope-scene">
          <motion.div
            className={`envelope ${envelopeOpen ? 'open' : ''}`}
            onClick={handleEnvelopeClick}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="envelope-body"></div>
            <div className="envelope-flap"></div>
            <div className="envelope-letter">
              <span className="envelope-text">Something for you... 💌</span>
            </div>
            <span className="envelope-hint">{envelopeOpen ? 'Opening...' : 'Tap to open ✉️'}</span>
          </motion.div>
        </div>
      )}

      {/* STEP 0: OPENING */}
      {step === 0 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div style={styles.dateBadge}>07 · 09 · 2026</div>
          <h1 style={styles.heading}>Hey you...</h1>
          <p style={styles.bodyText}>I made something special just for you.</p>
          <button style={styles.primaryButton} onClick={() => setStep(1)}>
            Open this →
          </button>
        </motion.div>
      )}

      {/* STEP 1: THIS IS FOR YOU */}
      {step === 1 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p style={styles.bodyText}>This isn't a normal invitation.</p>
          <p style={styles.bodyText}>It's something small I made especially for you.</p>
          <p style={styles.handwritten}>So... take your time.</p>
          <button style={styles.primaryButton} onClick={() => setStep(2)}>
            I'm listening 🤍
          </button>
        </motion.div>
      )}

      {/* STEP 2: COUPLE QUIZ (11 questions) */}
      {step === 2 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          key={quizIndex}
        >
          <span style={styles.stepIndicator}>Question {quizIndex + 1} of {quizQuestions.length}</span>
          <h2 style={styles.quizHeading}>{quizQuestions[quizIndex].question}</h2>
          <div style={styles.optionsContainer}>
            {quizQuestions[quizIndex].options.map((opt, index) => (
              <button
                key={index}
                className={selectedAnswers[quizIndex] === opt ? 'option-selected' : ''}
                style={{
                  ...styles.optionButton,
                  backgroundColor: selectedAnswers[quizIndex] === opt ? 'var(--secondary-rose)' : '#F9F6F2',
                  borderColor: selectedAnswers[quizIndex] === opt ? 'var(--primary-brown)' : '#D9B8A5',
                }}
                onClick={() => handleQuizAnswer(opt)}
              >
                {opt}
              </button>
            ))}
          </div>
          {quizFeedback && (
            <motion.div
              className="quiz-feedback"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {quizFeedback}
            </motion.div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            <button
              style={{ ...styles.primaryButton, backgroundColor: '#9a9aa5', flex: 1 }}
              onClick={() => quizIndex > 0 ? setQuizIndex(quizIndex - 1) : setStep(1)}
            >
              ← Back
            </button>
            <button
              style={{ ...styles.primaryButton, flex: 1 }}
              onClick={() => {
                if (quizIndex < quizQuestions.length - 1) setQuizIndex(quizIndex + 1);
                else setStep(3);
              }}
            >
              Skip →
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: TRANSITION TO BIRTHDAY */}
      {step === 3 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={styles.heading}>You know…</h2>
          <p style={styles.bodyText}>Somehow, ordinary moments feel a little better when you're around.</p>
          <p style={styles.bodyText}>And this year, for my birthday, there's really only one thing I'd like.</p>
          <button style={styles.primaryButton} onClick={() => setStep(4)}>
            What is it? ✨
          </button>
        </motion.div>
      )}

      {/* STEP 4: THE REVEAL + MEMORIES + ITINERARY */}
      {step === 4 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div style={styles.dateBadge}>TOP SECRET ITINERARY</div>
          <h2 style={styles.heading}>
            <span className="typewriter">7 September 2026</span>
          </h2>

          {/* Polaroid Gallery */}
          <div className="polaroid-gallery">
            {memories.map((m, i) => (
              <motion.div
                key={i}
                className="polaroid"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * i }}
              >
                <div className="polaroid-img">{m.emoji}</div>
                <p className="polaroid-caption">{m.caption}</p>
              </motion.div>
            ))}
          </div>

          <div style={styles.itineraryBox}>
            <p><strong>TIME:</strong> After work</p>
            <p><strong>COMPANY:</strong> Just me & you</p>
            <p><strong>DRESS CODE:</strong> Whatever makes you comfortable</p>
            <p><strong>DESTINATION:</strong> <span style={styles.secretText}>■■■■■■■■■■■■ (Secret Stop)</span></p>
          </div>
          <button style={styles.primaryButton} onClick={() => setStep(5)}>
            Continue to the Plan →
          </button>
        </motion.div>
      )}

      {/* STEP 5: THE DATE DETAILS & RULES */}
      {step === 5 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h3 style={styles.subHeading}>The Simple Plan</h3>
          <ul style={styles.ruleList}>
            <li>🍽️ <strong>Dinner:</strong> Nothing fancy, just food we both enjoy.</li>
            <li>🚗 <strong>A Little Drive:</strong> Talk, listen to music, & laugh at stupid things.</li>
            <li>🌙 <strong>One Secret Stop:</strong> This one stays a secret for now.</li>
          </ul>
          <hr style={styles.divider} />
          <h4 style={styles.ruleTitle}>Birthday Date Rules:</h4>
          <p style={styles.ruleText}>1. You have to smile at least 3 times.<br/>2. One picture together is compulsory.<br/>3. No saying "I'm tired" early!</p>
          <button style={styles.primaryButton} onClick={() => setStep(6)}>
            Aha, I see... →
          </button>
        </motion.div>
      )}

      {/* STEP 6: THE BIG QUESTION */}
      {step === 6 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <p style={styles.handwrittenLarge}>So if you're willing...</p>
          <h1 style={styles.heading}>Will you go on a date with me?</h1>
          <p style={styles.bodyText}>07 September 2026 · After work</p>
          <div style={styles.buttonGroup}>
            <button style={styles.yesButton} onClick={handleYes}>
              YES, definitely! 🤍
            </button>
            <button style={styles.tellMeMoreButton} onClick={() => setStep(8)}>
              Tell me more 💌
            </button>
          </div>
          <button
            style={{ ...styles.primaryButton, marginTop: '1rem', backgroundColor: '#9a9aa5' }}
            onClick={() => setStep(5)}
          >
            ← Back
          </button>
        </motion.div>
      )}

      {/* STEP 7: DATE CONFIRMED */}
      {step === 7 && (
        <motion.div
          className="fade-in-card"
          style={{ ...styles.card, background: 'linear-gradient(135deg, #7B5E57 0%, #302B29 100%)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          >
            <div style={{ ...styles.dateBadge, backgroundColor: '#FFFDFC', color: '#7B5E57' }}>DATE CONFIRMED 🎉</div>
          </motion.div>
          <h2 style={{ ...styles.heading, color: '#FFFDFC' }}>I knew you had good taste.</h2>
          <p style={{ ...styles.bodyText, color: '#D9B8A5' }}>Thank you for being part of my story.</p>
          <p style={{ ...styles.handwrittenLarge, color: '#FFFDFC' }}>See you on the 7th. — your birthday boy</p>
          <button style={{ ...styles.primaryButton, marginTop: '1.5rem', backgroundColor: '#FFFDFC', color: '#7B5E57' }} onClick={handleReset}>
            🔄 Reset
          </button>
        </motion.div>
      )}

      {/* STEP 8: TELL ME MORE */}
      {step === 8 && (
        <motion.div
          className="fade-in-card"
          style={styles.card}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 style={styles.heading}>The Heart</h2>
          <p style={styles.bodyText}>
            But honestly... I don't really need anything big for my birthday. I just want to spend some time with you. Eat something together. Laugh about random things. Talk about our day. Maybe take a few pictures. Maybe make another memory.
          </p>
          <p style={styles.handwrittenLarge}>That's really all I want.</p>
          <p style={styles.bodyText}>Because the point isn't where we go. It's who I'm going with.</p>
          <button style={styles.primaryButton} onClick={() => setStep(6)}>
            ← Back to question
          </button>
        </motion.div>
      )}

      {/* Step indicator */}
      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', fontSize: '0.75rem', color: '#B88B7D' }}>
        {step >= 0 ? `Step ${step}/8` : 'Envelope'}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '20px',
    minHeight: '100vh',
    position: 'relative',
    zIndex: 1,
  },
  card: {
    backgroundColor: '#FFFDFC',
    padding: '35px 30px',
    borderRadius: '16px',
    boxShadow: '0 10px 30px rgba(123, 94, 87, 0.08)',
    width: '100%',
    maxWidth: '420px',
    textAlign: 'center',
    border: '1px solid #EFECE6',
  },
  dateBadge: {
    display: 'inline-block',
    fontSize: '0.85rem',
    letterSpacing: '2px',
    color: '#7B5E57',
    backgroundColor: '#F9F6F2',
    padding: '6px 14px',
    borderRadius: '20px',
    marginBottom: '20px',
    fontWeight: '600',
  },
  heading: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.8rem',
    color: '#302B29',
    marginBottom: '15px',
  },
  subHeading: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.4rem',
    color: '#7B5E57',
    marginBottom: '10px',
  },
  quizHeading: {
    fontFamily: '"Playfair Display", serif',
    fontSize: '1.4rem',
    color: '#302B29',
    marginBottom: '20px',
    minHeight: '60px',
  },
  bodyText: {
    fontSize: '1rem',
    color: '#554A45',
    lineHeight: '1.6',
    marginBottom: '20px',
  },
  handwritten: {
    fontFamily: '"Caveat", cursive',
    fontSize: '1.4rem',
    color: '#B88B7D',
    marginBottom: '25px',
  },
  handwrittenLarge: {
    fontFamily: '"Caveat", cursive',
    fontSize: '1.6rem',
    color: '#B88B7D',
    marginBottom: '15px',
  },
  stepIndicator: {
    fontSize: '0.8rem',
    color: '#B88B7D',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    display: 'block',
    marginBottom: '10px',
  },
  primaryButton: {
    backgroundColor: '#7B5E57',
    color: '#FFFDFC',
    border: 'none',
    padding: '12px 28px',
    fontSize: '1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background 0.2s',
    width: '100%',
    boxShadow: '0 4px 12px rgba(123, 94, 87, 0.2)',
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  optionButton: {
    backgroundColor: '#F9F6F2',
    color: '#302B29',
    border: '1px solid #D9B8A5',
    padding: '12px 18px',
    fontSize: '0.95rem',
    borderRadius: '12px',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
  },
  itineraryBox: {
    textAlign: 'left',
    backgroundColor: '#F9F6F2',
    padding: '15px 20px',
    borderRadius: '10px',
    fontSize: '0.9rem',
    color: '#302B29',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  secretText: {
    letterSpacing: '3px',
    color: '#7B5E57',
    fontWeight: 'bold',
  },
  ruleList: {
    textAlign: 'left',
    fontSize: '0.9rem',
    color: '#554A45',
    paddingLeft: '20px',
    marginBottom: '15px',
    lineHeight: '1.6',
  },
  ruleTitle: {
    fontSize: '0.95rem',
    color: '#7B5E57',
    marginBottom: '5px',
    fontWeight: 'bold',
  },
  ruleText: {
    fontSize: '0.85rem',
    color: '#666',
    marginBottom: '20px',
    lineHeight: '1.5',
  },
  divider: {
    border: '0',
    height: '1px',
    backgroundColor: '#EFECE6',
    marginBottom: '15px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  yesButton: {
    backgroundColor: '#7B5E57',
    color: '#FFFDFC',
    border: 'none',
    padding: '14px 28px',
    fontSize: '1.1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '600',
    flex: '1',
    minWidth: '150px',
    boxShadow: '0 4px 12px rgba(123, 94, 87, 0.25)',
  },
  tellMeMoreButton: {
    backgroundColor: 'transparent',
    color: '#7B5E57',
    border: '2px solid #7B5E57',
    padding: '14px 28px',
    fontSize: '1.1rem',
    borderRadius: '30px',
    cursor: 'pointer',
    fontWeight: '500',
    flex: '1',
    minWidth: '150px',
  },
};
