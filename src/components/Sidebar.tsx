import React from 'react';
import LogoIcon from './icons/LogoIcon';
import TableCellsIcon from './icons/TableCellsIcon';
import ChartPieIcon from './icons/ChartPieIcon';
import XMarkIcon from './icons/XMarkIcon';

type ActiveView = 'list' | 'dashboard';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeView: ActiveView;
  onViewChange: (view: ActiveView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, activeView, onViewChange }) => {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/60 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden="true"
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sidebar-title"
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b">
             <div id="sidebar-title">
                <LogoIcon className="h-10 w-auto" />
             </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-gray-100"
              aria-label="Đóng menu"
            >
              <XMarkIcon className="w-6 h-6" />
            </button>
          </div>
          <nav className="flex-grow p-4 space-y-2">
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onViewChange('list'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base ${
                activeView === 'list'
                  ? 'font-semibold text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <TableCellsIcon className="w-5 h-5" />
              <span>Danh sách hộ gia đình</span>
            </a>
            <a
              href="#"
              onClick={(e) => { e.preventDefault(); onViewChange('dashboard'); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base ${
                activeView === 'dashboard'
                  ? 'font-semibold text-blue-600 bg-blue-50'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ChartPieIcon className="w-5 h-5" />
              <span>Bảng thống kê</span>
            </a>
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
