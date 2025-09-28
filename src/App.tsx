
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Household, Relationship, Gender } from './types';
import HouseholdTable from './components/HouseholdTable';
import HouseholdFormModal from './components/HouseholdFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowDownTrayIcon from './components/icons/ArrowDownTrayIcon';
import Dashboard from './components/Dashboard';
import LogoIcon from './components/icons/LogoIcon';
import Bars3Icon from './components/icons/Bars3Icon';
import Sidebar from './components/Sidebar';


const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'household_1',
    stt: 1,
    apartmentNumber: '32T3',
    headOfHouseholdName: 'Phan Trọng Phúc',
    headOfHouseholdDob: '1990-01-01',
    headOfHouseholdGender: Gender.Male,
    phone: '0982243173',
    notes: 'Unity and Love',
    members: [
      { id: 'member_1_2', name: 'Lê Thị Mai Hương', dob: '1992-05-10', gender: Gender.Female, relationship: Relationship.Wife, phone: '0987654321' },
      { id: 'member_1_3', name: 'Phan Minh Anh', dob: '2021-06-03', gender: Gender.Female, relationship: Relationship.Child, phone: '' },
    ],
  },
   {
    id: 'household_2',
    stt: 2,
    apartmentNumber: '3203',
    headOfHouseholdName: 'Nguyễn Văn A',
    headOfHouseholdDob: '1985-02-20',
    headOfHouseholdGender: Gender.Male,
    phone: '0123456789',
    notes: '',
    members: [
      { id: 'member_2_1', name: 'Trần Thị B', dob: '1995-01-15', gender: Gender.Female, relationship: Relationship.Wife, phone: '' },
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
            member.name.toLowerCase().includes(lowerCaseSearchTerm) ||
            member.phone?.toLowerCase().includes(lowerCaseSearchTerm)
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
    const headers = ['STT', 'Số căn', 'Họ tên', 'Ngày sinh', 'Giới tính', 'Quan hệ', 'SĐT', 'Ghi chú'];
  
    const rows = sortedAndFilteredHouseholds.flatMap(household => {
      const householdRows: (string | number)[][] = [];
      
      householdRows.push([
        household.stt,
        household.apartmentNumber,
        household.headOfHouseholdName,
        formatDateForExport(household.headOfHouseholdDob),
        household.headOfHouseholdGender,
        Relationship.HeadOfHousehold,
        household.phone,
        household.notes,
      ]);

      household.members.forEach(member => {
        householdRows.push([
          household.stt,
          household.apartmentNumber,
          member.name,
          formatDateForExport(member.dob),
          member.gender,
          member.relationship || '',
          member.phone || '',
          ''
        ]);
      });
      
      return householdRows;
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
  
  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
    setIsSidebarOpen(false);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
       <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeView={activeView}
          onViewChange={handleViewChange}
        />

      <header className="fixed top-0 inset-x-0 bg-white/80 backdrop-blur-sm shadow-sm z-30">
        <div className="container mx-auto flex justify-between items-center h-16 px-4">
          <div>
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 rounded-full text-gray-600 hover:bg-gray-200 hover:text-gray-800 transition-colors"
              aria-label="Mở menu"
            >
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>

          <div className="absolute left-1/2 -translate-x-1/2">
            <LogoIcon className="h-14 w-auto" />
          </div>

          <div>
             <button
              onClick={handleOpenAddModal}
              className="p-2 rounded-full text-gray-600 hover:bg-blue-100 hover:text-blue-600 transition-colors"
              title="Thêm hộ gia đình mới"
              aria-label="Thêm hộ gia đình mới"
            >
              <PlusIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="pt-16">
        <div className="container mx-auto p-4 sm:p-6 lg:p-8">
          {activeView === 'list' && (
            <>
              <div className="flex items-center gap-2 sm:gap-4 mb-6">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <SearchIcon className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    type="text"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-gray-700 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    aria-label="Tìm kiếm hộ gia đình"
                  />
                </div>
                
                <div className="flex-shrink-0">
                    <button
                      onClick={handleExportCSV}
                      className="flex items-center justify-center p-2.5 bg-white text-gray-600 border border-gray-200 font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                      title="Xuất ra file CSV"
                    >
                      <ArrowDownTrayIcon className="w-5 h-5" />
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
    </div>
  );
};

export default App;
