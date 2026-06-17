import React from 'react';
import { Briefcase } from 'lucide-react';

export const WorkHistory = ({ workHistory }) => {
  return (
    <div className="pane-content-card">
      <h3><Briefcase size={18} /> Professional Experience</h3>
      {(!workHistory || workHistory.length === 0) ? (
        <p className="job-summary-details" style={{ fontStyle: 'italic' }}>No professional experience history listed yet.</p>
      ) : (
        <div className="history-timeline-list">
          {workHistory.map((job) => (
            <div key={job.id} className="history-item">
              <div className="history-meta-row">
                <strong>{job.designation}</strong>
                <span className="timeline-badge-year">
                  {job.start_date ? new Date(job.start_date).getFullYear() : ''} - {job.end_date ? new Date(job.end_date).getFullYear() : 'Present'}
                </span>
              </div>
              <span className="company-attribution-text">{job.company_name}</span>
              <p className="job-summary-details">{job.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
