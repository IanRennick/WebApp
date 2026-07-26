// src/components/home/Home.tsx
// =========================================================================
// UNIVERSAL PLATFORM LANDING PORTAL (HOMEPAGE MASTER INTERFACE V1)
// =========================================================================
// - Mounts the cinematic hero entrance video and principal call-to-actions.
// - Features alternating high-contrast content layout information stripes.
// - Directs students smoothly down into distinct curriculum portals.
// =========================================================================
import React from 'react';
import { Link } from 'react-router-dom';
import video from '../../videos/Spaceship1.mp4';
import image1 from '../../images/puzzle.svg';
import image2 from '../../images/writing.svg';
import image3 from '../../images/speaking.svg';
import './home.css';

const Home: React.FC = () => {
  return (
    <div>
      
      {/* ===================================================================
          1. HERO ACCELERATOR INTRODUCTION BANNER
          =================================================================== */}
      <div className="hero_container">
        
        {/* Background Video Media Layer */}
        <div className="heroBg">
          <video className="videoBg" src={video} autoPlay muted loop />
        </div>

        {/* Marketing Slogan Cards */}
        <div className="hero_content">
          <h1 className="hero_heading">Learning English made fun!</h1>
          <p className="hero_para">
            Join Rennlad Academy, have fun while improving your English and getting ready to pass exams.
          </p>

          <div className="btn_wrapper">
            <Link to="/quiz" className="home_button green">
              Get Started!
            </Link>
          </div>
        </div>
      </div>

      {/* ===================================================================
          2. PUZZLES & TRACKING LANDING STRIPE (DARK COMPOSITION)
          =================================================================== */}
      <div className="info_container bgDark">
        <div className="info_wrapper">
          <div className="info_row start">
            
            <div className="column1">
              <div className="text_wrapper">
                <p className="top_line">Improve your use of English skills</p>
                <h1 className="heading light-text">Puzzles</h1>
                <p className="subtitle light-text">
                  Practise puzzles to improve your rating, and climb the leaderboards. Check your statistics and target weaknesses
                </p>

                <div className="btn_wrap">
                  <Link to="/quiz" className="home_button green">
                    Quiz Mode!
                  </Link>
                </div>
              </div>
            </div>

            <div className="column2">
              <div className="image_wrap">
                <img src={image1} className="image" alt="interactive puzzle graphics illustration" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          3. WRITING PORTAL ACCESS STRIPE (LIGHT COMPOSITION)
          =================================================================== */}
      <div className="info_container bgLight">
        <div className="info_wrapper">
          <div className="info_row end">
            
            <div className="column1">
              <div className="text_wrapper">
                <p className="top_line">Improve your writing skills</p>
                <h1 className="heading dark-text">Writings</h1>
                <p className="subtitle dark-text">
                  Send your writings for correction! Try essays, emails, reports, reviews!
                </p>

                <div className="btn_wrap">
                  <Link to="/" className="home_button dark">
                    Start writing!
                  </Link>
                </div>
              </div>
            </div>

            <div className="column2">
              <div className="image_wrap">
                <img src={image2} className="image" alt="writing correction task graphic sheet" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ===================================================================
          4. SPEAKING EXAM PREPARATION STRIPE (DARK COMPOSITION)
          =================================================================== */}
      <div className="info_container bgDark">
        <div className="info_wrapper">
          <div className="info_row start">
            
            <div className="column1">
              <div className="text_wrapper">
                <p className="top_line">Get ready for speaking exams</p>
                <h1 className="heading light-text">Speaking</h1>
                <p className="subtitle light-text">
                  Send your speakings for correction so that you know you are ready when its time for the real deal!
                </p>

                <div className="btn_wrap">
                  <Link to="/" className="home_button green">
                    Practise Speaking!
                  </Link>
                </div>
              </div>
            </div>

            <div className="column2">
              <div className="image_wrap">
                <img src={image3} className="image" alt="microphone and recording audio analysis vectors" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
};

export default Home;