-- ============================================
-- UPDATE CATEGORIES FOR PEPTIDE PRODUCTS
-- ============================================
-- Run this SQL to update categories to match your peptide products

-- Update existing categories to peptide-specific categories
UPDATE categories SET 
  name = 'All Products',
  icon = 'Grid',
  sort_order = 0,
  active = true
WHERE id = 'all';

-- Update or insert Weight Management category
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('weight-management', 'Weight Management', 'FlaskConical', 1, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Update or insert Fat Dissolving category
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('fat-dissolving', 'Fat Dissolving', 'Sparkles', 2, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Update or insert Skin Care category
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('skin-care', 'Skin Care', 'Heart', 3, true)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  icon = EXCLUDED.icon,
  sort_order = EXCLUDED.sort_order,
  active = EXCLUDED.active;

-- Deactivate old categories that are no longer needed
UPDATE categories SET active = false 
WHERE id IN ('research', 'cosmetic', 'performance', 'healing', 'cognitive');

-- Update product categories to match new category structure
UPDATE products SET category = 'weight-management' WHERE name = 'Tirzepatide';
UPDATE products SET category = 'fat-dissolving' WHERE name IN ('Lemon Bottle 10ml', 'Fat Blaster 10ml', 'Lipo-C 10ml');
UPDATE products SET category = 'skin-care' WHERE name IN ('GTT 1500mg', 'GHK-Cu 100mg', 'Snap 8');

-- Verify the updates
-- SELECT id, name, icon, sort_order, active FROM categories WHERE active = true ORDER BY sort_order;
-- SELECT name, category FROM products ORDER BY category, name;

