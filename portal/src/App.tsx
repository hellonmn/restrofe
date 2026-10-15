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
    <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: '#F8FAFC' }}>
      {/* Sidebar (fixed 260px) */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', minWidth: 0 }}>
        <Header />

        <main style={{ flex: 1, overflowY: 'auto', padding: '0 32px 32px 32px' }}>
          <div style={{ maxWidth: '1440px', margin: '0 auto' }}>
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
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 50,
            padding: '12px 18px',
            borderRadius: '16px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '12px',
            fontWeight: 700,
            backgroundColor: toast.type === 'error' ? '#991B1B' : toast.type === 'info' ? '#1E293B' : '#064E3B',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          {toast.type === 'error' ? (
            <AlertCircle size={16} color="#F87171" />
          ) : toast.type === 'info' ? (
            <Info size={16} color="#60A5FA" />
          ) : (
            <CheckCircle2 size={16} color="#34D399" />
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
