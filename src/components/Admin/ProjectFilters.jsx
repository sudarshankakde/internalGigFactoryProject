import React from 'react';
import { Search, X, LayoutGrid, LayoutList } from 'lucide-react';

const ProjectFilters = ({ 
  searchTerm, 
  onSearchChange, 
  selectedCategory, 
  onCategoryChange, 
  selectedStatus, 
  onStatusChange, 
  onClearFilters,
  viewMode,
  onViewModeChange,
}) => {
  const categories = ['All Categories', 'WEB', 'MOBILE', 'DESIGN', 'GRAPHICS'];
  const statuses = ['All Status', 'IN PROGRESS', 'NOT STARTED', 'COMPLETED'];

  return (
    <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[18px] p-5 shadow-[0_24px_60px_rgba(0,0,0,0.25)]">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex-1 min-w-[260px] relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b]" size={18} />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#11131a] border border-[#1f2230] rounded-[14px] pl-12 pr-4 py-4 text-white placeholder:text-[#64748b] focus:outline-none focus:border-[#70d64d]"
          />
        </div>

        <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="bg-[#11131a] border border-[#1f2230] rounded-[14px] px-4 py-3 text-white focus:outline-none focus:border-[#70d64d] cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => onStatusChange(e.target.value)}
              className="bg-[#11131a] border border-[#1f2230] rounded-[14px] px-4 py-3 text-white focus:outline-none focus:border-[#70d64d] cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => onViewModeChange('grid')}
              className={`inline-flex items-center justify-center w-[44px] h-[44px] rounded-[14px] border ${viewMode === 'grid' ? 'border-[#70d64d] bg-[#70d64d] text-black' : 'border-[#1f2230] bg-[#11131a] text-gray-300'}`}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              type="button"
              onClick={() => onViewModeChange('list')}
              className={`inline-flex items-center justify-center w-[44px] h-[44px] rounded-[14px] border ${viewMode === 'list' ? 'border-[#70d64d] bg-[#70d64d] text-black' : 'border-[#1f2230] bg-[#11131a] text-gray-300'}`}
              title="List view"
            >
              <LayoutList size={18} />
            </button>
            <button
              onClick={onClearFilters}
              className="inline-flex items-center gap-2 rounded-[14px] border border-[#2b2f3d] bg-[#11131a] px-4 py-3 text-sm font-semibold text-gray-300 hover:text-white transition-colors"
            >
              <X size={18} />
              Clear
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters;
