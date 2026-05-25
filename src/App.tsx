import { useEffect } from 'react'
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom'
import { ConfigDrawer } from '@/components/ConfigDrawer'
import { TopBar } from '@/components/TopBar'
import Home from '@/pages/Home'
import HistoryPage from '@/pages/History'
import { useComfyStore } from '@/store/useComfyStore'

function AppFrame() {
  const {
    connection,
    isConnected,
    connectionMessage,
    theme,
    isConfigOpen,
    toggleTheme,
    setConfigOpen,
    updateConnection,
    testConnection,
  } = useComfyStore()

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(theme)
  }, [theme])

  return (
    <div className="min-h-screen px-4 py-4 md:px-6 lg:px-8">
      <div className="mx-auto max-w-[1680px]">
        <TopBar
          isConnected={isConnected}
          connectionMessage={connectionMessage}
          isDark={theme === 'dark'}
          onToggleTheme={toggleTheme}
          onOpenConfig={() => setConfigOpen(true)}
        />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <ConfigDrawer
        open={isConfigOpen}
        connection={connection}
        isConnected={isConnected}
        onClose={() => setConfigOpen(false)}
        onChange={updateConnection}
        onTest={testConnection}
      />
    </div>
  )
}

export default function App() {
  return (
    <Router>
      <AppFrame />
    </Router>
  )
}
