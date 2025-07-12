// import React, { useState } from 'react';
// import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
// import { Download, Calendar, Search, Filter, ChevronDown, ArrowUpRight, ArrowDownRight, Printer, FileText } from 'lucide-react';

// const Reports = () => {
//   // State management
//   const [activeTab, setActiveTab] = useState('diagnosis');
//   const [dateRange, setDateRange] = useState('monthly');
//   const [showFilters, setShowFilters] = useState(false);

//   // Colors for charts
//   const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

//   // Sample data - replace with your actual data
//   const diagnosisData = {
//     daily: [/* your daily data */],
//     weekly: [/* your weekly data */],
//     monthly: [
//       { month: 'Jan', positive: 45, negative: 65, inconclusive: 12 },
//       { month: 'Feb', positive: 52, negative: 58, inconclusive: 15 },
//       { month: 'Mar', positive: 48, negative: 62, inconclusive: 10 },
//       // ... more data
//     ]
//   };

//   // Function to render different content based on active tab
//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'diagnosis':
//         return (
//           <div className="space-y-6">
//             {/* Diagnosis Stats Cards */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-500">Total Diagnoses</p>
//                 <h3 className="text-xl font-semibold mt-1">1,284</h3>
//               </div>
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-500">Positive Cases</p>
//                 <h3 className="text-xl font-semibold mt-1">486</h3>
//               </div>
//               {/* Add more stat cards */}
//             </div>

//             {/* Diagnosis Charts */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-lg font-semibold mb-4">Diagnosis Distribution</h3>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <AreaChart data={diagnosisData.monthly}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Area type="monotone" dataKey="positive" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} name="Positive" />
//                       <Area type="monotone" dataKey="negative" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} name="Negative" />
//                       <Area type="monotone" dataKey="inconclusive" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} name="Inconclusive" />
//                     </AreaChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//               {/* Add more charts */}
//             </div>
//           </div>
//         );

//       case 'patients':
//         return (
//           <div className="space-y-6">
//             {/* Patient Stats */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-500">Total Patients</p>
//                 <h3 className="text-xl font-semibold mt-1">892</h3>
//               </div>
//               {/* Add more patient stats */}
//             </div>

//             {/* Patient Demographics Chart */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <PieChart>
//                       <Pie
//                         data={[
//                           { name: '0-15', value: 245 },
//                           { name: '16-30', value: 384 },
//                           { name: '31-45', value: 293 },
//                           { name: '46+', value: 147 }
//                         ]}
//                         cx="50%"
//                         cy="50%"
//                         labelLine={false}
//                         label={({ name, value }) => `${name} (${value})`}
//                         outerRadius={100}
//                         fill="#8884d8"
//                         dataKey="value"
//                       >
//                         {[0, 1, 2, 3].map((entry, index) => (
//                           <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//                         ))}
//                       </Pie>
//                       <Tooltip />
//                     </PieChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//               {/* Add more patient charts */}
//             </div>
//           </div>
//         );

//       case 'trends':
//         return (
//           <div className="space-y-6">
//             {/* Trends Stats */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-500">Growth Rate</p>
//                 <h3 className="text-xl font-semibold mt-1">+12.3%</h3>
//               </div>
//               {/* Add more trend stats */}
//             </div>

//             {/* Trend Analysis Charts */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-lg font-semibold mb-4">Case Trend Analysis</h3>
//                 <div className="h-[300px]">
//                   <ResponsiveContainer width="100%" height="100%">
//                     <LineChart data={diagnosisData.monthly}>
//                       <CartesianGrid strokeDasharray="3 3" />
//                       <XAxis dataKey="month" />
//                       <YAxis />
//                       <Tooltip />
//                       <Legend />
//                       <Line type="monotone" dataKey="positive" stroke={COLORS[0]} name="Positive Cases" />
//                       <Line type="monotone" dataKey="negative" stroke={COLORS[1]} name="Negative Cases" />
//                     </LineChart>
//                   </ResponsiveContainer>
//                 </div>
//               </div>
//               {/* Add more trend charts */}
//             </div>
//           </div>
//         );

//       case 'performance':
//         return (
//           <div className="space-y-6">
//             {/* Performance Stats */}
//             <div className="grid grid-cols-4 gap-4">
//               <div className="bg-white p-4 rounded-lg shadow-sm">
//                 <p className="text-sm text-gray-500">System Accuracy</p>
//                 <h3 className="text-xl font-semibold mt-1">94.8%</h3>
//               </div>
//               {/* Add more performance stats */}
//             </div>

//             {/* Performance Charts */}
//             <div className="grid grid-cols-2 gap-6">
//               <div className="bg-white p-6 rounded-lg shadow-sm">
//                 <h3 className="text-lg font-semibold mb-4">System Performance</h3>
//                 <div className="h-[300px]">
//                   {/* Add performance charts */}
//                 </div>
//               </div>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b">
//         <div className="px-6 py-4">
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
//               <p className="text-gray-500">Comprehensive system analytics and reports</p>
//             </div>
//             <div className="flex gap-3">
//               <select 
//                 className="px-4 py-2 border rounded-lg bg-white"
//                 value={dateRange}
//                 onChange={(e) => setDateRange(e.target.value)}
//               >
//                 <option value="daily">Daily</option>
//                 <option value="weekly">Weekly</option>
//                 <option value="monthly">Monthly</option>
//                 <option value="yearly">Yearly</option>
//               </select>
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="px-4 py-2 border rounded-lg hover:bg-gray-50"
//               >
//                 <Filter className="w-4 h-4" />
//               </button>
//             </div>
//           </div>

//           {/* Tabs */}
//           <div className="flex border-b">
//             {[
//               { id: 'diagnosis', label: 'Diagnosis Reports' },
//               { id: 'patients', label: 'Patient Reports' },
//               { id: 'trends', label: 'Trend Analysis' },
//               { id: 'performance', label: 'Performance Metrics' }
//             ].map((tab) => (
//               <button
//                 key={tab.id}
//                 onClick={() => setActiveTab(tab.id)}
//                 className={`px-4 py-2 -mb-px text-sm font-medium ${
//                   activeTab === tab.id
//                     ? 'border-b-2 border-blue-500 text-blue-600'
//                     : 'text-gray-500 hover:text-gray-700'
//                 }`}
//               >
//                 {tab.label}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* Filters Panel */}
//       {showFilters && (
//         <div className="bg-white border-b px-6 py-4">
//           <div className="grid grid-cols-4 gap-4">
//             {/* Add your filter controls here */}
//           </div>
//         </div>
//       )}

//       {/* Main Content */}
//       <div className="p-6">
//         {renderTabContent()}

//       </div>
//     </div>
//   );
// };

// export default Reports;
// src/components/PerformanceDashboard.js
import React, { useState, useEffect, useRef } from 'react';
import {
  Activity, TrendingUp, Clock, Server, Upload, Zap, AlertTriangle,
  BarChart3, PieChart, RefreshCw, Download, Filter, ChevronDown,
  CheckCircle, XCircle, Loader, Monitor, Cpu, HardDrive
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, PieChart as RechartsPie, Pie,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';
import {
  subscribeToPerformanceUpdates,
  unsubscribeFromPerformanceUpdates,
  getPerformanceAnalytics,
  getRealtimePerformance,
  getPerformanceHistory,
  getEndpointPerformance,
  performanceTracker
} from '../../services/api';

const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const PerformanceDashboard = () => {
  const [realtimeData, setRealtimeData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [endpointStats, setEndpointStats] = useState([]);
  const [selectedTimeRange, setSelectedTimeRange] = useState(24);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [clientMetrics, setClientMetrics] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    // Initial data fetch
    fetchData();
    
    // Subscribe to real-time updates
    subscribeToPerformanceUpdates(handlePerformanceUpdate);
    
    // Listen for client-side metrics
    performanceTracker.addListener(handleClientMetric);
    
    // Set up auto-refresh
    if (autoRefresh) {
      refreshIntervalRef.current = setInterval(fetchRealtimeData, 30000); // Every 30 seconds
    }
    
    // Request performance history
    getPerformanceHistory(selectedTimeRange);
    getEndpointPerformance();
    
    return () => {
      unsubscribeFromPerformanceUpdates();
      performanceTracker.removeListener(handleClientMetric);
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [selectedTimeRange, autoRefresh]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchRealtimeData(),
        fetchHistoricalData(),
        fetchClientMetrics()
      ]);
    } catch (error) {
      console.error('Error fetching performance data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const data = await getRealtimePerformance();
      setRealtimeData(data);
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  const fetchHistoricalData = async () => {
    try {
      const data = await getPerformanceAnalytics({
        start_date: new Date(Date.now() - selectedTimeRange * 60 * 60 * 1000).toISOString(),
        end_date: new Date().toISOString()
      });
      setHistoricalData(data.recent_metrics || []);
    } catch (error) {
      console.error('Error fetching historical data:', error);
    }
  };

  const fetchClientMetrics = () => {
    const metrics = performanceTracker.exportMetrics();
    setClientMetrics(metrics);
  };

  const handlePerformanceUpdate = (data) => {
    if (data.type === 'performance_update') {
      setRealtimeData(data);
    } else if (data.type === 'slow_operation_alert') {
      setAlerts(prev => [...prev, { ...data, id: Date.now() }]);
      // Auto-remove alert after 30 seconds
      setTimeout(() => {
        setAlerts(prev => prev.filter(alert => alert.id !== data.id));
      }, 30000);
    } else if (data.data) {
      setHistoricalData(data.data);
    } else if (data.endpoints) {
      setEndpointStats(data.endpoints);
    }
  };

  const handleClientMetric = (event, data) => {
    if (event === 'complete') {
      fetchClientMetrics();
    }
  };

  const downloadReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      timeRange: `${selectedTimeRange} hours`,
      realtime: realtimeData,
      historical: historicalData,
      endpoints: endpointStats,
      clientMetrics: clientMetrics
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `performance-report-${new Date().toISOString()}.json`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
  };

  const formatDuration = (ms) => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'slow': return 'text-amber-600 bg-amber-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin h-8 w-8 text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Activity className="mr-3 text-indigo-600" size={28} />
            Performance Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Monitor system performance and response times</p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Time Range Selector */}
          <div className="relative">
            <select
              value={selectedTimeRange}
              onChange={(e) => setSelectedTimeRange(Number(e.target.value))}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              <option value={1}>Last Hour</option>
              <option value={6}>Last 6 Hours</option>
              <option value={24}>Last 24 Hours</option>
              <option value={168}>Last Week</option>
            </select>
            <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <ChevronDown className="absolute right-2 top-3 h-4 w-4 text-gray-500 pointer-events-none" />
          </div>
          
          {/* Auto Refresh Toggle */}
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
              autoRefresh 
                ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto Refresh On' : 'Auto Refresh Off'}
          </button>
          
          {/* Refresh Button */}
          <button
            onClick={fetchData}
            className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw size={20} />
          </button>
          
          {/* Download Report */}
          <button
            onClick={downloadReport}
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Download className="mr-2" size={18} />
            Download Report
          </button>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map(alert => (
            <div
              key={alert.id}
              className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start"
            >
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-medium text-amber-900">Slow Operation Detected</p>
                <p className="text-sm text-amber-700 mt-1">
                  {alert.endpoint} took {formatDuration(alert.duration)} 
                  (threshold: {formatDuration(alert.threshold)})
                </p>
                <p className="text-xs text-amber-600 mt-1">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Average Response Time */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {realtimeData?.upload?.avg ? formatDuration(realtimeData.upload.avg * 1000) : '0ms'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 5 minutes</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-lg">
              <Clock className="h-6 w-6 text-indigo-600" />
            </div>
          </div>
        </div>

        {/* Total Requests */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Requests</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {realtimeData?.total_requests || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 5 minutes</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        {/* Error Rate */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Error Rate</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {realtimeData?.error_count ? 
                  `${((realtimeData.error_count / realtimeData.total_requests) * 100).toFixed(1)}%` 
                  : '0%'}
              </p>
              <p className="text-xs text-gray-500 mt-1">Last 5 minutes</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* Processing Queue */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Operations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {clientMetrics?.summary?.total || 0}
              </p>
              <p className="text-xs text-gray-500 mt-1">Total tracked</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Cpu className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Response Time Trend */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <TrendingUp className="mr-2 text-indigo-600" size={20} />
            Response Time Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis 
                  dataKey="hour" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleTimeString([], { hour: '2-digit' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value) => formatDuration(value)}
                  labelFormatter={(label) => new Date(label).toLocaleString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_response_time" 
                  stroke="#6366F1" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Endpoint Performance */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Server className="mr-2 text-indigo-600" size={20} />
            Endpoint Performance
          </h3>
          <div className="h-64 overflow-y-auto">
            <div className="space-y-3">
              {endpointStats.map((endpoint, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm truncate">
                        {endpoint.endpoint}
                      </p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-gray-500">
                          {endpoint.request_count} requests
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          endpoint.error_rate > 0.05 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {(endpoint.error_rate * 100).toFixed(1)}% errors
                        </span>
                      </div>
                    </div>
                    <span className="font-medium text-indigo-600">
                      {formatDuration(endpoint.avg_response_time)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((endpoint.avg_response_time / 5000) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Operation Types Breakdown */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <PieChart className="mr-2 text-indigo-600" size={20} />
          Operation Types Breakdown
        </h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPie>
                <Pie
                  data={Object.entries(clientMetrics?.summary?.byType || {}).map(([type, data]) => ({
                    name: type,
                    value: data.count
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {Object.entries(clientMetrics?.summary?.byType || {}).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </div>
          
          {/* Stats Table */}
          <div className="space-y-3">
            {Object.entries(clientMetrics?.summary?.byType || {}).map(([type, data], index) => (
              <div key={type} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div 
                    className="w-4 h-4 rounded mr-3"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <div>
                    <p className="font-medium text-gray-900 capitalize">{type}</p>
                    <p className="text-sm text-gray-600">
                      {data.count} operations
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {formatDuration(data.totalDuration / data.count)}
                  </p>
                  <p className="text-sm text-gray-600">avg time</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Network Performance */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Monitor className="mr-2 text-indigo-600" size={20} />
          Network Performance
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(() => {
            const networkTiming = performanceTracker.getNetworkTiming();
            return networkTiming ? (
              <>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(networkTiming.dns)}</p>
                  <p className="text-sm text-gray-600 mt-1">DNS Lookup</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(networkTiming.tcp)}</p>
                  <p className="text-sm text-gray-600 mt-1">TCP Connect</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(networkTiming.ttfb)}</p>
                  <p className="text-sm text-gray-600 mt-1">Time to First Byte</p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-gray-900">{formatDuration(networkTiming.total)}</p>
                  <p className="text-sm text-gray-600 mt-1">Total Load Time</p>
                </div>
              </>
            ) : (
              <div className="col-span-4 text-center text-gray-500">
                No network timing data available
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default PerformanceDashboard;