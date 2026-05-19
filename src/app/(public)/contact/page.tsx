'use client';

import React, { useState } from 'react';
import styles from './contact.module.css';

export default function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      subject: formData.get('subject'),
      message: formData.get('message'),
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>
          Have a question or need assistance with DealsAgent? We're here to help.
          Fill out the form below and our support team will get back to you shortly.
        </p>
      </div>

      <div className={styles.card}>
        {status === 'success' ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
            <h2>Message Sent Successfully!</h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>
              Thank you for reaching out. We will review your message and get back to you within 24-48 hours.
            </p>
            <button 
              onClick={() => setStatus('idle')}
              style={{
                marginTop: '2rem',
                padding: '0.75rem 1.5rem',
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Send Another Message
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.label}>Full Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                className={styles.input} 
                required 
                placeholder="Enter your full name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.label}>Email Address</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                className={styles.input} 
                required 
                placeholder="Enter your email address"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="subject" className={styles.label}>Subject</label>
              <select 
                id="subject" 
                name="subject" 
                className={styles.input}
                required
              >
                <option value="">Select a subject...</option>
                <option value="support">App Support & Troubleshooting</option>
                <option value="deal">Report an Expired Deal</option>
                <option value="feedback">General Feedback</option>
                <option value="partnership">Partnership Inquiry</option>
              </select>
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="message" className={styles.label}>Message</label>
              <textarea 
                id="message" 
                name="message" 
                className={styles.textarea} 
                required 
                placeholder="How can we help you today?"
              ></textarea>
            </div>
            
            <button 
              type="submit" 
              className={styles.submitBtn}
              disabled={status === 'submitting'}
              style={{ opacity: status === 'submitting' ? 0.7 : 1 }}
            >
              {status === 'submitting' ? 'Sending...' : 'Send Message ✉️'}
            </button>
          </form>
        )}
      </div>

      <div className={styles.contactInfo}>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>📧</div>
          <div className={styles.infoTitle}>Email Support</div>
          <div className={styles.infoText}>dealsagentai@gmail.com</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>⏱️</div>
          <div className={styles.infoTitle}>Response Time</div>
          <div className={styles.infoText}>Within 24-48 hours</div>
        </div>
        <div className={styles.infoItem}>
          <div className={styles.infoIcon}>📍</div>
          <div className={styles.infoTitle}>Headquarters</div>
          <div className={styles.infoText}>Cumming, GA</div>
        </div>
      </div>
    </div>
  );
}
