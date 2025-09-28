import React, { useState, useEffect } from 'react';
import { Household, Member, Gender } from '../types';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';

interface HouseholdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (household: Household) => void;
  householdToEdit?: Household | null;
}

const HouseholdFormModal: React.FC<HouseholdFormModalProps> = ({ isOpen, onClose, onSave, householdToEdit }) => {
  const [householdData, setHouseholdData] = useState<Household>({
    id: '',
    stt: 0, // STT will be assigned by the parent component
    apartmentNumber: '',
    headOfHouseholdName: '',
    phone: '',
    notes: '',
    members: []
  });

  useEffect(() => {
    if (householdToEdit) {
      setHouseholdData(JSON.parse(JSON.stringify(householdToEdit))); // Deep copy
    } else {
      setHouseholdData({
        id: `household_${Date.now()}`,
        stt: 0, // Placeholder, will be set by App component
        apartmentNumber: '',
        headOfHouseholdName: '',
        phone: '',
        notes: '',
        members: []
      });
    }
  }, [householdToEdit, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setHouseholdData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMemberChange = (memberId: string, field: keyof Member, value: string) => {
    setHouseholdData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, [field]: value } : m)
    }));
  };

  const handleAddMember = () => {
    const newMember: Member = { id: `member_${Date.now()}`, name: '', dob: '', gender: Gender.None };
    setHouseholdData(prev => ({ ...prev, members: [...prev.members, newMember] }));
  };

  const handleRemoveMember = (memberId: string) => {
    setHouseholdData(prev => ({ ...prev, members: prev.members.filter(m => m.id !== memberId) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!householdData.headOfHouseholdName || !householdData.apartmentNumber) {
        alert("Vui lòng điền tên chủ hộ và số căn hộ.");
        return;
    }
    onSave(householdData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {householdToEdit ? 'Chỉnh sửa thông tin hộ gia đình' : 'Thêm hộ gia đình mới'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin chung</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="headOfHouseholdName" className="block text-sm font-medium text-gray-700 mb-1">Tên chủ hộ</label>
                <input type="text" name="headOfHouseholdName" value={householdData.headOfHouseholdName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 mb-1">Số căn hộ</label>
                <input type="text" name="apartmentNumber" value={householdData.apartmentNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" name="phone" value={householdData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
              </div>
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
              <textarea name="notes" value={householdData.notes} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500" />
            </div>

            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Danh sách thành viên</h3>
            <div className="space-y-4">
              {householdData.members.map((member, index) => (
                <div key={member.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-md relative bg-gray-50">
                   <div className="md:col-span-4 text-sm font-bold text-gray-600">Thành viên {index + 1}</div>
                   <div>
                    <label className="block text-xs font-medium text-gray-600">Họ và tên</label>
                    <input type="text" value={member.name} onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" required />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Ngày sinh</label>
                    <input type="text" value={member.dob} placeholder="dd/mm/yyyy" onChange={(e) => handleMemberChange(member.id, 'dob', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600">Giới tính</label>
                    <select value={member.gender} onChange={(e) => handleMemberChange(member.id, 'gender', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm">
                      <option value={Gender.None}></option>
                      <option value={Gender.Male}>Nam</option>
                      <option value={Gender.Female}>Nữ</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-100">
                      <TrashIcon />
                    </button>
                  </div>
                </div>
              ))}
              <button type="button" onClick={handleAddMember} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-indigo-600 border-2 border-dashed border-gray-300 rounded-md hover:bg-indigo-50 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Thêm thành viên
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6 bg-gray-50 border-t flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseholdFormModal;
