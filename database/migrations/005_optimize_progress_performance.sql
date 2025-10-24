-- Performance Fix: Disable Heavy Progress Triggers
-- The current triggers are causing 4+ second load times due to complex calculations

-- Drop existing triggers that are causing performance issues
DROP TRIGGER IF EXISTS trigger_recalc_progress_costumes ON costumes;
DROP TRIGGER IF EXISTS trigger_recalc_progress_props ON props;
DROP TRIGGER IF EXISTS trigger_recalc_progress_locations ON locations;
DROP TRIGGER IF EXISTS trigger_recalc_progress_members ON shoot_members;
DROP TRIGGER IF EXISTS trigger_recalc_progress_checklists ON checklists;
DROP TRIGGER IF EXISTS trigger_recalc_progress_editing ON editing_tasks;

-- Drop the heavy trigger function
DROP FUNCTION IF EXISTS recalculate_shoot_progress();

-- Create optimized indexes for progress queries (if they don't exist)
CREATE INDEX IF NOT EXISTS idx_costumes_shoot_status ON costumes(shoot_id, status);
CREATE INDEX IF NOT EXISTS idx_props_shoot_status ON props(shoot_id, status);
CREATE INDEX IF EXISTS idx_locations_shoot_status ON locations(shoot_id, status);
CREATE INDEX IF NOT EXISTS idx_shoot_members_shoot_status ON shoot_members(shoot_id, status);
CREATE INDEX IF NOT EXISTS idx_checklists_shoot_completed ON checklists(shoot_id, completed);
CREATE INDEX IF NOT EXISTS idx_editing_tasks_shoot_status ON editing_tasks(shoot_id, status);

-- Create lightweight progress calculation function (async-friendly)
CREATE OR REPLACE FUNCTION calculate_shoot_progress_optimized(p_shoot_id UUID)
RETURNS TABLE (
  costume_progress DECIMAL(5,2),
  props_progress DECIMAL(5,2),
  location_progress DECIMAL(5,2),
  team_progress DECIMAL(5,2),
  checklist_progress DECIMAL(5,2),
  editing_progress DECIMAL(5,2),
  overall_progress DECIMAL(5,2)
) AS $$
DECLARE
  v_costume DECIMAL(5,2) := 0;
  v_props DECIMAL(5,2) := 0;
  v_location DECIMAL(5,2) := 0;
  v_team DECIMAL(5,2) := 0;
  v_checklist DECIMAL(5,2) := 0;
  v_editing DECIMAL(5,2) := 0;
  v_overall DECIMAL(5,2) := 0;
BEGIN
  -- Calculate costume progress using indexed queries
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'completed' THEN 100
      WHEN 'in_progress' THEN 50
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_costume
  FROM costumes
  WHERE shoot_id = p_shoot_id;

  -- Calculate props progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'owned' THEN 100
      WHEN 'ordered' THEN 75
      WHEN 'needed' THEN 25
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_props
  FROM props
  WHERE shoot_id = p_shoot_id;

  -- Calculate location progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'confirmed' THEN 100
      WHEN 'contacted' THEN 50
      WHEN 'scouting' THEN 25
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_location
  FROM locations
  WHERE shoot_id = p_shoot_id;

  -- Calculate team progress (confirmed members)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'confirmed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO v_team
  FROM shoot_members
  WHERE shoot_id = p_shoot_id;

  -- Calculate checklist progress
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE completed = true)::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO v_checklist
  FROM checklists
  WHERE shoot_id = p_shoot_id;

  -- Calculate editing progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'completed' THEN 100
      WHEN 'in_review' THEN 80
      WHEN 'in_progress' THEN 40
      WHEN 'pending' THEN 0
      ELSE 0
    END
  ), 0) INTO v_editing
  FROM editing_tasks
  WHERE shoot_id = p_shoot_id;

  -- Calculate overall progress (weighted average)
  v_overall := (
    (v_costume * 0.25) +
    (v_props * 0.15) +
    (v_location * 0.10) +
    (v_team * 0.15) +
    (v_checklist * 0.20) +
    (v_editing * 0.15)
  );

  -- Return all progress values
  RETURN QUERY SELECT
    v_costume, v_props, v_location, v_team, v_checklist, v_editing, v_overall;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a manual progress update function for when needed
CREATE OR REPLACE FUNCTION update_shoot_progress(p_shoot_id UUID)
RETURNS void AS $$
DECLARE
  progress_record RECORD;
BEGIN
  -- Calculate progress using optimized function
  SELECT * INTO progress_record FROM calculate_shoot_progress_optimized(p_shoot_id);

  -- Update progress tracker
  UPDATE progress_trackers
  SET
    costume_progress = progress_record.costume_progress,
    props_progress = progress_record.props_progress,
    location_progress = progress_record.location_progress,
    team_progress = progress_record.team_progress,
    checklist_progress = progress_record.checklist_progress,
    editing_progress = progress_record.editing_progress,
    overall_progress = progress_record.overall_progress,
    calculation_timestamp = NOW()
  WHERE shoot_id = p_shoot_id;

  -- If no progress tracker exists, create one
  IF NOT FOUND THEN
    INSERT INTO progress_trackers (
      shoot_id,
      costume_progress,
      props_progress,
      location_progress,
      team_progress,
      checklist_progress,
      editing_progress,
      overall_progress,
      calculation_timestamp
    ) VALUES (
      p_shoot_id,
      progress_record.costume_progress,
      progress_record.props_progress,
      progress_record.location_progress,
      progress_record.team_progress,
      progress_record.checklist_progress,
      progress_record.editing_progress,
      progress_record.overall_progress,
      NOW()
    );
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant permissions
GRANT EXECUTE ON FUNCTION calculate_shoot_progress_optimized(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION update_shoot_progress(UUID) TO authenticated;

-- Add comment for documentation
COMMENT ON FUNCTION calculate_shoot_progress_optimized(UUID) IS
  'Optimized progress calculation using indexes. Returns all progress metrics for a shoot.';

COMMENT ON FUNCTION update_shoot_progress(UUID) IS
  'Manually updates progress for a specific shoot. Call this instead of relying on triggers.';
