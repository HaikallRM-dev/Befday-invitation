import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './LandingPage';
import BirthdayPartyPage from './pages/birthday-party';
import EventPage from './pages/event';
import WeddingPage from './pages/wedding';
import FormalPage from './pages/formal';
import PersonalPage from './pages/personal';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/birthday-party" element={<BirthdayPartyPage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/wedding" element={<WeddingPage />} />
        <Route path="/formal" element={<FormalPage />} />
        <Route path="/personal" element={<PersonalPage />} />
      </Routes>
    </BrowserRouter>
  );
}
