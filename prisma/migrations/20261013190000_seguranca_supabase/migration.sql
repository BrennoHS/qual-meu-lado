-- Segurança para hospedagem no Supabase (inofensivo em qualquer outro PostgreSQL).
--
-- O Supabase publica automaticamente uma API REST (PostgREST) das tabelas do
-- schema "public" para os papéis "anon" e "authenticated". O DOIS LADOS NÃO usa
-- essa API: o site fala com o banco só pelo servidor, via Prisma, com o papel
-- dono das tabelas (que não é afetado por RLS). Por isso:
--   1. ligamos Row Level Security em todas as tabelas, SEM políticas
--      → pela API pública, nenhuma linha pode ser lida ou escrita;
--   2. retiramos os privilégios de anon/authenticated (se existirem),
--      inclusive para tabelas criadas no futuro.

DO $$
DECLARE r record;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public' LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.tablename);
  END LOOP;

  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'anon') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA public FROM anon';
    EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM anon';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM anon';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM anon';
  END IF;
  IF EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'authenticated') THEN
    EXECUTE 'REVOKE ALL ON ALL TABLES IN SCHEMA public FROM authenticated';
    EXECUTE 'REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM authenticated';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON TABLES FROM authenticated';
    EXECUTE 'ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM authenticated';
  END IF;
END $$;
