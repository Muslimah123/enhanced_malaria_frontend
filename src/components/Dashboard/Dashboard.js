// src/components/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { getTotalPatients,getUserProfile, logout, getDashboardStats, getChartData } from '../../services/api';
import Sidebar from './Sidebar';
import Header from './Header';
import Overview from './Overview';
import PatientManagement from './PatientManagement';
import Visits from './Visits';
// import Diagnostics from './Diagnostics';
import Analytics from './Analytics';
import PerformanceDashboard from './PerformanceDashboard';
import UserProfileModal from '../Modals/UserProfileModal';
import AdvancedFloatingChat from './AdvancedFloatingChat'; 
console.log(Overview);



const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [dashboardStats, setDashboardStats] = useState({});
  const [chartData, setChartData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userProfile = await getUserProfile();
        setUser(userProfile);
        const stats = await getDashboardStats();
        setDashboardStats(stats);
        const chartData = await getChartData();
        setChartData(chartData);
      } catch (error) {
        console.error('Error fetching data:', error);
        alert('Failed to fetch dashboard data. Please try again.');
      }
    };

    fetchData();
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      alert('Logout failed. Please try again.');
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          user={user} 
          setIsProfileModalOpen={setIsProfileModalOpen} 
          handleLogout={handleLogout}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Routes>
          <Route index element={<Overview stats={dashboardStats} chartData={chartData} />} />
          <Route path="patients" element={<PatientManagement />} />
          <Route path="visits" element={<Visits />} />
         {/* <Route path="diagnostics" element={<Diagnostics />} /> */}
         <Route path="analytics" element={<Analytics />} />
         {/* <Route path="analytics" element={<Analytics />} /> */}
         {/* <Route path="reports" element={<Reports />} /> */}
         <Route path="/performance" element={<PerformanceDashboard />} />
          </Routes>
        </main>
        <AdvancedFloatingChat />
      </div>
      <UserProfileModal 
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
      />
    </div>
  );
};

export default Dashboard;