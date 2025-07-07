import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import Header from '@/components/organisms/Header';
import Button from '@/components/atoms/Button';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import projectService from '@/services/api/projectService';
import ApperIcon from '@/components/ApperIcon';

const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const projectsData = await projectService.getAll();
      setProjects(projectsData);
    } catch (err) {
      setError('Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e) {
    setSearchTerm(e.target.value);
  }

  function handleStatusFilter(status) {
    setStatusFilter(status);
  }

  async function handleDeleteProject(project) {
    if (window.confirm(`Are you sure you want to delete "${project.name}"?`)) {
      try {
        await projectService.delete(project.Id);
        setProjects(prev => prev.filter(p => p.Id !== project.Id));
        toast.success('Project deleted successfully');
      } catch (err) {
        toast.error('Failed to delete project');
      }
    }
  }

  function getStatusColor(status) {
    const colors = {
      'planning': 'bg-blue-100 text-blue-800',
      'active': 'bg-green-100 text-green-800',
      'on-hold': 'bg-yellow-100 text-yellow-800',
      'completed': 'bg-gray-100 text-gray-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  }

  function getPriorityColor(priority) {
    const colors = {
      'low': 'bg-green-100 text-green-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'high': 'bg-orange-100 text-orange-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'All Projects' },
    { value: 'planning', label: 'Planning' },
    { value: 'active', label: 'Active' },
    { value: 'on-hold', label: 'On Hold' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="h-full flex flex-col">
      <Header
        title="Projects"
        subtitle={`${filteredProjects.length} project${filteredProjects.length !== 1 ? 's' : ''}`}
        searchValue={searchTerm}
        onSearchChange={handleSearch}
        searchPlaceholder="Search projects..."
        action={
          <Button onClick={() => toast.info('Add project functionality coming soon')}>
            <ApperIcon name="Plus" size={16} className="mr-2" />
            Add Project
          </Button>
        }
      />
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full p-6">
          {/* Filters */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => handleStatusFilter(option.value)}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-150 ${
                    statusFilter === option.value
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {filteredProjects.length === 0 ? (
            <Empty
              title="No projects found"
              description="Get started by creating your first project"
              actionLabel="Add Project"
              onAction={() => toast.info('Add project functionality coming soon')}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map(project => (
                <div key={project.Id} className="bg-white rounded-lg shadow-micro border border-gray-200 hover:shadow-subtle transition-shadow duration-150">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.name}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{project.description}</p>
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => toast.info('Edit project functionality coming soon')}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-150"
                        >
                          <ApperIcon name="Edit" size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteProject(project)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-150"
                        >
                          <ApperIcon name="Trash2" size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                        {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                      </span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(project.priority)}`}>
                        {project.priority.charAt(0).toUpperCase() + project.priority.slice(1)}
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Calendar" size={14} className="mr-2" />
                        Due: {new Date(project.dueDate).toLocaleDateString()}
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="Users" size={14} className="mr-2" />
                        Team: {project.teamMembers.join(', ')}
                      </div>

                      <div className="flex items-center text-sm text-gray-600">
                        <ApperIcon name="DollarSign" size={14} className="mr-2" />
                        Budget: ${project.budget.toLocaleString()}
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                          <span>Progress</span>
                          <span>{project.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;