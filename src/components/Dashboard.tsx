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

const PieChart: React.FC<{ data: { value: number; color: string }[] }> = ({ data }) => {
  const totalValue = data.reduce((acc, d) => acc + d.value, 0);

  if (totalValue === 0) {
    return (
      <div className="w-32 h-32 flex items-center justify-center">
        <svg viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="#e5e7eb" strokeWidth="10" />
        </svg>
      </div>
    );
  }

  let cumulativePercent = 0;

  return (
    <svg viewBox="0 0 100 100" className="w-32 h-32">
      {data.map((slice, index) => {
        const percent = (slice.value / totalValue) * 100;
        const dashArray = `${percent} ${100 - percent}`;
        const dashOffset = -cumulativePercent;
        cumulativePercent += percent;

        return (
          <circle
            key={index}
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={slice.color}
            strokeWidth="10"
            strokeDasharray={dashArray}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 50 50)"
            className="transition-all duration-500"
          />
        );
      })}
    </svg>
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
  
  const pieChartData = [
    { value: stats.maleChildren, color: '#3b82f6' }, // blue-500
    { value: stats.femaleChildren, color: '#ec4899' }, // pink-500
  ];

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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <div className="flex-shrink-0">
              <PieChart data={pieChartData} />
            </div>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-blue-500"></span>
                <div>
                  <span className="font-semibold">Nam:</span>
                  <span className="ml-2">{stats.maleChildren} ({malePercentage.toFixed(1)}%)</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-pink-500"></span>
                 <div>
                  <span className="font-semibold">Nữ:</span>
                  <span className="ml-2">{stats.femaleChildren} ({femalePercentage.toFixed(1)}%)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;