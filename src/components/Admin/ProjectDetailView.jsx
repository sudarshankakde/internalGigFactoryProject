import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock3, Wallet, Check, XCircle, Plus } from 'lucide-react';
import ProjectMilestones from './ProjectMilestones';
import ProjectApplications from './ProjectApplications';
import { getProjectById, getApplicationsByProject, getMilestonesByProject, addApplication, updateApplication } from '../../data/projectDataStore';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

const statusBadge = (status) => {
  if (status === 'COMPLETED') return 'bg-blue-400/20 text-blue-300';
  if (status === 'IN PROGRESS') return 'bg-lime-400/20 text-lime-300';
  return 'bg-gray-500/20 text-gray-300';
};

export default function ProjectDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [applications, setApplications] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [showApplications, setShowApplications] = useState(false);

  useEffect(() => {
    const data = getProjectById(id);
    setProject(data);
    setApplications(getApplicationsByProject(id));
    setMilestones(getMilestonesByProject(id));
  }, [id]);

  useEffect(() => {
    setApplications(getApplicationsByProject(id));
    setMilestones(getMilestonesByProject(id));
  }, [id, showMilestoneModal, showApplications]);

  if (!project) {
    return (
      <div className="min-h-screen bg-black p-6 text-white">
        <p>Project not found.</p>
      </div>
    );
  }

  const handleApprove = (appId) => {
    updateApplication(appId, { status: 'approved' });
    setApplications(getApplicationsByProject(id));
  };

  const handleReject = (appId) => {
    updateApplication(appId, { status: 'rejected' });
    setApplications(getApplicationsByProject(id));
  };

  const handleSimApply = (role) => {
    const application = {
      id: Date.now(),
      projectId: Number(id),
      name: role === 'freelancer' ? 'Sim Freelancer' : 'Sim Agency',
      applicantType: role,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    addApplication(application);
    setApplications(getApplicationsByProject(id));
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate('/admin/projects')} className="flex items-center gap-2 mb-6 text-gray-300 hover:text-white">
          <ArrowLeft size={18} /> Back to projects
        </button>

        <div className="bg-[#101018] border border-[#23232a] rounded-xl p-6">
          <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white">{project.title}</h1>
              <p className="text-gray-400 mt-2">{project.description || 'No project description available.'}</p>
            </div>
            <div className="flex flex-wrap gap-2 items-center">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusBadge(project.status)}`}>{project.status}</span>
              <span className="text-gray-400 text-sm">Deadline: {fmtDate(project.deadline)}</span>
              <span className="text-gray-400 text-sm">Budget: ₹{project.budget.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.6fr_0.9fr]">
            <div className="bg-[#0c0c14] border border-[#23232a] rounded-xl p-5">
              <div className="flex flex-wrap gap-3 mb-5">
                <button onClick={() => setActiveTab('overview')} className={`px-4 py-2 rounded-lg text-sm ${activeTab==='overview' ? 'bg-[#70d64d] text-black' : 'bg-[#14141c] text-gray-300'}`}>Overview</button>
                <button onClick={() => setActiveTab('milestones')} className={`px-4 py-2 rounded-lg text-sm ${activeTab==='milestones' ? 'bg-[#70d64d] text-black' : 'bg-[#14141c] text-gray-300'}`}>Milestones</button>
                <button onClick={() => setActiveTab('applications')} className={`px-4 py-2 rounded-lg text-sm ${activeTab==='applications' ? 'bg-[#70d64d] text-black' : 'bg-[#14141c] text-gray-300'}`}>Applications</button>
              </div>

              {activeTab === 'overview' && (
                <div className="space-y-5 text-gray-300">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-[#12121c] p-4 rounded-xl border border-[#23232a]">
                      <div className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-3">Progress</div>
                      <div className="text-3xl font-bold text-white">{project.progress}%</div>
                    </div>
                    <div className="bg-[#12121c] p-4 rounded-xl border border-[#23232a]">
                      <div className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-3">Assigned</div>
                      <div className="text-white">{project.assignedMembers.length || 'None'}</div>
                    </div>
                    <div className="bg-[#12121c] p-4 rounded-xl border border-[#23232a]">
                      <div className="text-sm text-gray-400 uppercase tracking-[0.2em] mb-3">Applicants</div>
                      <div className="text-white">{applications.length}</div>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="bg-[#12121c] p-4 rounded-xl border border-[#23232a]">
                      <h2 className="text-white font-semibold mb-3">Client</h2>
                      <p className="text-gray-300">{project.client}</p>
                    </div>
                    <div className="bg-[#12121c] p-4 rounded-xl border border-[#23232a]">
                      <h2 className="text-white font-semibold mb-3">Category</h2>
                      <p className="text-gray-300">{project.category}</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'milestones' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">Milestones</h2>
                      <p className="text-gray-500 text-sm">Add, edit, delete milestones and track payment history.</p>
                    </div>
                    <button onClick={() => setShowMilestoneModal(true)} className="inline-flex items-center gap-2 bg-[#70d64d] text-black px-4 py-2 rounded-lg text-sm font-semibold"><Plus size={16}/> Manage Milestones</button>
                  </div>

                  {milestones.length === 0 ? (
                    <div className="bg-[#12121c] border border-[#23232a] rounded-xl p-5 text-gray-500">No milestones defined yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {milestones.map((ms) => (
                        <div key={ms.id} className="border border-[#23232a] rounded-xl p-4 bg-[#10101a]">
                          <div className="flex flex-wrap justify-between gap-3">
                            <div>
                              <h3 className="text-white font-semibold">{ms.title}</h3>
                              <p className="text-gray-400 text-sm mt-1">{ms.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm text-gray-400">Due {fmtDate(ms.due_date)}</p>
                              <p className="text-white font-semibold mt-1">₹{ms.amount?.toLocaleString() || '0'}</p>
                            </div>
                          </div>
                          <div className="mt-4 grid gap-3 md:grid-cols-3">
                            <div className="bg-[#12121c] rounded-xl p-3 border border-[#23232a]">
                              <div className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Status</div>
                              <div className="text-white font-semibold">{ms.status || 'pending'}</div>
                            </div>
                            <div className="bg-[#12121c] rounded-xl p-3 border border-[#23232a]">
                              <div className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Payments</div>
                              <div className="text-white font-semibold">{(ms.payments || []).length}</div>
                            </div>
                            <div className="bg-[#12121c] rounded-xl p-3 border border-[#23232a]">
                              <div className="text-gray-400 text-xs uppercase tracking-[0.2em] mb-2">Last paid</div>
                              <div className="text-white font-semibold">{ms.payments?.length ? fmtDate(ms.payments[ms.payments.length - 1].date) : '—'}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'applications' && (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-3 justify-between items-center">
                    <div>
                      <h2 className="text-xl font-bold text-white">Applications</h2>
                      <p className="text-gray-500 text-sm">Review freelancer or agency requests for this project.</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <button onClick={() => handleSimApply('freelancer')} className="px-4 py-2 rounded-lg bg-[#0c0c14] border border-[#23232a] text-gray-300 text-sm">Sim Apply Freelancer</button>
                      <button onClick={() => handleSimApply('agency')} className="px-4 py-2 rounded-lg bg-[#0c0c14] border border-[#23232a] text-gray-300 text-sm">Sim Apply Agency</button>
                    </div>
                  </div>
                  {applications.length === 0 ? (
                    <div className="bg-[#12121c] border border-[#23232a] rounded-xl p-5 text-gray-500">No application requests yet.</div>
                  ) : (
                    <div className="space-y-3">
                      {applications.map((app) => (
                        <div key={app.id} className="bg-[#10101a] border border-[#23232a] rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                          <div>
                            <div className="text-white font-semibold">{app.name} <span className="text-gray-400 text-sm">({app.applicantType})</span></div>
                            <div className="text-gray-400 text-sm">Submitted {fmtDate(app.submittedAt)}</div>
                            <div className="text-sm mt-1">Status: <span className={app.status === 'approved' ? 'text-[#70d64d]' : app.status === 'rejected' ? 'text-[#ef4444]' : 'text-gray-400'}>{app.status}</span></div>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <button onClick={() => handleApprove(app.id)} disabled={app.status === 'approved'} className="px-4 py-2 rounded-lg bg-[#70d64d] text-black text-sm font-semibold">Approve</button>
                            <button onClick={() => handleReject(app.id)} disabled={app.status === 'rejected'} className="px-4 py-2 rounded-lg bg-[#ef4444] text-white text-sm font-semibold">Reject</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            <aside className="space-y-4">
              <div className="bg-[#12121c] border border-[#23232a] rounded-xl p-5">
                <h2 className="text-white font-semibold mb-3">Project Snapshot</h2>
                <div className="text-gray-400 text-sm space-y-3">
                  <div><span className="font-semibold text-gray-200">Client:</span> {project.client}</div>
                  <div><span className="font-semibold text-gray-200">Category:</span> {project.category}</div>
                  <div><span className="font-semibold text-gray-200">Deadline:</span> {fmtDate(project.deadline)}</div>
                  <div><span className="font-semibold text-gray-200">Budget:</span> ₹{project.budget.toLocaleString()}</div>
                  <div><span className="font-semibold text-gray-200">Applicants:</span> {applications.length}</div>
                  <div><span className="font-semibold text-gray-200">Assigned members:</span> {project.assignedMembers.length || '0'}</div>
                </div>
              </div>
              {/* <div className="bg-[#12121c] border border-[#23232a] rounded-xl p-5">
                <h2 className="text-white font-semibold mb-3">Quick Actions</h2>
                <button onClick={() => setShowMilestoneModal(true)} className="w-full mb-3 inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#70d64d] text-black text-sm font-semibold"><Plus size={16}/> Manage Milestones</button>
                <button onClick={() => setShowApplications(true)} className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-[#0c0c14] border border-[#23232a] text-gray-300 text-sm">View Applications</button>
              </div> */}
            </aside>
          </div>
        </div>
      </div>

      {showMilestoneModal && (
        <ProjectMilestones project={project} onClose={() => setShowMilestoneModal(false)} />
      )}

      {showApplications && (
        <ProjectApplications
          project={project}
          applications={applications}
          onClose={() => setShowApplications(false)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </div>
  );
}
