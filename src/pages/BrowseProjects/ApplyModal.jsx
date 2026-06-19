import React, { useState } from 'react';
import { addApplication } from '../../data/projectDataStore';
import { toast } from 'react-toastify';

export default function ApplyModal({ project, onClose, defaultRole = 'freelancer' }) {
  const [name, setName] = useState('');
  const [role, setRole] = useState(defaultRole);
  const [bid, setBid] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!name) return toast.error('Please enter your name');
    if (!bid || isNaN(Number(bid))) return toast.error('Please enter a valid bid amount');
    const application = {
      id: Date.now(),
      projectId: project.id,
      applicantType: role,
      name,
      bidAmount: Number(bid),
      description: description || '',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    addApplication(application);
    toast.success('Application submitted');
    onClose();
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/70 z-40" />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md bg-[#121215] border border-[#23232a] rounded p-4 z-50">
        <h3 className="text-white font-bold mb-2">Apply for — {project.title}</h3>
        <div className="flex flex-col gap-2">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="p-2 rounded bg-[#0b0b0d] text-white border border-[#23232a]" />
          <input value={bid} onChange={(e) => setBid(e.target.value)} placeholder="Bid amount" className="p-2 rounded bg-[#0b0b0d] text-white border border-[#23232a]" />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short description" rows={4} className="p-2 rounded bg-[#0b0b0d] text-white border border-[#23232a]" />
          {/* <div className="flex gap-2">
            <button onClick={() => setRole('freelancer')} className={`px-3 py-2 rounded ${role==='freelancer' ? 'bg-lime-400 text-black' : 'bg-transparent border border-[#23232a] text-gray-300'}`}>Freelancer</button>
            <button onClick={() => setRole('agency')} className={`px-3 py-2 rounded ${role==='agency' ? 'bg-lime-400 text-black' : 'bg-transparent border border-[#23232a] text-gray-300'}`}>Agency</button>
          </div> */}
          <div className="flex justify-end gap-2 mt-3">
            <button onClick={onClose} className="px-3 py-2 border border-[#23232a] rounded text-gray-300">Cancel</button>
            <button onClick={handleSubmit} className="px-3 py-2 bg-lime-500 rounded font-semibold">Submit</button>
          </div>
        </div>
      </div>
    </>
  );
}
