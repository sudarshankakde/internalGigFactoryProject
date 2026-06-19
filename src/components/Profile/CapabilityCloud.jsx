import React from 'react';
import { Cpu, Award } from 'lucide-react';

export const CapabilityCloud = ({ isFreelancer, skills }) => {
  return (
    <div className="pane-content-card">
      <h3>
        {isFreelancer ? <Cpu size={18} /> : <Award size={18} />}
        {isFreelancer ? 'Skills & Expertise' : 'Agency Capabilities'}
      </h3>
      <div className="skills-pill-cloud">
        {skills.length === 0 ? (
          <p className="text-[var(--text-muted)] text-[0.85rem]">No capabilities listed yet.</p>
        ) : (
          skills.map((s, idx) => (
            <span key={s.id || idx} className="skill-pill-node">{s.skill_name}</span>
          ))
        )}
      </div>
    </div>
  );
};
