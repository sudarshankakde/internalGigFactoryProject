import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="profile-workspace-view">
      {/* Identity Banner Skeleton */}
      <div className="profile-identity-banner" style={{ borderStyle: 'solid' }}>
        <div className="profile-identity-main">
          <div className="profile-large-avatar skeleton-pulse" style={{ border: 'none', background: 'rgba(255, 255, 255, 0.03)' }} />
          <div className="profile-title-details" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div className="skeleton-pulse" style={{ width: '200px', height: '24px', borderRadius: '4px' }} />
            <div className="skeleton-pulse" style={{ width: '150px', height: '16px', borderRadius: '4px' }} />
            <div className="meta-contact-links-grid" style={{ display: 'flex', gap: '16px', marginTop: '14px' }}>
              <div className="skeleton-pulse" style={{ width: '120px', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '100px', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '110px', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row Skeleton */}
      <section className="profile-quick-stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginTop: '24px' }}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-metric-box">
            <div className="skeleton-pulse" style={{ width: '80px', height: '12px', borderRadius: '4px', marginBottom: '8px' }} />
            <div className="skeleton-pulse" style={{ width: '60px', height: '28px', borderRadius: '4px' }} />
          </div>
        ))}
      </section>

      {/* Split Grid Skeleton */}
      <div className="profile-details-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '24px', marginTop: '24px' }}>
        <div className="profile-details-left-pane">
          <div className="pane-content-card">
            <div className="skeleton-pulse" style={{ width: '100px', height: '18px', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="skeleton-pulse" style={{ width: '100%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '95%', height: '14px', borderRadius: '4px' }} />
              <div className="skeleton-pulse" style={{ width: '80%', height: '14px', borderRadius: '4px' }} />
            </div>
          </div>
          <div className="pane-content-card">
            <div className="skeleton-pulse" style={{ width: '140px', height: '18px', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[1, 2].map((i) => (
                <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.05)', paddingLeft: '16px' }}>
                  <div className="skeleton-pulse" style={{ width: '150px', height: '16px', borderRadius: '4px', marginBottom: '6px' }} />
                  <div className="skeleton-pulse" style={{ width: '100px', height: '12px', borderRadius: '4px' }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-details-right-pane">
          <div className="pane-content-card">
            <div className="skeleton-pulse" style={{ width: '120px', height: '18px', borderRadius: '4px', marginBottom: '16px' }} />
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-pulse" style={{ width: '70px', height: '28px', borderRadius: '6px' }} />
              ))}
            </div>
          </div>
          <div className="pane-content-card">
            <div className="skeleton-pulse" style={{ width: '120px', height: '18px', borderRadius: '4px', marginBottom: '16px' }} />
            <div className="skeleton-pulse" style={{ width: '100%', height: '80px', borderRadius: '6px' }} />
          </div>
        </div>
      </div>
    </div>
  );
};
