-- ============================================
-- COMPLETE SETUP SQL FOR THE PEPTIDE SOURCE PH
-- ============================================
-- Run this entire file in Supabase SQL Editor
-- This will create all tables and add your products

-- ============================================
-- STEP 1: CREATE TABLES (if they don't exist)
-- ============================================

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL REFERENCES categories(id),
  base_price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  discount_start_date TIMESTAMPTZ,
  discount_end_date TIMESTAMPTZ,
  discount_active BOOLEAN DEFAULT false,
  purity_percentage DECIMAL(5,2) DEFAULT 99.00,
  molecular_weight TEXT,
  cas_number TEXT,
  sequence TEXT,
  storage_conditions TEXT DEFAULT 'Store at -20°C',
  inclusions TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  available BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  image_url TEXT,
  safety_sheet_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create product variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  quantity_mg DECIMAL(10,2) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create payment methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  account_number TEXT NOT NULL,
  account_name TEXT NOT NULL,
  qr_code_url TEXT,
  active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  type TEXT DEFAULT 'text',
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- STEP 2: INSERT CATEGORIES
-- ============================================
INSERT INTO categories (id, name, icon, sort_order, active) VALUES
('all', 'All Products', 'Grid', 0, true),
('weight-management', 'Weight Management', 'FlaskConical', 1, true),
('fat-dissolving', 'Fat Dissolving', 'Sparkles', 2, true),
('skin-care', 'Skin Care', 'Heart', 3, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, icon = EXCLUDED.icon, sort_order = EXCLUDED.sort_order, active = EXCLUDED.active;

-- ============================================
-- STEP 3: INSERT YOUR PRODUCTS
-- ============================================

-- PRODUCT 1: Tirzepatide (base product)
-- Delete existing Tirzepatide if it exists, then insert fresh
DELETE FROM product_variations WHERE product_id IN (SELECT id FROM products WHERE name = 'Tirzepatide');
DELETE FROM products WHERE name = 'Tirzepatide';

INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('Tirzepatide', 'Tirzepatide is a glucose-dependent insulinotropic polypeptide (GIP) and glucagon-like peptide-1 (GLP-1) receptor agonist for research purposes. Available in 15mg and 30mg sizes.', 'weight-management', 2500.00, 99.0, true, true, 100, 'Store at -20°C', '4812.7 g/mol', '2023788-19-2');

-- Add TR15mg variation
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '15mg', 15.0, 2500.00, 50 
FROM products WHERE name = 'Tirzepatide';

-- Add TR30mg variation
INSERT INTO product_variations (product_id, name, quantity_mg, price, stock_quantity)
SELECT id, '30mg', 30.0, 4500.00, 50 
FROM products WHERE name = 'Tirzepatide';

-- PRODUCT 2: Lemon Bottle 10ml
DELETE FROM products WHERE name = 'Lemon Bottle 10ml';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lemon Bottle 10ml', 'Lemon Bottle fat dissolving injection solution. Professional-grade lipolytic solution for research purposes.', 'fat-dissolving', 2500.00, 99.5, true, true, 75, 'Store at room temperature');

-- PRODUCT 3: GTT 1500mg (Glutathione)
DELETE FROM products WHERE name = 'GTT 1500mg';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number) VALUES
('GTT 1500mg', 'Glutathione Tripeptide - Master antioxidant peptide for research purposes. Supports cellular protection and antioxidant research.', 'skin-care', 1800.00, 99.0, true, true, 60, 'Store at -20°C', '307.32 g/mol', '70-18-8');

-- PRODUCT 4: GHK-Cu 100mg
DELETE FROM products WHERE name = 'GHK-Cu 100mg';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, cas_number, sequence) VALUES
('GHK-Cu 100mg', 'Copper peptide complex (GHK-Cu) with regenerative properties. Known for tissue repair and anti-aging research applications.', 'skin-care', 1200.00, 99.0, true, true, 80, 'Store at -20°C', '404.0 g/mol', '49557-75-7', 'Gly-His-Lys');

-- PRODUCT 5: Fat Blaster 10ml
DELETE FROM products WHERE name = 'Fat Blaster 10ml';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Fat Blaster 10ml', 'Fat Blaster lipolytic injection solution for research purposes. Professional-grade formulation for targeted fat reduction research.', 'fat-dissolving', 2200.00, 99.5, true, true, 70, 'Store at room temperature');

-- PRODUCT 6: Lipo-C 10ml
DELETE FROM products WHERE name = 'Lipo-C 10ml';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions) VALUES
('Lipo-C 10ml', 'Lipo-C injection solution with Vitamin C and lipolytic compounds for research purposes. For targeted fat reduction and skin rejuvenation research.', 'fat-dissolving', 2000.00, 99.5, true, true, 65, 'Store at room temperature');

-- PRODUCT 7: Snap 8
DELETE FROM products WHERE name = 'Snap 8';
INSERT INTO products (name, description, category, base_price, purity_percentage, available, featured, stock_quantity, storage_conditions, molecular_weight, sequence) VALUES
('Snap 8', 'Snap-8 peptide - Acetyl Octapeptide-3. Synthetic peptide fragment for research purposes. Known for potential cosmetic and anti-aging research applications.', 'skin-care', 1500.00, 99.0, true, true, 55, 'Store at -20°C', '888.0 g/mol', 'Ac-Glu-Glu-Met-Gln-Arg-Arg-Ala-Asp-NH2');

-- ============================================
-- STEP 4: INSERT DEFAULT PAYMENT METHODS
-- ============================================
INSERT INTO payment_methods (id, name, account_number, account_name, qr_code_url, active, sort_order) VALUES
('gcash', 'GCash', '09123456789', 'The Peptide Source PH', '', true, 1),
('maya', 'Maya', '09123456789', 'The Peptide Source PH', '', true, 2),
('bank', 'Bank Transfer', '1234567890', 'The Peptide Source PH', '', true, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- STEP 5: INSERT SITE SETTINGS
-- ============================================
INSERT INTO site_settings (id, value, type, description) VALUES
('site_name', 'The Peptide Source PH', 'text', 'Website name'),
('site_tagline', 'Premium Research Peptides', 'text', 'Website tagline'),
('contact_email', 'info@peptidesource.ph', 'email', 'Contact email'),
('contact_phone', '+63 XXX XXX XXXX', 'text', 'Contact phone number'),
('min_order_amount', '25.00', 'number', 'Minimum order amount'),
('free_shipping_threshold', '150.00', 'number', 'Free shipping threshold'),
('disclaimer', 'RESEARCH USE ONLY: ALWAYS CONSULT A LICENSED HEALTHCARE PROFESSIONAL FOR PERSONALISED MEDICAL GUIDANCE', 'text', 'Legal disclaimer')
ON CONFLICT (id) DO UPDATE SET value = EXCLUDED.value;

-- ============================================
-- STEP 6: CREATE INDEXES (for better performance)
-- ============================================
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_product_variations_product_id ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(active);

-- ============================================
-- STEP 7: CREATE UPDATED_AT TRIGGER FUNCTION
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at BEFORE UPDATE ON payment_methods
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_site_settings_updated_at ON site_settings;
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
-- Run these to verify everything was created:

-- Check products
-- SELECT name, category, base_price, stock_quantity, available FROM products ORDER BY name;

-- Check product variations
-- SELECT p.name as product_name, pv.name as variation_name, pv.quantity_mg, pv.price 
-- FROM products p 
-- LEFT JOIN product_variations pv ON p.id = pv.product_id 
-- ORDER BY p.name, pv.quantity_mg;

-- Check categories
-- SELECT * FROM categories ORDER BY sort_order;

-- Check site settings
-- SELECT * FROM site_settings;

