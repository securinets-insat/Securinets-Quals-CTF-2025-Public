-- users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT UNIQUE,
  password TEXT NOT NULL,
  description TEXT DEFAULT 'Administrator account',
  role TEXT DEFAULT 'user'
);

-- messages table
CREATE TABLE IF NOT EXISTS msgs (
  id SERIAL PRIMARY KEY,
  userId INT NOT NULL REFERENCES users(id),
  msg TEXT NOT NULL,
  type TEXT DEFAULT 'general',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- flags table
CREATE TABLE IF NOT EXISTS flags (
  id SERIAL PRIMARY KEY,
  flag TEXT NOT NULL
);

-- logs table
CREATE TABLE IF NOT EXISTS logs (
  id SERIAL PRIMARY KEY,
  userId INT REFERENCES users(id),
  action TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- insert hardcoded flag
INSERT INTO flags (flag)
VALUES ('SecureFlag{239c12b45ff0ff9fbd477bd9e754ed13}');


-- create admin user with password hash (example hash of "admin123" using bcrypt 10 rounds)
-- You need to precompute hash, e.g. using Node:
--   await bcrypt.hash("admin123", 10)
INSERT INTO users (username, password, description, role)
VALUES ('admin', '$2b$10$XXXXXXXXXXXXXXXXXXXXXXXAAXXXXXXXXXXXXXXXXXXXXXAAXXXX', 'This is the admin account', 'admin');


CREATE TABLE IF NOT EXISTS secrets (
  id SERIAL PRIMARY KEY,
  ownerId INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_secrets_ownerId ON secrets(ownerId);