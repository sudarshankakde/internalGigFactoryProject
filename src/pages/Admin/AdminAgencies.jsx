import React, { useState, useEffect } from 'react';
import { Search, RefreshCw, Filter, SortAsc, LayoutGrid, LayoutList } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { Pagination } from '../../components/AdminShared';

// Import subcomponents
import { AgencyTable } from '../../components/Admin/AgencyTable';
import { AgencyCard } from '../../components/Admin/AgencyCard';
import { AgencyModal } from '../../components/Admin/AgencyModal';

export default function AdminAgencies() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState(() => localStorage.getItem('agency_status_filter') || '');
  const [sort,   setSort]   = useState(() => localStorage.getItem('agency_sort') || 'newest');
  const [page,   setPage]   = useState(1);
  const [viewMode, setViewMode] = useState(() => localStorage.getItem('admin_view_mode') || 'list');
  const [selectedAgency, setSelectedAgency] = useState(null);

  const [dSearch, setDSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDSearch(search), 350);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    localStorage.setItem('agency_status_filter', status);
  }, [status]);

  useEffect(() => {
    localStorage.setItem('agency_sort', sort);
  }, [sort]);

  useEffect(() => {
    localStorage.setItem('admin_view_mode', viewMode);
  }, [viewMode]);

  useEffect(() => { setPage(1); }, [dSearch, status, sort]);


  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-agencies', page, dSearch, status, sort],
    queryFn: () => {
      const params = new URLSearchParams({ page, limit: 10, sort });
      if (dSearch) params.set('search', dSearch);
      if (status)  params.set('status', status);
      return api.get(`/profiles/admin/agencies?${params}`);
    },
    keepPreviousData: true,
  });

  const agencies   = data?.agencies  || [];
  const total      = data?.total     || 0;
  const totalPages = data?.totalPages || 1;

  const S = {
    filterBtn: { background: '#0c0c0e', border: '1px solid #23232a', color: '#6b7280', borderRadius: '6px', padding: '7px 14px', fontSize: '0.8rem', cursor: 'pointer' },
    filterBtnActive: { background: '#70d64d', color: '#000', borderColor: '#70d64d', fontWeight: 700 },
    select: { background: '#0c0c0e', border: '1px solid #23232a', color: '#fff', borderRadius: '6px', padding: '7px 12px', fontSize: '0.8rem', outline: 'none', cursor: 'pointer' },
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ color: '#fff', fontWeight: 800, fontSize: '1.4rem', margin: 0 }}>Agencies</h2>
          <p style={{ color: '#6b7280', fontSize: '0.82rem', margin: '4px 0 0' }}>
            {isLoading ? 'Loading…' : `${total} agencies registered on the platform`}
          </p>
        </div>
        <button onClick={() => refetch()} disabled={isFetching} style={{ ...S.filterBtn, display: 'flex', alignItems: 'center', gap: '6px', opacity: isFetching ? 0.5 : 1 }}>
          <RefreshCw size={13} className={isFetching ? 'spin' : ''} /> Refresh
        </button>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#6b7280', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search by name, email, agency name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', background: '#0c0c0e', border: '1px solid #23232a', borderRadius: '6px', color: '#fff', fontSize: '0.85rem', padding: '9px 12px 9px 36px', outline: 'none', boxSizing: 'border-box' }}
          />
        </div>
        {/* Status filter */}
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center', flexWrap: 'wrap' }}>
          <Filter size={12} color="#6b7280" />
          {[['', 'All'], ['approved', 'Approved'], ['inactive', 'Inactive'], ['suspended', 'Suspended']].map(([v, l]) => (
            <button key={v} onClick={() => setStatus(v)} style={{ ...S.filterBtn, ...(status === v ? S.filterBtnActive : {}) }}>{l}</button>
          ))}
        </div>
        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <SortAsc size={13} color="#6b7280" />
          <select value={sort} onChange={e => setSort(e.target.value)} style={S.select}>
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name_asc">Name A→Z</option>
            <option value="name_desc">Name Z→A</option>
          </select>
        </div>
        {/* Layout Toggle */}
        <div style={{ display: 'flex', border: '1px solid #23232a', borderRadius: '6px', overflow: 'hidden' }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              background: viewMode === 'list' ? '#70d64d' : '#0c0c0e',
              border: 'none',
              color: viewMode === 'list' ? '#000' : '#8a8a8a',
              padding: '7px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="List View"
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => setViewMode('card')}
            style={{
              background: viewMode === 'card' ? '#70d64d' : '#0c0c0e',
              border: 'none',
              color: viewMode === 'card' ? '#000' : '#8a8a8a',
              padding: '7px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title="Card View"
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {viewMode === 'list' ? (
        <AgencyTable
          agencies={agencies}
          isLoading={isLoading}
          onSelectAgency={setSelectedAgency}
        />
      ) : (
        <AgencyCard
          agencies={agencies}
          isLoading={isLoading}
          onSelectAgency={setSelectedAgency}
        />
      )}

      {/* Common Pagination Footer */}
      <div style={{ background: '#121215', border: '1px solid #23232a', borderRadius: '10px', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <span style={{ color: '#6b7280', fontSize: '0.8rem' }}>
          {isLoading ? '…' : `Page ${page} of ${totalPages} · ${total} total`}
        </span>
        <Pagination page={page} totalPages={totalPages} onPage={setPage} />
      </div>

      {/* Detail Modal */}
      {selectedAgency && (
        <AgencyModal agency={selectedAgency} onClose={() => setSelectedAgency(null)} />
      )}

    </div>
  );
}


   