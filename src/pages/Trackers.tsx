import { useState } from 'react';
import { useExpenseStore } from '../context/ExpenseContext';
import TrackerCard from '../components/trackers/TrackerCard';
import Modal from '../components/common/Modal';
import ExpenseEntry from '../components/trackers/ExpenseEntry';
import TrackerForm from '../components/trackers/TrackerForm';
import Button from '../components/common/Button';
import { useToast } from '../components/common/Toast';
import type { Expense, Tracker } from '../types';

export default function Trackers() {
  const { trackers, updateTracker, deleteTracker, addExpense } = useExpenseStore();
  const { showToast } = useToast();
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isEditTrackerOpen, setIsEditTrackerOpen] = useState(false);
  const [selectedTracker, setSelectedTracker] = useState<Tracker | null>(null);
  const [selectedTrackerId, setSelectedTrackerId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const activeTrackers = trackers.filter(t => t.isActive);
  const filteredTrackers = activeTrackers.filter(t =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleAddExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expense,
      id: `e-${Date.now()}-${Math.random().toString(36).substring(7)}`,
    };
    addExpense(newExpense);
    showToast('Expense added successfully', 'success');
    setIsAddExpenseOpen(false);
    setSelectedTrackerId(null);
  };
  
  const handleEditTracker = (tracker: Tracker) => {
    setSelectedTracker(tracker);
    setIsEditTrackerOpen(true);
  };
  
  const handleUpdateTracker = (trackerData: Omit<Tracker, 'id' | 'createdAt'>) => {
    if (selectedTracker) {
      updateTracker(selectedTracker.id, trackerData);
      showToast('Tracker updated successfully', 'success');
      setIsEditTrackerOpen(false);
      setSelectedTracker(null);
    }
  };
  
  const handleDeleteTracker = (id: string) => {
    if (confirm('Are you sure you want to delete this tracker? All associated expenses will also be deleted.')) {
      deleteTracker(id);
      showToast('Tracker deleted successfully', 'success');
    }
  };
  
  const handleAddExpenseClick = (trackerId: string) => {
    setSelectedTrackerId(trackerId);
    setIsAddExpenseOpen(true);
  };
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Trackers</h1>
          <p className="text-gray-600 mt-1">Manage your expense trackers</p>
        </div>
        <Button onClick={() => setIsAddExpenseOpen(true)}>
          Quick Add Expense
        </Button>
      </div>
      
      {/* Search */}
      <div>
        <input
          type="text"
          placeholder="Search trackers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      
      {/* Trackers Grid */}
      {filteredTrackers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTrackers.map((tracker) => (
            <TrackerCard
              key={tracker.id}
              tracker={tracker}
              onEdit={handleEditTracker}
              onDelete={handleDeleteTracker}
              onAddExpense={handleAddExpenseClick}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">
            {searchQuery ? 'No trackers found matching your search' : 'No trackers yet'}
          </p>
          {!searchQuery && (
            <Button onClick={() => window.location.href = '/create-tracker'}>
              Create Your First Tracker
            </Button>
          )}
        </div>
      )}
      
      {/* Add Expense Modal */}
      <Modal
        isOpen={isAddExpenseOpen}
        onClose={() => {
          setIsAddExpenseOpen(false);
          setSelectedTrackerId(null);
        }}
        title="Add Expense"
        size="lg"
      >
        <ExpenseEntry
          trackerId={selectedTrackerId || undefined}
          onSubmit={handleAddExpense}
          onCancel={() => {
            setIsAddExpenseOpen(false);
            setSelectedTrackerId(null);
          }}
        />
      </Modal>
      
      {/* Edit Tracker Modal */}
      <Modal
        isOpen={isEditTrackerOpen}
        onClose={() => {
          setIsEditTrackerOpen(false);
          setSelectedTracker(null);
        }}
        title="Edit Tracker"
        size="lg"
      >
        {selectedTracker && (
          <TrackerForm
            tracker={selectedTracker}
            onSubmit={handleUpdateTracker}
            onCancel={() => {
              setIsEditTrackerOpen(false);
              setSelectedTracker(null);
            }}
          />
        )}
      </Modal>
    </div>
  );
}

