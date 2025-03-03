import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Download, Filter, TrendingUp, Clock, AlertCircle, Map } from 'lucide-react';

const Analytics= () => {
  const performanceData = [
    { month: 'Jan', accuracy: 94, speed: 88, confidence: 92 },
    { month: 'Feb', accuracy: 95, speed: 87, confidence: 91 },
    { month: 'Mar', accuracy: 93, speed: 90, confidence: 93 },
    { month: 'Apr', accuracy: 96, speed: 89, confidence: 94 },
    { month: 'May', accuracy: 94, speed: 91, confidence: 92 },
    { month: 'Jun', accuracy: 95, speed: 92, confidence: 93 }
  ];

  const locationData = [
    { location: 'North Region', cases: 245, severity: 'High' },
    { location: 'South Region', cases: 189, severity: 'Medium' },
    { location: 'East Region', cases: 167, severity: 'Low' },
    { location: 'West Region', cases: 214, severity: 'High' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-800">Analytics</h1>
              <p className="text-gray-500">Detailed analysis and insights</p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center px-4 py-2 bg-white border rounded-lg hover:bg-gray-50">
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                <Download className="w-4 h-4 mr-2" />
                Export Analytics
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Analytics Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Accuracy Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Average Accuracy</p>
                <h3 className="text-2xl font-semibold">94.8%</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </div>

          {/* Processing Time Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Processing Time</p>
                <h3 className="text-2xl font-semibold">2.4 min</h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Alert Rate Card */}
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Alert Rate</p>
                <h3 className="text-2xl font-semibold">5.2%</h3>
              </div>
              <div className="p-2 bg-yellow-50 rounded-full">
                <AlertCircle className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">System Performance Metrics</h2>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="accuracy" stroke="#3b82f6" name="Accuracy %" />
                <Line type="monotone" dataKey="speed" stroke="#22c55e" name="Processing Speed" />
                <Line type="monotone" dataKey="confidence" stroke="#f59e0b" name="Confidence Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Geographic Distribution</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={locationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="location" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="cases" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Severity Analysis</h2>
            <div className="h-[300px] flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Map className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>Interactive severity map coming soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;