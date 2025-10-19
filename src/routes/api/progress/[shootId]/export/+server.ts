import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const { supabase, ability } = locals;
  const shootId = params.shootId;
  const format = url.searchParams.get('format') || 'csv';

  // Check permissions
  if (!ability || !ability.can('read', 'ProgressTracker')) {
    throw error(403, 'Unauthorized to export progress data');
  }

  // Fetch progress data
  const { data: progress, error: progressError } = await supabase
    .from('progress_trackers')
    .select('*')
    .eq('shoot_id', shootId)
    .single();

  if (progressError) {
    throw error(404, 'Progress data not found');
  }

  // Fetch shoot info
  const { data: shoot, error: shootError } = await supabase
    .from('shoots')
    .select('name, scheduled_date, team_id')
    .eq('id', shootId)
    .single();

  if (shootError) {
    throw error(404, 'Shoot not found');
  }

  // Fetch historical snapshots
  const { data: snapshots } = await supabase
    .from('progress_snapshots')
    .select('*')
    .eq('shoot_id', shootId)
    .order('snapshot_date', { ascending: true });

  if (format === 'csv') {
    return generateCSV(shoot, progress, snapshots || []);
  } else if (format === 'json') {
    return generateJSON(shoot, progress, snapshots || []);
  } else {
    throw error(400, 'Unsupported export format. Use csv or json.');
  }
};

function generateCSV(shoot: any, progress: any, snapshots: any[]) {
  const lines: string[] = [];

  // Header section
  lines.push('CosPlanS Progress Report');
  lines.push(`Shoot Name,${shoot.name}`);
  lines.push(`Shoot Date,${shoot.scheduled_date || 'Not scheduled'}`);
  lines.push(`Report Generated,${new Date().toISOString()}`);
  lines.push('');

  // Current progress section
  lines.push('Current Progress Summary');
  lines.push('Category,Progress %');
  lines.push(`Overall,${progress.overall_progress.toFixed(2)}`);
  lines.push(`Costume,${progress.costume_progress.toFixed(2)}`);
  lines.push(`Props,${progress.props_progress.toFixed(2)}`);
  lines.push(`Location,${progress.location_progress.toFixed(2)}`);
  lines.push(`Team,${progress.team_progress.toFixed(2)}`);
  lines.push(`Checklist,${progress.checklist_progress.toFixed(2)}`);
  lines.push(`Editing,${progress.editing_progress.toFixed(2)}`);
  lines.push('');

  // Historical data section
  if (snapshots.length > 0) {
    lines.push('Historical Progress Data');
    lines.push('Date,Overall %,Costume %,Props %,Location %,Team %,Checklist %,Editing %');
    
    for (const snapshot of snapshots) {
      lines.push([
        snapshot.snapshot_date,
        snapshot.overall_progress.toFixed(2),
        snapshot.costume_progress.toFixed(2),
        snapshot.props_progress.toFixed(2),
        snapshot.location_progress.toFixed(2),
        snapshot.team_progress.toFixed(2),
        snapshot.checklist_progress.toFixed(2),
        snapshot.editing_progress.toFixed(2)
      ].join(','));
    }
  }

  const csvContent = lines.join('\n');
  const filename = `progress_${shoot.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

  return new Response(csvContent, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}

function generateJSON(shoot: any, progress: any, snapshots: any[]) {
  const report = {
    metadata: {
      shoot_name: shoot.name,
      shoot_date: shoot.scheduled_date,
      report_generated: new Date().toISOString(),
      format_version: '1.0'
    },
    current_progress: {
      overall: progress.overall_progress,
      categories: {
        costume: progress.costume_progress,
        props: progress.props_progress,
        location: progress.location_progress,
        team: progress.team_progress,
        checklist: progress.checklist_progress,
        editing: progress.editing_progress
      },
      last_calculated: progress.last_calculated_at
    },
    historical_data: snapshots.map(s => ({
      date: s.snapshot_date,
      overall: s.overall_progress,
      costume: s.costume_progress,
      props: s.props_progress,
      location: s.location_progress,
      team: s.team_progress,
      checklist: s.checklist_progress,
      editing: s.editing_progress
    }))
  };

  const filename = `progress_${shoot.name.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;

  return new Response(JSON.stringify(report, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="${filename}"`
    }
  });
}
