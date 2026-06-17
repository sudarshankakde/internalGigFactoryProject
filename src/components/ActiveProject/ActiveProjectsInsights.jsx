import React from 'react';
import { CheckCircle2, FileText, DollarSign, MessageSquare } from 'lucide-react';

export const ActiveProjectsInsights = ({ activities }) => {
  return (
    <div className="projects-insights-column">
      
      {/* Target Billings Score Card */}
      <div className="insight-summary-card">
        <h3>Weekly Summary</h3>
        <p>
          You've logged 32 hours this week, putting you 15% ahead of your billing target.
        </p>
      </div>

      {/* Event Timeline Tracker Card list */}
      <div className="recent-activity-card">
        <div className="activity-card-header">
          <h3>Recent Activity</h3>
          <button className="view-all-link-btn">View All</button>
        </div>
        <div className="activity-timeline-feed">
          {activities.map((act, index) => (
            <div className="timeline-event-node" key={index}>
              <div className="event-icon-wrapper">
                {act.type === 'milestone' && <CheckCircle2 size={13} />}
                {act.type === 'upload' && <FileText size={13} />}
                {act.type === 'payment' && <DollarSign size={13} />}
                {act.type === 'message' && <MessageSquare size={13} />}
              </div>
              <div className="event-content-body">
                <strong>{act.title}</strong>
                <span className="event-timestamp">{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
