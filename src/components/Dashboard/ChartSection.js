
import React from 'react';
import { PieChart, Pie, LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ChartSection = ({ diagnosisDistribution, diagnosisTrend, parasiteDistribution }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Diagnosis Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie dataKey="value" data={diagnosisDistribution} fill="#8884d8" label />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-medium mb-4">Diagnosis Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={diagnosisTrend}>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow md:col-span-2">
        <h3 className="text-lg font-medium mb-4">Parasite Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={parasiteDistribution}>
            <XAxis dataKey="name" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartSection;