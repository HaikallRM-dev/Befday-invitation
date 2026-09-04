import React from 'react';
import TemplatePage from '../TemplatePage';

const personalConfig = {
  name: "For Farisya Aleeya",
  questions: [
    { q: "Who's more clingy?", options: ["You 🙈", "Me 🙋‍♂️", "Dua-dua sama je 💕"] },
    { q: "Favourite memory together?", type: "text" },
    { q: "First date location?", type: "text" },
    { q: "First make-out?", type: "text" },
    { q: "Favourite picture?", type: "text" },
    { q: "Qualities wanted?", type: "text" },
    { q: "Always wanted to do?", type: "text" },
    { q: "Favourite thing?", type: "text" },
    { q: "5 years?", type: "text" },
    { q: "One word?", options: ["Soulmate", "Best friends", "Home 🏠", "Soulmate but not soulmate"] },
    { q: "Why birthday?", options: ["Yes", "No"], hasText: true }
  ]
};

export default function PersonalPage() {
  return <TemplatePage config={personalConfig} />;
}
