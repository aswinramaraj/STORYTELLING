import React, { useState } from 'react';
import '../Style/storygenerate.css'; // Adjust the path as necessary
import axios from 'axios'; // Ensure axios is installed in your project
import { set } from 'mongoose';

const StoryGenerator = () => {
  const [topic, setTopic] = useState('');
  const [title, setTitle] = useState('');
  const [category,setcategory] = useState('');
  const [valid,setvalid] = useState('');
  const [description, setDescription] = useState('');
  const [suggestions, setSuggestions] = useState("");
  const [ageGroup, setAgeGroup] = useState('');
  const [language, setLanguage] = useState('');
  const [story, setStory] = useState('');
  const [toggle,settoggle] = useState(0);
  const [storyscript,setstoryscript] = useState("")

  const handleGenerate = () => {
    try{
      const story = axios.post('http://localhost:5000/api/generate', {
        
          topic,
          ageGroup,
          language
        }
      );
      
      story.then((response) => {
        if (response.data && response.data.story) {
             setTitle(response.data.story.title || 'Untitled Story');
          setDescription(response.data.story.summary || 'No description available.');
          setvalid(response.data.story.status || 'valid');
          setSuggestions(response.data.story.suggestion || '');
          setcategory(response.data.story.category || 'No category')
        } else {
          setStory('No story generated. Please try again.');
        }
      });
    }
    catch (error) {
      console.error('Error generating story:', error);
      setStory('Failed to generate story. Please try again.');
    }
  };

 const handleage = () => {
  if (topic.trim() === "") {
   
    const el = document.getElementById('topic');
    if (el) {
      el.focus();
      el.style.border = '2px solid red';

      // ✅ Scroll into view (optional UX enhancement)
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });

      // ✅ VIBRATION
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100]); // vibrate, pause, vibrate
      }

      // ✅ Add shake animation
      el.classList.add('shake');
      setTimeout(() => el.classList.remove('shake'), 500); // remove class after animation
    }
  } else {
    settoggle(1); // Proceed
  }
};


const handlegeneratestory = () => {
   try{
       const story = axios.post('http://localhost:5000/api/generatestory', {
           title,
           description,
           valid,
           topic,
           language,
           ageGroup
       });

       story.then((response) => {
           if (response.data && response.data.story) {
            const parsed = JSON.parse(response.data.story);
            setStory(parsed.story);                // Sets full story text
            setstoryscript(parsed.video_script); 
               console.log({storyscript})
           } else {
               setStory('No story generated. Please try again.');
           }
       });
   }
   catch (error) {
       console.error('Error generating story:', error);
       setStory('Failed to generate story. Please try again.');
   }
}


//generate video

const handlegeneratevideo = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/generateImage', {
      story: "Your full story here",
      video_script: [
        "Sunlight pierces through the dense jungle canopy as the forest begins to stir",
        "Graceful animals step out from the shadows, blending into the lush greenery",
        "Flocks of colorful birds soar across the glowing amber sky, painting trails of freedom"
      ]
      
    }
 
  );
 

    console.log("✅ Images generated:", response.data.images);
  } catch (err) {
    console.error('Error generating video:', err);
    setStory('Failed to generate video');
  }

  
};



  return (
    <div className="story-generator-container">
      <h1>
        Create Your <span className="highlight">Learning Story</span>
      </h1>
      <p className="subtitle">Enter a technical topic and watch it transform into an engaging story!</p>

      <div className="story-card-wrapper">
        {/* Form Section */}
        <div className="form-card">
          <h2>📘 Story Generator</h2>
          {toggle === 0 ? (
  <>
    <label>Technical Topic Description</label>
    <textarea
      rows="4"
      className="description-input"
      placeholder="e.g., Explain the law or process in your own words..."
      value={topic}
      id='topic'
      onChange={(e) => setTopic(e.target.value)}
    ></textarea>
    <button className="next-btn" onClick={handleage}>
      Next: Choose Age & Language
    </button>
  </>
) : null}

{toggle === 1 ? (
  <>
    <div className="form-row">
      <div>
        <label>Age Group</label>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">Select age group</option>
          <option value="8-10">8–10</option>
          <option value="11-13">11–13</option>
          <option value="14-16">14–16</option>
        </select>
      </div>
      <div>
        <label>Language</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="">Select language</option>
          <option value="English">English</option>
          <option value="Tamil">Tamil</option>
          <option value="Hindi">Hindi</option>
        </select>
      </div>
    </div>

    <div className="btn-row">
      <button className="generate-btn" onClick={handleGenerate}>
        💡 Generate Learning Story
      </button>
      <button className="reset-btn" onClick={() => {
        setTopic('');
        setAgeGroup('');
        setLanguage('');
        setStory('');
        settoggle(0);
      }}>
        🔄 Reset
      </button>
    </div>
  </>
) : null}

        </div>

        {/* Output Section */}
        <div className="output-card">
          <h2 className="green-title">Your Generated Story</h2>
          {story && toggle === 1 ? (
            <>
            <p className="story-text">{story}</p>
            <button className="continue-btn" onClick={handlegeneratestory}>
            Continue with Generated Story
          </button>
          </>
          ) : title && toggle === 1 ? (
            <div>
              <h3>{title}</h3>
              <h3>{category}</h3>
              <p>{description}</p>
              {suggestions && (
                <div className="suggestions">
                  <h4>Suggestions to Improve:</h4>
                  <p>{suggestions}</p>
                </div>
              )}
             <p className="valid-status">Status: {valid}</p>
{valid === 'invalid' ? (
  <button className="retry-btn" onClick={() => {
    setTopic('');
    setAgeGroup('');
    setLanguage('');
    setStory('');
    settoggle(0);
  }}>
    Retry with Better Input
  </button>
) : (title && toggle === 1 ? (
  <button className="continue-btn" onClick={handlegeneratestory}>
    Continue with Generated Story
  </button>
) : null )}
</div>
          ) : (
            <div className="placeholder">
              <span className="book-icon">📖</span>
              <p>Your amazing story will appear here!</p>
              <small>Fill out the form and click generate to start.</small>
              <button className="continue-btn" onClick={handlegeneratevideo}>
            Continue with Generated Video
          </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoryGenerator;
