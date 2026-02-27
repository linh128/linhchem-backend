DROP TABLE IF EXISTS res_partner;

CREATE TABLE res_partner (
    id SERIAL PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    dob DATE,

    status VARCHAR(50) DEFAULT 'new'
        CHECK (status IN ('new','active','inactive','blocked')),

    email VARCHAR(255) UNIQUE NOT NULL,

    phone VARCHAR(15),

    password TEXT NOT NULL,

    two_fa_enable BOOLEAN DEFAULT FALSE,

    two_fa_secret TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_res_partner_updated_at
BEFORE UPDATE ON res_partner
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();