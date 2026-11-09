import React, { useState, useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import StatCards from './components/dashboard/StatCards';
import TriageQueueTable from './components/dashboard/TriageQueueTable';
import DepartmentLoad from './components/dashboard/DepartmentLoad';
import AnalyticsOverview from './components/dashboard/AnalyticsOverview';
import TriageAssessmentModal from './components/dashboard/TriageAssessmentModal';
import PatientIntakeModal from './components/triage/PatientIntakeModal';
import AuthModal from './components/auth/AuthModal';
import VitalsMonitoringView from './components/views/VitalsMonitoringView';
import AiTriageView from './components/views/AiTriageView';
import PatientHistoryView from './components/views/PatientHistoryView';
import DepartmentRoutingView from './components/views/DepartmentRoutingView';
import PatientAssessmentView from './components/views/PatientAssessmentView';
import { api } from './services/api';
import { 
  MOCK_STATS, 
  MOCK_DEPARTMENTS, 
  MOCK_PATIENTS 
} from './mockData/mockTriageData';
import { ShieldCheck, Sparkles, Activity, CheckCircle, ArrowRight } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [departments, setDepartments] = useState(MOCK_DEPARTMENTS);
  const [stats, setStats] = useState(MOCK_STATS);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  
  // Modals & Drawers
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isIntakeModalOpen, setIsIntakeModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    name: 'Dr. Rachel Vance',
    role: 'Lead Triage Physician',
    email: 'doctor.vance@hospital.org',
    initials: 'RV'
  });

  // Mobile sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // Sync with live backend API on mount
  useEffect(() => {
    async function loadBackendData() {
      try {
        const [liveQueue, liveDepts, liveStats] = await Promise.all([
          api.getTriageQueue(),
          api.getDepartments(),
          api.getOverviewStats(),
        ]);

        if (liveQueue && liveQueue.length > 0) {
          // Format triage queue items to match table format
          const formattedPatients = liveQueue.map(item => ({
            id: item._id,
            triageId: item._id,
            mrn: item.patientMRN || item.patient?.mrn || 'MRN-2026',
            name: item.patientName || item.patient?.name || 'Anonymous',
            age: item.patient?.age || 40,
            gender: item.patient?.gender || 'Male',
            arrivalTime: 'Live Queue',
            arrivalMode: item.patient?.arrivalMode || 'Walk-in',
            chiefComplaint: item.chiefComplaint,
            riskLevel: item.riskLevel,
            esiLevel: item.esiLevel,
            aiConfidence: item.aiConfidence,
            department: item.department,
            vitals: item.vitals,
            status: item.status,
            allergies: item.patient?.allergies || ['None known'],
            chronicConditions: item.patient?.chronicConditions || [],
            aiRationale: item.aiRationale,
            recommendedActions: item.recommendedActions,
          }));
          setPatients(formattedPatients);
          setIsBackendConnected(true);
        }

        if (liveDepts && liveDepts.length > 0) {
          setDepartments(liveDepts);
        }

        if (liveStats) {
          setStats(liveStats);
        }
      } catch (e) {
        console.warn('Backend live sync error, using mock data:', e);
      }
    }

    loadBackendData();
  }, []);

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleAddPatient = async (newPatient) => {
    // Optimistic UI update
    setPatients(prev => [newPatient, ...prev]);
    setStats(prev => ({
      ...prev,
      totalPatientsToday: prev.totalPatientsToday + 1,
      criticalPatients: newPatient.riskLevel === 'HIGH' ? prev.criticalPatients + 1 : prev.criticalPatients,
      urgentPatients: newPatient.riskLevel === 'MEDIUM' ? prev.urgentPatients + 1 : prev.urgentPatients,
      routinePatients: newPatient.riskLevel === 'LOW' ? prev.routinePatients + 1 : prev.routinePatients,
    }));

    // Post to backend API
    try {
      await api.assessPatient({
        patientDetails: {
          name: newPatient.name,
          age: newPatient.age,
          gender: newPatient.gender,
          arrivalMode: newPatient.arrivalMode,
          allergies: newPatient.allergies,
          chronicConditions: newPatient.chronicConditions,
        },
        chiefComplaint: newPatient.chiefComplaint,
        vitals: newPatient.vitals,
      });
    } catch (e) {
      console.warn('Failed to save to backend API:', e);
    }

    showNotification(`Patient ${newPatient.name} admitted to triage queue successfully.`);
  };

  const handleDispatchPatient = async (patient) => {
    setPatients(prev => prev.map(p => (p.id === patient.id || p.triageId === patient.triageId) ? { ...p, status: `Dispatched to ${patient.department}` } : p));
    
    if (patient.triageId || patient.id) {
      try {
        await api.dispatchPatient(patient.triageId || patient.id, patient.department);
      } catch (e) {
        console.warn('Dispatch API call error:', e);
      }
    }

    showNotification(`${patient.name} dispatched to ${patient.department}.`);
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    showNotification(`Welcome, ${user.name}!`);
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-slate-800 font-sans flex flex-col selection:bg-hospital-500 selection:text-white">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in slide-in-from-top-2 border border-slate-700">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-medium">{notification}</span>
        </div>
      )}

      {/* Main Top Header */}
      <Navbar 
        onOpenNewPatient={() => setIsIntakeModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        isAuthenticated={isAuthenticated}
        user={currentUser}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isBackendConnected={isBackendConnected}
      />

      <div className="flex-1 flex">
        {/* Sidebar Navigation */}
        <Sidebar 
          currentView={currentView}
          onSelectView={(view) => {
            if (view === 'registration') {
              setIsIntakeModalOpen(true);
            } else {
              setCurrentView(view);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 lg:pl-64 p-4 lg:p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* View Routing */}
          {currentView === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <StatCards stats={stats} />

              {/* Triage Queue Table */}
              <TriageQueueTable 
                patients={patients} 
                onSelectPatient={(patient) => setSelectedPatient(patient)} 
              />

              {/* Bottom 2-col: Department Capacity & Analytics Quick Look */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-7">
                  <DepartmentLoad departments={departments} />
                </div>
                <div className="lg:col-span-5 bg-gradient-to-br from-hospital-900 to-hospital-800 text-white rounded-2xl p-6 shadow-md flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 rounded-xl bg-white/10 backdrop-blur">
                        <Sparkles className="w-5 h-5 text-hospital-300" />
                      </div>
                      <h3 className="font-extrabold text-base tracking-tight">AI Clinical Assistant</h3>
                    </div>
                    <p className="text-xs text-blue-100 leading-relaxed mb-4">
                      The OpenAI triage model continuously cross-checks presenting complaints against real-time vital telemetry. Patients exhibiting early decompensation indicators are automatically promoted in priority.
                    </p>
                    <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur border border-white/10 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-blue-100">
                        <span>Current High Risk Cases:</span>
                        <span className="font-black text-white">{stats.criticalPatients}</span>
                      </div>
                      <div className="flex items-center justify-between text-blue-100">
                        <span>Model Recommendation Rate:</span>
                        <span className="font-black text-emerald-400">98.2% acceptance</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-4">
                    <button 
                      onClick={() => setCurrentView('ai-triage')}
                      className="text-xs font-bold text-white hover:text-blue-200 flex items-center gap-1 transition-colors"
                    >
                      <span>Explore AI Triage Predictions</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => setCurrentView('analytics')}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur transition-all"
                    >
                      View Reports
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentView === 'assessment' && (
            <PatientAssessmentView 
              patients={patients}
              onAssessmentSaved={(newRecord) => {
                setPatients(prev => [newRecord, ...prev]);
                setStats(prev => ({
                  ...prev,
                  totalPatientsToday: prev.totalPatientsToday + 1,
                  criticalPatients: (newRecord.riskLevel === 'HIGH' || newRecord.urgencyCategory === 'HIGH') ? prev.criticalPatients + 1 : prev.criticalPatients,
                  urgentPatients: (newRecord.riskLevel === 'MEDIUM' || newRecord.urgencyCategory === 'MEDIUM') ? prev.urgentPatients + 1 : prev.urgentPatients,
                  routinePatients: (newRecord.riskLevel === 'LOW' || newRecord.urgencyCategory === 'LOW') ? prev.routinePatients + 1 : prev.routinePatients,
                }));
                showNotification(`Assessment saved for ${newRecord.patientName} (${newRecord.urgencyCategory || newRecord.riskLevel} RISK).`);
              }}
              onNavigateToAiTriage={(record) => {
                setSelectedPatient(record);
                setCurrentView('ai-triage');
              }}
              onNavigateToQueue={() => setCurrentView('dashboard')}
            />
          )}

          {currentView === 'vitals' && (
            <VitalsMonitoringView 
              patients={patients} 
              onSelectPatient={(p) => setSelectedPatient(p)} 
            />
          )}

          {currentView === 'ai-triage' && (
            <AiTriageView 
              patients={patients} 
              onSelectPatient={(p) => setSelectedPatient(p)} 
              onDispatchPatient={handleDispatchPatient}
            />
          )}

          {currentView === 'departments' && (
            <DepartmentRoutingView 
              departments={departments} 
            />
          )}

          {currentView === 'history' && (
            <PatientHistoryView 
              patients={patients} 
              onSelectPatient={(p) => setSelectedPatient(p)} 
            />
          )}

          {currentView === 'analytics' && (
            <AnalyticsOverview />
          )}

        </main>
      </div>

      {/* Triage Assessment Deep-Dive Modal */}
      <TriageAssessmentModal 
        patient={selectedPatient}
        onClose={() => setSelectedPatient(null)}
        onDispatch={handleDispatchPatient}
      />

      {/* Patient Intake / Registration Modal */}
      <PatientIntakeModal 
        isOpen={isIntakeModalOpen}
        onClose={() => setIsIntakeModalOpen(false)}
        onAddPatient={handleAddPatient}
      />

      {/* Auth Modal (Login / Signup) */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

    </div>
  );
}
