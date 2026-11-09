import React, { useState } from 'react';
import { History, Calendar, FileText, Download, Search, CheckCircle, Clock } from 'lucide-react';
import RiskBadge from '../common/RiskBadge';

export default function PatientHistoryView({ patients, onSelectPatient }) {
  const [searchTerm, setSearchTerm] = useState('');

  const historyRecords = [
    {
      id: 'HIST-1049',
      date: 'Oct 24, 2026',
      time: '14:32',
      patientName: 'Eleanor Vance',
      mrn: 'MRN-2026-0419',
      chiefComplaint: 'Transient chest tightness post exertion, resolved with rest',
      triageLevel: 'MEDIUM',
      esiLevel: 3,
      department: 'Cardiology Center',
      disposition: 'Discharged with outpatient stress test referral',
      attendingDoctor: 'Dr. Rachel Vance, MD',
    },
    {
      id: 'HIST-1048',
      date: 'Sep 12, 2026',
      time: '09:15',
      patientName: 'David Chen',
      mrn: 'MRN-2026-0421',
      chiefComplaint: 'Right wrist contusion after cycling collision',
      triageLevel: 'LOW',
      esiLevel: 4,
      department: 'Orthopedics & Fracture',
      disposition: 'X-ray negative for fracture; wrist splint applied',
      attendingDoctor: 'Dr. Gregory House, MD',
    },
    {
      id: 'HIST-1047',
      date: 'Aug 03, 2026',
      time: '21:05',
      patientName: 'Aisha Al-Mansoor',
      mrn: 'MRN-2026-0423',
      chiefComplaint: 'Seasonal asthma flare-up, mild dyspnea',
      triageLevel: 'MEDIUM',
      esiLevel: 3,
      department: 'Pulmonology & Respiratory',
      disposition: 'Duoneb nebulization given, discharged with inhaler refill',
      attendingDoctor: 'Dr. Sarah Carter, RN',
    },
    {
      id: 'HIST-1046',
      date: 'Jul 19, 2026',
      time: '18:40',
      patientName: 'Marcus Brody',
      mrn: 'MRN-2026-0420',
      chiefComplaint: 'Viral gastroenteritis, dehydration symptoms',
      triageLevel: 'LOW',
      esiLevel: 4,
      department: 'General Outpatient & Triage',
      disposition: 'IV saline rehydration, discharged stable',
      attendingDoctor: 'Dr. James Wilson, MD',
    }
  ];

  const filtered = historyRecords.filter(r => 
    r.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.mrn.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">Patient Longitudinal History & Archives</h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700">
              Past Admissions
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Retrospective triage records, prior clinical visits, diagnostic outcomes, and physician notes
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search past records by name/MRN..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs outline-none focus:bg-white focus:border-hospital-500"
          />
        </div>
      </div>

      {/* History timeline list */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
        {filtered.map((record) => (
          <div 
            key={record.id} 
            className="p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
          >
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-hospital-50 text-hospital-700 border border-hospital-100 shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-extrabold text-slate-900 text-sm">{record.patientName}</span>
                  <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {record.mrn}
                  </span>
                  <RiskBadge level={record.triageLevel} esiLevel={record.esiLevel} size="sm" />
                </div>
                <p className="text-slate-700 font-medium">"{record.chiefComplaint}"</p>
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 pt-1">
                  <span>Visit Date: <strong className="text-slate-700">{record.date} at {record.time}</strong></span>
                  <span>•</span>
                  <span>Dept: <strong className="text-slate-700">{record.department}</strong></span>
                  <span>•</span>
                  <span>Physician: <strong className="text-slate-700">{record.attendingDoctor}</strong></span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center gap-2 border-t md:border-t-0 pt-2 md:pt-0">
              <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg font-semibold border border-emerald-200">
                {record.disposition}
              </span>
              <button 
                onClick={() => alert(`Clinical Summary PDF downloaded for ${record.patientName}`)}
                className="flex items-center gap-1.5 text-xs text-hospital-600 hover:text-hospital-700 font-semibold"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Summary</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
