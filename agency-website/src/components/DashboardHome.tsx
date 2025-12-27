"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import authService from "../lib/auth";
import { componentClasses } from "./DesignSystem";
import { Project } from "../interfaces/auth";

export default function DashboardHome() {
  const { user, tokens } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      if (!tokens?.access_token) return;
      setIsLoading(true);
      try {
        const data = await authService.getProjects(tokens.access_token);
        setProjects(data.items || []);
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        
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
        
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [tokens]);

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-24 flex flex-col items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-6"></div>
        <div className="text-lg text-white/60">Loading your projects...</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">My Projects</h1>
      </div>
      {projects.length === 0 ? (
        <div className="text-center py-24">
          <div className="text-2xl font-bold text-white mb-4">No projects assigned yet</div>
          <div className="text-lg text-white/60 mb-8">Once your admin assigns you to a project, it will appear here.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col justify-between hover:bg-white/10 transition-colors cursor-pointer shadow-lg"
              onClick={() => router.push(`/dashboard/project/${project.id}`)}
            >
              <div>
                <div className="text-xl font-bold text-white mb-2">{project.title}</div>
                <div className="text-white/60 text-sm mb-4 line-clamp-2">{project.description || "No description provided."}</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-300">
                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                    {project.tier.charAt(0).toUpperCase() + project.tier.slice(1)}
                  </span>
                  {project.total_cost && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-fuchsia-500/20 text-fuchsia-300">
                      ${Number(project.total_cost).toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-white/40 text-xs">Last updated: {new Date(project.updated_at).toLocaleDateString()}</div>
              </div>
              <button
                className="mt-6 w-full rounded-lg bg-blue-500/80 hover:bg-blue-400 text-white font-semibold py-2 text-lg transition"
                onClick={e => {
                  e.stopPropagation();
                  router.push(`/dashboard/project/${project.id}`);
                }}
              >
                View Details & Payment Plan
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 