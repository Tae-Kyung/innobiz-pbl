-- Companies
CREATE TABLE innobiz_companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_number TEXT,
  industry TEXT,
  main_products TEXT,
  org_chart_url TEXT,
  contact_name TEXT,
  contact_dept TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  training_center_name TEXT,
  address TEXT,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered','diagnosing','interviewing','reporting','planning','completed')),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Diagnosis scores (Form 1)
CREATE TABLE innobiz_diagnosis_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  area TEXT NOT NULL CHECK (area IN ('strategy','organization','people','culture','data','infrastructure','governance')),
  item_index INT NOT NULL,
  score INT NOT NULL CHECK (score >= 1 AND score <= 5),
  diagnosed_at DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, area, item_index)
);

-- Interviews (Form 2)
CREATE TABLE innobiz_interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  area TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'common',
  question TEXT NOT NULL,
  answer TEXT,
  sort_order INT DEFAULT 0,
  interview_date DATE,
  interview_location TEXT,
  attendees JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Workflow redesigns (Form 2 Part II)
CREATE TABLE innobiz_workflow_redesigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  department TEXT NOT NULL,
  job_title TEXT NOT NULL,
  duties JSONB DEFAULT '[]',
  expected_effects JSONB DEFAULT '[]',
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Consulting logs (Form 3)
CREATE TABLE innobiz_consulting_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  session_number INT NOT NULL CHECK (session_number >= 1 AND session_number <= 8),
  meeting_date DATE,
  meeting_method TEXT DEFAULT 'face_to_face',
  meeting_location TEXT,
  attendees JSONB DEFAULT '{}',
  diagnosis_area TEXT,
  content TEXT,
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id, session_number)
);

-- Consulting reports (Form 4)
CREATE TABLE innobiz_consulting_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  report_date DATE,
  content JSONB DEFAULT '{}',
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id)
);

-- Training plans (Form 5)
CREATE TABLE innobiz_training_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES innobiz_companies(id) ON DELETE CASCADE,
  course_name TEXT,
  ncs_code TEXT,
  training_hours INT,
  trainee_count INT,
  training_job TEXT,
  training_goal TEXT,
  training_period_start DATE,
  training_period_end DATE,
  content JSONB DEFAULT '{}',
  learning_group JSONB DEFAULT '[]',
  facilities JSONB DEFAULT '[]',
  instructors JSONB DEFAULT '[]',
  is_generated BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(company_id)
);
