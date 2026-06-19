import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Send, Upload, CheckCircle, AlertCircle, Check } from 'lucide-react';

function formatTimeAgo(dateString) {
  if (!dateString) return "";
  const now = new Date();
  const past = new Date(dateString);
  const diffMs = now - past;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 10) return "Just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHour < 24) return `${diffHour}h ago`;
  if (diffDay === 1) return "Yesterday";
  return `${diffDay} days ago`;
}

const getActivityStyles = (type) => {
  const t = type?.toLowerCase() || '';
  if (t === 'applied') {
    return {
      IconComponent: Send,
      colorClass: 'text-sky-400',
    };
  }
  if (t === 'deliverable') {
    return {
      IconComponent: Upload,
      colorClass: 'text-amber-400',
    };
  }
  if (t === 'payment') {
    return {
      IconComponent: Check,
      colorClass: 'text-[#70d64d]',
    };
  }
  if (t.includes('completed') || t === 'accepted' || t === 'approved' || t === 'assigned') {
    return {
      IconComponent: CheckCircle,
      colorClass: 'text-[#70d64d]',
    };
  }
  if (t === 'rejected') {
    return {
      IconComponent: AlertCircle,
      colorClass: 'text-red-400',
    };
  }
  return {
    IconComponent: Clock,
    colorClass: 'text-gray-400',
  };
};

export const ActivityTimeline = ({ role, notifications = [] }) => {
  if (role === 'admin') return null;

  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(5);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Reset visible count if notification set changes significantly
    setVisibleCount(Math.min(5, notifications.length));
  }, [notifications.length]);

  const handleScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current;
    
    // Check if user has scrolled near bottom (within 15px)
    if (scrollHeight - scrollTop - clientHeight < 15) {
      if (visibleCount < notifications.length) {
        setVisibleCount((prev) => Math.min(prev + 5, notifications.length));
      }
    }
  };

  const displayedNotifications = notifications.slice(0, visibleCount);

  return (
    <div className="content-activity-card">
      <h3 className="mb-4">Recent Activity</h3>
      {notifications.length === 0 ? (
        <p className="text-gray-500 text-xs italic">No recent activity.</p>
      ) : (
        <div 
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="max-h-[460px] overflow-y-auto pr-1.5 space-y-4"
        >
          <div className="activity-timeline space-y-4">
            {displayedNotifications.map((n) => {
              const { IconComponent, colorClass } = getActivityStyles(n.type);
              return (
                <div 
                  key={n.id} 
                  className={`timeline-node-item flex gap-3 ${n.targetUrl ? 'cursor-pointer hover:bg-white/[0.02] p-1.5 rounded-[6px] transition-colors duration-150' : ''}`}
                  onClick={() => {
                    if (n.targetUrl) {
                      navigate(n.targetUrl);
                    }
                  }}
                >
                  <IconComponent size={14} className={`node-icon ${colorClass} shrink-0 mt-0.5`} />
                  <div className="node-body min-w-0 flex-1">
                    <strong className="text-xs font-bold text-white block truncate">{n.title}</strong>
                    <p className="text-[11px] text-[#8a8a8a] mt-0.5 line-clamp-2 leading-relaxed">{n.message}</p>
                    <span className="node-time text-[10px] text-gray-500 block mt-1">{formatTimeAgo(n.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {visibleCount < notifications.length && (
            <div className="flex justify-center pt-2">
              <span className="text-[10px] text-gray-500 animate-pulse font-semibold">Loading more...</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
