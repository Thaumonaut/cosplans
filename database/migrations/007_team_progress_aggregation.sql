-- Function to calculate aggregated progress for all shoots in a team
CREATE OR REPLACE FUNCTION calculate_team_progress(p_team_id UUID)
RETURNS TABLE (
  avg_overall_progress DECIMAL(5,2),
  avg_costume_progress DECIMAL(5,2),
  avg_props_progress DECIMAL(5,2),
  avg_location_progress DECIMAL(5,2),
  avg_team_progress DECIMAL(5,2),
  avg_checklist_progress DECIMAL(5,2),
  avg_editing_progress DECIMAL(5,2)
) AS $$
DECLARE
  team_shoots UUID[];
  shoot_progresses DECIMAL(5,2)[];
BEGIN
  -- Get all shoot IDs for the team
  SELECT ARRAY_AGG(id) INTO team_shoots
  FROM shoots
  WHERE team_id = p_team_id;

  -- If no shoots, return zeros
  IF team_shoots IS NULL OR array_length(team_shoots, 1) = 0 THEN
    RETURN QUERY SELECT 0, 0, 0, 0, 0, 0, 0;
    RETURN;
  END IF;

  -- For each shoot, calculate progress and collect results
  SELECT ARRAY_AGG(
    (costume_progress + props_progress + location_progress + team_progress + checklist_progress + editing_progress) / 6
  ) INTO shoot_progresses
  FROM progress_trackers
  WHERE shoot_id = ANY(team_shoots);

  -- Calculate averages (with fallback to 0 if no progress data)
  RETURN QUERY
  SELECT
    COALESCE(AVG(overall_progress), 0) as avg_overall_progress,
    COALESCE(AVG(costume_progress), 0) as avg_costume_progress,
    COALESCE(AVG(props_progress), 0) as avg_props_progress,
    COALESCE(AVG(location_progress), 0) as avg_location_progress,
    COALESCE(AVG(team_progress), 0) as avg_team_progress,
    COALESCE(AVG(checklist_progress), 0) as avg_checklist_progress,
    COALESCE(AVG(editing_progress), 0) as avg_editing_progress
  FROM progress_trackers
  WHERE shoot_id = ANY(team_shoots);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_team_progress(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION calculate_team_progress(UUID) IS
  'Calculates aggregated progress metrics for all shoots in a team. Returns averages across all team shoots.';
