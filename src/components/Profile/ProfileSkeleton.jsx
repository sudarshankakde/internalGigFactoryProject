import React from 'react';

export const ProfileSkeleton = () => {
  return (
    <div className="profile-workspace-view">
      {/* Identity Banner Skeleton */}
      <div className="profile-identity-banner border-solid">
        <div className="profile-identity-main">
          <div className="profile-large-avatar skeleton-pulse border-none bg-white/5" />
          <div className="profile-title-details flex flex-col gap-2">
            <div className="skeleton-pulse w-[200px] h-6 rounded" />
            <div className="skeleton-pulse w-[150px] h-4 rounded" />
            <div className="meta-contact-links-grid flex gap-4 mt-3.5">
              <div className="skeleton-pulse w-[120px] h-3.5 rounded" />
              <div className="skeleton-pulse w-[100px] h-3.5 rounded" />
              <div className="skeleton-pulse w-[110px] h-3.5 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row Skeleton */}
      <section className="profile-quick-stats-row grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mt-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="stat-metric-box">
            <div className="skeleton-pulse w-20 h-3 rounded mb-2" />
            <div className="skeleton-pulse w-[60px] h-7 rounded" />
          </div>
        ))}
      </section>

      {/* Split Grid Skeleton */}
      <div className="profile-details-split-grid grid grid-cols-[1.6fr_1fr] gap-6 mt-6">
        <div className="profile-details-left-pane">
          <div className="pane-content-card">
            <div className="skeleton-pulse w-[100px] h-[18px] rounded mb-4" />
            <div className="flex flex-col gap-2">
              <div className="skeleton-pulse w-full h-3.5 rounded" />
              <div className="skeleton-pulse w-[95%] h-3.5 rounded" />
              <div className="skeleton-pulse w-[80%] h-3.5 rounded" />
            </div>
          </div>
          <div className="pane-content-card">
            <div className="skeleton-pulse w-[140px] h-[18px] rounded mb-4" />
            <div className="flex flex-col gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="border-l-2 border-white/5 pl-4">
                  <div className="skeleton-pulse w-[150px] h-4 rounded mb-1.5" />
                  <div className="skeleton-pulse w-[100px] h-3 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-details-right-pane">
          <div className="pane-content-card">
            <div className="skeleton-pulse w-[120px] h-[18px] rounded mb-4" />
            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="skeleton-pulse w-[70px] h-7 rounded-md" />
              ))}
            </div>
          </div>
          <div className="pane-content-card">
            <div className="skeleton-pulse w-[120px] h-[18px] rounded mb-4" />
            <div className="skeleton-pulse w-full h-20 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
};
