import React, { useMemo } from 'react';
import { Household, Relationship, Gender } from '../types';
import HomeModernIcon from './icons/HomeModernIcon';
import UsersGroupIcon from './icons/UsersGroupIcon';
import FaceSmileIcon from './icons/FaceSmileIcon';

interface DashboardProps {
  households: Household[];
}

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: number | string;
  color: string;
}> = ({ icon, label, value, color }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow flex items-center gap-5">
      <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-gray-800">{value}</div>
        <div className="text-sm font-medium text-gray-500">{label}</div>
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ households }) => {
  const stats = useMemo(() => {
    const totalHouseholds = households.length;
    const totalResidents = households.reduce((acc, curr) => acc + curr.members.length, 0);
    
    const allChildren = households
      .flatMap(h => h.members)
      .filter(m => m.relationship === Relationship.Child);
      
    const totalChildren = allChildren.length;
    const maleChildren = allChildren.filter(c => c.gender === Gender.Male).length;
    const femaleChildren = allChildren.filter(c => c.gender === Gender.Female).length;

    return { totalHouseholds, totalResidents, totalChildren, maleChildren, femaleChildren };
  }, [households]);

  const malePercentage = stats.totalChildren > 0 ? (stats.maleChildren / stats.totalChildren) * 100 : 0;
  const femalePercentage = stats.totalChildren > 0 ? (stats.femaleChildren / stats.totalChildren) * 100 : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={<HomeModernIcon className="w-6 h-6 text-cyan-600" />}
          label="Tổng số hộ"
          value={stats.totalHouseholds}
          color="bg-cyan-100"
        />
        <StatCard
          icon={<UsersGroupIcon className="w-6 h-6 text-violet-600" />}
          label="Tổng số nhân khẩu"
          value={stats.totalResidents}
          color="bg-violet-100"
        />
        <StatCard
          icon={<FaceSmileIcon className="w-6 h-6 text-amber-600" />}
          label="Tổng số trẻ em"
          value={stats.totalChildren}
          color="bg-amber-100"
        />
      </div>

      {stats.totalChildren > 0 && (
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Phân bổ giới tính trẻ em</h3>
          
          <div className="w-full bg-gray-200 rounded-full h-4 my-2 flex overflow-hidden">
            <div 
              className="bg-blue-500 h-4 transition-all duration-500" 
              style={{ width: `${malePercentage}%` }}
              title={`Nam: ${malePercentage.toFixed(1)}%`}
            ></div>
            <div 
              className="bg-pink-500 h-4 transition-all duration-500" 
              style={{ width: `${femalePercentage}%` }}
              title={`Nữ: ${femalePercentage.toFixed(1)}%`}
            ></div>
          </div>
          
          <div className="flex justify-between items-center mt-3 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span>Nam: <strong>{stats.maleChildren}</strong> ({malePercentage.toFixed(1)}%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              <span>Nữ: <strong>{stats.femaleChildren}</strong> ({femalePercentage.toFixed(1)}%)</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;