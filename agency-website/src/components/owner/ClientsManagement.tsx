"use client";

import React, { useState } from "react";
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon, 
  GlobeAltIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon
} from "@heroicons/react/24/outline";

// Mock data - replace with real data from your backend
const clients = [
  {
    id: 1,
    name: "TechCorp Inc",
    email: "contact@techcorp.com",
    phone: "+1 (555) 123-4567",
    website: "https://techcorp.com",
    totalSpent: 75000,
    activeProjects: 2,
    completedProjects: 3,
    lastContact: "2024-06-10",
    status: "active",
    projects: [
      { id: 1, name: "E-commerce Platform", status: "In Development", budget: 25000 },
      { id: 2, name: "Mobile App", status: "Design Phase", budget: 18000 }
    ]
  },
  {
    id: 2,
    name: "StartupXYZ",
    email: "hello@startupxyz.com",
    phone: "+1 (555) 987-6543",
    website: "https://startupxyz.com",
    totalSpent: 45000,
    activeProjects: 1,
    completedProjects: 1,
    lastContact: "2024-06-08",
    status: "active",
    projects: [
      { id: 3, name: "CRM System", status: "Testing", budget: 35000 }
    ]
  },
  {
    id: 3,
    name: "Enterprise Solutions",
    email: "info@enterprisesolutions.com",
    phone: "+1 (555) 456-7890",
    website: "https://enterprisesolutions.com",
    totalSpent: 120000,
    activeProjects: 1,
    completedProjects: 2,
    lastContact: "2024-06-05",
    status: "active",
    projects: [
      { id: 4, name: "Analytics Dashboard", status: "Planning", budget: 40000 }
    ]
  }
];

export default function ClientsManagement() {
  const [selectedClient, setSelectedClient] = useState<typeof clients[0] | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterBy === "all" || client.status === filterBy;
    return matchesSearch && matchesFilter;
  });

  const handleClientClick = (client: typeof clients[0]) => {
    setSelectedClient(selectedClient?.id === client.id ? null : client);
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold text-white">Clients Management</h1>
        <button className="bg-blue-400/20 text-blue-300 px-6 py-3 rounded-lg hover:bg-blue-400/30 transition-colors flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          Add New Client
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search clients..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/40 focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <select
          value={filterBy}
          onChange={(e) => setFilterBy(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white"
        >
          <option value="all">All Clients</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Clients List */}
        <div className="lg:col-span-1">
          <div className="bg-black/40 border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-semibold text-white mb-4">All Clients</h2>
            <div className="space-y-3">
              {filteredClients.map((client) => (
                <div
                  key={client.id}
                  onClick={() => handleClientClick(client)}
                  className={`p-4 rounded-xl cursor-pointer transition-colors ${
                    selectedClient?.id === client.id
                      ? "bg-blue-400/20 border border-blue-400/30"
                      : "bg-white/5 border border-white/10 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-white">{client.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      client.status === "active" 
                        ? "bg-green-400/20 text-green-300" 
                        : "bg-gray-400/20 text-gray-300"
                    }`}>
                      {client.status}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm mb-2">{client.email}</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">${client.totalSpent.toLocaleString()}</span>
                    <span className="text-white/60">{client.activeProjects} active</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Details */}
        <div className="lg:col-span-2">
          {selectedClient ? (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedClient.name}</h2>
                <div className="flex gap-2">
                  <button className="bg-blue-400/20 text-blue-300 px-4 py-2 rounded-lg hover:bg-blue-400/30 transition-colors flex items-center gap-2">
                    <PencilIcon className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="bg-red-400/20 text-red-300 px-4 py-2 rounded-lg hover:bg-red-400/30 transition-colors flex items-center gap-2">
                    <TrashIcon className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <EnvelopeIcon className="h-5 w-5 text-blue-400" />
                    <span className="text-white">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="h-5 w-5 text-green-400" />
                    <span className="text-white">{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GlobeAltIcon className="h-5 w-5 text-purple-400" />
                    <a href={selectedClient.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                      {selectedClient.website}
                    </a>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Total Spent</p>
                    <p className="text-2xl font-bold text-white">${selectedClient.totalSpent.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-white/60 text-sm">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{selectedClient.activeProjects}</p>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button className="bg-blue-400/20 text-blue-300 p-4 rounded-lg hover:bg-blue-400/30 transition-colors flex flex-col items-center gap-2">
                  <ChatBubbleLeftRightIcon className="h-6 w-6" />
                  <span className="text-sm">Message</span>
                </button>
                <button className="bg-green-400/20 text-green-300 p-4 rounded-lg hover:bg-green-400/30 transition-colors flex flex-col items-center gap-2">
                  <EnvelopeIcon className="h-6 w-6" />
                  <span className="text-sm">Email</span>
                </button>
                <button className="bg-purple-400/20 text-purple-300 p-4 rounded-lg hover:bg-purple-400/30 transition-colors flex flex-col items-center gap-2">
                  <CodeBracketIcon className="h-6 w-6" />
                  <span className="text-sm">Bitbucket</span>
                </button>
                <button className="bg-orange-400/20 text-orange-300 p-4 rounded-lg hover:bg-orange-400/30 transition-colors flex flex-col items-center gap-2">
                  <EyeIcon className="h-6 w-6" />
                  <span className="text-sm">View All</span>
                </button>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-xl font-semibold text-white mb-4">Projects</h3>
                <div className="space-y-3">
                  {selectedClient.projects.map((project) => (
                    <div key={project.id} className="bg-white/5 border border-white/10 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-semibold text-white">{project.name}</h4>
                          <p className="text-white/60 text-sm">Budget: ${project.budget.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-400/20 text-blue-300">
                            {project.status}
                          </span>
                          <button className="bg-blue-400/20 text-blue-300 px-3 py-1 rounded hover:bg-blue-400/30 transition-colors">
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-black/40 border border-white/10 rounded-2xl p-8 flex items-center justify-center">
              <div className="text-center">
                <UserIcon className="h-16 w-16 text-white/40 mx-auto mb-4" />
                <p className="text-white/60">Select a client to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 