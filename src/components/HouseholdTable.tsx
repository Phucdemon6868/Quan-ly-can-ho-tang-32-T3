import React, { useState } from 'react';
import { Household, Member, Gender } from '../types';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';
import SortAscIcon from './icons/SortAscIcon';
import SortDescIcon from './icons/SortDescIcon';

type SortableKey = 'stt' | 'headOfHouseholdName' | 'apartmentNumber' | 'phone';

interface HouseholdTableProps {
  households: Household[];
  onEdit: (household: Household) => void;
  onDelete: (householdId: string) => void;
  hasActiveFilters: boolean;
  sortConfig: { key: SortableKey; direction: string };
  onSort: (key: SortableKey) => void;
}

const HouseholdTable: React.FC<HouseholdTableProps> = ({ households, onEdit, onDelete, hasActiveFilters, sortConfig, onSort }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (householdId: string) => {
    setExpandedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(householdId)) {
        newSet.delete(householdId);
      } else {
        newSet.add(householdId);
      }
      return newSet;
    });
  };

  const genderCellStyle = (gender: Gender) => {
    switch (gender) {
      case Gender.Male:
        return 'bg-blue-100 text-blue-800';
      case Gender.Female:
        return 'bg-pink-100 text-pink-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getEmptyStateMessage = () => {
    if (hasActiveFilters) {
      return <span>Không tìm thấy hộ gia đình nào phù hợp với tiêu chí lọc.</span>;
    }
    return 'Chưa có dữ liệu hộ gia đình.';
  };

  const numberOfColumns = 8;

  const SortableHeader: React.FC<{ title: string; sortKey: SortableKey }> = ({ title, sortKey }) => {
    const isSorting = sortConfig.key === sortKey;
    const icon = isSorting 
      ? (sortConfig.direction === 'asc' ? <SortAscIcon className="w-3.5 h-3.5" /> : <SortDescIcon className="w-3.5 h-3.5" />)
      : null;
    
    return (
       <button onClick={() => onSort(sortKey)} className="flex items-center gap-2 w-full text-left font-bold text-green-800 hover:text-green-600 transition-colors focus:outline-none">
        {title}
        {icon}
      </button>
    );
  };

  return (
    <>
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-green-100">
            <tr>
              <th scope="col" className="px-2 py-3 text-center text-xs font-bold text-green-800 uppercase tracking-wider w-10"></th>
              <th scope="col" className="px-4 py-3 text-left text-xs uppercase tracking-wider w-12"><SortableHeader title="STT" sortKey="stt" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider"><SortableHeader title="Chủ hộ" sortKey="headOfHouseholdName" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider"><SortableHeader title="Số căn" sortKey="apartmentNumber" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Thành viên</th>
              <th scope="col" className="px-6 py-3 text-left text-xs uppercase tracking-wider"><SortableHeader title="SĐT" sortKey="phone" /></th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Ghi Chú</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-bold text-green-800 uppercase tracking-wider">Hành động</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {households.length === 0 ? (
              <tr><td colSpan={numberOfColumns} className="px-6 py-12 text-center text-gray-500">{getEmptyStateMessage()}</td></tr>
            ) : (
              households.map((household) => (
                <React.Fragment key={household.id}>
                  <tr className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-2 py-4 text-center">
                      {household.members.length > 0 && (
                        <button onClick={() => toggleRow(household.id)} className="p-1 rounded-full hover:bg-gray-200 transition-colors">
                          {expandedRows.has(household.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-4 align-middle font-medium text-gray-900 text-center">{household.stt}</td>
                    <td className="px-6 py-4 align-middle text-red-600 font-semibold">{household.headOfHouseholdName}</td>
                    <td className="px-6 py-4 align-middle">{household.apartmentNumber}</td>
                    <td className="px-6 py-4 align-middle">
                      <span className="px-2.5 py-1 text-sm font-semibold rounded-full bg-gray-200 text-gray-700">{household.members.length}</span>
                    </td>
                    <td className="px-6 py-4 align-middle">{household.phone}</td>
                    <td className="px-6 py-4 align-middle">{household.notes}</td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex items-center space-x-3">
                        <button onClick={() => onEdit(household)} className="text-blue-600 hover:text-blue-900 transition-colors duration-150" title="Chỉnh sửa"><PencilIcon /></button>
                        <button onClick={() => onDelete(household.id)} className="text-red-600 hover:text-red-900 transition-colors duration-150" title="Xóa"><TrashIcon /></button>
                      </div>
                    </td>
                  </tr>
                  {expandedRows.has(household.id) && household.members.length > 0 && (
                    <tr className="bg-gray-50"><td colSpan={numberOfColumns} className="p-0">
                      <div className="p-4">
                        <h4 className="text-md font-semibold text-gray-700 mb-3 ml-2">Chi tiết thành viên</h4>
                        <table className="min-w-full"><thead className="bg-gray-200">
                          <tr>
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Họ và tên</th>
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày Sinh</th>
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giới tính</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {household.members.map(member => (
                            <tr key={member.id}>
                              <td className="px-6 py-3 whitespace-nowrap">{member.name}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{member.dob}</td>
                              <td className="px-6 py-3 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${genderCellStyle(member.gender)}`}>{member.gender}</span></td>
                            </tr>
                          ))}
                        </tbody></table>
                      </div>
                    </td></tr>
                  )}
                </React.Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {households.length === 0 ? (
          <div className="p-6 text-center text-gray-500 bg-white rounded-lg shadow">
            {getEmptyStateMessage()}
          </div>
        ) : (
          households.map((household) => (
            <div key={household.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-grow min-w-0">
                    <p className="text-lg font-semibold text-red-600 truncate" title={household.headOfHouseholdName}>{household.headOfHouseholdName}</p>
                    <p className="text-sm text-gray-600">Số căn: {household.apartmentNumber}</p>
                  </div>
                  <div className="flex items-center space-x-1 flex-shrink-0 ml-2">
                    <button onClick={() => onEdit(household)} className="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-gray-100" title="Chỉnh sửa"><PencilIcon /></button>
                    <button onClick={() => onDelete(household.id)} className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-gray-100" title="Xóa"><TrashIcon /></button>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-700 grid grid-cols-2 gap-x-4 gap-y-2">
                  <p><span className="font-medium text-gray-500">STT:</span> {household.stt}</p>
                  <p><span className="font-medium text-gray-500">Thành viên:</span> {household.members.length}</p>
                  <p className="col-span-2"><span className="font-medium text-gray-500">SĐT:</span> {household.phone || 'N/A'}</p>
                  {household.notes && <p className="col-span-2 mt-1"><span className="font-medium text-gray-500">Ghi chú:</span> {household.notes}</p>}
                </div>
              </div>

              {household.members.length > 0 && (
                <>
                  <button onClick={() => toggleRow(household.id)} className="w-full border-t border-gray-200 px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-gray-50 flex justify-between items-center transition-colors">
                    <span>{expandedRows.has(household.id) ? 'Ẩn chi tiết thành viên' : `Xem ${household.members.length} thành viên`}</span>
                    {expandedRows.has(household.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
                  </button>
                  {expandedRows.has(household.id) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-4">
                        {household.members.map(member => (
                          <div key={member.id} className="text-sm p-3 bg-white rounded-md border">
                             <div className="flex justify-between items-center">
                                <p className="text-gray-800 font-semibold">{member.name}</p>
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${genderCellStyle(member.gender)}`}>
                                    {member.gender || 'N/A'}
                                </span>
                             </div>
                            <p className="text-gray-600 text-xs mt-1">Ngày sinh: {member.dob || 'N/A'}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default HouseholdTable;
