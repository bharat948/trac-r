import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useExpenseStore } from './context/ExpenseContext';
import { ToastProvider } from './components/common/Toast';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Dashboard from './pages/Dashboard';
import Trackers from './pages/Trackers';
import CreateTracker from './pages/CreateTracker';
import ExpenseHistory from './pages/ExpenseHistory';
import Modal from './components/common/Modal';
import ExpenseEntry from './components/trackers/ExpenseEntry';
import type { Expense } from './types';

function AppContent() {
  const { initialize, addExpense } = useExpenseStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  
  useEffect(() => {
    initialize();
  }, [initialize]);
  
  const handleQuickAdd = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `e-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
    addExpense(newExpense);
    setIsQuickAddOpen(false);
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onQuickAdd={() => setIsQuickAddOpen(true)}
        onMenuClick={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className="flex-1 p-6 lg:ml-0">
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
