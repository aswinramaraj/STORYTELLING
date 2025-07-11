import React from 'react';
import '../Style/review.css'; // Adjust the path as necessary

const testimonials = [
  {
    stars: 5,
    text: `"StoryClass has revolutionized how my students learn complex scientific concepts. They're now excited about physics and actually remember what they learn! The storytelling approach makes even the hardest topics accessible."`,
    name: 'Ms. Sarah Johnson',
    role: '5th Grade Science Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    stars: 5,
    text: `"I used to hate math, but now I love it! The stories make everything so much easier to understand. I learned about fractions through a pizza party story and I'll never forget it!"`,
    name: 'Emma Chen',
    role: 'Student, Age 12',
    avatar: 'https://randomuser.me/api/portraits/children/5.jpg',
  },
  {
    stars: 5,
    text: `"As both a parent and educator, I'm amazed by how StoryClass bridges the gap between complex technical concepts and young minds. My daughter now explains physics principles to her friends!"`,
    name: 'Michael Rodriguez',
    role: 'Parent & Engineering Teacher',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
];

const Testimonials = () => {
  return (
    <div className="testimonials-section">
      <h2>
        What <span className="green">Teachers</span> &{' '}
        <span className="blue">Students</span> Say
      </h2>
      <p className="subtext">
        Join thousands of educators and learners who've transformed their
        teaching and learning experience
      </p>

      <div className="testimonials-grid">
        {testimonials.map((item, idx) => (
          <div className="testimonial-card" key={idx}>
            <div className="stars">
              {'★'.repeat(item.stars)}
            </div>
            <p className="quote">{item.text}</p>
            <hr />
            <div className="user-info">
              <img src={item.avatar} alt={item.name} />
              <div>
                <strong>{item.name}</strong>
                <p>{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Testimonials;
