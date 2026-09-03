import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// ===== GOOGLE SHEETS CONFIGURATION =====
const SHEETS_CONFIG = {
  scriptUrl: 'https://script.google.com/macros/s/AKfycby9OjQExPVlzC5_GAe0a80A12GzK71OwnOi_iKrvmeplw9u1pWV3GCVU8IQ_GDBzXtMqQ/exec',
  sheetName: 'Birthday Responses'
};

// Google Apps Script code (untuk copy paste nanti)
const GAS_CODE = `
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Birthday Responses');
  if (!sheet) {
    sheet = SpreadsheetApp.getActiveSpreadsheet().insertSheet('Birthday Responses');
    sheet.appendRow(['Timestamp', 'Question 1', 'Question 2', 'Question 3', 'Question 4', 'Question 5', 'Question 6', 'Question 7', 'Question 8', 'Question 9', 'Question 10', 'Question 11', 'Final Answer']);
  }
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([new Date(), ...data.answers, data.finalAnswer]);
  return ContentService.createTextOutput(JSON.stringify({status: 'success'})).setMimeType(ContentService.MimeType.JSON);
}
`;

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
  const [syncStatus, setSyncStatus] = useState('');
  const [loadingProgress, setLoadingProgress] = useState(0);
  const audioRef = useRef(null);
  const clickAudioRef = useRef(null);
  const envelopeAudioRef = useRef(null);
  const confettiAudioRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    const progressTimer = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressTimer);
          return 100;
        }
        return prev + 2;
      });
    }, 50);
    return () => {
      clearTimeout(timer);
      clearInterval(progressTimer);
    };
  }, []);

  // ===== SOUND EFFECTS =====
  const playClickSound = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch(() => {});
    }
  };

  const playEnvelopeSound = () => {
    if (envelopeAudioRef.current) {
      envelopeAudioRef.current.currentTime = 0;
      envelopeAudioRef.current.play().catch(() => {});
    }
  };

  const playConfettiSound = () => {
    if (confettiAudioRef.current) {
      confettiAudioRef.current.currentTime = 0;
      confettiAudioRef.current.play().catch(() => {});
    }
  };

  useEffect(() => {
    try {
      localStorage.setItem('birthday_step', String(step));
      localStorage.setItem('birthday_quiz', String(quizIndex));
      localStorage.setItem('birthday_answers', JSON.stringify(selectedAnswers));
    } catch (e) { /* ignore */ }
  }, [step, quizIndex, selectedAnswers]);

  // ===== GOOGLE SHEETS SYNC =====
  const syncToSheets = async (finalAnswer) => {
    // Skip sync if no URL or placeholder
    if (!SHEETS_CONFIG.scriptUrl || SHEETS_CONFIG.scriptUrl.includes('AWAK ISI')) {
      setSyncStatus('Jawapan disimpan lokal (Google Sheets belum setup)');
      return;
    }
    try {
      setSyncStatus('Menyimpan...');
      const answers = [];
      for (let i = 0; i < 11; i++) {
        answers.push(selectedAnswers[`${i}_text`] || selectedAnswers[i] || '');
      }
      // Use no-cors to avoid CORS issues with GAS
      await fetch(SHEETS_CONFIG.scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers, finalAnswer })
      });
      setSyncStatus('Berjaya disimpan! ✅');
    } catch (e) {
      setSyncStatus('Jawapan disimpan lokal');
    }
  };

  const quizQuestions = [
    { id: 1, question: "Who's more clingy?", options: ["You 🙈", "Me 🙋‍♂️", "Dua-dua sama je 💕"], feedback: "Haha, kita memang berpadu!" },
    { id: 2, question: "What's our all-time favourite memory together?", options: [], needsTextInput: true, feedback: "Moment itu memang tak akan saya lupa." },
    { id: 3, question: "Ingat lagi tak first date kita dekat mana?", options: [], needsTextInput: true, feedback: "First date kita memang special!" },
    { id: 4, question: "When was our first make-out?", options: [], needsTextInput: true, feedback: "Waktu itu memang magical!" },
    { id: 5, question: "What's our favourite picture together?", options: [], needsTextInput: true, feedback: "Setiap gambar kita ada cerita." },
    { id: 6, question: "What qualities do you want in me?", options: [], needsTextInput: true, feedback: "Saya akan jadi yang terbaik untuk awak." },
    { id: 7, question: "What have you always wanted us to do?", options: [], needsTextInput: true, feedback: "Kita akan buat semua itu!" },
    { id: 8, question: "What's your favourite thing about me?", options: [], needsTextInput: true, feedback: "Awak adalah segalanya untuk saya." },
    { id: 9, question: "Where do you see us in 5 years?", options: [], needsTextInput: true, feedback: "Saya nak bersamanya selama-lamanya." },
    { id: 10, question: "What's one word to describe us?", options: ["Soulmate", "Best friends", "Home 🏠", "Soulmate but not soulmate"], feedback: "Awak adalah rumah saya." },
    { id: 11, question: "Would you like to spend time with me on my birthday?", options: ["Yes", "No"], needsTextInput: true, feedback: "Sebab awak adalah hadiah terbaik dalam hidup saya." },
  ];

  const memories = [
    { img: "/images/polaroid-2.jpg", caption: "one of my favourite days", crop: "center top" },
    { img: "/images/polaroid-1.jpg", caption: "you being you", crop: "center center" },
    { img: "/images/polaroid-5.jpg", caption: "this one still makes me smile", crop: "center center" },
    { img: "/images/polaroid-3.jpg", caption: "another random memory", crop: "center center" }
  ];

  const handleEnvelopeClick = () => {
    setEnvelopeOpen(true);
    playEnvelopeSound();
    setTimeout(() => setStep(0), 1200);
  };

  const [hearts, setHearts] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [zoomedImg, setZoomedImg] = useState(null);

  const createHeartBurst = useCallback((x, y) => {
    const id = Date.now();
    const heart = { id, x, y };
    setHearts(prev => [...prev, heart]);
    setTimeout(() => setHearts(prev => prev.filter(h => h.id !== id)), 1000);
  }, []);

  const handleQuizAnswer = (option, event) => {
    setSelectedAnswers({ ...selectedAnswers, [quizIndex]: option });
    setQuizFeedback(quizQuestions[quizIndex].feedback);
    playClickSound();
    createHeartBurst(event?.clientX || 0, event?.clientY || 0);
    setTimeout(() => {
      setQuizFeedback('');
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 500);
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
    playConfettiSound();
    setTimeout(() => setShowConfetti(false), 4000);
    syncToSheets('YES');
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
        <div className="loading-bar-container">
          <div className="loading-bar" style={{ width: `${loadingProgress}%` }} />
        </div>
        <p className="loading-text">Loading something special... {loadingProgress}%</p>
      </div>
    );
  }

  return (
    <motion.div style={styles.container} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {/* Heart Burst Effects */}
      <AnimatePresence>
        {hearts.map(heart => (
          <motion.span
            key={heart.id}
            className="heart-burst"
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 1.5, opacity: 0, y: -50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            style={{ left: heart.x, top: heart.y, fontSize: '1.5rem' }}
          >
            ♥
          </motion.span>
        ))}
      </AnimatePresence>

      {/* Success Checkmark */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            style={{ position: 'fixed', top: '2rem', left: '50%', transform: 'translateX(-50%)', zIndex: 100 }}
          >
            <span className="success-checkmark" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Photo Zoom Modal */}
      <AnimatePresence>
        {zoomedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImg(null)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, cursor: 'pointer' }}
          >
            <motion.img
              src={zoomedImg}
              alt="Zoomed"
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.5 }}
              style={{ maxWidth: '90%', maxHeight: '80vh', borderRadius: '12px', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <audio ref={audioRef} loop>
        <source src="https://cdn.pixabay.com/audio/2024/01/23/audio_1234567890.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={clickAudioRef}>
        <source src="https://cdn.pixabay.com/audio/2024/01/23/audio_click.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={envelopeAudioRef}>
        <source src="https://cdn.pixabay.com/audio/2024/01/23/audio_envelope.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={confettiAudioRef}>
        <source src="https://cdn.pixabay.com/audio/2024/01/23/audio_confetti.mp3" type="audio/mpeg" />
      </audio>

      <div className="floating-bg">
        {floatingItems.map((item, i) => (
          <span key={i} className="float-item" style={{ left: `${(i * 8.3) % 100}%`, fontSize: `${1 + Math.random() * 1.5}rem`, animationDuration: `${8 + Math.random() * 6}s`, animationDelay: `${i * 0.7}s` }}>{item}</span>
        ))}
      </div>

      <button className={`music-toggle ${musicPlaying ? 'playing' : ''}`} onClick={toggleMusic}>
        {musicPlaying ? '🔊' : '🔇'}
      </button>

      <button className="share-button" onClick={handleShare}>
        📤
      </button>

      <AnimatePresence>
        {showShareToast && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} style={{ position: 'fixed', top: '4rem', right: '1rem', background: '#7B5E57', color: '#FFFDFC', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', zIndex: 100 }}>
            Link disalin! 📋
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfetti && (
          <div className="confetti-container">
            {[...Array(50)].map((_, i) => (
              <motion.div key={i} className="confetti" initial={{ y: -20, opacity: 1 }} animate={{ y: window.innerHeight + 20, opacity: 0, rotate: Math.random() * 720 }} exit={{ opacity: 0 }} transition={{ duration: 2 + Math.random() * 2, ease: 'easeOut' }} style={{ left: `${Math.random() * 100}%`, backgroundColor: ['#7B5E57', '#D9B8A5', '#B88B7D', '#FFFDFC', '#f97316', '#10b981'][i % 6], width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`, borderRadius: Math.random() > 0.5 ? '50%' : '2px' }} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {step === -1 && (
        <div className="envelope-scene">
          <motion.div className={`envelope ${envelopeOpen ? 'open' : ''}`} onClick={handleEnvelopeClick} initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <div className="envelope-body"></div>
            <div className="envelope-flap"></div>
            <div className="envelope-letter"><span className="envelope-text">Something for you... 💌</span></div>
            <span className="envelope-hint">{envelopeOpen ? 'Opening...' : 'Tap to open ✉️'}</span>
          </motion.div>
        </div>
      )}

      {step === 0 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={styles.dateBadge}>07 · 09 · 2026</div>
          <h1 style={styles.heading}><span className="typewriter">Dear Farisya Aleeya,</span></h1>
          <p style={styles.bodyText}>This letter is special for you. It's something small I made special for you.</p>
          <p style={styles.handwritten}>So... please read.</p>
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(1)}>Open envelope ✉️</button>
        </motion.div>
      )}

      {step === 1 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <p style={styles.bodyText}>This isn't a normal invitation.</p>
          <p style={styles.bodyText}>It's something small I made especially for you.</p>
          <p style={styles.handwritten}>So... take your time.</p>
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(2)}>I'm listening 🤍</button>
        </motion.div>
      )}

      {step === 2 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} key={quizIndex}>
          <span style={styles.stepIndicator}>Question {quizIndex + 1} of {quizQuestions.length}</span>
          <h2 style={styles.quizHeading}>{quizQuestions[quizIndex].question}</h2>
          <div style={styles.optionsContainer}>
            {quizQuestions[quizIndex].options.length > 0 && quizQuestions[quizIndex].options.map((opt, index) => (
              <button key={index} className={`option-hover ${selectedAnswers[quizIndex] === opt ? 'option-selected' : ''}`} style={{ ...styles.optionButton, backgroundColor: selectedAnswers[quizIndex] === opt ? 'var(--secondary-rose)' : '#F9F6F2', borderColor: selectedAnswers[quizIndex] === opt ? 'var(--primary-brown)' : '#D9B8A5' }} onClick={(e) => handleQuizAnswer(opt, e)}>{opt}</button>
            ))}
          </div>
          {quizQuestions[quizIndex].needsTextInput && (
            <div className="answer-input-container">
              <input type="text" className="answer-input" placeholder="Tulis jawapan awak di sini..." value={selectedAnswers[`${quizIndex}_text`] || ''} onChange={(e) => setSelectedAnswers({ ...selectedAnswers, [`${quizIndex}_text`]: e.target.value })} />
              <button style={{ ...styles.primaryButton, marginTop: '0.8rem' }} onClick={() => { if (quizIndex < quizQuestions.length - 1) setQuizIndex(quizIndex + 1); else setStep(3); }}>
                Save & Next →
              </button>
            </div>
          )}
          {quizFeedback && <motion.div className="quiz-feedback" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>{quizFeedback}</motion.div>}
          {!quizQuestions[quizIndex].needsTextInput && (
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button style={{ ...styles.primaryButton, backgroundColor: '#9a9aa5', flex: 1 }} onClick={() => quizIndex > 0 ? setQuizIndex(quizIndex - 1) : setStep(1)}>← Back</button>
              <button style={{ ...styles.primaryButton, flex: 1 }} onClick={() => { if (quizIndex < quizQuestions.length - 1) setQuizIndex(quizIndex + 1); else setStep(3); }}>Skip →</button>
            </div>
          )}
        </motion.div>
      )}

      {step === 3 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={styles.heading}><span className="typewriter">You know…</span></h2>
          <p style={styles.bodyText}>At 7 September is my birthday, I never been like this before to have someone with me.</p>
          <p style={styles.bodyText}>And this year, for my birthday, I would love to invite you to be my special guest. But wait read below.</p>
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(4)}>What is it? ✨</button>
        </motion.div>
      )}

      {step === 4 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <div style={styles.dateBadge}>TOP SECRET ITINERARY</div>
          <h2 style={styles.heading}><span className="typewriter">7 September 2026</span></h2>
          <div className="polaroid-gallery">
            {memories.map((m, i) => (
              <motion.div key={i} className="polaroid" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 * i }}>
                <div className="polaroid-img">
                  {m.img ? <img src={m.img} alt={m.caption} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: m.crop || 'center center', borderRadius: '2px', cursor: 'pointer' }} onClick={() => setZoomedImg(m.img)} /> : m.emoji}
                </div>
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
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(5)}>Continue to the Plan →</button>
        </motion.div>
      )}

      {step === 5 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h3 style={styles.subHeading}>The Simple Plan</h3>
          <ul style={styles.ruleList}>
            <li>🍽️ <strong>Dinner:</strong> Nothing fancy, just food we both enjoy.</li>
            <li>🚗 <strong>A Little Drive:</strong> Talk, listen to music, & laugh at stupid things.</li>
            <li>🌙 <strong>One Secret Stop:</strong> This one stays a secret for now.</li>
          </ul>
          <hr style={styles.divider} />
          <h4 style={styles.ruleTitle}>Birthday Date Rules:</h4>
          <p style={styles.ruleText}>1. You have to smile at least 3 times.<br/>2. One picture together is compulsory.<br/>3. No saying "I'm tired" early!</p>
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(6)}>Aha, I see... →</button>
        </motion.div>
      )}

      {step === 6 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <p style={styles.handwrittenLarge}>So if you're willing...</p>
          <h1 style={styles.heading}><span className="typewriter">Will you go on a date with me?</span></h1>
          <p style={styles.bodyText}>07 September 2026 · After work</p>
          <div style={styles.buttonGroup}>
            <button style={styles.yesButton} onClick={handleYes}>YES, definitely! 🤍</button>
            <button style={styles.tellMeMoreButton} onClick={() => setStep(8)}>Tell me more 💌</button>
          </div>
          <button style={{ ...styles.primaryButton, marginTop: '1rem', backgroundColor: '#9a9aa5' }} onClick={() => setStep(5)}>← Back</button>
        </motion.div>
      )}

      {step === 7 && (
        <motion.div className="fade-in-card" style={{ ...styles.card, background: 'linear-gradient(135deg, #7B5E57 0%, #302B29 100%)' }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
            <div style={{ ...styles.dateBadge, backgroundColor: '#FFFDFC', color: '#7B5E57' }}>DATE CONFIRMED 🎉</div>
          </motion.div>
          <h2 style={{ ...styles.heading, color: '#FFFDFC' }}><span className="typewriter">I knew you had good taste.</span></h2>
          <p style={{ ...styles.bodyText, color: '#D9B8A5' }}>Thank you for being part of my story.</p>
          <p style={{ ...styles.handwrittenLarge, color: '#FFFDFC' }}>See you on the 7th. — your birthday boy</p>
          {syncStatus && <p style={{ color: '#D9B8A5', fontSize: '0.85rem', marginTop: '1rem' }}>{syncStatus}</p>}
          <button style={{ ...styles.primaryButton, marginTop: '1.5rem', backgroundColor: '#FFFDFC', color: '#7B5E57' }} onClick={handleReset}>🔄 Reset</button>
        </motion.div>
      )}

      {step === 8 && (
        <motion.div className="fade-in-card" style={styles.card} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <h2 style={styles.heading}><span className="typewriter">The Heart</span></h2>
          <p style={styles.bodyText}>But honestly... I don't really need anything big for my birthday. I just want to spend some time with you. Eat something together. Laugh about random things. Talk about our day. Maybe take a few pictures. Maybe make another memory.</p>
          <p style={styles.handwrittenLarge}>That's really all I want.</p>
          <p style={styles.bodyText}>Because the point isn't where we go. It's who I'm going with.</p>
          <button className="btn-glow" style={styles.primaryButton} onClick={() => setStep(6)}>← Back to question</button>
        </motion.div>
      )}

      <div style={{ position: 'fixed', bottom: '1rem', right: '1rem', fontSize: '0.75rem', color: '#B88B7D' }}>
        {step >= 0 ? `Step ${step}/8` : 'Envelope'}
      </div>
    </motion.div>
  );
}

const styles = {
  container: { display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', padding: '20px', minHeight: '100vh', position: 'relative', zIndex: 1 },
  card: { backgroundColor: 'rgba(255, 253, 252, 0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255, 253, 252, 0.3)', padding: '35px 30px', borderRadius: '16px', boxShadow: '0 8px 32px rgba(123, 94, 87, 0.1), inset 0 1px 4px rgba(255, 255, 255, 0.5)', width: '100%', maxWidth: '420px', textAlign: 'center' },
  dateBadge: { display: 'inline-block', fontSize: '0.85rem', letterSpacing: '2px', color: '#7B5E57', backgroundColor: '#F9F6F2', padding: '6px 14px', borderRadius: '20px', marginBottom: '20px', fontWeight: '600' },
  heading: { fontFamily: '"Playfair Display", serif', fontSize: '1.8rem', color: '#302B29', marginBottom: '15px' },
  subHeading: { fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#7B5E57', marginBottom: '10px' },
  quizHeading: { fontFamily: '"Playfair Display", serif', fontSize: '1.4rem', color: '#302B29', marginBottom: '20px', minHeight: '60px' },
  bodyText: { fontSize: '1rem', color: '#554A45', lineHeight: '1.6', marginBottom: '20px' },
  handwritten: { fontFamily: '"Caveat", cursive', fontSize: '1.4rem', color: '#B88B7D', marginBottom: '25px' },
  handwrittenLarge: { fontFamily: '"Caveat", cursive', fontSize: '1.6rem', color: '#B88B7D', marginBottom: '15px' },
  stepIndicator: { fontSize: '0.8rem', color: '#B88B7D', textTransform: 'uppercase', letterSpacing: '1px', display: 'block', marginBottom: '10px' },
  primaryButton: { backgroundColor: '#7B5E57', color: '#FFFDFC', border: 'none', padding: '12px 28px', fontSize: '1rem', borderRadius: '30px', cursor: 'pointer', fontWeight: '500', transition: 'all 0.3s ease', width: '100%', boxShadow: '0 4px 12px rgba(123, 94, 87, 0.2)', position: 'relative', overflow: 'hidden' },
  optionsContainer: { display: 'flex', flexDirection: 'column', gap: '12px' },
  optionButton: { backgroundColor: '#F9F6F2', color: '#302B29', border: '1px solid #D9B8A5', padding: '12px 18px', fontSize: '0.95rem', borderRadius: '12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' },
  itineraryBox: { textAlign: 'left', backgroundColor: '#F9F6F2', padding: '15px 20px', borderRadius: '10px', fontSize: '0.9rem', color: '#302B29', marginBottom: '20px', lineHeight: '1.5' },
  secretText: { letterSpacing: '3px', color: '#7B5E57', fontWeight: 'bold' },
  ruleList: { textAlign: 'left', fontSize: '0.9rem', color: '#554A45', paddingLeft: '20px', marginBottom: '15px', lineHeight: '1.6' },
  ruleTitle: { fontSize: '0.95rem', color: '#7B5E57', marginBottom: '5px', fontWeight: 'bold' },
  ruleText: { fontSize: '0.85rem', color: '#666', marginBottom: '20px', lineHeight: '1.5' },
  divider: { border: '0', height: '1px', backgroundColor: '#EFECE6', marginBottom: '15px' },
  buttonGroup: { display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' },
  yesButton: { backgroundColor: '#7B5E57', color: '#FFFDFC', border: 'none', padding: '14px 28px', fontSize: '1.1rem', borderRadius: '30px', cursor: 'pointer', fontWeight: '600', flex: '1', minWidth: '150px', boxShadow: '0 4px 12px rgba(123, 94, 87, 0.25)' },
  tellMeMoreButton: { backgroundColor: 'transparent', color: '#7B5E57', border: '2px solid #7B5E57', padding: '14px 28px', fontSize: '1.1rem', borderRadius: '30px', cursor: 'pointer', fontWeight: '500', flex: '1', minWidth: '150px' },
};
