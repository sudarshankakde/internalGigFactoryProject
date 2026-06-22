import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Upload, X, Loader, Paperclip } from 'lucide-react';
import { api } from '../../utils/api';

export default function SubmitDeliverableModal({ milestone, deliverableToEdit, onClose, onSubmitted }) {
  const [title, setTitle] = useState(deliverableToEdit ? deliverableToEdit.title : `Deliverable for Milestone ${milestone.milestone_no}`);
  const [description, setDescription] = useState(deliverableToEdit ? deliverableToEdit.description : '');
  const [submissionNotes, setSubmissionNotes] = useState(deliverableToEdit ? (deliverableToEdit.submission_notes || '') : '');
  
  // Validation Errors State
  const [errors, setErrors] = useState({ title: '', description: '' });

  // Pre-existing files and deleted file IDs tracking (for Edit Mode)
  const [existingFiles, setExistingFiles] = useState(deliverableToEdit ? (deliverableToEdit.files || []) : []);
  const [deleteFileIds, setDeleteFileIds] = useState([]);

  // Multiple New Files Upload State
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleTitleBlur = () => {
    if (!title.trim()) {
      setErrors(prev => ({ ...prev, title: 'Deliverable title is required.' }));
    } else {
      setErrors(prev => ({ ...prev, title: '' }));
    }
  };

  const handleDescriptionBlur = () => {
    if (!description.trim()) {
      setErrors(prev => ({ ...prev, description: 'Description is required.' }));
    } else if (description.trim().length < 10) {
      setErrors(prev => ({ ...prev, description: 'Description must be at least 10 characters long.' }));
    } else {
      setErrors(prev => ({ ...prev, description: '' }));
    }
  };

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newFiles = Array.from(e.dataTransfer.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleRemoveExistingFile = (fileId) => {
    setExistingFiles(prev => prev.filter(f => f.id !== fileId));
    setDeleteFileIds(prev => [...prev, fileId]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation
    let hasErrors = false;
    const currentErrors = { title: '', description: '' };

    if (!title.trim()) {
      currentErrors.title = 'Deliverable title is required.';
      hasErrors = true;
    }

    if (!description.trim()) {
      currentErrors.description = 'Description is required.';
      hasErrors = true;
    } else if (description.trim().length < 10) {
      currentErrors.description = 'Description must be at least 10 characters long.';
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(currentErrors);
      return toast.error('Please correct the validation errors before submitting.');
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('submission_notes', submissionNotes);
      
      if (deliverableToEdit) {
        formData.append('deleteFileIds', JSON.stringify(deleteFileIds));
      }
      
      files.forEach((file) => {
        formData.append('files', file);
      });

      if (deliverableToEdit) {
        await api.putFile(`/projects/milestones/deliverables/${deliverableToEdit.id}`, formData);
        toast.success('Deliverable updated and resubmitted successfully!');
      } else {
        await api.postFile(`/projects/milestones/${milestone.id}/deliverables`, formData);
        toast.success('Deliverable submitted successfully!');
      }
      
      if (onSubmitted) {
        onSubmitted();
      }
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to submit deliverable.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose} 
        className="fixed inset-0 bg-black/80 backdrop-blur-[4px] z-[9998] transition-opacity duration-150" 
      />
      
      {/* Modal Container */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg bg-[#0c0c0e] border border-[#23232a] rounded-[10px] p-6 md:p-8 z-[9999] shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <header className="flex justify-between items-start mb-6">
          <div className="space-y-1 min-w-0 pr-6">
            <h3 className="text-lg font-bold text-white tracking-tight">
              {deliverableToEdit ? 'Edit Milestone Deliverable' : 'Submit Milestone Deliverable'}
            </h3>
            <p className="text-xs text-gray-500 truncate">Milestone #{milestone.milestone_no}: {milestone.title}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-white border border-[#23232a] rounded-[6px] p-1.5 transition-all duration-150 bg-transparent cursor-pointer" 
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-xs font-bold text-gray-400">Deliverable Title *</label>
            <input 
              type="text" 
              id="title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title) setErrors(prev => ({ ...prev, title: '' }));
              }}
              onBlur={handleTitleBlur}
              placeholder="e.g. Completed initial design screens"
              className={`w-full bg-[#121214] border ${errors.title ? 'border-red-500/80 focus:border-red-500' : 'border-[#23232a] focus:border-[#70d64d]'} text-white rounded-[6px] py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#70d64d]/10 transition-all duration-150`}
              required
            />
            {errors.title && <span className="text-red-400 text-[10px] font-semibold mt-0.5">{errors.title}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-xs font-bold text-gray-400">Description of Work *</label>
            <textarea 
              id="description"
              rows={4}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
              }}
              onBlur={handleDescriptionBlur}
              placeholder="Explain in detail what has been built, fixed, or delivered..."
              className={`w-full bg-[#121214] border ${errors.description ? 'border-red-500/80 focus:border-red-500' : 'border-[#23232a] focus:border-[#70d64d]'} text-white rounded-[6px] py-3 px-4 text-sm outline-none focus:ring-2 focus:ring-[#70d64d]/10 transition-all duration-150 resize-none`}
              required
            />
            {errors.description && <span className="text-red-400 text-[10px] font-semibold mt-0.5">{errors.description}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="submissionNotes" className="text-xs font-bold text-gray-400">Submission Notes (Optional)</label>
            <textarea 
              id="submissionNotes"
              rows={3}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="E.g. URLs, access credentials, deployment links, or any notes for review..."
              className="w-full bg-[#121214] border border-[#23232a] text-white rounded-[6px] py-3 px-4 text-sm outline-none focus:border-[#70d64d] focus:ring-2 focus:ring-[#70d64d]/10 transition-all duration-150 resize-none"
            />
          </div>

          {/* Existing Files for Edit Mode */}
          {existingFiles.length > 0 && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 font-semibold uppercase tracking-wider block">Existing Attachments ({existingFiles.length})</label>
              <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                {existingFiles.map((file) => (
                  <div key={file.id} className="bg-[#121214] border border-[#1e1e24] rounded-[6px] p-2.5 flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0 pr-4">
                      <Paperclip size={12} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-300 font-semibold truncate">{file.file_name}</span>
                      {file.file_size && (
                        <span className="text-[10px] text-gray-500 shrink-0">({(Number(file.file_size) / 1024 / 1024).toFixed(2)} MB)</span>
                      )}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => handleRemoveExistingFile(file.id)} 
                      className="text-gray-500 hover:text-red-400 p-1 transition bg-transparent border-none cursor-pointer"
                      aria-label="Remove attachment"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Files Upload */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-gray-400">
              {deliverableToEdit ? 'Attach New Files (Optional)' : 'Deliverable Files (Optional)'}
            </label>
            <div 
              className={`dropzone-container border border-dashed rounded-[6px] p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[110px] ${
                isDragActive ? 'border-[#70d64d] bg-[#70d64d]/5' : 'border-[#23232a] bg-[#121214] hover:border-white/20'
              }`}
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current && fileInputRef.current.click()}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                multiple
                className="hidden"
              />
              <Upload size={20} className="text-[#70d64d] mb-1" />
              <span className="text-xs text-gray-400">
                Drag &amp; drop files here, or <span className="text-[#70d64d] font-semibold hover:underline">browse</span>
              </span>
              <span className="text-[10px] text-gray-500 mt-1">Select one or more deliverable files</span>
            </div>

            {/* List of files selected */}
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">New files to upload ({files.length}):</span>
                <div className="max-h-[150px] overflow-y-auto space-y-2 pr-1">
                  {files.map((file, idx) => (
                    <div key={idx} className="bg-[#121214] border border-[#1e1e24] rounded-[6px] p-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-2 min-w-0 pr-4">
                        <Paperclip size={12} className="text-gray-400 shrink-0" />
                        <span className="text-xs text-gray-300 font-semibold truncate">{file.name}</span>
                        <span className="text-[10px] text-gray-500 shrink-0">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => handleRemoveFile(idx)} 
                        className="text-gray-500 hover:text-red-400 p-1 transition bg-transparent border-none cursor-pointer"
                        aria-label="Remove attachment"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end items-center gap-3 pt-3 border-t border-[#1e1e24]">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-transparent border border-[#23232a] hover:bg-white/5 hover:border-gray-500 text-white font-bold px-5 py-2.5 rounded-[6px] text-xs transition duration-150 cursor-pointer"
              disabled={submitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="bg-[#70d64d] text-black hover:bg-[#60c43d] font-bold px-5 py-2.5 rounded-[6px] text-xs flex items-center gap-1.5 shadow-[0_4px_12px_rgba(112,214,77,0.2)] disabled:opacity-50 transition duration-150 cursor-pointer"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader size={14} className="animate-spin" /> Submitting...
                </>
              ) : (deliverableToEdit ? 'Update & Submit' : 'Submit Deliverable')}
            </button>
          </div>

        </form>
      </div>
    </>
  );
}
