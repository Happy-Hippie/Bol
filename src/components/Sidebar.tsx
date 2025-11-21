import { useState, useEffect } from 'react';
import { Home, Building2, FileText, Settings, LogOut, Bot, ChevronDown, ChevronUp, Info, FolderOpen, BookOpen, Compass, Image } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface SubMenuItem {
  id: string;
  label: string;
  icon: any;
  route: string;
  badge?: number;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  badge?: string;
  subItems?: SubMenuItem[];
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { signOut } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const profileSubItems: SubMenuItem[] = [
    { id: 'profile-organization', label: 'Organization Info', icon: Info, route: 'profile-organization' },
    { id: 'profile-projects', label: 'Projects', icon: FolderOpen, route: 'profile-projects', badge: 2 },
    { id: 'profile-context', label: 'Context Library', icon: BookOpen, route: 'profile-context' },
    { id: 'profile-perspectives', label: 'Perspectives', icon: Compass, route: 'profile-perspectives' },
    { id: 'profile-images', label: 'Image Library', icon: Image, route: 'profile-images' },
  ];

  const menuItems: MenuItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'Profile', icon: Building2, subItems: profileSubItems },
    { id: 'ai-assistant', label: 'AI Assistant', icon: Bot, badge: 'BETA' },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  useEffect(() => {
    if (activeTab.startsWith('profile-')) {
      setIsProfileOpen(true);
    }
  }, [activeTab]);

  const handleProfileClick = () => {
    if (!isProfileOpen) {
      setIsProfileOpen(true);
      onTabChange('profile-organization');
    } else {
      setIsProfileOpen(!isProfileOpen);
    }
  };

  const isProfileActive = activeTab.startsWith('profile-');

  return (
    <div className="w-64 bg-gradient-to-b from-bol-purple via-bol-purple to-bol-purple/95 h-screen fixed left-0 top-0 flex flex-col overflow-y-auto shadow-2xl">
      <div className="p-6 bg-white">
        <div className="mb-2 flex justify-center">
          <img
            src="/Bol logo.png"
            alt="BOL Logo"
            className="h-20 w-auto"
          />
        </div>
        <p className="text-bol-purple text-center text-sm font-semibold tracking-wide">Communications Simplified.</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id || (item.id === 'profile' && isProfileActive);

            if (item.subItems) {
              return (
                <li key={item.id}>
                  <button
                    onClick={handleProfileClick}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isProfileActive
                        ? 'bg-white text-bol-purple shadow-lg'
                        : 'text-white/90 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                    {isProfileOpen ? (
                      <ChevronUp size={16} className="ml-auto" />
                    ) : (
                      <ChevronDown size={16} className="ml-auto" />
                    )}
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-200 ${
                      isProfileOpen ? 'max-h-[250px] opacity-100' : 'max-h-0 opacity-0'
                    }`}
                  >
                    <ul className="mt-1 space-y-1">
                      {item.subItems.map((subItem) => {
                        const SubIcon = subItem.icon;
                        const isSubActive = activeTab === subItem.id;
                        return (
                          <li key={subItem.id}>
                            <button
                              onClick={() => onTabChange(subItem.id)}
                              className={`w-full flex items-center gap-2 pl-12 pr-4 py-2.5 text-sm rounded-lg transition-all duration-150 ${
                                isSubActive
                                  ? 'bg-bol-pink text-white font-semibold shadow-md'
                                  : 'text-white/80 hover:bg-white/10 hover:text-white'
                              }`}
                            >
                              <SubIcon size={16} />
                              <span className="flex-1 text-left">{subItem.label}</span>
                              {subItem.badge && (
                                <span className="text-xs px-2 py-0.5 bg-bol-orange text-white rounded-full font-bold min-w-[20px] text-center">
                                  {subItem.badge}
                                </span>
                              )}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </li>
              );
            }

            return (
              <li key={item.id}>
                <button
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-white text-bol-purple shadow-lg'
                      : 'text-white/90 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon size={20} />
                  <span className="font-medium">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-xs px-2 py-0.5 bg-bol-orange rounded-full font-bold">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-white/20">
        <button
          onClick={signOut}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-white/10 text-white hover:bg-bol-orange hover:shadow-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}
