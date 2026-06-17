import React from 'react';
import { Briefcase, ArrowRight } from 'lucide-react';

export const EmptyProjectsState = () => {
  return (
    <div className="empty-projects-card-panel">
      <div className="empty-illustrative-icon">
        <Briefcase size={44} strokeWidth={1.5} />
      </div>
      <h2>No Active Projects</h2>
      <p>
        Once an admin approves your application, the project will appear here 
        for you to collaborate and upload files.
      </p>
      <button className="check-status-action-trigger">
        CHECK APPLICATION STATUS <ArrowRight size={15} />
      </button>
    </div>
  );
};
