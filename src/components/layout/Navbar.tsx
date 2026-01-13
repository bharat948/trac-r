import { Plus, Menu } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

interface NavbarProps {
  onQuickAdd?: () => void;
  onMenuClick?: () => void;
}

export default function Navbar({ onQuickAdd, onMenuClick }: NavbarProps) {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 active:bg-gray-200 transition-colors touch-manipulation"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">E</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">
                Expense Tracker
              </span>
            </Link>
          </div>
          
          {/* Right side */}
          <div className="flex items-center gap-3">
            {onQuickAdd && (
              <Button
                onClick={onQuickAdd}
                size="sm"
                className="flex items-center gap-1 sm:gap-2 touch-manipulation"
              >
                <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden xs:inline sm:inline">Quick Add</span>
              </Button>
            )}
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-primary-600 font-semibold text-sm">U</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

