import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, Clock, Wallet, Check, X, Plus, Users, Award, Edit, Trash2,
  Briefcase, Calendar, Paperclip, Folder, FileText, Tag, ExternalLink,
  UploadCloud
} from 'lucide-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../../utils/api';
import { toast } from 'react-toastify';
import { CompletionBar } from '../AdminShared';
import EditProjectModal from './EditProjectModal';
import MilestoneModal from './MilestoneModal';
import ConfirmDialog from './ConfirmDialog';

const fmtDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—';

export default function ProjectDetailView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(() => searchParams.get('tab') || 'overview');
  const comming_from = searchParams.get('from') || 'all+projects';

  const queryClient = useQueryClient();

  const [confirmConfig, setConfirmConfig] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'confirm',
    variant: 'primary',
    promptPlaceholder: '',
    defaultValue: '',
    onConfirm: () => {},
  });

  const showConfirm = ({
    title,
    message,
    type = 'confirm',
    variant = 'primary',
    confirmText,
    cancelText,
    promptPlaceholder = '',
    defaultValue = '',
    onConfirm,
    onCancel,
  }) => {
    setConfirmConfig({
      isOpen: true,
      title,
      message,
      type,
      variant,
      confirmText,
      cancelText,
      promptPlaceholder,
      defaultValue,
      onConfirm: (val) => {
        if (onConfirm) onConfirm(val);
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const { data: project, isLoading, refetch } = useQuery({
    queryKey: ['admin-project-detail', id],
    queryFn: () => api.get(`/projects/${id}`).then(r => r.project),
    enabled: !!id
  });

  const handleApprove = (appId) => {
    showConfirm({
      title: 'Approve Bid & Assign Project',
      message: 'Are you sure you want to approve this application and assign the project? All other bids will be auto-rejected.',
      onConfirm: async () => {
        try {
          await api.post(`/projects/applications/${appId}/approve`, { remarks: 'Approved from details portal' });
          toast.success('Bid approved and project assigned!');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Approval failed');
        }
      }
    });
  };

  const handleReject = (appId) => {
    showConfirm({
      title: 'Reject Bid',
      message: 'Are you sure you want to reject this bid?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.put(`/projects/applications/${appId}/status`, { status: 'rejected', remarks: 'Rejected from details portal' });
          toast.success('Bid rejected successfully.');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Rejection failed');
        }
      }
    });
  };

  const handleResetAssignment = () => {
    showConfirm({
      title: 'Revoke Project Assignment',
      message: 'This will remove the current assignee, set the project back to "open", and reset all bids to "applied" status so you can approve a different person.',
      variant: 'danger',
      confirmText: 'Revoke Assignment',
      onConfirm: async () => {
        try {
          await api.post(`/projects/${id}/reset-assignment`);
          toast.success('Assignment revoked. Project is now open for re-assignment.');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Failed to reset assignment.');
        }
      }
    });
  };

  const handleChangeBidStatus = (appId, newStatus, label) => {
    showConfirm({
      title: `Change Bid Status to "${label}"`,
      message: `Are you sure you want to change this bid's status to "${label}"?`,
      variant: newStatus === 'rejected' ? 'danger' : 'primary',
      onConfirm: async () => {
        try {
          await api.put(`/projects/applications/${appId}/status`, { status: newStatus, remarks: `Status changed to ${newStatus} from project details` });
          toast.success(`Bid status updated to ${label}.`);
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Failed to update bid status.');
        }
      }
    });
  };

  const handleCompleteMilestone = (milestoneId) => {
    showConfirm({
      title: 'Mark Milestone Completed',
      message: 'Are you sure you want to mark this milestone as completed? This will trigger pending payments.',
      variant: 'success',
      onConfirm: async () => {
        try {
          await api.post(`/projects/milestones/${milestoneId}/complete`);
          toast.success('Milestone marked as completed!');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Action failed');
        }
      }
    });
  };

  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isViewPaymentModalOpen, setIsViewPaymentModalOpen] = useState(false);
  const [paymentDetailsToView, setPaymentDetailsToView] = useState(null);
  const [viewingMilestoneTitle, setViewingMilestoneTitle] = useState('');

  // Disable background scrolling when any modal is open
  useEffect(() => {
    const isAnyModalOpen = isEditProjectOpen || isMilestoneModalOpen || isPaymentModalOpen || isViewPaymentModalOpen;
    if (isAnyModalOpen) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [isEditProjectOpen, isMilestoneModalOpen, isPaymentModalOpen]);


  // Payment form state
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [transactionRef, setTransactionRef] = useState('');
  const [paymentRemarks, setPaymentRemarks] = useState('');
  const [proofFile, setProofFile] = useState(null);

  // Document upload state
  const [isUploadingDoc, setIsUploadingDoc] = useState(false);
  const [docFile, setDocFile] = useState(null);

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    if (!docFile) return;

    const formData = new FormData();
    formData.append('file', docFile);

    setIsUploadingDoc(true);
    try {
      await api.postFile(`/projects/${id}/files`, formData);
      toast.success('Document uploaded successfully!');
      setDocFile(null);
      queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
    } catch (err) {
      toast.error(err.message || 'Failed to upload document.');
    } finally {
      setIsUploadingDoc(false);
    }
  };

  const handleDeleteDocument = (fileId) => {
    showConfirm({
      title: 'Delete Document',
      message: 'Are you sure you want to delete this supporting document?',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/files/${fileId}`);
          toast.success('Document deleted successfully!');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
        } catch (err) {
          toast.error(err.message || 'Failed to delete document.');
        }
      }
    });
  };

  const handleSaveProject = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
    queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
  };

  const handleDeleteProject = () => {
    showConfirm({
      title: 'Delete Project',
      message: 'WARNING: Are you sure you want to delete this project? This will permanently delete the project and all related milestones, assignments, bids, and payments. This action cannot be undone.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/${id}`);
          toast.success('Project deleted successfully.');
          navigate('/admin/projects');
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Failed to delete project.');
        }
      }
    });
  };

  const handleMilestoneSave = async (payload) => {
    const otherMilestones = editingMilestone
      ? (project.milestones || []).filter(m => m.id !== editingMilestone.id)
      : (project.milestones || []);
    const otherBudgetsSum = otherMilestones.reduce((sum, m) => sum + (Number(m.budget || m.amount) || 0), 0);
    const newMilestoneBudget = Number(payload.budget || payload.amount) || 0;
    const totalMilestoneBudget = otherBudgetsSum + newMilestoneBudget;
    const projectBudget = Number(project.budget) || 0;

    const executeSave = async () => {
      try {
        if (editingMilestone) {
          await api.put(`/projects/milestones/${editingMilestone.id}`, payload);
          toast.success('Milestone updated successfully!');
        } else {
          await api.post(`/projects/${id}/milestones`, payload);
          toast.success('Milestone created successfully!');
        }
        setIsMilestoneModalOpen(false);
        setEditingMilestone(null);
        queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
        queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      } catch (err) {
        toast.error(err.message || 'Failed to save milestone.');
      }
    };

    if (totalMilestoneBudget > projectBudget) {
      showConfirm({
        title: 'Budget Validation Warning',
        message: `The sum of milestone budgets ($${totalMilestoneBudget}) exceeds the project budget ($${projectBudget}). Do you want to enforce this budget validation constraint (selecting 'Yes' will block saving so you can edit the budgets, while selecting 'No' will bypass this check and save)?`,
        variant: 'warning',
        confirmText: 'Yes, Enforce & Edit',
        cancelText: 'No, Bypass & Save',
        onConfirm: () => {
          toast.warn('Please adjust the milestone budget.');
        },
        onCancel: () => {
          executeSave();
        }
      });
    } else {
      await executeSave();
    }
  };

  const handleDeleteMilestone = (milestoneId) => {
    showConfirm({
      title: 'Delete Milestone',
      message: 'Are you sure you want to delete this milestone? Associated deliverable submissions and payment logs will be removed.',
      variant: 'danger',
      onConfirm: async () => {
        try {
          await api.delete(`/projects/milestones/${milestoneId}`);
          toast.success('Milestone deleted successfully!');
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Failed to delete milestone.');
        }
      }
    });
  };

  const handleReviewDeliverable = (milestoneId, status) => {
    showConfirm({
      title: `Submit Review Remarks`,
      message: `Please enter review remarks for this milestone ${status === 'approved' ? 'approval' : 'rejection'}:`,
      type: 'prompt',
      promptPlaceholder: 'Enter review remarks...',
      variant: status === 'approved' ? 'success' : 'warning',
      onConfirm: async (comments) => {
        try {
          await api.post(`/projects/milestones/${milestoneId}/review`, { status, comments });
          toast.success(`Milestone deliverable review submitted as ${status}!`);
          queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
          queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
        } catch (err) {
          toast.error(err.message || 'Review submission failed.');
        }
      }
    });
  };

  const handleRecordPaymentSubmit = async (e) => {
    e.preventDefault();
    if (!transactionRef.trim()) {
      toast.error('Transaction reference is required.');
      return;
    }
    const formData = new FormData();
    formData.append('payment_method', paymentMethod);
    formData.append('transaction_reference', transactionRef);
    formData.append('remarks', paymentRemarks);
    if (proofFile) {
      formData.append('proof', proofFile);
    }

    try {
      await api.postFile(`/projects/payments/${selectedPayment.id}/pay`, formData);
      toast.success('Milestone payment recorded successfully!');
      setIsPaymentModalOpen(false);
      setSelectedPayment(null);
      setTransactionRef('');
      setPaymentRemarks('');
      setProofFile(null);
      queryClient.invalidateQueries({ queryKey: ['admin-project-detail', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
    } catch (err) {
      toast.error(err.message || 'Failed to record payment.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-[20px]">
        {/* Back navigation button skeleton */}
        <div className="w-[120px] h-[16px] skeleton-pulse rounded-[4px]" />

        {/* Top Header Card Skeleton */}
        <div className="bg-[#121215] border border-[#23232a]  rounded-[10px] p-[24px] flex flex-col md:flex-row justify-between gap-[20px] items-start md:items-center">
          <div className="flex flex-col gap-3 w-full md:w-2/3">
            <div className="flex items-center gap-[10px] flex-wrap">
              <div className="h-[28px] w-[250px] skeleton-pulse rounded-[6px]" />
              <div className="h-[20px] w-[80px] skeleton-pulse rounded-[4px]" />
            </div>
            <div className="h-[16px] w-[90%] skeleton-pulse rounded-[4px]" />
            <div className="h-[16px] w-[60%] skeleton-pulse rounded-[4px]" />
          </div>
          <div className="flex items-center gap-[12px] flex-wrap shrink-0">
            <div className="h-[32px] w-[70px] skeleton-pulse rounded-[6px]" />
            <div className="h-[22px] w-[80px] skeleton-pulse rounded-[4px]" />
          </div>
        </div>

        {/* Main Section Grid Skeleton */}
        <div className="grid gap-[20px] lg:grid-cols-[1.6fr_0.9fr] items-start">
          
          {/* Main Content Area Skeleton */}
          <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px] flex flex-col gap-[20px]">
            
            {/* Tab Header Selector Skeleton */}
            <div className="flex border-b border-[#23232a] pb-[10px] gap-[10px]">
              <div className="h-[34px] w-[90px] skeleton-pulse rounded-[6px]" />
              <div className="h-[34px] w-[90px] skeleton-pulse rounded-[6px]" />
              <div className="h-[34px] w-[110px] skeleton-pulse rounded-[6px]" />
            </div>

            {/* Metrics cards skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-[16px]">
              <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] h-[72px] flex flex-col justify-between">
                <div className="h-[12px] w-[60px] skeleton-pulse rounded" />
                <div className="h-[16px] w-[80%] skeleton-pulse rounded" />
              </div>
              <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] h-[72px] flex flex-col justify-between">
                <div className="h-[12px] w-[80px] skeleton-pulse rounded" />
                <div className="h-[20px] w-[100px] skeleton-pulse rounded" />
              </div>
              <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] h-[72px] flex flex-col justify-between">
                <div className="h-[12px] w-[70px] skeleton-pulse rounded" />
                <div className="h-[20px] w-[60px] skeleton-pulse rounded" />
              </div>
            </div>

            {/* Content block skeletons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px]">
              <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] flex flex-col gap-3">
                <div className="h-[16px] w-[120px] skeleton-pulse rounded pb-1" />
                <div className="h-[14px] w-[90%] skeleton-pulse rounded" />
                <div className="h-[14px] w-[80%] skeleton-pulse rounded" />
              </div>
              <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] flex flex-col gap-3">
                <div className="h-[16px] w-[150px] skeleton-pulse rounded pb-1" />
                <div className="h-[14px] w-[90%] skeleton-pulse rounded" />
                <div className="h-[14px] w-[70%] skeleton-pulse rounded" />
              </div>
            </div>

          </div>

          {/* Right Sidebar Snapshot info Skeleton */}
          <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px] flex flex-col gap-[20px]">
            <div className="h-[18px] w-[120px] skeleton-pulse rounded-[4px]" />
            <div className="flex flex-col gap-[14px] mt-2">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex justify-between items-center border-b border-[#1a1a22] pb-2 last:border-none">
                  <div className="h-[14px] w-[100px] skeleton-pulse rounded" />
                  <div className="h-[14px] w-[60px] skeleton-pulse rounded" />
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <button 
            onClick={() => navigate('/admin/projects')} 
            className="flex items-center gap-2 text-gray-300 hover:text-white border-none bg-transparent cursor-pointer font-semibold text-[0.85rem] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
        </div>
        <div className="bg-[#121215] border border-[#ef444433] rounded-xl p-6 text-center text-red-500 font-bold max-w-xl mx-auto w-full">
          Project not found.
        </div>
      </div>
    );
  }

  const milestones = project.milestones || [];
  const applications = project.applications || [];
  const assignments = project.assignments || [];

  return (
    <div className="flex flex-col gap-[20px]">
        
        {/* Back navigation & Admin Controls */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <button 
            onClick={() => navigate('/admin/projects')} 
            className="flex items-center gap-2 text-gray-400 hover:text-white border-none bg-transparent cursor-pointer font-semibold text-[0.85rem] transition-colors"
          >
            <ArrowLeft size={16} /> Back to Projects
          </button>
          
          <div className="flex gap-2.5">
            <button
              onClick={() => setIsEditProjectOpen(true)}
              className="bg-[#1a1a20] hover:bg-[#252530] border border-[#2d2d38] text-gray-300 hover:text-white font-bold rounded-[6px] px-3.5 py-2 text-[0.78rem] cursor-pointer flex items-center gap-1.5 transition-colors border-none"
            >
              <Edit size={14} className="text-[#70d64d]" /> Edit Project
            </button>
            <button
              onClick={handleDeleteProject}
              className="bg-[#ef4444]/10 hover:bg-[#ef4444]/20 border border-[#ef4444]/30 text-red-400 font-bold rounded-[6px] px-3.5 py-2 text-[0.78rem] cursor-pointer flex items-center gap-1.5 transition-colors border-none"
            >
              <Trash2 size={14} /> Delete Project
            </button>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-[#121215] border-l-4 border-0  border-[#70d64d]  rounded-[6px] p-[28px] relative">
          <div className="flex flex-col md:flex-row justify-between gap-[20px] items-start md:items-center">
            <div>
              {/* Badges */}
              <div className="flex items-center gap-[8px] flex-wrap">
                <span className="bg-[#202024] border border-[#2d2d34] text-white text-[0.65rem] px-[10px] py-[4px] rounded-[4px] font-bold uppercase tracking-wider">
                  {project.project_type || 'FIXED'}
                </span>
                <span className={`uppercase font-bold text-[0.65rem] px-[10px] py-[4px] rounded-[4px] tracking-wider border ${
                  project.priority === 'high' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {project.priority || 'MEDIUM'} PRIORITY
                </span>
              </div>
              
              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-2 leading-tight">
                {project.title}
              </h1>

              {/* Sub-label/Company */}
              <div className="flex items-center gap-2 text-[#8a8a8a] text-[0.85rem] mt-3">
                <Briefcase size={14} className="text-gray-500" />
                <span className="font-semibold text-gray-300">{project.client || 'Internal Client'}</span>
              </div>
            </div>

            {/* Status indicator */}
            <div className="text-left md:text-right shrink-0">
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
                {project.status === 'completed' ? 'Completed' : project.status === 'assigned' ? 'In Progress' : 'Not Started'}
              </span>
            </div>
          </div>

          {/* summary grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-[#23232a]">
            {/* Budget */}
            <div className="flex items-start gap-3">
              <Wallet className="text-[#8a8a8a] mt-1" size={18} />
              <div>
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Budget</span>
                <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
                  {project.budget ? `₹${Number(project.budget).toLocaleString('en-IN')}` : '₹0'}
                </span>
              </div>
            </div>
            {/* Deadline */}
            <div className="flex items-start gap-3">
              <Calendar className="text-[#8a8a8a] mt-1" size={18} />
              <div>
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Deadline</span>
                <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
                  {fmtDate(project.end_date)}
                </span>
              </div>
            </div>
            {/* Posted On */}
            <div className="flex items-start gap-3">
              <Clock className="text-[#8a8a8a] mt-1" size={18} />
              <div>
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Posted On</span>
                <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
                  {fmtDate(project.created_at)}
                </span>
              </div>
            </div>
            {/* Applicants */}
            <div className="flex items-start gap-3">
              <Users className="text-[#8a8a8a] mt-1" size={18} />
              <div>
                <span className="text-gray-500 text-[0.68rem] font-bold uppercase tracking-wider block">Applicants</span>
                <span className="text-white font-extrabold text-[1.2rem] mt-1 block">
                  {applications.length}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid Layout */}
        <div className="grid gap-[20px] lg:grid-cols-[1.6fr_0.9fr] items-start">
          
          {/* Left Column content */}
          <div className="flex flex-col gap-[20px]">
            
            {/* Project Description Card */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
              <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                <FileText className="text-[#70d64d]" size={18} />
                <h3 className="text-white font-bold text-[1rem] m-0">Project Description</h3>
              </div>
              <div 
                className="text-[#8a8a8a] text-[0.85rem] m-0 leading-relaxed whitespace-pre-wrap rich-text-content"
                dangerouslySetInnerHTML={{ __html: project.description || 'No description available for this project.' }}
              />
            </div>

            {/* Required Skills & Expertise Card */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
              <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                <Tag className="text-[#70d64d]" size={18} />
                <h3 className="text-white font-bold text-[1rem] m-0">Required Skills & Expertise</h3>
              </div>
              {(!project.project_skills || project.project_skills.length === 0) ? (
                <p className="text-gray-500 text-[0.78rem] m-0 italic">No specific skills listed.</p>
              ) : (
                <div className="flex flex-wrap gap-[8px]">
                  {project.project_skills.map(sk => (
                    <span key={sk.id} className="bg-[#202024] border border-[#2d2d34] text-white text-[0.78rem] px-[12px] py-[6px] rounded-[99px] font-medium">
                      {sk.skill_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Deliverables/Tags Card */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
              <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                <Check className="text-[#70d64d]" size={18} />
                <h3 className="text-white font-bold text-[1rem] m-0">Project Deliverables</h3>
              </div>
              {(!project.project_tags || project.project_tags.length === 0) ? (
                <p className="text-gray-500 text-[0.78rem] m-0 italic">No deliverables tags listed.</p>
              ) : (
                <div className="flex flex-wrap gap-[8px]">
                  {project.project_tags.map(t => (
                    <span key={t.id} className="bg-[#182318] border border-[#70d64d]/30 text-[#70d64d] text-[0.78rem] px-[12px] py-[6px] rounded-[99px] font-medium">
                      {t.tag_name}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Supporting Documents Card */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
              <div className="flex items-center justify-between gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                <div className="flex items-center gap-[10px]">
                  <Folder className="text-[#70d64d]" size={18} />
                  <h3 className="text-white font-bold text-[1rem] m-0">Supporting Documents</h3>
                </div>
                
                {/* Upload Form */}
                <form onSubmit={handleUploadDocument} className="flex items-center gap-2">
                  <input 
                    type="file" 
                    id="doc-upload" 
                    className="hidden" 
                    onChange={(e) => setDocFile(e.target.files[0])}
                  />
                  {docFile ? (
                    <div className="flex items-center gap-2">
                      <span className="text-[0.75rem] text-gray-300 truncate max-w-[120px]">{docFile.name}</span>
                      <button 
                        type="submit" 
                        disabled={isUploadingDoc}
                        className="bg-[#70d64d] text-black border-none font-bold rounded-[4px] px-[8px] py-[4px] text-[0.7rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                      >
                        {isUploadingDoc ? 'Uploading...' : 'Save'}
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setDocFile(null)}
                        className="text-red-400 border-none bg-transparent cursor-pointer flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <label 
                      htmlFor="doc-upload"
                      className="bg-[#0c0c0e] border border-[#23232a] text-gray-300 hover:text-white font-bold rounded-[6px] px-[10px] py-[5px] text-[0.72rem] cursor-pointer transition-colors"
                    >
                      + Add File
                    </label>
                  )}
                </form>
              </div>
              
              {(!project.files || project.files.length === 0) ? (
                <p className="text-gray-500 text-[0.78rem] m-0 italic">No supporting documents uploaded.</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {project.files.map(f => (
                    <div key={f.id} className="flex justify-between items-center bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[6px]">
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip size={14} className="text-gray-500 shrink-0" />
                        <a 
                          href={f.file_url} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-white text-[0.8rem] font-semibold hover:text-[#70d64d] hover:underline truncate"
                        >
                          {f.file_name}
                        </a>
                      </div>
                      <button 
                        onClick={() => handleDeleteDocument(f.id)}
                        className="bg-transparent border-none text-[#ef4444] hover:text-red-500 cursor-pointer p-1"
                        title="Delete Document"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Project Milestones Card */}
            <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px] flex flex-col gap-[16px]">
              <div className="flex justify-between items-center border-b border-[#23232a] pb-3">
                <div className="flex items-center gap-[10px]">
                  <Award className="text-[#70d64d]" size={18} />
                  <h2 className="text-white font-bold text-[1rem] m-0">Project Milestones</h2>
                </div>
                <button
                  onClick={() => {
                    setEditingMilestone(null);
                    setIsMilestoneModalOpen(true);
                  }}
                  className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-[14px] py-[7px] text-[0.8rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                >
                  + Add Milestone
                </button>
              </div>

              {milestones.length === 0 ? (
                <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[24px] text-center text-gray-500 text-[0.82rem]">
                  No milestones defined for this project.
                </div>
              ) : (
                <div className="flex flex-col gap-[12px]">
                  {milestones.map((ms) => {
                    // Find payment associated with this milestone
                    const milestonePayment = project.milestone_payments?.find(p => p.milestone_id === ms.id);

                    return (
                      <div key={ms.id} className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] flex flex-col gap-[12px]">
                        <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#1a1a22] pb-2">
                          <div>
                            <span className="text-[#8a8a8a] text-[0.65rem] font-bold uppercase block">Milestone #{ms.milestone_no}</span>
                            <h4 className="text-white font-bold text-[0.9rem] m-0 mt-1">{ms.title}</h4>
                          </div>
                          <div className="text-right">
                            <span className="text-white font-bold text-[0.9rem]">
                              {ms.budget ? `₹${Number(ms.budget).toLocaleString('en-IN')}` : '₹0'}
                            </span>
                            <span className="text-[#8a8a8a] text-[0.68rem] block mt-1">Due: {fmtDate(ms.due_date)}</span>
                          </div>
                        </div>

                        {ms.description ? (
                          <div 
                            className="ql-editor-display text-[#8a8a8a] text-[0.78rem] m-0 leading-relaxed" 
                            dangerouslySetInnerHTML={{ __html: ms.description }} 
                          />
                        ) : (
                          <p className="text-[#8a8a8a] text-[0.78rem] m-0 leading-relaxed">No milestone description provided.</p>
                        )}

                        {/* Deliverables review block if there is deliverable */}
                        {ms.deliverables && ms.deliverables.length > 0 && (
                          <div className="bg-[#121215] border border-[#1a1a22] p-[12px] rounded-[6px] flex flex-col gap-2 mt-2">
                            <span className="text-[#8a8a8a] text-[0.65rem] block uppercase font-bold tracking-[0.5px]">Deliverable Submission</span>
                            {ms.deliverables.map((del) => (
                              <div key={del.id} className="text-[0.78rem] text-gray-300 flex flex-col gap-1 border-b border-[#1c1c20] pb-2 last:border-none last:pb-0">
                                  <div className="flex justify-between items-start">
                                    <span className="font-semibold text-white">{del.title || 'Submission Details'}</span>
                                    <span className="text-gray-500 text-[0.7rem]">{fmtDate(del.submitted_at)}</span>
                                  </div>
                                  {del.description && <p className="text-gray-400 m-0 mt-1">{del.description}</p>}
                                  {del.submission_notes && <p className="text-gray-400 m-0 italic">"{del.submission_notes}"</p>}
                                  
                                  {del.files && del.files.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      <span className="text-gray-500 text-[0.7rem]">Files:</span>
                                      {del.files.map(f => (
                                        <a key={f.id} href={f.file_url} target="_blank" rel="noopener noreferrer" className="text-[#70d64d] text-[0.7rem] hover:underline">
                                          {f.file_name}
                                        </a>
                                      ))}
                                    </div>
                                  )}

                                  <div className="flex justify-between items-center mt-2 flex-wrap gap-2">
                                    <div>
                                      <span className="text-gray-500 text-[0.7rem]">Status: </span>
                                      <span className={`text-[0.7rem] uppercase font-bold ${del.status === 'approved' ? 'text-[#70d64d]' : del.status === 'rejected' ? 'text-red-400' : 'text-amber-400'}`}>
                                        {del.status}
                                      </span>
                                    </div>
                                    
                                    {del.status === 'pending' && (
                                      <div className="flex gap-2">
                                        <button
                                          onClick={() => handleReviewDeliverable(ms.id, 'approved')}
                                          className="bg-[#70d64d]/20 text-[#70d64d] border border-[#70d64d]/30 font-bold rounded-[4px] px-[8px] py-[3px] text-[0.68rem] cursor-pointer hover:bg-[#70d64d]/30"
                                        >
                                          Approve
                                        </button>
                                        <button
                                          onClick={() => handleReviewDeliverable(ms.id, 'rejected')}
                                          className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-[4px] px-[8px] py-[3px] text-[0.68rem] cursor-pointer hover:bg-red-500/30"
                                        >
                                          Reject
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex justify-between items-center flex-wrap gap-3 pt-1">
                            <div className="flex gap-4 items-center">
                              <div className="text-[0.72rem]">
                                <span className="text-gray-500">Status: </span>
                                <span className={`font-semibold uppercase ${ms.status === 'completed' ? 'text-[#70d64d]' : 'text-amber-500'}`}>{ms.status}</span>
                              </div>
                              <div className="text-[0.72rem] flex items-center gap-1.5">
                                <span className="text-gray-500">Payment: </span>
                                <span className={`font-semibold uppercase ${ms.payment_status === 'paid' ? 'text-[#70d64d]' : 'text-gray-400'}`}>{ms.payment_status}</span>
                                {milestonePayment && milestonePayment.status === 'paid' && (
                                  <button
                                    onClick={() => {
                                      setPaymentDetailsToView(milestonePayment);
                                      setViewingMilestoneTitle(ms.title);
                                      setIsViewPaymentModalOpen(true);
                                    }}
                                    className="ml-1 bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-[#70d64d] rounded-[4px] px-[8px] py-[3px] text-[0.68rem] font-bold cursor-pointer transition-colors flex items-center gap-1 hover:border-[#70d64d]/40"
                                  >
                                    <Wallet size={11} /> View Receipt
                                  </button>
                                )}
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingMilestone(ms);
                                  setIsMilestoneModalOpen(true);
                                }}
                                className="bg-[#0c0c0e] border border-[#23232a] text-[#8a8a8a] hover:text-white font-bold rounded-[6px] px-[10px] py-[5px] text-[0.72rem] cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMilestone(ms.id)}
                                className="bg-[#0c0c0e] border border-[#ef444433] text-[#ef4444] hover:bg-[#ef444411] font-bold rounded-[6px] px-[10px] py-[5px] text-[0.72rem] cursor-pointer transition-colors"
                              >
                                Delete
                              </button>
                              
                              {ms.status !== 'completed' && (
                                <button
                                  onClick={() => handleCompleteMilestone(ms.id)}
                                  className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-[12px] py-[5px] text-[0.72rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                                >
                                  Mark Completed
                                </button>
                              )}

                              {milestonePayment && milestonePayment.status === 'pending' && (
                                <button
                                  onClick={() => {
                                    setSelectedPayment(milestonePayment);
                                    setIsPaymentModalOpen(true);
                                  }}
                                  className="bg-amber-500 text-black border-none font-bold rounded-[6px] px-[12px] py-[5px] text-[0.72rem] cursor-pointer hover:bg-amber-600 transition-colors"
                                >
                                  Record Payment
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Bids / Applications Card */}
              <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
                <div className="border-b border-[#23232a] pb-3 mb-4 flex items-center gap-[10px]">
                  <Users className="text-[#70d64d]" size={18} />
                  <h2 className="text-white font-bold text-[1rem] m-0">Incoming Bids / Applications</h2>
                </div>

                {applications.length === 0 ? (
                  <div className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[24px] text-center text-gray-500 text-[0.82rem]">
                    No applications submitted yet.
                  </div>
                ) : (
                  <div className="flex flex-col gap-[12px]">
                    {applications.map((app) => (
                      <div key={app.id} className="bg-[#0c0c0e] border border-[#23232a] rounded-[8px] p-[16px] flex flex-col gap-[10px]">
                        <div className="flex justify-between items-start flex-wrap gap-2 border-b border-[#1a1a22] pb-2">
                          <div >
                            <Link to={`/admin/users/${app.applicant?.id}/profile?from=Project+Applications`} className="cursor-pointer group" >
                            <p className="text-white font-bold text-[0.88rem] group-hover:text-[#70d64d] transition-colors">{app.applicant?.full_name || 'Anonymous User'}</p>
                            </Link>
                            <p className="text-[#8a8a8a] text-[0.72rem] block mt-[2px]">{app.applicant?.email}</p>
                          </div>
                          <div className="text-right">
                            <span className="text-[#70d64d] font-bold text-[0.9rem] block">
                              {app.bid_amount ? `₹${Number(app.bid_amount).toLocaleString('en-IN')}` : '—'}
                            </span>
                            <span className="text-[#8a8a8a] text-[0.68rem] block mt-[2px]">{app.estimated_days || '—'} days delivery</span>
                          </div>
                        </div>

                        {app.proposal && (
                          <div className="bg-[#121215] border border-[#1a1a22] p-[10px] rounded-[6px]">
                            <span className="text-[#8a8a8a] text-[0.62rem] block uppercase font-bold tracking-[0.5px] mb-1">Proposal</span>
                            <p className="text-[#8a8a8a] text-[0.78rem] m-0 leading-relaxed italic">"{app.proposal}"</p>
                          </div>
                        )}

                        <div className="flex justify-between items-center flex-wrap gap-3 pt-2">
                          <div className="flex gap-[12px] items-center">
                            <span className="text-[0.72rem] text-gray-500">
                              Applicant Role: <span className="capitalize text-white font-semibold">{app.applicant?.role}</span>
                            </span>
                            <span className={`text-[0.65rem] font-bold px-[8px] py-[3px] rounded-[4px] uppercase ${
                              app.status === 'accepted' ? 'bg-[#70d64d]/10 text-[#70d64d]' : app.status === 'rejected' ? 'bg-red-500/10 text-red-400' : app.status === 'shortlisted' ? 'bg-amber-500/10 text-amber-400' : 'bg-sky-500/10 text-sky-400'
                            }`}>
                              {app.status}
                            </span>
                          </div>

                          <div className="flex gap-[8px] flex-wrap">
                            {/* Pending / Applied bids: Approve & Reject */}
                            {(app.status === 'pending' || app.status === 'applied' || app.status === 'reviewed') && (
                              <>
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                                >
                                  Approve & Assign
                                </button>
                                <button
                                  onClick={() => handleChangeBidStatus(app.id, 'shortlisted', 'Shortlisted')}
                                  className="bg-amber-500/20 text-amber-400 border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-amber-500/30 transition-colors"
                                >
                                  Shortlist
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  className="bg-[#ef444433] text-[#ef4444] border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-[#ef444455] transition-colors"
                                >
                                  Reject
                                </button>
                              </>
                            )}

                            {/* Accepted bids: Revoke Assignment */}
                            {app.status === 'accepted' && (
                              <button
                                onClick={() => handleResetAssignment()}
                                className="bg-[#ef444433] text-[#ef4444] border border-[#ef4444]/30 font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-[#ef444455] transition-colors"
                              >
                                Revoke Assignment
                              </button>
                            )}

                            {/* Rejected bids: Reset to Pending or Shortlist */}
                            {app.status === 'rejected' && (
                              <>
                                <button
                                  onClick={() => handleChangeBidStatus(app.id, 'pending', 'Pending')}
                                  className="bg-sky-500/20 text-sky-400 border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-sky-500/30 transition-colors"
                                >
                                  Reset to Pending
                                </button>
                                <button
                                  onClick={() => handleChangeBidStatus(app.id, 'shortlisted', 'Shortlisted')}
                                  className="bg-amber-500/20 text-amber-400 border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-amber-500/30 transition-colors"
                                >
                                  Shortlist
                                </button>
                              </>
                            )}

                            {/* Shortlisted bids: Approve, Reject, or Reset */}
                            {app.status === 'shortlisted' && (
                              <>
                                <button
                                  onClick={() => handleApprove(app.id)}
                                  className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                                >
                                  Approve & Assign
                                </button>
                                <button
                                  onClick={() => handleReject(app.id)}
                                  className="bg-[#ef444433] text-[#ef4444] border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-[#ef444455] transition-colors"
                                >
                                  Reject
                                </button>
                                <button
                                  onClick={() => handleChangeBidStatus(app.id, 'pending', 'Pending')}
                                  className="bg-gray-500/20 text-gray-400 border-none font-bold rounded-[6px] px-[12px] py-[6px] text-[0.72rem] cursor-pointer hover:bg-gray-500/30 transition-colors"
                                >
                                  Reset Decision
                                </button>
                              </>
                            )}
                          </div>
                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column content */}
            <div className="flex flex-col gap-[20px]">
              
              {/* Overall Progress Card */}
              <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
                <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                  <Award className="text-[#70d64d]" size={18} />
                  <h3 className="text-white font-bold text-[1rem] m-0">Overall Progress</h3>
                </div>
                <div className="mb-4">
                  <CompletionBar value={project.progress_percentage || 0} label="Completion" />
                </div>
                <p className="text-gray-500 text-[0.75rem] m-0 mt-2 leading-relaxed">
                  This progress bar indicates the current stage of the project based on completed milestones.
                </p>
              </div>

              {/* Assigned Members Card */}
              <div className="bg-[#121215] border border-[#23232a] rounded-[10px] p-[24px]">
                <div className="flex items-center gap-[10px] mb-4 border-b border-[#23232a] pb-3">
                  <Users className="text-[#70d64d]" size={18} />
                  <h3 className="text-white font-bold text-[1rem] m-0">Assigned Members</h3>
                </div>
                {assignments.length === 0 ? (
                  <p className="text-gray-500 text-[0.78rem] m-0 italic">No assigned members yet. Review bids under Bids / Applications card.</p>
                ) : (
                  <div className="flex flex-col gap-[8px]">
                    {assignments.map(as => (
                      <div key={as.id} className="flex flex-col gap-1 border-b border-[#1a1a22] pb-2 last:border-none last:pb-0">
                        {as.assigned_to ? (
                          <Link 
                            to={`/admin/users/${as.assigned_to.id}/profile?from=Assigned+Project`}
                            className="text-white hover:text-[#70d64d] font-semibold text-[0.85rem] flex items-center gap-1.5 transition-colors no-underline"
                          >
                            {as.assigned_to.full_name}
                            <ExternalLink size={12} className="text-gray-400" />
                          </Link>
                        ) : (
                          <span className="text-white font-semibold text-[0.85rem]">Unknown Member</span>
                        )}
                        <span className="text-[#8a8a8a] text-[0.75rem]">{as.assigned_to?.email || '—'}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

        </div>

        {/* Modal: Edit Project */}
        {isEditProjectOpen && (
          <EditProjectModal
            project={project}
            onClose={() => setIsEditProjectOpen(false)}
            onSave={handleSaveProject}
          />
        )}

        {/* Modal: Milestone Add/Edit */}
        {isMilestoneModalOpen && (
          <MilestoneModal
            milestone={editingMilestone}
            projectBudget={project.budget}
            existingMilestones={project.milestones || []}
            onClose={() => {
              setIsMilestoneModalOpen(false);
              setEditingMilestone(null);
            }}
            onSave={handleMilestoneSave}
          />
        )}

        {/* Modal: Record Payment */}
        {isPaymentModalOpen && selectedPayment && (
          <>
            <div onClick={() => { setIsPaymentModalOpen(false); setSelectedPayment(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[800]" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[500px] max-h-[90vh] bg-[#121215] border border-[#23232a] rounded-[16px] shadow-2xl z-[801] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#23232a] bg-[#0c0c0e] shrink-0">
                <div>
                  <h3 className="text-white font-extrabold text-[1.1rem] m-0">Record Milestone Payment</h3>
                  <p className="text-gray-500 text-[0.75rem] m-0 mt-1">Enter payment release and transaction details.</p>
                </div>
                <button onClick={() => { setIsPaymentModalOpen(false); setSelectedPayment(null); }} className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer p-1"><X size={18} /></button>
              </div>
              <form onSubmit={handleRecordPaymentSubmit} className="p-5 flex flex-col gap-4 m-0 overflow-y-auto flex-1">
                <div className="flex items-center gap-3 bg-[#182318] border border-[#70d64d]/20 px-4 py-3.5 rounded-[10px]">
                  <div className="bg-[#70d64d]/10 p-2 rounded-[8px]">
                    <Wallet className="text-[#70d64d]" size={20} />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-400 text-[0.75rem] uppercase font-bold tracking-[0.5px] block">Amount to Release</span>
                    <span className="text-[1.35rem] text-[#70d64d] font-black leading-none block mt-1">₹{Number(selectedPayment.amount).toLocaleString('en-IN')}</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-[0.78rem] font-semibold">Payment Method *</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors cursor-pointer"
                  >
                    <option value="bank_transfer">Bank Transfer (NEFT/RTGS/IMPS)</option>
                    <option value="upi">UPI (GPay/PhonePe/etc)</option>
                    <option value="cash">Cash Payment</option>
                    <option value="card">Credit/Debit Card</option>
                    <option value="other">Other Payment Mode</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-[0.78rem] font-semibold">Transaction Reference ID *</label>
                  <input
                    type="text"
                    required
                    value={transactionRef}
                    onChange={(e) => setTransactionRef(e.target.value)}
                    placeholder="Enter transaction reference code..."
                    className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none focus:border-[#70d64d] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-[0.78rem] font-semibold">Payment Remarks</label>
                  <textarea
                    value={paymentRemarks}
                    onChange={(e) => setPaymentRemarks(e.target.value)}
                    placeholder="Add optional notes, remarks or details..."
                    rows={3}
                    className="bg-[#0c0c0e] border border-[#23232a] text-white rounded-[6px] px-3 py-2.5 text-[0.85rem] outline-none resize-none focus:border-[#70d64d] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-gray-400 text-[0.78rem] font-semibold">Payment Proof / Receipt <span className="text-gray-600 font-normal">(Optional)</span></label>
                  <label className="flex items-center justify-center flex-col gap-2 bg-[#0c0c0e] border border-dashed border-[#23232a] hover:border-[#70d64d]/40 rounded-[8px] p-5 cursor-pointer transition-colors group">
                    <input
                      type="file"
                      onChange={(e) => setProofFile(e.target.files[0])}
                      className="hidden"
                    />
                    {proofFile ? (
                      <div className="flex items-center gap-2 text-[#70d64d]">
                        <FileText size={20} />
                        <span className="text-[0.82rem] font-bold truncate max-w-[240px]">{proofFile.name}</span>
                        <span className="text-gray-500 text-[0.72rem]">({(proofFile.size / 1024).toFixed(1)} KB)</span>
                      </div>
                    ) : (
                      <>
                        <UploadCloud size={24} className="text-gray-500 group-hover:text-gray-300 transition-colors" />
                        <span className="text-gray-400 text-[0.8rem] font-medium group-hover:text-gray-200 transition-colors">Select payment receipt or PDF proof</span>
                        <span className="text-gray-600 text-[0.7rem]">PDF, JPG, PNG, WEBP</span>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex justify-end gap-3 border-t border-[#23232a] pt-4 mt-2">
                  <button
                    type="button"
                    onClick={() => { setIsPaymentModalOpen(false); setSelectedPayment(null); setProofFile(null); }}
                    className="bg-transparent border border-[#23232a] text-gray-300 hover:text-white rounded-[6px] px-5 py-2.5 text-[0.8rem] cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-[#70d64d] text-black border-none font-bold rounded-[6px] px-6 py-2.5 text-[0.8rem] cursor-pointer hover:bg-[#8ee67b] transition-colors"
                  >
                    Record Payment
                  </button>
                </div>
              </form>
            </div>
          </>
        )}

        {/* Modal: View Payment Details */}
        {isViewPaymentModalOpen && paymentDetailsToView && (
          <>
            <div onClick={() => { setIsViewPaymentModalOpen(false); setPaymentDetailsToView(null); }} className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[800]" />
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[92vw] max-w-[500px] max-h-[90vh] bg-[#121215] border border-[#23232a] rounded-[16px] shadow-2xl z-[801] flex flex-col overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-[#23232a] bg-[#0c0c0e] shrink-0">
                <div>
                  <h3 className="text-white font-extrabold text-[1.1rem] m-0">Payment Receipt</h3>
                  <p className="text-gray-500 text-[0.75rem] m-0 mt-1">Transaction proof and release logs for milestone.</p>
                </div>
                <button onClick={() => { setIsViewPaymentModalOpen(false); setPaymentDetailsToView(null); }} className="text-gray-400 hover:text-white border-none bg-transparent cursor-pointer p-1"><X size={18} /></button>
              </div>
              <div className="p-5 flex flex-col gap-4 m-0 overflow-y-auto flex-1 text-[0.85rem] text-gray-300">
                {/* Milestone Details */}
                <div>
                  <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">Milestone</span>
                  <span className="text-white font-bold text-[0.95rem] block mt-0.5">{viewingMilestoneTitle}</span>
                </div>

                {/* Amount Released */}
                <div className="flex items-center gap-3 bg-[#182318] border border-[#70d64d]/20 px-4 py-3 rounded-[10px]">
                  <div className="bg-[#70d64d]/10 p-2 rounded-[8px]">
                    <Wallet className="text-[#70d64d]" size={18} />
                  </div>
                  <div className="flex-1">
                    <span className="text-gray-400 text-[0.7rem] uppercase font-bold tracking-[0.5px] block">Amount Paid</span>
                    <span className="text-[1.25rem] text-[#70d64d] font-black leading-none block mt-0.5">₹{Number(paymentDetailsToView.amount).toLocaleString('en-IN')}</span>
                  </div>
                  <span className="bg-[#70d64d]/10 text-[#70d64d] border border-[#70d64d]/30 text-[0.65rem] font-bold px-[8px] py-[3px] rounded-[4px] uppercase tracking-wider">
                    Paid
                  </span>
                </div>

                {/* Info Fields Grid */}
                <div className="grid grid-cols-2 gap-4 bg-[#0c0c0e] border border-[#23232a] p-4 rounded-[10px]">
                  <div>
                    <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">Method</span>
                    <span className="text-white font-semibold block mt-0.5 capitalize">{paymentDetailsToView.payment_method?.replace('_', ' ')}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">Ref Number</span>
                    <span className="text-white font-mono font-semibold block mt-0.5 select-all">{paymentDetailsToView.transaction_reference}</span>
                  </div>
                  <div className="col-span-2 border-t border-[#1a1a22] pt-3 mt-1">
                    <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px] block">Released On</span>
                    <span className="text-white font-semibold block mt-0.5">{fmtDate(paymentDetailsToView.payment_date)}</span>
                  </div>
                </div>

                {/* Remarks */}
                {paymentDetailsToView.remarks && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">Payment Remarks</span>
                    <div className="bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[8px] text-gray-400 italic">
                      "{paymentDetailsToView.remarks}"
                    </div>
                  </div>
                )}

                {/* Receipt Upload / Proofs */}
                {paymentDetailsToView.milestone_payment_proofs && paymentDetailsToView.milestone_payment_proofs.length > 0 ? (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500 text-[0.68rem] uppercase font-bold tracking-[0.5px]">Receipt / Proof Attachment</span>
                    <div className="flex flex-col gap-2">
                      {paymentDetailsToView.milestone_payment_proofs.map(proof => {
                        const isImg = proof.file_type?.startsWith('image/') || 
                                      ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(proof.file_name.split('.').pop().toLowerCase());
                        return (
                          <div key={proof.id} className="flex flex-col gap-2 bg-[#0c0c0e] border border-[#23232a] p-3 rounded-[8px]">
                            <div className="flex justify-between items-center gap-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <Paperclip size={14} className="text-gray-500 shrink-0" />
                                <span className="text-white text-[0.8rem] font-semibold truncate" title={proof.file_name}>
                                  {proof.file_name}
                                </span>
                              </div>
                              <a 
                                href={proof.file_url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 hover:text-white rounded-[6px] px-3 py-1.5 text-[0.7rem] font-bold cursor-pointer transition-colors no-underline shrink-0"
                              >
                                View File
                              </a>
                            </div>
                            {isImg && (
                              <div className="mt-1 border border-[#23232a] rounded-[6px] overflow-hidden bg-[#000] flex justify-center max-h-[180px]">
                                <img 
                                  src={proof.file_url} 
                                  alt={proof.file_name} 
                                  className="object-contain max-w-full max-h-[180px]" 
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-gray-500 text-[0.75rem] italic">No receipt file attached.</div>
                )}

                <div className="flex justify-end border-t border-[#23232a] pt-4 mt-2">
                  <button
                    onClick={() => { setIsViewPaymentModalOpen(false); setPaymentDetailsToView(null); }}
                    className="bg-[#202024] hover:bg-[#2d2d34] border border-[#2d2d34] text-gray-300 hover:text-white rounded-[6px] px-5 py-2 text-[0.78rem] font-bold cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

      <ConfirmDialog
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
        variant={confirmConfig.variant}
        confirmText={confirmConfig.confirmText}
        cancelText={confirmConfig.cancelText}
        promptPlaceholder={confirmConfig.promptPlaceholder}
        defaultValue={confirmConfig.defaultValue}
        onConfirm={confirmConfig.onConfirm}
        onCancel={confirmConfig.onCancel || (() => setConfirmConfig(prev => ({ ...prev, isOpen: false })))}
      />

    </div>
  );
}
