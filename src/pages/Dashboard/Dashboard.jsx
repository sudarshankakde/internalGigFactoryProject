import React, { useState, useMemo, useEffect } from 'react';
import {
  useReactTable, getCoreRowModel
} from '@tanstack/react-table';
import {
  Briefcase, Check, X, RotateCcw, Eye
} from 'lucide-react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../store/useAuthStore';

// Import split subcomponents
import { RejectModal } from '../../components/Dashboard/RejectModal';
import { DashboardMetrics } from '../../components/Dashboard/DashboardMetrics';
import { ProjectsTable } from '../../components/Dashboard/ProjectsTable';
import { ActivityTimeline } from '../../components/Dashboard/ActivityTimeline';

export const Dashboard = () => {
  const loggedInUser = useAuthStore((state) => state.user);
  const initialRole = loggedInUser ? loggedInUser.role : 'admin';
  
  const [role, setRole] = useState(initialRole);
  const [activeAdminTab, setActiveAdminTab] = useState('applications');
  const [rejectTarget, setRejectTarget] = useState(null); // drives reject modal

  const navigate    = useNavigate();
  const queryClient = useQueryClient();

  // ── Fetch registration requests ────────────────────────────────────────────
  const { data: registrationRequests = [], isLoading: isRequestsLoading } = useQuery({
    queryKey: ['registrationRequests'],
    queryFn: async () => {
      const response = await api.get('/auth/registration-requests');
      return response.requests || [];
    },
    enabled: role === 'admin',
  });

  // Re-fetch when role becomes admin
  useEffect(() => {
    if (role === 'admin') {
      queryClient.invalidateQueries({ queryKey: ['registrationRequests'] });
    }
  }, [role, queryClient]);

  // ── Query Mutations ────────────────────────────────────────────────────────
  const [approveId, setApproveId] = useState(null);
  const approveQuery = useQuery({
    queryKey: ['registration-approve', approveId],
    queryFn: () => api.post(`/auth/registration-requests/${approveId}/review`, { status: 'approved' }),
    enabled: !!approveId,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (approveQuery.data) {
      toast.success('Registration request approved!');
      queryClient.invalidateQueries({ queryKey: ['registrationRequests'] });
      setApproveId(null);
    }
  }, [approveQuery.data, queryClient]);

  useEffect(() => {
    if (approveQuery.error) {
      toast.error(approveQuery.error.message || 'Approve failed.');
      setApproveId(null);
    }
  }, [approveQuery.error]);

  const [rejectParams, setRejectParams] = useState(null);
  const rejectQuery = useQuery({
    queryKey: ['registration-reject', rejectParams],
    queryFn: () => api.post(`/auth/registration-requests/${rejectParams.id}/review`, {
      status: 'rejected',
      rejectionReason: rejectParams.reason,
    }),
    enabled: !!rejectParams,
    retry: false,
    staleTime: 0,
    gcTime: 0,
  });

  useEffect(() => {
    if (rejectQuery.data) {
      toast.success('Registration request rejected.');
      queryClient.invalidateQueries({ queryKey: ['registrationRequests'] });
      setRejectTarget(null);
      setRejectParams(null);
    }
  }, [rejectQuery.data, queryClient]);

  useEffect(() => {
    if (rejectQuery.error) {
      toast.error(rejectQuery.error.message || 'Rejection failed.');
      setRejectParams(null);
    }
  }, [rejectQuery.error]);

  const handleApproveRequest = (id)         => setApproveId(id);
  const handleOpenReject     = (req)        => setRejectTarget(req);
  const handleConfirmReject  = (id, reason) => setRejectParams({ id, reason });

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
          <span className="project-reference-text">For: {info.row.original.project}</span>
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
    <div>
      {/* Dynamic Contextual Metrics Cards Blocks */}
      <DashboardMetrics
        role={role}
        isRequestsLoading={isRequestsLoading}
        registrationRequests={registrationRequests}
      />

      {/* Primary Data Content Area splits: Table Left, Activity Timeline Right if User */}
      <div className="portal-content-split-row">
        <ProjectsTable
          role={role}
          activeAdminTab={activeAdminTab}
          setActiveAdminTab={setActiveAdminTab}
          registrationRequests={registrationRequests}
          isRequestsLoading={isRequestsLoading}
          approveQuery={approveQuery}
          rejectQuery={rejectQuery}
          handleApproveRequest={handleApproveRequest}
          handleOpenReject={handleOpenReject}
          tableInstance={tableInstance}
          tableData={tableData}
        />

        {/* Contextual Side Activity Panel rendered for Freelancer / Agency views */}
        <ActivityTimeline role={role} />
      </div>

      {rejectTarget && (
        <RejectModal
          request={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirm={handleConfirmReject}
          isPending={rejectQuery.isFetching}
        />
      )}
    </div>
  );
};