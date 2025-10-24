-- Script to recalculate progress for all existing shoots
-- Run this after applying the performance optimization migration

DO $$
DECLARE
  shoot_record RECORD;
  progress_record RECORD;
BEGIN
  -- Loop through all shoots that have related data
  FOR shoot_record IN
    SELECT DISTINCT s.id
    FROM shoots s
    WHERE EXISTS (
      SELECT 1 FROM costumes WHERE shoot_id = s.id
      UNION ALL
      SELECT 1 FROM props WHERE shoot_id = s.id
      UNION ALL
      SELECT 1 FROM locations WHERE shoot_id = s.id
      UNION ALL
      SELECT 1 FROM shoot_members WHERE shoot_id = s.id
      UNION ALL
      SELECT 1 FROM checklists WHERE shoot_id = s.id
      UNION ALL
      SELECT 1 FROM editing_tasks WHERE shoot_id = s.id
    )
  LOOP
    -- Calculate progress for this shoot
    SELECT * INTO progress_record FROM calculate_shoot_progress_optimized(shoot_record.id);

    -- Update or insert progress tracker
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
    WHERE shoot_id = shoot_record.id;

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
        shoot_record.id,
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

    RAISE NOTICE 'Updated progress for shoot: %', shoot_record.id;
  END LOOP;

  RAISE NOTICE 'Progress recalculation completed for all shoots';
END $$;
