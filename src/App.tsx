import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useExpenseStore } from './context/ExpenseContext';
import { useAuthStore } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Trackers from './pages/Trackers';
import CreateTracker from './pages/CreateTracker';
import ExpenseHistory from './pages/ExpenseHistory';
import Modal from './components/common/Modal';
import ExpenseEntry from './components/trackers/ExpenseEntry';
import GoogleLogin from './components/auth/GoogleLogin';
import type { Expense } from './types';

function AppContent() {
  const { initialize, addExpense } = useExpenseStore();
  const { initialize: initAuth, isAuthenticated } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  useEffect(() => {
    initAuth();
    initialize();
  }, [initialize, initAuth]);
  
  const handleQuickAdd = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `e-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
    addExpense(newExpense);
    setIsQuickAddOpen(false);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-primary-500 rounded-lg flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-2xl">E</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Expense Tracker</h1>
            <p className="text-gray-600 mb-6">Sign in with Google to get started</p>
            <GoogleLogin />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onQuickAdd={() => setIsQuickAddOpen(true)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex relative">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-4 sm:p-6 lg:ml-0 w-full min-w-0">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trackers" element={<Trackers />} />
            <Route path="/create-tracker" element={<CreateTracker />} />
            <Route path="/history" element={<ExpenseHistory />} />
          </Routes>
        </main>
      </div>
      
      {/* Quick Add Modal */}
      <Modal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        title="Quick Add Expense"
        size="lg"
      >
        <ExpenseEntry
          onSubmit={handleQuickAdd}
          onCancel={() => setIsQuickAddOpen(false)}
        />
      </Modal>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
