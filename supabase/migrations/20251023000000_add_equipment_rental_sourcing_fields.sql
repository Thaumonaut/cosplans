-- Migration: Add rental and sourcing fields to equipment
-- Date: 2025-10-23
-- Description: Add fields for rental return dates, sourcing status, and cost tracking

-- Add new ownership status option for items that need to be sourced
ALTER TABLE equipment 
DROP CONSTRAINT IF EXISTS equipment_ownership_status_check;

ALTER TABLE equipment
ADD CONSTRAINT equipment_ownership_status_check 
CHECK (ownership_status IN ('owned', 'rented', 'borrowed', 'loaned_out', 'needs_sourcing'));

-- Add rental and sourcing fields
ALTER TABLE equipment
ADD COLUMN IF NOT EXISTS rental_return_date DATE,
ADD COLUMN IF NOT EXISTS rental_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS estimated_purchase_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS estimated_rental_cost DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS rental_source TEXT, -- Where it's rented from
ADD COLUMN IF NOT EXISTS sourcing_notes TEXT; -- Notes about where to purchase/rent

-- Add comments for clarity
COMMENT ON COLUMN equipment.rental_return_date IS 'Date when rented equipment must be returned';
COMMENT ON COLUMN equipment.rental_cost IS 'Actual cost paid for rental';
COMMENT ON COLUMN equipment.estimated_purchase_cost IS 'Estimated cost to purchase (for needs_sourcing items)';
COMMENT ON COLUMN equipment.estimated_rental_cost IS 'Estimated cost to rent (for needs_sourcing items)';
COMMENT ON COLUMN equipment.rental_source IS 'Company or person equipment is rented from';
COMMENT ON COLUMN equipment.sourcing_notes IS 'Notes about where to purchase or rent this item';
