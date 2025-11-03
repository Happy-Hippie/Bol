import { useState, useEffect } from 'react';
import { FileText, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from './Card';
import { Button } from './Button';
import { ReportWizard } from './reports/ReportWizard';

interface Report {
  id: string;
  title: string;
  report_type: 'annual' | 'funder' | 'project' | 'custom';
  status: 'draft' | 'in-review' | 'complete';
  created_at: string;
  updated_at: string;
}

export function Reports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedType, setSelectedType] = useState<'annual' | 'funder' | 'project' | 'custom'>('annual');

  useEffect(() => {
    loadReports();
  }, [user]);

  const loadReports = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('reports')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setReports(data);
    }
    setLoading(false);
  };

  const handleCreateReport = (type: 'annual' | 'funder' | 'project' | 'custom') => {
    setSelectedType(type);
    setShowWizard(true);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    loadReports();
  };

  const reportTypes = [
    {
      type: 'annual',
      title: 'Annual Report',
      description: 'Yearly overview of your organization',
      color: 'pink',
      icon: '📊',
    },
    {
      type: 'funder',
      title: 'Funder Report',
      description: 'Detailed report for funding partners',
      color: 'blue',
      icon: '💼',
    },
    {
      type: 'project',
      title: 'Project Report',
      description: 'Progress update on specific projects',
      color: 'orange',
      icon: '🎯',
    },
    {
      type: 'custom',
      title: 'Custom Report',
      description: 'Build your own custom report',
      color: 'purple',
      icon: '✨',
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges = {
      draft: 'bg-bol-orange text-white',
      'in-review': 'bg-bol-blue text-white',
      complete: 'bg-green-500 text-white',
    };
    return badges[status as keyof typeof badges];
  };

  const getTypeBorderColor = (type: string): 'pink' | 'blue' | 'orange' | 'purple' => {
    const colors: Record<string, 'pink' | 'blue' | 'orange' | 'purple'> = {
      annual: 'pink',
      funder: 'blue',
      project: 'orange',
      custom: 'purple',
    };
    return colors[type] || 'purple';
  };

  return (
    <div>
      <div className="bg-gradient-purple-blue rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Reports</h1>
        <p className="text-white/90 text-lg">
          Create professional reports with AI assistance
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-bol-purple mb-4">Create New Report</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {reportTypes.map((rt) => (
            <Card
              key={rt.type}
              borderColor={getTypeBorderColor(rt.type)}
              className="cursor-pointer hover:scale-105 transition-all duration-200"
              onClick={() => handleCreateReport(rt.type as 'annual' | 'funder' | 'project' | 'custom')}
            >
              <div className="text-center">
                <div className="text-5xl mb-3">{rt.icon}</div>
                <h3 className="font-bold text-bol-purple mb-2">{rt.title}</h3>
                <p className="text-sm text-gray-600 mb-4">{rt.description}</p>
                <Button variant="gradient" className="w-full text-sm py-2">
                  <Plus size={16} className="inline mr-1" />
                  Create
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-bol-purple mb-4">Your Reports</h2>
        {loading ? (
          <div className="text-center py-8 text-gray-500">Loading...</div>
        ) : reports.length === 0 ? (
          <Card>
            <div className="text-center py-12 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p>No reports yet. Create your first report above!</p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {reports.map((report) => (
              <Card key={report.id} borderColor={getTypeBorderColor(report.report_type)}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-bol-purple">{report.title}</h3>
                    <p className="text-sm text-gray-500">
                      {report.report_type.charAt(0).toUpperCase() + report.report_type.slice(1)} Report
                    </p>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full ${getStatusBadge(report.status)}`}>
                    {report.status}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 text-sm py-2">
                    View
                  </Button>
                  <Button variant="outline" className="flex-1 text-sm py-2">
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {showWizard && (
        <ReportWizard onClose={handleCloseWizard} reportType={selectedType} />
      )}
    </div>
  );
}
