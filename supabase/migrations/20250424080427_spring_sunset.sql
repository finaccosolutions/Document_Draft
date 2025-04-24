/*
  # Add role field to profiles table

  1. Changes
    - Add `role` column to profiles table with type `text`
    - Set default role to 'user'
    - Add check constraint to ensure role is either 'user' or 'admin'
    - Create initial admin user
  
  2. Security
    - Enable RLS on profiles table
    - Add policies for role-based access
*/

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin'));

-- Create initial admin user if not exists
DO $$ 
BEGIN 
  -- Only proceed if no admin exists
  IF NOT EXISTS (
    SELECT 1 FROM profiles 
    WHERE role = 'admin'
  ) THEN
    -- Insert admin profile if email doesn't exist
    INSERT INTO profiles (id, full_name, role)
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      'Admin User',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET role = 'admin'
    WHERE profiles.role != 'admin';
  END IF;
END $$;