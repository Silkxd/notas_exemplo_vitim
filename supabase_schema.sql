-- Add user_id column if it doesn't exist
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name = 'notes' and column_name = 'user_id') then
    alter table notes add column user_id uuid references auth.users;
  end if;
end $$;

-- Make user_id not null (clean up bad data if any, usually valid for new tables)
-- If you have existing rows, this might fail unless you default them.
-- For now, we will leave it nullable or assume the table is empty/new.
-- But to enforce security we usually want it NOT NULL.
-- Let's try to enforce it if table is empty, or just leave as is.
-- alter table notes alter column user_id set not null;

-- Enable Row Level Security (RLS)
alter table notes enable row level security;

-- Drop existing policies to ensure clean state
drop policy if exists "Users can create their own notes" on notes;
drop policy if exists "Users can view their own notes" on notes;
drop policy if exists "Users can update their own notes" on notes;
drop policy if exists "Users can delete their own notes" on notes;
drop policy if exists "Enable all access for all users" on notes;

-- Create policies
create policy "Users can create their own notes"
on notes for insert
with check (auth.uid() = user_id);

create policy "Users can view their own notes"
on notes for select
using (auth.uid() = user_id);

create policy "Users can update their own notes"
on notes for update
using (auth.uid() = user_id);

create policy "Users can delete their own notes"
on notes for delete
using (auth.uid() = user_id);
