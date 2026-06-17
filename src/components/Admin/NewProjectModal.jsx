import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { addProject } from '../../data/projectDataStore';

const defaultMilestone = () => ({
  milestone_no: 1,
  title: '',
  description: '',
  budget: '',
  weight_percentage: '',
  start_date: '',
  due_date: '',
});

export default function NewProjectModal({ onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectType, setProjectType] = useState('fixed');
  const [priority, setPriority] = useState('high');
  const [budget, setBudget] = useState('');
  const [estimatedHours, setEstimatedHours] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [skills, setSkills] = useState('');
  const [tags, setTags] = useState('');
  const [milestones, setMilestones] = useState([defaultMilestone()]);

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        ...defaultMilestone(),
        milestone_no: prev.length + 1,
      },
    ]);
  };

  const updateMilestone = (index, field, value) => {
    setMilestones((prev) => prev.map((item, idx) => idx === index ? { ...item, [field]: value } : item));
  };

  const removeMilestone = (index) => {
    setMilestones((prev) => prev.filter((_, idx) => idx !== index).map((item, idx) => ({ ...item, milestone_no: idx + 1 })));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newProject = {
      id: Date.now(),
      title: title.trim() || 'Untitled Project',
      description: description.trim(),
      project_type: projectType,
      priority,
      budget: Number(budget) || 0,
      estimated_hours: Number(estimatedHours) || 0,
      start_date: startDate,
      end_date: endDate,
      skills: skills.split(',').map((s) => s.trim()).filter(Boolean),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      milestones: milestones.map((ms) => ({
        milestone_no: ms.milestone_no,
        title: ms.title,
        description: ms.description,
        budget: Number(ms.budget) || 0,
        weight_percentage: Number(ms.weight_percentage) || 0,
        start_date: ms.start_date,
        due_date: ms.due_date,
      })),
      status: 'NOT STARTED',
      category: 'WEB',
      client: 'New Client',
      progress: 0,
      assignedMembers: [],
      applicantsCount: 0,
    };

    addProject(newProject);
    onCreate(newProject);
    onClose();
  };

  return (
    <>
      <div onClick={onClose} className="fixed inset-0 bg-black/80 backdrop-blur-[2px] z-[700]" />
      <div className="fixed left-1/2 top-1/2 z-[701] w-[90vw] max-w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-[20px] border border-[#23232a] bg-[#0b0b0d] shadow-[0_24px_80px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="flex items-center justify-between border-b border-[#23232a] px-6 py-5">
          <div>
            <h2 className="text-white text-2xl font-semibold">Create New Project</h2>
            <p className="text-gray-400 text-sm mt-1">Fill in the project details and milestones.</p>
          </div>
          <button onClick={onClose} className="text-gray-300 hover:text-white"><X size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5 max-h-[80vh] overflow-y-auto">
          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-gray-300 text-sm font-semibold">Project Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
                placeholder="Industrial MEP HVAC Layout Drafting"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
              >
                <option value="fixed">Fixed</option>
                <option value="hourly">Hourly</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Budget</label>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
                type="number"
                placeholder="30000"
                required
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Estimated Hours</label>
              <input
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
                type="number"
                placeholder="80"
              />
            </div>
            <div></div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-gray-300 text-sm font-semibold">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
              placeholder="Produce coordinated LOD 300 HVAC drawings using AutoCAD/Revit."
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <label className="text-gray-300 text-sm font-semibold">Skills</label>
              <input
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
                placeholder="Revit, HVAC Design, AutoCAD"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm font-semibold">Tags</label>
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#11131a] px-4 py-3 text-white outline-none"
                placeholder="Drafting, MEP"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-white font-semibold">Milestones</h3>
                <p className="text-gray-500 text-sm">Add milestone details and dates.</p>
              </div>
              <button type="button" onClick={addMilestone} className="inline-flex items-center gap-2 rounded-[14px] bg-[#70d64d] px-4 py-2 text-black font-semibold">
                <Plus size={16} /> Add Milestone
              </button>
            </div>

            {milestones.map((milestone, index) => (
              <div key={index} className="rounded-[18px] border border-[#23232a] bg-[#11131a] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h4 className="text-white font-semibold">Milestone {milestone.milestone_no}</h4>
                    <p className="text-gray-500 text-sm">Define the work package and budget for this milestone.</p>
                  </div>
                  {milestones.length > 1 && (
                    <button type="button" onClick={() => removeMilestone(index)} className="text-red-400 hover:text-red-300">
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
                <div className="grid gap-4 lg:grid-cols-2 mt-4">
                  <div>
                    <label className="text-gray-300 text-sm">Title</label>
                    <input
                      value={milestone.title}
                      onChange={(e) => updateMilestone(index, 'title', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      placeholder="HVAC Single Line Layout"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Budget</label>
                    <input
                      value={milestone.budget}
                      onChange={(e) => updateMilestone(index, 'budget', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      type="number"
                      placeholder="12000"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Weight %</label>
                    <input
                      value={milestone.weight_percentage}
                      onChange={(e) => updateMilestone(index, 'weight_percentage', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      type="number"
                      placeholder="40"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Start Date</label>
                    <input
                      value={milestone.start_date}
                      onChange={(e) => updateMilestone(index, 'start_date', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      type="date"
                    />
                  </div>
                  <div>
                    <label className="text-gray-300 text-sm">Due Date</label>
                    <input
                      value={milestone.due_date}
                      onChange={(e) => updateMilestone(index, 'due_date', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      type="date"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="text-gray-300 text-sm">Description</label>
                    <textarea
                      value={milestone.description}
                      onChange={(e) => updateMilestone(index, 'description', e.target.value)}
                      className="mt-2 w-full rounded-[14px] border border-[#23232a] bg-[#0b0b0d] px-4 py-3 text-white outline-none"
                      rows={3}
                      placeholder="Drafting of duct routing layout schema."
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#23232a]">
            <button
              type="button"
              onClick={onClose}
              className="rounded-[14px] border border-[#2c2f3d] bg-[#11131a] px-6 py-3 text-sm text-gray-300 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-[14px] bg-[#70d64d] px-6 py-3 text-sm font-semibold text-black hover:bg-[#8ee67b] transition"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
