// Centralized design system for consistent styling across the app
export const designSystem = {
  // Gradient classes matching splash page
  gradients: {
    primary: "bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600",
    secondary: "bg-gradient-to-r from-purple-600 via-pink-600 to-red-600",
    accent: "bg-gradient-to-r from-green-400 via-blue-500 to-purple-600",
    dark: "bg-gradient-to-r from-gray-800 via-gray-900 to-black",
    glass: "bg-white/10 backdrop-blur-sm border border-white/20",
  },
  
  // Hover effects for interactive elements
  hover: {
    card: "hover:bg-white/10 hover:border-white/30 hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
    button: "hover:bg-white/20 hover:shadow-lg hover:scale-105 transition-all duration-200",
    link: "hover:text-blue-400 transition-colors duration-200",
    gradient: "hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 transition-all duration-300",
  },
  
  // Common component styles
  components: {
    card: "bg-black/50 border border-white/20 rounded-2xl p-6 shadow-lg backdrop-blur-sm",
    button: {
      primary: "bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg",
      secondary: "bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-semibold transition-colors",
      gradient: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg",
      danger: "bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-lg",
    },
    input: "bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all",
    section: "bg-black/30 border border-white/10 rounded-2xl p-8 backdrop-blur-sm",
    form: "bg-black/40 border border-white/10 rounded-2xl p-8",
    sidebar: "bg-black/60 border-r border-white/10",
  },
  
  // Typography
  typography: {
    h1: "text-4xl font-bold text-white",
    h2: "text-3xl font-bold text-white",
    h3: "text-2xl font-semibold text-white",
    h4: "text-xl font-semibold text-white",
    body: "text-lg text-white/80",
    small: "text-sm text-white/60",
    label: "text-white/80 text-lg font-semibold",
  },
  
  // Spacing
  spacing: {
    section: "mb-8",
    card: "mb-6",
    element: "mb-4",
  },

  // Layout
  layout: {
    container: "w-full max-w-7xl mx-auto",
    sidebar: "hidden md:flex flex-col w-72 min-h-screen",
    main: "flex-1 min-h-screen px-0 md:px-8 py-8 overflow-x-auto",
    page: "min-h-screen bg-black p-8",
  },

  // Status badges
  status: {
    active: "bg-green-500/20 text-green-400 border border-green-400/30",
    completed: "bg-blue-500/20 text-blue-400 border border-blue-400/30",
    planning: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
    inactive: "bg-gray-500/20 text-gray-400 border border-gray-400/30",
    high: "bg-red-500/20 text-red-400 border border-red-400/30",
    medium: "bg-yellow-500/20 text-yellow-400 border border-yellow-400/30",
    low: "bg-green-500/20 text-green-400 border border-green-400/30",
  },
};

// Utility function to combine classes
export const cn = (...classes: (string | undefined | null | false)[]) => {
  return classes.filter(Boolean).join(' ');
};

// Pre-built component classes
export const componentClasses = {
  // Dashboard components
  dashboardCard: cn(
    designSystem.components.card,
    designSystem.hover.card
  ),
  
  dashboardSection: cn(
    designSystem.components.section,
    "hover:bg-black/40 hover:border-white/20 transition-all duration-300"
  ),
  
  interactiveCard: cn(
    designSystem.components.card,
    designSystem.hover.card,
    "cursor-pointer"
  ),
  
  // Buttons
  gradientButton: cn(
    designSystem.components.button.gradient,
    designSystem.hover.gradient
  ),
  
  primaryButton: cn(
    designSystem.components.button.primary,
    designSystem.hover.button
  ),
  
  secondaryButton: cn(
    designSystem.components.button.secondary,
    designSystem.hover.button
  ),

  dangerButton: cn(
    designSystem.components.button.danger,
    designSystem.hover.button
  ),
  
  // Forms
  formInput: cn(
    designSystem.components.input,
    "w-full"
  ),

  formContainer: cn(
    designSystem.components.form
  ),

  // Typography
  sectionTitle: cn(
    designSystem.typography.h2,
    designSystem.spacing.section
  ),
  
  cardTitle: cn(
    designSystem.typography.h3,
    designSystem.spacing.element
  ),
  
  bodyText: cn(
    designSystem.typography.body,
    designSystem.spacing.element
  ),

  formLabel: cn(
    designSystem.typography.label,
    "mb-3"
  ),

  // Layout
  pageContainer: cn(
    designSystem.layout.page
  ),

  mainContainer: cn(
    designSystem.layout.container
  ),

  sidebarContainer: cn(
    designSystem.layout.sidebar,
    designSystem.components.sidebar
  ),

  mainContent: cn(
    designSystem.layout.main
  ),

  // Status badges
  statusBadge: (status: string) => {
    const statusMap: Record<string, string> = {
      active: designSystem.status.active,
      completed: designSystem.status.completed,
      planning: designSystem.status.planning,
      inactive: designSystem.status.inactive,
      high: designSystem.status.high,
      medium: designSystem.status.medium,
      low: designSystem.status.low,
    };
    return cn(
      "px-3 py-1 rounded-full text-sm font-medium",
      statusMap[status] || designSystem.status.inactive
    );
  },

  // Navigation
  navLink: (isActive: boolean) => cn(
    "flex items-center gap-4 px-4 py-3 rounded-xl text-lg font-medium transition-all duration-200",
    isActive 
      ? "bg-blue-600/20 text-white shadow-lg border border-blue-400/30" 
      : "text-white/70 hover:bg-white/10 hover:text-white hover:shadow-md"
  ),

  // Loading states
  skeleton: {
    card: "animate-pulse bg-black/80 rounded-2xl h-32",
    text: "animate-pulse bg-black/80 rounded h-4",
    title: "animate-pulse bg-black/80 rounded h-8 w-1/3",
  },
}; 