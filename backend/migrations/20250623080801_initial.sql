-- Add your stuff here
CREATE TABLE intake_forms (
    id TEXT PRIMARY KEY,
    email TEXT,
    submitted_at TEXT,
    reasons_for_therapy TEXT,
    goals_in_therapy TEXT,
    age_group TEXT,
    therapist_knowledge TEXT,
    therapist_gender TEXT,
    session_activeness TEXT
)
