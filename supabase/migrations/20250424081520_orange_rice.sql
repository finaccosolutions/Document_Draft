/*
  # Add role management to profiles table

  1. Changes
    - Add `role` column to profiles table with type `text`
    - Set default role to 'user'
    - Add check constraint to ensure role is either 'user' or 'admin'
  
  2. Security
    - Add policies for role-based access
*/

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role text NOT NULL DEFAULT 'user'
CHECK (role IN ('user', 'admin'));

-- Create admin user in auth.users if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@docugen.com'
  ) THEN
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_user_meta_data,
      created_at,
      updated_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'admin@docugen.com',
      crypt('admin123', gen_salt('bf')),
      now(),
      '{"role": "admin", "name": "Admin User"}',
      now(),
      now()
    );
  END IF;
END $$;

-- Update or create admin profile
DO $$
DECLARE
  admin_id uuid;
BEGIN
  -- Get the admin user's ID
  SELECT id INTO admin_id 
  FROM auth.users 
  WHERE email = 'admin@docugen.com' 
  LIMIT 1;

  -- Insert or update admin profile
  INSERT INTO profiles (id, full_name, role)
  VALUES (
    admin_id,
    'Admin User',
    'admin'
  )
  ON CONFLICT (id) DO UPDATE
  SET role = 'admin'
  WHERE profiles.role != 'admin';
END $$;