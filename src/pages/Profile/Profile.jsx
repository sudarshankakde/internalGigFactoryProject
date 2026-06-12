import React, { useState } from 'react';

import { 

  Mail, MapPin, Phone, Globe, Calendar, Briefcase, Plus, Edit2, 

  Layers, Cpu, Award

} from 'lucide-react';

import { Sidebar } from '../../components/Sidebar/Sidebar';

import './Profile.css';



export const Profile = () => {

  const [role, setRole] = useState('freelancer'); // Default state simulator

  const [view, setView] = useState('profile');     // Toggles between 'dashboard' and 'profile'



  return (

    <div className="app-portal-layout-frame">

      <Sidebar currentRole={role} onRoleChange={setRole} activeView={view} onViewChange={setView} />



      <main className="portal-main-workspace">

        {view === 'dashboard' ? (

          <div className="dashboard-placeholder-view">

            <h2>Dashboard Analytics Workspace View</h2>

            <p>Your main analytical data tables and charts render here.</p>

          </div>

        ) : (

          /* Profile Main Context View Container Block */

          <div className="profile-workspace-view animate-fade-in">

            

            {/* Top Identity Header Profile Section Banner */}

            <header className="profile-identity-banner">

              <div className="profile-identity-main">

                <div className="profile-large-avatar">

                  {role === 'agency' ? 'CS' : 'SJ'} 

                </div>

                <div className="profile-title-details">

                  <div className="profile-name-row">

                    <h1>{role === 'agency' ? 'Creative Studios Inc.' : 'Sarah Johnson'}</h1> 

                    <span className="availability-chip">AVAILABLE</span> 

                  </div>

                  <p className="profile-subtitle-text">

                    {role === 'agency' ? 'Full-Service Digital Agency' : 'Senior Full Stack Developer'} 

                  </p>

                  <div className="meta-contact-links-grid">

                    <span><Mail size={14} /> {role === 'agency' ? 'contact@creativestudios.com' : 'sarah.j@email.com'}</span> 

                    <span><MapPin size={14} /> {role === 'agency' ? 'San Francisco, USA' : 'New York, USA'}</span> 

                    <span><Phone size={14} /> +1 234 567 8900</span> 

                    <span><Globe size={14} /> {role === 'agency' ? 'www.creativestudios.com' : 'portfolio.sarahjohnson.com'}</span> 

                    {role === 'agency' && <span><Calendar size={14} /> Est. 2018</span>} 

                  </div>

                </div>

              </div>

              <button className="edit-profile-action-btn">

                <Edit2 size={14} /> Edit Profile 

              </button>

            </header>



            {/* Metrics Row Blocks */}

            <section className="profile-quick-stats-row">

              <div className="stat-metric-box">

                <span className="stat-label">Projects Assigned</span> 

                <span className="stat-value">1</span> 

              </div>

              {role === 'freelancer' ? (

                <div className="stat-metric-box">

                  <span className="stat-label">Hourly Rate</span> 

                  <span className="stat-value">$75/hr</span> 

                </div>

              ) : (

                <div className="stat-metric-box">

                  <span className="stat-label">Total Team Size</span> 

                  <span className="stat-value">24 Members</span>

                </div>

              )}

              {role === 'freelancer' && (

                <div className="stat-metric-box recommendation-highlight-box">

                  <span className="stat-label">Rating Score</span> 

                  <span className="stat-value">⭐ 4.5</span> 

                  <p className="recommendation-desc-text">Highly recommended for upcoming projects</p> 

                </div>

              )}

            </section>



            {/* Grid Layout Splitting Content Details */}

            <div className="profile-details-split-grid">

              

              {/* Left Column Areas */}

              <div className="profile-details-left-pane">

                

                {/* About Blocks Section */}

                <div className="pane-content-card">

                  <h3>{role === 'agency' ? 'About Our Agency' : 'About Me'}</h3> 

                  <p className="narrative-biography-text">

                    {role === 'agency' ? (

                      'Creative Studios Inc. is a full-service digital agency specializing in web development, mobile applications, and digital design. Founded in 2018, we have grown to a team of 24 talented professionals dedicated to delivering exceptional digital experiences.' 

                    ) : (

                      'Experienced full-stack developer with over 8 years of expertise in building scalable web applications. Specialized in React, Node.js, and cloud technologies. Passionate about creating clean, maintainable code.' 

                    )}

                  </p>

                </div>



                {/* Experience History or Team Breakdown conditionally generated mapping */}

                {role === 'freelancer' ? (

                  <div className="pane-content-card">

                    <h3><Briefcase size={18} /> Professional Experience</h3> 

                    <div className="history-timeline-list">

                      <div className="history-item">

                        <div className="history-meta-row">

                          <strong>Senior Full Stack Developer</strong> 

                          <span className="timeline-badge-year">2020 - Present</span> 

                        </div>

                        <span className="company-attribution-text">Freelance Workspaces</span> 

                        <p className="job-summary-details">Working with various clients on web application development, specializing in React and Node.js ecosystems.</p>

                      </div>

                      <div className="history-item">

                        <div className="history-meta-row">

                          <strong>Full Stack Developer</strong> 

                          <span className="timeline-badge-year">2018 - 2020</span> 

                        </div>

                        <span className="company-attribution-text">Tech Company Inc.</span> 

                        <p className="job-summary-details">Developed and maintained enterprise-level applications serving millions of users globally.</p> 

                      </div>

                    </div>

                  </div>

                ) : (

                  <div className="pane-content-card">

                    <h3><Layers size={18} /> Agency Team Structure Overview</h3> 

                    <div className="team-distribution-matrix">

                      <div className="team-segment-card">

                        <span className="segment-number">12</span> 

                        <span className="segment-title">DEVELOPERS</span> 

                      </div>

                      <div className="team-segment-card">

                        <span className="segment-number">7</span> 

                        <span className="segment-title">DESIGNERS</span> 

                      </div>

                      <div className="team-segment-card">

                        <span className="segment-number">4</span>

                        <span className="segment-title">PROJECT MANAGERS</span> 

                      </div>

                    </div>

                  </div>

                )}

              </div>



              {/* Right Column Areas */}

              <div className="profile-details-right-pane">

                

                {/* Specializations / Expertise Skill pill blocks */}

                <div className="pane-content-card">

                  <h3>

                    {role === 'agency' ? <Award size={18} /> : <Cpu size={18} />} 

                    {role === 'agency' ? 'Agency Specializations' : 'Skills & Expertise'} 

                  </h3>

                  <div className="skills-pill-cloud">

                    {role === 'agency' ? (

                      ['Web Development', 'Mobile Apps', 'UI/UX Design', 'Branding', 'Digital Marketing', 'Cloud Solutions', 'E-commerce', 'Custom Software'].map(tag => (

                        <span key={tag} className="skill-pill-node">{tag}</span> 

                      ))

                    ) : (

                      ['React', 'Node.js', 'TypeScript', 'MongoDB', 'PostgreSQL', 'UI/UX Design', 'REST APIs', 'JavaScript', 'Python', 'AWS', 'Docker', 'Git'].map(tag => (

                        <span key={tag} className="skill-pill-node">{tag}</span> 

                      ))

                    )}

                  </div>

                </div>



                {/* Secure Documents Block Frame */}

                <div className="pane-content-card">

                  <div className="card-header-flex-row">

                    <h3>{role === 'agency' ? 'Agency Documents' : 'Verified Documents'}</h3> 

                    <button className="add-document-action-trigger">

                      <Plus size={14} /> Add 

                    </button>

                  </div>

                  <div className="empty-documents-status-placeholder">

                    <p className="primary-empty-msg">

                      {role === 'agency' ? 'No legal documents uploaded yet' : 'No documents uploaded yet'} 

                    </p>

                    <p className="secondary-empty-msg">

                      {role === 'agency' ? 'Upload verification NDAs, MSAs, or W9 tax files here.' : 'Upload resumes, certifications, or identity documentation files.'} 

                    </p>

                  </div>

                </div>



              </div>

            </div>

          </div>

        )}

      </main>

    </div>

  );

};