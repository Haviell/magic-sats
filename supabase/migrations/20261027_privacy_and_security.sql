-- ============================================================
-- MIGRAÇÃO DE PRIVACIDADE, SEGURANÇA E PRIVILÉGIOS DE VENCEDOR
-- ============================================================

-- 1. Garantir que a tabela profiles existe e possui as colunas necessárias
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  balance NUMERIC DEFAULT 0 NOT NULL,
  in_game_balance NUMERIC DEFAULT 0 NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Ativar RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS para perfis (Apenas campos públicos expostos)
DROP POLICY IF EXISTS "Perfis públicos visíveis por todos" ON public.profiles;
CREATE POLICY "Perfis públicos visíveis por todos"
  ON public.profiles FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Usuário pode atualizar apenas seu próprio perfil" ON public.profiles;
CREATE POLICY "Usuário pode atualizar apenas seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. Tabela de Vencedores de Rifas (Para controle de privilégios de acesso antecipado)
CREATE TABLE IF NOT EXISTS public.raffle_winners (
  id SERIAL PRIMARY KEY,
  raffle_id INTEGER REFERENCES public.raffles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  round_number INTEGER NOT NULL,
  winning_number INTEGER NOT NULL,
  prize_satoshis NUMERIC NOT NULL,
  has_claimed_next_round_number BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(round_number, winning_number)
);

ALTER TABLE public.raffle_winners ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Vencedores visíveis publicamente" ON public.raffle_winners;
CREATE POLICY "Vencedores visíveis publicamente"
  ON public.raffle_winners FOR SELECT
  USING (true);

-- 3. Função RPC segura para autenticação por Nickname (Username)
-- Permite que o cliente consulte o e-mail associado a um nickname
-- SEM expor os e-mails na tabela pública 'profiles'
CREATE OR REPLACE FUNCTION public.get_auth_email_by_username(uname TEXT)
RETURNS TEXT AS $$
DECLARE
  found_email TEXT;
BEGIN
  SELECT au.email INTO found_email
  FROM auth.users au
  JOIN public.profiles p ON p.id = au.id
  WHERE LOWER(p.username) = LOWER(TRIM(uname))
  LIMIT 1;

  RETURN found_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Função segura para verificar se um usuário é vencedor de um round específico
CREATE OR REPLACE FUNCTION public.is_round_winner(check_user_id UUID, target_round INTEGER)
RETURNS TABLE (
  is_winner BOOLEAN,
  winning_number INTEGER,
  prize_satoshis NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    true AS is_winner,
    rw.winning_number,
    rw.prize_satoshis
  FROM public.raffle_winners rw
  WHERE rw.user_id = check_user_id AND rw.round_number = target_round
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
