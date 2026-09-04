import React, { useState } from 'react';

const TEMPLATES = [
  {
    id: 'birthday-party',
    name: 'Birthday Invitation',
    price: 50,
    emoji: '🎂',
    description: 'Personal, interactive envelope with quiz game, photo gallery, and confetti celebration.',
    features: ['Envelope animation', '11 couple quiz questions', 'Photo gallery', 'Confetti celebration', 'Music player'],
    gradient: 'linear-gradient(135deg, #F9F6F2 0%, #D9B8A5 100%)',
  },
  {
    id: 'event',
    name: 'Event Party',
    price: 50,
    emoji: '🎉',
    description: 'RSVP invitation with venue details, time, and dietary preferences.',
    features: ['RSVP form', 'Event details', 'Dietary options', 'Plus one option', 'Message field'],
    gradient: 'linear-gradient(135deg, #F0F4F8 0%, #D4AF37 100%)',
  },
  {
    id: 'wedding',
    name: 'Wedding Invitation',
    price: 80,
    emoji: '💒',
    description: 'Elegant RSVP for wedding events with guest details and song requests.',
    features: ['Guest RSVP', 'Seating info', 'Song request', 'Dietary options', 'Message for couple'],
    gradient: 'linear-gradient(135deg, #F9F6F2 0%, #D4AF37 100%)',
  },
  {
    id: 'formal',
    name: 'Formal Majlis',
    price: 60,
    emoji: '🎩',
    description: 'Professional RSVP for formal events with guest details and organization info.',
    features: ['Guest details', 'Organization info', 'Dietary preferences', 'Plus one', 'Special requests'],
    gradient: 'linear-gradient(135deg, #1a1a1a 0%, #C9A96E 100%)',
  },
];

const PACKAGES = [
  { name: 'Basic', price: 50, features: ['1 template', 'Up to 2 photos', 'Basic quiz', 'Delivery 24h', '1 revision'], popular: false },
  { name: 'Standard', price: 100, features: ['1 template', 'Up to 4 photos', 'Custom quiz (11 qns)', 'Music player', 'Delivery 12h', '3 revisions'], popular: true },
  { name: 'Premium', price: 200, features: ['Custom template', 'Unlimited photos', 'Full customization', 'Priority delivery (6h)', 'Unlimited revisions', 'Source code'], popular: false },
];

const FAQ = [
  { q: 'How long does it take to complete?', a: 'Standard delivery is 12-24 hours. Premium package gets 6-hour priority delivery.' },
  { q: 'Can I customize the colors and theme?', a: 'Yes! All templates are fully customizable — colors, fonts, photos, and content.' },
  { q: 'How do I share the invitation?', a: 'You receive a unique link that can be shared via WhatsApp, Instagram, email, or any messaging app.' },
  { q: 'Can I edit it myself later?', a: 'With the Premium package, you get the source code and can edit everything yourself.' },
  { q: 'What payment methods do you accept?', a: 'We accept bank transfer, Touch n Go eWallet, and online banking (FPX).' },
  { q: 'Is there a revision limit?', a: 'Standard package includes 3 revisions. Premium includes unlimited revisions.' },
];

export default function LandingPage() {
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const whatsappNumber = '60123456789';
  const whatsappMsg = 'Hi! Saya berminat dengan invitation template. Boleh bantu?';

  return (
    <div style={styles.page}>
      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroContent}>
          <p style={styles.heroTag}>🇲🇾 Made in Malaysia</p>
          <h1 style={styles.heroTitle}>Personal Digital<br />Invitation Templates</h1>
          <p style={styles.heroSubtitle}>
            Personal, interactive, and unforgettable. No coding needed. Just send us your details and we'll create a unique invitation for you.
          </p>
          <div style={styles.heroCTA}>
            <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" style={styles.btnPrimary}>
              📱 Order via WhatsApp
            </a>
            <a href="#templates" style={styles.btnSecondary}>👀 View Templates</a>
          </div>
          <div style={styles.heroStats}>
            <div><strong>4</strong><span>Templates</span></div>
            <div><strong>RM50</strong><span>Starting from</span></div>
            <div><strong>24h</strong><span>Delivery</span></div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>How It Works</h2>
        <p style={styles.sectionSubtitle}>Simple 3-step process</p>
        <div style={styles.stepsGrid}>
          {[
            { step: '1', icon: '📱', title: 'Contact Us', desc: 'WhatsApp us with your event details and preferred template' },
            { step: '2', icon: '🎨', title: 'Customization', desc: 'We personalize with your names, photos, date, and preferences' },
            { step: '3', icon: '🚀', title: 'Delivery', desc: 'Receive your unique invitation link within 24 hours' },
          ].map((item, i) => (
            <div key={i} style={styles.stepCard}>
              <div style={styles.stepNumber}>{item.step}</div>
              <div style={styles.stepIcon}>{item.icon}</div>
              <h3 style={styles.stepTitle}>{item.title}</h3>
              <p style={styles.stepDesc}>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Templates</h2>
        <p style={styles.sectionSubtitle}>Choose a template and we'll customize it for you</p>
        <div style={styles.templateGrid}>
          {TEMPLATES.map((tmpl) => (
            <div key={tmpl.id} style={styles.templateCard}>
              <div style={{ ...styles.templatePreview, background: tmpl.gradient }}>
                <span style={styles.templateEmoji}>{tmpl.emoji}</span>
              </div>
              <div style={styles.templateInfo}>
                <h3 style={styles.templateName}>{tmpl.name}</h3>
                <p style={styles.templateDesc}>{tmpl.description}</p>
                <ul style={styles.featureList}>
                  {tmpl.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
                <div style={styles.templateFooter}>
                  <span style={styles.price}>RM{tmpl.price}</span>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <a href={`/${tmpl.id}`} style={styles.btnSmall}>Preview</a>
                    <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! Saya nak order ${tmpl.name} (RM${tmpl.price}). Boleh bantu?`)}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.btnSmall, background: 'var(--accent-rose)' }}>Order</a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" style={{ ...styles.section, background: 'var(--cream)' }}>
        <h2 style={styles.sectionTitle}>Pricing</h2>
        <p style={styles.sectionSubtitle}>Affordable pricing for every occasion</p>
        <div style={styles.pricingGrid}>
          {PACKAGES.map((pkg, i) => (
            <div key={i} style={{ ...styles.pricingCard, border: pkg.popular ? '2px solid var(--primary-brown)' : '1px solid rgba(123, 94, 87, 0.15)', position: 'relative' }}>
              {pkg.popular && <div style={styles.popularBadge}>Most Popular</div>}
              <h3 style={styles.pricingName}>{pkg.name}</h3>
              <div style={styles.pricingPrice}>RM{pkg.price}</div>
              <ul style={styles.pricingFeatures}>
                {pkg.features.map((f, j) => <li key={j}>✓ {f}</li>)}
              </ul>
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! Saya nak order package ${pkg.name} (RM${pkg.price}). Boleh bantu?`)}`} target="_blank" rel="noopener noreferrer" style={pkg.popular ? styles.btnPrimary : styles.btnSecondary}>Choose {pkg.name}</a>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Frequently Asked Questions</h2>
        <div style={styles.faqGrid}>
          {FAQ.map((item, i) => (
            <div key={i} style={styles.faqItem}>
              <h4 style={styles.faqQ}>{item.q}</h4>
              <p style={styles.faqA}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={styles.ctaSection}>
        <div style={styles.ctaContent}>
          <h2 style={styles.ctaTitle}>Ready to create your invitation?</h2>
          <p style={styles.ctaText}>Contact us now and get your personalized invitation within 24 hours.</p>
          <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer" style={styles.btnPrimary}>📱 Chat on WhatsApp</a>
          <p style={{ marginTop: '1rem', fontSize: '0.85rem', opacity: 0.7 }}>Available Mon-Sun, 9AM-11PM</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <p>© 2026 Digital Invitation Templates. Made with 💛 in Malaysia.</p>
      </footer>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: '#F9F6F2' },
  hero: { background: 'linear-gradient(135deg, #F9F6F2 0%, #fdf5ed 50%, #f5e6d3 100%)', padding: '5rem 1.5rem', textAlign: 'center' },
  heroContent: { maxWidth: '800px', margin: '0 auto' },
  heroTag: { display: 'inline-block', background: 'rgba(123, 94, 87, 0.1)', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.85rem', color: '#7B5E57', marginBottom: '1.5rem', fontWeight: 500 },
  heroTitle: { fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2.5rem, 8vw, 4rem)', color: '#7B5E57', marginBottom: '1.5rem', lineHeight: 1.15 },
  heroSubtitle: { fontSize: '1.1rem', color: '#B88B7D', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: 1.7 },
  heroCTA: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' },
  heroStats: { display: 'flex', justifyContent: 'center', gap: '3rem', flexWrap: 'wrap' },
  btnPrimary: { display: 'inline-block', padding: '1rem 2.5rem', background: '#7B5E57', color: '#FFFDFC', textDecoration: 'none', borderRadius: '50px', fontWeight: 600, fontSize: '1rem', border: 'none', cursor: 'pointer', transition: 'all 0.3s ease' },
  btnSecondary: { display: 'inline-block', padding: '1rem 2.5rem', background: 'transparent', color: '#7B5E57', textDecoration: 'none', borderRadius: '50px', fontWeight: 600, fontSize: '1rem', border: '2px solid #7B5E57', cursor: 'pointer', transition: 'all 0.3s ease' },
  btnSmall: { display: 'inline-block', padding: '0.6rem 1.4rem', background: '#7B5E57', color: '#FFFDFC', textDecoration: 'none', borderRadius: '25px', fontWeight: 600, fontSize: '0.85rem', border: 'none', cursor: 'pointer' },
  section: { padding: '5rem 1.5rem', max-width: '1100px', margin: '0 auto' },
  sectionTitle: { fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#7B5E57', textAlign: 'center', marginBottom: '0.75rem' },
  sectionSubtitle: { fontSize: '1.05rem', color: '#B88B7D', textAlign: 'center', marginBottom: '3.5rem' },
  stepsGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' },
  stepCard: { background: '#FFFDFC', padding: '2.5rem 2rem', borderRadius: '20px', textAlign: 'center', boxShadow: '0 4px 16px rgba(123, 94, 87, 0.06)' },
  stepNumber: { width: '48px', height: '48px', background: '#7B5E57', color: 'white', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.25rem', margin: '0 auto 1.25rem' },
  stepIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  stepTitle: { fontFamily: 'Playfair Display, serif', color: '#7B5E57', marginBottom: '0.75rem', fontSize: '1.2rem' },
  stepDesc: { color: '#B88B7D', fontSize: '0.9rem', lineHeight: 1.6 },
  templateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' },
  templateCard: { background: '#FFFDFC', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(123, 94, 87, 0.06)' },
  templatePreview: { height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  templateEmoji: { fontSize: '4.5rem' },
  templateInfo: { padding: '1.75rem' },
  templateName: { fontFamily: 'Playfair Display, serif', color: '#7B5E57', marginBottom: '0.5rem', fontSize: '1.3rem' },
  templateDesc: { color: '#B88B7D', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.25rem' },
  featureList: { listStyle: 'none', padding: 0, margin: '0 0 1.5rem' },
  templateFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: '1.5rem', fontWeight: 700, color: '#7B5E57' },
  pricingGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'start' },
  pricingCard: { background: '#FFFDFC', padding: '2.5rem 2rem', borderRadius: '20px', textAlign: 'center' },
  popularBadge: { position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#7B5E57', color: 'white', padding: '0.35rem 1.5rem', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 600 },
  pricingName: { fontFamily: 'Playfair Display, serif', color: '#7B5E57', marginBottom: '0.75rem' },
  pricingPrice: { fontSize: '3rem', fontWeight: 700, color: '#7B5E57', marginBottom: '1.5rem' },
  pricingFeatures: { listStyle: 'none', padding: 0, margin: '0 0 2rem', textAlign: 'left' },
  faqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' },
  faqItem: { background: '#FFFDFC', padding: '1.75rem', borderRadius: '16px', boxShadow: '0 2px 8px rgba(123, 94, 87, 0.04)' },
  faqQ: { color: '#7B5E57', marginBottom: '0.75rem', fontSize: '1rem' },
  faqA: { color: '#B88B7D', fontSize: '0.9rem', lineHeight: 1.6 },
  ctaSection: { background: 'linear-gradient(135deg, #7B5E57 0%, #302B29 100%)', padding: '5rem 1.5rem', textAlign: 'center' },
  ctaContent: { maxWidth: '600px', margin: '0 auto' },
  ctaTitle: { fontFamily: 'Playfair Display, serif', fontSize: 'clamp(2rem, 5vw, 2.5rem)', color: '#FFFDFC', marginBottom: '1rem' },
  ctaText: { fontSize: '1.1rem', color: '#D9B8A5', marginBottom: '2.5rem', lineHeight: 1.7 },
  footer: { background: '#302B29', color: '#B88B7D', textAlign: 'center', padding: '2.5rem 1.5rem', fontSize: '0.85rem' },
};
