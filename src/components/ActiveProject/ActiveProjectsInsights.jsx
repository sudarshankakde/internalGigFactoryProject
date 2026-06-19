import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, FileText, DollarSign, MessageSquare } from 'lucide-react';

export const ActiveProjectsInsights = ({ activities }) => {
  const navigate = useNavigate();

  return (
    <div className="projects-insights-column">
      
      {/* Target Billings Score Card */}
      {/* <div className="insight-summary-card">
        <h3>Weekly Summary</h3>
        <p>
          You've logged 32 hours this week, putting you 15% ahead of your billing target.
        </p>
      </div> */}

      {/* Event Timeline Tracker Card list */}
      <div className="recent-activity-card">
        <div className="activity-card-header">
          <h3>Recent Activity</h3>
        </div>
        <div className="activity-timeline-feed">
          {activities.map((act, index) => (
            <div 
              className={`timeline-event-node ${act.targetUrl ? 'cursor-pointer hover:bg-white/[0.02] p-1 rounded transition' : ''}`} 
              key={index}
              onClick={() => {
                if (act.targetUrl) {
                  navigate(act.targetUrl);
                }
              }}
            >
              <div className="event-icon-wrapper">
                {act.type === 'milestone' && <CheckCircle2 size={13} />}
                {act.type === 'upload' && <FileText size={13} />}
                {act.type === 'payment' && <DollarSign size={13} />}
                {act.type === 'message' && <MessageSquare size={13} />}
              </div>
              <div className="event-content-body">
                <strong className="text-xs text-white block">{act.title}</strong>
                <span className="event-timestamp">{act.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
