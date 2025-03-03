import React, { useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Area, AreaChart } from 'recharts';
import { Download, Calendar, Search, Filter, ChevronDown, ArrowUpRight, ArrowDownRight, Printer, FileText } from 'lucide-react';

const Reports = () => {
  // State management
  const [activeTab, setActiveTab] = useState('diagnosis');
  const [dateRange, setDateRange] = useState('monthly');
  const [showFilters, setShowFilters] = useState(false);

  // Colors for charts
  const COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444'];

  // Sample data - replace with your actual data
  const diagnosisData = {
    daily: [/* your daily data */],
    weekly: [/* your weekly data */],
    monthly: [
      { month: 'Jan', positive: 45, negative: 65, inconclusive: 12 },
      { month: 'Feb', positive: 52, negative: 58, inconclusive: 15 },
      { month: 'Mar', positive: 48, negative: 62, inconclusive: 10 },
      // ... more data
    ]
  };

  // Function to render different content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'diagnosis':
        return (
          <div className="space-y-6">
            {/* Diagnosis Stats Cards */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Total Diagnoses</p>
                <h3 className="text-xl font-semibold mt-1">1,284</h3>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Positive Cases</p>
                <h3 className="text-xl font-semibold mt-1">486</h3>
              </div>
              {/* Add more stat cards */}
            </div>

            {/* Diagnosis Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Diagnosis Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={diagnosisData.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="positive" stackId="1" stroke={COLORS[0]} fill={COLORS[0]} name="Positive" />
                      <Area type="monotone" dataKey="negative" stackId="1" stroke={COLORS[1]} fill={COLORS[1]} name="Negative" />
                      <Area type="monotone" dataKey="inconclusive" stackId="1" stroke={COLORS[2]} fill={COLORS[2]} name="Inconclusive" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Add more charts */}
            </div>
          </div>
        );

      case 'patients':
        return (
          <div className="space-y-6">
            {/* Patient Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Total Patients</p>
                <h3 className="text-xl font-semibold mt-1">892</h3>
              </div>
              {/* Add more patient stats */}
            </div>

            {/* Patient Demographics Chart */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Age Distribution</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: '0-15', value: 245 },
                          { name: '16-30', value: 384 },
                          { name: '31-45', value: 293 },
                          { name: '46+', value: 147 }
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name} (${value})`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {[0, 1, 2, 3].map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Add more patient charts */}
            </div>
          </div>
        );

      case 'trends':
        return (
          <div className="space-y-6">
            {/* Trends Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">Growth Rate</p>
                <h3 className="text-xl font-semibold mt-1">+12.3%</h3>
              </div>
              {/* Add more trend stats */}
            </div>

            {/* Trend Analysis Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">Case Trend Analysis</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={diagnosisData.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="positive" stroke={COLORS[0]} name="Positive Cases" />
                      <Line type="monotone" dataKey="negative" stroke={COLORS[1]} name="Negative Cases" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
              {/* Add more trend charts */}
            </div>
          </div>
        );

      case 'performance':
        return (
          <div className="space-y-6">
            {/* Performance Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">System Accuracy</p>
                <h3 className="text-xl font-semibold mt-1">94.8%</h3>
              </div>
              {/* Add more performance stats */}
            </div>

            {/* Performance Charts */}
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold mb-4">System Performance</h3>
                <div className="h-[300px]">
                  {/* Add performance charts */}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Reports</h1>
              <p className="text-gray-500">Comprehensive system analytics and reports</p>
            </div>
            <div className="flex gap-3">
              <select 
                className="px-4 py-2 border rounded-lg bg-white"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b">
            {[
              { id: 'diagnosis', label: 'Diagnosis Reports' },
              { id: 'patients', label: 'Patient Reports' },
              { id: 'trends', label: 'Trend Analysis' },
              { id: 'performance', label: 'Performance Metrics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 -mb-px text-sm font-medium ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white border-b px-6 py-4">
          <div className="grid grid-cols-4 gap-4">
            {/* Add your filter controls here */}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="p-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default Reports;