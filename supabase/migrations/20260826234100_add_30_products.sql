-- Add 30 products for testing
INSERT INTO public.products (name, description, price, stock_quantity, category, image_url) VALUES
('Fresh Milk 1L', 'Pasteurized cow milk', 50.00, 100, 'Groceries', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400'),
('Whole Wheat Bread', 'Freshly baked whole wheat bread', 45.00, 50, 'Groceries', 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400'),
('Farm Eggs (12 pack)', 'Organic farm fresh eggs', 80.00, 40, 'Groceries', 'https://images.unsplash.com/photo-1582722872421-6922dfc53448?auto=format&fit=crop&q=80&w=400'),
('Butter 500g', 'Salted creamy butter', 250.00, 30, 'Groceries', 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&q=80&w=400'),
('Basmati Rice 5kg', 'Premium quality long grain rice', 450.00, 20, 'Groceries', 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&q=80&w=400'),
('Toor Dal 1kg', 'Unpolished yellow pigeon peas', 160.00, 60, 'Groceries', 'https://images.unsplash.com/photo-1585996924855-46bc33a30c51?auto=format&fit=crop&q=80&w=400'),

('Potato Chips (Classic)', 'Salted potato chips', 20.00, 200, 'Snacks', 'https://images.unsplash.com/photo-1566478989037-e924e52f411b?auto=format&fit=crop&q=80&w=400'),
('Roasted Almonds 200g', 'Premium roasted California almonds', 280.00, 45, 'Snacks', 'https://images.unsplash.com/photo-1508061253366-f7da158b6d46?auto=format&fit=crop&q=80&w=400'),
('Chocolate Cookies', 'Dark chocolate chip cookies', 50.00, 150, 'Snacks', 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&q=80&w=400'),
('Spicy Mix Namkeen 400g', 'Crunchy Indian snack mix', 85.00, 80, 'Snacks', 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=400'),
('Peanut Butter (Crunchy)', 'High protein crunchy peanut butter', 150.00, 35, 'Snacks', 'https://images.unsplash.com/photo-1584897258079-88339c91ee0a?auto=format&fit=crop&q=80&w=400'),
('Instant Noodles (Pack of 4)', 'Masala flavor instant noodles', 60.00, 300, 'Snacks', 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400'),

('Orange Juice 1L', '100% pure orange juice', 120.00, 40, 'Beverages', 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&q=80&w=400'),
('Cold Coffee 200ml', 'Chilled ready-to-drink coffee', 60.00, 50, 'Beverages', 'https://images.unsplash.com/photo-1461023058943-07cb1ce8db5b?auto=format&fit=crop&q=80&w=400'),
('Green Tea Bags (25 Pcs)', 'Organic green tea bags', 140.00, 70, 'Beverages', 'https://images.unsplash.com/photo-1627492222032-3cb0d0322c34?auto=format&fit=crop&q=80&w=400'),
('Sparkling Water 500ml', 'Carbonated natural spring water', 40.00, 100, 'Beverages', 'https://images.unsplash.com/photo-1549558549-415fe4c37b60?auto=format&fit=crop&q=80&w=400'),
('Cola Can 330ml', 'Refreshing cola drink', 40.00, 120, 'Beverages', 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=400'),
('Mango Drink 1.2L', 'Sweet mango fruit beverage', 90.00, 60, 'Beverages', 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&q=80&w=400'),

('Dishwashing Liquid 500ml', 'Lemon scented dish cleaner', 110.00, 50, 'Household', 'https://images.unsplash.com/photo-1584820927498-cafea65a3d46?auto=format&fit=crop&q=80&w=400'),
('Laundry Detergent 1L', 'Tough stain removal liquid', 180.00, 40, 'Household', 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&q=80&w=400'),
('Toilet Paper (4 Rolls)', '2-ply soft toilet paper', 130.00, 60, 'Household', 'https://images.unsplash.com/photo-1584556812952-905ffd0c611a?auto=format&fit=crop&q=80&w=400'),
('Garbage Bags (30 Pcs)', 'Medium size trash bags', 80.00, 90, 'Household', 'https://images.unsplash.com/photo-1618335825210-9b48c783dbce?auto=format&fit=crop&q=80&w=400'),
('All-Purpose Cleaner', 'Surface cleaning spray', 145.00, 35, 'Household', 'https://images.unsplash.com/photo-1584820927500-c6374944883b?auto=format&fit=crop&q=80&w=400'),
('Mosquito Repellent', 'Vaporizer liquid refill', 75.00, 110, 'Household', 'https://images.unsplash.com/photo-1596752003759-450f381c8b32?auto=format&fit=crop&q=80&w=400'),

('Toothpaste 150g', 'Mint fresh toothpaste', 85.00, 80, 'Personal Care', 'https://images.unsplash.com/photo-1559868725-d0c3eb175b9f?auto=format&fit=crop&q=80&w=400'),
('Shampoo 340ml', 'Anti-dandruff shampoo', 190.00, 50, 'Personal Care', 'https://images.unsplash.com/photo-1618160702438-9b02ab6515c9?auto=format&fit=crop&q=80&w=400'),
('Body Wash 250ml', 'Moisturizing shower gel', 150.00, 60, 'Personal Care', 'https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400'),
('Hand Wash 200ml', 'Antibacterial liquid hand wash', 90.00, 120, 'Personal Care', 'https://images.unsplash.com/photo-1584820927514-f4ff70e08f51?auto=format&fit=crop&q=80&w=400'),
('Deodorant Spray', 'Long-lasting body spray for men', 220.00, 40, 'Personal Care', 'https://images.unsplash.com/photo-1595535373300-d8677c770c1e?auto=format&fit=crop&q=80&w=400'),
('Face Wash 100ml', 'Oil-clear face wash', 140.00, 70, 'Personal Care', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=400');
