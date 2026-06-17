import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import MilestoneModal from './MilestoneModal';
import {
  getMilestonesByProject,
  addMilestone,
  updateMilestone,
  deleteMilestone,
} from '../../data/projectDataStore';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function ProjectMilestones({ project, onClose }) {
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => {
    if (!project) return;
    setMilestones(getMilestonesByProject(project.id));
  }, [project]);

  const refresh = () => {
    if (!project) return;
    setMilestones(getMilestonesByProject(project.id));
  };

  const handleAdd = () => {
    setEditing(null);
    setShowModal(true);
  };

  const handleEdit = (m) => {
    setEditing(m);
    setShowModal(true);
  };

  const handleDelete = (m) => {
    if (!window.confirm('Delete milestone?')) return;
    deleteMilestone(project.id, m.id);
    toast.success('Milestone removed');
    refresh();
  };

  const handleSave = (vals) => {
    if (!project) return;
    if (editing) {
      updateMilestone(project.id, editing.id, vals);
      toast.success('Milestone updated');
    } else {
      addMilestone(project.id, vals);
      toast.success('Milestone created');
    }
    setShowModal(false);
    setEditing(null);
    refresh();
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-[3px] z-[700]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-[900px] bg-[#121215] border border-[#23232a] rounded-[10px] overflow-hidden z-[701] shadow-lg">
        <div className="flex items-center justify-between p-4 border-b border-[#23232a] bg-[#0c0c0e]">
          <div>
            <h3 className="text-white font-bold">Milestones — {project.title}</h3>
            <p className="text-gray-500 text-sm">Manage project milestones (create / update / delete)</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleAdd} className="bg-[#70d64d] text-black px-3 py-2 rounded text-sm font-bold flex items-center gap-2"><Plus size={14}/> Add</button>
            <button onClick={onClose} className="bg-transparent border border-[#23232a] text-gray-300 p-2 rounded"><X size={16} /></button>
          </div>
        </div>

        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {milestones.length === 0 ? (
            <div className="text-gray-500 p-6">No milestones yet. Click Add to create one.</div>
          ) : (
            <div className="flex flex-col gap-3">
              {milestones.map((m) => (
                <div key={m.id} className="bg-[#0c0c0e] border border-[#23232a] p-3 rounded flex justify-between items-start gap-3">
                  <div>
                    <h4 className="text-white font-semibold">{m.title}</h4>
                    <p className="text-gray-400 text-sm mt-1">{m.description}</p>
                    <div className="text-gray-500 text-xs mt-2">Due: {fmtDate(m.due_date)} • Amount: {m.amount || '—'}</div>
                  </div>
                  <div className="flex flex-col gap-2 items-end">
                    <span className="text-sm text-gray-400">{(m.status || 'pending').toUpperCase()}</span>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(m)} className="p-2 bg-[#1c1c20] border border-[#23232a] rounded text-gray-300"><Edit2 size={14} /></button>
                      <button onClick={() => handleDelete(m)} className="p-2 bg-[#1c0c0e] border border-[#ef4444] rounded text-[#ef4444]"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <MilestoneModal
          milestone={editing}
          onClose={() => { setShowModal(false); setEditing(null); }}
          onSave={handleSave}
        />
      )}
    </>
  );
}
