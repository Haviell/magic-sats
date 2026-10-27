-- Create a table for users (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0,
  in_game_balance NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Create a table for raffles (rounds)
CREATE TABLE IF NOT EXISTS public.raffles (
  id SERIAL PRIMARY KEY,
  round_number INTEGER NOT NULL,
  total_prize NUMERIC NOT NULL,
  ticket_price NUMERIC NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.raffles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Raffles are viewable by everyone."
  ON public.raffles FOR SELECT
  USING ( true );

-- Create a table for tickets
CREATE TABLE IF NOT EXISTS public.tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raffle_id INTEGER REFERENCES public.raffles(id),
  user_id UUID REFERENCES public.profiles(id),
  ticket_number INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.tickets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tickets are viewable by everyone."
  ON public.tickets FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own tickets."
  ON public.tickets FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, balance)
  VALUES (new.id, new.raw_user_meta_data->>'username', 0);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call the function on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
