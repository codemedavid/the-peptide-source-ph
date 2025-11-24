-- Migration: Add The Peptide Source PH Products
-- Products: TR15mg, TR30mg, Lemon Bottle 10ml, GTT 1500mg, Ghk-Cu 100mg, Fat Blaster 10ml, Lipo-C 10ml, Snap 8

-- Insert Tirzepatide product (base product for TR15mg and TR30mg variations)
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('Tirzepatide', 'Tirzepatide is a glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist for research purposes. Available in 15mg and 30mg sizes for research applications.', 'weight-management', 2500.00, 99.0, true, true, 100, 'Store at -20°C', '4812.7 g/mol', '2023788-19-2')
ON CONFLICT DO NOTHING;

-- Insert Tirzepatide variations (TR15mg and TR30mg)
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT 
  id, 
  '15mg', 
  15.0, 
  2500.00, 
  50 
FROM products 
WHERE name = 'Tirzepatide'
ON CONFLICT DO NOTHING;

INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT 
  id, 
  '30mg', 
  30.0, 
  4500.00, 
  50 
FROM products 
WHERE name = 'Tirzepatide'
ON CONFLICT DO NOTHING;

-- Insert Lemon Bottle 10ml
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lemon Bottle 10ml', 'Lemon Bottle fat dissolving injection solution. Professional-grade lipolytic solution for research purposes. Contains natural ingredients designed for targeted fat reduction research applications.', 'fat-dissolving', 2500.00, 99.5, true, true, 75, 'Store at room temperature, away from direct sunlight')
ON CONFLICT DO NOTHING;

-- Insert GTT 1500mg (Glutathione)
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('GTT 1500mg', 'Glutathione Tripeptide - Master antioxidant peptide for research purposes. Supports cellular protection and antioxidant research. Available in 1500mg formulation.', 'skin-care', 1800.00, 99.0, true, true, 60, 'Store at -20°C, protect from light', '307.32 g/mol', '70-18-8')
ON CONFLICT DO NOTHING;

-- Insert GHK-Cu 100mg (update existing or insert new)
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number, sequence) VALUES
('GHK-Cu 100mg', 'Copper peptide complex (GHK-Cu) with regenerative properties. Known for its potential in tissue repair and anti-aging research applications. Available in 100mg formulation. Research-grade quality.', 'skin-care', 1200.00, 99.0, true, true, 80, 'Store at -20°C', '404.0 g/mol', '49557-75-7', 'Gly-His-Lys')
ON CONFLICT DO NOTHING;

-- Insert Fat Blaster 10ml
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Fat Blaster 10ml', 'Fat Blaster lipolytic injection solution for research purposes. Professional-grade formulation designed for targeted fat reduction research applications. Contains advanced lipolytic compounds.', 'fat-dissolving', 2200.00, 99.5, true, true, 70, 'Store at room temperature, away from direct sunlight')
ON CONFLICT DO NOTHING;

-- Insert Lipo-C 10ml
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lipo-C 10ml', 'Lipo-C injection solution with Vitamin C and lipolytic compounds for research purposes. Designed for targeted fat reduction and skin rejuvenation research applications.', 'fat-dissolving', 2000.00, 99.5, true, true, 65, 'Store at room temperature, away from direct sunlight')
ON CONFLICT DO NOTHING;

-- Insert Snap 8 (Snap-8 peptide)
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, sequence) VALUES
('Snap 8', 'Snap-8 peptide - Acetyl Octapeptide-3. Synthetic peptide fragment of SNAP-25 protein for research purposes. Known for potential cosmetic and anti-aging research applications.', 'skin-care', 1500.00, 99.0, true, true, 55, 'Store at -20°C', '888.0 g/mol', 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2')
ON CONFLICT DO NOTHING;

-- Update site settings for The Peptide Source PH
UPDATE site_settings SET value = 'The Peptide Source PH' WHERE id = 'site_name';
UPDATE site_settings SET value = 'Premium Research Peptides' WHERE id = 'site_tagline';

