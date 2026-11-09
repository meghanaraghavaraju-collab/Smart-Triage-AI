import React from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { BarChart3, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { MOCK_HOURLY_TRIAGE } from '../../mockData/mockTriageData';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

export default function AnalyticsOverview() {
  const riskDonutData = {
    labels: ['High Risk / Critical (ESI 1-2)', 'Medium Risk (ESI 3)', 'Low Risk / Routine (ESI 4-5)'],
    datasets: [
      {
        data: [9, 34, 99],
        backgroundColor: ['#ef4444', '#f59e0b', '#10b981'],
        hoverBackgroundColor: ['#dc2626', '#d97706', '#059669'],
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          padding: 15,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
            weight: '600'
          }
        }
      }
    },
    cutout: '70%',
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          boxWidth: 10,
          font: {
            family: "'Plus Jakarta Sans', sans-serif",
            size: 11,
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: { font: { size: 10 } }
      },
      y: {
        stacked: true,
        ticks: { stepSize: 5, font: { size: 10 } },
        grid: { color: '#f1f5f9' }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-slate-900">Healthcare Triage Analytics & Performance</h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Emergency department intake patterns, risk stratification distribution, and AI concordance
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 shadow-xs">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Today (Live)</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-hospital-600 hover:bg-hospital-700 text-white text-xs font-semibold shadow-xs">
            <Download className="w-3.5 h-3.5" />
            <span>Export Report (PDF)</span>
          </button>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Risk Distribution Donut Chart */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <PieChart className="w-4 h-4 text-hospital-600" />
                Triage Risk Stratification
              </h3>
              <p className="text-[11px] text-slate-500">142 total patients assessed today</p>
            </div>
          </div>

          <div className="relative h-64 my-auto">
            <Doughnut data={riskDonutData} options={donutOptions} />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
              <span className="text-3xl font-black text-slate-900">142</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patients</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100 text-center">
            <div className="p-2 rounded-xl bg-red-50 text-red-700">
              <span className="text-[10px] font-bold block uppercase">Critical</span>
              <span className="text-lg font-black">6.3%</span>
            </div>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-800">
              <span className="text-[10px] font-bold block uppercase">Urgent</span>
              <span className="text-lg font-black">23.9%</span>
            </div>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <span className="text-[10px] font-bold block uppercase">Routine</span>
              <span className="text-lg font-black">69.8%</span>
            </div>
          </div>
        </div>

        {/* Hourly Volume Stacked Bar Chart */}
        <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-hospital-600" />
                Hourly Emergency Triage Inflow
              </h3>
              <p className="text-[11px] text-slate-500">Patient arrival volume stratified by triage acuity</p>
            </div>
            <span className="text-[11px] font-semibold text-hospital-700 bg-hospital-50 px-2.5 py-1 rounded-lg">
              Peak: 15:00
            </span>
          </div>

          <div className="h-72">
            <Bar data={MOCK_HOURLY_TRIAGE} options={barOptions} />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
            <span>Peak acuity observed between 15:00 - 18:00</span>
            <span className="font-semibold text-hospital-700 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +8% vs last week
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
