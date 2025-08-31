-- Seed one restaurant per destination (subset) with INSERT IGNORE
INSERT IGNORE INTO restaurants (id, destination_id, name, description, cuisine, price_level, rating, opening_hours) VALUES
('r-colombo-ministry','d11','Ministry of Crab','Signature crab dishes in a colonial setting.','Seafood','$$$',4.6,'12:00-22:00'),
('r-kandy-royalbar','d3','Royal Bar & Hotel','Historic hotel restaurant with Sri Lankan fare.','Sri Lankan','$$',4.3,'11:00-22:00'),
('r-galle-tuna','d4','A Minute by Tuk Tuk','Casual seaside dining at Galle Fort.','Seafood','$$',4.2,'10:00-22:00'),
('r-ella-chill','d5','Cafe Chill','Popular spot for western and Sri Lankan dishes.','Fusion','$$',4.4,'08:00-22:00'),
('r-mirissa-zephyr','d6','Zephyr Mirissa','Beachfront grill and cocktails.','Seafood','$$',4.3,'11:00-22:00'),
('r-bentota-diablo','d2','Diablo Restaurant','Beachfront seafood and local dishes.','Seafood','$$',4.1,'11:00-22:00'),
('r-nuwaraeliya-grand','d7','The Grand Indian','Classic Indian cuisine at the Grand Hotel.','Indian','$$',4.2,'12:00-22:00'),
('r-sigiriya-local','d1','Local Curry House','Home-style rice and curry near Sigiriya.','Sri Lankan','$',4.0,'11:00-21:00'),
('r-anuradhapura-green','d13','The Green Hut','Family-friendly Sri Lankan dishes.','Sri Lankan','$',4.0,'10:00-21:00'),
('r-yalasafari-dinner','d8','Safari Lodge Dining','Set dinner at Yala safari lodges.','Sri Lankan','$$',4.1,'19:00-21:00'),
('r-polonnaruwa-royal','d14','Royal Rice & Curry','Traditional buffet close to ruins.','Sri Lankan','$',4.0,'11:00-21:00'),
('r-jaffna-mangos','d15','Mangos Jaffna','Vegetarian South Indian favorites.','South Indian','$',4.2,'10:00-22:00');
