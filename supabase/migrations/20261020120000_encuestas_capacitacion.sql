-- Módulo de evaluación de capacitaciones de NexoIA.
-- Crea el modelo, las reglas de integridad, Row Level Security y la primera encuesta.
-- Ejecutar una sola vez en el proyecto de Supabase. No guarda credenciales.

create extension if not exists pgcrypto;

do $$
begin
  if not exists (select 1 from pg_type where typname = 'survey_status') then
    create type public.survey_status as enum ('draft', 'active', 'closed');
  end if;
  if not exists (select 1 from pg_type where typname = 'question_type') then
    create type public.question_type as enum (
      'rating_1_5',
      'rating_0_10',
      'single_choice',
      'multiple_choice',
      'open_text'
    );
  end if;
end $$;

create table public.surveys (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  disclaimer text,
  institution text,
  organization text,
  duration_label text,
  modality text,
  session_count integer,
  instructor_name text,
  status public.survey_status not null default 'draft',
  estimated_minutes text,
  starts_on date,
  ends_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint surveys_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' and char_length(slug) between 3 and 80),
  constraint surveys_title_length check (char_length(title) between 3 and 180),
  constraint surveys_description_length check (description is null or char_length(description) <= 2000),
  constraint surveys_disclaimer_length check (disclaimer is null or char_length(disclaimer) <= 2000),
  constraint surveys_institution_length check (institution is null or char_length(institution) <= 180),
  constraint surveys_organization_length check (organization is null or char_length(organization) <= 180),
  constraint surveys_duration_length check (duration_label is null or char_length(duration_label) <= 80),
  constraint surveys_modality_length check (modality is null or char_length(modality) <= 80),
  constraint surveys_instructor_length check (instructor_name is null or char_length(instructor_name) <= 160),
  constraint surveys_estimate_length check (estimated_minutes is null or char_length(estimated_minutes) <= 40),
  constraint surveys_session_count_nonnegative check (session_count is null or session_count >= 0),
  constraint surveys_date_order check (starts_on is null or ends_on is null or starts_on <= ends_on)
);

create table public.survey_questions (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys (id) on delete restrict,
  section_key text not null,
  section_title text not null,
  prompt text not null,
  help_text text,
  question_type public.question_type not null,
  position integer not null,
  is_required boolean not null default true,
  metric_key text,
  max_length integer,
  constraint survey_questions_section_key_format check (section_key ~ '^[a-z0-9_-]{1,40}$'),
  constraint survey_questions_section_title_length check (char_length(section_title) between 3 and 120),
  constraint survey_questions_prompt_length check (char_length(prompt) between 3 and 500),
  constraint survey_questions_help_length check (help_text is null or char_length(help_text) <= 400),
  constraint survey_questions_position_positive check (position > 0),
  constraint survey_questions_metric_key_format check (metric_key is null or metric_key ~ '^[a-z0-9_]{2,40}$'),
  constraint survey_questions_max_length_range check (max_length is null or max_length between 20 and 1000),
  constraint survey_questions_position_unique unique (survey_id, position)
);

create unique index survey_questions_metric_key_unique
  on public.survey_questions (survey_id, metric_key)
  where metric_key is not null;

create table public.survey_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.survey_questions (id) on delete restrict,
  label text not null,
  position integer not null,
  allows_free_text boolean not null default false,
  constraint survey_options_label_length check (char_length(label) between 1 and 300),
  constraint survey_options_position_positive check (position > 0),
  constraint survey_options_position_unique unique (question_id, position)
);

create table public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  survey_id uuid not null references public.surveys (id) on delete restrict,
  client_token uuid not null,
  submitted_at timestamptz not null default now(),
  constraint survey_responses_client_token_key unique (client_token)
);

create table public.survey_answers (
  id uuid primary key default gen_random_uuid(),
  response_id uuid not null references public.survey_responses (id) on delete cascade,
  question_id uuid not null references public.survey_questions (id) on delete restrict,
  numeric_value numeric,
  text_value text,
  option_id uuid references public.survey_options (id) on delete restrict,
  constraint survey_answers_text_length check (text_value is null or char_length(text_value) <= 1000),
  constraint survey_answers_has_payload check (
    numeric_value is not null or text_value is not null or option_id is not null
  )
);

create unique index survey_answers_one_scalar
  on public.survey_answers (response_id, question_id)
  where option_id is null;

create unique index survey_answers_one_option
  on public.survey_answers (response_id, question_id, option_id)
  where option_id is not null;

create table public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text,
  interests text,
  consent_granted boolean not null,
  consent_text text not null,
  consent_version text not null,
  consented_at timestamptz not null default now(),
  origin_label text,
  unsubscribe_token text not null unique,
  unsubscribed_at timestamptz,
  created_at timestamptz not null default now(),
  constraint newsletter_email_format check (
    email = lower(email)
    and email ~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
    and char_length(email) <= 254
  ),
  constraint newsletter_name_length check (name is null or char_length(name) <= 120),
  constraint newsletter_interests_length check (interests is null or char_length(interests) <= 500),
  constraint newsletter_consent_required check (consent_granted = true),
  constraint newsletter_consent_text_length check (char_length(consent_text) between 40 and 800),
  constraint newsletter_consent_version_format check (consent_version ~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$'),
  constraint newsletter_origin_length check (origin_label is null or char_length(origin_label) <= 200),
  constraint newsletter_token_length check (char_length(unsubscribe_token) between 32 and 128)
);

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  constraint admin_users_email_length check (char_length(email) between 3 and 254)
);

create table public.public_request_limits (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  client_hash text not null,
  created_at timestamptz not null default now(),
  constraint public_request_limits_action_check check (action in ('submit_survey', 'subscribe', 'unsubscribe')),
  constraint public_request_limits_hash_length check (char_length(client_hash) between 32 and 128)
);

create index survey_questions_survey_position_idx on public.survey_questions (survey_id, position);
create index survey_options_question_position_idx on public.survey_options (question_id, position);
create index survey_responses_survey_submitted_idx on public.survey_responses (survey_id, submitted_at desc);
create index survey_answers_response_idx on public.survey_answers (response_id);
create index survey_answers_question_idx on public.survey_answers (question_id);
create index survey_answers_option_idx on public.survey_answers (option_id);
create index newsletter_subscribers_active_idx on public.newsletter_subscribers (email) where unsubscribed_at is null;
create index public_request_limits_lookup_idx on public.public_request_limits (action, client_hash, created_at desc);
create index surveys_status_idx on public.surveys (status);

-- Indica si la sesión actual pertenece a un administrador activo.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
      and is_active = true
  );
$$;

-- Actualiza la marca de tiempo al editar una encuesta.
create or replace function public.set_survey_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger surveys_set_updated_at
  before update on public.surveys
  for each row
  execute function public.set_survey_updated_at();

-- Impide cambiar el identificador público o borrar una encuesta que ya tiene evaluaciones.
create or replace function public.protect_survey_identity()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if tg_op = 'DELETE' then
    if exists (select 1 from public.survey_responses where survey_id = old.id) then
      raise exception 'VALIDACION:No se puede eliminar una capacitación que ya tiene evaluaciones.';
    end if;
    return old;
  end if;

  if new.slug is distinct from old.slug and exists (
    select 1 from public.survey_responses where survey_id = old.id
  ) then
    raise exception 'VALIDACION:No se puede cambiar el identificador público porque ya existen evaluaciones.';
  end if;

  return new;
end;
$$;

create trigger surveys_protect_identity
  before update or delete on public.surveys
  for each row
  execute function public.protect_survey_identity();

-- Conserva el significado histórico: con respuestas solo se corrige el texto visible.
create or replace function public.protect_question_structure()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_has_answers boolean;
begin
  if tg_op = 'INSERT' then
    return new;
  end if;

  select exists (
    select 1 from public.survey_answers where question_id = old.id
  ) into v_has_answers;

  if tg_op = 'DELETE' then
    if v_has_answers then
      raise exception 'VALIDACION:No se puede eliminar una pregunta que ya tiene respuestas. Duplica la encuesta para crear una versión nueva.';
    end if;
    return old;
  end if;

  if v_has_answers and (
    new.question_type is distinct from old.question_type
    or new.survey_id is distinct from old.survey_id
    or new.position is distinct from old.position
    or new.section_key is distinct from old.section_key
    or new.metric_key is distinct from old.metric_key
    or new.is_required is distinct from old.is_required
  ) then
    raise exception 'VALIDACION:Esta pregunta ya tiene respuestas. Solo puedes corregir el enunciado o la ayuda, o duplicar la encuesta.';
  end if;

  return new;
end;
$$;

create trigger survey_questions_protect_structure
  before update or delete on public.survey_questions
  for each row
  execute function public.protect_question_structure();

-- Bloquea cambios de opciones cuando la pregunta ya fue respondida.
create or replace function public.protect_option_structure()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_question_id uuid;
begin
  v_question_id := case when tg_op = 'INSERT' then new.question_id else old.question_id end;

  if exists (select 1 from public.survey_answers where question_id = v_question_id) then
    raise exception 'VALIDACION:No se pueden modificar las opciones de una pregunta que ya tiene respuestas. Duplica la encuesta.';
  end if;

  if tg_op = 'DELETE' then
    return old;
  end if;
  return new;
end;
$$;

create trigger survey_options_protect_structure
  before insert or update or delete on public.survey_options
  for each row
  execute function public.protect_option_structure();

-- Segunda barrera de integridad para cada fila de respuesta.
create or replace function public.enforce_answer_integrity()
returns trigger
language plpgsql
set search_path = public
as $$
declare
  v_response_survey uuid;
  v_question_survey uuid;
  v_question_type public.question_type;
  v_allows_free boolean;
begin
  select survey_id into v_response_survey
  from public.survey_responses
  where id = new.response_id;

  select survey_id, question_type into v_question_survey, v_question_type
  from public.survey_questions
  where id = new.question_id;

  if v_response_survey is null or v_question_survey is null or v_response_survey <> v_question_survey then
    raise exception 'VALIDACION:La respuesta no corresponde a la encuesta.';
  end if;

  if v_question_type = 'rating_1_5' then
    if new.option_id is not null or new.numeric_value is null
      or new.numeric_value < 1 or new.numeric_value > 5
      or new.numeric_value <> trunc(new.numeric_value) then
      raise exception 'VALIDACION:La calificación debe ser un entero del 1 al 5.';
    end if;
  elsif v_question_type = 'rating_0_10' then
    if new.option_id is not null or new.numeric_value is null
      or new.numeric_value < 0 or new.numeric_value > 10
      or new.numeric_value <> trunc(new.numeric_value) then
      raise exception 'VALIDACION:La recomendación debe ser un entero del 0 al 10.';
    end if;
  elsif v_question_type = 'open_text' then
    if new.option_id is not null or new.numeric_value is not null
      or new.text_value is null or char_length(btrim(new.text_value)) = 0 then
      raise exception 'VALIDACION:El comentario no es válido.';
    end if;
  elsif v_question_type in ('single_choice', 'multiple_choice') then
    if new.option_id is null or new.numeric_value is not null then
      raise exception 'VALIDACION:La opción seleccionada no es válida.';
    end if;

    select allows_free_text into v_allows_free
    from public.survey_options
    where id = new.option_id and question_id = new.question_id;

    if not found then
      raise exception 'VALIDACION:La opción no pertenece a la pregunta.';
    end if;

    if v_allows_free and (new.text_value is null or char_length(btrim(new.text_value)) < 2) then
      raise exception 'VALIDACION:Especifica el tema indicado en Otros.';
    end if;

    if not v_allows_free and new.text_value is not null then
      raise exception 'VALIDACION:Esa opción no admite texto adicional.';
    end if;

    if v_question_type = 'single_choice' and exists (
      select 1
      from public.survey_answers
      where response_id = new.response_id
        and question_id = new.question_id
        and id <> new.id
    ) then
      raise exception 'VALIDACION:Solo se permite una opción.';
    end if;
  end if;

  return new;
end;
$$;

create trigger survey_answers_enforce_integrity
  before insert or update on public.survey_answers
  for each row
  execute function public.enforce_answer_integrity();

-- Guarda una evaluación anónima. Solo el rol service_role puede ejecutarla.
create or replace function public.insert_survey_submission(
  p_slug text,
  p_client_token uuid,
  p_answers jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_survey public.surveys%rowtype;
  v_question record;
  v_item jsonb;
  v_index integer;
  v_question_id uuid;
  v_question_text text;
  v_seen uuid[] := array[]::uuid[];
  v_rows jsonb := '[]'::jsonb;
  v_response_id uuid;
  v_text text;
  v_numeric numeric;
  v_option_ids jsonb;
  v_option_index integer;
  v_option_text text;
  v_option_id uuid;
  v_selected uuid[] := array[]::uuid[];
  v_allows_free boolean;
  v_note text;
  v_today date;
  v_uuid_pattern constant text := '^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';
begin
  if p_slug is null or p_client_token is null or jsonb_typeof(p_answers) <> 'array' then
    return jsonb_build_object('ok', false, 'message', 'La solicitud de evaluación no es válida.');
  end if;

  if p_slug !~ '^[a-z0-9]+(?:-[a-z0-9]+)*$' or char_length(p_slug) > 80 then
    return jsonb_build_object('ok', false, 'message', 'La evaluación solicitada no es válida.');
  end if;

  if jsonb_array_length(p_answers) > 40 or char_length(p_answers::text) > 40000 then
    return jsonb_build_object('ok', false, 'message', 'La evaluación supera el tamaño permitido.');
  end if;

  if exists (select 1 from public.survey_responses where client_token = p_client_token) then
    return jsonb_build_object('ok', true, 'duplicate', true);
  end if;

  select * into v_survey from public.surveys where slug = p_slug;
  if not found or v_survey.status <> 'active' then
    return jsonb_build_object('ok', false, 'message', 'Esta evaluación no está disponible.');
  end if;

  v_today := (now() at time zone 'America/Guayaquil')::date;
  if v_survey.starts_on is not null and v_today < v_survey.starts_on then
    return jsonb_build_object('ok', false, 'message', 'Esta evaluación aún no comienza.');
  end if;
  if v_survey.ends_on is not null and v_today > v_survey.ends_on then
    return jsonb_build_object('ok', false, 'message', 'Esta evaluación ya finalizó.');
  end if;

  for v_index in 0 .. jsonb_array_length(p_answers) - 1 loop
    v_item := p_answers -> v_index;
    v_question_text := v_item->>'question_id';
    if v_question_text is null or v_question_text !~* v_uuid_pattern then
      return jsonb_build_object('ok', false, 'message', 'Hay una pregunta no reconocida.');
    end if;
    v_question_id := v_question_text::uuid;
    if v_question_id = any (v_seen) then
      return jsonb_build_object('ok', false, 'message', 'Hay respuestas duplicadas.');
    end if;
    v_seen := v_seen || v_question_id;

    if not exists (
      select 1 from public.survey_questions
      where id = v_question_id and survey_id = v_survey.id
    ) then
      return jsonb_build_object('ok', false, 'message', 'Hay una pregunta que no pertenece a esta evaluación.');
    end if;
  end loop;

  if exists (
    select 1
    from public.survey_questions q
    where q.survey_id = v_survey.id
      and q.is_required
      and not (q.id = any (v_seen))
  ) then
    return jsonb_build_object('ok', false, 'message', 'Faltan respuestas obligatorias.');
  end if;

  for v_index in 0 .. jsonb_array_length(p_answers) - 1 loop
    v_item := p_answers -> v_index;
    v_question_id := (v_item->>'question_id')::uuid;
    select id, question_type, is_required, max_length
      into v_question
    from public.survey_questions
    where id = v_question_id;

    v_text := regexp_replace(coalesce(v_item->>'text_value', ''), '<[^>]*>', '', 'g');
    v_text := replace(v_text, chr(0), '');
    v_text := nullif(left(btrim(v_text), 1000), '');
    v_numeric := null;

    if v_item ? 'numeric_value' and jsonb_typeof(v_item->'numeric_value') <> 'null' then
      if jsonb_typeof(v_item->'numeric_value') <> 'number' then
        return jsonb_build_object('ok', false, 'message', 'Una calificación no es válida.');
      end if;
      v_numeric := (v_item->>'numeric_value')::numeric;
    end if;

    if v_question.question_type = 'rating_1_5' then
      if v_numeric is null or v_numeric < 1 or v_numeric > 5 or v_numeric <> trunc(v_numeric) then
        return jsonb_build_object('ok', false, 'message', 'Las calificaciones deben ser enteros del 1 al 5.');
      end if;
      v_rows := v_rows || jsonb_build_array(jsonb_build_object(
        'question_id', v_question_id, 'numeric_value', v_numeric, 'text_value', null, 'option_id', null
      ));
    elsif v_question.question_type = 'rating_0_10' then
      if v_numeric is null or v_numeric < 0 or v_numeric > 10 or v_numeric <> trunc(v_numeric) then
        return jsonb_build_object('ok', false, 'message', 'La recomendación debe ser un entero del 0 al 10.');
      end if;
      v_rows := v_rows || jsonb_build_array(jsonb_build_object(
        'question_id', v_question_id, 'numeric_value', v_numeric, 'text_value', null, 'option_id', null
      ));
    elsif v_question.question_type = 'open_text' then
      if v_text is null then
        if v_question.is_required then
          return jsonb_build_object('ok', false, 'message', 'Completa los campos obligatorios.');
        end if;
      elsif char_length(v_text) > coalesce(v_question.max_length, 1000) then
        return jsonb_build_object('ok', false, 'message', 'Un comentario supera la longitud permitida.');
      else
        v_rows := v_rows || jsonb_build_array(jsonb_build_object(
          'question_id', v_question_id, 'numeric_value', null, 'text_value', v_text, 'option_id', null
        ));
      end if;
    elsif v_question.question_type in ('single_choice', 'multiple_choice') then
      v_option_ids := v_item->'option_ids';
      if v_option_ids is null or jsonb_typeof(v_option_ids) <> 'array' or jsonb_array_length(v_option_ids) = 0 then
        if v_question.is_required then
          return jsonb_build_object('ok', false, 'message', 'Selecciona una opción en las preguntas obligatorias.');
        end if;
      else
        if jsonb_array_length(v_option_ids) > 30 then
          return jsonb_build_object('ok', false, 'message', 'Hay demasiadas opciones seleccionadas.');
        end if;
        v_selected := array[]::uuid[];
        for v_option_index in 0 .. jsonb_array_length(v_option_ids) - 1 loop
          v_option_text := v_option_ids ->> v_option_index;
          if v_option_text is null or v_option_text !~* v_uuid_pattern then
            return jsonb_build_object('ok', false, 'message', 'Una opción seleccionada no es válida.');
          end if;
          v_option_id := v_option_text::uuid;
          if not (v_option_id = any (v_selected)) then
            v_selected := v_selected || v_option_id;
          end if;
        end loop;

        if v_question.question_type = 'single_choice' and coalesce(array_length(v_selected, 1), 0) <> 1 then
          return jsonb_build_object('ok', false, 'message', 'Selecciona una sola opción donde se solicita.');
        end if;

        foreach v_option_id in array v_selected loop
          select allows_free_text into v_allows_free
          from public.survey_options
          where id = v_option_id and question_id = v_question_id;
          if not found then
            return jsonb_build_object('ok', false, 'message', 'Una opción seleccionada no es válida.');
          end if;
          v_note := null;
          if v_allows_free then
            v_note := nullif(left(coalesce(v_text, ''), 300), '');
            if v_note is null or char_length(v_note) < 2 then
              return jsonb_build_object('ok', false, 'message', 'Especifica el tema indicado en Otros.');
            end if;
          end if;
          v_rows := v_rows || jsonb_build_array(jsonb_build_object(
            'question_id', v_question_id, 'numeric_value', null, 'text_value', v_note, 'option_id', v_option_id
          ));
        end loop;
      end if;
    else
      return jsonb_build_object('ok', false, 'message', 'Tipo de pregunta no admitido.');
    end if;
  end loop;

  begin
    insert into public.survey_responses (survey_id, client_token)
    values (v_survey.id, p_client_token)
    returning id into v_response_id;

    insert into public.survey_answers (response_id, question_id, numeric_value, text_value, option_id)
    select
      v_response_id,
      (item->>'question_id')::uuid,
      case when jsonb_typeof(item->'numeric_value') = 'null' then null else (item->>'numeric_value')::numeric end,
      case when jsonb_typeof(item->'text_value') = 'null' then null else item->>'text_value' end,
      case when jsonb_typeof(item->'option_id') = 'null' then null else (item->>'option_id')::uuid end
    from jsonb_array_elements(v_rows) as item;

    return jsonb_build_object('ok', true);
  exception
    when unique_violation then
      if sqlerrm like '%client_token%' then
        return jsonb_build_object('ok', true, 'duplicate', true);
      end if;
      return jsonb_build_object('ok', false, 'message', 'No se pudo guardar la evaluación.');
    when others then
      if sqlerrm like 'VALIDACION:%' then
        return jsonb_build_object('ok', false, 'message', substring(sqlerrm from 12));
      end if;
      return jsonb_build_object('ok', false, 'message', 'No se pudo guardar la evaluación.');
  end;
end;
$$;

-- Registra una suscripción comercial sin vincularla a una evaluación.
create or replace function public.register_newsletter_subscription(
  p_email text,
  p_name text,
  p_interests text,
  p_consent boolean,
  p_consent_text text,
  p_consent_version text,
  p_origin_label text,
  p_unsubscribe_token text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_email text;
  v_name text;
  v_interests text;
  v_origin text;
  v_existing public.newsletter_subscribers%rowtype;
begin
  if p_consent is distinct from true then
    return jsonb_build_object('ok', false, 'message', 'La suscripción requiere un consentimiento explícito.');
  end if;

  v_email := lower(btrim(coalesce(p_email, '')));
  if v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' or char_length(v_email) > 254 then
    return jsonb_build_object('ok', false, 'message', 'Ingresa un correo electrónico válido.');
  end if;

  if p_consent_text is null or char_length(btrim(p_consent_text)) < 40 or char_length(p_consent_text) > 800 then
    return jsonb_build_object('ok', false, 'message', 'El texto de consentimiento no es válido.');
  end if;

  if p_consent_version is null or p_consent_version !~ '^[0-9]{4}-[0-9]{2}-[0-9]{2}$' then
    return jsonb_build_object('ok', false, 'message', 'La versión de consentimiento no es válida.');
  end if;

  if p_unsubscribe_token is null or p_unsubscribe_token !~ '^[0-9a-f]{32,128}$' then
    return jsonb_build_object('ok', false, 'message', 'No se pudo preparar la suscripción.');
  end if;

  v_name := nullif(left(btrim(regexp_replace(coalesce(p_name, ''), '<[^>]*>', '', 'g')), 120), '');
  v_interests := nullif(left(btrim(regexp_replace(coalesce(p_interests, ''), '<[^>]*>', '', 'g')), 500), '');
  v_origin := nullif(left(btrim(regexp_replace(coalesce(p_origin_label, ''), '<[^>]*>', '', 'g')), 200), '');

  select * into v_existing from public.newsletter_subscribers where email = v_email;
  if found and v_existing.unsubscribed_at is null then
    return jsonb_build_object('ok', true, 'state', 'already');
  end if;

  if found then
    update public.newsletter_subscribers
    set name = v_name,
        interests = v_interests,
        consent_granted = true,
        consent_text = btrim(p_consent_text),
        consent_version = p_consent_version,
        consented_at = now(),
        origin_label = v_origin,
        unsubscribe_token = p_unsubscribe_token,
        unsubscribed_at = null
    where id = v_existing.id;
    return jsonb_build_object('ok', true, 'state', 'restored');
  end if;

  insert into public.newsletter_subscribers (
    email, name, interests, consent_granted, consent_text, consent_version, origin_label, unsubscribe_token
  ) values (
    v_email, v_name, v_interests, true, btrim(p_consent_text), p_consent_version, v_origin, p_unsubscribe_token
  );

  return jsonb_build_object('ok', true, 'state', 'created');
exception
  when unique_violation then
    return jsonb_build_object('ok', true, 'state', 'already');
end;
$$;

-- Cancela una suscripción. La respuesta no revela si el token existía.
create or replace function public.cancel_newsletter_subscription(p_token text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null or p_token !~ '^[0-9a-f]{32,128}$' then
    return jsonb_build_object('ok', true);
  end if;

  update public.newsletter_subscribers
  set unsubscribed_at = now()
  where unsubscribe_token = p_token
    and unsubscribed_at is null;

  return jsonb_build_object('ok', true);
end;
$$;

-- Reserva un intento público y rechaza ráfagas desde el mismo cliente.
create or replace function public.consume_public_rate_limit(
  p_action text,
  p_client_hash text,
  p_limit integer,
  p_window_seconds integer
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count integer;
begin
  if p_action not in ('submit_survey', 'subscribe', 'unsubscribe') then
    return false;
  end if;
  if p_client_hash is null or p_client_hash !~ '^[0-9a-f]{32,128}$' then
    return false;
  end if;
  if p_limit < 1 or p_limit > 100 or p_window_seconds < 60 or p_window_seconds > 86400 then
    return false;
  end if;

  perform pg_advisory_xact_lock(hashtext(p_action || ':' || p_client_hash)::bigint);

  delete from public.public_request_limits
  where client_hash = p_client_hash
    and action = p_action
    and created_at < now() - make_interval(secs => p_window_seconds);

  select count(*) into v_count
  from public.public_request_limits
  where action = p_action
    and client_hash = p_client_hash
    and created_at > now() - make_interval(secs => p_window_seconds);

  if v_count >= p_limit then
    return false;
  end if;

  insert into public.public_request_limits (action, client_hash)
  values (p_action, p_client_hash);
  return true;
end;
$$;

revoke all on function public.is_admin() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;

revoke all on function public.insert_survey_submission(text, uuid, jsonb) from public, anon, authenticated;
revoke all on function public.register_newsletter_subscription(text, text, text, boolean, text, text, text, text) from public, anon, authenticated;
revoke all on function public.cancel_newsletter_subscription(text) from public, anon, authenticated;
revoke all on function public.consume_public_rate_limit(text, text, integer, integer) from public, anon, authenticated;
revoke all on function public.set_survey_updated_at() from public, anon, authenticated;
revoke all on function public.protect_survey_identity() from public, anon, authenticated;
revoke all on function public.protect_question_structure() from public, anon, authenticated;
revoke all on function public.protect_option_structure() from public, anon, authenticated;
revoke all on function public.enforce_answer_integrity() from public, anon, authenticated;

grant execute on function public.insert_survey_submission(text, uuid, jsonb) to service_role;
grant execute on function public.register_newsletter_subscription(text, text, text, boolean, text, text, text, text) to service_role;
grant execute on function public.cancel_newsletter_subscription(text) to service_role;
grant execute on function public.consume_public_rate_limit(text, text, integer, integer) to service_role;

alter table public.surveys enable row level security;
alter table public.survey_questions enable row level security;
alter table public.survey_options enable row level security;
alter table public.survey_responses enable row level security;
alter table public.survey_answers enable row level security;
alter table public.newsletter_subscribers enable row level security;
alter table public.admin_users enable row level security;
alter table public.public_request_limits enable row level security;

create policy "lectura publica de encuestas visibles"
  on public.surveys
  for select
  to anon, authenticated
  using (status in ('active', 'closed'));

create policy "admins gestionan encuestas"
  on public.surveys
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lectura publica de preguntas visibles"
  on public.survey_questions
  for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.surveys
      where surveys.id = survey_questions.survey_id
        and surveys.status in ('active', 'closed')
    )
  );

create policy "admins gestionan preguntas"
  on public.survey_questions
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "lectura publica de opciones visibles"
  on public.survey_options
  for select
  to anon, authenticated
  using (
    exists (
      select 1
      from public.survey_questions
      join public.surveys on surveys.id = survey_questions.survey_id
      where survey_questions.id = survey_options.question_id
        and surveys.status in ('active', 'closed')
    )
  );

create policy "admins gestionan opciones"
  on public.survey_options
  for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins leen evaluaciones"
  on public.survey_responses
  for select
  to authenticated
  using (public.is_admin());

create policy "admins leen respuestas"
  on public.survey_answers
  for select
  to authenticated
  using (public.is_admin());

create policy "admins leen suscripciones"
  on public.newsletter_subscribers
  for select
  to authenticated
  using (public.is_admin());

create policy "admins actualizan suscripciones"
  on public.newsletter_subscribers
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins eliminan suscripciones"
  on public.newsletter_subscribers
  for delete
  to authenticated
  using (public.is_admin());

create policy "cada persona lee su autorizacion"
  on public.admin_users
  for select
  to authenticated
  using (user_id = auth.uid());

create policy "admins leen autorizaciones"
  on public.admin_users
  for select
  to authenticated
  using (public.is_admin());

revoke insert, update, delete on table public.surveys from anon;
revoke insert, update, delete on table public.survey_questions from anon;
revoke insert, update, delete on table public.survey_options from anon;
revoke all on table public.survey_responses from anon, authenticated;
revoke all on table public.survey_answers from anon, authenticated;
revoke all on table public.newsletter_subscribers from anon, authenticated;
revoke all on table public.admin_users from anon;
revoke all on table public.public_request_limits from anon, authenticated;

grant select on table public.survey_responses to authenticated;
grant select on table public.survey_answers to authenticated;
grant select, update, delete on table public.newsletter_subscribers to authenticated;
grant select on table public.admin_users to authenticated;

-- Primera encuesta. Los identificadores son fijos para poder repetir la carga sin duplicar.
insert into public.surveys (
  id, slug, title, description, disclaimer, institution, organization,
  duration_label, modality, session_count, instructor_name, status, estimated_minutes
) values (
  'a0000000-0000-4000-8000-000000000001',
  'ia-finanzas-2026',
  'Evaluación de la capacitación: Inteligencia Artificial Aplicada a las Finanzas',
  'Instrumento de retroalimentación de NexoIA sobre la capacitación Inteligencia Artificial Aplicada a las Finanzas.',
  'Este formulario es un instrumento de retroalimentación de NexoIA. No es una evaluación académica oficial de la Universidad de Cuenca ni de ETAPA EP. Tus respuestas son anónimas y no se vinculan con tu correo electrónico. Los comentarios abiertos son opcionales. Tiempo estimado: 4 a 6 minutos.',
  'Universidad de Cuenca',
  'ETAPA EP',
  '32 horas',
  'Presencial',
  11,
  'NexoIA',
  'active',
  '4 a 6 minutos'
) on conflict (slug) do nothing;

insert into public.survey_questions (
  id, survey_id, section_key, section_title, prompt, help_text, question_type, position, is_required, metric_key, max_length
) values
  ('a0000000-0000-4000-8000-000000000101', 'a0000000-0000-4000-8000-000000000001', 'instructor', 'Evaluación del instructor', '¿Cómo califica el dominio de los contenidos por parte del instructor?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 1, true, 'instructor_mastery', null),
  ('a0000000-0000-4000-8000-000000000102', 'a0000000-0000-4000-8000-000000000001', 'instructor', 'Evaluación del instructor', '¿Qué tan claras fueron sus explicaciones?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 2, true, 'instructor_clarity', null),
  ('a0000000-0000-4000-8000-000000000103', 'a0000000-0000-4000-8000-000000000001', 'instructor', 'Evaluación del instructor', '¿Cómo califica la metodología utilizada para impartir la capacitación?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 3, true, 'instructor_method', null),
  ('a0000000-0000-4000-8000-000000000104', 'a0000000-0000-4000-8000-000000000001', 'instructor', 'Evaluación del instructor', '¿Cómo califica la atención y resolución de preguntas?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 4, true, 'instructor_attention', null),
  ('a0000000-0000-4000-8000-000000000105', 'a0000000-0000-4000-8000-000000000001', 'instructor', 'Evaluación del instructor', '¿Qué tan útiles fueron las demostraciones prácticas?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 5, true, 'instructor_practice', null),
  ('a0000000-0000-4000-8000-000000000106', 'a0000000-0000-4000-8000-000000000001', 'general', 'Evaluación general', '¿Qué tan relevantes fueron los contenidos para sus actividades profesionales?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 6, true, 'content_relevance', null),
  ('a0000000-0000-4000-8000-000000000107', 'a0000000-0000-4000-8000-000000000001', 'general', 'Evaluación general', '¿Cómo califica el equilibrio entre teoría y práctica?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 7, true, 'theory_practice_balance', null),
  ('a0000000-0000-4000-8000-000000000108', 'a0000000-0000-4000-8000-000000000001', 'general', 'Evaluación general', '¿Qué tan apropiado fue el ritmo de la capacitación?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 8, true, 'pace', null),
  ('a0000000-0000-4000-8000-000000000109', 'a0000000-0000-4000-8000-000000000001', 'general', 'Evaluación general', '¿Qué tan útiles fueron los materiales y herramientas proporcionados?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 9, true, 'materials', null),
  ('a0000000-0000-4000-8000-00000000010a', 'a0000000-0000-4000-8000-000000000001', 'general', 'Evaluación general', '¿En qué medida la capacitación cumplió sus expectativas?', '1 = Muy deficiente. 2 = Deficiente. 3 = Aceptable. 4 = Muy bueno. 5 = Excelente.', 'rating_1_5', 10, true, 'expectations', null),
  ('a0000000-0000-4000-8000-00000000010b', 'a0000000-0000-4000-8000-000000000001', 'temario', 'Evaluación del temario', '¿Qué tema considera más útil para su trabajo?', 'Selecciona un solo tema.', 'single_choice', 11, true, 'topic_most_useful', null),
  ('a0000000-0000-4000-8000-00000000010c', 'a0000000-0000-4000-8000-000000000001', 'temario', 'Evaluación del temario', '¿En qué tema le gustaría profundizar?', 'Puedes elegir más de un tema.', 'multiple_choice', 12, true, 'topic_deepen', null),
  ('a0000000-0000-4000-8000-00000000010d', 'a0000000-0000-4000-8000-000000000001', 'temario', 'Evaluación del temario', '¿Qué práctica le resultó más útil?', 'Selecciona una sola práctica.', 'single_choice', 13, true, 'practice_most_useful', null),
  ('a0000000-0000-4000-8000-00000000010e', 'a0000000-0000-4000-8000-000000000001', 'temario', 'Evaluación del temario', '¿Qué contenido o actividad considera que debería mejorarse?', 'Opcional. No escribas datos personales.', 'open_text', 14, false, 'improve_content', 1000),
  ('a0000000-0000-4000-8000-00000000010f', 'a0000000-0000-4000-8000-000000000001', 'aplicacion', 'Aplicación y recomendaciones', '¿Qué herramienta o conocimiento piensa aplicar primero en su trabajo?', 'Opcional. No escribas datos personales.', 'open_text', 15, false, 'apply_first', 1000),
  ('a0000000-0000-4000-8000-000000000110', 'a0000000-0000-4000-8000-000000000001', 'aplicacion', 'Aplicación y recomendaciones', '¿Recomendaría esta capacitación a otras personas?', '0 significa que no la recomendaría y 10 que la recomendaría con total seguridad.', 'rating_0_10', 16, true, 'nps', null),
  ('a0000000-0000-4000-8000-000000000111', 'a0000000-0000-4000-8000-000000000001', 'aplicacion', 'Aplicación y recomendaciones', '¿Qué recomendaría mejorar en futuras ediciones?', 'Opcional. No escribas datos personales.', 'open_text', 17, false, 'improve_future', 1000),
  ('a0000000-0000-4000-8000-000000000112', 'a0000000-0000-4000-8000-000000000001', 'futuras', 'Interés en futuras capacitaciones', '¿Sobre qué temas le gustaría recibir una capacitación adicional?', 'Puedes elegir varias opciones. Si marcas Otros, escribe el tema.', 'multiple_choice', 18, true, 'future_topics', null),
  ('a0000000-0000-4000-8000-000000000113', 'a0000000-0000-4000-8000-000000000001', 'futuras', 'Interés en futuras capacitaciones', '¿Qué modalidad prefiere?', 'Selecciona una modalidad.', 'single_choice', 19, true, 'modality', null),
  ('a0000000-0000-4000-8000-000000000114', 'a0000000-0000-4000-8000-000000000001', 'futuras', 'Interés en futuras capacitaciones', '¿Qué duración preferiría para una nueva capacitación?', 'Selecciona una duración.', 'single_choice', 20, true, 'duration', null)
on conflict (id) do nothing;

insert into public.survey_options (id, question_id, label, position, allows_free_text) values
  ('c0000000-0000-4000-8000-0000000b0001', 'a0000000-0000-4000-8000-00000000010b', 'Comprensión de la IA y su importancia en el sector financiero.', 1, false),
  ('c0000000-0000-4000-8000-0000000b0002', 'a0000000-0000-4000-8000-00000000010b', 'La IA en la transformación financiera.', 2, false),
  ('c0000000-0000-4000-8000-0000000b0003', 'a0000000-0000-4000-8000-00000000010b', 'Desafíos y oportunidades de la IA en finanzas.', 3, false),
  ('c0000000-0000-4000-8000-0000000b0004', 'a0000000-0000-4000-8000-00000000010b', 'Análisis prácticos en la aplicación de la IA en finanzas.', 4, false),
  ('c0000000-0000-4000-8000-0000000b0005', 'a0000000-0000-4000-8000-00000000010b', 'El futuro de las finanzas con IA.', 5, false),
  ('c0000000-0000-4000-8000-0000000b0006', 'a0000000-0000-4000-8000-00000000010b', 'El papel de la IA en finanzas mediante el pensamiento crítico.', 6, false),
  ('c0000000-0000-4000-8000-0000000c0001', 'a0000000-0000-4000-8000-00000000010c', 'Comprensión de la IA y su importancia en el sector financiero.', 1, false),
  ('c0000000-0000-4000-8000-0000000c0002', 'a0000000-0000-4000-8000-00000000010c', 'La IA en la transformación financiera.', 2, false),
  ('c0000000-0000-4000-8000-0000000c0003', 'a0000000-0000-4000-8000-00000000010c', 'Desafíos y oportunidades de la IA en finanzas.', 3, false),
  ('c0000000-0000-4000-8000-0000000c0004', 'a0000000-0000-4000-8000-00000000010c', 'Análisis prácticos en la aplicación de la IA en finanzas.', 4, false),
  ('c0000000-0000-4000-8000-0000000c0005', 'a0000000-0000-4000-8000-00000000010c', 'El futuro de las finanzas con IA.', 5, false),
  ('c0000000-0000-4000-8000-0000000c0006', 'a0000000-0000-4000-8000-00000000010c', 'El papel de la IA en finanzas mediante el pensamiento crítico.', 6, false),
  ('c0000000-0000-4000-8000-0000000d0001', 'a0000000-0000-4000-8000-00000000010d', 'Mapa de oportunidades de IA en Finanzas.', 1, false),
  ('c0000000-0000-4000-8000-0000000d0002', 'a0000000-0000-4000-8000-00000000010d', 'Laboratorio de prompts financieros.', 2, false),
  ('c0000000-0000-4000-8000-0000000d0003', 'a0000000-0000-4000-8000-00000000010d', 'Calidad de datos con Google Colab.', 3, false),
  ('c0000000-0000-4000-8000-0000000d0004', 'a0000000-0000-4000-8000-00000000010d', 'Dashboard de presupuestos.', 4, false),
  ('c0000000-0000-4000-8000-0000000d0005', 'a0000000-0000-4000-8000-00000000010d', 'Análisis y proyección de ingresos.', 5, false),
  ('c0000000-0000-4000-8000-0000000d0006', 'a0000000-0000-4000-8000-00000000010d', 'Detección de anomalías financieras.', 6, false),
  ('c0000000-0000-4000-8000-0000000d0007', 'a0000000-0000-4000-8000-00000000010d', 'Elaboración de informes gerenciales.', 7, false),
  ('c0000000-0000-4000-8000-0000000d0008', 'a0000000-0000-4000-8000-00000000010d', 'Asistentes documentales con evidencia.', 8, false),
  ('c0000000-0000-4000-8000-0000000d0009', 'a0000000-0000-4000-8000-00000000010d', 'Diseño del Agente Analista Financiero.', 9, false),
  ('c0000000-0000-4000-8000-0000000d000a', 'a0000000-0000-4000-8000-00000000010d', 'Analista Gerencial de Proformas.', 10, false),
  ('c0000000-0000-4000-8000-0000000d000b', 'a0000000-0000-4000-8000-00000000010d', 'Pensamiento crítico y validación de resultados.', 11, false),
  ('c0000000-0000-4000-8000-000000120001', 'a0000000-0000-4000-8000-000000000112', 'Inteligencia Artificial avanzada.', 1, false),
  ('c0000000-0000-4000-8000-000000120002', 'a0000000-0000-4000-8000-000000000112', 'Creación de agentes de IA.', 2, false),
  ('c0000000-0000-4000-8000-000000120003', 'a0000000-0000-4000-8000-000000000112', 'Automatización de procesos con IA.', 3, false),
  ('c0000000-0000-4000-8000-000000120004', 'a0000000-0000-4000-8000-000000000112', 'Dashboards financieros.', 4, false),
  ('c0000000-0000-4000-8000-000000120005', 'a0000000-0000-4000-8000-000000000112', 'IA aplicada a Excel.', 5, false),
  ('c0000000-0000-4000-8000-000000120006', 'a0000000-0000-4000-8000-000000000112', 'Power BI e Inteligencia Artificial.', 6, false),
  ('c0000000-0000-4000-8000-000000120007', 'a0000000-0000-4000-8000-000000000112', 'Microsoft Copilot.', 7, false),
  ('c0000000-0000-4000-8000-000000120008', 'a0000000-0000-4000-8000-000000000112', 'ChatGPT y Claude avanzado.', 8, false),
  ('c0000000-0000-4000-8000-000000120009', 'a0000000-0000-4000-8000-000000000112', 'Programación de aplicaciones con IA.', 9, false),
  ('c0000000-0000-4000-8000-00000012000a', 'a0000000-0000-4000-8000-000000000112', 'Automatizaciones con herramientas no-code.', 10, false),
  ('c0000000-0000-4000-8000-00000012000b', 'a0000000-0000-4000-8000-000000000112', 'Análisis de datos y proyecciones.', 11, false),
  ('c0000000-0000-4000-8000-00000012000c', 'a0000000-0000-4000-8000-000000000112', 'IA aplicada a otras áreas empresariales.', 12, false),
  ('c0000000-0000-4000-8000-00000012000d', 'a0000000-0000-4000-8000-000000000112', 'Otros (especificar).', 13, true),
  ('c0000000-0000-4000-8000-000000130001', 'a0000000-0000-4000-8000-000000000113', 'Presencial', 1, false),
  ('c0000000-0000-4000-8000-000000130002', 'a0000000-0000-4000-8000-000000000113', 'Virtual en vivo', 2, false),
  ('c0000000-0000-4000-8000-000000130003', 'a0000000-0000-4000-8000-000000000113', 'Híbrida', 3, false),
  ('c0000000-0000-4000-8000-000000130004', 'a0000000-0000-4000-8000-000000000113', 'Indistinta', 4, false),
  ('c0000000-0000-4000-8000-000000140001', 'a0000000-0000-4000-8000-000000000114', 'Taller de 4 horas', 1, false),
  ('c0000000-0000-4000-8000-000000140002', 'a0000000-0000-4000-8000-000000000114', '8 horas', 2, false),
  ('c0000000-0000-4000-8000-000000140003', 'a0000000-0000-4000-8000-000000000114', '16 horas', 3, false),
  ('c0000000-0000-4000-8000-000000140004', 'a0000000-0000-4000-8000-000000000114', 'Programa de 24–32 horas', 4, false)
on conflict (id) do nothing;
