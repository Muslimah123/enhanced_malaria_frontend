// import React, { useState, useEffect } from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
// } from 'recharts';
// import {
//   Activity, Users, FileText, AlertTriangle, Bell, TrendingUp, Calendar, Filter, Search, Settings, Map, Clock, ThumbsUp
// } from 'lucide-react';
// import { getTotalPatients, getNotifications, getDashboardStats, getChartData } from '../../services/api';

// const Overview = () => {
//   const [isSettingsOpen, setIsSettingsOpen] = useState(false);
//   const [totalPatients, setTotalPatients] = useState(0);
//   const [notifications, setNotifications] = useState([]);
//   const [showAllNotifications, setShowAllNotifications] = useState(false);  // State to control "View All"
//   const [stats, setStats] = useState({
//     newDiagnoses: 0,
//     pendingResults: 0,
//     completedDiagnoses: 0,
//     avgDiagnosisTime: '3.2 days',
//     patientSatisfaction: '4.7/5'
//   });
//   const [chartData, setChartData] = useState({
//     pieChartData: [],
//     lineChartData: [],
//     areaChartData: []  // Placeholder for patient influx data
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [patientsTotal, notificationsData, dashboardStats, chartDataResponse] = await Promise.all([
//           getTotalPatients(),
//           getNotifications(),
//           getDashboardStats(),
//           getChartData()  // Live data for line chart and potentially patient influx
//         ]);

//         setTotalPatients(patientsTotal);
//         // setNotifications(notificationsData);
//         // Sort notifications by date descending
//         const sortedNotifications = notificationsData.sort(
//           (a, b) => new Date(b.created_at) - new Date(a.created_at)
//         );
//         setNotifications(sortedNotifications);


//         // Mapping live data for statistics
//         setStats({
//           newDiagnoses: dashboardStats.new_diagnoses || 0,
//           pendingResults: dashboardStats.pending_results || 0,
//           completedDiagnoses: dashboardStats.completed_diagnoses || 0,
//           avgDiagnosisTime: '3.2 days',  // Placeholder for now
//           patientSatisfaction: '4.7/5'   // Placeholder for now
//         });

//         // Mapping live data for charts
//         setChartData({
//           pieChartData: [
//             { name: 'Positive', value: dashboardStats.diagnosis_distribution.positive || 0 },
//             { name: 'Negative', value: dashboardStats.diagnosis_distribution.negative || 0 },
//             { name: 'Inconclusive', value: dashboardStats.diagnosis_distribution.inconclusive || 0 }
//           ],
//           lineChartData: chartDataResponse.lineChartData || [],
//           areaChartData: chartDataResponse.areaChartData || [
//             { name: 'Mon', patients: 20 },  // Dummy data for patient influx
//             { name: 'Tue', patients: 28 },
//             { name: 'Wed', patients: 35 },
//             { name: 'Thu', patients: 32 },
//             { name: 'Fri', patients: 38 },
//             { name: 'Sat', patients: 25 },
//             { name: 'Sun', patients: 22 }
//           ]
//         });
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

//   const StatCard = ({ title, value, icon, color, trend }) => (
//     <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
//       <div className="flex items-center justify-between mb-4">
//         <h3 className="text-sm font-medium text-gray-500">{title}</h3>
//         {React.createElement(icon, { className: `h-6 w-6 text-${color}-500` })}
//       </div>
//       <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
//       {trend && (
//         <p className={`text-sm mt-2 ${trend.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
//           {trend.type === 'increase' ? '↑' : '↓'} {trend.value}% from last month
//         </p>
//       )}
//     </div>
//   );

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="mb-6 flex justify-between items-center">
//         <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
//         <div className="flex space-x-4">
//           <div className="relative">
//             <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
//             <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
//           </div>
//           <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
//             <Calendar className="mr-2" /> Date Range
//           </button>
//           <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
//             <Filter className="mr-2" /> Filters
//           </button>
//           <button 
//             className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
//             onClick={() => setIsSettingsOpen(!isSettingsOpen)}
//           >
//             <Settings className="mr-2" /> Settings
//           </button>
//         </div>
//       </div>
      
//       {isSettingsOpen && (
//         <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
//           <h3 className="text-lg font-semibold mb-2">Dashboard Settings</h3>
//           <div className="grid grid-cols-2 gap-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Theme</label>
//               <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
//                 <option>Light</option>
//                 <option>Dark</option>
//                 <option>System</option>
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700">Refresh Rate</label>
//               <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
//                 <option>Real-time</option>
//                 <option>Every 5 minutes</option>
//                 <option>Every 15 minutes</option>
//                 <option>Every 30 minutes</option>
//               </select>
//             </div>
//           </div>
//         </div>
//       )}

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
//         <StatCard title="Total Patients" value={totalPatients} icon={Users} color="blue" trend={{type: 'increase', value: 5}} />
//         <StatCard title="New Diagnoses (30d)" value={stats.newDiagnoses} icon={Activity} color="green" trend={{type: 'increase', value: 12}} />
//         <StatCard title="Pending Results" value={stats.pendingResults} icon={AlertTriangle} color="yellow" trend={{type: 'decrease', value: 3}} />
//         <StatCard title="Completed Diagnoses" value={stats.completedDiagnoses} icon={FileText} color="indigo" trend={{type: 'increase', value: 8}} />
//         <StatCard title="Avg. Diagnosis Time" value={stats.avgDiagnosisTime} icon={Clock} color="purple" trend={{type: 'decrease', value: 7}} />
//         <StatCard title="Patient Satisfaction" value={stats.patientSatisfaction} icon={ThumbsUp} color="pink" trend={{type: 'increase', value: 2}} />
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <TrendingUp className="mr-2" /> Diagnosis Distribution
         
//             </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={chartData.pieChartData}
//                 cx="50%"
//                 cy="50%"
//                 labelLine={false}
//                 outerRadius={80}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
//               >
//                 {chartData.pieChartData.map((entry, index) => (
//                   <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                 ))}
//               </Pie>
//               <Tooltip />
//               <Legend />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <Activity className="mr-2" /> Diagnoses Trend
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <LineChart data={chartData.lineChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Legend />
//               <Line type="monotone" dataKey="newDiagnoses" stroke="#8884d8" activeDot={{ r: 8 }} />
//               <Line type="monotone" dataKey="completedDiagnoses" stroke="#82ca9d" activeDot={{ r: 8 }} />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <Users className="mr-2" /> Patient Influx (Weekly)
//           </h3>
//           <ResponsiveContainer width="100%" height={300}>
//             <AreaChart data={chartData.areaChartData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" />
//               <YAxis />
//               <Tooltip />
//               <Area type="monotone" dataKey="patients" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
//             </AreaChart>
//           </ResponsiveContainer>
//         </div>

//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h3 className="text-lg font-semibold mb-4 flex items-center">
//             <Map className="mr-2" /> Geographic Distribution
//           </h3>
//           <div className="h-[300px] bg-gray-200 flex items-center justify-center">
//             <p className="text-gray-500">Interactive map component would go here</p>
//           </div>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
//           <span className="flex items-center">
//             <Bell className="mr-2" /> Recent Notifications
//           </span>
//           <button
//             className="text-sm text-blue-500 hover:text-blue-600"
//             onClick={() => setShowAllNotifications(!showAllNotifications)}
//           >
//             {showAllNotifications ? 'Show Less' : 'View All'}
//           </button>
//         </h3>
//         <ul className="space-y-3">
//         {(showAllNotifications ? notifications : notifications.slice(0, 5)).map((notification) => (
//             <li key={notification.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-gray-100">
//               <div className="flex items-center">
//                 <div className={`w-2 h-2 rounded-full mr-3 ${
//                   notification.priority === 'high' ? 'bg-red-500' :
//                   notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
//                 }`}></div>
//                 <span className="font-medium">{notification.message}</span>
//               </div>
//               <span className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// };

// export default Overview;
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Activity, Users, FileText, AlertTriangle, Bell, TrendingUp, Calendar, Filter, Search, Settings, Map, Clock, ThumbsUp,
  ArrowUpRight, ArrowDownRight, Sliders, ChevronDown, Info, RefreshCw, PieChart as PieChartIcon, Download, Share2, X,
  Maximize2, Coffee, CheckCircle, Zap, ChevronRight
} from 'lucide-react';
import { getTotalPatients, getNotifications, getDashboardStats, getChartData,getUserProfile  } from '../../services/api';

const Overview = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);
  const [showAllNotifications, setShowAllNotifications] = useState(false);  // State to control "View All"
  const [stats, setStats] = useState({
    newDiagnoses: 0,
    pendingResults: 0,
    completedDiagnoses: 0,
    avgDiagnosisTime: '3.2 days',
    patientSatisfaction: '4.7/5'
  });
  const [chartData, setChartData] = useState({
    pieChartData: [],
    lineChartData: [],
    areaChartData: []  // Placeholder for patient influx data
  });
  const [activeTab, setActiveTab] = useState('overview');
  const [activeTimeframe, setActiveTimeframe] = useState('30d');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsTotal, notificationsData, dashboardStats, chartDataResponse, userData] = await Promise.all([
          getTotalPatients(),
          getNotifications(),
          getDashboardStats(),
          getChartData(),  // Live data for line chart and potentially patient influx
          getUserProfile() // Add this API call to get current user
        ]);

        setTotalPatients(patientsTotal);
        // setNotifications(notificationsData);
        // Sort notifications by date descending
        const sortedNotifications = notificationsData.sort(
          (a, b) => new Date(b.created_at) - new Date(a.created_at)
        );
        setNotifications(sortedNotifications);


        // Mapping live data for statistics
        setStats({
          newDiagnoses: dashboardStats.new_diagnoses || 0,
          pendingResults: dashboardStats.pending_results || 0,
          completedDiagnoses: dashboardStats.completed_diagnoses || 0,
          avgDiagnosisTime: '3.2 days',  // Placeholder for now
          patientSatisfaction: '4.7/5'   // Placeholder for now
        });

         // Set the user info
        setUser(userData);

        // Mapping live data for charts
        setChartData({
          pieChartData: [
            { name: 'Positive', value: dashboardStats.diagnosis_distribution.positive || 0 },
            { name: 'Negative', value: dashboardStats.diagnosis_distribution.negative || 0 },
            { name: 'Inconclusive', value: dashboardStats.diagnosis_distribution.inconclusive || 0 }
          ],
          lineChartData: chartDataResponse.lineChartData || [],
          areaChartData: chartDataResponse.areaChartData || [
            { name: 'Mon', patients: 20 },  // Dummy data for patient influx
            { name: 'Tue', patients: 28 },
            { name: 'Wed', patients: 35 },
            { name: 'Thu', patients: 32 },
            { name: 'Fri', patients: 38 },
            { name: 'Sat', patients: 25 },
            { name: 'Sun', patients: 22 }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444'];

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-xl shadow-sm p-6 transition-all duration-300 hover:shadow-md border border-gray-100">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center bg-${color}-50`}>
          {React.createElement(icon, { className: `h-5 w-5 text-${color}-500` })}
        </div>
      </div>
      <div className="mt-2">
        <p className={`text-2xl font-bold text-gray-800`}>{value}</p>
        {trend && (
          <div className={`flex items-center mt-2 ${trend.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
            {trend.type === 'increase' ? 
              <ArrowUpRight className="h-4 w-4 mr-1" /> : 
              <ArrowDownRight className="h-4 w-4 mr-1" />}
            <span className="text-sm font-medium">{trend.value}%</span>
            <span className="text-xs text-gray-500 ml-1">vs. last period</span>
          </div>
        )}
      </div>
    </div>
  );

  const DashboardTabs = () => (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
      {['overview', 'analytics', 'patients', 'diagnoses', 'reports'].map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-lg text-sm font-medium ${
            activeTab === tab 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {tab.charAt(0).toUpperCase() + tab.slice(1)}
        </button>
      ))}
    </div>
  );

  const TimeframeSelector = () => (
    <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
      {['7d', '30d', '90d', 'YTD', '1y'].map((timeframe) => (
        <button
          key={timeframe}
          onClick={() => setActiveTimeframe(timeframe)}
          className={`px-3 py-1 rounded-lg text-xs font-medium ${
            activeTimeframe === timeframe 
              ? 'bg-white text-blue-600 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          {timeframe}
        </button>
      ))}
    </div>
  );

  const ChartCard = ({ title, icon, children, hasTimeframe = false }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center">
          {React.createElement(icon, { className: "mr-2 h-5 w-5 text-gray-500" })} 
          <h3 className="text-base font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="flex items-center space-x-2">
          {hasTimeframe && <TimeframeSelector />}
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <RefreshCw size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <Download size={16} />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  const customTooltipStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={customTooltipStyle}>
          <p className="font-medium text-sm text-gray-700">{label}</p>
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="text-sm" style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderNotificationIcon = (priority) => {
    switch(priority) {
      case 'high':
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium':
        return <Info className="h-5 w-5 text-yellow-500" />;
      default:
        return <CheckCircle className="h-5 w-5 text-green-500" />;
    }
  };

  const getNotificationLabel = (priority) => {
    switch(priority) {
      case 'high':
        return <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Critical</span>;
      case 'medium':
        return <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Important</span>;
      default:
        return <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Info</span>;
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
        <div>
  <h1 className="text-2xl font-bold text-gray-800">Medical Dashboard</h1>
  {user ? (
    <p className="text-gray-500">
      Welcome back, {user.title || 'Dr.'} {user.lastName}. Here's your overview for today.
    </p>
  ) : (
    <p className="text-gray-500">Loading your dashboard...</p>
  )}
</div>
          <div className="flex space-x-3">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search patients, diagnoses..." 
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" 
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors">
              <Calendar className="mr-2 h-5 w-5 text-gray-500" /> 
              <span>Mar 15 - Apr 15</span>
              <ChevronDown className="ml-2 h-4 w-4 text-gray-500" />
            </button>
            <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors">
              <Filter className="mr-2 h-5 w-5 text-gray-500" /> 
              <span>Filters</span>
            </button>
            <button 
              className={`${isSettingsOpen ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-white border-gray-200 text-gray-700'} px-4 py-2 rounded-lg flex items-center shadow-sm hover:bg-gray-50 transition-colors border`}
              onClick={() => setIsSettingsOpen(!isSettingsOpen)}
            >
              <Sliders className={`mr-2 h-5 w-5 ${isSettingsOpen ? 'text-blue-500' : 'text-gray-500'}`} /> 
              <span>Settings</span>
            </button>
          </div>
        </div>
        
        <DashboardTabs />
        
        {isSettingsOpen && (
          <div className="mb-6 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Dashboard Settings</h3>
              <button 
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Theme Preference</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>Light Mode</option>
                  <option>Dark Mode</option>
                  <option>System Default</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Refresh Rate</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>Real-time Updates</option>
                  <option>Every 5 minutes</option>
                  <option>Every 15 minutes</option>
                  <option>Every 30 minutes</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default View</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>Overview</option>
                  <option>Analytics</option>
                  <option>Patients</option>
                  <option>Diagnoses</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Chart Style</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>Default</option>
                  <option>Minimalist</option>
                  <option>High Contrast</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Data Density</label>
                <select className="w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg bg-white">
                  <option>Compact</option>
                  <option>Comfortable</option>
                  <option>Spacious</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Reset to Default
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Save Changes
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-5 mb-8">
          <StatCard title="Total Patients" value={totalPatients} icon={Users} color="blue" trend={{type: 'increase', value: 5}} />
          <StatCard title="New Diagnoses" value={stats.newDiagnoses} icon={Activity} color="green" trend={{type: 'increase', value: 12}} />
          <StatCard title="Pending Results" value={stats.pendingResults} icon={AlertTriangle} color="yellow" trend={{type: 'decrease', value: 3}} />
          <StatCard title="Completed Diagnoses" value={stats.completedDiagnoses} icon={FileText} color="indigo" trend={{type: 'increase', value: 8}} />
          <StatCard title="Avg. Diagnosis Time" value={stats.avgDiagnosisTime} icon={Clock} color="purple" trend={{type: 'decrease', value: 7}} />
          <StatCard title="Patient Satisfaction" value={stats.patientSatisfaction} icon={ThumbsUp} color="pink" trend={{type: 'increase', value: 2}} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Diagnosis Distribution" icon={PieChartIcon} hasTimeframe={true}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.pieChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={100}
                  innerRadius={60}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  paddingAngle={3}
                >
                  {chartData.pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Diagnoses Trend" icon={Activity} hasTimeframe={true}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.lineChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ paddingTop: 10 }} />
                <Line 
                  type="monotone" 
                  dataKey="newDiagnoses" 
                  stroke="#4F46E5" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="completedDiagnoses" 
                  stroke="#10B981" 
                  activeDot={{ r: 8 }} 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <ChartCard title="Patient Influx (Weekly)" icon={Users} hasTimeframe={true}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData.areaChartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <defs>
                  <linearGradient id="patientInflux" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#4F46E5" 
                  fillOpacity={1} 
                  fill="url(#patientInflux)" 
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 8 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Geographic Distribution" icon={Map}>
            <div className="h-[300px] bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
              <div className="text-center text-gray-500">
                <Map className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="font-medium mb-1">Interactive Map Coming Soon</p>
                <p className="text-sm">Geographic patient distribution visualization</p>
              </div>
            </div>
          </ChartCard>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-gray-500" /> 
              <h3 className="text-base font-semibold text-gray-800">Recent Notifications</h3>
              <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                {notifications.length}
              </div>
            </div>
            <div className="flex items-center">
              <button
                className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center"
                onClick={() => setShowAllNotifications(!showAllNotifications)}
              >
                {showAllNotifications ? 'Show Less' : 'View All'}
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          <div className="p-4">
            {notifications.length === 0 ? (
              <div className="text-center py-6">
                <Coffee className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500 font-medium">You're all caught up!</p>
                <p className="text-sm text-gray-400">No new notifications at this moment.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {(showAllNotifications ? notifications : notifications.slice(0, 5)).map((notification) => (
                  <div key={notification.id} className="flex items-start py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="p-2 rounded-full mr-3 bg-gray-100">
                      {renderNotificationIcon(notification.priority)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center">
                          {getNotificationLabel(notification.priority)}
                          <span className="text-xs text-gray-500 ml-2">
                            {new Date(notification.created_at).toLocaleString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <button className="text-gray-400 hover:text-gray-500">
                          <X size={16} />
                        </button>
                      </div>
                      <p className="text-gray-800">{notification.message}</p>
                      {notification.priority === 'high' && (
                        <button className="mt-1 text-sm text-blue-600 hover:text-blue-800 font-medium">
                          Take action
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;