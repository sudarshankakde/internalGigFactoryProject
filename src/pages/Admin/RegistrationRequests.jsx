import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Users, Building2, FileText, Clock, Search, RefreshCw, Filter,
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { Pagination } from '../../components/AdminShared';

// Import subcomponents
import { RegistrationRequestsTable } from '../../components/Admin/RegistrationRequestsTable';
import { RegistrationRequestDetailModal } from '../../components/Admin/RegistrationRequestDetailModal';
import { RegistrationRequestRejectModal } from '../../components/Admin/RegistrationRequestRejectModal';

const PAGE_SIZE = 10;

export default function RegistrationRequests() {
  const queryClient = useQueryClient();
  const location = useLocation();
  const navigate = useNavigate();
  const [search,       setSearch]       = useState('');
  const [dSearch,      setDSearch]      = useState('');
  const [statusFilter, setStatusFilter] = useState(() => localStorage.getItem('requests_status_filter') || 'all');
  const [roleFilter,   setRoleFilter]   = useState(() => localStorage.getItem('requests_role_filter') || 'all');
  const [sortBy,       setSortBy]       = useState(() => localStorage.getItem('requests_sort_by') || 'newest');
  const [page,         setPage]         = useState(1);
  const [selectedReq,  setSelectedReq]  = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('requests_status_filter', statusFilter);
  }, [statusFilter]);

  useEffect(() => {
    localStorage.setItem('requests_role_filter', roleFilter);
  }, [roleFilter]);

  useEffect(() => {
    localStorage.setItem('requests_sort_by', sortBy);
  }, [sortBy]);

  // reset page on filter change
  useEffect(() => { setPage(1); }, [dSearch, statusFilter, roleFilter, sortBy]);
  
  const { data: allRequests = [], isLoading, refetch } = useQuery({
    queryKey: ['admin-registration-requests'],
    queryFn:  () => api.get('/auth/registration-requests').then(r => r.requests || []),
  });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reqId = params.get('id');
    if (reqId && allRequests.length > 0) {
      const match = allRequests.find(r => r.id === reqId || String(r.id) === String(reqId));
      if (match) {
        setSelectedReq(match);
      }
    }
  }, [location.search, allRequests]);

  const { data: historyData = null, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['reg-request-history', selectedReq?.id],
    queryFn: () => api.get(`/auth/registration-requests/${selectedReq.id}/history`),
    enabled: !!selectedReq?.id,
  });

  const [reviewParams, setReviewParams] = useState(null);
  const reviewQuery = useQuery({
    queryKey: ['reg-review', reviewParams],
    queryFn: () => api.post(`/auth/registration-requests/${reviewParams.id}/review`, {
      status: reviewParams.status,
      rejectionReason: reviewParams.rejectionReason,
      canReapplyAt: reviewParams.canReapplyAt,
    }),
    enabled: !!reviewParams,
    retry: false, staleTime: 0, gcTime: 0,
  });

  useEffect(() => {
    if (reviewQuery.data) {
      toast.success('Application decision saved successfully!');
      queryClient.invalidateQueries({ queryKey: ['admin-registration-requests'] });
      setSelectedReq(null); setRejectTarget(null); setReviewParams(null);
      if (new URLSearchParams(location.search).has('id')) {
        navigate('/admin/requests', { replace: true });
      }
    }
  }, [reviewQuery.data, queryClient, location.search, navigate]);

  useEffect(() => {
    if (reviewQuery.error) { toast.error(reviewQuery.error.message || 'Operation failed.'); setReviewParams(null); }
  }, [reviewQuery.error]);

  const handleApprove       = (id)         => setReviewParams({ id, status: 'approved' });
  const handleOpenReject    = (req)        => setRejectTarget(req);
  const handleConfirmReject = (id, reason) => setReviewParams({ id, status: 'rejected', rejectionReason: reason });
  const handleUpdateDecision = (id, p)    => setReviewParams({ id, ...p });
  
  // client-side filter + sort + paginate
  const sorted = useMemo(() => {
    let arr = [...allRequests].filter(r => {
      const matchStatus = statusFilter === 'all' || r.status === statusFilter;
      const matchRole   = roleFilter   === 'all' || r.role   === roleFilter;
      const q = dSearch.toLowerCase();
      const matchSearch = !q || r.full_name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q) || r.mobile?.includes(q);
      return matchStatus && matchRole && matchSearch;
    });
    if (sortBy === 'oldest')    arr.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
    else if (sortBy === 'name') arr.sort((a, b) => (a.full_name || '').localeCompare(b.full_name || ''));
    return arr;
  }, [allRequests, statusFilter, roleFilter, dSearch, sortBy]);
  const totalPages = Math.ceil(sorted.length / PAGE_SIZE);
  const pageItems  = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const stats = useMemo(() => ({
    total:    allRequests.length,
    pending:  allRequests.filter(r => r.status === 'pending').length,
    approved: allRequests.filter(r => r.status === 'approved').length,
    rejected: allRequests.filter(r => r.status === 'rejected').length,
  }), [allRequests]);

  const S = {
    filterBtn: { background: '#0c0c0e', border: '1px solid #23232a', color: '#6b7280', borderRadius: '6px', padding: '7px 14px', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.1s' },
    filterBtnActive: { background: '#70d64d', color: '#000', borderColor: '#70d64d', fontWeight: 700 },
    select: { background: '#0c0c0e', border: '1px solid #23232a', color: '#fff', borderRadius: '6px', padding: '7px 12px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Requests', value: stats.total,    Icon: FileText,  accent: false },
          { label: 'Pending Review', value: stats.pending,  Icon: Clock,     accent: true  },
          { label: 'Approved',       value: stats.approved, Icon: Users,     accent: false },
          { label: 'Rejected',       value: stats.rejected, Icon: Building2, accent: false },
        ].map(({ label, value, Icon, accent }) => (
          <div key={label} style={{ background: accent ? 'linear-gradient(135deg,#121215,#162203)' : '#121215', border: `1px solid ${accent ? '#374f05' : '#23232a'}`, borderRadius: '8px', padding: '18px 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#6b7280', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase' }}>{label}</span>
              <Icon size={16} color={accent ? '#70d64d' : '#6b7280'} />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#fff', marginTop: '6px' }}>
              {isLoading ? <span className="skeleton-pulse" style={{ display: 'inline-block', width: '40px', height: '28px', borderRadius: '4px', verticalAlign: 'middle' }} /> : value}
            </div>
          </div>
        ))}
      </div>

      {/* Table card */}
      <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '24px' }}>
        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          {/* Left: search */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1, minWidth: '220px' }}>
            <Search size={14} style={{ position: 'absolute', left: '12px', color: '#6b7280', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search by name, email, or mobile…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '8px 12px 8px 36px', outline: 'none' }}
            />
          </div>

          {/* Right: filters */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Status filter pills */}
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <Filter size={12} color="#6b7280" />
              {['all', 'pending', 'approved', 'rejected'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)} style={{ ...S.filterBtn, ...(statusFilter === s ? S.filterBtnActive : {}) }}>
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
            {/* Role filter */}
            <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} style={S.select}>
              <option value="all">All Roles</option>
              <option value="freelancer">Freelancer</option>
              <option value="agency">Agency</option>
            </select>
            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={S.select}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A-Z</option>
            </select>
            <button onClick={() => refetch()} style={{ ...S.filterBtn, display: 'flex', alignItems: 'center', gap: '5px' }}>
              <RefreshCw size={13} /> Refresh
            </button>
          </div>
        </div>

        {/* Table */}
        <RegistrationRequestsTable
          pageItems={pageItems}
          isLoading={isLoading}
          onSelectReq={setSelectedReq}
          onApprove={handleApprove}
          onReject={handleOpenReject}
          reviewQueryFetching={reviewQuery.isFetching}
        />

        {/* Footer: count + pagination */}
        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, sorted.length)}–{Math.min(page * PAGE_SIZE, sorted.length)} of {sorted.length} results
          </span>
          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </div>
      </div>

      {/* Detail Modal */}
      {selectedReq && (
        <RegistrationRequestDetailModal
          request={selectedReq} historyData={historyData} isLoadingHistory={isLoadingHistory}
          onClose={() => {
            setSelectedReq(null);
            if (new URLSearchParams(location.search).has('id')) {
              navigate('/admin/requests', { replace: true });
            }
          }} onApprove={handleApprove} onReject={handleOpenReject}
          onUpdateDecision={handleUpdateDecision} isPending={reviewQuery.isFetching}
        />
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <RegistrationRequestRejectModal
          request={rejectTarget} onClose={() => setRejectTarget(null)}
          onConfirm={handleConfirmReject} isPending={reviewQuery.isFetching}
        />
      )}
    </div>
  );
}
