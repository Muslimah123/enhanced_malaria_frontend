
// src/components/Dashboard/DiagnosisPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVisitDetails, getDiagnosisResults, downloadVisitReport, performanceTracker, initiateDiagnosis } from '../../services/api'; // ✅ Correct path
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { 
  Download, User, Calendar, Activity, ClipboardList, FileText, 
  AlertTriangle, CheckCircle, Thermometer, 
  Clock, Printer, ArrowLeft,
  BarChart2, Shield, Image, TrendingUp,
  AlertCircle, Info, Home, Microscope  // ✅ Added missing Microscope import
} from 'lucide-react';
import ParasiteDetectionSection from './ParasiteDetectionSection';

const DiagnosisPage = () => {
  const { visitId } = useParams();
  const navigate = useNavigate();
  
  const [visitData, setVisitData] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [imageDiagnoses, setImageDiagnoses] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [activeSection, setActiveSection] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [diagnosisSummary, setDiagnosisSummary] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!visitId) return;
      setLoading(true);
      setError(null);
      try {
        console.log("Fetching visit details for visitId:", visitId);
        const visitDetails = await getVisitDetails(visitId);
        console.log("Received visit details:", visitDetails);
        setVisitData(visitDetails);

        console.log("Fetching diagnosis results for visitId:", visitId);
        const diagnosisResults = await getDiagnosisResults(visitId);
        console.log("Received diagnosis results:", diagnosisResults);
        console.log("Summary from diagnosis results:", diagnosisResults.summary);
        console.log("Counting validation:", diagnosisResults.summary?.counting_validation);
        
        setDiagnosisResult(diagnosisResults.overall_diagnosis);
        setImageDiagnoses(diagnosisResults.image_diagnoses);
        setDiagnosisSummary(diagnosisResults.summary);
        
        // Debug: Log the validation status
        if (diagnosisResults.summary?.counting_validation) {
          console.log("Validation valid:", diagnosisResults.summary.counting_validation.valid);
          console.log("Validation message:", diagnosisResults.summary.counting_validation.message);
        } else {
          console.warn("No counting_validation found in summary");
          
          // If no summary data, try to construct validation manually
          const totalWbcs = diagnosisResults.overall_diagnosis?.total_wbcs || 0;
          const totalParasites = diagnosisResults.overall_diagnosis?.count || 0;
          
          if (totalWbcs > 0) {
            const isValid = (totalParasites >= 100 && totalWbcs >= 200) || 
                           (totalParasites <= 99 && totalWbcs >= 500);
            
            console.log("Manual validation check:", {
              totalParasites,
              totalWbcs,
              isValid,
              reason: isValid ? "Meets WHO criteria" : "Does not meet WHO criteria"
            });
            
            // Create a manual summary if none exists
            if (!diagnosisResults.summary) {
              const manualSummary = {
                total_parasites: totalParasites,
                total_wbcs: totalWbcs,
                counting_validation: {
                  valid: isValid,
                  message: isValid 
                    ? `Valid: ${totalParasites} parasites in ${totalWbcs} WBCs meets WHO criteria`
                    : `Invalid count: ${totalParasites} parasites, ${totalWbcs} WBCs. WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs`,
                  method: isValid ? (totalParasites >= 100 ? "high_parasitemia" : "low_parasitemia") : "insufficient_count"
                }
              };
              
              console.log("Created manual summary:", manualSummary);
              setDiagnosisSummary(manualSummary);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        setError('Failed to load diagnosis data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [visitId]);

  const handleDownloadReport = async () => {
    try {
      const blob = await downloadVisitReport(visitId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${visitData.patient_name}_visit_report_${visitId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading report:', error);
      alert('Failed to download report. Please try again.');
    }
  };

  const handlePrintReport = () => {
    window.print();
  };

  // WHO Validation Warning Component
  const renderWHOValidationWarning = () => {
    // Check multiple sources for validation data
    const validation = diagnosisSummary?.counting_validation || 
                      diagnosisResult?.counting_validation ||
                      null;
    
    const totalWbcs = diagnosisSummary?.total_wbcs || 
                      diagnosisResult?.total_wbcs || 
                      0;
    
    const totalParasites = diagnosisSummary?.total_parasites || 
                          diagnosisResult?.count || 
                          0;

    // If we have explicit validation data and it's valid, don't show warning
    if (validation && validation.valid === true) {
      return null;
    }

    // If we have explicit validation data and it's invalid, show warning
    if (validation && validation.valid === false) {
      return (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 mb-8 shadow-sm">
          <div className="flex items-start">
            <div className="p-2 bg-amber-100 rounded-lg mr-4 flex-shrink-0">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-amber-800 flex items-center mb-3 text-lg">
                <AlertCircle className="h-5 w-5 mr-2" />
                WHO Validation Warning
              </h4>
              <p className="text-amber-700 mb-4">
                <strong>Note:</strong> The parasite density shown is a preliminary estimate. 
                The white blood cell count ({totalWbcs} cells) does not meet 
                WHO's minimum threshold for reliable quantification.
              </p>
              <div className="bg-amber-100 rounded-lg p-4 border border-amber-200">
                <p className="text-sm text-amber-800 font-medium">
                  <strong>Validation Details:</strong> {validation.message}
                </p>
                <p className="text-sm text-amber-700 mt-2">
                  WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs for reliable density calculation.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // Manual validation fallback
    if (totalWbcs > 0 && totalParasites >= 0) {
      const isValid = (totalParasites >= 100 && totalWbcs >= 200) || 
                      (totalParasites <= 99 && totalWbcs >= 500);
      
      if (!isValid) {
        return (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-l-4 border-amber-400 p-6 mb-8 shadow-sm">
            <div className="flex items-start">
              <div className="p-2 bg-amber-100 rounded-lg mr-4 flex-shrink-0">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-amber-800 flex items-center mb-3 text-lg">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  WHO Validation Warning
                </h4>
                <p className="text-amber-700 mb-4">
                  <strong>Note:</strong> The parasite density shown is a preliminary estimate. 
                  The white blood cell count ({totalWbcs} cells) does not meet 
                  WHO's minimum threshold for reliable quantification.
                </p>
                <div className="bg-amber-100 rounded-lg p-4 border border-amber-200">
                  <p className="text-sm text-amber-800 font-medium">
                    <strong>Current Count:</strong> {totalParasites} parasites in {totalWbcs} WBCs
                  </p>
                  <p className="text-sm text-amber-700 mt-2">
                    WHO requires either ≥100 parasites in ≥200 WBCs OR ≤99 parasites in ≥500 WBCs for reliable density calculation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      }
    }

    return null;
  };

  // Enhanced Parasite Density Card with Validation
  const renderParasiteDensityCard = () => {
    if (!diagnosisResult) return null;

    // Check multiple sources for validation data
    const validation = diagnosisSummary?.counting_validation || 
                      diagnosisResult?.counting_validation ||
                      null;
    
    const totalWbcs = diagnosisSummary?.total_wbcs || 
                      diagnosisResult?.total_wbcs || 
                      0;
    
    const totalParasites = diagnosisSummary?.total_parasites || 
                          diagnosisResult?.count || 
                          0;

    // Determine if count is valid
    let isValidCount = true;
    
    if (validation) {
      isValidCount = validation.valid;
    } else if (totalWbcs > 0 && totalParasites >= 0) {
      // Fallback manual validation
      isValidCount = (totalParasites >= 100 && totalWbcs >= 200) || 
                     (totalParasites <= 99 && totalWbcs >= 500);
    }
    
    return (
      <div className="bg-gradient-to-br from-emerald-50 to-green-100 p-8 rounded-2xl text-center shadow-lg border border-green-200 relative">
        {!isValidCount && (
          <div className="absolute -top-3 -right-3">
            <div className="bg-amber-500 text-white rounded-full p-2 shadow-lg">
              <AlertTriangle size={20} />
            </div>
          </div>
        )}
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
            <TrendingUp size={32} className="text-white" />
          </div>
          <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-3">
            Parasite Density
            {!isValidCount && (
              <span className="ml-2 text-amber-600">⚠️</span>
            )}
          </p>
          <p className="text-4xl font-bold text-gray-800">
            {diagnosisResult.parasite_density?.toFixed(2) || 'N/A'}
          </p>
          <p className="text-lg text-gray-600 mt-2">parasites/μL</p>
          {!isValidCount && (
            <p className="text-sm text-amber-600 mt-3 font-medium">
              Preliminary estimate*
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderSeverityAlert = () => {
    if (!diagnosisResult || !diagnosisResult.severity_level) return null;

    const severityConfig = {
      severe: { 
        color: 'from-red-50 to-red-100 border-red-200', 
        textColor: 'text-red-800',
        iconColor: 'text-red-600',
        bgIcon: 'bg-red-100',
        icon: AlertTriangle, 
        title: 'Severe Condition', 
        description: 'This case requires immediate attention and treatment.' 
      },
      moderate: { 
        color: 'from-amber-50 to-orange-100 border-orange-200', 
        textColor: 'text-orange-800',
        iconColor: 'text-orange-600',
        bgIcon: 'bg-orange-100',
        icon: AlertTriangle, 
        title: 'Moderate Severity', 
        description: 'Close monitoring and prompt treatment is recommended.' 
      },
      mild: { 
        color: 'from-emerald-50 to-green-100 border-green-200', 
        textColor: 'text-green-800',
        iconColor: 'text-green-600',
        bgIcon: 'bg-green-100',
        icon: CheckCircle, 
        title: 'Mild Condition', 
        description: 'Standard treatment protocol is advised.' 
      },
    };

    const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
    const Icon = config.icon;

    return (
      <div className={`bg-gradient-to-r ${config.color} border-2 ${config.textColor} rounded-2xl shadow-lg p-6 mb-8`}>
        <div className="flex items-start">
          <div className={`p-4 ${config.bgIcon} rounded-xl ${config.iconColor}`}>
            <Icon className="h-8 w-8" />
          </div>
          <div className="ml-6 flex-1">
            <h4 className="font-bold text-2xl">{config.title}</h4>
            <p className="text-lg mt-2 opacity-90">{config.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const chartData = diagnosisResult ? [
    { name: 'Parasite Count', value: diagnosisResult.count, color: '#6366F1' },
    { name: 'Total WBCs', value: diagnosisResult.total_wbcs, color: '#10B981' },
  ] : [];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

  const renderStatusBadge = (status) => {
    if (!status) return null;
    
    const statusConfig = {
      confirmed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg',
      suspected: 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg',
      negative: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg',
      inconclusive: 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg',
      positive: 'bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg',
    };
    
    const statusClass = statusConfig[status.toLowerCase()] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg';
    
    return (
      <span className={`px-6 py-3 rounded-full text-lg font-semibold ${statusClass}`}>
        {status}
      </span>
    );
  };

  // Navigation items
  const navigationItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'diagnosis', label: 'Diagnosis', icon: Microscope },
    { id: 'detections', label: 'Parasite Detections', icon: Image },
    { id: 'symptoms', label: 'Symptoms', icon: Thermometer },
    { id: 'treatment', label: 'Treatment', icon: ClipboardList },
    { id: 'next-steps', label: 'Next Steps', icon: FileText },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-500 mx-auto"></div>
          <p className="mt-4 text-xl text-gray-600">Loading diagnosis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertTriangle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Loading Data</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <button
                onClick={() => navigate('/dashboard')}
                className="mr-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clinical Diagnosis Report</h1>
                <p className="text-gray-600">{visitData?.patient_name} - Visit #{visitId}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {diagnosisResult?.status && renderStatusBadge(diagnosisResult.status)}
              <button
                onClick={handlePrintReport}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 flex items-center"
              >
                <Printer size={20} className="mr-2" />
                Print
              </button>
              <button
                onClick={handleDownloadReport}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center"
              >
                <Download size={20} className="mr-2" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white shadow-sm print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {navigationItems.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`py-4 px-2 border-b-2 font-medium text-sm flex items-center transition-colors ${
                  activeSection === id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} className="mr-2" />
                {label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* WHO Validation Warning - Show on all relevant sections */}
        {['overview', 'diagnosis'].includes(activeSection) && renderWHOValidationWarning()}

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <div className="space-y-8">
            {/* Severity Alert */}
            {renderSeverityAlert()}

            {/* Patient & Visit Info */}
            {visitData && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Patient Information */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
                    <h3 className="font-bold text-xl text-white flex items-center">
                      <User className="mr-3" size={24} />
                      Patient Information
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Full Name</p>
                        <p className="font-semibold text-lg text-gray-900">{visitData.patient_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Gender</p>
                        <p className="font-semibold text-lg text-gray-900">{visitData.gender}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Age</p>
                        <p className="font-semibold text-lg text-gray-900">{visitData.age} years</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Patient ID</p>
                        <p className="font-semibold text-lg text-gray-900">{visitData.patient_id}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Visit Details */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-500 to-cyan-600 px-6 py-4">
                    <h3 className="font-bold text-xl text-white flex items-center">
                      <Calendar className="mr-3" size={24} />
                      Visit Details
                    </h3>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Visit ID</p>
                        <p className="font-semibold text-lg text-gray-900">#{visitData.visit_id}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 font-medium">Visit Date</p>
                        <p className="font-semibold text-lg text-gray-900">{new Date(visitData.visit_date).toLocaleDateString()}</p>
                      </div>
                      <div className="col-span-2">
                        <p className="text-sm text-gray-500 font-medium">Reason for Visit</p>
                        <p className="font-semibold text-lg text-gray-900">{visitData.reason}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Summary Cards */}
            {diagnosisResult && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl text-center shadow-lg border border-blue-200">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <Activity size={32} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-3">Identified Parasite</p>
                    <p className="text-3xl font-bold text-gray-800">{diagnosisResult.parasite_name}</p>
                  </div>
                </div>

                {renderParasiteDensityCard()}

                <div className="bg-gradient-to-br from-purple-50 to-pink-100 p-8 rounded-2xl text-center shadow-lg border border-purple-200">
                  <div className="flex flex-col items-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                      <CheckCircle size={32} className="text-white" />
                    </div>
                    <p className="text-sm text-gray-600 font-medium uppercase tracking-wider mb-3">Confidence Level</p>
                    <p className="text-3xl font-bold text-gray-800">
                      {diagnosisResult.average_confidence ? `${diagnosisResult.average_confidence.toFixed(1)}%` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Diagnosis Section */}
        {activeSection === 'diagnosis' && diagnosisResult && (
          <div className="space-y-8">
            {/* Main Results */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white">Detailed Analysis Results</h3>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                      <span className="text-white text-3xl font-bold">{diagnosisResult.count}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">Parasite Count</p>
                      <p className="font-semibold text-xl text-gray-800 mt-1">Total detected parasites</p>
                      <p className="text-gray-600 mt-1">Across all analyzed images</p>
                    </div>
                  </div>

                  <div className="flex items-center p-6 bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl border border-gray-200 shadow-md">
                    <div className="w-24 h-24 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center mr-6 flex-shrink-0 shadow-lg">
                      <span className="text-white text-3xl font-bold">{diagnosisResult.total_wbcs}</span>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 font-medium uppercase tracking-wider">White Blood Cells</p>
                      <p className="font-semibold text-xl text-gray-800 mt-1">{diagnosisResult.total_wbcs} cells</p>
                      <p className="text-gray-600 mt-1">Used in density calculation</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <BarChart2 className="mr-2 text-gray-600" size={20} />
                    Count Comparison
                  </h4>
                </div>
                <div className="p-6">
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" tick={{ fill: '#6B7280' }} />
                        <YAxis tick={{ fill: '#6B7280' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#fff', 
                            border: '1px solid #E5E7EB',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                          }} 
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                          {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <TrendingUp className="mr-2 text-gray-600" size={20} />
                    Distribution
                  </h4>
                </div>
                <div className="p-6">
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { name: 'Parasites', value: diagnosisResult.count },
                            { name: 'WBCs', value: diagnosisResult.total_wbcs }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {[
                            { name: 'Parasites', value: diagnosisResult.count },
                            { name: 'WBCs', value: diagnosisResult.total_wbcs }
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Detections Section */}
        {activeSection === 'detections' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-2xl text-gray-800 flex items-center">
                <div className="p-2 bg-gradient-to-br from-orange-100 to-red-100 rounded-lg mr-3">
                  <Image className="text-orange-600" size={24} />
                </div>
                Parasite Detections
              </h3>
            </div>
            
            {/* ✅ Pass diagnosisResult as prop */}
            <ParasiteDetectionSection visitId={visitId} diagnosisResult={diagnosisResult} />
          </div>
        )}

        {/* Symptoms Section */}
        {activeSection === 'symptoms' && visitData && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white">Reported Symptoms</h3>
              </div>
              <div className="p-8">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-xl border border-orange-200">
                  <p className="text-gray-800 text-lg leading-relaxed">{visitData.symptoms || 'No symptoms recorded'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white">Clinical Notes</h3>
              </div>
              <div className="p-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                  <p className="text-gray-800 text-lg leading-relaxed">{visitData.notes || 'No notes recorded'}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Treatment Section */}
        {activeSection === 'treatment' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-green-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white">Recommended Treatment Protocol</h3>
              </div>
              <div className="p-8">
                <textarea
                  placeholder="Enter detailed treatment plan here..."
                  value={treatmentPlan}
                  onChange={(e) => setTreatmentPlan(e.target.value)}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50 text-lg"
                  rows={12}
                />
              </div>
            </div>
          </div>
        )}

        {/* Next Steps Section */}
        {activeSection === 'next-steps' && (
          <div className="space-y-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-4">
                <h3 className="font-bold text-xl text-white">Recommended Follow-up Actions</h3>
              </div>
              <div className="p-8">
                <textarea
                  placeholder="Enter follow-up recommendations and next steps here..."
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  className="w-full p-6 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all text-gray-800 bg-gray-50 text-lg"
                  rows={12}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiagnosisPage;