import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Household, Gender } from './types';
import HouseholdTable from './components/HouseholdTable';
import HouseholdFormModal from './components/HouseholdFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowDownTrayIcon from './components/icons/ArrowDownTrayIcon';
import ChevronDownIcon from './components/icons/ChevronDownIcon';

const INITIAL_HOUSEHOLDS: Household[] = [
  {
    id: 'household_1',
    stt: 1,
    apartmentNumber: '3202',
    headOfHouseholdName: 'Phan Trọng Phúc',
    phone: '0982243173',
    notes: '1 con gái',
    members: [
      { id: 'member_1_1', name: 'Phan Trọng Phúc', dob: '', gender: Gender.Male },
      { id: 'member_1_2', name: 'Lê Thị Mai Hương', dob: '', gender: Gender.Female },
      { id: 'member_1_3', name: 'Phan Minh Anh', dob: '03/06/2021', gender: Gender.Female },
    ],
  },
];

type SortableKey = 'stt' | 'headOfHouseholdName' | 'apartmentNumber' | 'phone';
type SortDirection = 'asc' | 'desc';

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHousehold, setEditingHousehold] = useState<Household | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<Gender | 'All'>('All');
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
    
    if (genderFilter !== 'All') {
        results = results.filter(household =>
            household.members.some(member => member.gender === genderFilter)
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
  }, [households, searchTerm, genderFilter, sortConfig]);

  const handleExportCSV = () => {
    const headers = ['STT', 'Số căn', 'Chủ hộ', 'SĐT', 'Ghi chú', 'Tên thành viên', 'Ngày sinh', 'Giới tính'];
  
    const rows = sortedAndFilteredHouseholds.flatMap(household => {
      if (household.members.length === 0) {
        return [[
          household.stt,
          household.apartmentNumber,
          household.headOfHouseholdName,
          household.phone,
          household.notes,
          '', '', '' // member details
        ]];
      }
      return household.members.map(member => [
        household.stt,
        household.apartmentNumber,
        household.headOfHouseholdName,
        household.phone,
        household.notes,
        member.name,
        member.dob,
        member.gender
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

  const hasActiveFilters = searchTerm !== '' || genderFilter !== 'All';

  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="container mx-auto p-4 sm:p-6 lg:p-8 pb-24">
        <header className="mb-6 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 tracking-tight">
            Quản lý Hộ gia đình
          </h1>
        </header>
        
        <main>
          <div className="mb-6 bg-white p-4 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative w-full md:flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
                </span>
                <input
                  type="text"
                  placeholder="Tìm kiếm chủ hộ, căn hộ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-gray-700 bg-gray-100 rounded-lg border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                  aria-label="Tìm kiếm hộ gia đình"
                />
              </div>
              
              <div className="flex items-center gap-4">
                <div className="relative w-full sm:w-auto flex-shrink-0">
                  <select
                      value={genderFilter}
                      onChange={(e) => setGenderFilter(e.target.value as Gender | 'All')}
                      className="w-full sm:w-48 pl-4 pr-10 py-2.5 text-gray-700 bg-gray-100 rounded-lg border-transparent appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                      aria-label="Lọc theo giới tính"
                  >
                      <option value="All">Tất cả giới tính</option>
                      <option value={Gender.Male}>Nam</option>
                      <option value={Gender.Female}>Nữ</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
                    <ChevronDownIcon className="w-5 h-5 text-gray-400"/>
                  </div>
                </div>

                <div className="hidden md:block">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-green-50 text-green-700 font-semibold rounded-lg hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                    title="Xuất ra file CSV"
                  >
                    <ArrowDownTrayIcon className="w-5 h-5" />
                    <span>Xuất File</span>
                  </button>
                </div>
              </div>
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

      <button
        onClick={handleOpenAddModal}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-transform transform hover:scale-110 z-30"
        title="Thêm hộ gia đình mới"
        aria-label="Thêm hộ gia đình mới"
      >
        <PlusIcon className="w-7 h-7" />
      </button>
    </div>
  );
};

export default App;
