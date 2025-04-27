import React from 'react';
import { Link } from 'react-router-dom';
import '../component/styling/landing.css';

const LandingPage = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">⚽ Football Academy</div>
        <div className="nav-links">
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('home')}
          >
            Home
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('about')}
          >
            About
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('services')}
          >
            Services
          </button>
          <button 
            className="nav-link" 
            onClick={() => scrollToSection('contact')}
          >
            Contact
          </button>
          <Link to="/login" className="login-btn">Login</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero">
        <div className="hero-content">
          <h1>Elite Football Academy Management</h1>
          <p>Streamline your academy operations with our comprehensive management system</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-primary">Get Started</Link>
            <button 
              className="cta-secondary"
              onClick={() => scrollToSection('contact')}
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="section">
        <h2>About Our System</h2>
        <div className="about-content">
          <div className="about-card">
            <h3>Player Management</h3>
            <p>Track player progress, attendance, and performance metrics in one centralized platform.</p>
          </div>
          <div className="about-card">
            <h3>Team Coordination</h3>
            <p>Efficiently manage teams, schedules, and training sessions with our intuitive interface.</p>
          </div>
          <div className="about-card">
            <h3>Data Analytics</h3>
            <p>Gain insights with powerful reporting tools to make data-driven decisions.</p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="section dark">
        <h2>Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>Player Registration</h3>
            <p>Streamlined onboarding process for new players with digital forms.</p>
          </div>
          <div className="service-card">
            <h3>Performance Tracking</h3>
            <p>Monitor player development with customizable metrics.</p>
          </div>
          <div className="service-card">
            <h3>Communication Hub</h3>
            <p>Centralized messaging for coaches, players, and parents.</p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="section">
        <h2>Contact Us</h2>
        <div className="contact-container">
          <form className="contact-form">
            <input type="text" placeholder="Your Name" required />
            <input type="email" placeholder="Your Email" required />
            <textarea placeholder="Your Message" required></textarea>
            <button type="submit" className="submit-btn">Send Message</button>
          </form>
          <div className="contact-info">
            <h3>Our Office</h3>
            <p>123 Academy Street, Football City</p>
            <p>Email: info@footballacademy.com</p>
            <p>Phone: +1 (234) 567-8900</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">⚽ Football Academy</div>
          <div className="footer-links">
            <button 
              className="footer-link"
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className="footer-link"
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
            <button 
              className="footer-link"
              onClick={() => scrollToSection('contact')}
            >
              Contact
            </button>
          </div>
          <div className="social-icons">
            {/* Add social media icons here */}
          </div>
        </div>
        <div className="copyright">
          © {new Date().getFullYear()} Football Academy Management System
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;