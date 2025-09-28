import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Household, Gender } from './types';
import HouseholdTable from './components/HouseholdTable';
import HouseholdFormModal from './components/HouseholdFormModal';
import ConfirmationModal from './components/ConfirmationModal';
import PlusIcon from './components/icons/PlusIcon';
import SearchIcon from './components/icons/SearchIcon';
import ArrowDownTrayIcon from './components/icons/ArrowDownTrayIcon';

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
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <header className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-800 tracking-tight">
          Quản lý Hộ gia đình
        </h1>
        <p className="text-center text-gray-500 mt-2">
          Danh sách và quản lý thông tin các hộ gia đình.
        </p>
      </header>
      
      <main>
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-4">
            <div className="relative w-full sm:w-auto">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="w-5 h-5 text-gray-400" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full sm:w-60 md:w-80 pl-10 pr-4 py-2.5 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                  searchTerm ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
                }`}
                aria-label="Tìm kiếm hộ gia đình"
              />
            </div>
            <div className="relative w-full sm:w-auto">
              <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as Gender | 'All')}
                  className={`w-full sm:w-48 px-4 py-2.5 border rounded-lg shadow-sm appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200 ${
                    genderFilter !== 'All' ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300'
                  }`}
                  aria-label="Lọc theo giới tính"
              >
                  <option value="All">Tất cả giới tính</option>
                  <option value={Gender.Male}>Nam</option>
                  <option value={Gender.Female}>Nữ</option>
              </select>
            </div>
          </div>
          <div className="flex w-full sm:w-auto justify-center items-center gap-3">
            <button
              onClick={handleExportCSV}
              className="flex w-full sm:w-auto justify-center items-center gap-2 p-3 sm:px-5 sm:py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-transform transform hover:scale-105"
              title="Xuất ra file CSV"
            >
              <ArrowDownTrayIcon />
              <span className="hidden sm:inline">Xuất File</span>
            </button>
            <button
              onClick={handleOpenAddModal}
              className="flex w-full sm:w-auto justify-center items-center gap-2 p-3 sm:px-5 sm:py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform transform hover:scale-105"
              title="Thêm hộ gia đình mới"
            >
              <PlusIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Thêm Hộ</span>
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
