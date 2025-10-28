import { supabase } from '../lib/supabase';

export async function seedMockData(userId: string) {
  const projectsData = [
    {
      org_id: userId,
      name: 'Community Health Initiative',
      description: 'Providing healthcare services to underserved communities',
      status: 'active' as const,
      start_date: '2024-01-15',
      end_date: '2024-12-31',
      budget: 250000,
    },
    {
      org_id: userId,
      name: 'Youth Education Program',
      description: 'After-school tutoring and mentorship for at-risk youth',
      status: 'active' as const,
      start_date: '2024-03-01',
      end_date: '2025-02-28',
      budget: 150000,
    },
    {
      org_id: userId,
      name: 'Environmental Awareness Campaign',
      description: 'Community workshops on sustainable practices',
      status: 'completed' as const,
      start_date: '2023-06-01',
      end_date: '2023-12-31',
      budget: 75000,
    },
  ];

  const fundersData = [
    {
      org_id: userId,
      name: 'Global Impact Foundation',
      contact_name: 'Sarah Johnson',
      contact_email: 'sarah@globalimpact.org',
      logo_url: 'https://via.placeholder.com/150?text=GIF',
      relationship_status: 'active',
    },
    {
      org_id: userId,
      name: 'Community Trust Fund',
      contact_name: 'Michael Chen',
      contact_email: 'mchen@communitytrust.org',
      logo_url: 'https://via.placeholder.com/150?text=CTF',
      relationship_status: 'active',
    },
  ];

  const activitiesData = [
    {
      org_id: userId,
      activity_type: 'update',
      title: 'New project proposal submitted',
      description: 'Youth mentorship program proposal sent to Community Trust Fund',
      priority: 'important' as const,
      due_date: null,
      completed: false,
    },
    {
      org_id: userId,
      activity_type: 'action',
      title: 'Quarterly report due',
      description: 'Submit Q4 report to Global Impact Foundation',
      priority: 'urgent' as const,
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      org_id: userId,
      activity_type: 'update',
      title: 'Grant approved',
      description: '$150,000 grant approved for Youth Education Program',
      priority: 'normal' as const,
      due_date: null,
      completed: false,
    },
    {
      org_id: userId,
      activity_type: 'action',
      title: 'Schedule funder meeting',
      description: 'Arrange quarterly check-in with Sarah Johnson',
      priority: 'important' as const,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
    {
      org_id: userId,
      activity_type: 'update',
      title: 'Project milestone reached',
      description: 'Community Health Initiative served 500th family',
      priority: 'normal' as const,
      due_date: null,
      completed: true,
    },
    {
      org_id: userId,
      activity_type: 'action',
      title: 'Update website content',
      description: 'Add recent success stories to organization website',
      priority: 'normal' as const,
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      completed: false,
    },
  ];

  const reportsData = [
    {
      org_id: userId,
      title: 'Q4 2024 Annual Impact Report',
      report_type: 'annual' as const,
      status: 'draft' as const,
      content: {
        summary: 'Overview of organizational impact in Q4 2024',
        sections: ['Executive Summary', 'Program Highlights', 'Financial Overview'],
      },
    },
    {
      org_id: userId,
      title: 'Global Impact Foundation - Project Update',
      report_type: 'funder' as const,
      status: 'complete' as const,
      content: {
        summary: 'Detailed progress report for Global Impact Foundation',
        sections: ['Project Status', 'Outcomes Achieved', 'Budget Summary'],
      },
      generated_url: 'https://example.com/reports/gif-update-q3.pdf',
    },
    {
      org_id: userId,
      title: 'Community Health Initiative - Mid-Year Review',
      report_type: 'project' as const,
      status: 'in-review' as const,
      content: {
        summary: 'Mid-year progress review for Community Health Initiative',
        sections: ['Milestones', 'Challenges', 'Next Steps'],
      },
    },
  ];

  try {
    await supabase.from('projects').insert(projectsData);
    await supabase.from('funders').insert(fundersData);
    await supabase.from('activities').insert(activitiesData);
    await supabase.from('reports').insert(reportsData);

    return { success: true };
  } catch (error) {
    console.error('Error seeding data:', error);
    return { success: false, error };
  }
}
