drop extension if exists "pg_net";

create type "public"."comment_status" as enum ('pending', 'approved', 'rejected', 'analyzing', 'integrated', 'duplicate', 'received', 'not_applicable');

create type "public"."map_type" as enum ('geojson', 'wms', 'raster');

create type "public"."poll_type" as enum ('multiple_choice', 'numeric', 'text');

create type "public"."user_role" as enum ('admin', 'editor', 'moderator', 'citizen');

create sequence "public"."comments_folio_seq";

create sequence "public"."consultation_chapters_id_seq";

create sequence "public"."document_types_id_seq";

create sequence "public"."post_categories_id_seq";

create sequence "public"."posts_id_seq";

create sequence "public"."process_phases_id_seq";


  create table "public"."analytics_events" (
    "id" uuid not null default gen_random_uuid(),
    "event_type" text not null,
    "resource_id" text,
    "metadata" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."analytics_events" enable row level security;


  create table "public"."audit_logs" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "action" text not null,
    "target_table" text,
    "target_id" text,
    "details" jsonb,
    "ip_address" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."audit_logs" enable row level security;


  create table "public"."comments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid,
    "folio" text,
    "topic" text not null,
    "content" text not null,
    "zone" text,
    "email" text,
    "evidence_url" text,
    "sentiment" text,
    "status" public.comment_status default 'pending'::public.comment_status,
    "internal_note" text,
    "created_at" timestamp with time zone default now(),
    "has_accepted_privacy" boolean default false
      );


alter table "public"."comments" enable row level security;


  create table "public"."consultation_chapters" (
    "id" integer not null default nextval('public.consultation_chapters_id_seq'::regclass),
    "instrument_id" uuid,
    "name" text not null,
    "order_index" integer
      );


alter table "public"."consultation_chapters" enable row level security;


  create table "public"."document_types" (
    "id" integer not null default nextval('public.document_types_id_seq'::regclass),
    "name" text not null,
    "badge_color" text
      );


alter table "public"."document_types" enable row level security;


  create table "public"."documents" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "description" text,
    "phase_id" integer,
    "type_id" integer,
    "version" text,
    "url" text not null,
    "size" text,
    "tags" text[],
    "publication_date" date default CURRENT_DATE,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."documents" enable row level security;


  create table "public"."event_registrations" (
    "id" uuid not null default gen_random_uuid(),
    "event_id" uuid,
    "full_name" text not null,
    "email" text not null,
    "phone" text,
    "organization" text,
    "has_accepted_privacy" boolean default false,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."event_registrations" enable row level security;


  create table "public"."events" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "date" date,
    "location" text,
    "map_query" text,
    "lat" double precision,
    "lng" double precision,
    "district" text,
    "modality" text,
    "category" text,
    "status" text,
    "description" text,
    "phase_id" integer,
    "agenda" jsonb,
    "organizers" jsonb,
    "evidence" jsonb,
    "created_at" timestamp with time zone default now(),
    "start_time" time without time zone not null default '00:00:00'::time without time zone,
    "end_time" time without time zone
      );


alter table "public"."events" enable row level security;


  create table "public"."legal_pages" (
    "slug" text not null,
    "title" text,
    "content_html" text,
    "last_updated" date
      );


alter table "public"."legal_pages" enable row level security;


  create table "public"."map_categories" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "order_index" integer,
    "is_active" boolean default true
      );


alter table "public"."map_categories" enable row level security;


  create table "public"."map_layers" (
    "id" uuid not null default gen_random_uuid(),
    "category_id" uuid,
    "name" text not null,
    "type" public.map_type default 'geojson'::public.map_type,
    "source_url" text not null,
    "pdf_url" text,
    "document_url" text,
    "color" text,
    "metadata" jsonb,
    "is_visible" boolean default false,
    "geometry_type" text
      );


alter table "public"."map_layers" enable row level security;


  create table "public"."official_instruments" (
    "id" uuid not null default gen_random_uuid(),
    "phase_id" integer,
    "title" text default 'Programa Municipal de Desarrollo Urbano'::text,
    "status" text,
    "version" text,
    "responsible" text,
    "publish_date" date,
    "effective_date" date,
    "official_gazette_url" text,
    "cabildo_agreement_url" text,
    "final_document_url" text,
    "summary_changes" text,
    "related_links" jsonb,
    "is_active" boolean default false
      );


alter table "public"."official_instruments" enable row level security;


  create table "public"."poll_options" (
    "id" uuid not null default gen_random_uuid(),
    "poll_id" uuid,
    "label" text not null,
    "votes" integer default 0,
    "is_open_response" boolean default false
      );


alter table "public"."poll_options" enable row level security;


  create table "public"."post_categories" (
    "id" integer not null default nextval('public.post_categories_id_seq'::regclass),
    "name" text not null,
    "color" text default 'blue'::text
      );


alter table "public"."post_categories" enable row level security;


  create table "public"."posts" (
    "id" integer not null default nextval('public.posts_id_seq'::regclass),
    "title" text not null,
    "content" text,
    "excerpt" text,
    "image_url" text,
    "published_at" date default CURRENT_DATE,
    "category_id" integer,
    "linked_event_id" uuid,
    "linked_document_id" uuid
      );


alter table "public"."posts" enable row level security;


  create table "public"."process_phases" (
    "id" integer not null default nextval('public.process_phases_id_seq'::regclass),
    "title" text not null,
    "description" text,
    "start_date" date,
    "end_date" date,
    "display_dates" text,
    "status" text,
    "order_index" integer
      );


alter table "public"."process_phases" enable row level security;


  create table "public"."profiles" (
    "id" uuid not null,
    "email" text,
    "role" public.user_role default 'citizen'::public.user_role,
    "full_name" text,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."profiles" enable row level security;


  create table "public"."weekly_polls" (
    "id" uuid not null default gen_random_uuid(),
    "question" text not null,
    "is_active" boolean default false,
    "type" public.poll_type default 'multiple_choice'::public.poll_type,
    "config" jsonb,
    "open_responses" jsonb,
    "created_at" timestamp with time zone default now()
      );


alter table "public"."weekly_polls" enable row level security;

alter sequence "public"."consultation_chapters_id_seq" owned by "public"."consultation_chapters"."id";

alter sequence "public"."document_types_id_seq" owned by "public"."document_types"."id";

alter sequence "public"."post_categories_id_seq" owned by "public"."post_categories"."id";

alter sequence "public"."posts_id_seq" owned by "public"."posts"."id";

alter sequence "public"."process_phases_id_seq" owned by "public"."process_phases"."id";

CREATE UNIQUE INDEX analytics_events_pkey ON public.analytics_events USING btree (id);

CREATE UNIQUE INDEX audit_logs_pkey ON public.audit_logs USING btree (id);

CREATE UNIQUE INDEX comments_pkey ON public.comments USING btree (id);

CREATE UNIQUE INDEX consultation_chapters_pkey ON public.consultation_chapters USING btree (id);

CREATE UNIQUE INDEX document_types_name_key ON public.document_types USING btree (name);

CREATE UNIQUE INDEX document_types_pkey ON public.document_types USING btree (id);

CREATE UNIQUE INDEX documents_pkey ON public.documents USING btree (id);

CREATE UNIQUE INDEX event_registrations_pkey ON public.event_registrations USING btree (id);

CREATE UNIQUE INDEX events_pkey ON public.events USING btree (id);

CREATE UNIQUE INDEX legal_pages_pkey ON public.legal_pages USING btree (slug);

CREATE UNIQUE INDEX map_categories_pkey ON public.map_categories USING btree (id);

CREATE UNIQUE INDEX map_layers_pkey ON public.map_layers USING btree (id);

CREATE UNIQUE INDEX official_instruments_pkey ON public.official_instruments USING btree (id);

CREATE UNIQUE INDEX poll_options_pkey ON public.poll_options USING btree (id);

CREATE UNIQUE INDEX post_categories_name_key ON public.post_categories USING btree (name);

CREATE UNIQUE INDEX post_categories_pkey ON public.post_categories USING btree (id);

CREATE UNIQUE INDEX posts_pkey ON public.posts USING btree (id);

CREATE UNIQUE INDEX process_phases_pkey ON public.process_phases USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX weekly_polls_pkey ON public.weekly_polls USING btree (id);

alter table "public"."analytics_events" add constraint "analytics_events_pkey" PRIMARY KEY using index "analytics_events_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_pkey" PRIMARY KEY using index "audit_logs_pkey";

alter table "public"."comments" add constraint "comments_pkey" PRIMARY KEY using index "comments_pkey";

alter table "public"."consultation_chapters" add constraint "consultation_chapters_pkey" PRIMARY KEY using index "consultation_chapters_pkey";

alter table "public"."document_types" add constraint "document_types_pkey" PRIMARY KEY using index "document_types_pkey";

alter table "public"."documents" add constraint "documents_pkey" PRIMARY KEY using index "documents_pkey";

alter table "public"."event_registrations" add constraint "event_registrations_pkey" PRIMARY KEY using index "event_registrations_pkey";

alter table "public"."events" add constraint "events_pkey" PRIMARY KEY using index "events_pkey";

alter table "public"."legal_pages" add constraint "legal_pages_pkey" PRIMARY KEY using index "legal_pages_pkey";

alter table "public"."map_categories" add constraint "map_categories_pkey" PRIMARY KEY using index "map_categories_pkey";

alter table "public"."map_layers" add constraint "map_layers_pkey" PRIMARY KEY using index "map_layers_pkey";

alter table "public"."official_instruments" add constraint "official_instruments_pkey" PRIMARY KEY using index "official_instruments_pkey";

alter table "public"."poll_options" add constraint "poll_options_pkey" PRIMARY KEY using index "poll_options_pkey";

alter table "public"."post_categories" add constraint "post_categories_pkey" PRIMARY KEY using index "post_categories_pkey";

alter table "public"."posts" add constraint "posts_pkey" PRIMARY KEY using index "posts_pkey";

alter table "public"."process_phases" add constraint "process_phases_pkey" PRIMARY KEY using index "process_phases_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."weekly_polls" add constraint "weekly_polls_pkey" PRIMARY KEY using index "weekly_polls_pkey";

alter table "public"."audit_logs" add constraint "audit_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."audit_logs" validate constraint "audit_logs_user_id_fkey";

alter table "public"."comments" add constraint "comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) not valid;

alter table "public"."comments" validate constraint "comments_user_id_fkey";

alter table "public"."consultation_chapters" add constraint "consultation_chapters_instrument_id_fkey" FOREIGN KEY (instrument_id) REFERENCES public.official_instruments(id) ON DELETE CASCADE not valid;

alter table "public"."consultation_chapters" validate constraint "consultation_chapters_instrument_id_fkey";

alter table "public"."document_types" add constraint "document_types_name_key" UNIQUE using index "document_types_name_key";

alter table "public"."documents" add constraint "documents_phase_id_fkey" FOREIGN KEY (phase_id) REFERENCES public.process_phases(id) not valid;

alter table "public"."documents" validate constraint "documents_phase_id_fkey";

alter table "public"."documents" add constraint "documents_type_id_fkey" FOREIGN KEY (type_id) REFERENCES public.document_types(id) not valid;

alter table "public"."documents" validate constraint "documents_type_id_fkey";

alter table "public"."event_registrations" add constraint "event_registrations_event_id_fkey" FOREIGN KEY (event_id) REFERENCES public.events(id) ON DELETE CASCADE not valid;

alter table "public"."event_registrations" validate constraint "event_registrations_event_id_fkey";

alter table "public"."events" add constraint "events_phase_id_fkey" FOREIGN KEY (phase_id) REFERENCES public.process_phases(id) not valid;

alter table "public"."events" validate constraint "events_phase_id_fkey";

alter table "public"."map_layers" add constraint "check_geometry_type" CHECK ((geometry_type = ANY (ARRAY['fill'::text, 'line'::text, 'circle'::text]))) not valid;

alter table "public"."map_layers" validate constraint "check_geometry_type";

alter table "public"."map_layers" add constraint "map_layers_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.map_categories(id) not valid;

alter table "public"."map_layers" validate constraint "map_layers_category_id_fkey";

alter table "public"."map_layers" add constraint "map_layers_geometry_type_check" CHECK ((geometry_type = ANY (ARRAY['fill'::text, 'line'::text, 'circle'::text]))) not valid;

alter table "public"."map_layers" validate constraint "map_layers_geometry_type_check";

alter table "public"."official_instruments" add constraint "official_instruments_phase_id_fkey" FOREIGN KEY (phase_id) REFERENCES public.process_phases(id) not valid;

alter table "public"."official_instruments" validate constraint "official_instruments_phase_id_fkey";

alter table "public"."official_instruments" add constraint "official_instruments_status_check" CHECK ((status = ANY (ARRAY['vigente'::text, 'en_aprobacion'::text]))) not valid;

alter table "public"."official_instruments" validate constraint "official_instruments_status_check";

alter table "public"."poll_options" add constraint "poll_options_poll_id_fkey" FOREIGN KEY (poll_id) REFERENCES public.weekly_polls(id) ON DELETE CASCADE not valid;

alter table "public"."poll_options" validate constraint "poll_options_poll_id_fkey";

alter table "public"."post_categories" add constraint "post_categories_name_key" UNIQUE using index "post_categories_name_key";

alter table "public"."posts" add constraint "posts_category_id_fkey" FOREIGN KEY (category_id) REFERENCES public.post_categories(id) not valid;

alter table "public"."posts" validate constraint "posts_category_id_fkey";

alter table "public"."posts" add constraint "posts_linked_document_id_fkey" FOREIGN KEY (linked_document_id) REFERENCES public.documents(id) not valid;

alter table "public"."posts" validate constraint "posts_linked_document_id_fkey";

alter table "public"."posts" add constraint "posts_linked_event_id_fkey" FOREIGN KEY (linked_event_id) REFERENCES public.events(id) not valid;

alter table "public"."posts" validate constraint "posts_linked_event_id_fkey";

alter table "public"."process_phases" add constraint "process_phases_status_check" CHECK ((status = ANY (ARRAY['completed'::text, 'active'::text, 'upcoming'::text]))) not valid;

alter table "public"."process_phases" validate constraint "process_phases_status_check";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.generate_folio()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $function$
BEGIN
  NEW.folio := 'PMDU-' || nextval('public.comments_folio_seq');
  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'citizen'); -- Por defecto entran como ciudadanos
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.vote_for_option(p_option_id uuid, p_text_response text DEFAULT NULL::text)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public', 'pg_temp'
AS $function$
DECLARE
  v_poll_id UUID;
BEGIN
  -- 1. Obtener el ID de la encuesta
  SELECT poll_id INTO v_poll_id FROM public.poll_options WHERE id = p_option_id;

  -- 2. Incrementar votos
  UPDATE public.poll_options 
  SET votes = votes + 1 
  WHERE id = p_option_id;

  -- 3. Manejar respuesta abierta (campo "Otro")
  IF p_text_response IS NOT NULL AND p_text_response <> '' THEN
    UPDATE public.weekly_polls
    SET open_responses = COALESCE(open_responses, '[]'::jsonb) || to_jsonb(p_text_response)
    WHERE id = v_poll_id;
  END IF;
END;
$function$
;

grant delete on table "public"."analytics_events" to "anon";

grant insert on table "public"."analytics_events" to "anon";

grant references on table "public"."analytics_events" to "anon";

grant select on table "public"."analytics_events" to "anon";

grant trigger on table "public"."analytics_events" to "anon";

grant truncate on table "public"."analytics_events" to "anon";

grant update on table "public"."analytics_events" to "anon";

grant delete on table "public"."analytics_events" to "authenticated";

grant insert on table "public"."analytics_events" to "authenticated";

grant references on table "public"."analytics_events" to "authenticated";

grant select on table "public"."analytics_events" to "authenticated";

grant trigger on table "public"."analytics_events" to "authenticated";

grant truncate on table "public"."analytics_events" to "authenticated";

grant update on table "public"."analytics_events" to "authenticated";

grant delete on table "public"."analytics_events" to "service_role";

grant insert on table "public"."analytics_events" to "service_role";

grant references on table "public"."analytics_events" to "service_role";

grant select on table "public"."analytics_events" to "service_role";

grant trigger on table "public"."analytics_events" to "service_role";

grant truncate on table "public"."analytics_events" to "service_role";

grant update on table "public"."analytics_events" to "service_role";

grant delete on table "public"."audit_logs" to "anon";

grant insert on table "public"."audit_logs" to "anon";

grant references on table "public"."audit_logs" to "anon";

grant select on table "public"."audit_logs" to "anon";

grant trigger on table "public"."audit_logs" to "anon";

grant truncate on table "public"."audit_logs" to "anon";

grant update on table "public"."audit_logs" to "anon";

grant delete on table "public"."audit_logs" to "authenticated";

grant insert on table "public"."audit_logs" to "authenticated";

grant references on table "public"."audit_logs" to "authenticated";

grant select on table "public"."audit_logs" to "authenticated";

grant trigger on table "public"."audit_logs" to "authenticated";

grant truncate on table "public"."audit_logs" to "authenticated";

grant update on table "public"."audit_logs" to "authenticated";

grant delete on table "public"."audit_logs" to "service_role";

grant insert on table "public"."audit_logs" to "service_role";

grant references on table "public"."audit_logs" to "service_role";

grant select on table "public"."audit_logs" to "service_role";

grant trigger on table "public"."audit_logs" to "service_role";

grant truncate on table "public"."audit_logs" to "service_role";

grant update on table "public"."audit_logs" to "service_role";

grant delete on table "public"."comments" to "anon";

grant insert on table "public"."comments" to "anon";

grant references on table "public"."comments" to "anon";

grant select on table "public"."comments" to "anon";

grant trigger on table "public"."comments" to "anon";

grant truncate on table "public"."comments" to "anon";

grant update on table "public"."comments" to "anon";

grant delete on table "public"."comments" to "authenticated";

grant insert on table "public"."comments" to "authenticated";

grant references on table "public"."comments" to "authenticated";

grant select on table "public"."comments" to "authenticated";

grant trigger on table "public"."comments" to "authenticated";

grant truncate on table "public"."comments" to "authenticated";

grant update on table "public"."comments" to "authenticated";

grant delete on table "public"."comments" to "service_role";

grant insert on table "public"."comments" to "service_role";

grant references on table "public"."comments" to "service_role";

grant select on table "public"."comments" to "service_role";

grant trigger on table "public"."comments" to "service_role";

grant truncate on table "public"."comments" to "service_role";

grant update on table "public"."comments" to "service_role";

grant delete on table "public"."consultation_chapters" to "anon";

grant insert on table "public"."consultation_chapters" to "anon";

grant references on table "public"."consultation_chapters" to "anon";

grant select on table "public"."consultation_chapters" to "anon";

grant trigger on table "public"."consultation_chapters" to "anon";

grant truncate on table "public"."consultation_chapters" to "anon";

grant update on table "public"."consultation_chapters" to "anon";

grant delete on table "public"."consultation_chapters" to "authenticated";

grant insert on table "public"."consultation_chapters" to "authenticated";

grant references on table "public"."consultation_chapters" to "authenticated";

grant select on table "public"."consultation_chapters" to "authenticated";

grant trigger on table "public"."consultation_chapters" to "authenticated";

grant truncate on table "public"."consultation_chapters" to "authenticated";

grant update on table "public"."consultation_chapters" to "authenticated";

grant delete on table "public"."consultation_chapters" to "service_role";

grant insert on table "public"."consultation_chapters" to "service_role";

grant references on table "public"."consultation_chapters" to "service_role";

grant select on table "public"."consultation_chapters" to "service_role";

grant trigger on table "public"."consultation_chapters" to "service_role";

grant truncate on table "public"."consultation_chapters" to "service_role";

grant update on table "public"."consultation_chapters" to "service_role";

grant delete on table "public"."document_types" to "anon";

grant insert on table "public"."document_types" to "anon";

grant references on table "public"."document_types" to "anon";

grant select on table "public"."document_types" to "anon";

grant trigger on table "public"."document_types" to "anon";

grant truncate on table "public"."document_types" to "anon";

grant update on table "public"."document_types" to "anon";

grant delete on table "public"."document_types" to "authenticated";

grant insert on table "public"."document_types" to "authenticated";

grant references on table "public"."document_types" to "authenticated";

grant select on table "public"."document_types" to "authenticated";

grant trigger on table "public"."document_types" to "authenticated";

grant truncate on table "public"."document_types" to "authenticated";

grant update on table "public"."document_types" to "authenticated";

grant delete on table "public"."document_types" to "service_role";

grant insert on table "public"."document_types" to "service_role";

grant references on table "public"."document_types" to "service_role";

grant select on table "public"."document_types" to "service_role";

grant trigger on table "public"."document_types" to "service_role";

grant truncate on table "public"."document_types" to "service_role";

grant update on table "public"."document_types" to "service_role";

grant delete on table "public"."documents" to "anon";

grant insert on table "public"."documents" to "anon";

grant references on table "public"."documents" to "anon";

grant select on table "public"."documents" to "anon";

grant trigger on table "public"."documents" to "anon";

grant truncate on table "public"."documents" to "anon";

grant update on table "public"."documents" to "anon";

grant delete on table "public"."documents" to "authenticated";

grant insert on table "public"."documents" to "authenticated";

grant references on table "public"."documents" to "authenticated";

grant select on table "public"."documents" to "authenticated";

grant trigger on table "public"."documents" to "authenticated";

grant truncate on table "public"."documents" to "authenticated";

grant update on table "public"."documents" to "authenticated";

grant delete on table "public"."documents" to "service_role";

grant insert on table "public"."documents" to "service_role";

grant references on table "public"."documents" to "service_role";

grant select on table "public"."documents" to "service_role";

grant trigger on table "public"."documents" to "service_role";

grant truncate on table "public"."documents" to "service_role";

grant update on table "public"."documents" to "service_role";

grant delete on table "public"."event_registrations" to "anon";

grant insert on table "public"."event_registrations" to "anon";

grant references on table "public"."event_registrations" to "anon";

grant select on table "public"."event_registrations" to "anon";

grant trigger on table "public"."event_registrations" to "anon";

grant truncate on table "public"."event_registrations" to "anon";

grant update on table "public"."event_registrations" to "anon";

grant delete on table "public"."event_registrations" to "authenticated";

grant insert on table "public"."event_registrations" to "authenticated";

grant references on table "public"."event_registrations" to "authenticated";

grant select on table "public"."event_registrations" to "authenticated";

grant trigger on table "public"."event_registrations" to "authenticated";

grant truncate on table "public"."event_registrations" to "authenticated";

grant update on table "public"."event_registrations" to "authenticated";

grant delete on table "public"."event_registrations" to "service_role";

grant insert on table "public"."event_registrations" to "service_role";

grant references on table "public"."event_registrations" to "service_role";

grant select on table "public"."event_registrations" to "service_role";

grant trigger on table "public"."event_registrations" to "service_role";

grant truncate on table "public"."event_registrations" to "service_role";

grant update on table "public"."event_registrations" to "service_role";

grant delete on table "public"."events" to "anon";

grant insert on table "public"."events" to "anon";

grant references on table "public"."events" to "anon";

grant select on table "public"."events" to "anon";

grant trigger on table "public"."events" to "anon";

grant truncate on table "public"."events" to "anon";

grant update on table "public"."events" to "anon";

grant delete on table "public"."events" to "authenticated";

grant insert on table "public"."events" to "authenticated";

grant references on table "public"."events" to "authenticated";

grant select on table "public"."events" to "authenticated";

grant trigger on table "public"."events" to "authenticated";

grant truncate on table "public"."events" to "authenticated";

grant update on table "public"."events" to "authenticated";

grant delete on table "public"."events" to "service_role";

grant insert on table "public"."events" to "service_role";

grant references on table "public"."events" to "service_role";

grant select on table "public"."events" to "service_role";

grant trigger on table "public"."events" to "service_role";

grant truncate on table "public"."events" to "service_role";

grant update on table "public"."events" to "service_role";

grant delete on table "public"."legal_pages" to "anon";

grant insert on table "public"."legal_pages" to "anon";

grant references on table "public"."legal_pages" to "anon";

grant select on table "public"."legal_pages" to "anon";

grant trigger on table "public"."legal_pages" to "anon";

grant truncate on table "public"."legal_pages" to "anon";

grant update on table "public"."legal_pages" to "anon";

grant delete on table "public"."legal_pages" to "authenticated";

grant insert on table "public"."legal_pages" to "authenticated";

grant references on table "public"."legal_pages" to "authenticated";

grant select on table "public"."legal_pages" to "authenticated";

grant trigger on table "public"."legal_pages" to "authenticated";

grant truncate on table "public"."legal_pages" to "authenticated";

grant update on table "public"."legal_pages" to "authenticated";

grant delete on table "public"."legal_pages" to "service_role";

grant insert on table "public"."legal_pages" to "service_role";

grant references on table "public"."legal_pages" to "service_role";

grant select on table "public"."legal_pages" to "service_role";

grant trigger on table "public"."legal_pages" to "service_role";

grant truncate on table "public"."legal_pages" to "service_role";

grant update on table "public"."legal_pages" to "service_role";

grant delete on table "public"."map_categories" to "anon";

grant insert on table "public"."map_categories" to "anon";

grant references on table "public"."map_categories" to "anon";

grant select on table "public"."map_categories" to "anon";

grant trigger on table "public"."map_categories" to "anon";

grant truncate on table "public"."map_categories" to "anon";

grant update on table "public"."map_categories" to "anon";

grant delete on table "public"."map_categories" to "authenticated";

grant insert on table "public"."map_categories" to "authenticated";

grant references on table "public"."map_categories" to "authenticated";

grant select on table "public"."map_categories" to "authenticated";

grant trigger on table "public"."map_categories" to "authenticated";

grant truncate on table "public"."map_categories" to "authenticated";

grant update on table "public"."map_categories" to "authenticated";

grant delete on table "public"."map_categories" to "service_role";

grant insert on table "public"."map_categories" to "service_role";

grant references on table "public"."map_categories" to "service_role";

grant select on table "public"."map_categories" to "service_role";

grant trigger on table "public"."map_categories" to "service_role";

grant truncate on table "public"."map_categories" to "service_role";

grant update on table "public"."map_categories" to "service_role";

grant delete on table "public"."map_layers" to "anon";

grant insert on table "public"."map_layers" to "anon";

grant references on table "public"."map_layers" to "anon";

grant select on table "public"."map_layers" to "anon";

grant trigger on table "public"."map_layers" to "anon";

grant truncate on table "public"."map_layers" to "anon";

grant update on table "public"."map_layers" to "anon";

grant delete on table "public"."map_layers" to "authenticated";

grant insert on table "public"."map_layers" to "authenticated";

grant references on table "public"."map_layers" to "authenticated";

grant select on table "public"."map_layers" to "authenticated";

grant trigger on table "public"."map_layers" to "authenticated";

grant truncate on table "public"."map_layers" to "authenticated";

grant update on table "public"."map_layers" to "authenticated";

grant delete on table "public"."map_layers" to "service_role";

grant insert on table "public"."map_layers" to "service_role";

grant references on table "public"."map_layers" to "service_role";

grant select on table "public"."map_layers" to "service_role";

grant trigger on table "public"."map_layers" to "service_role";

grant truncate on table "public"."map_layers" to "service_role";

grant update on table "public"."map_layers" to "service_role";

grant delete on table "public"."official_instruments" to "anon";

grant insert on table "public"."official_instruments" to "anon";

grant references on table "public"."official_instruments" to "anon";

grant select on table "public"."official_instruments" to "anon";

grant trigger on table "public"."official_instruments" to "anon";

grant truncate on table "public"."official_instruments" to "anon";

grant update on table "public"."official_instruments" to "anon";

grant delete on table "public"."official_instruments" to "authenticated";

grant insert on table "public"."official_instruments" to "authenticated";

grant references on table "public"."official_instruments" to "authenticated";

grant select on table "public"."official_instruments" to "authenticated";

grant trigger on table "public"."official_instruments" to "authenticated";

grant truncate on table "public"."official_instruments" to "authenticated";

grant update on table "public"."official_instruments" to "authenticated";

grant delete on table "public"."official_instruments" to "service_role";

grant insert on table "public"."official_instruments" to "service_role";

grant references on table "public"."official_instruments" to "service_role";

grant select on table "public"."official_instruments" to "service_role";

grant trigger on table "public"."official_instruments" to "service_role";

grant truncate on table "public"."official_instruments" to "service_role";

grant update on table "public"."official_instruments" to "service_role";

grant delete on table "public"."poll_options" to "anon";

grant insert on table "public"."poll_options" to "anon";

grant references on table "public"."poll_options" to "anon";

grant select on table "public"."poll_options" to "anon";

grant trigger on table "public"."poll_options" to "anon";

grant truncate on table "public"."poll_options" to "anon";

grant update on table "public"."poll_options" to "anon";

grant delete on table "public"."poll_options" to "authenticated";

grant insert on table "public"."poll_options" to "authenticated";

grant references on table "public"."poll_options" to "authenticated";

grant select on table "public"."poll_options" to "authenticated";

grant trigger on table "public"."poll_options" to "authenticated";

grant truncate on table "public"."poll_options" to "authenticated";

grant update on table "public"."poll_options" to "authenticated";

grant delete on table "public"."poll_options" to "service_role";

grant insert on table "public"."poll_options" to "service_role";

grant references on table "public"."poll_options" to "service_role";

grant select on table "public"."poll_options" to "service_role";

grant trigger on table "public"."poll_options" to "service_role";

grant truncate on table "public"."poll_options" to "service_role";

grant update on table "public"."poll_options" to "service_role";

grant delete on table "public"."post_categories" to "anon";

grant insert on table "public"."post_categories" to "anon";

grant references on table "public"."post_categories" to "anon";

grant select on table "public"."post_categories" to "anon";

grant trigger on table "public"."post_categories" to "anon";

grant truncate on table "public"."post_categories" to "anon";

grant update on table "public"."post_categories" to "anon";

grant delete on table "public"."post_categories" to "authenticated";

grant insert on table "public"."post_categories" to "authenticated";

grant references on table "public"."post_categories" to "authenticated";

grant select on table "public"."post_categories" to "authenticated";

grant trigger on table "public"."post_categories" to "authenticated";

grant truncate on table "public"."post_categories" to "authenticated";

grant update on table "public"."post_categories" to "authenticated";

grant delete on table "public"."post_categories" to "service_role";

grant insert on table "public"."post_categories" to "service_role";

grant references on table "public"."post_categories" to "service_role";

grant select on table "public"."post_categories" to "service_role";

grant trigger on table "public"."post_categories" to "service_role";

grant truncate on table "public"."post_categories" to "service_role";

grant update on table "public"."post_categories" to "service_role";

grant delete on table "public"."posts" to "anon";

grant insert on table "public"."posts" to "anon";

grant references on table "public"."posts" to "anon";

grant select on table "public"."posts" to "anon";

grant trigger on table "public"."posts" to "anon";

grant truncate on table "public"."posts" to "anon";

grant update on table "public"."posts" to "anon";

grant delete on table "public"."posts" to "authenticated";

grant insert on table "public"."posts" to "authenticated";

grant references on table "public"."posts" to "authenticated";

grant select on table "public"."posts" to "authenticated";

grant trigger on table "public"."posts" to "authenticated";

grant truncate on table "public"."posts" to "authenticated";

grant update on table "public"."posts" to "authenticated";

grant delete on table "public"."posts" to "service_role";

grant insert on table "public"."posts" to "service_role";

grant references on table "public"."posts" to "service_role";

grant select on table "public"."posts" to "service_role";

grant trigger on table "public"."posts" to "service_role";

grant truncate on table "public"."posts" to "service_role";

grant update on table "public"."posts" to "service_role";

grant delete on table "public"."process_phases" to "anon";

grant insert on table "public"."process_phases" to "anon";

grant references on table "public"."process_phases" to "anon";

grant select on table "public"."process_phases" to "anon";

grant trigger on table "public"."process_phases" to "anon";

grant truncate on table "public"."process_phases" to "anon";

grant update on table "public"."process_phases" to "anon";

grant delete on table "public"."process_phases" to "authenticated";

grant insert on table "public"."process_phases" to "authenticated";

grant references on table "public"."process_phases" to "authenticated";

grant select on table "public"."process_phases" to "authenticated";

grant trigger on table "public"."process_phases" to "authenticated";

grant truncate on table "public"."process_phases" to "authenticated";

grant update on table "public"."process_phases" to "authenticated";

grant delete on table "public"."process_phases" to "service_role";

grant insert on table "public"."process_phases" to "service_role";

grant references on table "public"."process_phases" to "service_role";

grant select on table "public"."process_phases" to "service_role";

grant trigger on table "public"."process_phases" to "service_role";

grant truncate on table "public"."process_phases" to "service_role";

grant update on table "public"."process_phases" to "service_role";

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."weekly_polls" to "anon";

grant insert on table "public"."weekly_polls" to "anon";

grant references on table "public"."weekly_polls" to "anon";

grant select on table "public"."weekly_polls" to "anon";

grant trigger on table "public"."weekly_polls" to "anon";

grant truncate on table "public"."weekly_polls" to "anon";

grant update on table "public"."weekly_polls" to "anon";

grant delete on table "public"."weekly_polls" to "authenticated";

grant insert on table "public"."weekly_polls" to "authenticated";

grant references on table "public"."weekly_polls" to "authenticated";

grant select on table "public"."weekly_polls" to "authenticated";

grant trigger on table "public"."weekly_polls" to "authenticated";

grant truncate on table "public"."weekly_polls" to "authenticated";

grant update on table "public"."weekly_polls" to "authenticated";

grant delete on table "public"."weekly_polls" to "service_role";

grant insert on table "public"."weekly_polls" to "service_role";

grant references on table "public"."weekly_polls" to "service_role";

grant select on table "public"."weekly_polls" to "service_role";

grant trigger on table "public"."weekly_polls" to "service_role";

grant truncate on table "public"."weekly_polls" to "service_role";

grant update on table "public"."weekly_polls" to "service_role";


  create policy "Public Insert Analytics"
  on "public"."analytics_events"
  as permissive
  for insert
  to public
with check ((auth.role() = ANY (ARRAY['anon'::text, 'authenticated'::text])));



  create policy "System Only Access"
  on "public"."audit_logs"
  as permissive
  for all
  to public
using ((auth.role() = 'service_role'::text))
with check ((auth.role() = 'service_role'::text));



  create policy "Admin/Mod can update comments"
  on "public"."comments"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'moderator'::public.user_role]))))))
with check ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'moderator'::public.user_role]))))));



  create policy "Admin/Mod can view all comments"
  on "public"."comments"
  as permissive
  for select
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role = ANY (ARRAY['admin'::public.user_role, 'moderator'::public.user_role]))))));



  create policy "Public Insert Comments"
  on "public"."comments"
  as permissive
  for insert
  to public
with check ((auth.role() = ANY (ARRAY['anon'::text, 'authenticated'::text])));



  create policy "Public Read Comments"
  on "public"."comments"
  as permissive
  for select
  to public
using (true);



  create policy "Public can view approved comments"
  on "public"."comments"
  as permissive
  for select
  to public
using ((status = 'approved'::public.comment_status));



  create policy "Public Read Chapters"
  on "public"."consultation_chapters"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read DocTypes"
  on "public"."document_types"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Documents"
  on "public"."documents"
  as permissive
  for select
  to public
using (true);



  create policy "Public Insert Registrations"
  on "public"."event_registrations"
  as permissive
  for insert
  to public
with check ((auth.role() = ANY (ARRAY['anon'::text, 'authenticated'::text])));



  create policy "Public Read Events"
  on "public"."events"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Legal"
  on "public"."legal_pages"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Map Cats"
  on "public"."map_categories"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Map Layers"
  on "public"."map_layers"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Instruments"
  on "public"."official_instruments"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Poll Options"
  on "public"."poll_options"
  as permissive
  for select
  to public
using (true);



  create policy "Public categories are viewable by everyone"
  on "public"."post_categories"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Posts"
  on "public"."posts"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Phases"
  on "public"."process_phases"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Profiles"
  on "public"."profiles"
  as permissive
  for select
  to public
using (true);



  create policy "Public Read Polls"
  on "public"."weekly_polls"
  as permissive
  for select
  to public
using (true);


CREATE TRIGGER set_folio_before_insert BEFORE INSERT ON public.comments FOR EACH ROW EXECUTE FUNCTION public.generate_folio();

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


  create policy "Admin Upload GeoData"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'geo-data'::text) AND (auth.role() = 'authenticated'::text)));



  create policy "Public Access Evidences"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'evidences'::text));



  create policy "Public Access GeoData"
  on "storage"."objects"
  as permissive
  for select
  to public
using ((bucket_id = 'geo-data'::text));



  create policy "Public Upload Evidences"
  on "storage"."objects"
  as permissive
  for insert
  to public
with check (((bucket_id = 'evidences'::text) AND ((auth.role() = 'anon'::text) OR (auth.role() = 'authenticated'::text))));


CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


