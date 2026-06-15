import React from 'react';

export const ProfileAbout = ({ isFreelancer, bio, description }) => {
  return (
    <div className="pane-content-card">
      <h3>{isFreelancer ? 'About Me' : 'About Our Agency'}</h3>
      <p className="narrative-biography-text">
        {isFreelancer 
          ? (bio || 'No biography details provided yet.') 
          : (description || 'No description details provided yet.')
        }
      </p>
    </div>
  );
};
