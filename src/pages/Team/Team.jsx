import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Search, Plus, Users } from 'lucide-react';
import * as yup from 'yup';
import { api } from '../../utils/api';
import './Team.css';

// Import subcomponents
import { MemberCard } from '../../components/Team/MemberCard';
import { AddMemberModal } from '../../components/Team/AddMemberModal';
import { EditMemberModal } from '../../components/Team/EditMemberModal';
import { DeleteMemberModal } from '../../components/Team/DeleteMemberModal';

const addMemberSchema = yup.object().shape({
  email: yup.string().email('Please enter a valid email address').required('Email address is required'),
  fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  designation: yup.string().required('Designation is required'),
  mobile: yup.string()
    .matches(/^[0-9+\(\)#\.\s\-]*$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
  resumeFile: yup.mixed().required('Please upload a resume file'),
});

const editMemberSchema = yup.object().shape({
  fullName: yup.string().min(2, 'Full name must be at least 2 characters').required('Full name is required'),
  designation: yup.string().required('Designation is required'),
  mobile: yup.string()
    .matches(/^[0-9+\(\)#\.\s\-]*$/, 'Please enter a valid phone number')
    .min(10, 'Phone number must be at least 10 digits')
    .required('Phone number is required'),
});

const TeamSkeleton = () => (
  <div className="team-grid">
    {[1, 2, 3, 4].map((i) => (
      <div key={i} className="member-card">
        <div className="member-card-header">
          <div className="member-avatar skeleton-pulse" style={{ border: 'none', background: '#1c1c22' }} />
          <div className="member-identity" style={{ width: '100%', gap: '8px' }}>
            <div className="skeleton-pulse" style={{ width: '60%', height: '16px', borderRadius: '4px' }} />
            <div className="skeleton-pulse" style={{ width: '40%', height: '12px', borderRadius: '4px' }} />
          </div>
        </div>
        <div className="member-details-list" style={{ gap: '12px' }}>
          <div className="skeleton-pulse" style={{ width: '85%', height: '12px', borderRadius: '4px' }} />
          <div className="skeleton-pulse" style={{ width: '70%', height: '12px', borderRadius: '4px' }} />
          <div className="skeleton-pulse" style={{ width: '50%', height: '12px', borderRadius: '4px' }} />
        </div>
        <div className="member-card-actions">
          <div className="skeleton-pulse" style={{ width: '60px', height: '28px', borderRadius: '4px' }} />
          <div className="skeleton-pulse" style={{ width: '70px', height: '28px', borderRadius: '4px' }} />
        </div>
      </div>
    ))}
  </div>
);

export const Team = () => {
  const [team, setTeam] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dSearchQuery, setDSearchQuery] = useState('');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Form states
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({ email: '', fullName: '', designation: '', mobile: '', resumeFile: null });
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);

  // Search input debouncer (350ms delay)
  useEffect(() => {
    const t = setTimeout(() => setDSearchQuery(searchQuery), 350);
    return () => clearTimeout(t);
  }, [searchQuery]);

  const handleResumeChange = (e) => {
    const file = e.target.files[0] || null;
    setFormData(prev => ({ ...prev, resumeFile: file }));
  };

  const fetchTeam = async () => {
    try {
      setIsLoading(true);
      const res = await api.get('/profiles/agency/team');
      if (res.success) {
        setTeam(res.team || []);
      } else {
        toast.error(res.message || 'Failed to fetch team members.');
      }
    } catch (err) {
      toast.error(err.message || 'Error fetching team members.');
      setTeam([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Modal open scroll locking
  useEffect(() => {
    if (isAddModalOpen || isEditModalOpen || isDeleteModalOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isAddModalOpen, isEditModalOpen, isDeleteModalOpen]);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    try {
      await addMemberSchema.validate(formData, { abortEarly: false });
    } catch (err) {
      if (err.name === 'ValidationError') {
        toast.warn(err.errors[0]);
      } else {
        toast.error(err.message || 'Validation error');
      }
      return;
    }

    try {
      setIsSaving(true);

      const payload = new FormData();
      payload.append('email', formData.email);
      payload.append('fullName', formData.fullName);
      payload.append('designation', formData.designation);
      payload.append('mobile', formData.mobile);
      payload.append('resume', formData.resumeFile);

      const res = await api.postFile('/profiles/agency/team', payload);
      if (res.success) {
        toast.success(res.message || 'Team member added successfully!');
        setIsAddModalOpen(false);
        setFormData({ email: '', fullName: '', designation: '', mobile: '', resumeFile: null });
        fetchTeam();
      } else {
        toast.error(res.message || 'Failed to add member.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to add member.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEditResumeChange = (e) => {
    const file = e.target.files[0] || null;
    setEditingMember(prev => ({ ...prev, resumeFile: file }));
  };

  const handleEditClick = (member) => {
    setEditingMember({
      id: member.id,
      email: member.email || '',
      fullName: member.full_name || '',
      mobile: member.mobile || '',
      designation: member.designation || '',
      resumeFile: null,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await editMemberSchema.validate(editingMember, { abortEarly: false });
    } catch (err) {
      if (err.name === 'ValidationError') {
        toast.warn(err.errors[0]);
      } else {
        toast.error(err.message || 'Validation error');
      }
      return;
    }

    try {
      setIsSaving(true);

      const payload = new FormData();
      payload.append('fullName', editingMember.fullName);
      payload.append('mobile', editingMember.mobile);
      payload.append('designation', editingMember.designation);
      if (editingMember.resumeFile) {
        payload.append('resume', editingMember.resumeFile);
      }

      const res = await api.putFile(`/profiles/agency/team/${editingMember.id}`, payload);
      if (res.success) {
        toast.success(res.message || 'Team member updated successfully!');
        setIsEditModalOpen(false);
        setEditingMember(null);
        fetchTeam();
      } else {
        toast.error(res.message || 'Failed to update member.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update member.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClick = (member) => {
    setDeletingMember(member);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      const res = await api.delete(`/profiles/agency/team/${deletingMember.id}`);
      if (res.success) {
        toast.success(res.message || 'Team member removed successfully.');
        setIsDeleteModalOpen(false);
        setDeletingMember(null);
        fetchTeam();
      } else {
        toast.error(res.message || 'Failed to remove member.');
      }
    } catch (err) {
      toast.error(err.message || 'Failed to remove member.');
    } finally {
      setIsSaving(false);
    }
  };

  const filteredTeam = team.filter((member) => {
    const searchLower = dSearchQuery.toLowerCase();
    const fullName = member.full_name?.toLowerCase() || '';
    const email = member.email?.toLowerCase() || '';
    const designation = member.designation?.toLowerCase() || '';
    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      designation.includes(searchLower)
    );
  });

  return (
    <div className="team-container animate-fade-in">
      <div className="team-header-panel">
        <div className="team-header-info">
          <h1>Agency Team Members</h1>
          <p>View, invite, and manage roles for your agency's professional workforce.</p>
        </div>
        <button className="add-member-btn" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} />
          <span>Add Team Member</span>
        </button>
      </div>

      <div className="team-controls-bar">
        <div className="search-input-wrapper">
          <Search size={18} />
          <input
            type="text"
            className="search-input-field"
            placeholder="Search by name, email, or designation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {isLoading ? (
        <TeamSkeleton />
      ) : filteredTeam.length === 0 ? (
        <div className="team-empty-placeholder">
          <div className="empty-icon-wrap">
            <Users size={28} />
          </div>
          <h3>No team members found</h3>
          <p>
            {searchQuery
              ? "No team members matched your search criteria. Try a different query."
              : "Get started by adding your first developer, manager, or creator to the agency team."}
          </p>
          {!searchQuery && (
            <button className="add-member-btn" style={{ marginTop: '12px' }} onClick={() => setIsAddModalOpen(true)}>
              <Plus size={18} />
              <span>Add Team Member</span>
            </button>
          )}
        </div>
      ) : (
        <div className="team-grid">
          {filteredTeam.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
            />
          ))}
        </div>
      )}

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleAddSubmit}
        isSaving={isSaving}
        handleResumeChange={handleResumeChange}
      />

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editingMember={editingMember}
        setEditingMember={setEditingMember}
        onSubmit={handleEditSubmit}
        isSaving={isSaving}
        handleEditResumeChange={handleEditResumeChange}
      />

      <DeleteMemberModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        deletingMember={deletingMember}
        onSubmit={handleDeleteSubmit}
        isSaving={isSaving}
      />
    </div>
  );
};

