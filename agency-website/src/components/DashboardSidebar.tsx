"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useAuth } from "../lib/auth-context";
import { useSidebar } from "../lib/sidebar-context";
import { 
  HomeIcon, 
  PlayCircleIcon, 
  UserCircleIcon, 
  EnvelopeIcon, 
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { componentClasses } from "./DesignSystem";

const navLinks = [
  { name: "Home", href: "/dashboard", icon: HomeIcon },
  { name: "Render", href: "/dashboard/render", icon: PlayCircleIcon },
  { name: "Account", href: "/dashboard/account", icon: UserCircleIcon },
  { name: "Contact", href: "/dashboard/contact", icon: EnvelopeIcon },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { isCollapsed, isMobileOpen, toggleSidebar, toggleMobileSidebar, closeMobileSidebar } = useSidebar();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={closeMobileSidebar}
        />
      )}
      
      {/* Mobile Sidebar */}
      <aside className={`fixed top-0 left-0 h-full bg-black/95 border-r border-white/10 py-8 px-4 z-50 transform transition-transform duration-300 ease-in-out md:hidden ${
        isMobileOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Selerim Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8"
              priority 
            />
            <span className="text-2xl font-bold text-white tracking-wide">Selerim</span>
          </Link>
          <button
            onClick={closeMobileSidebar}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        {/* Mobile Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={closeMobileSidebar}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                pathname === link.href 
                  ? "bg-blue-600/20 text-white shadow-lg border border-blue-400/30" 
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`}
            >
              <link.icon className="h-6 w-6" />
              {link.name}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Logout */}
        <div className="mt-6">
          <button
            onClick={() => {
              handleLogout();
              closeMobileSidebar();
            }}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium text-red-300 hover:bg-red-400/20 hover:text-red-200 transition-all duration-200 hover:shadow-md"
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6" />
            Logout
          </button>
        </div>
      </aside>

      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex flex-col min-h-screen bg-black/60 border-r border-white/10 py-8 px-4 relative z-20 transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-20' : 'w-72'
      }`}>
        {/* Logo/Brand and Toggle */}
        <div className="mb-12 flex items-center justify-between px-2">
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image 
              src="/logo.png" 
              alt="Selerim Logo" 
              width={32} 
              height={32} 
              className="w-8 h-8 flex-shrink-0"
              priority 
            />
            {!isCollapsed && (
              <span className="text-2xl font-bold text-white tracking-wide">Selerim</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </button>
        </div>
      
        {/* Navigation */}
        <nav className="flex-1 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200 ${
                pathname === link.href 
                  ? "bg-blue-600/20 text-white shadow-lg border border-blue-400/30" 
                  : "text-white/70 hover:bg-white/10 hover:text-white hover:shadow-md"
              }`}
              title={isCollapsed ? link.name : undefined}
            >
              <link.icon className="h-6 w-6 flex-shrink-0" />
              {!isCollapsed && link.name}
            </Link>
          ))}
        </nav>
        
        {/* Logout Button */}
        <div className="mt-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium text-red-300 hover:bg-red-400/20 hover:text-red-200 transition-all duration-200 hover:shadow-md"
            title={isCollapsed ? "Logout" : undefined}
          >
            <ArrowRightOnRectangleIcon className="h-6 w-6 flex-shrink-0" />
            {!isCollapsed && "Logout"}
          </button>
        </div>
        
        {/* Client Info Banner */}
        {!isCollapsed && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-400/20 text-blue-200 text-base font-medium hover:bg-gradient-to-r hover:from-blue-500/20 hover:to-purple-500/20 hover:border-blue-400/40 hover:shadow-xl transition-all duration-300">
            <div className="mb-1 font-semibold text-blue-300">Client Dashboard</div>
            <ul className="space-y-1">
              <li>• View project progress</li>
              <li>• Access deliverables</li>
              <li>• Contact support</li>
              <li>• Manage account</li>
            </ul>
          </div>
        )}
      </aside>
    </>
  );
} 
