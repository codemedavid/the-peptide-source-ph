-- ============================================
-- SQL to Add The Peptide Source PH Products
-- ============================================
-- ⚠️ IMPORTANT: This file assumes tables already exist!
-- 
-- If you get "relation products does not exist" error:
-- → STOP and run COMPLETE_SETUP_SQL.sql first instead!
-- 
-- This file is ONLY for adding products to an existing database.
-- Copy and paste this into your Supabase SQL Editor
-- Adjust prices, stock quantities, and descriptions as needed

-- Check if tables exist (will show error if they don't - that's OK, just run COMPLETE_SETUP_SQL.sql instead)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'products') THEN
        RAISE EXCEPTION 'Tables do not exist! Please run COMPLETE_SETUP_SQL.sql first to create all tables.';
    END IF;
END $$;

-- Option 1: Clear existing products first (UNCOMMENT IF NEEDED)
-- DELETE FROM product_variations;
-- DELETE FROM products;

-- ============================================
-- PRODUCT 1: Tirzepatide (with TR15mg and TR30mg variations)
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('Tirzepatide', 'Tirzepatide is a glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist for research purposes. Available in 15mg and 30mg sizes.', 'weight-management', 2500.00, 99.0, true, true, 100, 'Store at -20°C', '4812.7 g/mol', '2023788-19-2')
ON CONFLICT DO NOTHING;

-- Add TR15mg variation
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '15mg', 15.0, 2500.00, 50 
FROM products WHERE name = 'Tirzepatide'
ON CONFLICT DO NOTHING;

-- Add TR30mg variation
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '30mg', 30.0, 4500.00, 50 
FROM products WHERE name = 'Tirzepatide'
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 2: Lemon Bottle 10ml
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lemon Bottle 10ml', 'Lemon Bottle fat dissolving injection solution. Professional-grade lipolytic solution for research purposes.', 'fat-dissolving', 2500.00, 99.5, true, true, 75, 'Store at room temperature')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 3: GTT 1500mg (Glutathione)
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('GTT 1500mg', 'Glutathione Tripeptide - Master antioxidant peptide for research purposes. Supports cellular protection and antioxidant research.', 'skin-care', 1800.00, 99.0, true, true, 60, 'Store at -20°C', '307.32 g/mol', '70-18-8')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 4: GHK-Cu 100mg
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number, sequence) VALUES
('GHK-Cu 100mg', 'Copper peptide complex (GHK-Cu) with regenerative properties. Known for tissue repair and anti-aging research applications.', 'skin-care', 1200.00, 99.0, true, true, 80, 'Store at -20°C', '404.0 g/mol', '49557-75-7', 'Gly-His-Lys')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 5: Fat Blaster 10ml
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Fat Blaster 10ml', 'Fat Blaster lipolytic injection solution for research purposes. Professional-grade formulation for targeted fat reduction research.', 'fat-dissolving', 2200.00, 99.5, true, true, 70, 'Store at room temperature')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 6: Lipo-C 10ml
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lipo-C 10ml', 'Lipo-C injection solution with Vitamin C and lipolytic compounds for research purposes. For targeted fat reduction and skin rejuvenation research.', 'fat-dissolving', 2000.00, 99.5, true, true, 65, 'Store at room temperature')
ON CONFLICT DO NOTHING;

-- ============================================
-- PRODUCT 7: Snap 8
-- ============================================
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, sequence) VALUES
('Snap 8', 'Snap-8 peptide - Acetyl Octapeptide-3. Synthetic peptide fragment for research purposes. Known for potential cosmetic and anti-aging research applications.', 'skin-care', 1500.00, 99.0, true, true, 55, 'Store at -20°C', '888.0 g/mol', 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2')
ON CONFLICT DO NOTHING;

-- ============================================
-- UPDATE SITE SETTINGS
-- ============================================
UPDATE site_settings SET value = 'The Peptide Source PH' WHERE id = 'site_name';
UPDATE site_settings SET value = 'Premium Research Peptides' WHERE id = 'site_tagline';

-- ============================================
-- VERIFY PRODUCTS WERE ADDED
-- ============================================
-- Run this query to see all your products:
-- SELECT name, category, base_price, stock_quantity, available FROM products ORDER BY name;

-- Run this query to see product variations:
-- SELECT p.name as product_name, pv.name as variation_name, pv.quantity_mg, pv.price 
-- FROM products p 
-- LEFT JOIN product_variations pv ON p.id = pv.product_id 
-- ORDER BY p.name, pv.quantity_mg;

