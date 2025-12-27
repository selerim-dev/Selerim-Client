"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "../../lib/auth-context";
import { useNotification } from "../NotificationProvider";
import authService from "../../lib/auth";
import { componentClasses } from "../DesignSystem";
import { 
  Project, 
  ProjectCreate,
  Client
} from "../../interfaces/auth";
import ProjectPaymentManager from "../ProjectPaymentManager";
import Modal, { ModalForm, ModalInput, ModalSelect, ModalButtons } from "../Modal";
import { 
  PlusIcon, 
  FolderIcon,
  CurrencyDollarIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CreditCardIcon
} from "@heroicons/react/24/outline";

export default function OwnerDashboard() {
  const { user, tokens } = useAuth();
  const { notify } = useNotification();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Modal states
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [showEditProject, setShowEditProject] = useState(false);
  const [showPaymentManager, setShowPaymentManager] = useState(false);
  const [showInviteClient, setShowInviteClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Form states
  const [clientInviteForm, setClientInviteForm] = useState({
    email: '',
    first_name: '',
    last_name: '',
    phone: '',
    message: ''
  });
  
  const [projectForm, setProjectForm] = useState<ProjectCreate>({
    title: '',
    description: '',
    status: 'planning',
    priority: 'medium',
    tier: 'starter',
    total_cost: undefined,
    current_stage: '',
    timeline: {},
    client_id: '',
    start_date: '',
    due_date: '',
    estimated_hours: undefined,
    hourly_rate: undefined,
    requirements: '',
    technical_specs: '',
    deliverables: '',
    project_url: '',
    repository_url: '',
    design_url: '',
    tags: '',
    notes: ''
  });

  useEffect(() => {
    if (tokens?.access_token) {
      loadDashboardData();
    }
  }, [tokens?.access_token]);

  const loadDashboardData = async () => {
    if (!tokens?.access_token) return;
    
    setIsLoading(true);
    try {
      // Try to load projects without any parameters first
      const projectsData = await authService.getProjects(tokens.access_token);
      setProjects(projectsData.items);
      
      // Load clients (we'll need to add this to the auth service)
      try {
        const clientsData = await authService.getClients(tokens.access_token);
        setClients(clientsData.items || []);
      } catch (clientError) {
        console.error('Failed to load clients:', clientError);
        // Only log out on true auth errors
        if (
          clientError instanceof Error &&
          (
            clientError.message.includes('Authentication required') ||
            clientError.message.includes('401') ||
            clientError.message.includes('Unauthorized') ||
            clientError.message.includes('Session expired')
          )
        ) {
          // Auth service will handle the logout automatically
          return;
        }
        setClients([]);
        notify({ 
          message: 'Failed to load clients. ' + (clientError instanceof Error ? clientError.message : ''), 
          type: 'error' 
        });
      }
    } catch (error) {
      console.error('Dashboard data loading error:', error);
      
      // If it's an authentication error, the auth service will handle logout
      if (error instanceof Error && (
        error.message.includes('Authentication required') ||
        error.message.includes('401') ||
        error.message.includes('Unauthorized') ||
        error.message.includes('Session expired')
      )) {
        // Auth service will handle the logout automatically
        return;
      }
      
      // For other errors, show empty state
      setProjects([]);
      notify({ 
        message: 'Failed to load projects. Please try refreshing the page.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access_token) return;

    setIsSubmitting(true);
    try {
      const newProject = await authService.createProject(projectForm, tokens.access_token);
      setProjects(prev => [newProject, ...prev]);
      setShowCreateProject(false);
      setProjectForm({
        title: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        tier: 'starter',
        total_cost: undefined,
        current_stage: '',
        timeline: {},
        client_id: '',
        start_date: '',
        due_date: '',
        estimated_hours: undefined,
        hourly_rate: undefined,
        requirements: '',
        technical_specs: '',
        deliverables: '',
        project_url: '',
        repository_url: '',
        design_url: '',
        tags: '',
        notes: ''
      });
      notify({ message: 'Project created successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to create project';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInviteClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access_token) return;

    setIsSubmitting(true);
    try {
      const { createClient } = await import('../../config/api');
      await createClient({
        email: clientInviteForm.email,
        first_name: clientInviteForm.first_name,
        last_name: clientInviteForm.last_name,
        phone: clientInviteForm.phone
      });
      
      setShowInviteClient(false);
      setClientInviteForm({
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        message: ''
      });
      notify({ message: 'Client invitation sent successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to send invitation';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokens?.access_token || !selectedProject) return;

    setIsSubmitting(true);
    try {
      // Convert ProjectCreate data to ProjectUpdate format
      const updateData = {
        title: projectForm.title,
        description: projectForm.description,
        status: projectForm.status,
        priority: projectForm.priority,
        tier: projectForm.tier,
        total_cost: projectForm.total_cost,
        current_stage: projectForm.current_stage,
        timeline: projectForm.timeline,
        client_id: projectForm.client_id,
        start_date: projectForm.start_date,
        due_date: projectForm.due_date,
        estimated_hours: projectForm.estimated_hours,
        hourly_rate: projectForm.hourly_rate,
        requirements: projectForm.requirements,
        technical_specs: projectForm.technical_specs,
        deliverables: projectForm.deliverables,
        project_url: projectForm.project_url,
        repository_url: projectForm.repository_url,
        design_url: projectForm.design_url,
        tags: projectForm.tags,
        notes: projectForm.notes
      };

      const updatedProject = await authService.updateProject(selectedProject.id, updateData, tokens.access_token);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? updatedProject : p));
      setShowEditProject(false);
      setSelectedProject(null);
      setProjectForm({
        title: '',
        description: '',
        status: 'planning',
        priority: 'medium',
        tier: 'starter',
        total_cost: undefined,
        current_stage: '',
        timeline: {},
        client_id: '',
        start_date: '',
        due_date: '',
        estimated_hours: undefined,
        hourly_rate: undefined,
        requirements: '',
        technical_specs: '',
        deliverables: '',
        project_url: '',
        repository_url: '',
        design_url: '',
        tags: '',
        notes: ''
      });
      notify({ message: 'Project updated successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update project';
      notify({ message: errorMessage, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!tokens?.access_token) return;

    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      await authService.deleteProject(projectId, tokens.access_token);
      setProjects(prev => prev.filter(p => p.id !== projectId));
      notify({ message: 'Project deleted successfully!', type: 'success' });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete project';
      notify({ message: errorMessage, type: 'error' });
    }
  };

  const handleEditProjectClick = (project: Project) => {
    setSelectedProject(project);
    setProjectForm({
      title: project.title,
      description: project.description || '',
      status: project.status,
      priority: project.priority,
      tier: project.tier,
      total_cost: project.total_cost,
      current_stage: project.current_stage || '',
      timeline: project.timeline || {},
      client_id: project.client_id || '',
      start_date: project.start_date || '',
      due_date: project.due_date || '',
      estimated_hours: project.estimated_hours,
      hourly_rate: project.hourly_rate,
      requirements: project.requirements || '',
      technical_specs: project.technical_specs || '',
      deliverables: project.deliverables || '',
      project_url: project.project_url || '',
      repository_url: project.repository_url || '',
      design_url: project.design_url || '',
      tags: project.tags || '',
      notes: project.notes || ''
    });
    setShowEditProject(true);
  };

  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const calculateBusinessDays = (startDate: Date, endDate: Date): number => {
    let businessDays = 0;
    const currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      const dayOfWeek = currentDate.getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 0 = Sunday, 6 = Saturday
        businessDays++;
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return businessDays;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className={componentClasses.skeleton.card} />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className={componentClasses.skeleton.card} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Action Buttons - moved to top */}
      <div className="flex flex-wrap gap-4 mb-8">
        <button
          onClick={() => setShowInviteClient(true)}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Invite Client
        </button>
        <button
          onClick={() => setShowCreateProject(true)}
          className={componentClasses.gradientButton}
        >
          <PlusIcon className="h-5 w-5" />
          Create New Project
        </button>
      </div>
      {/* Welcome Header */}
      <div className="text-left">
        <h1 className="text-4xl font-bold text-white mb-2">{getWelcomeMessage()}, {user?.first_name || 'Admin'}!</h1>
        <p className="text-lg text-white/60">Here's what's happening with your projects today.</p>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={componentClasses.dashboardCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Projects</p>
              <p className="text-3xl font-bold text-white">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <FolderIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400">{projects.filter(p => p.status === 'active').length} active</span>
            <span className="text-white/40 mx-2">•</span>
            <span className="text-blue-400">{projects.filter(p => p.status === 'completed').length} completed</span>
          </div>
        </div>

        <div className={componentClasses.dashboardCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Active Projects</p>
              <p className="text-3xl font-bold text-white">
                {projects.filter(p => p.status === 'active').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-green-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-400">In progress</span>
          </div>
        </div>

        <div className={componentClasses.dashboardCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Completed</p>
              <p className="text-3xl font-bold text-white">
                {projects.filter(p => p.status === 'completed').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
              <CheckCircleIcon className="h-6 w-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-blue-400">Finished</span>
          </div>
        </div>

        <div className={componentClasses.dashboardCard}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">In Progress</p>
              <p className="text-3xl font-bold text-white">
                {projects.filter(p => p.status === 'planning').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
              <ClockIcon className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-yellow-400">Planning</span>
          </div>
        </div>
      </div>

      {/* Clients Section */}
      <div className={componentClasses.dashboardSection}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={componentClasses.cardTitle}>Recent Clients</h2>
        </div>
        
        <div className="space-y-4">
          {clients.map((client) => (
            <div key={client.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{client.first_name} {client.last_name}</h3>
                  <p className="text-white/60 text-sm mb-2">{client.email}</p>
                  {client.phone && (
                    <p className="text-white/40 text-sm">{client.phone}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      client.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {client.is_active ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-white/40 text-xs">
                      Created: {new Date(client.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {clients.length === 0 && (
            <div className="text-center py-8">
              <svg className="h-12 w-12 text-white/40 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
              <p className="text-white/60">No clients yet</p>
              <button
                onClick={() => setShowInviteClient(true)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
              >
                Invite your first client
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Projects Grid */}
      <div className={componentClasses.dashboardSection}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={componentClasses.cardTitle}>Recent Projects</h2>
        </div>
        
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="p-4 bg-white/5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-1">{project.title}</h3>
                  <p className="text-white/60 text-sm mb-2 line-clamp-2">{project.description}</p>
                  <div className="flex items-center gap-3">
                    <span className={componentClasses.statusBadge(project.status)}>
                      {project.status}
                    </span>
                    <span className={componentClasses.statusBadge(project.priority)}>
                      {project.priority}
                    </span>
                    {project.client_name && (
                      <span className="text-white/60 text-sm">{project.client_name}</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                    <EyeIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleEditProjectClick(project)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit Project"
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteProject(project.id)}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Delete Project"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedProject(project);
                      setShowPaymentManager(true);
                    }}
                    className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                    title="Manage Payments"
                  >
                    <CreditCardIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {projects.length === 0 && (
            <div className="text-center py-8">
              <FolderIcon className="h-12 w-12 text-white/40 mx-auto mb-4" />
              <p className="text-white/60">No projects yet</p>
              <button
                onClick={() => setShowCreateProject(true)}
                className="text-blue-400 hover:text-blue-300 text-sm font-medium mt-2"
              >
                Create your first project
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      <Modal
        isOpen={showCreateProject}
        onClose={() => setShowCreateProject(false)}
        title="Create New Project"
        maxWidth="max-w-4xl"
      >
        <ModalForm onSubmit={handleCreateProject}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Project Title"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
              placeholder="Enter project title"
            />

            <ModalSelect
              label="Client"
              value={projectForm.client_id || ''}
              onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
              required
            >
              <option value="">Select a client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.first_name} {client.last_name} ({client.email})
                </option>
              ))}
            </ModalSelect>
          </div>

          <ModalInput
            label="Description"
            type="textarea"
            value={projectForm.description || ''}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            placeholder="Enter project description"
            rows={3}
          />

          {/* Project Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalSelect
              label="Status"
              value={projectForm.status || 'planning'}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </ModalSelect>

            <ModalSelect
              label="Priority"
              value={projectForm.priority || 'medium'}
              onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as any })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </ModalSelect>

            <ModalSelect
              label="Tier"
              value={projectForm.tier || 'starter'}
              onChange={(e) => setProjectForm({ ...projectForm, tier: e.target.value as any })}
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </ModalSelect>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Start Date"
              type="date"
              value={projectForm.start_date || ''}
              onChange={(e) => {
                const startDate = e.target.value;
                setProjectForm({ ...projectForm, start_date: startDate });
                
                // Auto-calculate estimated hours if both dates are set
                if (startDate && projectForm.due_date) {
                  const start = new Date(startDate);
                  const end = new Date(projectForm.due_date);
                  const businessDays = calculateBusinessDays(start, end);
                  const estimatedHours = businessDays * 8; // 8 hours per business day
                  setProjectForm(prev => ({ 
                    ...prev, 
                    start_date: startDate,
                    estimated_hours: estimatedHours 
                  }));
                }
              }}
            />

            <ModalInput
              label="Due Date"
              type="date"
              value={projectForm.due_date || ''}
              onChange={(e) => {
                const dueDate = e.target.value;
                setProjectForm({ ...projectForm, due_date: dueDate });
                
                // Auto-calculate estimated hours if both dates are set
                if (projectForm.start_date && dueDate) {
                  const start = new Date(projectForm.start_date);
                  const end = new Date(dueDate);
                  const businessDays = calculateBusinessDays(start, end);
                  const estimatedHours = businessDays * 8; // 8 hours per business day
                  setProjectForm(prev => ({ 
                    ...prev, 
                    due_date: dueDate,
                    estimated_hours: estimatedHours 
                  }));
                }
              }}
            />
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalInput
              label="Total Cost"
              type="number"
              value={projectForm.total_cost !== undefined ? projectForm.total_cost.toString() : ''}
              onChange={(e) => {
                const totalCost = e.target.value ? parseFloat(e.target.value) : undefined;
                setProjectForm({ ...projectForm, total_cost: totalCost });
                
                // Auto-calculate hourly rate if total cost and estimated hours are set
                if (totalCost && projectForm.estimated_hours) {
                  const hourlyRate = totalCost / projectForm.estimated_hours;
                  setProjectForm(prev => ({ 
                    ...prev, 
                    total_cost: totalCost,
                    hourly_rate: hourlyRate 
                  }));
                }
              }}
              placeholder="0.00"
              step="0.01"
            />

            <ModalInput
              label="Estimated Hours"
              type="number"
              value={projectForm.estimated_hours !== undefined ? projectForm.estimated_hours.toString() : ''}
              onChange={(e) => {
                const estimatedHours = e.target.value ? parseFloat(e.target.value) : undefined;
                setProjectForm({ ...projectForm, estimated_hours: estimatedHours });
                
                // Auto-calculate hourly rate if total cost and estimated hours are set
                if (projectForm.total_cost && estimatedHours) {
                  const hourlyRate = projectForm.total_cost / estimatedHours;
                  setProjectForm(prev => ({ 
                    ...prev, 
                    estimated_hours: estimatedHours,
                    hourly_rate: hourlyRate 
                  }));
                }
              }}
              placeholder="0"
              step="0.5"
            />

            <ModalInput
              label="Hourly Rate"
              type="number"
              value={projectForm.hourly_rate !== undefined ? projectForm.hourly_rate.toString() : ''}
              onChange={(e) => setProjectForm({ ...projectForm, hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <ModalInput
            label="Current Stage"
            value={projectForm.current_stage || ''}
            onChange={(e) => setProjectForm({ ...projectForm, current_stage: e.target.value })}
            placeholder="Enter current stage"
          />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Requirements"
              type="textarea"
              value={projectForm.requirements || ''}
              onChange={(e) => setProjectForm({ ...projectForm, requirements: e.target.value })}
              placeholder="Enter project requirements"
              rows={3}
            />

            <ModalInput
              label="Technical Specifications"
              type="textarea"
              value={projectForm.technical_specs || ''}
              onChange={(e) => setProjectForm({ ...projectForm, technical_specs: e.target.value })}
              placeholder="Enter technical specifications"
              rows={3}
            />
          </div>

          <ModalInput
            label="Deliverables"
            type="textarea"
            value={projectForm.deliverables || ''}
            onChange={(e) => setProjectForm({ ...projectForm, deliverables: e.target.value })}
            placeholder="Enter project deliverables"
            rows={3}
          />

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalInput
              label="Project URL"
              type="url"
              value={projectForm.project_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
              placeholder="https://example.com"
            />

            <ModalInput
              label="Repository URL"
              type="url"
              value={projectForm.repository_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, repository_url: e.target.value })}
              placeholder="https://github.com/..."
            />

            <ModalInput
              label="Design URL"
              type="url"
              value={projectForm.design_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, design_url: e.target.value })}
              placeholder="https://figma.com/..."
            />
          </div>

          {/* Tags and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Tags"
              value={projectForm.tags || ''}
              onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
              placeholder="Enter tags (comma separated)"
            />

            <ModalInput
              label="Notes"
              type="textarea"
              value={projectForm.notes || ''}
              onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
              placeholder="Enter additional notes"
              rows={3}
            />
          </div>

          <ModalButtons
            primaryText={isSubmitting ? 'Creating...' : 'Create Project'}
            onPrimary={() => {}}
            secondaryText="Cancel"
            onSecondary={() => setShowCreateProject(false)}
            isLoading={isSubmitting}
          />
        </ModalForm>
      </Modal>

      {/* Edit Project Modal */}
      <Modal
        isOpen={showEditProject}
        onClose={() => {
          setShowEditProject(false);
          setSelectedProject(null);
        }}
        title="Edit Project"
        maxWidth="max-w-4xl"
      >
        <ModalForm onSubmit={handleEditProject}>
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Project Title"
              value={projectForm.title}
              onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
              required
              placeholder="Enter project title"
            />

            <ModalInput
              label="Client ID"
              value={projectForm.client_id || ''}
              onChange={(e) => setProjectForm({ ...projectForm, client_id: e.target.value })}
              placeholder="Enter client ID"
            />
          </div>

          <ModalInput
            label="Description"
            type="textarea"
            value={projectForm.description || ''}
            onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
            placeholder="Enter project description"
            rows={3}
          />

          {/* Project Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalSelect
              label="Status"
              value={projectForm.status || 'planning'}
              onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value as any })}
            >
              <option value="planning">Planning</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="on_hold">On Hold</option>
              <option value="cancelled">Cancelled</option>
            </ModalSelect>

            <ModalSelect
              label="Priority"
              value={projectForm.priority || 'medium'}
              onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value as any })}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="urgent">Urgent</option>
            </ModalSelect>

            <ModalSelect
              label="Tier"
              value={projectForm.tier || 'starter'}
              onChange={(e) => setProjectForm({ ...projectForm, tier: e.target.value as any })}
            >
              <option value="starter">Starter</option>
              <option value="growth">Growth</option>
              <option value="enterprise">Enterprise</option>
            </ModalSelect>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Start Date"
              type="date"
              value={projectForm.start_date || ''}
              onChange={(e) => {
                const startDate = e.target.value;
                setProjectForm({ ...projectForm, start_date: startDate });
                
                // Auto-calculate estimated hours if both dates are set
                if (startDate && projectForm.due_date) {
                  const start = new Date(startDate);
                  const end = new Date(projectForm.due_date);
                  const businessDays = calculateBusinessDays(start, end);
                  const estimatedHours = businessDays * 8; // 8 hours per business day
                  setProjectForm(prev => ({ 
                    ...prev, 
                    start_date: startDate,
                    estimated_hours: estimatedHours 
                  }));
                }
              }}
            />

            <ModalInput
              label="Due Date"
              type="date"
              value={projectForm.due_date || ''}
              onChange={(e) => {
                const dueDate = e.target.value;
                setProjectForm({ ...projectForm, due_date: dueDate });
                
                // Auto-calculate estimated hours if both dates are set
                if (projectForm.start_date && dueDate) {
                  const start = new Date(projectForm.start_date);
                  const end = new Date(dueDate);
                  const businessDays = calculateBusinessDays(start, end);
                  const estimatedHours = businessDays * 8; // 8 hours per business day
                  setProjectForm(prev => ({ 
                    ...prev, 
                    due_date: dueDate,
                    estimated_hours: estimatedHours 
                  }));
                }
              }}
            />
          </div>

          {/* Financial Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalInput
              label="Total Cost"
              type="number"
              value={projectForm.total_cost !== undefined ? projectForm.total_cost.toString() : ''}
              onChange={(e) => {
                const totalCost = e.target.value ? parseFloat(e.target.value) : undefined;
                setProjectForm({ ...projectForm, total_cost: totalCost });
                
                // Auto-calculate hourly rate if total cost and estimated hours are set
                if (totalCost && projectForm.estimated_hours) {
                  const hourlyRate = totalCost / projectForm.estimated_hours;
                  setProjectForm(prev => ({ 
                    ...prev, 
                    total_cost: totalCost,
                    hourly_rate: hourlyRate 
                  }));
                }
              }}
              placeholder="0.00"
              step="0.01"
            />

            <ModalInput
              label="Estimated Hours"
              type="number"
              value={projectForm.estimated_hours !== undefined ? projectForm.estimated_hours.toString() : ''}
              onChange={(e) => {
                const estimatedHours = e.target.value ? parseFloat(e.target.value) : undefined;
                setProjectForm({ ...projectForm, estimated_hours: estimatedHours });
                
                // Auto-calculate hourly rate if total cost and estimated hours are set
                if (projectForm.total_cost && estimatedHours) {
                  const hourlyRate = projectForm.total_cost / estimatedHours;
                  setProjectForm(prev => ({ 
                    ...prev, 
                    estimated_hours: estimatedHours,
                    hourly_rate: hourlyRate 
                  }));
                }
              }}
              placeholder="0"
              step="0.5"
            />

            <ModalInput
              label="Hourly Rate"
              type="number"
              value={projectForm.hourly_rate !== undefined ? projectForm.hourly_rate.toString() : ''}
              onChange={(e) => setProjectForm({ ...projectForm, hourly_rate: e.target.value ? parseFloat(e.target.value) : undefined })}
              placeholder="0.00"
              step="0.01"
            />
          </div>

          <ModalInput
            label="Current Stage"
            value={projectForm.current_stage || ''}
            onChange={(e) => setProjectForm({ ...projectForm, current_stage: e.target.value })}
            placeholder="Enter current stage"
          />

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Requirements"
              type="textarea"
              value={projectForm.requirements || ''}
              onChange={(e) => setProjectForm({ ...projectForm, requirements: e.target.value })}
              placeholder="Enter project requirements"
              rows={3}
            />

            <ModalInput
              label="Technical Specifications"
              type="textarea"
              value={projectForm.technical_specs || ''}
              onChange={(e) => setProjectForm({ ...projectForm, technical_specs: e.target.value })}
              placeholder="Enter technical specifications"
              rows={3}
            />
          </div>

          <ModalInput
            label="Deliverables"
            type="textarea"
            value={projectForm.deliverables || ''}
            onChange={(e) => setProjectForm({ ...projectForm, deliverables: e.target.value })}
            placeholder="Enter project deliverables"
            rows={3}
          />

          {/* URLs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ModalInput
              label="Project URL"
              type="url"
              value={projectForm.project_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, project_url: e.target.value })}
              placeholder="https://example.com"
            />

            <ModalInput
              label="Repository URL"
              type="url"
              value={projectForm.repository_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, repository_url: e.target.value })}
              placeholder="https://github.com/..."
            />

            <ModalInput
              label="Design URL"
              type="url"
              value={projectForm.design_url || ''}
              onChange={(e) => setProjectForm({ ...projectForm, design_url: e.target.value })}
              placeholder="https://figma.com/..."
            />
          </div>

          {/* Tags and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="Tags"
              value={projectForm.tags || ''}
              onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
              placeholder="Enter tags (comma separated)"
            />

            <ModalInput
              label="Notes"
              type="textarea"
              value={projectForm.notes || ''}
              onChange={(e) => setProjectForm({ ...projectForm, notes: e.target.value })}
              placeholder="Enter additional notes"
              rows={3}
            />
          </div>

          <ModalButtons
            primaryText={isSubmitting ? 'Updating...' : 'Update Project'}
            onPrimary={() => {}}
            secondaryText="Cancel"
            onSecondary={() => {
              setShowEditProject(false);
              setSelectedProject(null);
            }}
            isLoading={isSubmitting}
          />
        </ModalForm>
      </Modal>

      {/* Invite Client Modal */}
      <Modal
        isOpen={showInviteClient}
        onClose={() => setShowInviteClient(false)}
        title="Invite New Client"
        maxWidth="max-w-2xl"
      >
        <ModalForm onSubmit={handleInviteClient}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ModalInput
              label="First Name"
              value={clientInviteForm.first_name}
              onChange={(e) => setClientInviteForm({ ...clientInviteForm, first_name: e.target.value })}
              required
              placeholder="Enter first name"
            />

            <ModalInput
              label="Last Name"
              value={clientInviteForm.last_name}
              onChange={(e) => setClientInviteForm({ ...clientInviteForm, last_name: e.target.value })}
              required
              placeholder="Enter last name"
            />
          </div>

          <ModalInput
            label="Email Address"
            type="email"
            value={clientInviteForm.email}
            onChange={(e) => setClientInviteForm({ ...clientInviteForm, email: e.target.value })}
            required
            placeholder="Enter email address"
          />

          <ModalInput
            label="Phone Number"
            type="tel"
            value={clientInviteForm.phone}
            onChange={(e) => setClientInviteForm({ ...clientInviteForm, phone: e.target.value })}
            placeholder="Enter phone number"
          />

          <ModalInput
            label="Personal Message (Optional)"
            type="textarea"
            value={clientInviteForm.message}
            onChange={(e) => setClientInviteForm({ ...clientInviteForm, message: e.target.value })}
            placeholder="Add a personal message to the invitation email"
            rows={3}
          />

          <ModalButtons
            primaryText={isSubmitting ? 'Sending Invitation...' : 'Send Invitation'}
            onPrimary={() => {}}
            secondaryText="Cancel"
            onSecondary={() => setShowInviteClient(false)}
            isLoading={isSubmitting}
          />
        </ModalForm>
      </Modal>

      {/* Payment Manager Modal */}
      {showPaymentManager && selectedProject && (
        <ProjectPaymentManager
          projectId={selectedProject.id}
          projectTitle={selectedProject.title}
          onClose={() => {
            setShowPaymentManager(false);
            setSelectedProject(null);
          }}
        />
      )}
    </div>
  );
} 