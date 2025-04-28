import React from 'react';
import '../component/styling/layout.css';

const Layout = ({ children }) => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };


  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <button 
            className="logo-btn" 
            onClick={() => window.location.reload()} 
          >
            ⚽ Football Academy
          </button>
          <nav className="main-nav">
            <button 
              className="nav-btn" 
              onClick={() => scrollToSection('home')}
            >
              Home
            </button>
            <button 
              className="nav-btn" 
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className="nav-btn" 
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
            <button 
              className="nav-btn" 
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </button>
          </nav>
          <div className="user-actions">
            <button className="user-avatar">VL</button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main">
        {children}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-links">
            <button 
              className="footer-btn" 
              onClick={() => scrollToSection('about')}
            >
              About
            </button>
            <button 
              className="footer-btn" 
              onClick={() => scrollToSection('services')}
            >
              Services
            </button>
            <button 
              className="footer-btn" 
              onClick={() => scrollToSection('contact')}
            >
              Contact Us
            </button>
          </div>
          <div className="copyright">
            © {new Date().getFullYear()} Football Academy Management System
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;