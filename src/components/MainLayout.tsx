import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Dashboard } from './Dashboard';
import { Profile } from './Profile';
import { Reports } from './Reports';
import { Settings } from './Settings';
import { Perspectives } from './Perspectives';
import { ImageLibrary } from './ImageLibrary';
import { AIAssistant } from './AIAssistant';

export function MainLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
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
      case 'ai-assistant':
        return <AIAssistant />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-bol-light">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="ml-64 flex-1">
        <main className="p-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}
