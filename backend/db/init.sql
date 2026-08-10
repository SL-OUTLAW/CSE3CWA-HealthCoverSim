-- Create the main quotes table if not already existing
CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT NOT NULL,
    cover_type TEXT NOT NULL CHECK(cover_type IN ('single', 'couple', 'family')),
    applicant1_age INTEGER NOT NULL CHECK(applicant1_age >= 18 AND applicant1_age <= 100),
    applicant1_cover_history TEXT NOT NULL CHECK(applicant1_cover_history IN ('yes', 'no', 'not sure')),
    applicant2_age INTEGER CHECK(applicant2_age >= 18 AND applicant2_age <= 100),
    applicant2_cover_history TEXT CHECK(applicant2_cover_history IN ('yes', 'no', 'not sure')),
    hospital_cover TEXT NOT NULL CHECK(hospital_cover IN ('none', 'basic', 'bronze', 'silver', 'gold')),
    extras_cover TEXT NOT NULL CHECK(extras_cover IN ('none', 'basic', 'standard', 'premium')),
    payment_frequency TEXT NOT NULL CHECK(payment_frequency IN ('monthly', 'yearly')),
    annual_discount REAL DEFAULT 0 CHECK(annual_discount >= 0 AND annual_discount <= 10),
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
