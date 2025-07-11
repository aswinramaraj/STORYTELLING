import React from 'react';
import '../Style/hero.css'

const StoryClass = () => {
  return (
    <div className="story-class-container">
       
      {/* Left Side */}
      <div className="left-text">
        
        <h1>
          <span className="blue-text">StoryClass</span>
        </h1>
        <h2>Learn Technical Subjects Through <span className="yellow-text">Amazing Stories</span></h2>
        <p>
          Transform complex concepts into engaging stories with AI-generated videos.
          Perfect for students aged 8–16 who learn best through storytelling and visual experiences.
        </p>
        <div className="button-group">
          <button className="start-btn">Start Learning Now ✨</button>
          <button className="demo-btn">Watch Demo</button>
        </div>
        <div className="stats">
          <div className='stat-item' ><span style={{ color: '#2D9CFF' }}>10K+</span><br />Students Learning</div>
          <div className='stat-item'><span style={{ color: '#27E2B6' }}>500+</span><br />Topics Covered</div>
          <div className='stat-item'><span style={{ color: '#F3C623' }}>98%</span><br />Love Stories</div>
        </div>
      </div>

      {/* Right Side */}
      <div className="right-image">
        <div className="ai-powered-badge">AI Powered! 🚀</div>
        <img
          src='hero-learning.jpg' // any image
          alt="Classroom"
          className="classroom-img"
        />
      </div>
    </div>
  );
};

export default StoryClass;
