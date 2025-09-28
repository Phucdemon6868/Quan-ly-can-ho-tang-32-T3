
import React, { useState } from 'react';
import { Household, Member, Gender } from '../types';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';
import ChevronUpIcon from './icons/ChevronUpIcon';
import SortAscIcon from './icons/SortAscIcon';
import SortDescIcon from './icons/SortDescIcon';
import BuildingOfficeIcon from './icons/BuildingOfficeIcon';
import PhoneIcon from './icons/PhoneIcon';
import UsersIcon from './icons/UsersIcon';
import ClipboardDocumentListIcon from './icons/ClipboardDocumentListIcon';
import MaleIcon from './icons/MaleIcon';
import FemaleIcon from './icons/FemaleIcon';

type SortableKey = 'stt' | 'headOfHouseholdName' | 'apartmentNumber' | 'phone';

interface HouseholdTableProps {
  households: Household[];
  onEdit: (household: Household) => void;
  onDelete: (householdId: string) => void;
  hasActiveFilters: boolean;
  sortConfig: { key: SortableKey; direction: string };
  onSort: (key: SortableKey) => void;
}

const formatDateForDisplay = (dateStr: string) => {
  if (!dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr || 'N/A';
  const [year, month, day] = dateStr.split('-');
  return `${day}/${month}/${year}`;
};

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
                    <td className="px-6 py-4 align-middle text-red-600 font-semibold">
                      <div className="flex items-center gap-2">
                        <span>{household.headOfHouseholdName}</span>
                        {household.headOfHouseholdGender === Gender.Male && <MaleIcon className="w-4 h-4 text-blue-500" />}
                        {household.headOfHouseholdGender === Gender.Female && <FemaleIcon className="w-4 h-4 text-pink-500" />}
                      </div>
                    </td>
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
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quan hệ</th>
                             <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">SĐT</th>
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Ngày Sinh</th>
                            <th className="px-6 py-2 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Giới tính</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {household.members.map(member => (
                            <tr key={member.id}>
                              <td className="px-6 py-3 whitespace-nowrap">{member.name}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{member.relationship || 'N/A'}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{member.phone || 'N/A'}</td>
                              <td className="px-6 py-3 whitespace-nowrap">{formatDateForDisplay(member.dob)}</td>
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
            <div key={household.id} className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300 hover:shadow-lg">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <BuildingOfficeIcon className="w-5 h-5 text-gray-400" />
                    <span className="font-semibold">Số căn: {household.apartmentNumber}</span>
                    <span className="text-gray-400">|</span>
                    <span className="font-semibold">STT: {household.stt}</span>
                  </div>
                  <div className="flex items-center space-x-0 flex-shrink-0 -mr-2">
                    <button onClick={() => onEdit(household)} className="text-blue-500 hover:text-blue-700 p-2 rounded-full hover:bg-gray-100" title="Chỉnh sửa"><PencilIcon /></button>
                    <button onClick={() => onDelete(household.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-gray-100" title="Xóa"><TrashIcon /></button>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xl font-bold text-blue-700 truncate flex items-center gap-2" title={household.headOfHouseholdName}>
                    <span>{household.headOfHouseholdName}</span>
                    {household.headOfHouseholdGender === Gender.Male && <MaleIcon className="w-5 h-5 text-blue-500" />}
                    {household.headOfHouseholdGender === Gender.Female && <FemaleIcon className="w-5 h-5 text-pink-500" />}
                  </p>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3 text-sm">
                  <div className="flex items-center gap-3 text-gray-700">
                    <UsersIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span>{household.members.length} thành viên</span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-700">
                    <PhoneIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    <span>{household.phone || 'Chưa có SĐT'}</span>
                  </div>
                  {household.notes && (
                    <div className="flex items-start gap-3 text-gray-700">
                      <ClipboardDocumentListIcon className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                      <span>{household.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {household.members.length > 0 && (
                <>
                  <button onClick={() => toggleRow(household.id)} className="w-full border-t border-gray-200 px-5 py-3 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-100/70 flex justify-between items-center transition-colors">
                    <span>{expandedRows.has(household.id) ? 'Ẩn chi tiết' : `Xem chi tiết thành viên`}</span>
                    {expandedRows.has(household.id) ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />}
                  </button>
                  {expandedRows.has(household.id) && (
                    <div className="p-4 bg-gray-50 border-t border-gray-200">
                      <div className="space-y-3">
                        {household.members.map(member => (
                          <div key={member.id} className="text-sm p-3 bg-white rounded-lg border border-gray-200">
                             <div className="flex justify-between items-center">
                                <div>
                                    <p className="text-gray-800 font-semibold">{member.name} <span className="text-gray-500 font-normal">({member.relationship || 'Chưa rõ'})</span></p>
                                    <p className="text-gray-500 text-xs mt-1">Ngày sinh: {formatDateForDisplay(member.dob)}</p>
                                     <p className="text-gray-500 text-xs mt-1">SĐT: {member.phone || 'N/A'}</p>
                                </div>
                                <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${genderCellStyle(member.gender)}`}>
                                    {member.gender || 'N/A'}
                                </span>
                            </div>
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
