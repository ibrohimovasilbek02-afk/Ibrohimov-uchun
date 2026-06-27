import { create } from 'zustand'

interface AppState {
  // Theme
  theme: 'light' | 'dark'
  toggleTheme: () => void
  setTheme: (theme: 'light' | 'dark') => void

  // Sidebar
  sidebarOpen: boolean
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void

  // Loading
  isLoading: boolean
  setLoading: (loading: boolean) => void

  // AI Chat
  chatOpen: boolean
  toggleChat: () => void

  // Speaking
  isRecording: boolean
  setRecording: (recording: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'achievement'
  title: string
  message: string
}

export const useStore = create<AppState>((set) => ({
  // Theme
  theme: 'dark',
  toggleTheme: () =>
    set((state) => ({
      theme: state.theme === 'dark' ? 'light' : 'dark',
    })),
  setTheme: (theme) => set({ theme }),

  // Sidebar
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  // Loading
  isLoading: false,
  setLoading: (loading) => set({ isLoading: loading }),

  // AI Chat
  chatOpen: false,
  toggleChat: () => set((state) => ({ chatOpen: !state.chatOpen })),

  // Speaking
  isRecording: false,
  setRecording: (recording) => set({ isRecording: recording }),

  // Notifications
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}))
