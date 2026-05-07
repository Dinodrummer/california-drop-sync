
-- profiles
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_name text,
  dpo_name text,
  dpo_email text,
  onboarded boolean not null default false,
  plan text not null default 'starter',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.profiles enable row level security;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);
create policy "profiles_delete_own" on public.profiles for delete using (auth.uid() = id);

-- auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- integrations
create type public.integration_provider as enum ('mailchimp', 'shopify', 'hubspot');
create type public.integration_status as enum ('connected', 'error', 'disconnected');

create table public.integrations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider public.integration_provider not null,
  api_key text not null,
  status public.integration_status not null default 'connected',
  last_sync timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, provider)
);
alter table public.integrations enable row level security;
create policy "integrations_all_own" on public.integrations for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- delete requests
create type public.delete_status as enum ('queued', 'processing', 'completed', 'failed');

create table public.delete_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_email text not null,
  source public.integration_provider not null,
  status public.delete_status not null default 'queued',
  scheduled_for timestamptz not null default (now() + interval '45 days'),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.delete_requests enable row level security;
create policy "delete_requests_all_own" on public.delete_requests for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- audit logs
create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  actor text not null,
  action text not null,
  target text,
  status text not null default 'success',
  message text,
  created_at timestamptz not null default now()
);
alter table public.audit_logs enable row level security;
create policy "audit_logs_all_own" on public.audit_logs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index on public.delete_requests (user_id, status);
create index on public.audit_logs (user_id, created_at desc);
