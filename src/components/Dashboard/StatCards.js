// File: src/components/Dashboard/StatCards.js
import React from 'react';
import { Users, Activity, Clock, CheckCircle } from 'lucide-react';

const StatCards = ({ totalPatients, newDiagnoses, pendingResults, completedReports }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard icon={<Users className="w-8 h-8" />} title="Total Patients" value={totalPatients || 0} color="blue" />
      <StatCard icon={<Activity className="w-8 h-8" />} title="New Diagnoses" value={newDiagnoses || 0} color="green" />
      <StatCard icon={<Clock className="w-8 h-8" />} title="Pending Results" value={pendingResults || 0} color="yellow" />
      <StatCard icon={<CheckCircle className="w-8 h-8" />} title="Completed Reports" value={completedReports || 0} color="indigo" />
    </div>
  );
};

const StatCard = ({ icon, title, value, color }) => (
  <div className={`bg-white p-6 rounded-lg shadow flex items-center justify-between`}>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
    </div>
    <div className={`text-${color}-500 bg-${color}-100 p-3 rounded-full`}>
      {icon}
    </div>
  </div>
);

export default StatCards;