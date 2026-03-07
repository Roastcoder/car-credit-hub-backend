-- Create field_permissions table
CREATE TABLE IF NOT EXISTS field_permissions (
  id INTEGER PRIMARY KEY DEFAULT 1,
  permissions JSONB DEFAULT '{}',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT single_row CHECK (id = 1)
);

-- Insert default empty permissions
INSERT INTO field_permissions (id, permissions) 
VALUES (1, '{}') 
ON CONFLICT (id) DO NOTHING;
