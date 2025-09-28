import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Household, Relationship } from './types';
import HouseholdTable from './components/HouseholdTable';
import HouseholdFormModal from './components/HouseholdFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowDownTrayIcon from './components/icons/ArrowDownTrayIcon';
import Dashboard from './components/Dashboard';
import { Gender } from './types';
import Bars3Icon from './components/icons/Bars3Icon';
import ChartBarIcon from './components/icons/ChartBarIcon';


const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'household_1',
    stt: 1,
    apartmentNumber: '3202',
    headOfHouseholdName: 'Phan Trọng Phúc',
    phone: '0982243173',
    notes: '1 con gái',
    members: [
      { id: 'member_1_2', name: 'Lê Thị Mai Hương', dob: '1992-05-10', gender: Gender.Female, relationship: Relationship.Wife },
      { id: 'member_1_3', name: 'Phan Minh Anh', dob: '2021-06-03', gender: Gender.Female, relationship: Relationship.Child },
    ],
  },
];

type SortableKey = 'stt' | 'headOfHouseholdName' | 'apartmentNumber' | 'phone';
type SortDirection = 'asc' | 'desc';
type ActiveView = 'list' | 'dashboard';

const App: React.FC = () => {
  const [households, setHouseholds] = useState<Household[]>(() => {
    try {
      const savedHouseholds = window.localStorage.getItem('households');
      if (savedHouseholds) {
        return JSON.parse(savedHouseholds);
      }
    } catch (error) {
      console.error('Could not load households from localStorage', error);
    }
    return INITIAL_HOUSEHOLDS;
  });

  const [activeView, setActiveView] = useState<ActiveView>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortableKey; direction: SortDirection }>({ key: 'stt', direction: 'asc' });
  const [householdToDeleteId, setHouseholdToDeleteId] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('households', JSON.stringify(households));
    } catch (error) {
      console.error('Could not save households to localStorage', error);
    }
  }, [households]);

  const handleOpenAddModal = () => {
    setEditingHousehold(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (household: Household) => {
    setEditingHousehold(household);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingHousehold(null);
  };

  const handleSaveHousehold = useCallback((householdToSave: Household) => {
    setHouseholds(prev => {
      const exists = prev.some(h => h.id === householdToSave.id);
      if (exists) {
        return prev.map(h => (h.id === householdToSave.id ? householdToSave : h));
      } else {
        const maxStt = prev.length > 0 ? Math.max(...prev.map(h => h.stt)) : 0;
        const newHousehold = { ...householdToSave, stt: maxStt + 1 };
        return [...prev, newHousehold];
      }
    });
  }, []);

  const handleRequestDelete = useCallback((householdId: string) => {
    setHouseholdToDeleteId(householdId);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (householdToDeleteId) {
      setHouseholds(prev => prev.filter(h => h.id !== householdToDeleteId));
      setHouseholdToDeleteId(null);
    }
  }, [householdToDeleteId]);

  const handleCancelDelete = useCallback(() => {
    setHouseholdToDeleteId(null);
  }, []);
  
  const handleSort = (key: SortableKey) => {
    let direction: SortDirection = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredHouseholds = useMemo(() => {
    let results = [...households];
    
    if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        results = results.filter(household => 
          household.headOfHouseholdName.toLowerCase().includes(lowerCaseSearchTerm) ||
          household.apartmentNumber.toLowerCase().includes(lowerCaseSearchTerm) ||
          household.phone.toLowerCase().includes(lowerCaseSearchTerm) ||
          household.members.some(member => 
            member.name.toLowerCase().includes(lowerCaseSearchTerm)
          )
        );
    }

    results.sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      const directionMultiplier = sortConfig.direction === 'asc' ? 1 : -1;

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * directionMultiplier;
      }
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * directionMultiplier;
      }
      return 0;
    });

    return results;
  }, [households, searchTerm, sortConfig]);

  const formatDateForExport = (dateStr: string) => {
    if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || '';
    const [year, month, day] = dateStr.split('-');
    return `${day}/${month}/${year}`;
  };

  const handleExportCSV = () => {
    const headers = ['STT', 'Số căn', 'Chủ hộ', 'SĐT', 'Ghi chú', 'Tên thành viên', 'Ngày sinh', 'Giới tính', 'Quan hệ'];
  
    const rows = sortedAndFilteredHouseholds.flatMap(household => {
      const otherMembers = household.members.filter(m => m.name !== household.headOfHouseholdName);
      if (otherMembers.length === 0) {
        return [[
          household.stt,
          household.apartmentNumber,
          household.headOfHouseholdName,
          household.phone,
          household.notes,
          '', '', '', ''
        ]];
      }
      return otherMembers.map(member => [
        household.stt,
        household.apartmentNumber,
        household.headOfHouseholdName,
        household.phone,
        household.notes,
        member.name,
        formatDateForExport(member.dob),
        member.gender,
        member.relationship || ''
      ]);
    });
  
    const escapeCsvCell = (cell: any): string => {
      const cellStr = String(cell ?? '');
      if (/[",\n\r]/.test(cellStr)) {
        return `"${cellStr.replace(/"/g, '""')}"`;
      }
      return cellStr;
    };
  
    const csvContent = [
      headers.map(escapeCsvCell).join(','),
      ...rows.map(row => row.map(escapeCsvCell).join(','))
    ].join('\n');
  
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'danh_sach_ho_gia_dinh.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const hasActiveFilters = searchTerm !== '';
  
  const NavButton: React.FC<{
    view: ActiveView;
    icon: React.ReactNode;
    label: string;
    isSidebar?: boolean;
  }> = ({ view, icon, label, isSidebar = false }) => {
    const isActive = activeView === view;
    const baseClasses = "transition-colors focus:outline-none";
    
    if (isSidebar) {
      return (
        <button
          onClick={() => setActiveView(view)}
          className={`${baseClasses} p-3 rounded-lg focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
            isActive ? 'bg-blue-100 text-blue-600' : 'text-gray-500 hover:bg-gray-100'
          }`}
          aria-label={label}
          title={label}
        >
          {icon}
        </button>
      );
    }

    return (
       <button
        onClick={() => setActiveView(view)}
        className={`${baseClasses} flex flex-col items-center justify-center w-full pt-2 pb-1 rounded-md`}
        aria-label={label}
      >
        <div className={`p-1 rounded-full ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>
           {icon}
        </div>
        <span className={`text-xs mt-1 font-medium ${isActive ? 'text-blue-600' : 'text-gray-500'}`}>{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <nav className="hidden md:flex w-20 bg-white shadow-md p-4 flex-col items-center gap-6 pt-8">
        <NavButton view="list" icon={<Bars3Icon className="w-7 h-7" />} label="Danh sách" isSidebar />
        <NavButton view="dashboard" icon={<ChartBarIcon className="w-7 h-7" />} label="Thống kê" isSidebar />
      </nav>

      {/* Main Content */}
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          <header className="mb-6 text-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
              Quản lý Hộ gia đình
            </h1>
          </header>
          
          {activeView === 'list' && (
            <>
              <div className="mb-6 flex flex-row items-center gap-4">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm chủ hộ, căn hộ..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    aria-label="Tìm kiếm hộ gia đình"
                  />
                </div>
                
                <div className="flex-shrink-0">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                      title="Xuất ra file CSV"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
                      <span className="hidden sm:inline">Xuất File</span>
                    </button>
                </div>
              </div>
              
              <HouseholdTable
                households={sortedAndFilteredHouseholds}
                onEdit={handleOpenEditModal}
                onDelete={handleRequestDelete}
                hasActiveFilters={hasActiveFilters}
                sortConfig={sortConfig}
                onSort={handleSort}
              />
            </>
          )}

          {activeView === 'dashboard' && <Dashboard households={households} />}
        </div>
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white shadow-[0_-2px_5px_rgba(0,0,0,0.08)] flex justify-around items-center z-40">
        <NavButton view="list" icon={<Bars3Icon className="w-6 h-6" />} label="Danh sách" />
        <NavButton view="dashboard" icon={<ChartBarIcon className="w-6 h-6" />} label="Thống kê" />
      </nav>

      <HouseholdFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveHousehold}
        householdToEdit={editingHousehold}
      />

      <ConfirmationModal
        isOpen={!!householdToDeleteId}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa hộ gia đình này không? Hành động này không thể được hoàn tác."
      />

      {activeView === 'list' && (
        <button
          onClick={handleOpenAddModal}
          className="fixed bottom-20 md:bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110 z-30"
          title="Thêm hộ gia đình mới"
          aria-label="Thêm hộ gia đình mới"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      )}
    </div>
  );
};

export default App;
