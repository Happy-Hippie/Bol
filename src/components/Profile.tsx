import { OrganizationInfo } from './profile/OrganizationInfo';
import { ContextLibrary } from './profile/ContextLibrary';
import { Projects } from './profile/Projects';
import { Perspectives } from './Perspectives';
import { ImageLibrary } from './ImageLibrary';

interface ProfileProps {
  section: 'organization' | 'projects' | 'context' | 'perspectives' | 'images';
}

export function Profile({ section }: ProfileProps) {
  const getBreadcrumb = () => {
    switch (section) {
      case 'organization':
        return 'Profile / Organization Info';
      case 'projects':
        return 'Profile / Projects';
      case 'context':
        return 'Profile / Context Library';
      case 'perspectives':
        return 'Profile / Perspectives';
      case 'images':
        return 'Profile / Image Library';
      default:
        return 'Profile';
    }
  };

  const getTitle = () => {
    switch (section) {
      case 'organization':
        return 'Organization Info';
      case 'projects':
        return 'Projects';
      case 'context':
        return 'Context Library';
      case 'perspectives':
        return 'Perspectives';
      case 'images':
        return 'Image Library';
      default:
        return 'Profile';
    }
  };

  const getSubtitle = () => {
    switch (section) {
      case 'organization':
        return 'Manage your organization\'s basic information and settings';
      case 'projects':
        return '';
      case 'context':
        return 'Manage your organization\'s document library';
      case 'perspectives':
        return 'Manage guiding frameworks and perspectives';
      case 'images':
        return 'Manage your visual assets';
      default:
        return 'Manage your organization\'s information and resources';
    }
  };

  const renderContent = () => {
    switch (section) {
      case 'organization':
        return <OrganizationInfo />;
      case 'projects':
        return <Projects />;
      case 'context':
        return <ContextLibrary />;
      case 'perspectives':
        return <Perspectives />;
      case 'images':
        return <ImageLibrary />;
      default:
        return <OrganizationInfo />;
    }
  };

  return (
    <div>
      <div className="mb-6">
        <p className="text-xs text-gray-500 mb-2">{getBreadcrumb()}</p>
        <h1 className="text-3xl font-bold text-bol-purple mb-2">{getTitle()}</h1>
        <p className="text-gray-600">{getSubtitle()}</p>
      </div>

      {renderContent()}
    </div>
  );
}
