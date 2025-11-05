import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Perspectives } from './Perspectives';
import { ImageLibrary } from './ImageLibrary';
import { AIAssistant } from './AIAssistant';
import { AnnualReportWizard } from './reports/AnnualReportWizard';

export function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (location.pathname === '/') {
      setActiveTab('dashboard');
    } else if (location.pathname.startsWith('/reports')) {
      setActiveTab('reports');
    } else if (location.pathname.startsWith('/profile')) {
      setActiveTab('profile-organization');
    } else if (location.pathname === '/ai-assistant') {
      setActiveTab('ai-assistant');
    } else if (location.pathname === '/settings') {
      setActiveTab('settings');
    }
  }, [location.pathname]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

    switch (tab) {
      case 'dashboard':
        navigate('/');
        break;
      case 'reports':
        navigate('/reports');
        break;
      case 'ai-assistant':
        navigate('/ai-assistant');
        break;
      case 'settings':
        navigate('/settings');
        break;
      default:
        if (tab.startsWith('profile-')) {
          navigate('/profile');
        }
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'profile-organization':
        return <Profile section="organization" />;
      case 'profile-projects':
        return <Profile section="projects" />;
      case 'profile-context':
        return <Profile section="context" />;
      case 'profile-perspectives':
        return <Profile section="perspectives" />;
      case 'profile-images':
        return <Profile section="images" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-bol-light">
      <Sidebar activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="ml-64 flex-1">
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/profile" element={renderContent()} />
            <Route path="/ai-assistant" element={<AIAssistant />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/reports/annual/*" element={<AnnualReportWizard onClose={() => navigate('/reports')} />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
