import React from 'react';
import { Briefcase, Users, Building, FileText, TrendingUp } from 'lucide-react';

export const DashboardMetrics = ({ role, isRequestsLoading, registrationRequests }) => {
  if (role === 'admin') {
    return (
      <section className="portal-metrics-grid">
        <div className="metric-card-item">
          <div className="m-card-head"><span>TOTAL PROJECTS</span><Briefcase size={16} /></div>
          <div className="m-card-val">3</div>
        </div>
        <div className="metric-card-item">
          <div className="m-card-head"><span>TOTAL FREELANCERS</span><Users size={16} /></div>
          <div className="m-card-val">0</div>
        </div>
        <div className="metric-card-item">
          <div className="m-card-head"><span>TOTAL AGENCY</span><Building size={16} /></div>
          <div className="m-card-val">1</div>
        </div>
        <div className="metric-card-item">
          <div className="m-card-head"><span>NEW REQUESTS</span><FileText size={16} /></div>
          <div className="m-card-val">
            {isRequestsLoading ? (
              <span className="skeleton-pulse inline-block w-10 h-7 rounded" />
            ) : (
              registrationRequests.filter(r => r.status === 'pending').length
            )}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="portal-metrics-grid">
      <div className="metric-card-item">
        <div className="m-card-head"><span>APPLICATIONS</span><FileText size={16} /></div>
        <div className="m-card-val">2</div>
      </div>
      <div className="metric-card-item">
        <div className="m-card-head"><span>ACTIVE PROJECTS</span><Briefcase size={16} /></div>
        <div className="m-card-val">1</div>
      </div>
      <div className="metric-card-item">
        <div className="m-card-head"><span>COMPLETED PROJECTS</span><Briefcase size={16} /></div>
        <div className="m-card-val">14</div>
      </div>
      <div className="metric-card-item insight-gradient">
        <div className="m-card-head"><span>PERFORMANCE INSIGHT</span><TrendingUp size={16} /></div>
        <div className="m-card-desc">You are in the top 10% of modelers this month.</div>
      </div>
    </section>
  );
};
