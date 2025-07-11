import React from 'react'
import Header from '../Component/Header'
import Hero from '../Component/Hero' // Assuming Hero is the main content component
import StoryGenerator from '../Component/Storygenerate'
import Testimonials from '../Component/Review'

const Main = () => {
  return (
    <div>
        <Header />
        <Hero />
        <StoryGenerator />
        <Testimonials />
        {/* Assuming Hero is a component that displays the main content */}
        
    </div>
  )
}

export default Main