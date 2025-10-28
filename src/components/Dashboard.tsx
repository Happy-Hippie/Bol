import { useState, useEffect } from 'react';
import { Clock, Bell, CheckCircle2, FileText, FolderKanban, Users, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Card } from './Card';
import { Button } from './Button';

interface Activity {
  id: string;
  activity_type: string;
  title: string;
  description: string;
  priority: 'urgent' | 'important' | 'normal';
  due_date: string | null;
  completed: boolean;
  created_at: string;
}

export function Dashboard() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, [user]);

  const loadActivities = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('activities')
      .select('*')
      .eq('org_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data) {
      setActivities(data);
    }
    setLoading(false);
  };

  const toggleComplete = async (activity: Activity) => {
    await supabase
      .from('activities')
      .update({ completed: !activity.completed })
      .eq('id', activity.id);

    loadActivities();
  };

  const getActivityBorderColor = (index: number): 'pink' | 'blue' | 'orange' => {
    const colors: ('pink' | 'blue' | 'orange')[] = ['pink', 'blue', 'orange'];
    return colors[index % colors.length];
  };

  const getPriorityBadge = (priority: string) => {
    const badges = {
      urgent: 'bg-bol-pink text-white',
      important: 'bg-bol-orange text-white',
      normal: 'bg-bol-blue text-white',
    };
    return badges[priority as keyof typeof badges] || badges.normal;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `In ${diffDays} days`;
    return `${Math.abs(diffDays)} days ago`;
  };

  const quickActions = [
    {
      title: 'Create Report',
      icon: FileText,
      gradient: 'bg-gradient-pink-orange',
      action: () => console.log('Create report'),
    },
    {
      title: 'Add Project',
      icon: FolderKanban,
      gradient: 'bg-gradient-blue-purple',
      action: () => console.log('Add project'),
    },
    {
      title: 'Manage Team',
      icon: Users,
      gradient: 'bg-gradient-orange-pink',
      action: () => console.log('Manage team'),
    },
    {
      title: 'View Analytics',
      icon: BarChart3,
      gradient: 'bg-gradient-purple-blue',
      action: () => console.log('View analytics'),
    },
  ];

  return (
    <div>
      <div className="bg-gradient-purple-blue rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-4xl font-bold mb-2">Welcome back!</h1>
        <p className="text-white/90 text-lg">
          Here's what's happening with your organization today
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-bol-purple">Activity Feed</h2>
              <button className="text-bol-blue hover:underline text-sm font-medium">
                View all
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : activities.length === 0 ? (
              <Card>
                <div className="text-center py-8 text-gray-400">
                  <Bell size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No activities yet</p>
                </div>
              </Card>
            ) : (
              <div className="space-y-3">
                {activities.map((activity, index) => (
                  <Card key={activity.id} borderColor={getActivityBorderColor(index)}>
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={activity.completed}
                        onChange={() => toggleComplete(activity)}
                        className="mt-1 w-5 h-5 accent-bol-pink cursor-pointer"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className={`font-bold text-bol-purple ${activity.completed ? 'line-through opacity-50' : ''}`}>
                            {activity.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-1 rounded ${getPriorityBadge(activity.priority)}`}>
                              {activity.priority}
                            </span>
                            {activity.due_date && (
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Clock size={12} />
                                {formatDate(activity.due_date)}
                              </span>
                            )}
                          </div>
                        </div>
                        <p className={`text-sm text-gray-600 ${activity.completed ? 'line-through opacity-50' : ''}`}>
                          {activity.description}
                        </p>
                        {activity.activity_type === 'action' && !activity.completed && (
                          <button className="mt-2 text-sm text-bol-blue hover:underline">
                            Send reminder
                          </button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-2xl font-bold text-bol-purple mb-4">Action Items</h2>
            <div className="space-y-3">
              {activities.filter(a => !a.completed && a.activity_type === 'action').slice(0, 3).map((activity) => (
                <Card key={activity.id} borderColor="orange">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-bol-orange" size={20} />
                      <div>
                        <h3 className="font-medium text-bol-purple">{activity.title}</h3>
                        {activity.due_date && (
                          <p className="text-sm text-gray-500">Due: {formatDate(activity.due_date)}</p>
                        )}
                      </div>
                    </div>
                    <Button variant="secondary" className="text-sm py-2 px-4">
                      Complete
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-bol-purple mb-4">Quick Actions</h2>
          <div className="space-y-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <Card
                  key={index}
                  gradient
                  className={`${action.gradient} cursor-pointer hover:scale-105 transition-all duration-200`}
                  onClick={action.action}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-white/20 rounded-lg">
                      <Icon size={24} />
                    </div>
                    <h3 className="text-lg font-bold">{action.title}</h3>
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-6">
            <Card borderColor="purple">
              <h3 className="font-bold text-bol-purple mb-3">Recent Reports</h3>
              <div className="space-y-2">
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Q4 Annual Report</p>
                  <p className="text-gray-500 text-xs">Draft · 2 days ago</p>
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-700">Foundation Grant Update</p>
                  <p className="text-gray-500 text-xs">Complete · 1 week ago</p>
                </div>
              </div>
              <button className="mt-3 text-sm text-bol-blue hover:underline">View all reports</button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
