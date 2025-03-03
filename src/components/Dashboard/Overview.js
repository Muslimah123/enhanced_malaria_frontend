import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import {
  Activity, Users, FileText, AlertTriangle, Bell, TrendingUp, Calendar, Filter, Search, Settings, Map, Clock, ThumbsUp
} from 'lucide-react';
import { getTotalPatients, getNotifications, getDashboardStats, getChartData } from '../../services/api';

const Overview = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [totalPatients, setTotalPatients] = useState(0);
  const [notifications, setNotifications] = useState([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [patientsTotal, notificationsData, dashboardStats, chartDataResponse] = await Promise.all([
          getTotalPatients(),
          getNotifications(),
          getDashboardStats(),
          getChartData()  // Live data for line chart and potentially patient influx
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

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const StatCard = ({ title, value, icon, color, trend }) => (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {React.createElement(icon, { className: `h-6 w-6 text-${color}-500` })}
      </div>
      <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
      {trend && (
        <p className={`text-sm mt-2 ${trend.type === 'increase' ? 'text-green-500' : 'text-red-500'}`}>
          {trend.type === 'increase' ? '↑' : '↓'} {trend.value}% from last month
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard Overview</h1>
        <div className="flex space-x-4">
          <div className="relative">
            <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center">
            <Calendar className="mr-2" /> Date Range
          </button>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center">
            <Filter className="mr-2" /> Filters
          </button>
          <button 
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg flex items-center"
            onClick={() => setIsSettingsOpen(!isSettingsOpen)}
          >
            <Settings className="mr-2" /> Settings
          </button>
        </div>
      </div>
      
      {isSettingsOpen && (
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Dashboard Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Theme</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Refresh Rate</label>
              <select className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md">
                <option>Real-time</option>
                <option>Every 5 minutes</option>
                <option>Every 15 minutes</option>
                <option>Every 30 minutes</option>
              </select>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard title="Total Patients" value={totalPatients} icon={Users} color="blue" trend={{type: 'increase', value: 5}} />
        <StatCard title="New Diagnoses (30d)" value={stats.newDiagnoses} icon={Activity} color="green" trend={{type: 'increase', value: 12}} />
        <StatCard title="Pending Results" value={stats.pendingResults} icon={AlertTriangle} color="yellow" trend={{type: 'decrease', value: 3}} />
        <StatCard title="Completed Diagnoses" value={stats.completedDiagnoses} icon={FileText} color="indigo" trend={{type: 'increase', value: 8}} />
        <StatCard title="Avg. Diagnosis Time" value={stats.avgDiagnosisTime} icon={Clock} color="purple" trend={{type: 'decrease', value: 7}} />
        <StatCard title="Patient Satisfaction" value={stats.patientSatisfaction} icon={ThumbsUp} color="pink" trend={{type: 'increase', value: 2}} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TrendingUp className="mr-2" /> Diagnosis Distribution
         
            </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {chartData.pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Activity className="mr-2" /> Diagnoses Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="newDiagnoses" stroke="#8884d8" activeDot={{ r: 8 }} />
              <Line type="monotone" dataKey="completedDiagnoses" stroke="#82ca9d" activeDot={{ r: 8 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Users className="mr-2" /> Patient Influx (Weekly)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.areaChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="patients" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Map className="mr-2" /> Geographic Distribution
          </h3>
          <div className="h-[300px] bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Interactive map component would go here</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center justify-between">
          <span className="flex items-center">
            <Bell className="mr-2" /> Recent Notifications
          </span>
          <button
            className="text-sm text-blue-500 hover:text-blue-600"
            onClick={() => setShowAllNotifications(!showAllNotifications)}
          >
            {showAllNotifications ? 'Show Less' : 'View All'}
          </button>
        </h3>
        <ul className="space-y-3">
        {(showAllNotifications ? notifications : notifications.slice(0, 5)).map((notification) => (
            <li key={notification.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg transition-all duration-300 hover:bg-gray-100">
              <div className="flex items-center">
                <div className={`w-2 h-2 rounded-full mr-3 ${
                  notification.priority === 'high' ? 'bg-red-500' :
                  notification.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                }`}></div>
                <span className="font-medium">{notification.message}</span>
              </div>
              <span className="text-sm text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Overview;
