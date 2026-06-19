import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Filter } from 'lucide-react';
import { api } from '../../utils/api';
import './ActiveProject.css';

// Import subcomponents
import { EmptyProjectsState } from '../../components/ActiveProject/EmptyProjectsState';
import { ActiveProjectsList } from '../../components/ActiveProject/ActiveProjectsList';
import { ActiveProjectsInsights } from '../../components/ActiveProject/ActiveProjectsInsights';

export const ActiveProjects = () => {
  // Fetch active ongoing engagements
  const { data: dashboardData, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['my-projects-dashboard-active'],
    queryFn: () => api.get('/projects/my-projects'),
  });

  // Fetch activities (notifications)
  const { data: notificationsData, isLoading: isNotifsLoading } = useQuery({
    queryKey: ['active-projects-notifications'],
    queryFn: () => api.get('/notifications'),
  });

  if (isDashboardLoading || isNotifsLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#70d64d] border-t-transparent rounded-full" />
        <span className="text-gray-400 text-sm">Loading active projects...</span>
      </div>
    );
  }

  const ongoing = dashboardData?.ongoing || [];
  const notifications = notificationsData?.notifications || [];

  // Map backend assignments to UI projects
  const projects = ongoing.map((item) => {
    const p = item.project || {};
    return {
      id: p.id,
      title: p.title,
      clientName: p.client || 'Internal Client',
      status: p.status,
      totalBudget: item.assigned_amount || p.budget || 0,
      deadline: p.end_date ? new Date(p.end_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD',
      progressPercentage: p.progress_percentage || 0,
      milestones: (p.milestones || []).map(m => ({
        name: m.title,
        isCompleted: m.status === 'completed'
      }))
    };
  });

  // Map notifications to insights timeline activities
  const activities = notifications.map((n) => {
    let type = 'message';
    if (n.type === 'approved' || n.type === 'rejected' || n.type === 'submission') {
      type = 'milestone';
    } else if (n.type === 'payment') {
      type = 'payment';
    }
    const refType = n.reference_type || n.referenceType;
    const refId = n.reference_id || n.referenceId;
    const targetUrl = n.action_url || (refType === 'project' && refId ? `/projects/${refId}` : null);

    return {
      type,
      title: n.title,
      timestamp: new Date(n.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
      targetUrl
    };
  });

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