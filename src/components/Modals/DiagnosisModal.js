
import React, { useState, useEffect } from 'react';
import { getVisitDetails, getDiagnosisResults, downloadVisitReport } from '../../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Download, User, Calendar, Activity, ClipboardList, FileText, AlertTriangle, CheckCircle, X, Thermometer, Clipboard, ChevronDown, ChevronUp } from 'lucide-react';

const DiagnosisModal = ({ isOpen, onClose, visitId }) => {
  const [visitData, setVisitData] = useState(null);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [imageDiagnoses, setImageDiagnoses] = useState([]);
  const [treatmentPlan, setTreatmentPlan] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [activeTab, setActiveTab] = useState("diagnosis");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageDetails, setShowImageDetails] = useState(false);

  // Existing useEffect and other logic remain unchanged
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
        setDiagnosisResult(diagnosisResults.overall_diagnosis);
        setImageDiagnoses(diagnosisResults.image_diagnoses);
      } catch (err) {
        console.error('Error fetching diagnosis data:', err);
        setError('Failed to load diagnosis data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchData();
    }
  }, [visitId, isOpen]);

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

  const renderSeverityAlert = () => {
    if (!diagnosisResult || !diagnosisResult.severity_level) return null;

    const severityConfig = {
      severe: { color: 'bg-red-100 text-red-800', icon: AlertTriangle, title: 'Severe', description: 'This case requires immediate attention and treatment.' },
      moderate: { color: 'bg-yellow-100 text-yellow-800', icon: AlertTriangle, title: 'Moderate', description: 'Close monitoring and prompt treatment is recommended.' },
      mild: { color: 'bg-green-100 text-green-800', icon: CheckCircle, title: 'Mild', description: 'Standard treatment protocol is advised.' },
    };

    const config = severityConfig[diagnosisResult.severity_level.toLowerCase()] || severityConfig.mild;
    const Icon = config.icon;

    return (
      <div className={`rounded-lg p-4 ${config.color} shadow-md`}>
        <div className="flex items-center">
          <Icon className="h-6 w-6 mr-3" />
          <div>
            <h4 className="font-semibold">{config.title}</h4>
            <p className="text-sm mt-1">{config.description}</p>
          </div>
        </div>
      </div>
    );
  };

  const chartData = diagnosisResult ? [
    { name: 'Parasite Count', value: diagnosisResult.count },
    { name: 'Total WBCs', value: diagnosisResult.total_wbcs },
  ] : [];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Patient Diagnosis Report</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
              <X size={28} />
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          ) : (
            <>
              {visitData && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-blue-800 flex items-center">
                      <User className="mr-3" size={24} /> Patient Information
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Patient ID:</span> {visitData.patient_id}</p>
                      <p><span className="font-semibold">Name:</span> {visitData.patient_name}</p>
                      <p><span className="font-semibold">Gender:</span> {visitData.gender}</p>
                      <p><span className="font-semibold">Age:</span> {visitData.age}</p>
                      {/* <p><span className="font-semibold">Status:</span> {visitData.status}</p> */}

                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl shadow-md">
                    <h3 className="font-bold text-xl mb-4 text-green-800 flex items-center">
                      <Calendar className="mr-3" size={24} /> Visit Details
                    </h3>
                    <div className="space-y-2">
                      <p><span className="font-semibold">Visit ID:</span> {visitData.visit_id}</p>
                      <p><span className="font-semibold">Visit Date:</span> {new Date(visitData.visit_date).toLocaleDateString()}</p>
                      <p><span className="font-semibold">Reason:</span> {visitData.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-8">
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
                  {['diagnosis', 'symptoms', 'treatment', 'next-steps'].map((tab) => (
                    <button
                      key={tab}
                      className={`flex-1 py-2 px-4 rounded-md transition-colors ${
                        activeTab === tab
                          ? 'bg-white text-blue-600 shadow-md'
                          : 'text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1).replace('-', ' ')}
                    </button>
                  ))}
                </div>

                <div className="mt-6">
                  {activeTab === 'diagnosis' && diagnosisResult && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                        <Activity className="mr-3" size={28} /> Diagnosis Results
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-6 rounded-xl shadow-md">
                        <p><span className="font-semibold">Parasite:</span> {diagnosisResult.parasite_name}</p>
                        <p><span className="font-semibold">Average Confidence:</span> {(diagnosisResult.average_confidence * 100).toFixed(2)}%</p>
                        <p><span className="font-semibold">Count:</span> {diagnosisResult.count}</p>
                        <p><span className="font-semibold">Severity Level:</span> {diagnosisResult.severity_level}</p>
                        <p><span className="font-semibold">Status:</span> {diagnosisResult.status}</p>
                        <p><span className="font-semibold">Parasite Density:</span> {diagnosisResult.parasite_density.toFixed(2)} parasites/μL</p>
                        <p><span className="font-semibold">Total WBCs:</span> {diagnosisResult.total_wbcs} cells/μL</p>
                      </div>
                      <div className="mt-6">{renderSeverityAlert()}</div>
                      <div className="h-80 mt-8 bg-white p-4 rounded-xl shadow-md">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#60A5FA" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                      <button
                        className="mt-6 flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                        onClick={() => setShowImageDetails(!showImageDetails)}
                      >
                        {showImageDetails ? <ChevronUp className="mr-2" /> : <ChevronDown className="mr-2" />}
                        {showImageDetails ? 'Hide' : 'Show'} Individual Image Results
                      </button>
                      {showImageDetails && (
                        <div className="mt-6 space-y-4">
                          <h4 className="font-bold text-xl mb-4 text-gray-800">Individual Image Results</h4>
                          {imageDiagnoses.map((diagnosis, index) => (
                            <div key={index} className="bg-gray-50 p-4 rounded-lg shadow-md">
                              <p><span className="font-semibold">Image ID:</span> {diagnosis.image_id}</p>
                              <p><span className="font-semibold">Parasite Count:</span> {diagnosis.count}</p>
                              <p><span className="font-semibold">WBC Count:</span> {diagnosis.wbc_count}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'symptoms' && visitData && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                        <Thermometer className="mr-3" size={28} /> Symptoms and Notes
                      </h3>
                      <div className="bg-yellow-50 p-6 rounded-xl shadow-md">
                        <h4 className="font-semibold text-lg mb-2 text-yellow-800">Symptoms</h4>
                        <p>{visitData.symptoms || 'No symptoms recorded'}</p>
                      </div>
                      <div className="bg-purple-50 p-6 rounded-xl shadow-md">
                        <h4 className="font-semibold text-lg mb-2 text-purple-800">Notes</h4>
                        <p>{visitData.notes || 'No notes recorded'}</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'treatment' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                        <ClipboardList className="mr-3" size={28} /> Treatment Plan
                      </h3>
                      <textarea
                        placeholder="Enter treatment plan here..."
                        value={treatmentPlan}
                        onChange={(e) => setTreatmentPlan(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
                        rows={10}
                      />
                    </div>
                  )}

                  {activeTab === 'next-steps' && (
                    <div className="space-y-6">
                      <h3 className="font-bold text-2xl mb-4 text-gray-800 flex items-center">
                        <FileText className="mr-3" size={28} /> Next Steps
                      </h3>
                      <textarea
                        placeholder="Enter next steps here..."
                        value={nextSteps}
                        onChange={(e) => setNextSteps(e.target.value)}
                        className="w-full p-4 border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:ring focus:ring-blue-200 transition-colors"
                        rows={10}
                      />
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleDownloadReport}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl flex items-center justify-center transition-colors shadow-md"
              >
                <Download className="mr-3" size={24} /> Download Full Report
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiagnosisModal;