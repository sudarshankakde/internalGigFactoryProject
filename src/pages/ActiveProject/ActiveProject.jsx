import React, { useState } from 'react';
import { 
  Briefcase, ArrowRight, Filter, CheckCircle2, 
  Circle, FileText, DollarSign, MessageSquare, Clock 
} from 'lucide-react';
import './ActiveProject.css';

export const ActiveProjects = () => {
  /* FRONTEND STATE REPLICATION:
    To inspect Image 1 (Empty State), change this declaration parameter to: useState([])
    To inspect Image 2 (Active Projects), keep the loaded mock objects array layout.
  */
  const [projects, setProjects] = useState([
    {
      id: "p_01",
      title: "Enterprise API Refactor",
      clientName: "TechNova Solutions",
      status: "In Progress",
      totalBudget: 12500,
      timeTracked: "48h/80h",
      deadline: "Oct 24",
      progressPercentage: 60,
      milestones: [
        { name: "Architecture Review", isCompleted: true },
        { name: "Authentication Module Rewrite", isCompleted: false },
        { name: "Database Migration Scripts", isCompleted: false }
      ]
    },
    {
      id: "p_02",
      title: "Design System V2",
      clientName: "Acme Corp",
      status: "Pending Review",
      milestoneValue: 4200,
      deadline: "Oct 24",
      progressPercentage: 90,
      milestones: [
        { name: "Component Token Audit", isCompleted: true },
        { name: "Figma Library Sync", isCompleted: true },
        { name: "Documentation Deploy", isCompleted: false }
      ]
    }
  ]);

  const [activities] = useState([
    { type: 'milestone', title: "Milestone Approved for Design System V2.", timestamp: "2 hours ago" },
    { type: 'upload', title: "File Uploaded: 'auth_flow_v3.ts' to Enterprise API Refactor.", timestamp: "5 hours ago" },
    { type: 'payment', title: "Payment Received $2,500 from Mobile App Landing Page.", timestamp: "Yesterday" },
    { type: 'message', title: "New Message from TechNova Solutions regarding timeline.", timestamp: "Yesterday" }
  ]);

  return (
    <div className="active-projects-workspace animate-fade-in">
      {/* Workspace Subheading Controls Header Block */}
      <header className="workspace-header-node">
        <div>
          <h1>Active Projects</h1>
          <p>
            {projects.length === 0 
              ? "Projects you are currently working on" 
              : `Managing ${projects.length} ongoing engagements this month.`}
          </p>
        </div>
        {projects.length > 0 && (
          <button className="ctrl-filter-btn">
            <Filter size={14} /> Filter
          </button>
        )}
      </header>

      {/* CONDITIONAL INTERFACE BRANCH SWITCH */}
      {projects.length === 0 ? (
        
        /* ============================================================
           IMAGE 1 LAYOUT: CLEAN SCREEN EMPTY PLACEHOLDER PANELS 
           ============================================================ */
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

      ) : (

        /* ============================================================
           IMAGE 2 LAYOUT: ACTIVE INSIGHT METRICS & PROJECT CHIPS
           ============================================================ */
        <div className="projects-content-split-layout">
          
          {/* Left Grid Stream: Individual Tracking Cards */}
          <div className="projects-trackers-column">
            {projects.map((project) => (
              <div className="engagement-tracker-card" key={project.id}>
                <div className="tracker-card-header">
                  <div>
                    <h3>{project.title}</h3>
                    <span className="client-attribution-text">Client: {project.clientName}</span>
                  </div>
                  <span className={`engagement-status-tag state-${project.status.toLowerCase().replace(/\s+/g, '')}`}>
                    {project.status}
                  </span>
                </div>

                {/* Primary Financial & Timing Analytics Numbers */}
                <div className="tracker-metrics-row">
                  <div className="tracker-metric-block">
                    <span className="m-label">
                      {project.milestoneValue ? 'MILESTONE VALUE' : 'TOTAL BUDGET'}
                    </span>
                    <span className="m-value">
                      ${(project.milestoneValue || project.totalBudget || 0).toLocaleString()}
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
                    <strong>{project.progressPercentage || 0}%</strong>
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
                            <CheckCircle2 size={13} className="icon-done" />
                          ) : (
                            <Circle size={13} className="icon-pending" />
                          )}
                          <span className={milestone.isCompleted ? 'text-done' : 'text-pending'}>
                            {milestone.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="tracker-action-footer">
                  <button className="view-details-action-btn">VIEW DETAILS</button>
                </div>
              </div>
            ))}
          </div>

          {/* Right Workspace Split Pane: Activity Feeds & Billing Targets */}
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
        </div>
      )}
    </div>
  );
};