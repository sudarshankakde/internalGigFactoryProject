import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';

export const ActiveProjectsList = ({ projects }) => {
  const navigate = useNavigate();

  return (
    <div className="projects-trackers-column">
      {projects.map((project) => (
        <div className="engagement-tracker-card" key={project.id}>
          <div className="tracker-card-header">
            <div>
              <h3>{project.title}</h3>
              <span className="client-attribution-text">Client: {project.clientName}</span>
            </div>
            <span className={`engagement-status-tag state-${project.status.toLowerCase().replace(/\s+/g, '')}`}>
              {project.status === 'assigned' ? 'In Progress' : project.status}
            </span>
          </div>

          {/* Primary Financial & Timing Analytics Numbers */}
          <div className="tracker-metrics-row">
            <div className="tracker-metric-block">
              <span className="m-label">
                {project.milestoneValue ? 'MILESTONE VALUE' : 'TOTAL BUDGET'}
              </span>
              <span className="m-value font-bold text-white">
                ₹{Number(project.milestoneValue || project.totalBudget || 0).toLocaleString('en-IN')}
              </span>
            </div>
            
            {project.timeTracked && (
              <div className="tracker-metric-block">
                <span className="m-label">TIME TRACKED</span>
                <span className="m-value">{project.timeTracked}</span>
              </div>
            )}

            <div className="tracker-metric-block">
              <span className="m-label">DEADLINE</span>
              <span className="m-value">{project.deadline}</span>
            </div>
          </div>

          {/* Quantitative Graphing Progress Track Block */}
          <div className="tracker-progress-section">
            <div className="progress-label-row">
              <span>Overall Progress</span>
              <strong className="text-[#70d64d]">{project.progressPercentage || 0}%</strong>
            </div>
            <div className="progress-bar-track">
              <div 
                className="progress-bar-fill" 
                style={{ width: `${project.progressPercentage || 0}%` }}
              ></div>
            </div>
          </div>

          {/* Substep Milestone Verification List */}
          {project.milestones && project.milestones.length > 0 && (
            <div className="tracker-milestones-block">
              <h4>Key Milestones</h4>
              <div className="milestones-checklist-grid">
                {project.milestones.map((milestone, idx) => (
                  <div className="milestone-check-row" key={idx}>
                    {milestone.isCompleted ? (
                      <CheckCircle2 size={13} className="icon-done text-[#70d64d]" />
                    ) : (
                      <Circle size={13} className="icon-pending" />
                    )}
                    <span className={milestone.isCompleted ? 'text-done text-gray-300 font-semibold' : 'text-pending text-gray-500'}>
                      {milestone.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="tracker-action-footer">
            <button 
              onClick={() => navigate(`/projects/${project.id}`)}
              className="view-details-action-btn cursor-pointer"
            >
              VIEW DETAILS
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
