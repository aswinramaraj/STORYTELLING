import React, { useEffect, useState } from 'react';
import '../Style/Header.css'; // Adjust the path as necessary

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`main-header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="logo">
        <div className="icon">S</div>
        <span className="brand">StoryClass</span>
      </div>
      <nav className="nav">
        <a href="#" className='nav-link'>Features</a>
        <a href="#" className='nav-link'>Reviews</a>
        <a href="#" className='nav-link'>Pricing</a>
        
      </nav>
      <div className="auth-buttons">
        <button className="login-btn">Log In</button>
        <button className="try-btn">Try Free</button>
      </div>
    </header>
  );
};

export default Header;
