import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Briefcase, Calendar, Clock, Users, ArrowLeft, Paperclip, ClipboardList, CheckCircle, Tag, Wallet, Share2, X, Award, Check, Download } from 'lucide-react';
import { toast } from 'react-toastify';
import { api } from '../../utils/api';
import { useAuthStore } from '../../store/useAuthStore';
import ApplyModal from './ApplyModal';
import SubmitDeliverableModal from './SubmitDeliverableModal';
import ViewReceiptModal from './ViewReceiptModal';

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

const ProgressBar = ({ value, label }) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-[11px] font-semibold">
      <span className="text-gray-400">{label}</span>
      <span className="text-[#70d64d] font-bold">{value}%</span>
    </div>
    <div className="w-full bg-[#1c1c24] h-2 rounded-full overflow-hidden border border-[#23232a]">
      <div 
        className="bg-[#70d64d] h-full rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const handleShare = () => {
    const publicUrl = `${window.location.origin}/projects/public/${id}`;
    navigator.clipboard.writeText(publicUrl)
      .then(() => {
        toast.success('Public project link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        toast.error('Failed to copy link.');
      });
  };

  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState('freelancer');
  const [selectedMilestoneForDeliverable, setSelectedMilestoneForDeliverable] = useState(null);
  const [selectedMilestoneForReceipt, setSelectedMilestoneForReceipt] = useState(null);
  const [selectedPaymentForReceipt, setSelectedPaymentForReceipt] = useState(null);
  const [selectedDeliverableForEdit, setSelectedDeliverableForEdit] = useState(null);

  // Completion certificate states
  const [isCertOpen, setIsCertOpen] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [freelancerRemarks, setFreelancerRemarks] = useState('');
  const [isFetchingCert, setIsFetchingCert] = useState(false);
  const [isSigningCert, setIsSigningCert] = useState(false);

  const handleViewCertificate = async () => {
    setIsFetchingCert(true);
    try {
      const response = await api.get(`/projects/${id}/completion-certificate`);
      setCertificateData(response.certificate);
      setIsCertOpen(true);
    } catch (err) {
      toast.error(err.message || 'Failed to load completion certificate.');
    } finally {
      setIsFetchingCert(false);
    }
  };

  const handleDownload = () => {
    const printContent = document.getElementById('completion-certificate-print');
    if (!printContent) return;
    const windowUrl = 'about:blank';
    const uniqueName = new Date().getTime();
    const windowName = 'Print' + uniqueName;
    const printWindow = window.open(windowUrl, windowName, 'left=50000,top=50000,width=800,height=600');
    
    let stylesHtml = '';
    for (const node of document.querySelectorAll('link[rel="stylesheet"], style')) {
      stylesHtml += node.outerHTML;
    }

    printWindow.document.write(`
      <html>
        <head>
          <title>GigFactory - Completion Certificate</title>
          \${stylesHtml}
          <style>
            body {
              background-color: #0c0c0e !important;
              color: white !important;
              padding: 40px;
              font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
              display: flex;
              justify-content: center;
              align-items: center;
              min-height: 100vh;
            }
            .border-2 {
              border-width: 2px !important;
            }
            .border-dashed {
              border-style: dashed !important;
            }
            .border-\\\\[\\\\#70d64d\\\\]\\\\/30 {
              border-color: rgba(112, 214, 77, 0.3) !important;
            }
            .bg-\\\\[\\\\#0c0c0e\\\\] {
              background-color: #0c0c0e !important;
            }
            .text-\\\\[\\\\#70d64d\\\\] {
              color: #70d64d !important;
            }
            .text-white {
              color: white !important;
            }
            .max-w-\\\\[650px\\\\] {
              max-w: 650px !important;
              width: 100% !important;
            }
            @page {
              size: auto;
              margin: 0mm;
            }
          </style>
        </head>
        <body>
          <div class="dark" style="width: 100%; max-w: 650px;">
            \${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Get active user info from store to auto-detect role name
  const user = useAuthStore((state) => state.user) || {};
  const userRole = user.role || 'freelancer';

  useEffect(() => {
    if (userRole === 'admin') {
      navigate(`/admin/projects/${id}`, { replace: true });
    }
  }, [userRole, id, navigate]);

  // Query to fetch project details from the backend API
  const { data: detailData, isLoading, error, refetch } = useQuery({
    queryKey: ['project-detail', id],
    queryFn: () => api.get(`/projects/${id}`),
    enabled: !!id && userRole !== 'admin',
  });

  const project = detailData?.project;
  const milestones = project?.milestones || [];
  const files = project?.files || [];
  const myApplication = project?.my_application;

  const activeAssignment = project?.assignments?.find(
    (asm) => asm.assigned_to_user_id === user.id && asm.status === 'active'
  );
  const isAssigned = !!activeAssignment;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <div className="animate-spin w-8 h-8 border-4 border-[#70d64d] border-t-transparent rounded-full" />
        <span className="text-gray-400 text-sm">Loading project details...</span>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-20">
        <p className="text-red-500 font-semibold text-sm">Project details could not be loaded.</p>
        <button 
          onClick={() => navigate('/projects')}
          className="bg-transparent border border-[#23232a] px-4 py-2 rounded-[6px] text-xs hover:bg-white/5 text-white transition cursor-pointer"
        >
          Back to Browse Projects
        </button>
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



  const handleApplyTrigger = (role) => {
    setSelectedRole(role);
    setIsApplyOpen(true);
  };

  return (
    <div className="mx-auto flex flex-col gap-6">
      
      {/* Back navigation and Share */}
      <div className="flex justify-between items-center">
        <button
          onClick={() => navigate('/projects')}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition duration-150 bg-transparent border-none cursor-pointer font-semibold"
        >
          <ArrowLeft size={14} /> Back to Projects
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
                : project.status === 'pending_completion'
                  ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  : project.status === 'assigned'
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    : 'bg-gray-500/10 text-gray-400 border-[#23232a]'
            }`}>
              <span className={`w-2 h-2 rounded-full ${
                project.status === 'completed' ? 'bg-[#70d64d]' : project.status === 'pending_completion' ? 'bg-amber-400' : project.status === 'assigned' ? 'bg-blue-400' : 'bg-gray-400'
              }`} />
              {project.status === 'completed' ? 'Completed' : project.status === 'pending_completion' ? 'Pending Signature' : project.status === 'assigned' ? 'In Progress' : 'Not Started'}
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
      {/* Project Completion Banners */}
      {isAssigned && project.status === 'pending_completion' && (
        <div className="bg-[#121215] border border-amber-500/30 rounded-[10px] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h4 className="text-white font-extrabold text-[0.95rem]">Action Required: Completion Sign-off Pending 📋</h4>
            <p className="text-[#a1a1aa] text-[0.78rem] m-0">The administrator has initiated project completion. Please review the settlement amount and sign the completion certificate.</p>
          </div>
          <button
            onClick={handleViewCertificate}
            className="bg-amber-500 hover:bg-amber-600 text-black font-extrabold rounded-[6px] px-4 py-2.5 text-[0.78rem] cursor-pointer transition border-none shrink-0"
          >
            Review & Sign Certificate
          </button>
        </div>
      )}

      {isAssigned && project.status === 'completed' && (
        <div className="bg-[#121215] border border-[#70d64d]/30 rounded-[10px] p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1 min-w-0">
            <h4 className="text-[#70d64d] font-extrabold text-[0.95rem]">Project Successfully Completed 🎉</h4>
            <p className="text-[#a1a1aa] text-[0.78rem] m-0">This project has been officially settled and marked as completed. You can view the signed completion certificate at any time.</p>
          </div>
          <button
            onClick={handleViewCertificate}
            className="bg-[#1a1a20] hover:bg-[#252530] border border-[#2d2d38] text-gray-300 hover:text-white font-extrabold rounded-[6px] px-4 py-2.5 text-[0.78rem] cursor-pointer transition shrink-0"
          >
            View Completion Certificate
          </button>
        </div>
      )}

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
                    className="bg-[#0c0c0e] border border-[#23232a] hover:border-gray-500 hover:bg-[#1a1a20] rounded-[6px] p-3 flex items-center justify-between transition-all duration-150  text-decoration-none cursor-pointer"
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
                    {/* Glowing Node Dot indicator */}
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

                      {/* If the user is assigned, show additional project tracking/payment status row */}
                      {isAssigned && (() => {
                        const milestonePayment = project.milestone_payments?.find(p => p.milestone_id === milestone.id);
                        return (
                          <div className="border-t border-[#1c1c24] pt-3.5 mt-1 space-y-3.5">
                            
                            {/* Status and Payment indicators */}
                            <div className="flex justify-between items-center flex-wrap gap-2.5">
                              
                              <div className="flex gap-4 items-center flex-wrap">
                                <div className="text-[11px] font-semibold flex items-center gap-1.5">
                                  <span className="text-gray-500 uppercase tracking-wide">Status:</span>
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]`} style={{
                                    backgroundColor: milestone.status === 'completed' ? '#70d64d1c' : milestone.status === 'rejected' ? '#ef44441c' : milestone.status === 'submitted' ? '#3b82f61c' : '#f59e0b1c',
                                    color: milestone.status === 'completed' ? '#70d64d' : milestone.status === 'rejected' ? '#ef4444' : milestone.status === 'submitted' ? '#3b82f6' : '#f59e0b',
                                  }}>
                                    {milestone.status === 'completed' ? 'completed' : milestone.status === 'rejected' ? 'revision required' : milestone.status === 'submitted' ? 'under review' : 'pending'}
                                  </span>
                                </div>

                                <div className="text-[11px] font-semibold flex items-center gap-1.5">
                                  <span className="text-gray-500 uppercase tracking-wide">Payment:</span>
                                  <span className={`px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]`} style={{
                                    backgroundColor: milestone.payment_status === 'paid' ? '#70d64d1c' : milestone.payment_status === 'pending' ? '#f59e0b1c' : '#23232a',
                                    color: milestone.payment_status === 'paid' ? '#70d64d' : milestone.payment_status === 'pending' ? '#f59e0b' : '#a1a1aa',
                                  }}>
                                    {milestone.payment_status || 'unpaid'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                {/* Submit Deliverable Button */}
                                {milestone.status !== 'completed' && (
                                  <button
                                    onClick={() => setSelectedMilestoneForDeliverable(milestone)}
                                    className="bg-[#70d64d]/10 hover:bg-[#70d64d]/20 text-[#70d64d] border border-[#70d64d]/30 font-bold rounded-[4px] px-3 py-1.5 text-xs cursor-pointer transition-colors"
                                  >
                                    {milestone.status === 'rejected' ? 'Re-submit Deliverable' : 'Submit Deliverable'}
                                  </button>
                                )}

                                {/* View Receipt Button */}
                                {milestone.payment_status === 'paid' && milestonePayment && (
                                  <button
                                    onClick={() => {
                                      setSelectedMilestoneForReceipt(milestone);
                                      setSelectedPaymentForReceipt(milestonePayment);
                                    }}
                                    className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-[#70d64d] font-bold rounded-[4px] px-3 py-1.5 text-xs cursor-pointer transition-colors flex items-center gap-1 hover:border-[#70d64d]/40"
                                  >
                                    <Wallet size={12} className="shrink-0" /> View Receipt
                                  </button>
                                )}
                              </div>

                            </div>

                            {/* Submissions Log (Deliverables & Reviews) */}
                            {((milestone.deliverables && milestone.deliverables.length > 0) || (milestone.reviews && milestone.reviews.length > 0)) && (
                              <div className="bg-[#121215] border border-[#1c1c24] rounded-[6px] p-3 space-y-3.5">
                                
                                {/* Deliverables List */}
                                {milestone.deliverables && milestone.deliverables.length > 0 && (
                                  <div className="space-y-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Deliverable Submissions</span>
                                    <div className="divide-y divide-[#1c1c24] space-y-3">
                                      {milestone.deliverables.map((deliv, dIdx) => (
                                        <div key={deliv.id} className={`text-xs space-y-1.5 ${dIdx > 0 ? 'pt-3' : ''}`}>
                                          <div className="flex justify-between items-center text-gray-300">
                                            <span className="font-bold text-white">{deliv.title}</span>
                                            <span className="text-[10px] text-gray-500">
                                              {new Date(deliv.submitted_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                          <p className="text-gray-400 leading-relaxed m-0">{deliv.description}</p>
                                          {deliv.submission_notes && (
                                            <div className="bg-[#0c0c0e] border border-[#1c1c24] rounded-[4px] p-2 text-[11px] text-gray-400 font-mono whitespace-pre-wrap">
                                              <strong>Notes:</strong> {deliv.submission_notes}
                                            </div>
                                          )}
                                          {deliv.files && deliv.files.length > 0 && (
                                            <div className="flex flex-wrap gap-2 items-center text-[10px] text-gray-500 mt-1">
                                              <span className="font-bold uppercase tracking-wider">Attachments:</span>
                                              {deliv.files.map((f) => (
                                                <a
                                                  key={f.id}
                                                  href={f.file_url}
                                                  target="_blank"
                                                  rel="noopener noreferrer"
                                                  className="text-[#70d64d] hover:underline font-semibold flex items-center gap-1"
                                                >
                                                  <Paperclip size={10} /> {f.file_name}
                                                </a>
                                              ))}
                                            </div>
                                          )}
                                          {deliv.status !== 'approved' && deliv.submitted_by === user.id && (
                                            <div className="flex justify-end mt-2">
                                              <button
                                                onClick={() => {
                                                  setSelectedMilestoneForDeliverable(milestone);
                                                  setSelectedDeliverableForEdit(deliv);
                                                }}
                                                className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] hover:border-[#70d64d]/30 text-[#70d64d] hover:text-[#8ee67b] font-bold rounded-[4px] px-2.5 py-1 text-[10px] cursor-pointer transition-colors"
                                              >
                                                Edit Submission
                                              </button>
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Reviews List */}
                                {milestone.reviews && milestone.reviews.length > 0 && (
                                  <div className="space-y-3 border-t border-[#1c1c24] pt-3">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">Admin Feedback &amp; Reviews</span>
                                    <div className="divide-y divide-[#1c1c24] space-y-3">
                                      {milestone.reviews.map((rev, rIdx) => (
                                        <div key={rev.id} className={`text-xs space-y-1.5 ${rIdx > 0 ? 'pt-3' : ''}`}>
                                          <div className="flex justify-between items-center text-gray-300">
                                            <span className="font-bold flex items-center gap-1.5">
                                              <span className={`w-1.5 h-1.5 rounded-full ${rev.status === 'approved' ? 'bg-[#70d64d]' : 'bg-red-400'}`} />
                                              {rev.status === 'approved' ? 'Approved' : 'Revision Requested'}
                                            </span>
                                            <span className="text-[10px] text-gray-500">
                                              {new Date(rev.reviewed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                          </div>
                                          {rev.comments && <p className="text-gray-400 leading-relaxed italic m-0">"{rev.comments}"</p>}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        

        </div>

        {/* Right sidebar */}
        <div className="flex flex-col gap-[20px]">
          
          {/* Application panel */}
          <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-6 shadow-lg">
            {isAssigned ? (
              // Active assignment contract box
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <CheckCircle className="text-[#70d64d] shrink-0" size={18} />
                  <h3 className="text-white font-bold text-sm">Active Contract</h3>
                </div>
                
                <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[6px] p-3.5 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-semibold uppercase">Contract Budget</span>
                    <span className="text-[#70d64d] font-extrabold text-sm">
                      ₹{Number(activeAssignment.assigned_amount || project.budget).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-[#1c1c24] pt-2">
                    <span className="text-gray-500 font-semibold uppercase">Assigned Date</span>
                    <span className="text-white font-bold">
                      {new Date(activeAssignment.assigned_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs border-t border-[#1c1c24] pt-2">
                    <span className="text-gray-500 font-semibold uppercase">Your Role</span>
                    <span className="text-white font-bold capitalize">
                      {userRole}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#23232a] pt-4 mt-3 space-y-3">
                  <ProgressBar value={project.progress_percentage || 0} label="Overall Completion" />
                  
                  <div className="flex justify-between items-center text-xs text-gray-400 font-semibold mt-2">
                    <span>Milestones Completed</span>
                    <span className="text-white font-bold">
                      {project.completed_milestones || 0} / {project.total_milestones || 0}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-500 text-[10.5px] leading-relaxed mt-2 italic border-t border-[#23232a] pt-3">
                  You are officially assigned as the executor of this project. Track milestone statuses and submit deliverables for review below.
                </p>
              </div>
            ) : myApplication ? (
              // Already applied box
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 mb-2">
                  <CheckCircle className="text-[#70d64d] shrink-0" size={18} />
                  <h3 className="text-white font-bold text-sm">Proposal Submitted</h3>
                </div>
                
                <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[6px] p-3.5 space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-semibold">YOUR BID</span>
                    <span className="text-[#70d64d] font-bold">₹{Number(myApplication.bid_amount).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-semibold">DURATION</span>
                    <span className="text-white font-bold">{myApplication.estimated_days} Days</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-semibold">STATUS</span>
                    <span className="px-2 py-0.5 rounded font-bold uppercase tracking-wider text-[9px]" style={{
                      backgroundColor: myApplication.status === 'accepted' ? '#70d64d1c' : myApplication.status === 'rejected' ? '#ef44441c' : '#f59e0b1c',
                      color: myApplication.status === 'accepted' ? '#70d64d' : myApplication.status === 'rejected' ? '#ef4444' : '#f59e0b',
                    }}>
                      {myApplication.status || 'applied'}
                    </span>
                  </div>
                </div>

                <div className="border-t border-[#23232a] pt-4 mt-3 space-y-3">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Your Proposal Strategy</span>
                    <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[6px] p-3 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[160px] overflow-y-auto">
                      {myApplication.proposal}
                    </div>
                  </div>
                  
                  {myApplication.cover_letter && (
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Cover Letter</span>
                      <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[6px] p-3 text-xs text-gray-300 whitespace-pre-wrap leading-relaxed max-h-[120px] overflow-y-auto">
                        {myApplication.cover_letter}
                      </div>
                    </div>
                  )}

                  {myApplication.attachment_url && (
                    <div className="flex items-center justify-between bg-[#0c0c0e] border border-[#23232a] rounded-[6px] px-3 py-2 text-xs">
                      <span className="text-gray-500 font-semibold">Supporting Doc:</span>
                      <a 
                        href={myApplication.attachment_url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[#70d64d] font-bold hover:underline truncate max-w-[150px]"
                      >
                        View Attachment
                      </a>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-500 text-[10.5px] leading-relaxed mt-2 italic">
                  You have successfully submitted your execution strategy. The admin will review it and notify you via email when a decision is made.
                </p>
              </div>
            ) : (
              // Single Apply Now button
              <div className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-white font-bold text-base">Submit Proposal</h3>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">Submit your execution strategy and commercial bid to the platform.</p>
                </div>
                
                <div>
                  <button
                    onClick={() => handleApplyTrigger(userRole)}
                    className="w-full bg-[#70d64d] hover:bg-[#8ee67b] text-black border-none py-[12px] rounded-[6px] text-[0.8rem] font-bold flex items-center justify-center gap-[6px] cursor-pointer transition-colors duration-150 shadow-[0_4px_12px_rgba(112,214,77,0.15)]"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
        
      </div>
            
      {isApplyOpen && (
        <ApplyModal 
          project={project} 
          onClose={() => setIsApplyOpen(false)} 
          defaultRole={selectedRole} 
          onApplied={refetch} 
        />
      )}

      {selectedMilestoneForDeliverable && (
        <SubmitDeliverableModal 
          milestone={selectedMilestoneForDeliverable}
          deliverableToEdit={selectedDeliverableForEdit}
          onClose={() => {
            setSelectedMilestoneForDeliverable(null);
            setSelectedDeliverableForEdit(null);
          }}
          onSubmitted={refetch}
        />
      )}

      {selectedMilestoneForReceipt && selectedPaymentForReceipt && (
        <ViewReceiptModal 
          milestone={selectedMilestoneForReceipt}
          payment={selectedPaymentForReceipt}
          onClose={() => {
            setSelectedMilestoneForReceipt(null);
            setSelectedPaymentForReceipt(null);
          }}
        />
      )}

      {isCertOpen && certificateData && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]" onClick={() => setIsCertOpen(false)} />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[650px] bg-[#121215] border border-[#23232a] rounded-[10px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-[101] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b border-[#23232a] bg-[#0c0c0e]">
              <h3 className="text-white font-extrabold text-[1.1rem] flex items-center gap-2">
                <Award size={18} className="text-[#70d64d]" /> Completion Certificate
              </h3>
              <button onClick={() => setIsCertOpen(false)} className="bg-transparent border-none text-gray-500 hover:text-white cursor-pointer">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 flex-1 min-h-0 overflow-y-auto flex flex-col gap-6">
              
              {/* Premium Certificate Layout */}
              <div id="completion-certificate-print" className="border-2 border-dashed border-[#70d64d]/30 bg-[#0c0c0e] rounded-[8px] p-6 relative overflow-hidden flex flex-col gap-6">
                {/* Watermark/Logo */}
                <div className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full border-8 border-[#70d64d]/5 flex items-center justify-center rotate-[30deg] pointer-events-none select-none">
                  <span className="text-[#70d64d]/5 font-extrabold text-[1.5rem]">COMPLETED</span>
                </div>

                <div className="text-center border-b border-[#23232a] pb-4 flex flex-col gap-1.5">
                  <span className="text-[#70d64d] text-[0.65rem] font-bold uppercase tracking-widest">Certificate of Settlement</span>
                  <h2 className="text-white text-xl font-extrabold tracking-tight">GIGFACTORY</h2>
                  <p className="text-gray-500 text-[0.7rem]">This document certifies the bilateral project closure and financial settlement between the platform administration and the assigned freelancer/agency.</p>
                </div>

                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-[0.8rem]">
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Project Title</span>
                    <span className="text-white font-semibold block truncate">{project.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Project Code</span>
                    <span className="text-white font-semibold block">{project.project_code || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Platform Admin</span>
                    <span className="text-white font-semibold block">{certificateData.admin_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Assigned Executor</span>
                    <span className="text-white font-semibold block">{certificateData.assignee_name}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Original Project Budget</span>
                    <span className="text-white font-semibold block">₹{Number(project.budget || 0).toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem] block">Final Settled Amount</span>
                    <span className="text-[#70d64d] font-bold text-[0.95rem] block">₹{Number(certificateData.final_settled_amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="border-t border-[#23232a] pt-4 flex flex-col gap-3">
                  {certificateData.admin_remarks && (
                    <div className="bg-[#121215] border border-[#23232a] rounded-[6px] p-3 text-[0.78rem]">
                      <span className="text-gray-400 font-bold uppercase text-[0.62rem] block mb-1">Admin Remarks</span>
                      <p className="text-gray-300 m-0 leading-relaxed italic">"{certificateData.admin_remarks}"</p>
                    </div>
                  )}

                  {certificateData.freelancer_remarks && (
                    <div className="bg-[#121215] border border-[#23232a] rounded-[6px] p-3 text-[0.78rem]">
                      <span className="text-gray-400 font-bold uppercase text-[0.62rem] block mb-1">Executor Remarks</span>
                      <p className="text-gray-300 m-0 leading-relaxed italic">"{certificateData.freelancer_remarks}"</p>
                    </div>
                  )}
                </div>

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-6 mt-4 pt-4 border-t border-[#23232a]">
                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem]">Admin Signature</span>
                    <div className="bg-[#121215] border border-[#23232a] rounded-[6px] p-3 text-center min-h-[50px] flex flex-col justify-center gap-1 relative overflow-hidden">
                      <span className="text-[#70d64d] font-bold text-[0.75rem] italic">Signed electronically</span>
                      <span className="text-gray-500 text-[0.65rem]">{new Date(certificateData.admin_signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                      <div className="absolute right-1 bottom-1 border border-[#70d64d]/20 text-[#70d64d]/20 rounded-full px-1 text-[0.5rem] uppercase font-bold tracking-wider rotate-[-15deg] select-none pointer-events-none">GF Admin</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-gray-500 font-bold uppercase text-[0.62rem]">Executor Signature</span>
                    {certificateData.freelancer_signed_at ? (
                      <div className="bg-[#121215] border border-[#23232a] rounded-[6px] p-3 text-center min-h-[50px] flex flex-col justify-center gap-1 relative overflow-hidden">
                        <span className="text-[#70d64d] font-bold text-[0.75rem] italic">Signed electronically</span>
                        <span className="text-gray-500 text-[0.65rem]">{new Date(certificateData.freelancer_signed_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <div className="absolute right-1 bottom-1 border border-[#70d64d]/20 text-[#70d64d]/20 rounded-full px-1 text-[0.5rem] uppercase font-bold tracking-wider rotate-[-15deg] select-none pointer-events-none">GF Executor</div>
                      </div>
                    ) : (
                      <div className="bg-[#121215] border border-dashed border-[#ef444433] rounded-[6px] p-3 text-center min-h-[50px] flex flex-col justify-center relative">
                        <span className="text-[#ef4444] font-bold text-[0.75rem] uppercase tracking-wider">Awaiting Signature</span>
                        <span className="text-gray-500 text-[0.65rem] mt-0.5">Pending your acceptance</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Form Input for Signature (only if status is pending and user is the assignee) */}
              {!certificateData.freelancer_signed_at && project.status === 'pending_completion' && (
                <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-5 flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 font-bold text-[0.7rem] uppercase tracking-wider">Your Remarks / Signature Comments (Optional)</label>
                    <textarea
                      rows={3}
                      value={freelancerRemarks}
                      onChange={(e) => setFreelancerRemarks(e.target.value)}
                      placeholder="Enter remarks to be recorded on the certificate..."
                      className="bg-[#121215] border border-[#23232a] rounded-[6px] px-3.5 py-2.5 text-white text-[0.85rem] focus:outline-none focus:border-[#70d64d] w-full resize-none"
                    />
                  </div>

                  <div className="flex items-start gap-2.5 mt-2">
                    <input
                      type="checkbox"
                      id="acceptSignCheckbox"
                      className="accent-[#70d64d] cursor-pointer mt-1"
                      required
                    />
                    <label htmlFor="acceptSignCheckbox" className="text-gray-300 text-[0.8rem] leading-snug cursor-pointer font-medium select-none">
                      I agree that the project work is complete, and all financial settlements and payments are agreed, cleared, and closed. I accept electronic signing of this document.
                    </label>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-[#23232a]/50">
                <button
                  type="button"
                  onClick={handleDownload}
                  className="bg-[#70d64d] hover:bg-[#8ee67b] text-black font-bold rounded-[6px] px-5 py-2 text-[0.78rem] cursor-pointer transition-colors flex items-center gap-1.5 border-none"
                >
                  <Download size={14} /> Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => setIsCertOpen(false)}
                  className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 hover:text-white rounded-[6px] px-5 py-2 text-[0.78rem] font-bold cursor-pointer transition-colors"
                >
                  Close
                </button>
                {!certificateData.freelancer_signed_at && project.status === 'pending_completion' && (
                  <button
                    onClick={async () => {
                      const chk = document.getElementById('acceptSignCheckbox');
                      if (!chk || !chk.checked) {
                        toast.error('Please accept the declaration to sign.');
                        return;
                      }
                      setIsSigningCert(true);
                      try {
                        await api.post(`/projects/${id}/sign-completion`, {
                          freelancer_remarks: freelancerRemarks
                        });
                        toast.success('Certificate signed successfully. Project is completed!');
                        setIsCertOpen(false);
                        setFreelancerRemarks('');
                        refetch();
                      } catch (err) {
                        toast.error(err.message || 'Failed to sign certificate.');
                      } finally {
                        setIsSigningCert(false);
                      }
                    }}
                    disabled={isSigningCert}
                    className="bg-[#70d64d] hover:bg-[#8ee67b] text-black rounded-[6px] px-5 py-2 text-[0.78rem] font-bold cursor-pointer transition-colors border-none disabled:opacity-50"
                  >
                    {isSigningCert ? 'Signing...' : 'Sign & Complete Project'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
