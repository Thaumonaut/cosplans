-- Progress Auto-Recalculation Triggers
-- Automatically updates progress_trackers when related entities change

-- Function to recalculate shoot progress
CREATE OR REPLACE FUNCTION recalculate_shoot_progress()
RETURNS TRIGGER AS $$
DECLARE
  v_shoot_id UUID;
  v_costume_progress DECIMAL;
  v_props_progress DECIMAL;
  v_location_progress DECIMAL;
  v_team_progress DECIMAL;
  v_checklist_progress DECIMAL;
  v_editing_progress DECIMAL;
  v_overall_progress DECIMAL;
BEGIN
  -- Get shoot_id from the triggering table
  IF TG_TABLE_NAME = 'costumes' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSIF TG_TABLE_NAME = 'props' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSIF TG_TABLE_NAME = 'locations' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSIF TG_TABLE_NAME = 'shoot_members' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSIF TG_TABLE_NAME = 'checklists' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSIF TG_TABLE_NAME = 'editing_tasks' THEN
    v_shoot_id := COALESCE(NEW.shoot_id, OLD.shoot_id);
  ELSE
    RETURN NEW;
  END IF;

  -- Calculate costume progress (based on status)
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'completed' THEN 100
      WHEN 'in_progress' THEN 50
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_costume_progress
  FROM costumes
  WHERE shoot_id = v_shoot_id;

  -- Calculate props progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'owned' THEN 100
      WHEN 'ordered' THEN 75
      WHEN 'needed' THEN 25
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_props_progress
  FROM props
  WHERE shoot_id = v_shoot_id;

  -- Calculate location progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'confirmed' THEN 100
      WHEN 'contacted' THEN 50
      WHEN 'scouting' THEN 25
      WHEN 'planned' THEN 0
      ELSE 0
    END
  ), 0) INTO v_location_progress
  FROM locations
  WHERE shoot_id = v_shoot_id;

  -- Calculate team progress (based on confirmed members)
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE status = 'confirmed')::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO v_team_progress
  FROM shoot_members
  WHERE shoot_id = v_shoot_id;

  -- Calculate checklist progress
  SELECT COALESCE(
    (COUNT(*) FILTER (WHERE completed = true)::DECIMAL / NULLIF(COUNT(*), 0)) * 100,
    0
  ) INTO v_checklist_progress
  FROM checklists
  WHERE shoot_id = v_shoot_id;

  -- Calculate editing progress
  SELECT COALESCE(AVG(
    CASE status
      WHEN 'completed' THEN 100
      WHEN 'in_review' THEN 80
      WHEN 'in_progress' THEN 40
      WHEN 'pending' THEN 0
      ELSE 0
    END
  ), 0) INTO v_editing_progress
  FROM editing_tasks
  WHERE shoot_id = v_shoot_id;

  -- Calculate overall progress (weighted average)
  v_overall_progress := (
    (v_costume_progress * 0.25) +
    (v_props_progress * 0.15) +
    (v_location_progress * 0.10) +
    (v_team_progress * 0.15) +
    (v_checklist_progress * 0.20) +
    (v_editing_progress * 0.15)
  );

  -- Update or insert progress tracker
  INSERT INTO progress_trackers (
    shoot_id,
    overall_progress,
    costume_progress,
    props_progress,
    location_progress,
    team_progress,
    checklist_progress,
    editing_progress,
    last_calculated_at
  ) VALUES (
    v_shoot_id,
    v_overall_progress,
    v_costume_progress,
    v_props_progress,
    v_location_progress,
    v_team_progress,
    v_checklist_progress,
    v_editing_progress,
    NOW()
  )
  ON CONFLICT (shoot_id) DO UPDATE SET
    overall_progress = EXCLUDED.overall_progress,
    costume_progress = EXCLUDED.costume_progress,
    props_progress = EXCLUDED.props_progress,
    location_progress = EXCLUDED.location_progress,
    team_progress = EXCLUDED.team_progress,
    checklist_progress = EXCLUDED.checklist_progress,
    editing_progress = EXCLUDED.editing_progress,
    last_calculated_at = NOW();

  -- Create progress snapshot for historical tracking
  INSERT INTO progress_snapshots (
    shoot_id,
    overall_progress,
    costume_progress,
    props_progress,
    location_progress,
    team_progress,
    checklist_progress,
    editing_progress,
    snapshot_date
  ) VALUES (
    v_shoot_id,
    v_overall_progress,
    v_costume_progress,
    v_props_progress,
    v_location_progress,
    v_team_progress,
    v_checklist_progress,
    v_editing_progress,
    NOW()
  )
  ON CONFLICT (shoot_id, snapshot_date) DO UPDATE SET
    overall_progress = EXCLUDED.overall_progress,
    costume_progress = EXCLUDED.costume_progress,
    props_progress = EXCLUDED.props_progress,
    location_progress = EXCLUDED.location_progress,
    team_progress = EXCLUDED.team_progress,
    checklist_progress = EXCLUDED.checklist_progress,
    editing_progress = EXCLUDED.editing_progress;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for all relevant tables

-- Costumes trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_costumes ON costumes;
CREATE TRIGGER trigger_recalc_progress_costumes
  AFTER INSERT OR UPDATE OR DELETE ON costumes
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Props trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_props ON props;
CREATE TRIGGER trigger_recalc_progress_props
  AFTER INSERT OR UPDATE OR DELETE ON props
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Locations trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_locations ON locations;
CREATE TRIGGER trigger_recalc_progress_locations
  AFTER INSERT OR UPDATE OR DELETE ON locations
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Shoot members trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_members ON shoot_members;
CREATE TRIGGER trigger_recalc_progress_members
  AFTER INSERT OR UPDATE OR DELETE ON shoot_members
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Checklists trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_checklists ON checklists;
CREATE TRIGGER trigger_recalc_progress_checklists
  AFTER INSERT OR UPDATE OR DELETE ON checklists
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Editing tasks trigger
DROP TRIGGER IF EXISTS trigger_recalc_progress_editing ON editing_tasks;
CREATE TRIGGER trigger_recalc_progress_editing
  AFTER INSERT OR UPDATE OR DELETE ON editing_tasks
  FOR EACH ROW
  EXECUTE FUNCTION recalculate_shoot_progress();

-- Create progress snapshots table for historical tracking
CREATE TABLE IF NOT EXISTS progress_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shoot_id UUID NOT NULL REFERENCES shoots(id) ON DELETE CASCADE,
  overall_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  costume_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  props_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  location_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  team_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  checklist_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  editing_progress DECIMAL(5,2) NOT NULL DEFAULT 0,
  snapshot_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(shoot_id, snapshot_date)
);

-- Create index for faster historical queries
CREATE INDEX IF NOT EXISTS idx_progress_snapshots_shoot_date 
  ON progress_snapshots(shoot_id, snapshot_date DESC);

-- RLS Policies for progress_snapshots
ALTER TABLE progress_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view progress snapshots for their team's shoots"
  ON progress_snapshots FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM shoots s
      INNER JOIN team_members tm ON tm.team_id = s.team_id
      WHERE s.id = shoot_id
        AND tm.user_id = auth.uid()
    )
  );

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION recalculate_shoot_progress() TO authenticated;

-- Comments for documentation
COMMENT ON FUNCTION recalculate_shoot_progress() IS 
  'Automatically recalculates progress metrics for a shoot when related entities change. Creates both current progress and historical snapshot.';

COMMENT ON TABLE progress_snapshots IS 
  'Historical snapshots of progress metrics, one per shoot per day. Used for trend visualization and reporting.';
