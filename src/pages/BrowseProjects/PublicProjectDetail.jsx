import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Calendar, Clock, Users, ArrowLeft, Paperclip, ClipboardList, Tag, Wallet, LogIn, UserPlus, Share2 } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/useAuthStore';
import gigfactoryLogo from '../../assets/logo.png';

const renderWithTbdTooltip = (val, tooltipText) => {
  if (val === 'TBD') {
    return (
      <span className="relative group inline-block">
        <span className="underline decoration-dotted decoration-gray-500 cursor-help text-[#a1a1aa] font-semibold">{val}</span>
        <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex flex-col items-center pointer-events-none z-[9999]">
          <span className="bg-[#18181b] border border-[#2d2d30] text-gray-200 text-[10.5px] font-semibold px-2 py-1 rounded-[4px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] whitespace-nowrap">
            {tooltipText}
          </span>
          <span className="w-1.5 h-1.5 bg-[#18181b] border-r border-b border-[#2d2d30] rotate-45 -mt-1" />
        </span>
      </span>
    );
  }
  return val;
};

export default function PublicProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleShare = () => {
    const publicUrl = window.location.href;
    navigator.clipboard.writeText(publicUrl)
      .then(() => {
        toast.success('Public project link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link.');
      });
  };

  // Check auth store
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // If already logged in, redirect to authenticated view automatically
  useEffect(() => {
    if (token && user) {
      if (user.role === 'admin') {
        navigate(`/admin/projects/${id}`, { replace: true });
      } else {
        navigate(`/projects/${id}`, { replace: true });
      }
    }
  }, [token, user, id, navigate]);

  // Query to fetch project details from the public endpoint
  const { data: detailData, isLoading, error } = useQuery({
    queryKey: ['public-project-detail', id],
    queryFn: () => api.get(`/projects/public/${id}`),
    enabled: !!id,
  });

  const project = detailData?.project;
  const milestones = project?.milestones || [];
  const files = project?.files || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white">
        {/* Simple Navbar */}
        <header className="bg-[#121215] border-b border-[#23232a] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <img src={gigfactoryLogo} alt="GigFactory" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
        </header>
        <div className="flex flex-col items-center justify-center space-y-4 py-40">
          <div className="animate-spin w-8 h-8 border-4 border-[#70d64d] border-t-transparent rounded-full" />
          <span className="text-gray-400 text-sm">Loading project details...</span>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0c0c0e] text-white">
        <header className="bg-[#121215] border-b border-[#23232a] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
          <img src={gigfactoryLogo} alt="GigFactory" className="h-8 cursor-pointer" onClick={() => navigate('/')} />
        </header>
        <div className="flex flex-col items-center justify-center space-y-4 py-40 px-6 text-center">
          <p className="text-red-500 font-semibold text-sm">Project details could not be loaded or the project does not exist.</p>
          <button 
            onClick={() => navigate('/')}
            className="bg-transparent border border-[#23232a] px-4 py-2 rounded-[6px] text-xs hover:bg-white/5 text-white transition cursor-pointer"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const formattedBudget = project.budget 
    ? `₹${Number(project.budget).toLocaleString('en-IN')}` 
    : 'Undisclosed';

  const formattedStartDate = project.start_date 
    ? new Date(project.start_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'TBD';

  const formattedHours = project.estimated_hours 
    ? `${Number(project.estimated_hours)} hrs` 
    : 'TBD';

  const formattedDeadline = project.end_date 
    ? new Date(project.end_date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'TBD';

  const handleApplyClick = () => {
    navigate(`/?redirect=/projects/public/${id}`);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-white flex flex-col">
      {/* Sticky Public Header */}
      <header className="bg-[#121215]/80 backdrop-blur-md border-b border-[#23232a] px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <img 
            src={gigfactoryLogo} 
            alt="GigFactory Logo" 
            className="h-8 cursor-pointer" 
            onClick={() => navigate('/')} 
          />
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/')} 
            className="text-gray-400 hover:text-white font-semibold text-xs sm:text-sm transition bg-transparent border-none cursor-pointer flex items-center gap-1.5"
          >
            <LogIn size={15} /> Log In
          </button>
          <button 
            onClick={() => navigate('/?register=true')} 
            className="bg-[#70d64d] hover:bg-[#8ee67b] text-black font-extrabold text-xs px-3 sm:px-4 py-2 rounded-[6px] transition cursor-pointer flex items-center gap-1.5 shadow-[0_4px_12px_rgba(112,214,77,0.15)]"
          >
            <UserPlus size={15} /> Register
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 md:p-8 flex flex-col gap-6">
        
        {/* Back navigation and Share */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition duration-150 bg-transparent border-none cursor-pointer font-semibold"
          >
            <ArrowLeft size={14} /> Back to Login
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#70d64d] transition duration-150 bg-transparent border-none cursor-pointer font-semibold"
          >
            <Share2 size={14} /> Share Project
          </button>
        </div>

        {/* Project Header block */}
        <div className="bg-[#121215] border-l-4 border-l-[#70d64d] border-t-0 border-r-0 border-b-0 rounded-[6px] p-6 md:p-[28px] relative">
          <div className="flex flex-col md:flex-row justify-between gap-[20px] items-start md:items-center">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-[8px] flex-wrap">
                <span className="bg-[#202024] border border-[#2d2d34] text-white text-[0.65rem] px-[10px] py-[4px] rounded-[4px] font-bold uppercase tracking-wider">
                  {project.project_type || 'FIXED'}
                </span>
                <span className={`uppercase font-bold text-[0.65rem] px-[10px] py-[4px] rounded-[4px] tracking-wider border ${
                  project.priority === 'high' 
                    ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                    : project.priority === 'medium' 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' 
                      : 'bg-green-500/10 text-green-400 border-green-500/20'
                }`}>
                  {project.priority || 'MEDIUM'} PRIORITY
                </span>
                {project.category && (
                  <span className="bg-[#0c0c0e] text-[#a1a1aa] border border-[#23232a] text-[0.65rem] px-[10px] py-[4px] rounded-[4px] font-bold uppercase tracking-wider">
                    {project.category}
                  </span>
                )}
              </div>
              
              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2 leading-tight break-words">
                {project.title}
              </h1>

              {/* Sub-label/Company */}
              <div className="flex items-center gap-2 text-[#8a8a8a] text-[0.85rem] mt-3">
                <Briefcase size={14} className="text-gray-500" />
                <span className="font-semibold text-gray-300">{project.client || 'Internal Client'}</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="text-left md:text-right shrink-0 mt-4 md:mt-0">
              <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block mb-2">Project Status</span>
              <span className={`inline-flex items-center gap-[6px] uppercase font-bold text-[0.7rem] px-[12px] py-[6px] rounded-[6px] border ${
                project.status === 'completed'
                  ? 'bg-[#182318] text-[#70d64d] border-[#70d64d]/30'
                  : project.status === 'assigned'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  project.status === 'completed' ? 'bg-[#70d64d]' : project.status === 'assigned' ? 'bg-blue-400' : 'bg-amber-400'
                }`} />
                {project.status === 'completed' ? 'Completed' : project.status === 'assigned' ? 'In Progress' : 'Open'}
              </span>
            </div>
          </div>

          {/* Summary grid */}
          <div className="grid grid-cols-1 min-[375px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 mt-6 pt-6 border-t border-[#23232a] w-full">
            {/* Budget */}
            <div className="flex items-start gap-3 min-w-0">
              <Wallet className="text-[#8a8a8a] mt-1 shrink-0" size={18} />
              <div className="min-w-0">
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Budget</span>
                <span className="text-white font-extrabold text-[1.1rem] sm:text-[1.2rem] mt-1 block truncate">
                  {formattedBudget}
                </span>
              </div>
            </div>
            {/* Start Date */}
            <div className="flex items-start gap-3 min-w-0">
              <Calendar className="text-[#8a8a8a] mt-1 shrink-0" size={18} />
              <div className="min-w-0">
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Start Date</span>
                <span className="text-white font-extrabold text-[1.1rem] sm:text-[1.2rem] mt-1 block">
                  {renderWithTbdTooltip(formattedStartDate, "To Be Decided / Determined by client")}
                </span>
              </div>
            </div>
            {/* Est. Hours */}
            <div className="flex items-start gap-3 min-w-0">
              <Clock className="text-[#8a8a8a] mt-1 shrink-0" size={18} />
              <div className="min-w-0">
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Est. Hours</span>
                <span className="text-white font-extrabold text-[1.1rem] sm:text-[1.2rem] mt-1 block">
                  {renderWithTbdTooltip(formattedHours, "To Be Determined based on requirements")}
                </span>
              </div>
            </div>
            {/* Deadline */}
            <div className="flex items-start gap-3 min-w-0">
              <Calendar className="text-[#8a8a8a] mt-1 shrink-0" size={18} />
              <div className="min-w-0">
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Deadline</span>
                <span className="text-white font-extrabold text-[1.1rem] sm:text-[1.2rem] mt-1 block">
                  {renderWithTbdTooltip(formattedDeadline, "To Be Decided / Finalized by client")}
                </span>
              </div>
            </div>
            {/* Applicants */}
            <div className="flex items-start gap-3 min-w-0">
              <Users className="text-[#8a8a8a] mt-1 shrink-0" size={18} />
              <div className="min-w-0">
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Applicants</span>
                <span className="text-white font-extrabold text-[1.1rem] sm:text-[1.2rem] mt-1 block truncate">
                  {project.applications_count || 0} Users
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Grid layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_0.9fr] gap-[20px] items-start">
          
          {/* Left main column */}
          <div className="flex flex-col gap-[20px]">
            
            {/* Description card */}
            <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
              <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                <Briefcase size={18} className="text-[#70d64d]" />
                <h3 className="text-white font-bold text-[1rem] m-0">Project Description</h3>
              </div>
              <div 
                className="text-[#8a8a8a] text-[0.85rem] m-0 leading-relaxed whitespace-pre-wrap rich-text-content ql-editor-display"
                dangerouslySetInnerHTML={{ __html: project.description || 'No description available for this project.' }}
              />
            </section>

            {/* Required Skills & Expertise */}
            {project.project_skills && project.project_skills.length > 0 && (
              <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
                <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                  <Tag className="text-[#70d64d]" size={18} />
                  <h3 className="text-white font-bold text-[1rem] m-0">Required Skills & Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {project.project_skills.map((sk) => (
                    <span 
                      key={sk.id} 
                      className="bg-[#0c0c0e] border border-[#23232a] text-white text-[0.78rem] px-[12px] py-[6px] rounded-[4px] font-medium"
                    >
                      {sk.skill_name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Project Deliverables / Tags */}
            {project.project_tags && project.project_tags.length > 0 && (
              <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
                <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                  <Briefcase className="text-[#70d64d]" size={18} />
                  <h3 className="text-white font-bold text-[1rem] m-0">Project Deliverables</h3>
                </div>
                <div className="flex flex-wrap gap-[8px]">
                  {project.project_tags.map((t) => (
                    <span 
                      key={t.id} 
                      className="bg-transparent border border-dashed border-[#23232a] text-[#70d64d] text-[0.78rem] px-[12px] py-[6px] rounded-[4px] font-medium"
                    >
                      {t.tag_name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {/* Project Documents/Files card */}
            {files.length > 0 && (
              <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
                <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                  <Paperclip size={18} className="text-[#70d64d]" />
                  <h3 className="text-white font-bold text-[1rem] m-0">Supporting Documents</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {files.map((file) => (
                    <a 
                      key={file.id} 
                      href={file.file_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="bg-[#0c0c0e] border border-[#23232a] hover:border-gray-500 hover:bg-[#1a1a20] rounded-[6px] p-3 flex items-center justify-between transition-all duration-150 text-decoration-none cursor-pointer"
                    >
                      <div className="flex items-center gap-2 min-w-0 pr-4 w-full">
                        <Paperclip size={14} className="text-gray-500 shrink-0" />
                        <span className="text-xs text-gray-300 truncate font-semibold">{file.file_name}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 uppercase font-bold shrink-0">VIEW</span>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {/* Milestones list card */}
            <section className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 md:p-8">
              <div className="flex items-center gap-[10px] mb-6 border-b border-[#23232a] pb-3">
                <ClipboardList size={18} className="text-[#70d64d]" />
                <h3 className="text-white font-bold text-[1rem] m-0">Project Milestones</h3>
              </div>
              
              {milestones.length === 0 ? (
                <p className="text-gray-500 text-[0.82rem] m-0 italic">No milestones defined for this project.</p>
              ) : (
                <div className="relative pl-6 sm:pl-8 space-y-6">
                  {/* Vertical line running through the nodes */}
                  <div className="absolute left-[9px] sm:left-[11px] top-2 bottom-2 w-[2px] bg-[#23232a]" />
                  
                  {milestones.map((milestone) => (
                    <div key={milestone.id} className="relative">
                      {/* Node Dot indicator */}
                      <div className="absolute -left-[25px] sm:-left-[33px] top-1.5 w-[20px] h-[20px] sm:w-[24px] sm:h-[24px] rounded-full bg-[#0c0c0e] border-2 border-[#70d64d] flex items-center justify-center text-[9px] sm:text-[10px] font-extrabold text-[#70d64d] shadow-[0_0_10px_rgba(112,214,77,0.2)] z-10">
                        {milestone.milestone_no}
                      </div>

                      {/* Timeline card container */}
                      <div className="bg-[#0c0c0e] border border-[#23232a] hover:border-[#70d64d]/30 hover:shadow-[0_4px_16px_rgba(0,0,0,0.4)] rounded-[6px] p-4 flex flex-col gap-4 transition-all duration-150">
                        
                        <div className="flex flex-col md:flex-row justify-between gap-4">
                          <div className="space-y-1.5 min-w-0 flex-1">
                            <h4 className="text-white font-bold text-sm">{milestone.title}</h4>
                            <div 
                              className="text-gray-400 text-xs leading-relaxed ql-editor-display"
                              dangerouslySetInnerHTML={{ __html: milestone.description }}
                            />
                          </div>
                          <div className="flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-1.5 shrink-0 border-t md:border-t-0 border-[#1c1c24] pt-2 md:pt-0">
                            <span className="text-xs text-gray-500">Weight: <strong className="text-white font-semibold">{Number(milestone.weight_percentage)}%</strong></span>
                            <span className="text-sm font-extrabold text-[#70d64d]">₹{Number(milestone.budget).toLocaleString('en-IN')}</span>
                            <span className="text-[#8a8a8a] text-[10px] font-semibold block mt-1">Due: {milestone.due_date ? new Date(milestone.due_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : 'TBD'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Right sidebar */}
          <div className="flex flex-col gap-[20px]">
            
            {/* Application CTA panel */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 shadow-lg sticky top-[90px]">
              <div className="mb-4">
                <h3 className="text-white font-bold text-base">Submit Proposal</h3>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">Interested in this project? Apply now to offer your bid and execution details.</p>
              </div>
              
              <div className="space-y-3.5">
                <button
                  onClick={handleApplyClick}
                  className="w-full bg-[#70d64d] hover:bg-[#8ee67b] text-black border-none py-[12px] rounded-[6px] text-[0.8rem] font-bold flex items-center justify-center gap-[6px] cursor-pointer transition-colors duration-150 shadow-[0_4px_12px_rgba(112,214,77,0.15)]"
                >
                  Apply to Project
                </button>
                <p className="text-[#8a8a8a] text-[10.5px] leading-relaxed text-center font-medium">
                  Note: You must log in or register a GigFactory account to apply.
                </p>
              </div>
            </div>

          </div>
          
        </div>
              
      </main>
    </div>
  );
}
