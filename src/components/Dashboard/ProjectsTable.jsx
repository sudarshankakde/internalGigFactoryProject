import React from 'react';
import { Search, Filter, Check, X } from 'lucide-react';
import { flexRender } from '@tanstack/react-table';

export const ProjectsTable = ({
  role,
  activeAdminTab,
  setActiveAdminTab,
  registrationRequests,
  isRequestsLoading,
  approveQuery,
  rejectQuery,
  handleApproveRequest,
  handleOpenReject,
  tableInstance,
  tableData,
}) => {
  return (
    <div className="content-table-card">
      <div className="table-card-top-controls">
        {role === 'admin' ? (
          <div className="admin-tab-headers">
            <button 
              className={`admin-tab-btn ${activeAdminTab === 'applications' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('applications')}
            >
              Project Applications
            </button>
            <button 
              className={`admin-tab-btn ${activeAdminTab === 'registrations' ? 'active' : ''}`}
              onClick={() => setActiveAdminTab('registrations')}
            >
              Registration Requests
            </button>
          </div>
        ) : (
          <h3>Active Projects</h3>
        )}
        <div className="controls-inputs-cluster">
          <div className="search-field-wrapper">
            <Search size={14} />
            <input type="text" placeholder="Search entries..." />
          </div>
          <button className="ctrl-filter-btn"><Filter size={14} /> Filter</button>
        </div>
      </div>

      {role === 'admin' && activeAdminTab === 'registrations' ? (
        /* Registration Requests Table */
        <div className="tanstack-table-overflow-frame">
          <table className="portal-tanstack-native-table">
            <thead>
              <tr>
                <th>FULL NAME</th>
                <th>EMAIL</th>
                <th>MOBILE</th>
                <th>ROLE</th>
                <th>STATUS</th>
                <th>SUBMITTED AT</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isRequestsLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={`skeleton-${i}`}>
                    <td>
                      <div className="skeleton-pulse w-[120px] h-4 rounded" />
                    </td>
                    <td>
                      <div className="skeleton-pulse w-[150px] h-3.5 rounded" />
                    </td>
                    <td>
                      <div className="skeleton-pulse w-[90px] h-3.5 rounded" />
                    </td>
                    <td>
                      <div className="skeleton-pulse w-20 h-[22px] rounded-full" />
                    </td>
                    <td>
                      <div className="skeleton-pulse w-[70px] h-5 rounded" />
                    </td>
                    <td>
                      <div className="skeleton-pulse w-[100px] h-3.5 rounded" />
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <div className="skeleton-pulse w-[70px] h-7 rounded-md" />
                        <div className="skeleton-pulse w-[70px] h-7 rounded-md" />
                      </div>
                    </td>
                  </tr>
                ))
              ) : registrationRequests.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center p-6 text-[var(--text-muted)]">
                    No registration requests found.
                  </td>
                </tr>
              ) : (
                registrationRequests.map((req) => (
                  <tr key={req.id}>
                    <td><strong>{req.full_name}</strong></td>
                    <td>{req.email}</td>
                    <td>{req.mobile}</td>
                    <td>
                      <span className={`role-chip chip-${req.role}`}>
                        {req.role.toUpperCase()}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge state-${req.status}`}>
                        {req.status.toUpperCase()}
                      </span>
                    </td>
                    <td>{new Date(req.created_at).toLocaleDateString()}</td>
                    <td>
                      {req.status === 'pending' ? (
                        <div className="table-actions-cluster">
                          <button 
                            className="btn-act accept" 
                            onClick={() => handleApproveRequest(req.id)}
                            disabled={approveQuery.isFetching}
                          >
                            <Check size={12} /> APPROVE
                          </button>
                          <button 
                            className="btn-act reject" 
                            onClick={() => handleOpenReject(req)}
                            disabled={rejectQuery.isFetching}
                          >
                            <X size={12} /> REJECT
                          </button>
                        </div>
                      ) : (
                        <span className="text-[0.85rem] text-[var(--text-muted)]">Reviewed</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        /* TanStack Responsive Table Core implementation Container */
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
      )}

      <footer className="table-footer-pagination-bar">
        <span>Showing 1 to {role === 'admin' && activeAdminTab === 'registrations' ? registrationRequests.length : tableData.length} entries</span>
        <div className="btn-pagination-nav-group">
          <button className="p-nav disabled">Prev</button>
          <button className="p-num active">1</button>
          <button className="p-nav disabled">Next</button>
        </div>
      </footer>
    </div>
  );
};
