import React from 'react';
import { useRestaurant } from './context/RestaurantContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DashboardView } from './components/views/DashboardView';
import { MenuView } from './components/views/MenuView';
import { OffersView } from './components/views/OffersView';
import { TablesView } from './components/views/TablesView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettlementView } from './components/views/SettlementView';
import { AccountView } from './components/views/AccountView';
import { StandeeModal } from './components/StandeeModal';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const MainContent: React.FC = () => {
  const { activeTab, toast } = useRestaurant();

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FC]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto px-8 pt-8">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'dashboard' && <DashboardView />}
            {activeTab === 'menu' && <MenuView />}
            {activeTab === 'offers' && <OffersView />}
            {activeTab === 'tables' && <TablesView />}
            {activeTab === 'analytics' && <AnalyticsView />}
            {activeTab === 'settlement' && <SettlementView />}
            {activeTab === 'account' && <AccountView />}
          </div>
        </main>
      </div>

      {/* Standee Print Preview Modal */}
      <StandeeModal />

      {/* Floating Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl shadow-xl border flex items-center gap-2.5 text-xs font-bold transition-all transform animate-bounce ${
            toast.type === 'error'
              ? 'bg-rose-900 text-white border-rose-800'
              : toast.type === 'info'
              ? 'bg-slate-900 text-white border-slate-800'
              : 'bg-emerald-950 text-white border-emerald-800 shadow-emerald-950/20'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={16} className="text-rose-400" />
          ) : toast.type === 'info' ? (
            <Info size={16} className="text-blue-400" />
          ) : (
            <CheckCircle2 size={16} className="text-emerald-400" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return <MainContent />;
}
