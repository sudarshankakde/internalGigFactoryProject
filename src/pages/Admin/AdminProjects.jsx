import React, { useState, useEffect } from 'react';
import ProjectFilters from '../../components/Admin/ProjectFilters';
import ProjectsGrid from '../../components/Admin/ProjectsGrid';
import ProjectMilestones from '../../components/Admin/ProjectMilestones';
import ProjectApplications from '../../components/Admin/ProjectApplications';
import NewProjectModal from '../../components/Admin/NewProjectModal';
import EditProjectModal from '../../components/Admin/EditProjectModal';
import { getProjects, updateProject } from '../../data/projectDataStore';
import { useNavigate } from 'react-router-dom';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeProjectForMilestones, setActiveProjectForMilestones] = useState(null);
  const [applications, setApplications] = useState([]);
  const [activeProjectForApplications, setActiveProjectForApplications] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [viewMode, setViewMode] = useState('grid');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [isEditProjectModalOpen, setIsEditProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const navigate = useNavigate();

  // Sample data - Replace with API call
  useEffect(() => {
    const storedProjects = getProjects();
    setProjects(storedProjects);
    setFilteredProjects(storedProjects);
  }, []);

  // Filter projects based on search term and filters
  useEffect(() => {
    let filtered = projects.filter((project) => {
      const matchesSearch = 
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = 
        selectedCategory === 'All Categories' || project.category === selectedCategory;
      
      const matchesStatus = 
        selectedStatus === 'All Status' || project.status === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    setFilteredProjects(filtered);
  }, [searchTerm, selectedCategory, selectedStatus, projects]);

  const handleEdit = (projectId) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return;
    setEditingProject(project);
    setIsEditProjectModalOpen(true);
  };

  const handleUpdateProject = (updatedProject) => {
    updateProject(updatedProject);
    setProjects((prev) => prev.map((project) => project.id === updatedProject.id ? updatedProject : project));
  };

  const handleCloseEditProjectModal = () => {
    setIsEditProjectModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter((p) => p.id !== projectId));
      console.log('Deleted project:', projectId);
    }
  };

  const handleViewDetails = (projectId) => {
    console.log('View details for project:', projectId);
    navigate(`/admin/projects/${projectId}`);
  };

  const handleTrackProgress = (projectId) => {
    console.log('Track progress for project:', projectId);
    navigate(`/admin/projects/${projectId}/progress`);
  };

  const handleOpenMilestones = (project) => {
    setActiveProjectForMilestones(project);
  };

  const handleCloseMilestones = () => setActiveProjectForMilestones(null);

  // Applications (in-memory demo)
  const handleSimApply = (project, role) => {
    const app = {
      id: Date.now(),
      projectId: project.id,
      applicantType: role,
      name: role === 'freelancer' ? 'Freelancer Test' : 'Agency Test',
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };
    setApplications(prev => [app, ...prev]);
    alert(`${role} applied to ${project.title}`);
  };

  const handleOpenApplications = (project) => {
    setActiveProjectForApplications(project);
  };

  const handleCloseApplications = () => setActiveProjectForApplications(null);

  const handleApproveApplication = (appId) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'approved' } : a));
  };

  const handleRejectApplication = (appId) => {
    setApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'rejected' } : a));
  };

  const handleStartNewProject = () => {
    setIsNewProjectModalOpen(true);
  };

  const handleCloseNewProjectModal = () => {
    setIsNewProjectModalOpen(false);
  };

  const handleCreateNewProject = (createdProject) => {
    setProjects((prev) => [createdProject, ...prev]);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All Categories');
    setSelectedStatus('All Status');
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Projects</h1>
          <p className="text-gray-400">Manage and track all your projects</p>
        </div>

        {/* Filters - wrapped in larger rounded container for prominent search layout */}
        <div className="bg-[#0b0b0d] border border-[#23232a] rounded-[20px] p-6 mb-6">
          <div className="max-w-7xl mx-auto">
            <ProjectFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              onClearFilters={handleClearFilters}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <ProjectsGrid
            projects={filteredProjects}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onViewDetails={handleViewDetails}
            onTrackProgress={handleTrackProgress}
            onMilestones={handleOpenMilestones}
            onApplications={handleOpenApplications}
            onSimApply={handleSimApply}
            viewMode={viewMode}
            onStartNewProject={handleStartNewProject}
          />
        ) : (
          <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
            <p className="text-gray-400 text-lg mb-4">No projects found</p>
            <button
              onClick={handleStartNewProject}
              className="bg-lime-400 text-black px-6 py-2 rounded-lg hover:bg-lime-300 transition-colors font-semibold"
            >
              Start New Project
            </button>
          </div>
        )}
      </div>
      {activeProjectForMilestones && (
        <ProjectMilestones project={activeProjectForMilestones} onClose={handleCloseMilestones} />
      )}
      {activeProjectForApplications && (
        <ProjectApplications
          project={activeProjectForApplications}
          applications={applications}
          onClose={handleCloseApplications}
          onApprove={handleApproveApplication}
          onReject={handleRejectApplication}
        />
      )}
      {isNewProjectModalOpen && (
        <NewProjectModal onClose={handleCloseNewProjectModal} onCreate={handleCreateNewProject} />
      )}
      {isEditProjectModalOpen && editingProject && (
        <EditProjectModal
          project={editingProject}
          onClose={handleCloseEditProjectModal}
          onSave={handleUpdateProject}
        />
      )}
    </div>
  );
};

export default AdminProjects;
