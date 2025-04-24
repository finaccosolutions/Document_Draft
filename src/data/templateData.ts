// Mock data for templates and categories

export const categories = [
  {
    id: 'legal',
    name: 'Legal Documents',
  },
  {
    id: 'business',
    name: 'Business Reports',
  },
  {
    id: 'hr',
    name: 'HR Templates',
  },
  {
    id: 'financial',
    name: 'Financial Documents',
  },
  {
    id: 'marketing',
    name: 'Marketing Materials',
  },
  {
    id: 'certificates',
    name: 'Certificates',
  },
];

export const templates = [
  {
    id: 'nda-agreement',
    name: 'Non-Disclosure Agreement',
    description: 'A standard NDA template for protecting confidential information shared between parties.',
    categoryId: 'legal',
    fields: [
      { id: 'company_name', label: 'Company Name', type: 'text', required: true },
      { id: 'recipient_name', label: 'Recipient Name', type: 'text', required: true },
      { id: 'effective_date', label: 'Effective Date', type: 'date', required: true },
      { id: 'governing_law', label: 'Governing Law State', type: 'text', required: true },
      { id: 'term_months', label: 'Term (Months)', type: 'number', required: true },
      {
        id: 'confidential_info',
        label: 'Confidential Information Examples',
        type: 'textarea',
        required: true,
      },
    ],
    html: `
      <h1>NON-DISCLOSURE AGREEMENT</h1>
      <p>This Non-Disclosure Agreement (this "Agreement") is made and entered into as of {{effective_date}} (the "Effective Date") by and between {{company_name}} ("Company") and {{recipient_name}} ("Recipient").</p>
      
      <h2>1. CONFIDENTIAL INFORMATION</h2>
      <p>"Confidential Information" means any information disclosed by Company to Recipient, including but not limited to:</p>
      <p>{{confidential_info}}</p>
      
      <h2>2. TERM</h2>
      <p>The obligations and limitations set forth herein regarding Confidential Information shall survive for a period of {{term_months}} months from the date of disclosure.</p>
      
      <h2>3. GOVERNING LAW</h2>
      <p>This Agreement shall be governed by the laws of the State of {{governing_law}}.</p>
      
      <div class="signature-section">
        <div class="signature-block">
          <p>{{company_name}}</p>
          <p>Signature: _______________________</p>
          <p>Date: _______________________</p>
        </div>
        
        <div class="signature-block">
          <p>{{recipient_name}}</p>
          <p>Signature: _______________________</p>
          <p>Date: _______________________</p>
        </div>
      </div>
    `,
  },
  {
    id: 'employment-contract',
    name: 'Employment Contract',
    description: 'A comprehensive employment agreement template that covers all essential terms of employment.',
    categoryId: 'hr',
    fields: [
      { id: 'employer_name', label: 'Employer Name', type: 'text', required: true },
      { id: 'employee_name', label: 'Employee Name', type: 'text', required: true },
      { id: 'position', label: 'Position/Title', type: 'text', required: true },
      { id: 'start_date', label: 'Start Date', type: 'date', required: true },
      { id: 'salary', label: 'Annual Salary', type: 'number', required: true },
      { id: 'work_location', label: 'Work Location', type: 'text', required: true },
      { id: 'work_hours', label: 'Work Hours', type: 'text', required: true },
      { id: 'vacation_days', label: 'Vacation Days Per Year', type: 'number', required: true },
    ],
    html: `
      <h1>EMPLOYMENT CONTRACT</h1>
      <p>This Employment Contract (the "Contract") is made and entered into on {{start_date}} by and between:</p>
      
      <p><strong>Employer:</strong> {{employer_name}} ("Employer")</p>
      <p><strong>Employee:</strong> {{employee_name}} ("Employee")</p>
      
      <h2>1. POSITION AND DUTIES</h2>
      <p>The Employee shall be employed in the position of {{position}} and shall perform all duties associated with this position and other duties as may be assigned.</p>
      
      <h2>2. TERM OF EMPLOYMENT</h2>
      <p>Employment under this Contract shall commence on {{start_date}}.</p>
      
      <h2>3. COMPENSATION</h2>
      <p>The Employee shall receive an annual salary of {{salary}} paid in accordance with the Employer's regular payroll schedule.</p>
      
      <h2>4. WORK LOCATION AND HOURS</h2>
      <p>The Employee shall work at {{work_location}} for {{work_hours}}.</p>
      
      <h2>5. VACATION</h2>
      <p>The Employee shall be entitled to {{vacation_days}} days of paid vacation per year.</p>
      
      <div class="signature-section">
        <div class="signature-block">
          <p>{{employer_name}}</p>
          <p>Signature: _______________________</p>
          <p>Date: _______________________</p>
        </div>
        
        <div class="signature-block">
          <p>{{employee_name}}</p>
          <p>Signature: _______________________</p>
          <p>Date: _______________________</p>
        </div>
      </div>
    `,
  },
  {
    id: 'business-proposal',
    name: 'Business Proposal',
    description: 'A professional business proposal template to present your ideas and win new clients.',
    categoryId: 'business',
    fields: [
      { id: 'company_name', label: 'Your Company Name', type: 'text', required: true },
      { id: 'client_name', label: 'Client Name', type: 'text', required: true },
      { id: 'proposal_date', label: 'Proposal Date', type: 'date', required: true },
      { id: 'project_title', label: 'Project Title', type: 'text', required: true },
      { id: 'project_description', label: 'Project Description', type: 'textarea', required: true },
      { id: 'timeline', label: 'Project Timeline', type: 'text', required: true },
      { id: 'total_cost', label: 'Total Cost', type: 'number', required: true },
      {
        id: 'deliverables',
        label: 'Deliverables',
        type: 'repeater',
        required: true,
        fields: [
          { id: 'name', label: 'Deliverable Name', type: 'text' },
          { id: 'description', label: 'Description', type: 'text' },
        ],
      },
    ],
    html: `
      <h1>BUSINESS PROPOSAL</h1>
      <h2>{{project_title}}</h2>
      <p><strong>Prepared by:</strong> {{company_name}}</p>
      <p><strong>Prepared for:</strong> {{client_name}}</p>
      <p><strong>Date:</strong> {{proposal_date}}</p>
      
      <h2>PROJECT OVERVIEW</h2>
      <p>{{project_description}}</p>
      
      <h2>DELIVERABLES</h2>
      <ul>
        {{#each deliverables}}
        <li><strong>{{name}}:</strong> {{description}}</li>
        {{/each}}
      </ul>
      
      <h2>TIMELINE</h2>
      <p>{{timeline}}</p>
      
      <h2>INVESTMENT</h2>
      <p>The total cost for this project is ${{total_cost}}.</p>
      
      <h2>ACCEPTANCE</h2>
      <p>By signing below, the Client agrees to the terms and conditions outlined in this proposal.</p>
      
      <div class="signature-section">
        <div class="signature-block">
          <p>{{client_name}}</p>
          <p>Signature: _______________________</p>
          <p>Date: _______________________</p>
        </div>
      </div>
    `,
  },
  {
    id: 'invoice-template',
    name: 'Professional Invoice',
    description: 'A clean, professional invoice template for billing clients.',
    categoryId: 'financial',
    fields: [
      { id: 'company_name', label: 'Your Company Name', type: 'text', required: true },
      { id: 'company_address', label: 'Your Company Address', type: 'textarea', required: true },
      { id: 'client_name', label: 'Client Name', type: 'text', required: true },
      { id: 'client_address', label: 'Client Address', type: 'textarea', required: true },
      { id: 'invoice_number', label: 'Invoice Number', type: 'text', required: true },
      { id: 'invoice_date', label: 'Invoice Date', type: 'date', required: true },
      { id: 'due_date', label: 'Due Date', type: 'date', required: true },
      {
        id: 'line_items',
        label: 'Items',
        type: 'repeater',
        required: true,
        fields: [
          { id: 'description', label: 'Description', type: 'text' },
          { id: 'quantity', label: 'Quantity', type: 'number' },
          { id: 'unit_price', label: 'Unit Price', type: 'number' },
          { id: 'amount', label: 'Amount', type: 'number' },
        ],
      },
      { id: 'subtotal', label: 'Subtotal', type: 'number', required: true },
      { id: 'tax_rate', label: 'Tax Rate (%)', type: 'number', required: true },
      { id: 'tax_amount', label: 'Tax Amount', type: 'number', required: true },
      { id: 'total', label: 'Total', type: 'number', required: true },
      { id: 'payment_terms', label: 'Payment Terms', type: 'text', required: true },
      { id: 'payment_instructions', label: 'Payment Instructions', type: 'textarea', required: true },
    ],
    html: `
      <div class="invoice-container">
        <div class="invoice-header">
          <div class="company-info">
            <h2>{{company_name}}</h2>
            <p>{{company_address}}</p>
          </div>
          <div class="invoice-info">
            <h1>INVOICE</h1>
            <p><strong>Invoice #:</strong> {{invoice_number}}</p>
            <p><strong>Date:</strong> {{invoice_date}}</p>
            <p><strong>Due Date:</strong> {{due_date}}</p>
          </div>
        </div>
        
        <div class="client-info">
          <h3>Bill To:</h3>
          <p>{{client_name}}</p>
          <p>{{client_address}}</p>
        </div>
        
        <table class="invoice-items">
          <thead>
            <tr>
              <th>Description</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {{#each line_items}}
            <tr>
              <td>{{description}}</td>
              <td>{{quantity}}</td>
              <td>${{unit_price}}</td>
              <td>${{amount}}</td>
            </tr>
            {{/each}}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Subtotal</strong></td>
              <td>${{subtotal}}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right"><strong>Tax ({{tax_rate}}%)</strong></td>
              <td>${{tax_amount}}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right"><strong>Total</strong></td>
              <td>${{total}}</td>
            </tr>
          </tfoot>
        </table>
        
        <div class="invoice-footer">
          <h3>Payment Terms</h3>
          <p>{{payment_terms}}</p>
          <h3>Payment Instructions</h3>
          <p>{{payment_instructions}}</p>
        </div>
      </div>
    `,
  },
  {
    id: 'marketing-plan',
    name: 'Marketing Plan',
    description: 'A comprehensive marketing plan template to outline your marketing strategy.',
    categoryId: 'marketing',
    fields: [
      { id: 'company_name', label: 'Company Name', type: 'text', required: true },
      { id: 'plan_date', label: 'Plan Date', type: 'date', required: true },
      { id: 'executive_summary', label: 'Executive Summary', type: 'textarea', required: true },
      { id: 'target_audience', label: 'Target Audience', type: 'textarea', required: true },
      { id: 'marketing_goals', label: 'Marketing Goals', type: 'textarea', required: true },
      { id: 'budget', label: 'Total Budget', type: 'number', required: true },
      {
        id: 'strategies',
        label: 'Marketing Strategies',
        type: 'repeater',
        required: true,
        fields: [
          { id: 'name', label: 'Strategy Name', type: 'text' },
          { id: 'description', label: 'Description', type: 'textarea' },
          { id: 'timeline', label: 'Timeline', type: 'text' },
          { id: 'budget', label: 'Budget Allocation', type: 'number' },
        ],
      },
    ],
    html: `
      <h1>MARKETING PLAN</h1>
      <p><strong>Company:</strong> {{company_name}}</p>
      <p><strong>Date:</strong> {{plan_date}}</p>
      
      <h2>EXECUTIVE SUMMARY</h2>
      <p>{{executive_summary}}</p>
      
      <h2>TARGET AUDIENCE</h2>
      <p>{{target_audience}}</p>
      
      <h2>MARKETING GOALS</h2>
      <p>{{marketing_goals}}</p>
      
      <h2>MARKETING STRATEGIES</h2>
      {{#each strategies}}
      <div class="strategy">
        <h3>{{name}}</h3>
        <p><strong>Description:</strong> {{description}}</p>
        <p><strong>Timeline:</strong> {{timeline}}</p>
        <p><strong>Budget Allocation:</strong> ${{budget}}</p>
      </div>
      {{/each}}
      
      <h2>TOTAL BUDGET</h2>
      <p>The total marketing budget for this plan is ${{budget}}.</p>
    `,
  },
  {
    id: 'certificate-achievement',
    name: 'Certificate of Achievement',
    description: 'A professional certificate template for recognizing achievements.',
    categoryId: 'certificates',
    fields: [
      { id: 'recipient_name', label: 'Recipient Name', type: 'text', required: true },
      { id: 'achievement', label: 'Achievement Title', type: 'text', required: true },
      { id: 'date_issued', label: 'Date Issued', type: 'date', required: true },
      { id: 'issuing_organization', label: 'Issuing Organization', type: 'text', required: true },
      { id: 'signatory_name', label: 'Signatory Name', type: 'text', required: true },
      { id: 'signatory_title', label: 'Signatory Title', type: 'text', required: true },
    ],
    html: `
      <div class="certificate">
        <div class="certificate-header">
          <h1>CERTIFICATE OF ACHIEVEMENT</h1>
        </div>
        
        <div class="certificate-content">
          <p>This is to certify that</p>
          <h2 class="recipient">{{recipient_name}}</h2>
          <p>has successfully completed</p>
          <h3 class="achievement">{{achievement}}</h3>
          <p>Issued on {{date_issued}}</p>
        </div>
        
        <div class="certificate-footer">
          <div class="signature">
            <p>_______________________</p>
            <p>{{signatory_name}}</p>
            <p>{{signatory_title}}</p>
            <p>{{issuing_organization}}</p>
          </div>
        </div>
      </div>
    `,
  },
];