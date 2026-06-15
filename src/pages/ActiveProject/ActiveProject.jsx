import React, { useState } from 'react';
import { Filter } from 'lucide-react';
import './ActiveProject.css';

// Import subcomponents
import { EmptyProjectsState } from '../../components/ActiveProject/EmptyProjectsState';
import { ActiveProjectsList } from '../../components/ActiveProject/ActiveProjectsList';
import { ActiveProjectsInsights } from '../../components/ActiveProject/ActiveProjectsInsights';

export const ActiveProjects = () => {
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
        <EmptyProjectsState />
      ) : (
        <div className="projects-content-split-layout">
          <ActiveProjectsList projects={projects} />
          <ActiveProjectsInsights activities={activities} />
        </div>
      )}
    </div>
  );
};