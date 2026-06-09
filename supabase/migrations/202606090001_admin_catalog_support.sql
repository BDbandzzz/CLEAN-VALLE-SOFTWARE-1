alter table public.localization
  add column if not exists id_state integer
  references public.state_element(id_state)
  default 1;

update public.localization
set id_state = 1
where id_state is null;

alter table public.localization
  alter column id_state set not null;

create unique index if not exists users_code_user_unique
  on public.users (lower(code_user));

create index if not exists users_role_state_idx
  on public.users (id_role, id_state);

create index if not exists subtype_category_category_idx
  on public.subtype_category (id_category);

create index if not exists subarea_localization_parent_idx
  on public.subarea_localization (id_localization);

create index if not exists type_specialization_category_idx
  on public.type_specialization (id_category);
