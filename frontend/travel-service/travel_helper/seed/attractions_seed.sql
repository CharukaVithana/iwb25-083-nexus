-- Seed script for attractions (sub-destinations)
-- Safe to run multiple times due to INSERT IGNORE on primary key `id`.

-- Batch 1: Core highlights across popular destinations
INSERT IGNORE INTO attractions (id, destination_id, name, description, type, recommended_time_minutes, activities, entry_fee) VALUES
('a-kandy-tooth', 'd3', 'Temple of the Tooth Relic', 'World Heritage temple housing the Sacred Tooth Relic of Buddha.', 'cultural', 120, 'temple visit,culture', 8.00),
('a-kandy-gardens', 'd3', 'Peradeniya Botanical Gardens', 'Expansive gardens with orchids and exotic plants.', 'nature', 150, 'walking,botanical', 7.50),
('a-sigiriya-rock', 'd1', 'Sigiriya Rock Fortress', 'Ancient rock fortress with frescoes and gardens.', 'heritage', 180, 'hiking,photography', 30.00),
('a-galle-fort', 'd4', 'Galle Fort Ramparts', 'Stroll along the historic fort walls at sunset.', 'heritage', 90, 'walking,photography', 0.00),
('a-mirissa-whales', 'd6', 'Whale Watching', 'Early morning boat tour to see blue whales (seasonal).', 'adventure', 240, 'boat tour,wildlife', 40.00),
('a-bentota-beach', 'd2', 'Bentota Beach', 'Relax on the sandy beach; optional water sports.', 'relaxation', 180, 'swimming,water sports', 0.00),
('a-ella-ninearch', 'd5', 'Nine Arches Bridge', 'Iconic stone bridge in lush tea country.', 'scenic', 120, 'walking,photography', 0.00);

-- Batch 2: Requested sub-destinations and related highlights
INSERT IGNORE INTO attractions (id, destination_id, name, description, type, recommended_time_minutes, activities, entry_fee) VALUES
('a-pasikuda-beach','d39','Pasikuda Beach','Shallow bay with calm waters ideal for swimming.','beach',180,'swimming,relaxation'),
('a-anuradhapura-ruwanweliseya','d13','Ruwanweliseya','Ancient white stupa, a major Buddhist pilgrimage site.','cultural',90,'temple visit,photography'),
('a-anuradhapura-bodhi','d13','Jaya Sri Maha Bodhi','Sacred Bo tree grown from a branch of the original Bodhi tree.','cultural',60,'worship,heritage'),
('a-kandy-bahirawakanda','d3','Bahirawakanda Vihara','Giant Buddha statue overlooking Kandy city.','scenic',60,'viewpoint,photography'),
('a-kandy-lake','d3','Kandy Lake Walk','Leisurely walk around the scenic Kandy Lake.','relaxation',60,'walking,photography'),
('a-polonnaruwa-galviharaya','d14','Gal Viharaya','Iconic rock-cut Buddha statues in Polonnaruwa.','heritage',90,'temple visit,photography'),
('a-colombo-galleface','d11','Galle Face Green','Seaside urban park perfect for sunset strolls.','urban',60,'walking,street food'),
('a-colombo-museum','d11','National Museum','Largest museum in Sri Lanka showcasing history and culture.','museum',120,'museum,culture'),
('a-galle-lighthouse','d4','Galle Lighthouse','Picturesque lighthouse within the Galle Fort.','scenic',45,'walking,photography'),
('a-bentota-briefgarden','d2','Brief Garden','Artistic garden designed by Bevis Bawa.','garden',90,'walking,garden'),
('a-ella-littleadamspeak','d5','Little Adam''s Peak','Short hike with panoramic views of Ella.','hiking',120,'hiking,photography'),
('a-nuwaraeliya-gregory','d7','Gregory Lake','Boating and leisure around the central lake.','relaxation',90,'boating,walking'),
('a-yala-safari','d8','Yala Safari','Jeep safari to spot leopards and elephants (seasonal).','wildlife',240,'safari,wildlife'),
('a-sigiriya-pidurangala','d1','Pidurangala Rock','Hike for sunrise views facing Sigiriya.','hiking',150,'hiking,photography'),
('a-mirissa-parrotrock','d6','Parrot Rock Bridge','Rock outcrop offering bay views in Mirissa.','scenic',45,'walking,photography');

-- Batch 3: Broader coverage across the island
INSERT IGNORE INTO attractions (id, destination_id, name, description, type, recommended_time_minutes, activities, entry_fee) VALUES
('a-negombo-beach','d12','Negombo Beach','Wide sandy beach with sunset views.','beach',120,'swimming,relaxation'),
('a-negombo-canal','d12','Dutch Canal','Boat ride along historic canal.','scenic',90,'boat tour,photography'),
('a-polonnaruwa-parakrama','d14','Parakrama Samudra','Vast ancient reservoir great for sunset.','scenic',60,'walking,photography'),
('a-polonnaruwa-royalpalace','d14','Royal Palace Ruins','Ruins of King Parakramabahu''s palace complex.','heritage',90,'ruins,history'),
('a-jaffna-nallur','d15','Nallur Kandaswamy Kovil','Famed Hindu temple with vibrant festivals.','cultural',60,'temple visit,photography'),
('a-jaffna-fort','d15','Jaffna Fort','Portuguese-Dutch fort with lagoon views.','heritage',75,'walking,photography'),
('a-hikkaduwa-coral','d16','Hikkaduwa Coral Sanctuary','Snorkel over coral reefs and fish.','adventure',120,'snorkeling,boat tour'),
('a-hikkaduwa-beach','d16','Hikkaduwa Beach','Beach time with cafes and nightlife.','beach',120,'swimming,relaxation'),
('a-arugam-surf','d17','Main Point Surf','World-class right-hand break.','adventure',180,'surfing,beach'),
('a-arugam-elephantrock','d17','Elephant Rock','Sunset viewpoint and gentle surf.','scenic',120,'walking,photography'),
('a-kalpitiya-dolphins','d18','Dolphin Watching','Morning boat trips to see spinner dolphins.','wildlife',180,'boat tour,wildlife'),
('a-kalpitiya-kite','d18','Kitesurfing Lagoon','Flat-water kitesurfing in Kalpitiya Lagoon.','adventure',180,'kitesurfing,water sports'),
('a-udawalawe-transit','d20','Elephant Transit Home','See orphaned elephants at feeding times.','wildlife',60,'wildlife,education'),
('a-minneriya-safari','d21','Minneriya Safari','See the Elephant Gathering (seasonal).','wildlife',180,'safari,wildlife'),
('a-horton-worldsend','d23','World''s End','Cliff-edge viewpoint with sweeping vistas.','hiking',180,'hiking,photography'),
('a-horton-bakersfalls','d23','Baker''s Falls','Waterfall on the Horton Plains loop.','scenic',60,'walking,photography'),
('a-adamspeak-night','d24','Adam''s Peak Night Hike','Overnight pilgrimage to watch sunrise.','hiking',360,'hiking,pilgrimage'),
('a-kitulgala-rafting','d25','White Water Rafting','Kelani River rafting (grade II–III).','adventure',150,'rafting,adventure'),
('a-haputale-lipton','d26','Lipton''s Seat','Sunrise viewpoint over tea estates.','scenic',120,'hiking,photography'),
('a-badulla-dunhinda','d27','Dunhinda Falls','One of Sri Lanka''s most beautiful waterfalls.','scenic',120,'hiking,photography'),
('a-matara-fort','d28','Matara Star Fort','Small star-shaped Dutch fort.','heritage',60,'walking,history'),
('a-koggala-museum','d29','Folk Museum (Koggala)','Folk Museum of Martin Wickramasinghe.','museum',90,'museum,culture'),
('a-ahangama-surf','d30','Ahangama Surf Breaks','Popular reef breaks for intermediates.','adventure',180,'surfing,beach'),
('a-kalutara-bodhiya','d31','Kalutara Bodhiya','Iconic stupa and temple by the river.','cultural',60,'temple visit,photography'),
('a-kalutara-richmond','d31','Richmond Castle','Edwardian mansion with gardens.','heritage',90,'architecture,walking'),
('a-pinnawala-elephants','d32','Elephant Orphanage','Observe bathing and feeding of elephants.','wildlife',120,'wildlife,education'),
('a-matale-aluvihare','d33','Aluvihare Rock Temple','Historic cave temple complex.','cultural',90,'temple visit,history'),
('a-kurunegala-athugala','d34','Athugala Rock','Hike to the elephant rock Buddha statue.','hiking',90,'hiking,viewpoint'),
('a-unawatuna-jungle','d35','Jungle Beach','Secluded beach cove near Unawatuna.','beach',120,'swimming,snorkeling'),
('a-tangalle-hummanaya','d36','Hummanaya Blow Hole','Natural blowhole near Kudawella.','scenic',60,'walking,photography'),
('a-weligama-taprobane','d37','Taprobane Viewpoint','View the island villa off Weligama bay.','scenic',45,'walking,photography'),
('a-dickwella-wewurukannala','d38','Wewurukannala Vihara','Gigantic seated Buddha statue temple.','cultural',90,'temple visit,photography'),
('a-batticaloa-lighthouse','d40','Batticaloa Lighthouse','Coastal lighthouse with lagoon views.','scenic',45,'walking,photography'),
('a-kalkudah-beach','d41','Kalkudah Beach','Less-crowded stretch next to Pasikuda.','beach',120,'swimming,relaxation'),
('a-nilaveli-pigeon','d42','Pigeon Island','Snorkeling with corals and reef sharks.','adventure',180,'snorkeling,boat tour'),
('a-wilpattu-safari','d43','Wilpattu Safari','Jeep safari among villus and forests.','wildlife',240,'safari,wildlife'),
('a-yapahuwa-fort','d44','Yapahuwa Rock Fortress','Medieval capital with steep staircases.','heritage',120,'hiking,history'),
('a-chilaw-munneswaram','d45','Munneswaram Temple','Ancient Hindu temple complex.','cultural',60,'temple visit,photography'),
('a-ratnapura-bopath','d46','Bopath Ella','Leaf-shaped waterfall near Ratnapura.','scenic',90,'hiking,photography'),
('a-ratnapura-gem','d46','Gem Museum','Learn about Sri Lanka''s gem mining.','museum',60,'museum,education'),
('a-belihuloya-samanala','d47','Samanalawewa Viewpoint','Reservoir views and nature trails.','scenic',60,'walking,photography'),
('a-sinharaja-trek','d48','Sinharaja Trek','Guided walk in primary rainforest.','wildlife',240,'trekking,birdwatching'),
('a-hambantota-ridiyagama','d49','Ridiyagama Safari Park','Drive-through safari experience.','wildlife',180,'safari,wildlife'),
('a-kataragama-temple','d50','Kataragama Temple','Multi-religious pilgrimage site.','cultural',90,'temple visit,festival'),
('a-tissa-wewa','d51','Tissa Wewa','Ancient reservoir with serene walks.','scenic',60,'walking,photography'),
('a-bundala-safari','d52','Bundala Safari','Bird sanctuary and wetlands safari.','wildlife',180,'safari,birdwatching'),
('a-ambalangoda-masks','d53','Mask Museum','Traditional mask carving and exhibits.','museum',60,'museum,culture'),
('a-beruwala-kechimalai','d54','Kechimalai Mosque','Historic mosque on a small hill.','heritage',45,'walking,photography'),
('a-hiriketiya-beach','d55','Hiriketiya Beach','Horseshoe bay ideal for beginner surf.','beach',150,'surfing,swimming'),
('a-gampaha-botanical','d56','Henarathgoda Botanical Garden','Historical garden with giant Javan fig.','garden',90,'walking,botanical'),
('a-kegalle-elephants','d57','Millennium Elephant Foundation','Ethical elephant encounters.','wildlife',90,'education,wildlife'),
('a-puttalam-lagoon','d58','Puttalam Lagoon','Birding and mangrove boat rides.','wildlife',120,'boat tour,birdwatching'),
('a-mannar-fort','d59','Mannar Fort','Dutch fort on the Mannar island.','heritage',60,'walking,photography'),
('a-vavuniya-museum','d60','Archaeological Museum','Regional history exhibits.','museum',60,'museum,culture'),
('a-kilinochchi-water','d61','Kilinochchi Water Tower Site','War memorial and viewpoint.','heritage',45,'walking,history'),
('a-mullaitivu-bay','d62','Mullaitivu Bay','Quiet beach and lagoon views.','beach',90,'walking,relaxation'),
('a-monaragala-buduruwagala','d63','Buduruwagala','Rock-carved Buddha group in the forest.','heritage',90,'walking,photography'),
('a-avissawella-seethawaka','d64','Seethawaka Botanic Gardens','Wet zone gardens rich in biodiversity.','garden',120,'walking,botanical'),
('a-ginigathhena-aberdeen','d65','Aberdeen Falls','Scenic waterfall near Ginigathhena.','scenic',120,'hiking,photography');

-- Usage notes:
-- 1) Ensure the `destinations` table contains the referenced destination_id values.
-- 2) Run this file with:
--    mysql -u<user> -p -h <host> -P <port> -D travel_helper -e "SOURCE <path>/attractions_seed.sql;"
-- 3) Query by destination:
--    SELECT * FROM attractions WHERE destination_id = 'd3';
