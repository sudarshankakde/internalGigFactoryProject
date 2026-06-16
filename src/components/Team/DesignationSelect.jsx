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

  /* Shared inline styles */
  const S = {
    trigger: {
      width: '100%',
      background: '#0c0c10',
      border: '1px solid #2a2a35',
      borderRadius: '8px',
      padding: '10px 14px',
      color: value ? '#fff' : '#5b5b70',
      fontSize: '0.875rem',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      outline: 'none',
      transition: 'border-color 0.18s',
      boxSizing: 'border-box',
    },
    searchBox: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 12px',
      borderBottom: '1px solid #1e1e26',
      flexShrink: 0,
    },
    searchInput: {
      flex: 1,
      background: 'transparent',
      border: 'none',
      outline: 'none',
      color: '#fff',
      fontSize: '0.82rem',
    },
    list: { overflowY: 'auto', flex: 1 },
    item: (selected, hovered) => ({
      padding: '9px 14px',
      fontSize: '0.83rem',
      color: selected ? '#70d64d' : '#d1d5db',
      background: hovered ? '#1c1c24' : 'transparent',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '8px',
      transition: 'background 0.12s',
    }),
    addNewRow: {
      borderTop: '1px solid #1e1e26',
      padding: '10px 12px',
      flexShrink: 0,
    },
    addNewInput: {
      width: '100%',
      background: '#0c0c10',
      border: '1px solid #2a2a35',
      borderRadius: '6px',
      padding: '7px 10px',
      color: '#fff',
      fontSize: '0.82rem',
      outline: 'none',
      marginBottom: '8px',
      boxSizing: 'border-box',
    },
    addNewBtn: {
      width: '100%',
      background: '#70d64d',
      color: '#000',
      border: 'none',
      borderRadius: '6px',
      padding: '7px',
      fontSize: '0.8rem',
      fontWeight: 800,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
    },
    toggleAddNew: {
      width: '100%',
      background: 'transparent',
      border: '1px dashed #2a2a35',
      borderRadius: '6px',
      padding: '8px',
      color: '#6b7280',
      fontSize: '0.78rem',
      fontWeight: 600,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      transition: 'color 0.15s, border-color 0.15s',
    },
  };

  return (
    <div ref={wrapRef} style={{ position: 'relative', width: '100%' }}>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        type="button"
        style={S.trigger}
        onClick={handleOpen}
        onFocus={e => { e.currentTarget.style.borderColor = '#70d64d'; }}
        onBlur={e => { e.currentTarget.style.borderColor = '#2a2a35'; }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={15}
          style={{
            flexShrink: 0,
            color: '#6b7280',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
          }}
        />
      </button>

      {/* Dropdown — portalled to body so it renders above the modal overlay */}
      {open && createPortal(
        <div
          id="designation-drop-portal"
          style={{
            position:      'fixed',
            top:           dropPos.top,
            left:          dropPos.left,
            width:         dropPos.width,
            background:    '#141418',
            border:        '1px solid #2a2a35',
            borderRadius:  '10px',
            zIndex:        999999,
            boxShadow:     '0 16px 48px rgba(0,0,0,0.8)',
            overflow:      'hidden',
            maxHeight:     '320px',
            display:       'flex',
            flexDirection: 'column',
          }}
        >
          {/* Search */}
          <div style={S.searchBox}>
            <Search size={13} style={{ color: '#6b7280', flexShrink: 0 }} />
            <input
              autoFocus
              style={S.searchInput}
              placeholder="Search designation..."
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {/* Scrollable list — capped so footer is always visible */}
          <div style={{ ...S.list, maxHeight: '190px' }}>
            {filtered.length === 0 && (
              <div style={{ padding: '16px', textAlign: 'center', color: '#5b5b70', fontSize: '0.8rem', fontStyle: 'italic' }}>
                No matching designation found
              </div>
            )}
            {filtered.map(d => (
              <DesignationItem
                key={d}
                label={d}
                selected={d === value}
                onSelect={() => handleSelect(d)}
                itemStyle={S.item}
              />
            ))}
          </div>

          {/* Custom add row */}
          <div style={S.addNewRow}>
            {addingNew ? (
              <>
                <input
                  autoFocus
                  style={S.addNewInput}
                  placeholder="Type custom designation..."
                  value={custom}
                  onChange={e => setCustom(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleAddCustom(); } }}
                />
                <button type="button" style={S.addNewBtn} onClick={handleAddCustom}>
                  <Check size={13} /> Use This Designation
                </button>
              </>
            ) : (
              <button
                type="button"
                style={S.toggleAddNew}
                onMouseEnter={e => { e.currentTarget.style.color = '#70d64d'; e.currentTarget.style.borderColor = '#70d64d'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = '#2a2a35'; }}
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
function DesignationItem({ label, selected, onSelect, itemStyle }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      style={itemStyle(selected, hovered)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onSelect}
    >
      <span>{label}</span>
      {selected && <Check size={13} style={{ flexShrink: 0, color: '#70d64d' }} />}
    </div>
  );
}
