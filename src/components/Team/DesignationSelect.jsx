import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Plus, Check, Search } from 'lucide-react';

/* ── Preset designation list — Civil / AEC Industry ─────────── */
export const PRESET_DESIGNATIONS = [

  // ── BIM & 2D Drafting ────────────────────────────────────────
  'BIM Modeller',
  'BIM Coordinator',
  'BIM Manager',
  'BIM Lead',
  'Revit Modeller',
  'Revit Technician',
  'BIM Architect',
  'BIM Structural Engineer',
  'BIM MEP Engineer',
  'CAD Draughtsman',
  'CAD Technician',
  'Senior CAD Draughtsman',
  '2D Drafting Specialist',
  'Architectural Draughtsman',
  'Structural Draughtsman',
  'MEP Draughtsman',
  'BIM Content Creator',
  'Clash Detection Specialist',

  // ── As-Built Audit / Survey ───────────────────────────────────
  'As-Built Survey Technician',
  'As-Built Auditor',
  'Survey Engineer',
  'Site Survey Technician',
  'Total Station Operator',
  'LiDAR / Laser Scan Technician',
  'Point Cloud Processing Specialist',
  'Field Measurement Technician',
  'As-Built Documentation Specialist',
  'Site Audit Engineer',
  'Geomatics Technician',

  // ── Peer Review ───────────────────────────────────────────────
  'Peer Review Engineer',
  'Structural Review Engineer',
  'Design Checker',
  'Senior Structural Engineer',
  'Structural Engineer',
  'Civil Engineer',
  'Senior Civil Engineer',
  'MEP Review Engineer',
  'Fire & Life Safety Engineer',
  'Geotechnical Engineer',
  'Facade Engineer',
  'Design Coordinator',
  'Principal Engineer',

  // ── BOQ Creation / Quantity Surveying ─────────────────────────
  'Quantity Surveyor',
  'Senior Quantity Surveyor',
  'BOQ Specialist',
  'Cost Estimator',
  'Cost Engineer',
  'Billing Engineer',
  'Measurement Engineer',
  'Junior Quantity Surveyor',
  'QS Technician',
  'Contract Manager',
  'Tendering Engineer',

  // ── 3D Visualisation ──────────────────────────────────────────
  '3D Visualisation Artist',
  'Senior 3D Visualisation Artist',
  'Architectural Visualiser',
  'CGI Artist',
  '3D Renderer',
  'Interior Visualisation Specialist',
  'Walkthrough / Animation Artist',
  'Unreal Engine Artist',
  'Lumion Specialist',
  '3ds Max Artist',
  'V-Ray Specialist',
  'Enscape Specialist',

  // ── General Civil / Architecture ──────────────────────────────
  'Architect',
  'Senior Architect',
  'Project Architect',
  'Interior Designer',
  'Urban Planner',
  'Landscape Architect',
  'Site Engineer',
  'Resident Engineer',
  'Planning Engineer',
  'Infrastructure Engineer',
  'MEP Engineer',
  'Electrical Engineer',
  'Plumbing Engineer',
  'HVAC Engineer',

  // ── Agency Management & Support ───────────────────────────────
  'Project Manager',
  'Senior Project Manager',
  'Technical Director',
  'Operations Manager',
  'Business Development Manager',
  'Client Relations Manager',
  'Bid Manager',
  'Proposals Engineer',
  'HR Manager',
  'Finance Manager',
  'Admin Executive',
];

/* ── Component ───────────────────────────────────────────────── */
export const DesignationSelect = ({ value = '', onChange, placeholder = 'Select or type designation...' }) => {
  const [open, setOpen]           = useState(false);
  const [query, setQuery]         = useState('');
  const [custom, setCustom]       = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [dropPos, setDropPos]     = useState({ top: 0, left: 0, width: 0 });
  const wrapRef    = useRef(null);
  const triggerRef = useRef(null);

  /* Compute portal position — flips upward if not enough space below */
  const handleOpen = () => {
    if (triggerRef.current) {
      const rect        = triggerRef.current.getBoundingClientRect();
      const DROPDOWN_H  = 320; // estimated max height
      const spaceBelow  = window.innerHeight - rect.bottom;
      const spaceAbove  = rect.top;
      const flipUp      = spaceBelow < DROPDOWN_H && spaceAbove > spaceBelow;

      setDropPos({
        top:    flipUp ? rect.top - DROPDOWN_H - 6 : rect.bottom + 6,
        left:   rect.left,
        width:  rect.width,
        flipUp,
      });
    }
    setOpen(v => !v);
  };

  /* Close on outside click — works across portal boundary */
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      const trigger = triggerRef.current;
      const drop    = document.getElementById('designation-drop-portal');
      if (
        trigger && !trigger.contains(e.target) &&
        drop    && !drop.contains(e.target)
      ) {
        setOpen(false);
        setQuery('');
        setAddingNew(false);
        setCustom('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const filtered = PRESET_DESIGNATIONS.filter(d =>
    d.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (d) => {
    onChange(d);
    setOpen(false);
    setQuery('');
    setAddingNew(false);
    setCustom('');
  };

  const handleAddCustom = () => {
    const trimmed = custom.trim();
    if (!trimmed) return;
    onChange(trimmed);
    setOpen(false);
    setQuery('');
    setAddingNew(false);
    setCustom('');
  };

  return (
    <div ref={wrapRef} className="relative w-full">
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        className={`w-full bg-[#0c0c10] border border-[#2a2a35] focus:border-[#70d64d] rounded-lg py-[10px] px-[14px] text-sm cursor-pointer flex items-center justify-between gap-2 outline-none transition-colors duration-[180ms] box-border ${value ? 'text-white' : 'text-[#5b5b70]'}`}
        onClick={handleOpen}
      >
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {value || placeholder}
        </span>
        <ChevronDown
          size={15}
          className={`shrink-0 text-[#6b7280] transition-transform duration-200 ${open ? 'rotate-180' : 'none'}`}
        />
      </button>

      {/* Dropdown — portalled to body so it renders above the modal overlay */}
      {open && createPortal(
        <div
          id="designation-drop-portal"
          className="fixed bg-[#141418] border border-[#2a2a35] rounded-[10px] z-[999999] shadow-[0_16px_48px_rgba(0,0,0,0.8)] overflow-hidden max-h-[320px] flex flex-col"
          style={{
            top:           dropPos.top,
            left:          dropPos.left,
            width:         dropPos.width,
          }}
        >
          {/* Search */}
          <div className="flex items-center gap-2 p-[10px_12px] border-b border-[#1e1e26] shrink-0">
            <Search size={13} className="text-[#6b7280] shrink-0" />
            <input
              autoFocus
              className="flex-1 bg-transparent border-none outline-none text-white text-[0.82rem]"
              placeholder="Search designation..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Scrollable list — capped so footer is always visible */}
          <div className="overflow-y-auto flex-1 max-h-[190px]">
            {filtered.length === 0 && (
              <div className="p-4 text-center text-[#5b5b70] text-[0.8rem] italic">
                No matching designation found
              </div>
            )}
            {filtered.map(d => (
              <DesignationItem
                key={d}
                label={d}
                selected={d === value}
                onSelect={() => handleSelect(d)}
              />
            ))}
          </div>

          {/* Custom add row */}
          <div className="border-t border-[#1e1e26] p-[10px_12px] shrink-0">
            {addingNew ? (
              <>
                <input
                  autoFocus
                  className="w-full bg-[#0c0c10] border border-[#2a2a35] rounded-md py-1.75 px-2.5 text-white text-[0.82rem] outline-none mb-2 box-border"
                  placeholder="Type custom designation..."
                  value={custom}
                  onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
                />
                <button type="button" className="w-full bg-[#70d64d] text-black border-none rounded-md p-1.75 text-[0.8rem] font-extrabold cursor-pointer flex items-center justify-center gap-1.5" onClick={handleAddCustom}>
                  <Check size={13} /> Use This Designation
                </button>
              </>
            ) : (
              <button
                type="button"
                className="w-full bg-transparent border border-dashed border-[#2a2a35] hover:border-[#70d64d] rounded-md p-2 text-[#6b7280] hover:text-[#70d64d] text-[0.78rem] font-semibold cursor-pointer flex items-center justify-center gap-1.5 transition-all duration-150"
                onClick={() => setAddingNew(true)}
              >
                <Plus size={13} /> Not in list? Add custom designation
              </button>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

/* Small item with hover state */
function DesignationItem({ label, selected, onSelect }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`py-[9px] px-[14px] text-[0.83rem] cursor-pointer flex items-center justify-between gap-2 transition-colors duration-100 ${selected ? 'text-[#70d64d]' : 'text-[#d1d5db]'} ${hovered ? 'bg-[#1c1c24]' : 'bg-transparent'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <span>{label}</span>
      {selected && <Check size={13} className="shrink-0 text-[#70d64d]" />}
    </div>
  );
}
