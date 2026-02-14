-- ========================================
-- Sukarak Mazbot V3 - Database Export
-- Date: 2026-02-14 09:30:34
-- Developer: Tamer ElGohary (@egyadmin)
-- ========================================

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;

-- Table: sukarak_users
DROP TABLE IF EXISTS sukarak_users;
CREATE TABLE sukarak_users (
	id INTEGER NOT NULL, 
	firebase_uid VARCHAR(255), 
	name VARCHAR(255) NOT NULL, 
	email VARCHAR(255) NOT NULL, 
	phone VARCHAR(255), 
	password VARCHAR(255), 
	age VARCHAR(10), 
	weight VARCHAR(10), 
	country VARCHAR(255), 
	shape VARCHAR(255), 
	login_method VARCHAR(50), 
	role VARCHAR(20), 
	profile_image VARCHAR(1024), 
	is_active BOOLEAN, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME, admin_display_name VARCHAR(255), app_display_name VARCHAR(255), seller_department VARCHAR(100), seller_address TEXT, wallet_balance FLOAT DEFAULT 0.0, loyalty_points INTEGER DEFAULT 0, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (1, NULL, 'د.محمد النقراشي', 'admin@sukarak.com', '0508189628', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '36', '90', 'sa', 'rectangle', 'email', 'admin', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (27, NULL, 'د.محمد النقراشي', 'mohamed66.mm720@gmail.com', '0508189629', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '36', '90', 'sa', 'rectangle', 'email', 'admin', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (37, NULL, 'شوقي', 'shawqialshawea48@gmail.com', '780887739', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '35', '75', 'sa', 'rectangle', 'email', 'seller', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (50, NULL, 'أحمد جبر', 'seller1@sukarak.com', '01202812988', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '38', '105', 'eg', 'rectangle', 'email', 'seller', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (52, NULL, 'محمد علي', 'user1@sukarak.com', '01158349677', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '41', '81', 'eg', 'rectangle', 'email', 'user', '/media/profiles/52_074a88db.jpg', 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (55, NULL, 'خالد أحمد', 'user2@sukarak.com', '01010133967', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '30', '80', 'sa', 'rectangle', 'email', 'user', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (57, NULL, 'إسحاق', 'ishaqalshawea50@gmail.com', '550074716', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '28', '70', 'sa', 'rectangle', 'email', 'user', NULL, 1, '2026-02-12 03:56:29', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (58, NULL, 'د. أحمد السيد', 'doctor.ahmed@sukarak.com', '0501234567', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'eg', 'طب باطني', 'email', 'doctor', NULL, 1, '2026-02-12 06:34:37', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (59, NULL, 'د. خالد العمري', 'dr.khalid@sukarak.com', '0555001001', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '45', NULL, 'sa', 'استشاري غدد صماء', 'email', 'doctor', NULL, 1, '2026-02-12 06:40:46', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (60, NULL, 'د. سارة الأحمد', 'dr.sara@sukarak.com', '0555002002', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '38', NULL, 'sa', 'أخصائية تغذية', 'email', 'doctor', NULL, 1, '2026-02-12 06:40:46', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (61, NULL, 'د. فاطمة حسن', 'dr.fatma@sukarak.com', '0555004004', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '42', NULL, 'eg', 'أخصائية سكري', 'email', 'doctor', NULL, 1, '2026-02-12 06:40:46', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (62, NULL, 'أحمد محمد', 'patient1@test.com', '0551001001', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '45', '82', 'SA', NULL, 'email', 'user', NULL, 1, '2026-02-12 07:26:13', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (63, NULL, 'فاطمة علي', 'patient2@test.com', '0551001002', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '38', '68', 'SA', NULL, 'email', 'user', NULL, 1, '2026-02-12 07:26:13', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (64, NULL, 'محمد إبراهيم', 'patient3@test.com', '0551001003', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', '55', '90', 'SA', NULL, 'email', 'user', NULL, 1, '2026-02-12 07:26:13', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (65, NULL, 'محمد البائع', 'seller@sukkartest.com', '0505005000', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'eg', NULL, 'email', 'seller', NULL, 1, '2026-02-12 10:49:32', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (66, NULL, 'عبدالله محمد السيد', 'abdullah.alsayed@gmail.com', '01098765432', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'مصر', NULL, 'email', 'user', NULL, 1, '2026-02-12 11:34:50', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (67, NULL, 'سارة أحمد حسن', 'sara.ahmed.h@gmail.com', '01187654321', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'مصر', NULL, 'email', 'user', NULL, 1, '2026-02-12 11:34:50', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (68, NULL, 'عمر خالد إبراهيم', 'omar.khalid.ib@gmail.com', '01276543210', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'مصر', NULL, 'email', 'user', NULL, 1, '2026-02-12 11:34:50', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (69, NULL, 'مريم سعيد عبدالرحمن', 'mariam.saeed@gmail.com', '01065432109', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'مصر', NULL, 'email', 'user', NULL, 1, '2026-02-12 11:34:50', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (70, NULL, 'حسن يوسف علي', 'hassan.youssef@gmail.com', '01554321098', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, 'مصر', NULL, 'email', 'user', NULL, 1, '2026-02-12 11:34:50', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (71, NULL, 'ممرض تجريبي (أحمد علي)', 'nurse@sukarak.com', '01234567890', '$2b$12$/Ww38g1m.6ctL1gckfrVKuZKoIyUqOO1rVF2NBwwfLsHz/AcR0mFq', NULL, NULL, NULL, NULL, 'email', 'nurse', NULL, 1, '2026-02-12 23:31:30', '2026-02-13 16:04:51', NULL, NULL, NULL, NULL, 0.0, 0);
INSERT INTO sukarak_users (id, firebase_uid, name, email, phone, password, age, weight, country, shape, login_method, role, profile_image, is_active, created_at, updated_at, admin_display_name, app_display_name, seller_department, seller_address, wallet_balance, loyalty_points) VALUES (72, '105979141942381593184', 'Tamer ElGohary', 'tamerlove2004@gmail.com', NULL, NULL, NULL, NULL, NULL, NULL, 'google', 'user', '/media/profiles/72_9d24cf28.png', 1, '2026-02-14 05:14:19', '2026-02-14 05:27:20', NULL, NULL, NULL, NULL, 0.0, 0);

-- Table: sukarak_mazbot_products
DROP TABLE IF EXISTS sukarak_mazbot_products;
CREATE TABLE sukarak_mazbot_products (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	details VARCHAR(512) NOT NULL, 
	price NUMERIC(10, 2) NOT NULL, 
	offer_price NUMERIC(10, 2), 
	stock INTEGER, 
	img_url VARCHAR(512), 
	category VARCHAR(255), 
	sub_category VARCHAR(255), 
	country VARCHAR(255), 
	seller VARCHAR(255), 
	status INTEGER, 
	in_review INTEGER, brand VARCHAR(255), sku VARCHAR(100), offer_start_date DATETIME, offer_end_date DATETIME, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (2, 'رويال جيلي 1000', 'غذاء ملكات النحل', 1000, 0, 0, '/media/products/1.jpg', 'supplements', 'vitamins', '["eg","sa","ye","ae"]', 'أحمد جبر', 1, 0, 'TestBrand', 'TST-001', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (5, 'جهاز قياس السكر المنزلي', 'جهاز دقيق وسريع لقياس نسبة السكر في الدم، يأتي مع 10 شرائط اختبار مجانية.', 450, 399, 44, '/media/products/2.jpg', 'devices', 'monitoring', '["eg","sa","ye","ae"]', 'شوقي', 1, 0, 'Accu-Chek', 'ACK-GLU-001', '2026-02-01', '2026-03-31');
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (6, 'علبة شرائط اختبار السكر', 'عبوة تحتوي على 50 شريط اختبار متوافق مع معظم الأجهزة الحديثة، نتائج دقيقة.', 200, 0, 99, '/media/products/3.jpg', 'devices', 'monitoring', '["eg","sa","ye","ae"]', 'أحمد جبر', 1, 0, 'Accu-Chek', 'ACK-STR-050', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (7, 'بسكويت الشوفان بدون سكر', 'سناك صحي لمرضى السكري مصنوع من الشوفان ومحلى بستيفيا، غني بالألياف.', 35, 30, 79, '/media/products/4.jpg', 'food', 'diet', '["eg","sa","ye","ae"]', 'شوقي', 1, 0, 'HealthyBake', 'HB-OAT-BSK', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (8, 'محلي ستيفيا طبيعي', 'بديل السكر الطبيعي، خالي من السعرات الحرارية ومناسب للطبخ والمشروبات الساخنة.', 60, 50, 60, '/media/products/5.jpg', 'food', 'diet', '["eg","sa","ye","ae"]', 'Healthy Food', 1, 0, 'Stevia Life', 'STV-NAT-200', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (9, 'جوارب لمرضى السكري', 'جوارب قطنية ناعمة غير ضاغطة، تساعد في تنشيط الدورة الدموية وحماية القدم.', 85, 0, 40, '/media/products/6.jpg', 'care', 'feet', '["eg","sa","ye","ae"]', 'Medical Care', 1, 0, 'NOW Foods', 'NF-OMG3-60', '2026-02-10', '2026-02-28');
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (10, 'حافظة تبريد أقلام الأنسولين', 'حافظة صغيرة وعملية تحافظ على برودة الأنسولين أثناء السفر والتنقل لفترات طويلة.', 120, 100, 30, '/media/products/7.jpg', 'devices', 'misc_medical', '["eg","sa","ye","ae"]', 'Medical Store', 1, 0, 'MedCool', 'MC-INS-PEN', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (11, 'فيتامينات متعددة للسكري', 'مكمل غذائي يحتوي على فيتامينات B12 والمغنيسيوم لدعم صحة الأعصاب والطاقة.', 150, 0, 22, '/media/products/9.jpg', 'supplements', 'vitamins', '["eg","sa","ye","ae"]', 'شوقي', 1, 0, 'FreeStyle', 'FS-LBR-SEN', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (12, 'جهاز قياس ضغط الدم', 'جهاز إلكتروني لقياس ضغط الدم بدقة، ضروري للمتابعة الدورية مع السكري.', 550, 480, 15, '/media/products/10.jpg', 'devices', 'monitoring', '["eg","sa","ye","ae"]', 'Medical Care', 1, 0, 'OnCall', 'OC-GLU-PLS', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (13, 'مربى الفراولة بدون سكر', 'مربى طبيعي محلى ببدائل السكر، طعم رائع بدون رفع مستوى الجلوكوز.', 45, 0, 69, '/media/products/11.jpg', 'food', 'diet', '["eg","sa","ye","ae"]', 'Healthy Food', 1, 0, 'Omron', 'OMR-BP-M3', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (14, 'كريم مرطب للقدم السكري', 'كريم بتركيبة خاصة لترطيب الجفاف الشديد وحماية القدم من التشققات.', 95, 75, 45, '/media/products/12.jpg', 'care', 'feet', '["eg","sa","ye","ae"]', 'أحمد جبر', 1, 0, 'BD Micro-Fine', 'BD-INS-100', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (17, 'ساعة ذكية لمراقبة الصحة', 'ساعة ذكية تقيس نبضات القلب وتتصل بالتطبيق لمتابعة النشاط البدني.', 1200, 950, 20, '/media/products/13.jpg', 'devices', 'wearables', '["eg","sa","ye","ae"]', 'Tech Store', 1, 0, 'Nature Valley', 'NV-GRA-12P', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (18, 'خبز الشعير الصحي', 'خبز مصنوع من الشعير الكامل، مناسب لمرضى السكري والريجيم.', 15, 0, 100, '/media/products/14.jpg', 'food', 'bakery', '["eg","sa","ye","ae"]', 'Healthy Food', 1, 0, 'Cetaphil', 'CTP-CRM-500', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (19, 'حذاء طبي مريح', 'حذاء خاص للقدم السكري يوفر راحة قصوى ويمنع التقرحات.', 250, 200, 30, '/media/products/1.jpg', 'care', 'feet', '["eg","sa","ye","ae"]', 'Medical Care', 1, 0, 'Ensure', 'ENS-DIA-400', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (20, 'ميزان ذكي للجسم', 'ميزان يحلل دهون الجسم والكتلة العضلية ويربط بالبلوتوث.', 180, 150, 50, '/media/products/2.jpg', 'devices', 'monitoring', '["eg","sa","ye","ae"]', 'أحمد جبر', 1, 0, 'Nature Made', 'NM-D3-120', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (21, 'شاي المورينجا العضوي', 'شاي طبيعي يساعد في تنظيم مستوى السكر ومضاد للأكسدة.', 40, 0, 60, '/media/products/3.jpg', 'supplements', 'herbal', '["eg","sa","ye","ae"]', 'Herbal Life', 1, 0, 'Omron', 'OMR-PED-01', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (22, 'جهاز قياس السكر الذكي', 'جهاز رقمي دقيق لقياس مستوى السكر في الدم مع بلوتوث', 350, 315, 25, 'https://images.unsplash.com/photo-1631549916768-4be9f04f024c?w=400&h=400&fit=crop', 'devices', 'monitoring', '[]', 'شوقي', 1, 0, 'OneTouch', 'OT-VER-SEL', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (23, 'شرائط اختبار السكر (50 شريحة)', 'شرائط متوافقة مع أجهزة القياس الرقمية - دقة عالية', 120, 108, 100, 'https://images.unsplash.com/photo-1585435557343-3b092031a831?w=400&h=400&fit=crop', 'devices', 'monitoring', '[]', 'شوقي', 1, 0, 'Contour', 'CNT-NXT-01', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (24, 'إبر أنسولين نوفوفاين 4مم', 'إبر رفيعة للحقن غير المؤلم - عبوة 100 إبرة', 85, 76.5, 60, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'devices', 'monitoring', '[]', 'شوقي', 1, 0, 'Medline', 'MDL-KIT-DIA', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (25, 'مكمل أوميجا 3 - 1000مج', 'كبسولات زيت السمك النقي لدعم صحة القلب والأوعية', 180, 162, 41, 'https://images.unsplash.com/photo-1550572017-edd951b55104?w=400&h=400&fit=crop', 'supplements', 'vitamins', '[]', 'شوقي', 1, 0, 'NOW Foods', 'NF-CHR-200', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (26, 'فيتامين D3 5000 وحدة', 'مكمل فيتامين د عالي التركيز لتقوية العظام والمناعة', 95, 85.5, 77, 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=400&h=400&fit=crop', 'supplements', 'vitamins', '[]', 'شوقي', 1, 0, 'Solgar', 'SLG-VB12-100', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (27, 'بروتين بار خالي السكر (12 قطعة)', 'سناك صحي بالشوكولاتة الداكنة - مناسب لمرضى السكري', 220, 198, 34, 'https://images.unsplash.com/photo-1622484212850-eb596d769edc?w=400&h=400&fit=crop', 'food', 'diet', '[]', 'شوقي', 1, 0, 'QuestBar', 'QB-PRO-12P', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (28, 'شاي أخضر عضوي - 50 كيس', 'شاي أخضر ياباني عضوي معتمد - يساعد في تنظيم السكر', 65, 58.5, 120, 'https://images.unsplash.com/photo-1556881286-fc6915169721?w=400&h=400&fit=crop', 'food', 'diet', '[]', 'شوقي', 0, 0, 'Ahmad Tea', 'AT-GRN-050', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (29, 'كريم ترطيب القدم السكري', 'كريم مخصص لترطيب وحماية قدم مريض السكري', 75, 67.5, 3, 'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=400&h=400&fit=crop', 'care', 'skin_care', '[]', 'شوقي', 1, 0, 'CeraVe', 'CV-FT-CRM', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (30, 'حقيبة حفظ الأنسولين المبردة', 'حقيبة سفر لحفظ الأنسولين بدرجة حرارة مناسبة', 280, 252, 14, 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop', 'devices', 'monitoring', '[]', 'شوقي', 1, 0, 'Braun', 'BR-THR-01', NULL, NULL);
INSERT INTO sukarak_mazbot_products (id, title, details, price, offer_price, stock, img_url, category, sub_category, country, seller, status, in_review, brand, sku, offer_start_date, offer_end_date) VALUES (31, 'ميزان ذكي لقياس الوزن والدهون', 'ميزان رقمي يقيس الوزن ونسبة الدهون والعضلات مع تطبيق', 450, 405, 1, 'https://images.unsplash.com/photo-1576671081837-49000212a370?w=400&h=400&fit=crop', 'devices', 'monitoring', '[]', 'شوقي', 1, 0, 'CareSens', 'CS-N-PRM', NULL, NULL);

-- Table: sukarak_banners
DROP TABLE IF EXISTS sukarak_banners;
CREATE TABLE sukarak_banners (
	id INTEGER NOT NULL, 
	image_url VARCHAR(512) NOT NULL, 
	link VARCHAR(512), 
	title VARCHAR(255), 
	active BOOLEAN, 
	sort_order INTEGER, 
	target_type VARCHAR(50), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_banners (id, image_url, link, title, active, sort_order, target_type, created_at) VALUES (1, '/media/cms/1.jpg', 'offer', 'عروض حصرية على أجهزة قياس السكر', 1, 0, 'internal', '2026-02-12 03:56:29');
INSERT INTO sukarak_banners (id, image_url, link, title, active, sort_order, target_type, created_at) VALUES (2, '/media/cms/4.jpg', 'info', 'خدمات صحية متكاملة - سكرك مضبوط', 1, 0, 'internal', '2026-02-12 03:56:29');
INSERT INTO sukarak_banners (id, image_url, link, title, active, sort_order, target_type, created_at) VALUES (3, '/media/cms/5.jpg', '', 'منتجات صحية لمرضى السكري', 1, 3, 'internal', '2026-02-12 05:29:52');
INSERT INTO sukarak_banners (id, image_url, link, title, active, sort_order, target_type, created_at) VALUES (4, '/media/cms/6.jpg', '', 'استشارات طبية متخصصة', 1, 4, 'internal', '2026-02-12 05:29:52');
INSERT INTO sukarak_banners (id, image_url, link, title, active, sort_order, target_type, created_at) VALUES (5, '/media/cms/7.jpg', '', 'عروض وخصومات على المنتجات', 1, 5, 'internal', '2026-02-12 05:29:52');

-- Table: sukarak_notifications
DROP TABLE IF EXISTS sukarak_notifications;
CREATE TABLE sukarak_notifications (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	details TEXT NOT NULL, 
	image_url VARCHAR(512), 
	type VARCHAR(50), 
	target VARCHAR(50), 
	is_read BOOLEAN, 
	active BOOLEAN, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (1, 'مرحباً بكم في سكرك مضبوط', 'نحن سعداء لانضمامكم إلينا. ابدأوا رحلتكم الصحية معنا الآن!', 'https://tatbeqak.site/apps/tatbeqey/apps/sukarak_mazbot/images/home/1.jpg', 'general', 'all', 0, 1, '2026-02-12 03:56:29');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (2, 'تذكير بقياس السكر', 'حان وقت قياس مستوى السكر في الدم. لا تنسوا تسجيل القراءة في التطبيق.', NULL, 'general', 'all', 0, 1, '2026-02-12 03:56:29');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (3, 'نصائح غذائية جديدة', 'تم إضافة نصائح غذائية جديدة تساعدكم في التحكم بمستوى السكر. اطلعوا عليها الآن!', NULL, 'general', 'all', 0, 1, '2026-02-12 03:56:29');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (4, 'تحديث التطبيق', 'تم إصدار نسخة جديدة من التطبيق تحتوي على مميزات رائعة. قوموا بالتحديث الآن!', NULL, 'general', 'all', 0, 1, '2026-02-12 03:56:29');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (6, 'نصائح طبية مهمة', 'اكتشفوا أحدث النصائح الطبية للتحكم في مرض السكري وعيش حياة صحية أفضل.', NULL, 'general', 'all', 0, 1, '2026-02-12 03:56:29');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (7, 'رد على تذكرة الدعم: تجريبي ', 'تجريبي رد من لوحه الاداره  ', NULL, 'support_reply', 'users', 0, 1, '2026-02-13 13:41:40');
INSERT INTO sukarak_notifications (id, title, details, image_url, type, target, is_read, active, created_at) VALUES (8, 'تم إغلاق تذكرة الدعم: تجريبي ', 'تم إغلاق تذكرتك. نرجو تقييم تجربتك مع فريق الدعم.', NULL, 'support_closed', 'users', 0, 1, '2026-02-14 04:54:23');

-- Table: sukarak_settings
DROP TABLE IF EXISTS sukarak_settings;
CREATE TABLE sukarak_settings (
	id INTEGER NOT NULL, 
	"key" VARCHAR(100) NOT NULL, 
	value TEXT NOT NULL, 
	label VARCHAR(255), 
	"""group""" VARCHAR(50), 
	type VARCHAR(20), 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (1, 'app_name', 'سُكّرك مضبوط', 'اسم التطبيق', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (2, 'app_name_en', 'Sukarak Mazboot', 'App Name (EN)', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (3, 'app_version', '3.0.0', 'إصدار التطبيق', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (4, 'app_description', 'تطبيق شامل لإدارة مرض السكري ومتابعة الصحة اليومية', 'وصف التطبيق', 'general', 'textarea', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (5, 'currency', 'EGP', 'العملة', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (6, 'currency_symbol', 'ج.م', 'رمز العملة', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (7, 'default_language', 'ar', 'اللغة الافتراضية', 'general', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (8, 'support_email', 'support@sukarak.com', 'بريد الدعم الفني', 'contact', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (9, 'support_phone', '+20 1508189628', 'هاتف الدعم', 'contact', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (10, 'whatsapp', '+201508189628', 'واتساب', 'contact', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (11, 'website', 'https://sukarak.com', 'الموقع الإلكتروني', 'contact', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (12, 'address', 'القاهرة، مصر', 'العنوان', 'contact', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (13, 'payment_enabled', 'true', 'تفعيل الدفع الإلكتروني', 'payment', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (14, 'cod_enabled', 'true', 'الدفع عند الاستلام', 'payment', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (15, 'min_order_amount', '50', 'الحد الأدنى للطلب', 'payment', 'number', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (16, 'delivery_fee', '30', 'رسوم التوصيل', 'payment', 'number', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (17, 'free_delivery_above', '500', 'توصيل مجاني فوق', 'payment', 'number', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (18, 'push_notifications', 'true', 'الإشعارات الفورية', 'notifications', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (19, 'email_notifications', 'true', 'إشعارات البريد', 'notifications', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (20, 'sms_notifications', 'false', 'إشعارات SMS', 'notifications', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (21, 'daily_reminder', 'true', 'تذكير يومي بقياس السكر', 'notifications', 'boolean', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (22, 'reminder_time', '08:00', 'وقت التذكير', 'notifications', 'text', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (23, 'primary_color', '#166534', 'اللون الرئيسي', 'appearance', 'color', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (24, 'secondary_color', '#0f172a', 'اللون الثانوي', 'appearance', 'color', '2026-02-12 03:56:29');
INSERT INTO sukarak_settings (id, key, value, label, ""group"", type, updated_at) VALUES (25, 'maintenance_mode', 'false', 'وضع الصيانة', 'appearance', 'boolean', '2026-02-12 03:56:29');

-- Table: sport_db
DROP TABLE IF EXISTS sport_db;
CREATE TABLE sport_db (
	id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	type VARCHAR(255) NOT NULL, 
	details TEXT, 
	PRIMARY KEY (id)
);

INSERT INTO sport_db (id, name, type, details) VALUES (1, 'المشي السريع', 'رياضات مسموحة', 'يُعتبر من أسهل وأفضل التمارين لمرضى السكري، حيث يُساعد في تحسين الدورة الدموية والتحكم في مستويات السكر.');
INSERT INTO sport_db (id, name, type, details) VALUES (2, 'السباحة', 'رياضات مسموحة', 'تمرين منخفض التأثير على المفاصل، ويُساهم في تحسين اللياقة البدنية والقلبية.');
INSERT INTO sport_db (id, name, type, details) VALUES (3, 'ركوب الدراجة', 'رياضات مسموحة', 'سواء كانت ثابتة أو متحركة، تُساعد في تعزيز اللياقة القلبية والعضلية.');
INSERT INTO sport_db (id, name, type, details) VALUES (4, 'التمارين الهوائية', 'رياضات مسموحة', 'مثل الزومبا أو التمارين الجماعية، تُساهم في تحسين اللياقة العامة وحرق السعرات الحرارية.');
INSERT INTO sport_db (id, name, type, details) VALUES (5, 'تمارين القوة', 'رياضات مسموحة', 'مثل رفع الأوزان الخفيفة أو استخدام أجهزة المقاومة، تُساعد في بناء العضلات وزيادة معدل الأيض.');
INSERT INTO sport_db (id, name, type, details) VALUES (6, 'اليوغا', 'رياضات مسموحة', 'تُساهم في تحسين المرونة وتقليل التوتر، مما يُفيد في إدارة مستويات السكر.');
INSERT INTO sport_db (id, name, type, details) VALUES (7, 'تمارين التمدد والإستطاله', 'رياضات مسموحة', 'تُساعد في تحسين المرونة وتقليل التشنجات العضلية.');
INSERT INTO sport_db (id, name, type, details) VALUES (8, 'الرقص', 'رياضات مسموحة', 'يُعتبر نشاطًا ممتعًا يُساهم في تحسين اللياقة وحرق السعرات الحرارية.');
INSERT INTO sport_db (id, name, type, details) VALUES (9, 'تمارين التوازن', 'رياضات مسموحة', 'مثل تاي تشي، تُساعد في تحسين التوازن وتقليل مخاطر السقوط.');
INSERT INTO sport_db (id, name, type, details) VALUES (10, 'تمارين البيلاتس', 'رياضات مسموحة', 'تُركز على تقوية العضلات الأساسية وتحسين المرونة والتوازن.');
INSERT INTO sport_db (id, name, type, details) VALUES (11, 'تمارين التجديف', 'رياضات مسموحة', 'تمرين كامل للجسم يُساهم في تحسين اللياقة القلبية والعضلية.');
INSERT INTO sport_db (id, name, type, details) VALUES (12, 'التزلج على الماء', 'رياضات مسموحة', 'نشاط مائي ممتع يُساعد في تعزيز اللياقة البدنية.');
INSERT INTO sport_db (id, name, type, details) VALUES (13, 'كرة السلة', 'رياضات مسموحة', 'رياضة جماعية تُساهم في تحسين اللياقة العامة والتنسيق بين الحركات.');
INSERT INTO sport_db (id, name, type, details) VALUES (14, 'كرة الطائرة', 'رياضات مسموحة', 'تُساعد في تعزيز اللياقة البدنية والتفاعل الاجتماعي.');
INSERT INTO sport_db (id, name, type, details) VALUES (15, 'التنس', 'رياضات مسموحة', 'رياضة تتطلب حركة مستمرة وتُساهم في تحسين اللياقة والمرونة.');
INSERT INTO sport_db (id, name, type, details) VALUES (16, 'الرياضات عالية المجهود', 'رياضات ممنوعة', 'رفع الأثقال الثقيلة والتمارين عالية الكثافة بدون فترات راحة كافية.');
INSERT INTO sport_db (id, name, type, details) VALUES (17, 'الرياضات القتالية', 'رياضات ممنوعة', 'الملاكمة والفنون القتالية والرياضات ذات الاحتكاك الجسدي الكبير.');
INSERT INTO sport_db (id, name, type, details) VALUES (18, 'رياضات تؤثر على القدمين', 'رياضات ممنوعة', 'الأنشطة التي تتطلب ضغطًا مستمرًا على القدمين بدون أحذية مناسبة.');
INSERT INTO sport_db (id, name, type, details) VALUES (19, 'رياضات في ظروف قاسية', 'رياضات ممنوعة', 'التزلج على الجليد أو التسلق في ظروف باردة جدًا.');

-- Table: food_db
DROP TABLE IF EXISTS food_db;
CREATE TABLE food_db (
	id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	type VARCHAR(255), 
	serving VARCHAR(255), 
	glycemic_index VARCHAR(50), 
	calories VARCHAR(50), 
	carb VARCHAR(50), 
	protein VARCHAR(50), 
	fats VARCHAR(50), 
	PRIMARY KEY (id)
);

INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (1, 'الإجاص (Pear)', 'الفواكه', '1 حبة متوسطة', '38', '101', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (2, 'الأرز الأبيض', 'الحبوب والبذور', '1 كوب مطبوخ', '73', '205', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (3, 'الأرز البني', 'الحبوب والبذور', '1 كوب مطبوخ', '50', '216', '45', '5', '1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (5, 'الأناناس', 'الفواكه', '1 كوب', '66', '83', '22', NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (7, 'التفاح', 'الفواكه', '1 حبة متوسطة', '36', '95', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (8, 'التونة', 'الأسماك', 'علبة', NULL, '110', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (10, 'الجزر', 'الخضروات', '1 حبة', '35', '25', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (17, 'السبانخ', 'الخضروات', '100 جرام', NULL, '23', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (18, 'السلمون', 'الأسماك', 'شريحة', NULL, '208', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (20, 'الشوكولاتة الداكنة', 'سناكس', 'قطعة', '23', '170', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (45, 'بيض مسلوق', 'منتجات البيض', '2 بيضة', NULL, '155', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (69, 'صدر دجاج مشوي', 'اللحوم', '100 جرام', NULL, '165', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (78, 'فول مدمس', 'البقوليات', 'كوب', '40', '187', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (136, 'الماء', 'المشروبات والعصائر', 'كوب', NULL, '0', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (137, 'الشاي الأخضر', 'المشروبات والعصائر', 'كوب', NULL, '0', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (138, 'الأرز الأبيض (White Rice)', 'الحبوب والبذور', '1 كوب مطبوخ (158 جرام)', '73', '205', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (139, 'الأرز البني (Brown Rice)', 'الحبوب والبذور', '1 كوب مطبوخ (195 جرام)', '50', '216', '45', '5', '1.8');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (140, 'الأناناس (Pineapple)', 'الفواكه', '1 كوب (165 جرام)', '66', '83', '22', '0.9', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (141, 'الباذنجان (Eggplant)', 'الخضروات', '1 كوب (82 جرام)', '15', '20', '5', '0.8', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (142, 'البرتقال (Orange)', 'الفواكه', 'حبة متوسطة (131 جرام)', '45', '62', '15', '1.2', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (143, 'البروكلي (Broccoli)', 'الخضروات', '1 كوب (91 جرام)', '15', '31', '6', '2.6', '0.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (144, 'البسكويت (Crackers)', 'الإسناكات', '1 أونصة (28 جرام)', '74', '120', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (145, 'البطاطا', 'الخضروات', '200 جرام', NULL, '152', '34', '3', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (146, 'البطاطا البيضاء (White Potato)', 'الخضروات', '1 حبة متوسطة (173 جرام)', '78', '160', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (147, 'البطاطا الحلوة (Sweet Potato)', 'السكريات', '1 حبة متوسطة (130 جرام)', '63', '112', '26', '2', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (148, 'البطاطس', 'الخضروات', '250 جرام', NULL, '215', '50', '5', '2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (149, 'البطيخ (Watermelon)', 'الفواكه', '1 كوب (154 جرام)', '76', '46', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (150, 'البيتزا (Pizza)', 'المخبوزات', '1 شريحة (107 جرام)', '80', '285', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (151, 'التفاح (Apple)', 'الفواكه', '1حبة متوسطة (182 جرام)', '36', '95', '25', '0.5', '0.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (152, 'التمر (Dates)', 'السكريات', '1 حبة (7 جرام)', '50', '20', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (153, 'التونة (Tuna)', 'أسماك', '100 جرام', NULL, '132', NULL, '30', '1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (154, 'الجبن القريش (Cottage Cheese)', 'مشتقات الألبان', '1 كوب (210 جرام)', '30', '220', '6', '28', '2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (155, 'الجزر (Carrot)', 'الخضروات', '1 حبة متوسطة (61 جرام)', '39', '25', '6', '0.6', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (156, 'الجوز (Walnuts)', 'المكسرات', '1 أونصة (28 جرام)', '15', '185', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (157, 'الحليب قليل الدسم (Low-Fat Milk)', 'مشتقات الألبان', '1 كوب (244 جرام)', '31', '103', '12', '8', '2.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (158, 'الحمص (Chickpeas)', 'الحبوب والبذور', '1 كوب مطبوخ (164 جرام)', '28', '269', '45', '15', '4.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (159, 'الخبز الأبيض (White مخبوزات)', 'المخبوزات', '1 شريحة (25 جرام)', '75', '67', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (160, 'الخبز الأسمر (Whole Wheat مخبوزات)', 'المخبوزات', '1 شريحة (32 جرام)', '66', '81', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (161, 'الخضروات الورقية', 'الخضروات', '250 جرام', NULL, '60', '12', '5', '1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (162, 'الخوخ (Peach)', 'الفواكه', '1 حبة متوسطة (150 جرام)', '42', '59', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (163, 'الذرة (Corn)', 'الحبوب والبذور', '1 كوب (166 جرام)', '56', '605', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (164, 'الزبادي الطبيعي (Plain Yogurt)', 'مشتقات الألبان', '1 كوب (245 جرام)', '14', '149', '12', '11', '3.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (165, 'الزبادي اليوناني (Greek Yogurt)', 'مشتقات الألبان', '1 كوب (245 جرام)', '12', '150', '9', '24', '5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (166, 'السبانخ (Spinach)', 'الخضروات', '1 كوب (30 جرام)', '15', '7', '1', '0.9', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (167, 'السكر الأبيض (White Sugar)', 'السكريات', '1 ملعقة كبيرة (12 جرام)', '75', '49', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (168, 'السلمون (Salmon)', 'أسماك', '100 جرام', NULL, '208', NULL, '25', '13');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (169, 'الشعير (Barley)', 'الحبوب والبذور', '1 كوب مطبوخ (157 جرام)', '28', '193', '44', '5.5', '1.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (170, 'الشمام (Cantaloupe)', 'الفواكه', '1 كوب (160 جرام)', '65', '54', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (171, 'الشوفان (Oats)', 'الحبوب والبذور', '1 كوب (81 جرام)', '55', '305', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (172, 'الشوكولاتة الداكنة (Dark Chocolate)', 'الإسناكات', '1 أونصة (28 جرام)', '23', '170', '13', '2', '12');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (173, 'العدس (Lentils)', 'البقوليات', '1 كوب مطبوخ (198 جرام)', '32', '228', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (174, 'العسل (Honey)', 'السكريات', '1 ملعقة كبيرة (21 جرام)', '65', '64', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (175, 'العنب (Grapes)', 'الفواكه', '1 كوب (151 جرام)', '59', '104', '27', '1.1', '0.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (176, 'الفاصوليا الخضراء (Green Beans)', 'الخضروات', '1 كوب (125 جرام)', '15', '44', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (177, 'الفراولة (Strawberries)', 'الفواكه', 'كوب (152 جرام)', '40', '49', '11', '1.1', '0.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (178, 'الفشار (Popcorn)', 'الإسناكات', '1 كوب (8 جرام)', '55', '31', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (179, 'الفلفل الرومي (Bell Pepper)', 'الخضروات', '1 حبة متوسطة (119 جرام)', '15', '37', '6', '1', '0.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (180, 'الفول (Fava Beans)', 'البقوليات', '1 كوب مطبوخ (170 جرام)', '40', '187', '33', '13', '0.9');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (181, 'الكرواسون (Croissant)', 'المخبوزات', '1 حبة (57 جرام)', '70', '230', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (182, 'الكورن فليكس (Corn Flakes)', 'الحبوب والبذور', '1 كوب (28 جرام)', '81', '100', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (183, 'الكوسا (Zucchini)', 'الخضروات', '1 كوب (124 جرام)', '15', '21', '4', '1.5', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (184, 'الكينوا (Quinoa)', 'الحبوب والبذور', '1 كوب مطبوخ (185 جرام)', '53', '220', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (185, 'الكيوي (Kiwi)', 'الفواكه', 'حبة متوسطة (75 جرام)', '53', '46', '10', '0.8', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (186, 'اللوز (Almonds)', 'المكسرات', '1 أونصة (28 جرام)', NULL, '164', '6', '6', '14');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (187, 'المانجو (Mango)', 'الفواكه', '1 حبة متوسطة (200 جرام)', '56', '150', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (188, 'المشمش (Apricot)', 'الفواكه', '1 حبة متوسطة (35 جرام)', '34', '17', '3.8', '0.5', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (189, 'المعكرونة الكاملة (Whole Wheat مكرونات)', 'المكرونات', '1 كوب مطبوخ (151 جرام)', '50', '174', '37', '8', '1.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (190, 'المكسرات المختلطة (Mixed Nuts)', 'المكسرات', '1 أونصة (28 جرام)', '15', '173', '6', '6', '16');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (191, 'الموز (Banana)', 'الفواكه', '1 حبة متوسطة (118 جرام)', '51', '105', '27', '1.3', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (192, 'أرز أبيض', 'الحبوب والبذور', 'كوب متوسط (150 جرام)', NULL, '204', '45', '4', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (193, 'أرز بني مطبوخ', 'الحبوب والبذور', '100 جرام', '50', '112', '23', '2.6', '1.8');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (194, 'بابا غنوج', 'المقبلات', '3 ملاعق', NULL, '106', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (195, 'باتون ساليه', 'الإسناكات', 'قطعة (100 جرام)', NULL, '450', '65', '8', '17');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (196, 'باتيه سادة', 'المخبوزات', 'قطعة صغيرة', NULL, '195', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (197, 'باذنجان مخلل', 'المقبلات', '100 جرام', NULL, '65', '11', '1.5', '4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (198, 'باذنجان مطبوخ', 'الخضروات', 'كوب صغير (100 جرام)', NULL, '32', '8.2', '0.8', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (199, 'باذنجان مقلي', 'الخضروات', 'شريحتان', NULL, '130', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (200, 'بامية مطبوخة', 'الخضروات', '8 ملاعق', NULL, '180', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (201, 'بذور الشيا', 'الحبوب والبذور', '100 جرام', '1', '486', '42', '16.5', '30.6');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (202, 'بذور الشيا (Chia Seeds)', 'الحبوب والبذور', '1 أونصة (28 جرام)', '1', '138', '12', '4', '9');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (203, 'بذور الكتان', 'الحبوب والبذور', '100 جرام', '15', '534', '29', '18.3', '42.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (204, 'بروكلي', 'الخضروات', 'حبة (100 جرام)', '10', '34', '7', '2.8', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (205, 'بسلة خضراء', 'الخضروات', 'نصف كوب', NULL, '67', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (206, 'بصارة', 'البقوليات', '4 ملاعق', NULL, '105', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (207, 'بطاطا مسلوقة', 'الخضروات', 'حبة واحدة (120 جرام)', '78', '87', '20', '1.9', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (208, 'بطيخ', 'الفواكه', 'قطعة (100 جرام)', '72', '35', '7.6', '0.6', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (209, 'بيض مسلوق (Boiled Egg)', 'البيض', '1 حبة كبيرة (50 جرام)', NULL, '78', '0.6', '6', '5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (210, 'بيض مقلي', 'البيض', 'حبة واحدة (40 جرام)', NULL, '90', '0.6', '6', '5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (211, 'توست السن', 'المخبوزات', 'شريحة', NULL, '35-40', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (212, 'توست أبيض', 'المخبوزات', 'شريحة', NULL, '60', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (213, 'تونة معلبة بالماء', 'أسماك', 'عبوة صغيرة', NULL, '116', NULL, '24', '1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (214, 'جبن اسطنبولي', 'الأجبان', '100 جرام', NULL, '250', NULL, '15', '20');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (215, 'جبن الشيدر', 'الأجبان', 'شريحة', NULL, '114', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (216, 'جبن المثلثات', 'الأجبان', '100 جرام', NULL, '270', NULL, '10', '22');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (217, 'جبن رومي', 'الأجبان', 'شريحة', NULL, '80-100', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (218, 'جبن فلامنك', 'الأجبان', 'شريحتان', NULL, '370', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (219, 'جبن فيتا', 'الأجبان', 'ملعقة كبيرة', NULL, '37', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (220, 'جبن قريش', 'الأجبان', '50 جرامًا', NULL, '50', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (221, 'جبن كيري', 'الأجبان', '100 جرام', NULL, '300', '3', '8', '25');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (222, 'جبن موتزاريلا', 'الأجبان', 'ملعقة كبيرة', NULL, '65', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (223, 'جزر', 'الخضروات', 'حبة واحدة (100 جرام)', '39', '41', '10', '0.6', '0.1');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (224, 'جمبري', 'أسماك', '100 جرام', NULL, '90', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (225, 'حلاوة طحينية', 'السكريات', 'ملعقة كبيرة', NULL, '120', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (226, 'حليب خالي الدسم', 'مشتقات الألبان', '100 مللي', '30', '42', '4.8', '4', '0.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (227, 'حمص مسلوق', 'الحبوب والبذور', '100 جرام', '28', '166', '27.4', '8', '2.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (228, 'خبز بلدي', 'المخبوزات', 'رغيف متوسط', NULL, '420', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (229, 'خبز سن', 'المخبوزات', 'رغيف كبير', NULL, '220', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (230, 'خبز شامي', 'المخبوزات', 'رغيف صغير', NULL, '360', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (231, 'خبز فينو', 'المخبوزات', 'رغيف متوسط', NULL, '480', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (232, 'خبز قمح كامل', 'المخبوزات', 'رغيف متوسط', '69', '247', '41', '8', '2.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (233, 'رغيف خبز ابيض', 'المخبوزات', '100 جرام', NULL, '265', '50', '7', '3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (234, 'رنجة', 'أسماك', 'حبة واحدة', NULL, '225', NULL, '20', '15');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (235, 'زبادي', 'مشتقات الألبان', 'كوب صغير (100 جرام)', NULL, '65', '6', '5', '3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (236, 'زبادي يوناني قليل الدسم', 'مشتقات الألبان', '100 جرام', '35', '70', '5', '10', '2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (237, 'زيتون أسود', 'المقبلات', '6 حبات', NULL, '205', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (238, 'سبانخ', 'الخضروات', 'حبة (100 جرام)', '15', '23', '3.6', '2.9', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (239, 'سبانخ مطبوخة', 'الخضروات', '8 ملاعق', NULL, '140', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (240, 'سبيط', 'أسماك', '100 جرام', NULL, '61', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (241, 'سلطة خضار(الجزر-الخيار-الطماطم-الذرة الحلوة)', 'الخضروات', '120 جرام', NULL, '60', '10', '2', '0.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (242, 'سلمون مشوي', 'أسماك', 'حبة واحدة (150 جرام)', NULL, '300', NULL, '25', '20');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (243, 'سمك تونة معلب بالزيت', 'أسماك', 'عبوة (100 جرام)', NULL, '220', NULL, '20', '15');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (244, 'سمك تونة معلب بالماء', 'أسماك', 'عبوة (120 جرام)', NULL, '120', NULL, '28', '3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (245, 'سمك فيليه', 'أسماك', 'قطعة واحدة (100 جرام)', NULL, '130', NULL, '20', '4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (246, 'سمك مشوي', 'أسماك', 'ربع كيلو', NULL, '320', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (247, 'سمك مقلي', 'أسماك', 'ربع كيلو', NULL, '500', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (248, 'شوربة خضار', 'الشوربات', 'كوب (250 مللي)', NULL, '70', '15', '3', '2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (249, 'شوربة سمك', 'الشوربات', 'كوب (150 مللي)', NULL, '105', '6', '11', '5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (250, 'شوربة كريمة دجاج', 'الشوربات', 'كوب (150 مللي)', NULL, '145', '15', '5', '11');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (251, 'شوربة لحمة', 'الشوربات', '150 مللي', NULL, '313', '30', '20', '11');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (252, 'شوربة لسان عصفور', 'الشوربات', 'كوب (250 مللي)', NULL, '120', '20', '4', '5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (253, 'شوفان', 'الحبوب والبذور', '200 جرام', NULL, '758', '135', '25', '13');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (254, 'شوفان مطبوخ', 'الحبوب والبذور', '100 جرام', '55', '71', '12', '2.6', '2.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (255, 'صدور الدجاج (Chicken Breast)', 'اللحوم', '100 جرام', NULL, '165', NULL, '31', '3.6');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (256, 'صيادية السمك', 'أسماك', '100 جرام', NULL, '209', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (257, 'طبق كشري', 'المكرونات', 'طبق متوسط', NULL, '840', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (258, 'طماطم', 'الخضروات', 'حبة (100 جرام)', '15', '18', '3.9', '1', '0.2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (259, 'عدس', 'البقوليات', '6 ملاعق', NULL, '175', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (260, 'عدس مطبوخ', 'البقوليات', '100 جرام', '32', '116', '20.1', '8', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (261, 'عسل أبيض', 'السكريات', 'ملعقة كبيرة', NULL, '60', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (262, 'عسل أسود', 'السكريات', 'ملعقة كبيرة', NULL, '80', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (263, 'فاصوليا مطبوخة', 'البقوليات', 'نصف كوب', NULL, '20', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (264, 'فراخ', 'اللحوم', '150 جرام', NULL, '248', NULL, '46', '6');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (265, 'فستق', 'المكسرات', '100 جرام', NULL, '562', '28', '20', '45');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (266, 'فطير مشلتت', 'المخبوزات', 'رغيف متوسط', NULL, '1500', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (267, 'فلافل', 'البقوليات', 'قرص صغير', NULL, '70', '6', '3', '3.5');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (268, 'فلفل أحمر', 'الخضروات', 'حبة (100 جرام)', '10', '35', '8', '1.5', '0.4');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (269, 'قرنبيط مطبوخ', 'الخضروات', 'نصف كوب (60 جرام)', NULL, '15', '2.9', '1.2', '0.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (270, 'كبدة الدجاج', 'اللحوم', '250 جرام', NULL, '300', NULL, '42', '12');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (271, 'كرواسون سادة', 'المخبوزات', 'قطعة', NULL, '350-400', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (272, 'كورن فليكس', 'الحبوب والبذور', 'ملعقة كبيرة', NULL, '20', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (273, 'كوسة مطبوخة', 'الخضروات', 'نصف كوب', NULL, '18', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (274, 'لانشون بقري', 'اللحوم', 'شريحة', NULL, '100', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (275, 'لانشون دجاج', 'اللحوم', 'شريحة', NULL, '50', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (276, 'لحم بقري مشوي', 'اللحوم', 'شريحة', NULL, '250', NULL, '26', '15');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (277, 'لوبيا مطبوخة', 'البقوليات', '6 ملاعق', NULL, '260', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (278, 'لوز', 'المكسرات', '100 جرام', NULL, '576', '21.6', '21.2', '50');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (279, 'مخ', 'اللحوم', '200 جرام', NULL, '250', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (280, 'مربى', 'السكريات', 'ملعقة كبيرة', NULL, '60', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (281, 'معكرونة مسلوقة', 'المكرونات', 'ملعقة كبيرة', NULL, '37', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (282, 'معكرونة مطبوخة', 'المكرونات', 'ملعقة كبيرة', NULL, '45', NULL, NULL, NULL);
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (283, 'مكرونة', 'المكرونات', '200 جرام', NULL, '252', '56', '6', '2');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (284, 'مكرونة قمح كامل', 'المكرونات', '100 جرام', '48', '130', '30', '5.8', '1.3');
INSERT INTO food_db (id, name, type, serving, glycemic_index, calories, carb, protein, fats) VALUES (285, 'ملوخية', 'الخضروات', 'كوب كبير', NULL, '66', NULL, NULL, NULL);

-- Table: sukarak_permissions
DROP TABLE IF EXISTS sukarak_permissions;
CREATE TABLE sukarak_permissions (
	id INTEGER NOT NULL, 
	role VARCHAR(50) NOT NULL, 
	module VARCHAR(50) NOT NULL, 
	can_view BOOLEAN, 
	can_create BOOLEAN, 
	can_edit BOOLEAN, 
	can_delete BOOLEAN, 
	can_approve BOOLEAN, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (1, 'admin', 'dashboard', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (2, 'admin', 'products', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (3, 'admin', 'users', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (4, 'admin', 'orders', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (5, 'admin', 'chat', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (6, 'admin', 'settings', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (7, 'admin', 'reports', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (8, 'admin', 'notifications', 1, 1, 1, 1, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (9, 'seller', 'dashboard', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (10, 'seller', 'products', 1, 1, 1, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (11, 'seller', 'users', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (12, 'seller', 'orders', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (13, 'seller', 'chat', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (14, 'seller', 'settings', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (15, 'seller', 'reports', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (16, 'seller', 'notifications', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (17, 'doctor', 'dashboard', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (18, 'doctor', 'products', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (19, 'doctor', 'users', 1, 0, 0, 0, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (20, 'doctor', 'orders', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (21, 'doctor', 'chat', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (22, 'doctor', 'settings', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (23, 'doctor', 'reports', 1, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (24, 'doctor', 'notifications', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (25, 'moderator', 'dashboard', 1, 1, 1, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (26, 'moderator', 'products', 1, 1, 1, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (27, 'moderator', 'users', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (28, 'moderator', 'orders', 1, 1, 1, 0, 1);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (29, 'moderator', 'chat', 1, 1, 1, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (30, 'moderator', 'settings', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (31, 'moderator', 'reports', 0, 0, 0, 0, 0);
INSERT INTO sukarak_permissions (id, role, module, can_view, can_create, can_edit, can_delete, can_approve) VALUES (32, 'moderator', 'notifications', 1, 1, 1, 0, 0);

-- Table: sukarak_orders
DROP TABLE IF EXISTS sukarak_orders;
CREATE TABLE sukarak_orders (
	id INTEGER NOT NULL, 
	order_number VARCHAR(20) NOT NULL, 
	user_id INTEGER NOT NULL, 
	order_type VARCHAR(50), 
	subtotal NUMERIC(10, 2) NOT NULL, 
	discount_amount NUMERIC(10, 2), 
	total_amount NUMERIC(10, 2) NOT NULL, 
	currency VARCHAR(3), 
	payment_status VARCHAR(50), 
	payment_method VARCHAR(50), 
	status VARCHAR(50), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, payment_reference VARCHAR(100), coupon_id VARCHAR(20), updated_at TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (2, 'ORD202510160104', 52, 'service', 1470, 0, 1470, 'EGP', 'paid', 'card', 'completed', '2026-02-12 03:56:29', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (4, 'ORD202510163862', 52, 'service', 2450, 1225, 1225, 'EGP', 'paid', 'card', 'completed', '2026-02-12 03:56:29', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (16, 'ORD202510191389', 55, 'service', 2450, 0, 2450, 'EGP', 'paid', 'card', 'pending', '2026-02-12 03:56:29', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (36, 'ORD202510268403', 27, 'market', 450, 0, 450, 'EGP', 'paid', 'card', 'completed', '2026-02-12 03:56:29', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (40, 'ORD202512297764', 57, 'market', 200, 0, 200, 'EGP', 'paid', 'card', 'pending', '2026-02-12 03:56:29', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (41, 'ORD-5A1BD39C', 52, 'market', 1000, 0, 1000, 'EGP', 'pending', 'card', 'pending', '2026-02-12 06:37:03', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (42, 'ORD-19456A53', 52, 'market', 1579, 0, 1579, 'EGP', 'pending', 'cod', 'confirmed', '2026-02-12 09:57:09', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (43, 'ORD-E9A79B20', 52, 'market', 1549, 0, 1549, 'EGP', 'paid', 'card', 'confirmed', '2026-02-12 10:06:11', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (44, 'SM-2024001', 70, 'market', 990, 99, 891, 'EGP', 'pending', 'cod', 'confirmed', '2026-01-15 07:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (45, 'SM-2024002', 68, 'market', 1575, 0, 1575, 'EGP', 'pending', 'wallet', 'confirmed', '2026-01-09 16:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (46, 'SM-2024003', 67, 'market', 895, 89.5, 805.5, 'EGP', 'paid', 'cod', 'delivered', '2026-02-07 15:34:50.968194', NULL, NULL, '2026-02-12 11:40:12');
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (47, 'SM-2024004', 69, 'market', 170, 8.5, 161.5, 'EGP', 'pending', 'cod', 'processing', '2026-01-02 20:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (48, 'SM-2024005', 69, 'market', 1030, 0, 1030, 'EGP', 'pending', 'cod', 'shipped', '2026-01-09 13:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (49, 'SM-2024006', 66, 'market', 205, 0, 205, 'EGP', 'paid', 'card', 'delivered', '2026-02-07 13:34:50.968194', NULL, NULL, '2026-02-12 12:10:58');
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (50, 'SM-2024007', 66, 'market', 1410, 0, 1410, 'EGP', 'paid', 'cod', 'delivered', '2026-01-30 02:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (51, 'SM-2024008', 67, 'market', 2090, 0, 2090, 'EGP', 'paid', 'card', 'delivered', '2025-12-23 00:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (52, 'SM-2024009', 67, 'market', 1590, 79.5, 1510.5, 'EGP', 'paid', 'cod', 'delivered', '2026-01-07 22:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (53, 'SM-2024010', 69, 'market', 220, 0, 220, 'EGP', 'paid', 'cod', 'delivered', '2025-12-26 08:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (54, 'SM-2024011', 69, 'market', 550, 27.5, 522.5, 'EGP', 'paid', 'cod', 'delivered', '2025-12-30 22:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (55, 'SM-2024012', 70, 'market', 280, 0, 280, 'EGP', 'paid', 'cod', 'delivered', '2025-12-20 23:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (56, 'SM-2024013', 66, 'market', 895, 0, 895, 'EGP', 'pending', 'card', 'cancelled', '2025-12-15 11:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (57, 'SM-2024014', 68, 'market', 570, 0, 570, 'EGP', 'paid', 'card', 'delivered', '2025-12-21 02:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (58, 'SM-2024015', 67, 'market', 560, 28, 532, 'EGP', 'pending', 'card', 'processing', '2026-01-31 00:34:50.968194', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (59, 'ORD-A27A1901', 52, 'market', 1599, 0, 1599, 'EGP', 'paid', 'card', 'confirmed', '2026-02-12 12:18:10', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (60, 'ORD-D44988B9', 52, 'market', 1000, 0, 1000, 'EGP', 'paid', 'card', 'confirmed', '2026-02-12 14:30:28', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (61, 'ORD-D7EFA3A7', 52, 'market', 45, 0, 45, 'EGP', 'paid', 'card', 'confirmed', '2026-02-12 18:21:54', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (62, 'ORD-B8D15246', 52, 'market', 1000, 0, 1000, 'EGP', 'paid', 'wallet', 'confirmed', '2026-02-12 23:46:03', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (63, 'ORD-F9F30F26', 52, 'market', 1399, 0, 1399, 'EGP', 'paid', 'card', 'confirmed', '2026-02-13 12:14:56', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (64, 'ORD-60D33C46', 52, 'market', 2399, 0, 2399, 'EGP', 'paid', 'card', 'confirmed', '2026-02-13 12:15:41', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (65, 'ORD-B71FDC24', 52, 'market', 2399, 0, 2399, 'EGP', 'paid', 'card', 'processing', '2026-02-13 12:23:55', NULL, NULL, '2026-02-13 16:29:30');
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (66, 'ORD-3596D947', 52, 'market', 1000, 0, 1000, 'EGP', 'paid', 'card', 'confirmed', '2026-02-13 12:43:50', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (67, 'ORD-D27963B8', 52, 'market', 1000, 0, 1000, 'EGP', 'paid', 'card', 'confirmed', '2026-02-13 12:44:06', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (68, 'ORD-0CB7C652', 52, 'market', 1000, 0, 1000, 'EGP', 'paid', 'card', 'confirmed', '2026-02-13 12:49:10', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (69, 'ORD-35419938', 52, 'market', 1054.5, 0, 1054.5, 'EGP', 'paid', 'card', 'confirmed', '2026-02-14 03:01:53', NULL, NULL, NULL);
INSERT INTO sukarak_orders (id, order_number, user_id, order_type, subtotal, discount_amount, total_amount, currency, payment_status, payment_method, status, created_at, payment_reference, coupon_id, updated_at) VALUES (70, 'ORD-8A258D43', 52, 'market', 855, 0, 855, 'EGP', 'paid', 'card', 'confirmed', '2026-02-14 03:47:43', NULL, NULL, NULL);

-- Table: sugar_readings
DROP TABLE IF EXISTS sugar_readings;
CREATE TABLE sugar_readings (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	reading FLOAT NOT NULL, 
	test_type VARCHAR(100), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (1, 29, 95.0, 'fasting', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (2, 29, 135.0, 'after_meal', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (3, 29, 88.0, 'fasting', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (4, 29, 155.0, 'after_meal', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (5, 29, 102.0, 'random', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (6, 29, 78.0, 'fasting', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (7, 29, 190.0, 'after_meal', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (8, 29, 110.0, 'fasting', '2026-02-12 05:42:15');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (9, 29, 120.0, 'random', '2026-02-12 05:59:56');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (10, 52, 130.0, 'random', '2026-02-11 22:28:43.355830');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (11, 52, 136.0, 'after_meal', '2026-02-11 06:28:43.355964');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (12, 52, 117.0, 'fasting', '2026-02-10 05:28:43.356013');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (13, 52, 167.0, 'fasting', '2026-02-08 21:28:43.356045');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (14, 52, 83.0, 'random', '2026-02-08 00:28:43.356059');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (15, 52, 178.0, 'after_meal', '2026-02-07 03:28:43.356075');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (16, 52, 90.0, 'random', '2026-02-06 05:28:43.356102');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (17, 52, 101.0, 'random', '2026-02-05 00:28:43.356115');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (18, 52, 178.0, 'random', '2026-02-04 09:28:43.356128');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (19, 52, 99.0, 'after_meal', '2026-02-03 09:28:43.356142');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (20, 52, 123.0, 'fasting', '2026-02-02 07:28:43.356155');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (21, 52, 171.0, 'after_meal', '2026-02-01 04:28:43.356168');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (22, 52, 80.0, 'random', '2026-01-31 06:28:43.356182');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (23, 52, 145.0, 'fasting', '2026-01-29 23:28:43.356195');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (24, 52, 167.0, 'random', '2026-01-29 03:28:43.356208');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (25, 62, 153.0, 'fasting', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (26, 62, 165.0, 'random', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (27, 62, 212.0, 'after_meal', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (28, 62, 180.0, 'fasting', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (29, 62, 187.0, 'after_meal', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (30, 63, 133.0, 'random', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (31, 63, 133.0, 'after_meal', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (32, 63, 162.0, 'fasting', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (33, 63, 82.0, 'after_meal', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (34, 63, 187.0, 'after_meal', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (35, 64, 170.0, 'random', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (36, 64, 186.0, 'random', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (37, 64, 181.0, 'random', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (38, 64, 118.0, 'fasting', '2026-02-12 07:26:13');
INSERT INTO sugar_readings (id, user_id, reading, test_type, created_at) VALUES (39, 64, 180.0, 'after_meal', '2026-02-12 07:26:13');

-- Table: insulin_records
DROP TABLE IF EXISTS insulin_records;
CREATE TABLE insulin_records (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	reading FLOAT NOT NULL, 
	test_type VARCHAR(100), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO insulin_records (id, user_id, reading, test_type, created_at) VALUES (1, 52, 125.88, 'random', '2026-02-12 03:56:29');
INSERT INTO insulin_records (id, user_id, reading, test_type, created_at) VALUES (2, 52, 200.54, 'random', '2026-02-12 03:56:29');
INSERT INTO insulin_records (id, user_id, reading, test_type, created_at) VALUES (3, 52, 77.15, 'random', '2026-02-12 03:56:29');

-- Table: excercise_records
DROP TABLE IF EXISTS excercise_records;
CREATE TABLE excercise_records (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	type VARCHAR(255) NOT NULL, 
	duration INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO excercise_records (id, user_id, type, duration, created_at) VALUES (1, 52, 'مشي', 15, '2026-02-12 03:56:29');
INSERT INTO excercise_records (id, user_id, type, duration, created_at) VALUES (2, 52, 'مشي', 150, '2026-02-12 03:56:29');
INSERT INTO excercise_records (id, user_id, type, duration, created_at) VALUES (3, 52, 'مشي', 139, '2026-02-12 03:56:29');
INSERT INTO excercise_records (id, user_id, type, duration, created_at) VALUES (4, 52, 'نشاط خفيف', 139, '2026-02-12 03:56:29');
INSERT INTO excercise_records (id, user_id, type, duration, created_at) VALUES (5, 52, 'Resistance', 100, '2026-02-12 19:15:11');

-- Table: meal_records
DROP TABLE IF EXISTS meal_records;
CREATE TABLE meal_records (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	type VARCHAR(255), 
	contents TEXT, 
	calories FLOAT, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (1, 52, 'وجبة سناك', '["متابعة - 1 حبة صغيرة"]', 0.0, '2026-02-12 03:56:29');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (2, 52, 'وجبة الإفطار', '["افطار - 1 ملعقة صغيرة"]', 0.0, '2026-02-12 03:56:29');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (3, 52, 'وجبة العشاء', '["عشاء - 1 ملعقة صغيرة"]', 0.0, '2026-02-12 03:56:29');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (4, 52, 'وجبة الغداء', '["غداء - 1 ملعقة صغيرة"]', 0.0, '2026-02-12 03:56:29');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (5, 29, 'فطور', 'خبز أسمر + بيض مسلوق + شاي أخضر', 350.0, '2026-02-12 05:42:15');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (6, 29, 'غداء', 'أرز بني + صدر دجاج مشوي + سلطة', 550.0, '2026-02-12 05:42:15');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (7, 29, 'عشاء', 'زبادي + فاكهة + مكسرات', 280.0, '2026-02-12 05:42:15');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (8, 29, 'سناك', 'تفاحة + لوز', 150.0, '2026-02-12 05:42:15');
INSERT INTO meal_records (id, user_id, type, contents, calories, created_at) VALUES (9, 52, 'breakfast', 'الزعتر، الريحان، الزنجبيل، القرفة، الكمون، الكركم، الحلويات الجيلاتينية، الآيس كريم، الحلويات الشرقية، الزبادي المحلى والمنكّه، الفواكه المجففة، الشوكولاتة بالحليب', 0.0, '2026-02-12 19:49:19');

-- Table: drugs_records
DROP TABLE IF EXISTS drugs_records;
CREATE TABLE drugs_records (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	form VARCHAR(100), 
	frequency VARCHAR(100), 
	serving VARCHAR(100), 
	concentration VARCHAR(100), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO drugs_records (id, user_id, name, form, frequency, serving, concentration, created_at) VALUES (1, 52, 'انسولين', 'شراب', 'مرة واحدة في الأسبوع', NULL, NULL, '2026-02-12 03:56:29');
INSERT INTO drugs_records (id, user_id, name, form, frequency, serving, concentration, created_at) VALUES (2, 52, 'دكلبوفيت', 'أقراص', 'مرة يوميا', NULL, NULL, '2026-02-12 03:56:29');
INSERT INTO drugs_records (id, user_id, name, form, frequency, serving, concentration, created_at) VALUES (3, 29, 'ميتفورمين', 'أقراص', 'مرتين يومياً', '500mg', '500mg', '2026-02-12 05:42:15');
INSERT INTO drugs_records (id, user_id, name, form, frequency, serving, concentration, created_at) VALUES (4, 29, 'جلوكوفاج', 'أقراص', 'مرة يومياً', '850mg', '850mg', '2026-02-12 05:42:15');
INSERT INTO drugs_records (id, user_id, name, form, frequency, serving, concentration, created_at) VALUES (5, 29, 'إنسولين لانتوس', 'حقن', 'مرة يومياً', '20 وحدة', '100 وحدة/مل', '2026-02-12 05:42:15');

-- Table: sukarak_activity_log
DROP TABLE IF EXISTS sukarak_activity_log;
CREATE TABLE sukarak_activity_log (
	id INTEGER NOT NULL, 
	user_id INTEGER, 
	user_name VARCHAR(255), 
	action VARCHAR(100) NOT NULL, 
	entity_type VARCHAR(50), 
	entity_id INTEGER, 
	entity_name VARCHAR(255), 
	details TEXT, 
	ip_address VARCHAR(50), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (1, 52, 'د.محمد النقراشي', 'login', 'user', NULL, NULL, 'تسجيل دخول ناجح', NULL, '2026-02-12 01:56:29.859817');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (2, 52, 'د.محمد النقراشي', 'create', 'product', NULL, 'رويال جيلي 1000', 'إضافة منتج جديد', NULL, '2026-02-12 02:56:29.859817');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (3, 52, 'د.محمد النقراشي', 'update', 'order', NULL, 'ORD202510160104', 'تغيير الحالة إلى مكتمل', NULL, '2026-02-12 03:26:29.859817');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (4, 52, 'د.محمد النقراشي', 'create', 'notification', NULL, 'مرحباً بكم', 'إرسال إشعار عام', NULL, '2026-02-12 03:41:29.859817');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (5, 27, 'د.محمد النقراشي', 'update', 'setting', NULL, NULL, 'تحديث إعدادات الدفع', NULL, '2026-02-12 03:51:29.859817');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (6, NULL, 'المشرف', 'update', 'user', 37, 'شوقي', 'تغيير كلمة المرور', NULL, '2026-02-12 05:41:06');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (7, NULL, 'المشرف', 'create', 'user', 58, 'د. أحمد السيد', 'إضافة مستخدم جديد', NULL, '2026-02-12 06:34:37');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (8, NULL, 'المشرف', 'update', 'user', 58, 'د. أحمد السيد', 'تغيير كلمة المرور', NULL, '2026-02-12 07:58:25');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (9, NULL, 'المشرف', 'create', 'user', 65, 'محمد البائع', 'إضافة مستخدم جديد', NULL, '2026-02-12 10:49:39');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (10, NULL, 'المشرف', 'update', 'user', 27, 'د.محمد النقراشي', 'تغيير كلمة المرور', NULL, '2026-02-12 13:44:29');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (11, NULL, 'المشرف', 'update', 'user', 66, 'عبدالله محمد السيد', 'تغيير كلمة المرور', NULL, '2026-02-12 13:44:57');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (12, NULL, 'المشرف', 'update', 'user', 59, 'د. خالد العمري', 'تغيير كلمة المرور', NULL, '2026-02-12 13:45:23');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (13, NULL, 'المشرف', 'update', 'user', 1, 'د.محمد النقراشي', 'تغيير كلمة المرور', NULL, '2026-02-12 13:45:50');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (14, NULL, 'المشرف', 'update', 'user', 37, 'شوقي', 'تغيير كلمة المرور', NULL, '2026-02-12 13:46:10');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (15, NULL, 'المشرف', 'update', 'user', 65, 'محمد البائع', 'تغيير كلمة المرور', NULL, '2026-02-13 15:21:08');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (16, NULL, 'المشرف', 'update', 'product', 2, 'رويال جيلي 1000', 'تعديل بيانات المنتج', NULL, '2026-02-13 17:33:26');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (17, NULL, 'المشرف', 'update', 'product', 2, 'رويال جيلي 1000', 'تعديل بيانات المنتج', NULL, '2026-02-13 19:35:08');
INSERT INTO sukarak_activity_log (id, user_id, user_name, action, entity_type, entity_id, entity_name, details, ip_address, created_at) VALUES (18, NULL, 'المشرف', 'update', 'user', 1, 'د.محمد النقراشي', 'تحديث الرصيد: محفظة=0.0, نقاط=0', NULL, '2026-02-14 05:41:42');

-- Table: sukarak_appointments
DROP TABLE IF EXISTS sukarak_appointments;
CREATE TABLE sukarak_appointments (
	id INTEGER NOT NULL, 
	doctor_id INTEGER NOT NULL, 
	patient_id INTEGER NOT NULL, 
	doctor_name VARCHAR(255), 
	patient_name VARCHAR(255), 
	appointment_type VARCHAR(20), 
	status VARCHAR(20), 
	scheduled_at DATETIME NOT NULL, 
	notes TEXT, 
	duration_minutes INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(doctor_id) REFERENCES sukarak_users (id), 
	FOREIGN KEY(patient_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (1, 1, 29, 'د. خالد العمري', 'المستخدم', 'video', 'cancelled', '2026-02-15 10:00:00', 'متابعة مستوى السكر', 30, '2026-02-12 05:42:15');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (2, 1, 52, 'د. أحمد السيد', 'المستخدم', 'video', 'scheduled', '2026-02-12 10:20:00.000000', 'تجريبي  حجز موعد مع دكتور احمد ', 30, '2026-02-12 07:21:07');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (3, 58, 62, 'د. أحمد السيد', 'أحمد محمد', 'video', 'completed', '2026-02-12 12:26:13.844566', 'أحتاج استشارة حول قراءات السكر المرتفعة', 15, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (4, 58, 63, 'د. أحمد السيد', 'فاطمة علي', 'audio', 'completed', '2026-02-12 14:26:13.844566', 'متابعة دورية لمستوى السكر', 30, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (5, 58, 64, 'د. أحمد السيد', 'محمد إبراهيم', 'chat', 'completed', '2026-02-12 09:26:13.844566', 'استفسار عن جرعة الإنسولين', 15, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (6, 58, 62, 'د. أحمد السيد', 'أحمد محمد', 'video', 'completed', '2026-02-10 10:26:13.844566', 'فحص روتيني', 30, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (7, 58, 63, 'د. أحمد السيد', 'فاطمة علي', 'video', 'completed', '2026-02-09 10:26:13.844566', 'متابعة بعد تغيير الدواء', 30, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (8, 58, 64, 'د. أحمد السيد', 'محمد إبراهيم', 'video', 'completed', '2026-02-12 11:26:13.844566', 'جلسة متابعة', 30, '2026-02-12 07:26:13');
INSERT INTO sukarak_appointments (id, doctor_id, patient_id, doctor_name, patient_name, appointment_type, status, scheduled_at, notes, duration_minutes, created_at) VALUES (9, 1, 52, 'د. أحمد السيد', 'المستخدم', 'video', 'scheduled', '2026-02-12 10:39:00.000000', '', 30, '2026-02-12 07:39:17');

-- Table: sukarak_order_items
DROP TABLE IF EXISTS sukarak_order_items;
CREATE TABLE sukarak_order_items (
	id INTEGER NOT NULL, 
	order_id INTEGER NOT NULL, 
	item_type VARCHAR(50), 
	product_id INTEGER, 
	product_name VARCHAR(255), 
	quantity INTEGER, 
	unit_price NUMERIC(10, 2) NOT NULL, 
	total_price NUMERIC(10, 2) NOT NULL, service_type VARCHAR(50), service_name VARCHAR(255), product_category VARCHAR(100), created_at TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES sukarak_orders (id), 
	FOREIGN KEY(product_id) REFERENCES sukarak_mazbot_products (id)
);

INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (1, 2, 'market', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (2, 2, 'market', 5, 'جهاز قياس السكر المنزلي', 1, 450, 450, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (3, 4, 'market', 17, 'ساعة ذكية لمراقبة الصحة', 2, 1200, 2400, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (4, 36, 'market', 5, 'جهاز قياس السكر المنزلي', 1, 450, 450, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (5, 40, 'market', 6, 'علبة شرائط اختبار السكر', 1, 200, 200, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (6, 16, 'market', 17, 'ساعة ذكية لمراقبة الصحة', 1, 1200, 1200, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (7, 16, 'market', 11, 'فيتامينات متعددة للسكري', 2, 150, 300, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (8, 41, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, NULL, NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (9, 42, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (10, 42, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (11, 42, 'product', 7, 'بسكويت الشوفان بدون سكر', 1, 30, 30, NULL, NULL, 'food', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (12, 42, 'product', 11, 'فيتامينات متعددة للسكري', 1, 150, 150, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (13, 43, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (14, 43, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (15, 43, 'product', 11, 'فيتامينات متعددة للسكري', 1, 150, 150, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (16, 44, 'product', 24, 'إبر أنسولين نوفوفاين 4مم', 1, 85, 85, NULL, NULL, 'devices', '2026-01-15 07:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (17, 44, 'product', 26, 'فيتامين D3 5000 وحدة', 2, 95, 190, NULL, NULL, 'supplements', '2026-01-15 07:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (18, 44, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 1, 450, 450, NULL, NULL, 'devices', '2026-01-15 07:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (19, 45, 'product', 29, 'كريم ترطيب القدم السكري', 3, 75, 225, NULL, NULL, 'personal_care', '2026-01-09 16:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (20, 45, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 2, 450, 900, NULL, NULL, 'devices', '2026-01-09 16:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (21, 46, 'product', 24, 'إبر أنسولين نوفوفاين 4مم', 3, 85, 255, NULL, NULL, 'devices', '2026-02-07 15:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (22, 46, 'product', 27, 'بروتين بار خالي السكر (12 قطعة)', 3, 220, 660, NULL, NULL, 'nutrition', '2026-02-07 15:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (23, 46, 'product', 28, 'شاي أخضر عضوي - 50 كيس', 3, 65, 195, NULL, NULL, 'nutrition', '2026-02-07 15:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (24, 47, 'product', 24, 'إبر أنسولين نوفوفاين 4مم', 3, 85, 255, NULL, NULL, 'devices', '2026-01-02 20:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (25, 48, 'product', 22, 'جهاز قياس السكر الذكي', 2, 350, 700, NULL, NULL, 'devices', '2026-01-09 13:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (26, 48, 'product', 29, 'كريم ترطيب القدم السكري', 2, 75, 150, NULL, NULL, 'personal_care', '2026-01-09 13:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (27, 48, 'product', 24, 'إبر أنسولين نوفوفاين 4مم', 1, 85, 85, NULL, NULL, 'devices', '2026-01-09 13:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (28, 49, 'product', 28, 'شاي أخضر عضوي - 50 كيس', 3, 65, 195, NULL, NULL, 'nutrition', '2026-02-07 13:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (29, 49, 'product', 29, 'كريم ترطيب القدم السكري', 3, 75, 225, NULL, NULL, 'personal_care', '2026-02-07 13:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (30, 50, 'product', 23, 'شرائط اختبار السكر (50 شريحة)', 3, 120, 360, NULL, NULL, 'devices', '2026-01-30 02:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (31, 50, 'product', 22, 'جهاز قياس السكر الذكي', 1, 350, 350, NULL, NULL, 'devices', '2026-01-30 02:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (32, 51, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 3, 450, 1350, NULL, NULL, 'devices', '2025-12-23 00:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (33, 51, 'product', 22, 'جهاز قياس السكر الذكي', 3, 350, 1050, NULL, NULL, 'devices', '2025-12-23 00:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (34, 51, 'product', 30, 'حقيبة حفظ الأنسولين المبردة', 1, 280, 280, NULL, NULL, 'devices', '2025-12-23 00:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (35, 52, 'product', 23, 'شرائط اختبار السكر (50 شريحة)', 3, 120, 360, NULL, NULL, 'devices', '2026-01-07 22:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (36, 52, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 2, 450, 900, NULL, NULL, 'devices', '2026-01-07 22:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (37, 53, 'product', 27, 'بروتين بار خالي السكر (12 قطعة)', 2, 220, 440, NULL, NULL, 'nutrition', '2025-12-26 08:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (38, 54, 'product', 26, 'فيتامين D3 5000 وحدة', 1, 95, 95, NULL, NULL, 'supplements', '2025-12-30 22:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (39, 54, 'product', 23, 'شرائط اختبار السكر (50 شريحة)', 3, 120, 360, NULL, NULL, 'devices', '2025-12-30 22:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (40, 55, 'product', 28, 'شاي أخضر عضوي - 50 كيس', 1, 65, 65, NULL, NULL, 'nutrition', '2025-12-20 23:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (41, 55, 'product', 24, 'إبر أنسولين نوفوفاين 4مم', 3, 85, 255, NULL, NULL, 'devices', '2025-12-20 23:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (42, 56, 'product', 22, 'جهاز قياس السكر الذكي', 3, 350, 1050, NULL, NULL, 'devices', '2025-12-15 11:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (43, 56, 'product', 28, 'شاي أخضر عضوي - 50 كيس', 2, 65, 130, NULL, NULL, 'nutrition', '2025-12-15 11:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (44, 57, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 3, 450, 1350, NULL, NULL, 'devices', '2025-12-21 02:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (45, 57, 'product', 23, 'شرائط اختبار السكر (50 شريحة)', 2, 120, 240, NULL, NULL, 'devices', '2025-12-21 02:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (46, 58, 'product', 30, 'حقيبة حفظ الأنسولين المبردة', 3, 280, 840, NULL, NULL, 'devices', '2026-01-31 00:34:50.968194');
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (47, 59, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (48, 59, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (49, 59, 'product', 6, 'علبة شرائط اختبار السكر', 1, 200, 200, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (50, 60, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (51, 61, 'product', 13, 'مربى الفراولة بدون سكر', 1, 45, 45, NULL, NULL, 'food', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (52, 62, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (53, 63, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (54, 63, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (55, 64, 'product', 2, 'رويال جيلي 1000', 2, 1000, 2000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (56, 64, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (57, 65, 'product', 2, 'رويال جيلي 1000', 2, 1000, 2000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (58, 65, 'product', 5, 'جهاز قياس السكر المنزلي', 1, 399, 399, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (59, 66, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (60, 67, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (61, 68, 'product', 2, 'رويال جيلي 1000', 1, 1000, 1000, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (62, 69, 'product', 26, 'فيتامين D3 5000 وحدة', 3, 85.5, 256.5, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (63, 69, 'product', 25, 'مكمل أوميجا 3 - 1000مج', 4, 162, 648, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (64, 69, 'product', 11, 'فيتامينات متعددة للسكري', 1, 150, 150, NULL, NULL, 'supplements', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (65, 70, 'product', 31, 'ميزان ذكي لقياس الوزن والدهون', 1, 405, 405, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (66, 70, 'product', 30, 'حقيبة حفظ الأنسولين المبردة', 1, 252, 252, NULL, NULL, 'devices', NULL);
INSERT INTO sukarak_order_items (id, order_id, item_type, product_id, product_name, quantity, unit_price, total_price, service_type, service_name, product_category, created_at) VALUES (67, 70, 'product', 27, 'بروتين بار خالي السكر (12 قطعة)', 1, 198, 198, NULL, NULL, 'food', NULL);

-- Table: sukarak_medical_tests
DROP TABLE IF EXISTS sukarak_medical_tests;
CREATE TABLE sukarak_medical_tests (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	lab VARCHAR(255), 
	date VARCHAR(50), 
	result VARCHAR(255), 
	status VARCHAR(20), 
	notes TEXT, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, attachments TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

-- Table: sukarak_nursing_services
DROP TABLE IF EXISTS sukarak_nursing_services;
CREATE TABLE sukarak_nursing_services (
	id INTEGER NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	title_en VARCHAR(255), 
	price FLOAT, 
	duration VARCHAR(50), 
	icon VARCHAR(10), 
	color VARCHAR(100), 
	active INTEGER, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (1, 'قياس السكر والضغط', 'Sugar & BP Check', 50.0, '30 دقيقة', '🩺', 'from-teal-500 to-emerald-500', 1);
INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (2, 'الحقن والمحاليل', 'Injections & IV', 75.0, '20 دقيقة', '💉', 'from-blue-500 to-indigo-500', 1);
INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (3, 'تغيير الضمادات', 'Wound Dressing', 100.0, '45 دقيقة', '🩹', 'from-orange-500 to-amber-500', 1);
INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (4, 'سحب عينات دم', 'Blood Sample', 80.0, '15 دقيقة', '🧪', 'from-red-500 to-rose-500', 1);
INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (5, 'رعاية ما بعد العمليات', 'Post-Op Care', 200.0, '60 دقيقة', '🏥', 'from-purple-500 to-violet-500', 1);
INSERT INTO sukarak_nursing_services (id, title, title_en, price, duration, icon, color, active) VALUES (6, 'خدمات أخرى', 'Other Services', 150.0, '45 دقيقة', '', 'from-cyan-500 to-blue-500', 1);

-- Table: sukarak_nursing_bookings
DROP TABLE IF EXISTS sukarak_nursing_bookings;
CREATE TABLE sukarak_nursing_bookings (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	service_id INTEGER NOT NULL, 
	service_name VARCHAR(255), 
	date VARCHAR(50) NOT NULL, 
	time VARCHAR(20), 
	address VARCHAR(500) NOT NULL, 
	notes TEXT, 
	nurse_name VARCHAR(255), 
	status VARCHAR(20), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id), 
	FOREIGN KEY(service_id) REFERENCES sukarak_nursing_services (id)
);

-- Table: food_types
DROP TABLE IF EXISTS food_types;
CREATE TABLE food_types (
	id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	type VARCHAR(255), 
	class VARCHAR(255), 
	PRIMARY KEY (id)
);

INSERT INTO food_types (id, name, type, class) VALUES (1, 'الإجاص (Pear)', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (2, 'الأرز البني (Brown Rice)', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (3, 'الباذنجان (Eggplant)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (4, 'البروكلي (Broccoli)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (5, 'البطاطا', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (6, 'التفاح (Apple)', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (7, 'التونة (Tuna)', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (8, 'الجبن القريش (Cottage Cheese)', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (9, 'الجزر (Carrot)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (10, 'الجوز (Walnuts)', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (11, 'الحليب قليل الدسم (Low-Fat Milk)', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (12, 'الخضروات الورقية', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (13, 'الخوخ (Peach)', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (14, 'الزبادي الطبيعي (Plain Yogurt)', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (15, 'الزبادي اليوناني (Greek Yogurt)', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (16, 'السبانخ (Spinach)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (17, 'السلمون (Salmon)', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (18, 'الشعير (Barley)', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (19, 'الشوكولاتة الداكنة (Dark Chocolate)', 'سناكس', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (20, 'العدس (Lentils)', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (21, 'الفاصوليا الخضراء (Green Beans)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (22, 'الفراولة (Strawberries)', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (23, 'الفشار (Popcorn)', 'سناكس', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (24, 'الفلفل الرومي (Bell Pepper)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (25, 'الكوسا (Zucchini)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (26, 'الكينوا (Quinoa)', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (27, 'اللوز (Almonds)', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (28, 'المكسرات المختلطة (Mixed Nuts)', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (29, 'بابا غنوج', 'المقبلات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (30, 'باذنجان مخلل', 'المقبلات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (31, 'باذنجان مطبوخ', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (32, 'بامية مطبوخة', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (33, 'بذور الشيا (Chia Seeds)', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (34, 'بذور الكتان', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (35, 'بروكلي', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (36, 'بسلة خضراء (البازلاء)', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (37, 'بصارة', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (38, 'بيض مسلوق (Boiled Egg)', 'منتجات البيض', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (39, 'تونة معلبة بالماء', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (40, 'جبن قريش', 'الاجبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (41, 'جزر', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (42, 'جمبري', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (43, 'حليب خالي الدسم', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (44, 'حمص مسلوق', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (45, 'رنجة', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (46, 'زبادي (اللبن الرائب)', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (47, 'زبادي يوناني قليل الدسم', 'منتجات الالبان', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (48, 'زيتون أسود', 'المقبلات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (49, 'سبانخ', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (50, 'سبانخ مطبوخة', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (51, 'سلطة خضار', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (52, 'سلمون مشوي', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (53, 'سمك فيليه', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (54, 'سمك مشوي', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (55, 'شوربة خضار', 'الشوربات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (56, 'شوربة سمك', 'الشوربات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (57, 'شوربة اللحم', 'الشوربات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (58, 'صدر دجاج مشوي', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (59, 'صدور الدجاج (Chicken Breast)', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (60, 'طماطم', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (61, 'عدس مطبوخ', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (62, 'فاصوليا مطبوخة', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (63, 'فستق', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (64, 'فلفل أحمر', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (65, 'فول مدمس', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (66, 'قرنبيط مطبوخ', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (67, 'كبدة الدجاج', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (68, 'كوسة مطبوخة', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (69, 'لحم بقري مشوي', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (70, 'لوبيا مطبوخة', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (71, 'لوز', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (72, 'مكرونة قمح كامل', 'المكرونات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (73, 'ملوخية', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (74, 'الخيار', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (75, 'الفلفل', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (76, 'الخس', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (77, 'البصل', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (78, 'الثوم', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (79, 'الفجل', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (80, 'التفاح الأخضر', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (81, 'التوت', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (82, 'الجريب فروت', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (83, 'الكمثرى', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (84, 'الرمان', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (85, 'البابايا', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (86, 'الأفوكادو', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (87, 'خبز القمح الكامل', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (88, 'الدخن', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (89, 'اللحوم قليلة الدهون', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (90, 'البيض', 'منتجات البيض', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (91, 'السردين', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (92, 'الماكريل', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (93, 'زيت بذر الكتان', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (94, 'زيت جوز الهند', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (95, 'زيت الكانولا', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (96, 'زيت السمسم', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (97, 'زيت الزيتون', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (98, 'زيت الزيتون البكر', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (99, 'الفاصولياء البيضاء', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (100, 'الفاصولياء الحمراء', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (101, 'فول الصويا', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (102, 'عين الجمل', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (103, 'بذور عباد الشمس', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (104, 'بذور اليقطين', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (105, 'القرفة', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (106, 'الكركم', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (107, 'الزنجبيل', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (108, 'الزعتر', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (109, 'الريحان', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (110, 'النعناع', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (111, 'حبة البركة', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (112, 'الكمون', 'الأعشاب والتوابل', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (113, 'الماء', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (114, 'الشاي الأخضر', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (115, 'شاي الأعشاب', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (116, 'قهوة بدون سكر', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (117, 'مشروب القرفة', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (118, 'مشروب الزنجبيل', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (119, 'مشروب الليمون', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (120, 'مشروب النعناع', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (121, 'عصير الفراولة', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (122, 'عصير الرمان', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (123, 'عصير التفاح', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (124, 'عصير البرتقال بدون سكر', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (125, 'حليب الشوفان', 'المشروبات والعصائر', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (126, 'خبز من الحبوب الكاملة', 'المخبوزات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (127, 'أرز بسمتي', 'الحبوب والبذور', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (128, 'بطاطس مشوية', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (129, 'بطاطس مسلوقة', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (130, 'الكاجو', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (131, 'ورق عنب', 'الخضروات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (132, 'خبز النخالة', 'المخبوزات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (133, 'خبز الشوفان', 'المخبوزات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (134, 'خبز اللوز', 'المخبوزات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (135, 'ترمس', 'البقوليات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (136, 'الجوافه', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (137, 'اليوسفي', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (138, 'التين الشوكى', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (139, 'التوت البري', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (140, 'الفول السوداني', 'المكسرات', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (141, 'جوز الهند', 'الفواكه', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (142, 'كبدة بقر', 'اللحوم', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (143, 'سلطة رنجة', 'الأسماك', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (144, 'زبدة الفول السوداني', 'الزيوت والدهون', 'أطعمة مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (145, 'الأرز الأبيض (White Rice)', 'الحبوب والبذور', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (146, 'الأناناس (Pineapple)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (147, 'البرتقال (Orange)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (148, 'البطاطا الحلوة (Sweet Potato)', 'الخضروات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (149, 'البطيخ (Watermelon)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (150, 'التمر (Dates)', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (151, 'الخبز الأسمر', 'المخبوزات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (152, 'الذرة (Corn)', 'الحبوب والبذور', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (153, 'الشمام (Cantaloupe)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (154, 'الشوفان (Oats)', 'الحبوب والبذور', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (155, 'العسل (Honey)', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (156, 'العنب (Grapes)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (157, 'الكيوي (Kiwi)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (158, 'المانجو (Mango)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (159, 'المشمش (Apricot)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (160, 'الموز الاخضر (Banana)', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (161, 'أرز أبيض', 'الحبوب والبذور', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (162, 'باذنجان مقلي', 'الخضروات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (163, 'بطيخ', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (164, 'بيض مقلي', 'منتجات البيض', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (165, 'توست السن', 'المخبوزات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (166, 'جبن فيتا', 'الاجبان', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (167, 'حلاوة طحينية', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (168, 'خبز قمح كامل', 'المخبوزات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (169, 'شوربة كريمة دجاج', 'الشوربات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (170, 'شوربة لسان عصفور', 'الشوربات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (171, 'شوفان مطبوخ', 'الحبوب والبذور', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (172, 'عسل أبيض', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (173, 'عسل أسود', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (174, 'فلافل', 'البقوليات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (175, 'لانشون بقري', 'اللحوم', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (176, 'لانشون دجاج', 'اللحوم', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (177, 'مربى', 'السكريات والحلويات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (178, 'معكرونة مسلوقة', 'المكرونات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (179, 'مكرونة', 'المكرونات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (180, 'البلح', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (181, 'التين البرشومي', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (182, 'الكرز', 'الفواكه', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (183, 'جبن كامل الدسم', 'الاجبان', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (184, 'اللحوم الدهنية', 'اللحوم', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (185, 'المعكرونة الكاملة', 'المكرونات', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (186, 'صيادية السمك', 'الأسماك', 'أطعمة مسموحة بكميات قليلة');
INSERT INTO food_types (id, name, type, class) VALUES (187, 'البسكويت (Crackers)', 'سناكس', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (188, 'البيتزا (Pizza)', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (189, 'الخبز الأبيض', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (190, 'السكر الأبيض (White Sugar)', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (191, 'الكرواسون (Croissant)', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (192, 'الكورن فليكس (Corn Flakes)', 'الحبوب والبذور', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (193, 'باتون ساليه', 'سناكس', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (194, 'باتيه سادة', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (195, 'توست أبيض', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (196, 'جبن اسطنبولي', 'الاجبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (197, 'جبن الشيدر', 'الاجبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (198, 'جبن المثلثات', 'الاجبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (199, 'جبن رومي', 'الاجبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (200, 'جبن موتزاريلا', 'الاجبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (201, 'خبز بلدي', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (202, 'خبز شامي', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (203, 'خبز فينو', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (204, 'رغيف خبز ابيض', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (205, 'سمك مقلي', 'الأسماك', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (206, 'طبق كشري', 'المكرونات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (207, 'فطير مشلتت', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (208, 'كورن فليكس', 'الحبوب والبذور', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (209, 'معكرونة من الدقيق الأبيض', 'المكرونات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (210, 'الزبادي المحلّى كامل الدسم', 'منتجات الالبان', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (211, 'الفواكة المجففة', 'الفواكه', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (212, 'العصائر المركزة', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (213, 'الزبيب', 'الفواكه', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (214, 'المشمش المجفف', 'الفواكه', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (215, 'الصودا', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (216, 'مشروبات الطاقة', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (217, 'المشروبات الغازية', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (218, 'عصير محلي بالسكر', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (219, 'البيبسي', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (220, 'شاي محلي بالسكر', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (221, 'قهوة محلاة بالسكر', 'المشروبات والعصائر', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (222, 'الحلويات الغربية', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (223, 'الآيس كريم', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (224, 'الشوكولاتة المحلّاة بالسكر', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (225, 'المعجنات', 'المقبلات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (226, 'بقلاوة', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (227, 'كنافة', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (228, 'قطايف', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (229, 'الدوناتس', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (230, 'الكعك المحلّى', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (231, 'البسكويت المحلّى', 'السكريات والحلويات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (232, 'الأطعمة المعلبة', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (233, 'الأطعمة المصنعة', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (234, 'الشوربات المعلبة', 'الشوربات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (235, 'الصلصات الجاهزة', 'الأعشاب والتوابل', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (236, 'الوجبات المجمدة', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (237, 'الشيبسي', 'سناكس', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (238, 'اللحوم المدخنة', 'اللحوم', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (239, 'الوجبات السريعة', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (240, 'اللحوم المعلبة', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (241, 'المارغرين الصلب', 'الزيوت والدهون', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (242, 'مخبوزات تحتوي على زيوت مهدرجة', 'المخبوزات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (243, 'الأطعمة المقلية', 'اخري', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (244, 'البطاطس المقلية', 'الخضروات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (245, 'الدجاج المقلي', 'اللحوم', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (246, 'نقانق الدجاج', 'اللحوم', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (247, 'سمبوسك', 'المقبلات', 'أطعمة ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (248, 'الزبادي اليوناني مع التوت', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (249, 'بيض مسلوق', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (250, 'مكسرات غير مملحة', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (251, 'فشار بدون إضافات', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (252, 'شرائح تفاح مع زبدة الفول السوداني', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (253, 'خضروات طازجة مع حمص', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (254, 'جبن قريش مع شرائح الطماطم', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (255, 'بودينج بذور الشيا', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (256, 'شرائح خيار مع جبن قليل الدسم', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (257, 'سلطة ورقيات خضراء', 'سناكس', 'سناكات مسموحة');
INSERT INTO food_types (id, name, type, class) VALUES (258, 'الكعك المحلى', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (259, 'رقائق البطاطس (الشيبسي)', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (260, 'بسكويت الشوكولاتة', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (261, 'حبوب الإفطار السكرية', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (262, 'المشروبات الغازية والعصائر المحلاة', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (263, 'المعجنات المحلاة', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (264, 'الحلويات الشرقية', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (265, 'الآيس كريم', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (266, 'الفواكه المجففة', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (267, 'الزبادي المحلى والمنكّه', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (268, 'الشوكولاتة بالحليب', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (269, 'المخبوزات التجارية', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (270, 'المقرمشات المملحة', 'سناكس', 'سناكات ممنوعة');
INSERT INTO food_types (id, name, type, class) VALUES (271, 'الحلويات الجيلاتينية', 'سناكس', 'سناكات ممنوعة');

-- Table: sukarak_coupons
DROP TABLE IF EXISTS sukarak_coupons;
CREATE TABLE sukarak_coupons (
	id INTEGER NOT NULL, 
	coupon VARCHAR(255) NOT NULL, 
	discount NUMERIC(5, 2), 
	reusable INTEGER, 
	users TEXT, 
	max_uses INTEGER, 
	active BOOLEAN, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_coupons (id, coupon, discount, reusable, users, max_uses, active, created_at) VALUES (1, 'NEW50', 50, 0, '[]', 0, 1, '2026-02-12 09:47:53');

-- Table: sukarak_gift_cards
DROP TABLE IF EXISTS sukarak_gift_cards;
CREATE TABLE sukarak_gift_cards (
	id INTEGER NOT NULL, 
	order_id INTEGER NOT NULL, 
	code VARCHAR(20) NOT NULL, 
	status INTEGER, 
	used INTEGER, 
	activated_at DATETIME, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES sukarak_orders (id)
);

-- Table: sukarak_loyality_users
DROP TABLE IF EXISTS sukarak_loyality_users;
CREATE TABLE sukarak_loyality_users (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	subscription_type VARCHAR(50) NOT NULL, 
	start_date DATE NOT NULL, 
	end_date DATE NOT NULL, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

-- Table: sukarak_seller_notifications
DROP TABLE IF EXISTS sukarak_seller_notifications;
CREATE TABLE sukarak_seller_notifications (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	type VARCHAR(50) NOT NULL, 
	title VARCHAR(255) NOT NULL, 
	message TEXT NOT NULL, 
	related_type VARCHAR(50), 
	related_id INTEGER, 
	is_read BOOLEAN, 
	read_at DATETIME, 
	sent_push BOOLEAN, 
	sent_email BOOLEAN, 
	sent_sms BOOLEAN, 
	priority VARCHAR(20), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (1, 37, 'new_order', 'طلب جديد #SM-2024001', 'لديك طلب جديد من أحمد محمد بقيمة 450 ج.م', 'order', NULL, 0, NULL, 0, 0, 0, 'high', '2026-02-12 11:34:51.075960');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (2, 37, 'new_order', 'طلب جديد #SM-2024005', 'لديك طلب جديد من فاطمة علي بقيمة 280 ج.م', 'order', NULL, 0, NULL, 0, 0, 0, 'high', '2026-02-12 05:34:51.077148');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (3, 37, 'order_delivered', 'تم توصيل الطلب #SM-2024003', 'تم توصيل الطلب بنجاح للعميل خالد إبراهيم', 'order', NULL, 0, NULL, 0, 0, 0, 'medium', '2026-02-11 23:34:51.077195');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (4, 37, 'low_stock', 'تحذير مخزون منخفض', 'المنتج ''كريم ترطيب القدم'' لديه 3 قطع فقط', 'product', NULL, 0, NULL, 0, 0, 0, 'high', '2026-02-11 17:34:51.077220');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (5, 37, 'low_stock', 'تحذير مخزون منخفض', 'المنتج ''ميزان ذكي'' لديه قطعتين فقط', 'product', NULL, 0, NULL, 0, 0, 0, 'medium', '2026-02-11 11:34:51.077241');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (6, 37, 'payment_received', 'تم استلام دفعة', 'تم إيداع 1,250 ج.م في محفظتك', 'wallet', NULL, 1, NULL, 0, 0, 0, 'medium', '2026-02-11 05:34:51.077262');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (7, 37, 'new_review', 'تقييم جديد ⭐⭐⭐⭐⭐', 'أحمد محمد قيّم جهاز قياس السكر بـ 5 نجوم', 'product', NULL, 1, NULL, 0, 0, 0, 'low', '2026-02-10 23:34:51.077282');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (8, 37, 'order_shipped', 'تم شحن الطلب #SM-2024007', 'تم تسليم الطلب لشركة الشحن', 'order', NULL, 1, NULL, 0, 0, 0, 'medium', '2026-02-10 17:34:51.077302');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (9, 37, 'new_order', 'طلب جديد #SM-2024010', 'لديك طلب جديد من نورة سعيد بقيمة 185 ج.م', 'order', NULL, 1, NULL, 0, 0, 0, 'high', '2026-02-10 11:34:51.077321');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (10, 37, 'order_cancelled', 'طلب ملغي #SM-2024013', 'تم إلغاء الطلب من قبل العميل يوسف حسن', 'order', NULL, 1, NULL, 0, 0, 0, 'medium', '2026-02-10 05:34:51.077340');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (11, 67, 'order_shipped', 'تحديث طلبك #SM-2024003', 'تم تحديث حالة طلبك إلى: تم الشحن', 'order', 46, 0, NULL, 0, 0, 0, 'medium', '2026-02-12 11:40:09');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (12, 67, 'order_delivered', 'تحديث طلبك #SM-2024003', 'تم تحديث حالة طلبك إلى: تم التوصيل', 'order', 46, 0, NULL, 0, 0, 0, 'medium', '2026-02-12 11:40:12');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (13, 66, 'order_delivered', 'تحديث طلبك #SM-2024006', 'تم تحديث حالة طلبك إلى: تم التوصيل', 'order', 49, 0, NULL, 0, 0, 0, 'medium', '2026-02-12 12:10:58');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (14, 66, 'order_delivered', 'تحديث طلبك #SM-2024006', 'تم تحديث حالة طلبك إلى: تم التوصيل', 'order', 49, 0, NULL, 0, 0, 0, 'medium', '2026-02-12 12:10:58');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (15, 66, 'order_delivered', 'تحديث طلبك #SM-2024006', 'تم تحديث حالة طلبك إلى: تم التوصيل', 'order', 49, 0, NULL, 0, 0, 0, 'medium', '2026-02-12 12:10:58');
INSERT INTO sukarak_seller_notifications (id, user_id, type, title, message, related_type, related_id, is_read, read_at, sent_push, sent_email, sent_sms, priority, created_at) VALUES (16, 52, 'order_processing', 'تحديث طلبك #ORD-B71FDC24', 'تم تحديث حالة طلبك إلى: قيد التجهيز', 'order', 65, 0, NULL, 0, 0, 0, 'medium', '2026-02-13 16:29:30');

-- Table: sukarak_order_status_history
DROP TABLE IF EXISTS sukarak_order_status_history;
CREATE TABLE sukarak_order_status_history (
	id INTEGER NOT NULL, 
	order_id INTEGER NOT NULL, 
	old_status VARCHAR(50), 
	new_status VARCHAR(50) NOT NULL, 
	changed_by_user_id INTEGER, 
	changed_by_role VARCHAR(20), 
	notes TEXT, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES sukarak_orders (id), 
	FOREIGN KEY(changed_by_user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (1, 44, 'pending', 'confirmed', 37, 'seller', 'تحديث تلقائي', '2026-01-15 08:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (2, 45, 'pending', 'confirmed', 37, 'seller', 'تحديث تلقائي', '2026-01-09 17:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (3, 46, 'pending', 'processing', 37, 'seller', 'تحديث تلقائي', '2026-02-07 16:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (4, 47, 'pending', 'processing', 37, 'seller', 'تحديث تلقائي', '2026-01-02 21:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (5, 48, 'pending', 'shipped', 37, 'seller', 'تحديث تلقائي', '2026-01-09 14:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (6, 49, 'pending', 'shipped', 37, 'seller', 'تحديث تلقائي', '2026-02-07 14:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (7, 50, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2026-01-30 03:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (8, 51, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2025-12-23 01:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (9, 52, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2026-01-07 23:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (10, 53, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2025-12-26 09:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (11, 54, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2025-12-30 23:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (12, 55, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2025-12-21 00:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (13, 56, 'pending', 'cancelled', 37, 'seller', 'تحديث تلقائي', '2025-12-15 12:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (14, 57, 'pending', 'delivered', 37, 'seller', 'تحديث تلقائي', '2025-12-21 03:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (15, 58, 'pending', 'processing', 37, 'seller', 'تحديث تلقائي', '2026-01-31 01:34:50.968194');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (16, 46, 'processing', 'shipped', 37, 'seller', NULL, '2026-02-12 11:40:09');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (17, 46, 'shipped', 'delivered', 37, 'seller', NULL, '2026-02-12 11:40:12');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (18, 49, 'shipped', 'delivered', 37, 'seller', NULL, '2026-02-12 12:10:58');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (19, 49, 'shipped', 'delivered', 37, 'seller', NULL, '2026-02-12 12:10:58');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (20, 49, 'shipped', 'delivered', 37, 'seller', NULL, '2026-02-12 12:10:58');
INSERT INTO sukarak_order_status_history (id, order_id, old_status, new_status, changed_by_user_id, changed_by_role, notes, created_at) VALUES (21, 65, 'confirmed', 'processing', 37, 'seller', NULL, '2026-02-13 16:29:30');

-- Table: sukarak_order_returns
DROP TABLE IF EXISTS sukarak_order_returns;
CREATE TABLE sukarak_order_returns (
	id INTEGER NOT NULL, 
	order_id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	seller_id INTEGER NOT NULL, 
	return_number VARCHAR(50) NOT NULL, 
	type VARCHAR(20) NOT NULL, 
	status VARCHAR(30), 
	reason VARCHAR(50) NOT NULL, 
	reason_details TEXT, 
	items TEXT, 
	refund_amount NUMERIC(10, 2), 
	refund_method VARCHAR(50), 
	approved_at DATETIME, 
	rejected_at DATETIME, 
	rejection_reason TEXT, 
	completed_at DATETIME, 
	attachments TEXT, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(order_id) REFERENCES sukarak_orders (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id), 
	FOREIGN KEY(seller_id) REFERENCES sukarak_users (id), 
	UNIQUE (return_number)
);

INSERT INTO sukarak_order_returns (id, order_id, user_id, seller_id, return_number, type, status, reason, reason_details, items, refund_amount, refund_method, approved_at, rejected_at, rejection_reason, completed_at, attachments, created_at, updated_at) VALUES (1, 50, 66, 37, 'RET-0001', 'refund', 'requested', 'defective', 'الجهاز لا يعطي قراءات دقيقة', '[{"product_name": "جهاز قياس السكر الذكي", "quantity": 1}]', 350, NULL, NULL, NULL, NULL, NULL, NULL, '2026-02-09 11:34:51.107209', '2026-02-12 11:34:51');

-- Table: sukarak_seller_wallet
DROP TABLE IF EXISTS sukarak_seller_wallet;
CREATE TABLE sukarak_seller_wallet (
	id INTEGER NOT NULL, 
	seller_id INTEGER NOT NULL, 
	available_balance NUMERIC(10, 2), 
	pending_balance NUMERIC(10, 2), 
	total_earned NUMERIC(10, 2), 
	total_withdrawn NUMERIC(10, 2), 
	bank_name VARCHAR(100), 
	account_number VARCHAR(100), 
	account_name VARCHAR(100), 
	iban VARCHAR(100), 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	UNIQUE (seller_id), 
	FOREIGN KEY(seller_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_seller_wallet (id, seller_id, available_balance, pending_balance, total_earned, total_withdrawn, bank_name, account_number, account_name, iban, updated_at) VALUES (1, 65, 0, 0, 0, 0, NULL, NULL, NULL, NULL, '2026-02-12 11:22:24');
INSERT INTO sukarak_seller_wallet (id, seller_id, available_balance, pending_balance, total_earned, total_withdrawn, bank_name, account_number, account_name, iban, updated_at) VALUES (2, 37, 4750, 1200, 12500, 6550, 'البنك الأهلي المصري', '1234567890', 'شوقي', 'EG380019000500000001234567890', '2026-02-12 11:34:51');

-- Table: sukarak_wallet_transactions
DROP TABLE IF EXISTS sukarak_wallet_transactions;
CREATE TABLE sukarak_wallet_transactions (
	id INTEGER NOT NULL, 
	seller_id INTEGER NOT NULL, 
	order_id INTEGER, 
	type VARCHAR(30) NOT NULL, 
	amount NUMERIC(10, 2) NOT NULL, 
	description TEXT, 
	status VARCHAR(20), 
	balance_after NUMERIC(10, 2), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(seller_id) REFERENCES sukarak_users (id), 
	FOREIGN KEY(order_id) REFERENCES sukarak_orders (id)
);

INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (1, 37, NULL, 'credit', 1250, 'إيداع من طلب #SM-2024007', 'completed', 6000, '2026-01-31 07:34:51.087817');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (2, 37, NULL, 'credit', 850, 'إيداع من طلب #SM-2024008', 'completed', 6850, '2026-02-01 04:34:51.087898');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (3, 37, NULL, 'commission', 125, 'عمولة المنصة 10%', 'completed', 6725, '2026-02-02 06:34:51.087928');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (4, 37, NULL, 'credit', 450, 'إيداع من طلب #SM-2024009', 'completed', 7175, '2026-02-03 07:34:51.087951');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (5, 37, NULL, 'withdrawal', 2000, 'سحب إلى البنك الأهلي', 'completed', 5175, '2026-02-04 08:34:51.087972');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (6, 37, NULL, 'credit', 680, 'إيداع من طلب #SM-2024010', 'completed', 5855, '2026-02-05 08:34:51.087993');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (7, 37, NULL, 'credit', 350, 'إيداع من طلب #SM-2024011', 'completed', 6205, '2026-02-06 04:34:51.088012');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (8, 37, NULL, 'commission', 103, 'عمولة المنصة 10%', 'completed', 6102, '2026-02-07 11:34:51.088032');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (9, 37, NULL, 'withdrawal', 1500, 'سحب إلى البنك الأهلي', 'completed', 4602, '2026-02-07 23:34:51.088051');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (10, 37, NULL, 'credit', 920, 'إيداع من طلب #SM-2024012', 'completed', 5522, '2026-02-09 04:34:51.088070');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (11, 37, NULL, 'refund', 280, 'إرجاع طلب #SM-2024013', 'completed', 5242, '2026-02-10 02:34:51.088090');
INSERT INTO sukarak_wallet_transactions (id, seller_id, order_id, type, amount, description, status, balance_after, created_at) VALUES (12, 37, NULL, 'credit', 1100, 'إيداع من طلب #SM-2024014', 'completed', 6342, '2026-02-11 08:34:51.088114');

-- Table: sukarak_withdrawal_requests
DROP TABLE IF EXISTS sukarak_withdrawal_requests;
CREATE TABLE sukarak_withdrawal_requests (
	id INTEGER NOT NULL, 
	seller_id INTEGER NOT NULL, 
	request_number VARCHAR(50) NOT NULL, 
	amount NUMERIC(10, 2) NOT NULL, 
	bank_name VARCHAR(100), 
	account_number VARCHAR(100), 
	account_name VARCHAR(100), 
	iban VARCHAR(100), 
	status VARCHAR(20), 
	approved_by INTEGER, 
	approved_at DATETIME, 
	processed_at DATETIME, 
	rejection_reason TEXT, 
	transfer_reference VARCHAR(100), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(seller_id) REFERENCES sukarak_users (id), 
	UNIQUE (request_number), 
	FOREIGN KEY(approved_by) REFERENCES sukarak_users (id)
);

-- Table: sukarak_seller_settings
DROP TABLE IF EXISTS sukarak_seller_settings;
CREATE TABLE sukarak_seller_settings (
	id INTEGER NOT NULL, 
	seller_id INTEGER NOT NULL, 
	store_name VARCHAR(255), 
	store_description TEXT, 
	store_logo VARCHAR(512), 
	store_banner VARCHAR(512), 
	business_phone VARCHAR(50), 
	business_email VARCHAR(255), 
	business_address TEXT, 
	working_hours TEXT, 
	commission_rate NUMERIC(5, 2), 
	notify_new_order BOOLEAN, 
	notify_order_status BOOLEAN, 
	notify_low_stock BOOLEAN, 
	notify_reviews BOOLEAN, 
	notify_email BOOLEAN, 
	notify_sms BOOLEAN, 
	auto_confirm_orders BOOLEAN, 
	low_stock_threshold INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	UNIQUE (seller_id), 
	FOREIGN KEY(seller_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_seller_settings (id, seller_id, store_name, store_description, store_logo, store_banner, business_phone, business_email, business_address, working_hours, commission_rate, notify_new_order, notify_order_status, notify_low_stock, notify_reviews, notify_email, notify_sms, auto_confirm_orders, low_stock_threshold, created_at, updated_at) VALUES (1, 65, 'محمد البائع', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 10, 1, 1, 1, 1, 1, 0, 0, 5, '2026-02-12 11:22:34', '2026-02-12 11:22:34');
INSERT INTO sukarak_seller_settings (id, seller_id, store_name, store_description, store_logo, store_banner, business_phone, business_email, business_address, working_hours, commission_rate, notify_new_order, notify_order_status, notify_low_stock, notify_reviews, notify_email, notify_sms, auto_confirm_orders, low_stock_threshold, created_at, updated_at) VALUES (2, 37, 'صيدلية سُكّرك مضبوط', 'متجر متخصص في مستلزمات مرضى السكري - أجهزة قياس، مكملات غذائية، منتجات عناية', NULL, NULL, '01012345678', 'store@sukarak.com', 'القاهرة، مصر - شارع التحرير', NULL, 10, 1, 1, 1, 1, 1, 1, 0, 5, '2026-02-12 11:34:51', '2026-02-12 11:47:18');

-- Table: sukarak_membership_cards
DROP TABLE IF EXISTS sukarak_membership_cards;
CREATE TABLE sukarak_membership_cards (
	id INTEGER NOT NULL, 
	card_type VARCHAR(50) NOT NULL, 
	name_ar VARCHAR(255) NOT NULL, 
	name_en VARCHAR(255) NOT NULL, 
	price_eg FLOAT, 
	price_sa FLOAT, 
	price_ae FLOAT, 
	price_om FLOAT, 
	price_other FLOAT, 
	features_ar TEXT, 
	features_en TEXT, 
	discount_percent INTEGER, 
	icon VARCHAR(10), 
	active BOOLEAN, 
	sort_order INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	UNIQUE (card_type)
);

INSERT INTO sukarak_membership_cards (id, card_type, name_ar, name_en, price_eg, price_sa, price_ae, price_om, price_other, features_ar, features_en, discount_percent, icon, active, sort_order, created_at) VALUES (1, 'silver', 'البطاقة الفضية', 'Silver Card', 1470.0, 115.0, 110.0, 11.0, 30.0, '["خصم 5% على الخدمات المدفوعة", "اشتراك مجاني بالكورسات المجانية", "تنبيهات ومتابعة دورية", "نقاط تحفيزية على كل عملية شراء"]', '["5% discount on paid services", "Free access to free courses", "Periodic alerts and follow-ups", "Reward points on every purchase"]', 5, '⭐', 1, 1, '2026-02-12 18:18:19');
INSERT INTO sukarak_membership_cards (id, card_type, name_ar, name_en, price_eg, price_sa, price_ae, price_om, price_other, features_ar, features_en, discount_percent, icon, active, sort_order, created_at) VALUES (2, 'gold', 'البطاقة الذهبية', 'Gold Card', 2450.0, 189.0, 184.0, 19.0, 50.0, '["خصم 10% على الخدمات المدفوعة", "اشتراك مجاني بجميع الكورسات المدفوعة", "نسخة مجانية من الدليل الشامل لمرضى السكري", "نقاط تحفيزية على كل عملية شراء أو دعوة"]', '["10% discount on paid services", "Free access to all paid courses", "Free copy of Diabetes Comprehensive Guide", "Reward points on every purchase or referral"]', 10, '👑', 1, 2, '2026-02-12 18:18:19');
INSERT INTO sukarak_membership_cards (id, card_type, name_ar, name_en, price_eg, price_sa, price_ae, price_om, price_other, features_ar, features_en, discount_percent, icon, active, sort_order, created_at) VALUES (3, 'platinum', 'البطاقة البلاتينية', 'Platinum Card', 4900.0, 349.0, 340.0, 35.0, 90.0, '["خصم 15% على جميع الخدمات", "جميع مزايا البطاقة الذهبية", "استشارة طبية شهرية مجانية", "أولوية في حجز المواعيد", "دعم فني مخصص 24/7"]', '["15% discount on all services", "All Gold Card benefits", "Free monthly medical consultation", "Priority appointment booking", "Dedicated 24/7 support"]', 15, '💎', 1, 3, '2026-02-12 18:18:19');

-- Table: sukarak_user_memberships
DROP TABLE IF EXISTS sukarak_user_memberships;
CREATE TABLE sukarak_user_memberships (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	card_type VARCHAR(50) NOT NULL, 
	start_date VARCHAR(20) NOT NULL, 
	end_date VARCHAR(20) NOT NULL, 
	amount_paid FLOAT, 
	currency VARCHAR(10), 
	payment_method VARCHAR(50), 
	status VARCHAR(20), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (1, 1, 'gold', '2026-02-13', '2027-02-13', 189.0, 'SAR', 'card', 'upgraded', '2026-02-13 00:14:01');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (2, 1, 'silver', '2026-02-13', '2027-02-13', 115.0, 'SAR', 'card', 'active', '2026-02-13 00:14:40');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (3, 71, 'silver', '2026-02-13', '2027-02-13', 115.0, 'SAR', 'admin_manual', 'active', '2026-02-13 14:31:16');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (4, 52, 'silver', '2026-02-01', '2026-05-01', 115.0, 'SAR', 'card', 'active', '2026-02-13 22:58:11');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (5, 55, 'gold', '2026-01-15', '2027-01-15', 189.0, 'SAR', 'card', 'active', '2026-02-13 22:58:18');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (6, 57, 'platinum', '2026-02-10', '2027-02-10', 349.0, 'SAR', 'bank_transfer', 'active', '2026-02-13 22:58:18');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (7, 62, 'silver', '2025-12-01', '2026-03-01', 115.0, 'SAR', 'card', 'expired', '2026-02-13 22:58:18');
INSERT INTO sukarak_user_memberships (id, user_id, card_type, start_date, end_date, amount_paid, currency, payment_method, status, created_at) VALUES (8, 63, 'gold', '2026-02-05', '2027-02-05', 189.0, 'SAR', 'card', 'active', '2026-02-13 22:58:18');

-- Table: sukarak_social_links
DROP TABLE IF EXISTS sukarak_social_links;
CREATE TABLE sukarak_social_links (
	id INTEGER NOT NULL, 
	platform VARCHAR(50) NOT NULL, 
	name_ar VARCHAR(100) NOT NULL, 
	name_en VARCHAR(100) NOT NULL, 
	url VARCHAR(1024) NOT NULL, 
	icon VARCHAR(10), 
	color VARCHAR(100), 
	active BOOLEAN, 
	sort_order INTEGER, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_social_links (id, platform, name_ar, name_en, url, icon, color, active, sort_order) VALUES (1, 'facebook', 'فيسبوك', 'Facebook', 'https://www.facebook.com/share/1AgTgtA3HT/', '📘', 'from-blue-600 to-blue-800', 1, 1);
INSERT INTO sukarak_social_links (id, platform, name_ar, name_en, url, icon, color, active, sort_order) VALUES (2, 'tiktok', 'تيك توك', 'TikTok', 'https://www.tiktok.com/@diabetes.association?_t=ZS-8wKcU9b9teJ&_r=1', '🎵', 'from-gray-800 to-black', 1, 2);
INSERT INTO sukarak_social_links (id, platform, name_ar, name_en, url, icon, color, active, sort_order) VALUES (3, 'youtube', 'يوتيوب', 'YouTube', 'https://youtube.com/@diabetes.association?si=zkByS6yV9g5UST6L', '📺', 'from-red-500 to-red-700', 1, 3);
INSERT INTO sukarak_social_links (id, platform, name_ar, name_en, url, icon, color, active, sort_order) VALUES (4, 'instagram', 'إنستاجرام', 'Instagram', 'https://www.instagram.com/diabetes.association?igsh=MXRuc3prYzF6YXVhYw==', '📷', 'from-pink-500 to-orange-400', 1, 4);
INSERT INTO sukarak_social_links (id, platform, name_ar, name_en, url, icon, color, active, sort_order) VALUES (5, 'snapchat', 'سناب شات', 'Snapchat', 'https://www.snapchat.com/add/diabetes.care?share_id=djbd5DKCDEs&locale=en-US', '👻', 'from-yellow-300 to-yellow-500', 1, 5);

-- Table: sukarak_blog_courses
DROP TABLE IF EXISTS sukarak_blog_courses;
CREATE TABLE sukarak_blog_courses (
	id INTEGER NOT NULL, 
	title_ar VARCHAR(255) NOT NULL, 
	title_en VARCHAR(255), 
	description_ar TEXT, 
	description_en TEXT, 
	url VARCHAR(1024) NOT NULL, 
	icon VARCHAR(10), 
	platform VARCHAR(50), 
	active BOOLEAN, 
	sort_order INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_blog_courses (id, title_ar, title_en, description_ar, description_en, url, icon, platform, active, sort_order, created_at) VALUES (1, 'الكورس التثقيفي لمرضى السكري', 'Diabetes Education Course', 'تعلم كيفية إدارة السكري بشكل صحيح وآمن', 'Learn how to manage diabetes safely', 'https://www.udemy.com/course/jnihfygs/?referralCode=476E1EE82187F2E00EEF', '🎯', 'udemy', 1, 1, '2026-02-12 18:18:19');
INSERT INTO sukarak_blog_courses (id, title_ar, title_en, description_ar, description_en, url, icon, platform, active, sort_order, created_at) VALUES (2, 'الكورس الاحترافي في إدارة الوزن', 'Professional Weight Management', 'استراتيجيات متقدمة للتحكم في الوزن', 'Advanced strategies for weight control', 'https://www.udemy.com/course/nnfltkmz/?referralCode=2E4181B9FFC242803EAA', '⚖️', 'udemy', 1, 2, '2026-02-12 18:18:19');
INSERT INTO sukarak_blog_courses (id, title_ar, title_en, description_ar, description_en, url, icon, platform, active, sort_order, created_at) VALUES (3, 'دبلوم التغذية الرياضية', 'Sports Nutrition Diploma', 'التغذية المثلى للرياضيين ومرضى السكري', 'Optimal nutrition for athletes and diabetics', 'https://www.udemy.com/course/sports-nutrition-diploma/?referralCode=90261B91A42EFA1C92EC', '🏃', 'udemy', 1, 3, '2026-02-12 18:18:19');

-- Table: sukarak_book_links
DROP TABLE IF EXISTS sukarak_book_links;
CREATE TABLE sukarak_book_links (
	id INTEGER NOT NULL, 
	book_title_ar VARCHAR(255) NOT NULL, 
	book_title_en VARCHAR(255), 
	country_code VARCHAR(5) NOT NULL, 
	country_name_ar VARCHAR(100), 
	country_name_en VARCHAR(100), 
	url VARCHAR(1024) NOT NULL, 
	flag_emoji VARCHAR(10), 
	active BOOLEAN, 
	sort_order INTEGER, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_book_links (id, book_title_ar, book_title_en, country_code, country_name_ar, country_name_en, url, flag_emoji, active, sort_order) VALUES (1, 'الدليل الشامل لمرضى السكري', 'Diabetes Comprehensive Guide', 'EG', 'مصر', 'Egypt', 'https://www.noon.com/en-eg/the-full-guide-of-diabetic/ZA91BBE2697E918F3CB87Z/p?utm_source=C1000094L&utm_medium=referral&sId=27e75884-9056-4fb8-8aef-b38b326cbeb2', '🇪🇬', 1, 1);
INSERT INTO sukarak_book_links (id, book_title_ar, book_title_en, country_code, country_name_ar, country_name_en, url, flag_emoji, active, sort_order) VALUES (2, 'الدليل الشامل لمرضى السكري', 'Diabetes Comprehensive Guide', 'SA', 'السعودية', 'Saudi Arabia', 'https://www.noon.com/en-sa/the-comprehensive-guide-for-diabetics-part-one-written-by-muhammad-al-nakrashi/Z7D1C1BAFFA88E53EE538Z/p?utm_source=C1000094L&utm_medium=referral&sId=6cc41ea8-7f88-48b2-b22e-b46df86deaad', '🇸🇦', 1, 2);
INSERT INTO sukarak_book_links (id, book_title_ar, book_title_en, country_code, country_name_ar, country_name_en, url, flag_emoji, active, sort_order) VALUES (3, 'الدليل الشامل لمرضى السكري', 'Diabetes Comprehensive Guide', 'AE', 'الإمارات', 'UAE', 'https://www.noon.com/en-ae/the-comprehensive-guide-for-diabetics-part-one-by-muhammad-al-nakrashi/Z6FA759FA31F83B3D99E4Z/p?utm_source=C1000094L&utm_medium=referral&sId=33c32f7d-d1b1-47b2-960d-5017d1b911db', '🇦🇪', 1, 3);
INSERT INTO sukarak_book_links (id, book_title_ar, book_title_en, country_code, country_name_ar, country_name_en, url, flag_emoji, active, sort_order) VALUES (4, 'الدليل الشامل لمرضى السكري', 'Diabetes Comprehensive Guide', 'JARIR', 'مكتبات جرير', 'Jarir Bookstores', 'https://www.jarir.com/default-category/arabic-books-643167.html', '📚', 1, 4);

-- Table: sukarak_medical_profiles
DROP TABLE IF EXISTS sukarak_medical_profiles;
CREATE TABLE sukarak_medical_profiles (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	is_smoker BOOLEAN, 
	daily_exercise BOOLEAN, 
	diabetes_type VARCHAR(50), 
	medications TEXT, 
	meals_per_day INTEGER, 
	allergies TEXT, 
	medical_notes TEXT, 
	attachments TEXT, 
	updated_at DATETIME, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	UNIQUE (user_id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

-- Table: sukarak_consultation_packages
DROP TABLE IF EXISTS sukarak_consultation_packages;
CREATE TABLE sukarak_consultation_packages (
	id INTEGER NOT NULL, 
	name_ar VARCHAR(255) NOT NULL, 
	name_en VARCHAR(255), 
	description_ar TEXT, 
	description_en TEXT, 
	features_ar TEXT, 
	features_en TEXT, 
	price_eg FLOAT, 
	price_sa FLOAT, 
	price_ae FLOAT, 
	price_om FLOAT, 
	price_other FLOAT, 
	duration VARCHAR(100), 
	icon VARCHAR(10), 
	is_giftable BOOLEAN, 
	active BOOLEAN, 
	sort_order INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id)
);

INSERT INTO sukarak_consultation_packages (id, name_ar, name_en, description_ar, description_en, features_ar, features_en, price_eg, price_sa, price_ae, price_om, price_other, duration, icon, is_giftable, active, sort_order, created_at) VALUES (1, 'استشارة طبية', 'Medical Consultation', 'استشارة مع الدكتور محمد النقراشي', 'Consultation with Dr. Mohamed El-Nakrashi', '["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي"]', '["Private session", "Program requirements", "Treatment review"]', 490.0, 39.0, 37.0, 4.0, 10.0, 'جلسة واحدة', '🩺', 0, 1, 1, '2026-02-12 18:18:19');
INSERT INTO sukarak_consultation_packages (id, name_ar, name_en, description_ar, description_en, features_ar, features_en, price_eg, price_sa, price_ae, price_om, price_other, duration, icon, is_giftable, active, sort_order, created_at) VALUES (2, 'نظام غذائي مخصص', 'Custom Diet Plan', 'نظام غذائي مخصص حسب حالتك', 'Customized diet plan for your condition', '["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام الغذائي والرياضي"]', '["Private session", "Program requirements", "Diet & sports review"]', 1470.0, 115.0, 110.0, 11.0, 30.0, 'شهر واحد', '🥗', 1, 1, 2, '2026-02-12 18:18:19');
INSERT INTO sukarak_consultation_packages (id, name_ar, name_en, description_ar, description_en, features_ar, features_en, price_eg, price_sa, price_ae, price_om, price_other, duration, icon, is_giftable, active, sort_order, created_at) VALUES (3, 'باقة المتابعة الأساسية', 'Basic Follow-up Package', 'متابعة دورية أساسية', 'Basic periodic follow-up', '["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي", "مراجعة النظام الغذائي والرياضي"]', '["Private session", "Program requirements", "Treatment review", "Diet & sports review"]', 1960.0, 150.0, 147.0, 15.0, 40.0, 'شهر واحد', '📋', 1, 1, 3, '2026-02-12 18:18:19');
INSERT INTO sukarak_consultation_packages (id, name_ar, name_en, description_ar, description_en, features_ar, features_en, price_eg, price_sa, price_ae, price_om, price_other, duration, icon, is_giftable, active, sort_order, created_at) VALUES (4, 'باقة المتابعة الشاملة', 'Comprehensive Follow-up', 'رعاية ومتابعة دورية لمدة 3 شهور', 'Care and follow-up for 3 months', '["جلسة خاصة", "تحديد متطلبات البرنامج", "مراجعة النظام العلاجي", "مراجعة النظام الغذائي والرياضي", "رعاية ومتابعة دورية لمدة 3 شهور", "برامج متخصصة وشاملة لجميع الجوانب"]', '["Private session", "Program requirements", "Treatment review", "Diet & sports review", "3-month periodic care", "Comprehensive specialized programs"]', 3920.0, 300.0, 294.0, 30.0, 80.0, '3 شهور', '🏥', 1, 1, 4, '2026-02-12 18:18:19');
INSERT INTO sukarak_consultation_packages (id, name_ar, name_en, description_ar, description_en, features_ar, features_en, price_eg, price_sa, price_ae, price_om, price_other, duration, icon, is_giftable, active, sort_order, created_at) VALUES (5, 'باقة الاشتراك السنوي', 'Annual Subscription', 'اشتراك سنوي شامل', 'Comprehensive annual subscription', '["جلسات خاصة", "برامج متابعة شاملة", "مراجعة دورية على مدار العام"]', '["Private sessions", "Comprehensive follow-up programs", "Year-round periodic reviews"]', 9700.0, 745.0, 727.0, 75.0, 198.0, 'سنة كاملة', '🌟', 1, 1, 5, '2026-02-12 18:18:19');

-- Table: sukarak_user_favorites
DROP TABLE IF EXISTS sukarak_user_favorites;
CREATE TABLE sukarak_user_favorites (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	item_type VARCHAR(50) NOT NULL, 
	item_id INTEGER NOT NULL, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

-- Table: sukarak_user_package_orders
DROP TABLE IF EXISTS sukarak_user_package_orders;
CREATE TABLE sukarak_user_package_orders (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	package_id VARCHAR(50) NOT NULL, 
	package_name VARCHAR(255), 
	amount FLOAT, 
	currency VARCHAR(10), 
	period VARCHAR(100), 
	status VARCHAR(20), 
	payment_method VARCHAR(50), 
	start_date VARCHAR(20), 
	end_date VARCHAR(20), 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (1, 1, 'diet', 'نظام غذائي متكامل', 1470.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-12', '2026-05-13', '2026-02-12 19:16:34');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (2, 1, 'diet', 'نظام غذائي متكامل', 1470.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-12', '2026-05-13', '2026-02-12 19:16:36');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (3, 1, 'diet', 'نظام غذائي متكامل', 1470.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-12', '2026-05-13', '2026-02-12 19:23:21');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (4, 1, 'diet', 'نظام غذائي متكامل', 1470.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-12', '2026-05-13', '2026-02-12 19:23:22');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (5, 1, 'diet', 'نظام غذائي متكامل', 115.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-13', '2026-05-14', '2026-02-13 00:32:46');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (6, 1, 'basic', 'متابعة أساسية', 300.0, 'SAR', 'شهر واحد', 'active', 'direct', '2026-02-13', '2026-03-15', '2026-02-13 00:32:49');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (7, 1, 'basic', 'متابعة أساسية', 300.0, 'SAR', 'شهر واحد', 'active', 'direct', '2026-02-13', '2026-03-15', '2026-02-13 00:33:58');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (8, 1, 'diet', 'نظام غذائي متكامل', 115.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-13', '2026-05-14', '2026-02-13 00:34:04');
INSERT INTO sukarak_user_package_orders (id, user_id, package_id, package_name, amount, currency, period, status, payment_method, start_date, end_date, created_at) VALUES (9, 1, 'diet', 'نظام غذائي متكامل', 115.0, 'SAR', '3 أشهر', 'active', 'direct', '2026-02-13', '2026-05-14', '2026-02-13 00:34:14');

-- Table: medicine_reminders
DROP TABLE IF EXISTS medicine_reminders;
CREATE TABLE medicine_reminders (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	name VARCHAR(255) NOT NULL, 
	dose VARCHAR(255), 
	times TEXT, 
	days TEXT, 
	notes TEXT, 
	active INTEGER, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

-- Table: sukarak_support_tickets
DROP TABLE IF EXISTS sukarak_support_tickets;
CREATE TABLE sukarak_support_tickets (
	id INTEGER NOT NULL, 
	user_id INTEGER NOT NULL, 
	subject VARCHAR(255) NOT NULL, 
	message TEXT NOT NULL, 
	status VARCHAR(50), 
	priority VARCHAR(50), 
	admin_reply TEXT, 
	replied_at DATETIME, 
	created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, closed_at DATETIME, rating INTEGER, rating_comment TEXT, 
	PRIMARY KEY (id), 
	FOREIGN KEY(user_id) REFERENCES sukarak_users (id)
);

INSERT INTO sukarak_support_tickets (id, user_id, subject, message, status, priority, admin_reply, replied_at, created_at, updated_at, closed_at, rating, rating_comment) VALUES (1, 52, 'تجريبي ', 'تجريبي    دعم فني  ', 'closed', 'high', 'تجريبي رد من لوحه الاداره  ', '2026-02-13 16:41:40.302213', '2026-02-13 13:41:12', '2026-02-14 04:54:23', '2026-02-14 07:54:23.416979', NULL, NULL);

-- Table: sukarak_seller_licenses
DROP TABLE IF EXISTS sukarak_seller_licenses;
CREATE TABLE sukarak_seller_licenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    seller_id INTEGER NOT NULL REFERENCES sukarak_users(id),
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(1024) NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    license_type VARCHAR(100),
    license_number VARCHAR(100),
    expiry_date DATETIME,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

COMMIT;
