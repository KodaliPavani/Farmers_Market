-- Seed categories
INSERT INTO categories (id, name, description, icon) VALUES
('c1000000-0000-0000-0000-000000000001', 'Fresh Vegetables', 'Potatoes, Tomatoes, Onions, Green Chilies, Ginger, Garlic, Coriander, Lemon', 'carrot'),
('c1000000-0000-0000-0000-000000000002', 'Groceries & Grains', 'Maida (Wheat Flour), Rice, Besan (Gram Flour), Semolina (Rava), Sugar, Salt', 'grain'),
('c1000000-0000-0000-0000-000000000003', 'Oils & Ghee', 'Mustard Oil, Refined Sunflower Oil, Groundnut Oil, Pure Desi Ghee', 'droplet'),
('c1000000-0000-0000-0000-000000000004', 'Spices & Masalas', 'Garam Masala, Red Chili Powder, Turmeric, Cumin, Chaat Masala, Kasuri Methi', 'flame'),
('c1000000-0000-0000-0000-000000000005', 'Dairy Products', 'Paneer (Cottage Cheese), Curd, Butter, Fresh Cream, Milk', 'egg');

-- Seed Users (Passwords are BCrypt hashed for 'password123': $2a$10$8.K3pWX6.e7aN.4P8J7oD.zY9gM2V376P/v8W9a099a9a099a099a)
-- Actually, let's just use BCrypt hashes for 'password' or 'password123'. BCrypt for 'password': $2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG
INSERT INTO users (id, name, email, password, phone, role, address, latitude, longitude, avatar_url, active, is_verified) VALUES
-- Admin
('a1000000-0000-0000-0000-000000000001', 'Rajesh Sharma', 'admin@krishimandi.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9876543210', 'ADMIN', 'APMC Market Road, Yeshwanthpur, Bengaluru, Karnataka 560022', 12.9716, 77.5946, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', true, true),

-- Farmers
('f1000000-0000-0000-0000-000000000001', 'Ramesh Kurmi', 'ramesh.farmer@gmail.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9898989801', 'FARMER', 'Green Valley Farms, Devanahalli, Bengaluru, Karnataka 562110', 13.2484, 77.7126, 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150', true, true),
('f1000000-0000-0000-0000-000000000002', 'Suresh Patel', 'suresh.farmer@gmail.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9898989802', 'FARMER', 'Patel Agri Farms, Hoskote, Bengaluru, Karnataka 562114', 13.0712, 77.7981, 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', true, true),
('f1000000-0000-0000-0000-000000000003', 'Mahesh Gowda', 'mahesh.farmer@gmail.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9898989803', 'FARMER', 'Gowda Organic Farm, Doddaballapura, Karnataka 561203', 13.2923, 77.5312, 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', true, true),

-- Vendors
('b1000000-0000-0000-0000-000000000001', 'Amit Kumar (Pani Puri Corner)', 'amit.vendor@gmail.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9111111101', 'VENDOR', 'Street 4, Sector 3, HSR Layout, Bengaluru, Karnataka 560102', 12.9141, 77.6413, 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', true, true),
('b1000000-0000-0000-0000-000000000002', 'Vikram Singh (Chaats & More)', 'vikram.vendor@gmail.com', '$2a$10$qV9.Y4V8HnpxfepjT0PqIu44d/K6s36zN5L8Hw62sJ7mD5P9X1NKG', '9111111102', 'VENDOR', 'Main Road, Koramangala 5th Block, Bengaluru, Karnataka 560095', 12.9348, 77.6189, 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150', true, true);

-- Seed Farmers table
INSERT INTO farmers (id, user_id, farm_name, farm_size_acres, verified, certificate_url) VALUES
('f2000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'Green Valley Farms', 12.5, true, 'https://supabase.com/docs/cert1.pdf'),
('f2000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000002', 'Patel Agri Farms', 8.2, true, 'https://supabase.com/docs/cert2.pdf'),
('f2000000-0000-0000-0000-000000000003', 'f1000000-0000-0000-0000-000000000003', 'Gowda Organic Farm', 5.0, false, null);

-- Seed Vendors table
INSERT INTO vendors (id, user_id, shop_name, shop_type, monthly_spend_limit) VALUES
('b2000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Amit Pani Puri Corner', 'Street Stall', 25000.00),
('b2000000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002', 'Vikram Chaats & More', 'Street Stall', 40000.00);

-- Seed Products
INSERT INTO products (id, farmer_id, category_id, name, description, stock_quantity, available_stock, minimum_order_quantity, unit_type, price_per_kg, price_per_ton, price, image_url, harvest_date, freshness_days) VALUES
-- Fresh Vegetables from Ramesh Kurmi (Farmer 1)
('e5000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Organic Red Tomatoes', 'Fresh, juicy, organic red tomatoes, ideal for chutneys, sambar, and golgappa water.', 250.0, 250.0, 10.0, 'KG', 32.00, 32000.00, 32.00, 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500', CURRENT_DATE - 1, 6),
('e5000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Nashik Onions (Medium size)', 'Dry and well-stored medium-sized red onions, direct from farm. High shelf-life.', 500.0, 500.0, 10.0, 'KG', 28.00, 28000.00, 28.00, 'https://images.unsplash.com/photo-1508747703725-719777637510?w=500', CURRENT_DATE - 3, 20),
('e5000000-0000-0000-0000-000000000003', 'f2000000-0000-0000-0000-000000000001', 'c1000000-0000-0000-0000-000000000001', 'Green Chilies (Teja)', 'Extremely spicy fresh green chilies, standard for Indian street food and pani puri.', 80.0, 80.0, 10.0, 'KG', 65.00, 65000.00, 65.00, 'https://images.unsplash.com/photo-1588252303782-cb80119cb66f?w=500', CURRENT_DATE - 1, 8),

-- Groceries from Suresh Patel (Farmer 2)
('e5000000-0000-0000-0000-000000000004', 'f2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'High-Grade Maida (Wheat Flour)', 'Super-refined white wheat flour, ideal for crispy puri (golgappa), bhature, and samosas.', 1000.0, 1000.0, 25.0, 'KG', 38.00, 38000.00, 38.00, 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=500', CURRENT_DATE - 10, 60),
('e5000000-0000-0000-0000-000000000005', 'f2000000-0000-0000-0000-000000000002', 'c1000000-0000-0000-0000-000000000002', 'Latur Chana Besan (Gram Flour)', '100% pure chana dal besan, perfect for smooth bajji batter, pakodas, and sev.', 600.0, 600.0, 10.0, 'KG', 78.00, 78000.00, 78.00, 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=500', CURRENT_DATE - 7, 90),

-- Spices & Oils from Mahesh Gowda (Farmer 3)
('e5000000-0000-0000-0000-000000000006', 'f2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000004', 'Pure Kashmiri Red Chili Powder', 'Gives deep rich red color with mild heat. Perfect for pav bhaji and tandoori items.', 120.0, 120.0, 10.0, 'KG', 240.00, 240000.00, 240.00, 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=500', CURRENT_DATE - 15, 180),
('e5000000-0000-0000-0000-000000000007', 'f2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000003', 'Cold-Pressed Groundnut Oil', 'Healthy, aromatic, cold-pressed wood-milled groundnut oil, perfect for deep frying.', 300.0, 300.0, 10.0, 'KG', 185.00, 185000.00, 185.00, 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500', CURRENT_DATE - 8, 120),
('e5000000-0000-0000-0000-000000000008', 'f2000000-0000-0000-0000-000000000003', 'c1000000-0000-0000-0000-000000000005', 'Fresh Cow Paneer block', 'Soft, creamy, fresh cottage cheese, processed and delivered under cold chain. Ideal for paneer rolls, tikka, and pav bhaji.', 50.0, 50.0, 5.0, 'KG', 290.00, 290000.00, 290.00, 'https://images.unsplash.com/photo-1634149737683-8f5507552d04?w=500', CURRENT_DATE, 3);

-- Seed Carts
INSERT INTO carts (id, user_id) VALUES
('ca100000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001'),
('ca100000-0000-0000-0000-000000000002', 'b1000000-0000-0000-0000-000000000002');

-- Seed Orders
INSERT INTO orders (id, vendor_id, farmer_id, product_id, quantity, unit_type, total_price, status, delivery_address, latitude, longitude, payment_status, payment_method, bulk_optimized, created_at) VALUES
('d1000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000001', 'e5000000-0000-0000-0000-000000000001', 50.0, 'KG', 1600.00, 'DELIVERED', 'Street 4, Sector 3, HSR Layout, Bengaluru, Karnataka 560102', 12.9141, 77.6413, 'PAID', 'COD', false, CURRENT_TIMESTAMP - INTERVAL '3 days'),
('d1000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', 'f2000000-0000-0000-0000-000000000002', 'e5000000-0000-0000-0000-000000000005', 50.0, 'KG', 3900.00, 'APPROVED', 'Street 4, Sector 3, HSR Layout, Bengaluru, Karnataka 560102', 12.9141, 77.6413, 'PENDING', 'COD', true, CURRENT_TIMESTAMP - INTERVAL '1 day'),
('d1000000-0000-0000-0000-000000000003', 'b2000000-0000-0000-0000-000000000002', 'f2000000-0000-0000-0000-000000000003', 'e5000000-0000-0000-0000-000000000007', 25.0, 'KG', 4625.00, 'PENDING', 'Main Road, Koramangala 5th Block, Bengaluru, Karnataka 560095', 12.9348, 77.6189, 'PENDING', 'COD', false, CURRENT_TIMESTAMP);

-- Seed Reviews
INSERT INTO reviews (id, product_id, vendor_id, rating, comment) VALUES
('ec000000-0000-0000-0000-000000000001', 'e5000000-0000-0000-0000-000000000001', 'b2000000-0000-0000-0000-000000000001', 5, 'Extremely fresh tomatoes, our golgappa water tastes amazing! Super fast delivery.'),
('ec000000-0000-0000-0000-000000000002', 'e5000000-0000-0000-0000-000000000002', 'b2000000-0000-0000-0000-000000000001', 4, 'Very good size and perfectly dry. A few onions were slightly damp, but overall highly satisfied.');

-- Seed Notifications
INSERT INTO notifications (id, user_id, title, message, read) VALUES
('ed000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Welcome to KrishiMandi!', 'Your profile is approved. You can now purchase directly from local farmers at wholesale rates.', false),
('ed000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', 'New Order Received', 'You have received an order of 107.14 KG produce from Pani Puri Corner.', true),
('ed000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'Order Accepted', 'Suresh Patel has accepted your order for Latur Chana Besan.', false);

-- Seed Messages
INSERT INTO messages (id, sender_id, receiver_id, content, created_at) VALUES
('ee000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'Namaste Ramesh ji, are the tomatoes available today?', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
('ee000000-0000-0000-0000-000000000002', 'f1000000-0000-0000-0000-000000000001', 'b1000000-0000-0000-0000-000000000001', 'Namaste Amit ji, yes! Just harvested 200kg of fresh red tomatoes. I can deliver by afternoon.', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes'),
('ee000000-0000-0000-0000-000000000003', 'b1000000-0000-0000-0000-000000000001', 'f1000000-0000-0000-0000-000000000001', 'Great, placing an order for 50kg right away.', CURRENT_TIMESTAMP - INTERVAL '1 hour 30 minutes');
