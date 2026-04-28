-- Modelo de base de datos para Rutina360 (PostgreSQL)
-- Escenario: profesor crea rutinas y las asigna a alumnos.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================
-- Tipos
-- =========================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE user_role AS ENUM ('admin', 'coach', 'athlete');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'routine_visibility') THEN
    CREATE TYPE routine_visibility AS ENUM ('private', 'shared', 'public');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'assignment_status') THEN
    CREATE TYPE assignment_status AS ENUM ('draft', 'active', 'paused', 'completed', 'cancelled');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'note_type') THEN
    CREATE TYPE note_type AS ENUM ('text', 'nutrition', 'comment', 'coach_feedback');
  END IF;
END$$;

-- =========================
-- Usuarios y relaciones
-- =========================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(180) UNIQUE NOT NULL,
  password_hash TEXT,
  role user_role NOT NULL DEFAULT 'athlete',
  age SMALLINT,
  height_cm SMALLINT,
  weight_kg NUMERIC(5,2),
  gender VARCHAR(30),
  goals TEXT,
  weekly_availability VARCHAR(120),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS coach_athlete (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  coach_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (coach_id, athlete_id),
  CHECK (coach_id <> athlete_id)
);

-- =========================
-- Catálogo de ejercicios
-- =========================
CREATE TABLE IF NOT EXISTS muscle_groups (
  id SMALLSERIAL PRIMARY KEY,
  slug VARCHAR(40) UNIQUE NOT NULL,
  name VARCHAR(80) NOT NULL
);

CREATE TABLE IF NOT EXISTS exercise_catalog (
  id BIGSERIAL PRIMARY KEY,
  external_code VARCHAR(50),
  name VARCHAR(140) NOT NULL,
  muscle_group_id SMALLINT NOT NULL REFERENCES muscle_groups(id),
  default_execution_seconds SMALLINT NOT NULL CHECK (default_execution_seconds > 0),
  description TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (name, muscle_group_id)
);

-- =========================
-- Rutinas (plantillas)
-- =========================
CREATE TABLE IF NOT EXISTS routine_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  name VARCHAR(140) NOT NULL,
  description TEXT,
  visibility routine_visibility NOT NULL DEFAULT 'private',
  estimated_total_seconds INTEGER NOT NULL DEFAULT 0 CHECK (estimated_total_seconds >= 0),
  version INTEGER NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routine_template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_template_id UUID NOT NULL REFERENCES routine_templates(id) ON DELETE CASCADE,
  exercise_catalog_id BIGINT NOT NULL REFERENCES exercise_catalog(id) ON DELETE RESTRICT,
  order_index SMALLINT NOT NULL CHECK (order_index > 0),
  sets_planned SMALLINT NOT NULL CHECK (sets_planned > 0),
  rest_seconds SMALLINT NOT NULL CHECK (rest_seconds > 0),
  execution_seconds SMALLINT NOT NULL CHECK (execution_seconds > 0),
  coach_note TEXT,
  UNIQUE (routine_template_id, order_index)
);

-- =========================
-- Asignación de rutinas
-- =========================
CREATE TABLE IF NOT EXISTS routine_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  routine_template_id UUID NOT NULL REFERENCES routine_templates(id) ON DELETE RESTRICT,
  athlete_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assigned_by UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  status assignment_status NOT NULL DEFAULT 'active',
  start_date DATE,
  end_date DATE,
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CHECK (end_date IS NULL OR start_date IS NULL OR end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_routine_assignments_athlete_status
  ON routine_assignments (athlete_id, status);

-- Progreso por ejercicio dentro de una asignación
CREATE TABLE IF NOT EXISTS assignment_exercise_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id UUID NOT NULL REFERENCES routine_assignments(id) ON DELETE CASCADE,
  routine_template_exercise_id UUID NOT NULL REFERENCES routine_template_exercises(id) ON DELETE CASCADE,
  completed_sets SMALLINT NOT NULL DEFAULT 0 CHECK (completed_sets >= 0),
  is_finished BOOLEAN NOT NULL DEFAULT FALSE,
  athlete_note TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (assignment_id, routine_template_exercise_id)
);

-- =========================
-- Notas (opcional para dashboard)
-- =========================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  assignment_id UUID REFERENCES routine_assignments(id) ON DELETE SET NULL,
  title VARCHAR(160),
  type note_type NOT NULL DEFAULT 'text',
  content TEXT NOT NULL,
  note_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =========================
-- Semillas mínimas de grupos musculares
-- =========================
INSERT INTO muscle_groups (slug, name) VALUES
  ('pecho', 'Pecho'),
  ('espalda', 'Espalda'),
  ('hombros', 'Hombros'),
  ('biceps', 'Biceps'),
  ('triceps', 'Triceps'),
  ('antebrazos', 'Antebrazos'),
  ('cuadriceps', 'Cuadriceps'),
  ('isquiotibiales', 'Isquiotibiales'),
  ('gluteos', 'Gluteos'),
  ('aductores', 'Aductores'),
  ('gemelos', 'Gemelos'),
  ('abdominales', 'Abdominales'),
  ('lumbares', 'Lumbares')
ON CONFLICT (slug) DO NOTHING;
