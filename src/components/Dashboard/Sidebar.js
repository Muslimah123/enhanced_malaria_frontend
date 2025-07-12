// // export default Sidebar;
// import React from 'react';
// import { Activity, Users, Calendar, Microscope, FileText, BarChart2, Settings } from 'lucide-react';
// import { Link } from 'react-router-dom';

// const Sidebar = ({ isOpen, setIsOpen }) => {
//   return (
//     <nav className={`bg-gradient-to-b from-blue-400 to-blue-600 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
//       <div className="flex items-center justify-between mb-8 px-4">
//         <div className="text-2xl font-bold">MalariaAI</div>
//       </div>
//       <div className="space-y-3">
//         <SidebarItem to="/dashboard" icon={<Activity />} text="Overview" />
//         <SidebarItem to="/dashboard/patients" icon={<Users />} text="Patient Management" />
//         <SidebarItem to="/dashboard/visits" icon={<Calendar />} text="Visits" />
//         {/* <SidebarItem to="/dashboard/diagnostics" icon={<Microscope />} text="Diagnostics" /> */}
//         <SidebarItem to="/dashboard/performance" icon={<FileText />} text="PerformanceDashboard" />
//         <SidebarItem to="/dashboard/analytics" icon={<BarChart2 />} text="Analytics" />
//         <SidebarItem to="/dashboard/settings" icon={<Settings />} text="Settings" />
//       </div>
//     </nav>
//   );
// };

// const SidebarItem = ({ to, icon, text }) => (
//   <Link
//     to={to}
//     className="flex items-center space-x-2 w-full p-2 rounded-lg transition duration-200 text-blue-100 hover:bg-blue-700 hover:text-white"
//   >
//     {icon}
//     <span>{text}</span>
//   </Link>
// );

// export default Sidebar;
import React from 'react';
import { Activity, Users, Calendar, Microscope, FileText, BarChart2, Settings, Stethoscope } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <nav className={`bg-gradient-to-b from-blue-400 to-blue-600 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-20`}>
      <div className="flex items-center justify-between mb-8 px-4">
        <div className="text-2xl font-bold">MalariaAI</div>
      </div>
      <div className="space-y-3">
        <SidebarItem to="/dashboard" icon={<Activity />} text="Overview" />
        <SidebarItem to="/dashboard/patients" icon={<Users />} text="Patient Management" />
        <SidebarItem to="/dashboard/visits" icon={<Calendar />} text="Visits" />
        
        {/* Optional: Add a general diagnosis/reports section */}
        {/* <SidebarItem to="/dashboard/reports" icon={<Stethoscope />} text="Diagnosis Reports" /> */}
        
        <SidebarItem to="/dashboard/performance" icon={<FileText />} text="Performance Dashboard" />
        <SidebarItem to="/dashboard/analytics" icon={<BarChart2 />} text="Analytics" />
        <SidebarItem to="/dashboard/settings" icon={<Settings />} text="Settings" />
      </div>
    </nav>
  );
};

const SidebarItem = ({ to, icon, text }) => (
  <Link
    to={to}
    className="flex items-center space-x-2 w-full p-2 rounded-lg transition duration-200 text-blue-100 hover:bg-blue-700 hover:text-white"
  >
    {icon}
    <span>{text}</span>
  </Link>
);

export default Sidebar;