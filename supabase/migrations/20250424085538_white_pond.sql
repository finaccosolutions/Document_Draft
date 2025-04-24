/*
  # Create templates table

  1. New Tables
    - `templates`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text)
      - `html_content` (text, required)
      - `placeholders` (jsonb array, default empty)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `created_by` (uuid, references profiles.id)

  2. Security
    - Enable RLS
    - Add policies for:
      - Admins can manage templates
      - All users can view templates
*/

-- Create templates table
CREATE TABLE public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  html_content TEXT NOT NULL,
  placeholders JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES profiles(id)
);

-- Enable RLS
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Admins can manage templates"
  ON public.templates
  FOR ALL
  USING ((SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "All users can view templates"
  ON public.templates
  FOR SELECT
  TO public
  USING (true);

-- Create updated_at trigger
CREATE TRIGGER templates_updated_at
  BEFORE UPDATE ON public.templates
  FOR EACH ROW
  EXECUTE FUNCTION handle_updated_at();

-- Insert sample templates
INSERT INTO public.templates (
  title,
  description,
  html_content,
  placeholders,
  created_by
) VALUES (
  'Basic Employment Contract',
  'A standard employment contract template for full-time employees.',
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
  (SELECT id FROM profiles WHERE role = 'admin' LIMIT 1)
);