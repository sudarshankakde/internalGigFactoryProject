import React from 'react';
import { Layers } from 'lucide-react';

export const TeamStructure = ({ employeeCount }) => {
  const devCount = Math.ceil(employeeCount * 0.5);
  const designCount = Math.floor(employeeCount * 0.3);
  const pmCount = Math.max(0, employeeCount - devCount - designCount);

  return (
    <div className="pane-content-card">
      <h3><Layers size={18} /> Agency Team Structure Overview</h3>
      <div className="team-distribution-matrix">
        <div className="team-segment-card">
          <span className="segment-number">{devCount}</span>
          <span className="segment-number-label" style={{ display: 'none' }}>Developers</span>
          <span className="segment-title">DEVELOPERS</span>
        </div>
        <div className="team-segment-card">
          <span className="segment-number">{designCount}</span>
          <span className="segment-number-label" style={{ display: 'none' }}>Designers</span>
          <span className="segment-title">DESIGNERS</span>
        </div>
        <div className="team-segment-card">
          <span className="segment-number">{pmCount}</span>
          <span className="segment-number-label" style={{ display: 'none' }}>Project Managers</span>
          <span className="segment-title">PROJECT MANAGERS</span>
        </div>
      </div>
    </div>
  );
};
