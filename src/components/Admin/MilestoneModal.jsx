import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function MilestoneModal({ milestone = null, onClose, onSave }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('pending');

  useEffect(() => {
    if (milestone) {
      setTitle(milestone.title || '');
      setDescription(milestone.description || '');
      setDueDate(milestone.due_date ? milestone.due_date.split('T')[0] : '');
      setAmount(milestone.amount || '');
      setStatus(milestone.status || 'pending');
    }
  }, [milestone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      description: description.trim(),
      due_date: dueDate || null,
      amount: amount ? Number(amount) : null,
      status,
    };
    onSave(payload);
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-[800]" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[520px] bg-[#121215] border border-[#23232a] rounded-md z-[801]">
        <div className="flex items-center justify-between p-4 border-b border-[#23232a]">
          <h4 className="text-white font-bold">{milestone ? 'Edit Milestone' : 'Add Milestone'}</h4>
          <button onClick={onClose} className="text-gray-300 p-1"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-4 space-y-3">
          <div>
            <label className="text-gray-400 text-sm">Title</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full mt-1 p-2 bg-[#0c0c0e] border border-[#23232a] rounded text-white" required />
          </div>
          <div>
            <label className="text-gray-400 text-sm">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full mt-1 p-2 bg-[#0c0c0e] border border-[#23232a] rounded text-white" rows={3} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-400 text-sm">Due Date</label>
              <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="w-full mt-1 p-2 bg-[#0c0c0e] border border-[#23232a] rounded text-white" />
            </div>
            <div>
              <label className="text-gray-400 text-sm">Amount</label>
              <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} className="w-full mt-1 p-2 bg-[#0c0c0e] border border-[#23232a] rounded text-white" />
            </div>
          </div>
          <div>
            <label className="text-gray-400 text-sm">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full mt-1 p-2 bg-[#0c0c0e] border border-[#23232a] rounded text-white">
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 border border-[#23232a] rounded text-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-[#70d64d] text-black rounded font-bold">Save</button>
          </div>
        </form>
      </div>
    </>
  );
}
