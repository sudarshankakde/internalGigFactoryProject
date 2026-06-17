import React from 'react';
import { Clock } from 'lucide-react';

export const ActivityTimeline = ({ role }) => {
  if (role === 'admin') return null;

  return (
    <div className="content-activity-card">
      <h3>Recent Activity</h3>
      <div className="activity-timeline">
        <div className="timeline-node-item">
          <Clock size={14} className="node-icon" />
          <div className="node-body">
            <strong>Milestone 1 approved</strong>
            <p className="text-muted">BIM Modeling for Airport Expansion</p>
            <span className="node-time">2 hours ago</span>
          </div>
        </div>
        <div className="timeline-node-item">
          <Clock size={14} className="node-icon" />
          <div className="node-body">
            <strong>Payment received</strong>
            <p className="text-muted">Structural Drafting - Phase 2</p>
            <span className="node-time">Yesterday</span>
          </div>
        </div>
      </div>
    </div>
  );
};
