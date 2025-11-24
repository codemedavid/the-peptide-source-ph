-- ============================================
-- FIX CATEGORIES - Remove Old Cafe Categories
-- ============================================
-- Run this SQL in Supabase SQL Editor to fix categories
-- This will deactivate ALL old categories and set up ONLY new peptide categories

-- Step 1: Deactivate ALL categories first (except 'all' which we'll keep)
UPDATE categories SET active = false WHERE id != 'all';

-- Step 2: Insert or update "All Products" category
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('all', 'All Products', 'Grid', 0, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Step 3: Insert or update new peptide categories (these will be the ONLY active ones)
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('weight-management', 'Weight Management', 'FlaskConical', 1, true),
('fat-dissolving', 'Fat Dissolving', 'Sparkles', 2, true),
('skin-care', 'Skin Care', 'Heart', 3, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Step 4: Update product categories to match new structure
-- Update Tirzepatide to weight-management
UPDATE products SET category = 'weight-management' WHERE name = 'Tirzepatide';

-- Update fat dissolving products
UPDATE products SET category = 'fat-dissolving' 
WHERE name IN ('Lemon Bottle 10ml', 'Fat Blaster 10ml', 'Lipo-C 10ml');

-- Update skin care products
UPDATE products SET category = 'skin-care' 
WHERE name IN ('GTT 1500mg', 'GHK-Cu 100mg', 'Snap 8');

-- Step 5: Verify the changes (uncomment to run)
-- SELECT id, name, icon, sort_order, active FROM categories WHERE active = true ORDER BY sort_order;
-- SELECT name, category FROM products ORDER BY category, name;

