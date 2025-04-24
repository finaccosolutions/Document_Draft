/*
  # Document Management System Tables

  1. New Tables
    - `categories`
      - For organizing templates by type
      - Includes name, description, and icon
    
    - `templates`
      - Document templates with HTML content and form schema
      - References category and creator
    
    - `documents`
      - Generated documents from templates
      - Stores form data and generated content
      - Tracks creation and updates

  2. Security
    - Enable RLS on all tables
    - Add policies for user and admin access
*/

-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id),
  html_content TEXT NOT NULL,
  placeholders JSONB NOT NULL DEFAULT '[]',
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  template_id UUID NOT NULL REFERENCES templates(id),
  form_data JSONB NOT NULL DEFAULT '{}',
  generated_content TEXT NOT NULL,
  created_by UUID NOT NULL REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage categories"
  ON public.categories
  FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Templates policies
CREATE POLICY "Templates are viewable by everyone"
  ON public.templates
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Only admins can manage templates"
  ON public.templates
  FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Documents policies
CREATE POLICY "Users can view their own documents"
  ON public.documents
  FOR SELECT
  USING (auth.uid() = created_by);

CREATE POLICY "Users can create documents"
  ON public.documents
  FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own documents"
  ON public.documents
  FOR UPDATE
  USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own documents"
  ON public.documents
  FOR DELETE
  USING (auth.uid() = created_by);

CREATE POLICY "Admins can view all documents"
  ON public.documents
  FOR SELECT
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

-- Create updated_at triggers
CREATE TRIGGER categories_updated_at
  BEFORE UPDATE ON public.categories
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

CREATE TRIGGER documents_updated_at
  BEFORE UPDATE ON public.documents
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample categories
INSERT INTO public.categories (name, description, icon) VALUES
  ('Legal Documents', 'Legal contracts, agreements, and forms', 'file-text'),
  ('Business Contracts', 'Contracts for business relationships and transactions', 'file-text'),
  ('HR Templates', 'Human resources documents and employee forms', 'file-text'),
  ('Financial Forms', 'Financial documentation and reporting templates', 'file-text');

-- Insert sample template
INSERT INTO public.templates (
  title,
  description,
  category_id,
  html_content,
  placeholders,
  is_public,
  created_by
) VALUES (
  'Basic Employment Contract',
  'A standard employment contract template for full-time employees.',
  (SELECT id FROM categories WHERE name = 'HR Templates'),
  '<h1>EMPLOYMENT AGREEMENT</h1>
<p>This Employment Agreement (the "Agreement") is made and entered into as of {{terms.startDate}}, by and between {{company.companyName}} (the "Company"), located at {{company.companyAddress}} and {{employee.employeeName}} (the "Employee"), located at {{employee.employeeAddress}}.</p>
<h2>1. POSITION AND DUTIES</h2>
<p>The Company agrees to employ the Employee as a {{terms.position}}. The Employee shall perform all duties and responsibilities inherent in the position, which may be reasonably assigned by the Company.</p>
<h2>2. TERM</h2>
<p>The Employee''s employment under this Agreement shall commence on {{terms.startDate}} and shall continue until terminated pursuant to the provisions of this Agreement.</p>
<h2>3. COMPENSATION</h2>
<p>The Employee shall receive an annual salary of {{terms.salary}}, payable on a {{terms.paySchedule}} basis.</p>
<h2>4. BENEFITS</h2>
<p>The Employee shall be entitled to the following benefits:</p>
<ul>
  {{#if benefits.healthInsurance}}<li>Health Insurance</li>{{/if}}
  {{#if benefits.dentalInsurance}}<li>Dental Insurance</li>{{/if}}
  {{#if benefits.retirement401k}}<li>401(k) Retirement Plan</li>{{/if}}
  {{#if benefits.paidTimeOff}}<li>{{benefits.paidTimeOff}} days of Paid Time Off per year</li>{{/if}}
</ul>',
  '[
    {
      "id": "company",
      "title": "Company Information",
      "fields": [
        {"id": "companyName", "label": "Company Name", "type": "text", "required": true},
        {"id": "companyAddress", "label": "Company Address", "type": "textarea", "required": true},
        {"id": "companyPhone", "label": "Company Phone", "type": "text", "required": true}
      ]
    },
    {
      "id": "employee",
      "title": "Employee Information", 
      "fields": [
        {"id": "employeeName", "label": "Employee Name", "type": "text", "required": true},
        {"id": "employeeAddress", "label": "Employee Address", "type": "textarea", "required": true},
        {"id": "employeePhone", "label": "Employee Phone", "type": "text", "required": true},
        {"id": "employeeEmail", "label": "Employee Email", "type": "email", "required": true}
      ]
    },
    {
      "id": "terms",
      "title": "Employment Terms",
      "fields": [
        {"id": "position", "label": "Position Title", "type": "text", "required": true},
        {"id": "startDate", "label": "Start Date", "type": "date", "required": true},
        {"id": "salary", "label": "Annual Salary", "type": "number", "required": true},
        {"id": "paySchedule", "label": "Pay Schedule", "type": "select", "required": true, 
         "options": [
           {"value": "weekly", "label": "Weekly"},
           {"value": "biweekly", "label": "Bi-weekly"},
           {"value": "monthly", "label": "Monthly"}
         ]
        }
      ]
    },
    {
      "id": "benefits",
      "title": "Benefits",
      "fields": [
        {"id": "healthInsurance", "label": "Health Insurance", "type": "checkbox"},
        {"id": "dentalInsurance", "label": "Dental Insurance", "type": "checkbox"},
        {"id": "retirement401k", "label": "401(k) Plan", "type": "checkbox"},
        {"id": "paidTimeOff", "label": "Paid Time Off (days/year)", "type": "number", "required": true}
      ]
    }
  ]',
  true,
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);