
import React, { useState, useEffect } from 'react';
import { Household, Member, Gender, Relationship } from '../types';
import TrashIcon from './icons/TrashIcon';
import PlusIcon from './icons/PlusIcon';
import MaleIcon from './icons/MaleIcon';
import FemaleIcon from './icons/FemaleIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface HouseholdFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (household: Household) => void;
  householdToEdit?: Household | null;
}

const HouseholdFormModal: React.FC<HouseholdFormModalProps> = ({ isOpen, onClose, onSave, householdToEdit }) => {
  const [householdData, setHouseholdData] = useState<Household>({
    id: '',
    stt: 0,
    apartmentNumber: '',
    headOfHouseholdName: '',
    headOfHouseholdDob: '',
    headOfHouseholdGender: Gender.None,
    phone: '',
    notes: '',
    members: []
  });

  useEffect(() => {
    if (householdToEdit) {
      setHouseholdData(JSON.parse(JSON.stringify(householdToEdit)));
    } else {
      setHouseholdData({
        id: `household_${Date.now()}`,
        stt: 0,
        apartmentNumber: '',
        headOfHouseholdName: '',
        headOfHouseholdDob: '',
        headOfHouseholdGender: Gender.None,
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

  const handleHeadOfHouseholdChange = (field: keyof Household, value: string | Gender) => {
     setHouseholdData(prev => ({ ...prev, [field]: value }));
  }
  
  const handleMemberChange = (memberId: string, field: keyof Member, value: string | Gender) => {
    setHouseholdData(prev => ({
      ...prev,
      members: prev.members.map(m => m.id === memberId ? { ...m, [field]: value } : m)
    }));
  };

  const handleAddMember = () => {
    const newMember: Member = { id: `member_${Date.now()}`, name: '', dob: '', gender: Gender.None, relationship: Relationship.None, phone: '' };
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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        <div className="p-4 md:p-6 border-b">
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">
            {householdToEdit ? 'Chỉnh sửa thông tin' : 'Thêm hộ gia đình mới'}
          </h2>
        </div>
        <form onSubmit={handleSubmit} className="flex-grow overflow-y-auto">
          <div className="p-4 md:p-6 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2">Thông tin chủ hộ</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                  <label htmlFor="headOfHouseholdName" className="block text-sm font-medium text-gray-700 mb-1">Tên chủ hộ</label>
                  <input type="text" name="headOfHouseholdName" value={householdData.headOfHouseholdName} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                  <label htmlFor="headOfHouseholdDob" className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh</label>
                  <input type="date" name="headOfHouseholdDob" value={householdData.headOfHouseholdDob} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Giới tính</label>
                  <div className="flex gap-2 mt-1">
                      <button type="button" onClick={() => handleHeadOfHouseholdChange('headOfHouseholdGender', Gender.Male)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors text-sm font-semibold border ${householdData.headOfHouseholdGender === Gender.Male ? 'bg-blue-500 text-white border-blue-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                          <MaleIcon className="w-4 h-4" /><span>Nam</span>
                      </button>
                      <button type="button" onClick={() => handleHeadOfHouseholdChange('headOfHouseholdGender', Gender.Female)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors text-sm font-semibold border ${householdData.headOfHouseholdGender === Gender.Female ? 'bg-pink-500 text-white border-pink-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                          <FemaleIcon className="w-4 h-4" /><span>Nữ</span>
                      </button>
                  </div>
              </div>
              <div>
                <label htmlFor="apartmentNumber" className="block text-sm font-medium text-gray-700 mb-1">Số căn hộ</label>
                <input type="text" name="apartmentNumber" value={householdData.apartmentNumber} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                <input type="tel" name="phone" value={householdData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                <textarea name="notes" value={householdData.notes} onChange={handleInputChange} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-700 border-b pb-2 pt-4">Danh sách thành viên</h3>
            <div className="space-y-4">
              {householdData.members.map((member, index) => (
                <div key={member.id} className="p-4 border rounded-md bg-gray-50/70">
                  <div className="flex justify-between items-center mb-4">
                      <p className="text-sm font-bold text-gray-600">Thành viên {index + 1}</p>
                      <button type="button" onClick={() => handleRemoveMember(member.id)} className="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition-colors">
                          <TrashIcon />
                      </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                          <label className="block text-xs font-medium text-gray-600">Họ và tên</label>
                          <input type="text" value={member.name} onChange={(e) => handleMemberChange(member.id, 'name', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" required />
                      </div>
                       <div>
                          <label className="block text-xs font-medium text-gray-600">Số điện thoại</label>
                          <input type="tel" value={member.phone || ''} onChange={(e) => handleMemberChange(member.id, 'phone', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-600">Ngày sinh</label>
                          <input type="date" value={member.dob} onChange={(e) => handleMemberChange(member.id, 'dob', e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm" />
                      </div>
                      <div>
                          <label className="block text-xs font-medium text-gray-600">Quan hệ với chủ hộ</label>
                           <div className="relative mt-1">
                                <select value={member.relationship || Relationship.None} onChange={(e) => handleMemberChange(member.id, 'relationship', e.target.value as Relationship)} className="appearance-none w-full px-3 py-2 pr-8 border border-gray-300 rounded-md shadow-sm text-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500">
                                    <option value={Relationship.None}>-- Chọn --</option>
                                    <option value={Relationship.Wife}>Vợ</option>
                                    <option value={Relationship.Husband}>Chồng</option>
                                    <option value={Relationship.Child}>Con</option>
                                    <option value={Relationship.Father}>Bố</option>
                                    <option value={Relationship.Mother}>Mẹ</option>
                                    <option value={Relationship.OlderBrother}>Anh</option>
                                    <option value={Relationship.OlderSister}>Chị</option>
                                    <option value={Relationship.YoungerSibling}>Em</option>
                                    <option value={Relationship.Relative}>Người thân</option>
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                    <ChevronDownIcon className="w-4 h-4" />
                                </div>
                           </div>
                      </div>
                      <div className="sm:col-span-2">
                          <label className="block text-xs font-medium text-gray-600 mb-2">Giới tính</label>
                          <div className="flex gap-2">
                              <button type="button" onClick={() => handleMemberChange(member.id, 'gender', Gender.Male)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors text-sm font-semibold border ${member.gender === Gender.Male ? 'bg-blue-500 text-white border-blue-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                  <MaleIcon className="w-4 h-4" /><span>Nam</span>
                              </button>
                              <button type="button" onClick={() => handleMemberChange(member.id, 'gender', Gender.Female)} className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-md transition-colors text-sm font-semibold border ${member.gender === Gender.Female ? 'bg-pink-500 text-white border-pink-500 shadow' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'}`}>
                                  <FemaleIcon className="w-4 h-4" /><span>Nữ</span>
                              </button>
                          </div>
                      </div>
                  </div>
              </div>
              ))}
              <button type="button" onClick={handleAddMember} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border-2 border-dashed border-gray-300 rounded-md hover:bg-blue-50 transition-colors">
                <PlusIcon className="w-5 h-5" />
                Thêm thành viên
              </button>
            </div>
          </div>
          <div className="p-4 md:p-6 bg-gray-50 border-t flex flex-col sm:flex-row justify-end gap-3">
            <button type="button" onClick={onClose} className="w-full sm:w-auto px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100">Hủy</button>
            <button type="submit" className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HouseholdFormModal;
