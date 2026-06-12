import React, { useState, useMemo } from 'react';
import {
  useReactTable, getCoreRowModel, flexRender
} from '@tanstack/react-table';
import {
  Briefcase, Users, Building, FileText, Search,
  Filter, Eye, Check, X, RotateCcw, TrendingUp, Clock,
  User
} from 'lucide-react';
import { Sidebar } from '../../components/Sidebar/Sidebar';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

export const Dashboard = () => {
  const [role, setRole] = useState('admin'); // State handles multi-role dynamic swapping


  const navigate = useNavigate();
  // const [view,setView]=useState('');

  /* Mock Datasets mapped for Admin and User states */
  const [adminApplications, setAdminApplications] = useState([
    { id: 1, type: 'FREELANCER', name: 'Sarah Johnson', project: 'E-commerce Website Redesign', email: 'sarah.j@email.com', status: 'PENDING' },
    { id: 2, type: 'AGENCY', name: 'Creative Studios Inc.', project: 'Mobile App Development', email: 'contact@creativestudios.com', status: 'SELECTED' }
  ]);

  const [userProjects] = useState([
    { id: 101, title: 'BIM Modeling for Airport Expansion', subtitle: 'Providing detailed 3D structural models and clash detection for Terminal B...', budget: '$8,500', status: 'IN PROGRESS' },
    { id: 102, title: 'Construction Site 4D Simulation', subtitle: 'Time-scaled visualization for downtown high-rise project. Awaiting schedule...', budget: '$6,000', status: 'PENDING' }
  ]);

  const handleAdminAction = (id, nextStatus) => {
    setAdminApplications(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
  };

  /* TanStack Table Columns Configurations */
  const adminColumns = useMemo(() => [
    {
      header: 'TYPE',
      accessorKey: 'type',
      cell: info => (
        <span className={`role-chip chip-${info.getValue().toLowerCase()}`}>
          {info.getValue()}
        </span>
      )
    },
    {
      header: 'NAME',
      accessorKey: 'name',
      cell: info => (
        <div className="name-details-cell">
          <strong>{info.getValue()}</strong>
          <span className="project-reference-text">For: {info.row.original.project}</span> {/* [cite: 130, 142] */}
        </div>
      )
    },
    { header: 'EMAIL', accessorKey: 'email' },
    {
      header: 'STATUS',
      accessorKey: 'status',
      cell: info => <span className={`status-badge state-${info.getValue().toLowerCase()}`}>{info.getValue()}</span>
    },
    {
      header: 'PORTFOLIO',
      cell: () => <button className="view-portfolio-btn"><Eye size={16} /></button>
    },
    {
      header: 'ACTIONS',
      cell: info => {
        const item = info.row.original;
        return (
          <div className="table-actions-cluster">
            {item.status === 'PENDING' ? (
              <>
                <button className="btn-act accept" onClick={() => handleAdminAction(item.id, 'SELECTED')}><Check size={12} /> ACCEPT</button>
                <button className="btn-act reject" onClick={() => handleAdminAction(item.id, 'REJECT')}><X size={12} /> REJECT</button>
              </>
            ) : (
              <button className="btn-act reset" onClick={() => handleAdminAction(item.id, 'PENDING')}><RotateCcw size={12} /> RESET</button>
            )}
          </div>
        );
      }
    }
  ], [adminApplications]);

  const userColumns = useMemo(() => [
    {
      header: 'PROJECT WORKSPACE',
      accessorKey: 'title',
      cell: info => (
        <div className="name-details-cell">
          <strong>{info.getValue()}</strong>
          <span className="project-reference-text">{info.row.original.subtitle}</span>
        </div>
      )
    },
    { header: 'BUDGET', accessorKey: 'budget' },
    {
      header: 'STATUS',
      accessorKey: 'status',
      cell: info => <span className={`status-badge state-${info.getValue().replace(' ', '').toLowerCase()}`}>{info.getValue()}</span>
    },
    {
      header: 'MANAGEMENT',
      cell: () => <button className="btn-details-action">VIEW DETAILS</button>
    }
  ], []);

  // Set selected dataset dynamically based on simulated role state
  const tableData = useMemo(() => role === 'admin' ? adminApplications : userProjects, [role, adminApplications, userProjects]);
  const tableColumns = useMemo(() => role === 'admin' ? adminColumns : userColumns, [role, adminColumns, userColumns]);

  const tableInstance = useReactTable({
    data: tableData,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <div className="app-portal-layout-frame">
      <Sidebar currentRole={role} onRoleChange={setRole} />

      <main className="portal-main-workspace">
        {/* Global Structural Header */}
        <header className="workspace-header-node">
          <div>
            <h1>{role === 'admin' ? 'Admin Dashboard' : 'Dashboard Overview'}</h1>
            <p>{role === 'admin' ? 'Manage project applications and platform activity' : "Here is what's happening with your projects today."}</p>
          </div>
          {/* <div className="header-greeting-banner">
            Welcome back, {role === 'admin' ? 'Admin' : 'Alex'} 
          </div> */}

          <div 
              className="header-avatar-circle-btn"
              onClick={() => navigate('/profile')}
              role="button"
              tabIndex={0}
              title="Open profile photo"
            >
              <User size={20} className="header-avatar-icon" />

            </div>

          {/* <div className={`sidebar-user-profile clickable-profile-card ${view === 'profile' ? 'active' : ''}`}
            onClick={() => setView('profile')}
            role="button"
            tabIndex={0}
            title="View My Profile">
            <div className="profile-avatar">
              {role === 'admin' ? 'AD' : 'SJ'}
            </div>
            <div className="profile-details">
              <h4>{role === 'admin' ? 'Admin User' : 'Sarah Johnson'}</h4>
              <p>{role.toUpperCase()}</p>
            </div>
          </div> */}



        </header>

        {/* Dynamic Contextual Metrics Cards Blocks */}
        <section className="portal-metrics-grid">
          {role === 'admin' ? (
            <>
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
                <div className="m-card-val">0</div>
              </div>
            </>
          ) : (
            <>
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
            </>
          )}
        </section>

        {/* Primary Data Content Area splits: Table Left, Activity Timeline Right if User */}
        <div className="portal-content-split-row">
          <div className="content-table-card">
            <div className="table-card-top-controls">
              <h3>{role === 'admin' ? 'Project Applications' : 'Active Projects'}</h3>
              <div className="controls-inputs-cluster">
                <div className="search-field-wrapper">
                  <Search size={14} />
                  <input type="text" placeholder="Search entries..." />
                </div>
                <button className="ctrl-filter-btn"><Filter size={14} /> Filter</button>
              </div>
            </div>

            {/* TanStack Responsive Table Core implementation Container */}
            <div className="tanstack-table-overflow-frame">
              <table className="portal-tanstack-native-table">
                <thead>
                  {tableInstance.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th key={header.id}>
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody>
                  {tableInstance.getRowModel().rows.map(row => (
                    <tr key={row.id}>
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <footer className="table-footer-pagination-bar">
              <span>Showing 1 to {tableData.length} entries</span>
              <div className="btn-pagination-nav-group">
                <button className="p-nav disabled">Prev</button>
                <button className="p-num active">1</button>
                <button className="p-nav disabled">Next</button>
              </div>
            </footer>
          </div>

          {/* Contextual Side Activity Panel rendered for Freelancer / Agency views */}
          {role !== 'admin' && (
            <div className="content-activity-card">
              <h3>Recent Activity</h3> {/* [cite: 76, 174] */}
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
          )}
        </div>
      </main>
    </div>
  );
};