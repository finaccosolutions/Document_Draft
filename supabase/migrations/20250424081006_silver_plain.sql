/*
  # Recreate profiles table with admin support

  1. Changes
    - Drop existing profiles table
    - Create new profiles table with role column
    - Set up RLS policies
    - Create trigger for new user profiles

  2. Security
    - Enable RLS
    - Add policies for user and admin access
    - Secure function execution
*/

-- Drop existing trigger first to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop existing function
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop existing table
DROP TABLE IF EXISTS public.profiles;

-- Create new profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create handle_new_user function
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url',
    COALESCE(new.raw_user_meta_data->>'role', 'user')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND role = 'user');

CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin');

-- Create initial admin user if not exists
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Only proceed if admin@docugen.com doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM auth.users 
    WHERE email = 'admin@docugen.com'
  ) THEN
    -- Create admin user
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
    ) RETURNING id INTO admin_user_id;

    -- Create admin profile
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (admin_user_id, 'Admin User', 'admin');
  END IF;
END $$;