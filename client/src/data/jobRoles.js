export const JOB_ROLES = [
  // ── Frontend ──
  { id: 'frontend-react',      title: 'Frontend Developer (React)',    category: 'Tech',        skills: ['React', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Redux', 'Tailwind CSS', 'REST APIs', 'Git', 'Webpack', 'Vite', 'Jest', 'Responsive Design', 'React Router', 'Axios'] },
  { id: 'frontend-vue',        title: 'Frontend Developer (Vue)',      category: 'Tech',        skills: ['Vue.js', 'JavaScript', 'TypeScript', 'HTML5', 'CSS3', 'Vuex', 'Pinia', 'Vue Router', 'REST APIs', 'Git', 'Webpack'] },
  { id: 'frontend-angular',    title: 'Frontend Developer (Angular)',  category: 'Tech',        skills: ['Angular', 'TypeScript', 'JavaScript', 'HTML5', 'CSS3', 'RxJS', 'NgRx', 'Angular Material', 'REST APIs', 'Git', 'Jasmine'] },

  // ── Backend ──
  { id: 'backend-node',        title: 'Backend Developer (Node.js)',   category: 'Tech',        skills: ['Node.js', 'Express.js', 'JavaScript', 'TypeScript', 'MongoDB', 'PostgreSQL', 'REST APIs', 'JWT', 'Docker', 'Git', 'Redis', 'Mongoose', 'Prisma'] },
  { id: 'backend-python',      title: 'Backend Developer (Python)',    category: 'Tech',        skills: ['Python', 'Django', 'Flask', 'FastAPI', 'PostgreSQL', 'MySQL', 'REST APIs', 'Docker', 'Git', 'Redis', 'Celery', 'SQLAlchemy'] },
  { id: 'backend-java',        title: 'Java Developer',                category: 'Tech',        skills: ['Java', 'Spring Boot', 'Spring MVC', 'Hibernate', 'Maven', 'Gradle', 'MySQL', 'PostgreSQL', 'REST APIs', 'Microservices', 'Docker', 'Git', 'JUnit', 'Kafka'] },
  { id: 'backend-dotnet',      title: '.NET Developer',                category: 'Tech',        skills: ['C#', '.NET', 'ASP.NET Core', 'Entity Framework', 'SQL Server', 'REST APIs', 'Azure', 'Git', 'Docker', 'LINQ', 'SignalR'] },
  { id: 'backend-php',         title: 'PHP Developer',                 category: 'Tech',        skills: ['PHP', 'Laravel', 'MySQL', 'REST APIs', 'JavaScript', 'HTML', 'CSS', 'Git', 'Composer', 'Redis', 'Blade Templates'] },
  { id: 'backend-go',          title: 'Go Developer',                  category: 'Tech',        skills: ['Go', 'Gin', 'PostgreSQL', 'Docker', 'Kubernetes', 'REST APIs', 'gRPC', 'Git', 'Redis', 'Goroutines', 'Microservices'] },

  // ── Fullstack ──
  { id: 'fullstack-mern',      title: 'MERN Stack Developer',          category: 'Tech',        skills: ['MongoDB', 'Express.js', 'React', 'Node.js', 'JavaScript', 'TypeScript', 'REST APIs', 'JWT', 'Git', 'HTML5', 'CSS3', 'Redux', 'Mongoose'] },
  { id: 'fullstack-mean',      title: 'MEAN Stack Developer',          category: 'Tech',        skills: ['MongoDB', 'Express.js', 'Angular', 'Node.js', 'TypeScript', 'REST APIs', 'JWT', 'Git', 'RxJS'] },
  { id: 'fullstack-general',   title: 'Full Stack Developer',          category: 'Tech',        skills: ['JavaScript', 'React', 'Node.js', 'SQL', 'REST APIs', 'Git', 'Docker', 'HTML5', 'CSS3', 'TypeScript', 'PostgreSQL'] },

  // ── Mobile ──
  { id: 'mobile-rn',           title: 'React Native Developer',        category: 'Tech',        skills: ['React Native', 'JavaScript', 'TypeScript', 'React', 'Redux', 'REST APIs', 'Git', 'Expo', 'Firebase', 'AsyncStorage', 'Navigation'] },
  { id: 'mobile-flutter',      title: 'Flutter Developer',             category: 'Tech',        skills: ['Flutter', 'Dart', 'Firebase', 'REST APIs', 'Git', 'Android', 'iOS', 'Provider', 'Bloc', 'GetX', 'Hive'] },
  { id: 'mobile-ios',          title: 'iOS Developer',                 category: 'Tech',        skills: ['Swift', 'SwiftUI', 'UIKit', 'Xcode', 'Core Data', 'REST APIs', 'Git', 'Objective-C', 'Combine', 'TestFlight', 'CocoaPods'] },
  { id: 'mobile-android',      title: 'Android Developer',             category: 'Tech',        skills: ['Kotlin', 'Java', 'Android SDK', 'Jetpack Compose', 'Room', 'REST APIs', 'Git', 'Firebase', 'MVVM', 'Retrofit', 'Coroutines'] },

  // ── DevOps / Cloud ──
  { id: 'devops',              title: 'DevOps Engineer',               category: 'Tech',        skills: ['Docker', 'Kubernetes', 'CI/CD', 'Jenkins', 'GitHub Actions', 'AWS', 'Linux', 'Terraform', 'Git', 'Ansible', 'Prometheus', 'Grafana', 'Bash', 'Helm'] },
  { id: 'cloud-aws',           title: 'AWS Cloud Engineer',            category: 'Tech',        skills: ['AWS', 'EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'IAM', 'VPC', 'EKS', 'Docker', 'Terraform', 'Python', 'CloudWatch'] },
  { id: 'cloud-azure',         title: 'Azure Cloud Engineer',          category: 'Tech',        skills: ['Azure', 'Azure DevOps', 'ARM Templates', 'Azure Functions', 'Azure Blob Storage', 'Docker', 'Kubernetes', 'Terraform', 'PowerShell', 'Azure AD'] },
  { id: 'sre',                 title: 'Site Reliability Engineer',     category: 'Tech',        skills: ['Linux', 'Python', 'Go', 'Kubernetes', 'Docker', 'Prometheus', 'Grafana', 'CI/CD', 'Terraform', 'Incident Management', 'SLO/SLA', 'On-call'] },

  // ── Data / AI ──
  { id: 'data-scientist',      title: 'Data Scientist',                category: 'Tech',        skills: ['Python', 'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'SQL', 'Statistics', 'Data Visualization', 'Scikit-learn', 'Jupyter', 'Feature Engineering', 'A/B Testing'] },
  { id: 'data-analyst',        title: 'Data Analyst',                  category: 'Tech',        skills: ['SQL', 'Python', 'Excel', 'Power BI', 'Tableau', 'Data Visualization', 'Statistics', 'Pandas', 'Google Analytics', 'Data Cleaning', 'Dashboard Design'] },
  { id: 'data-engineer',       title: 'Data Engineer',                 category: 'Tech',        skills: ['Python', 'SQL', 'Apache Spark', 'Kafka', 'Airflow', 'AWS', 'ETL', 'PostgreSQL', 'Docker', 'dbt', 'Snowflake', 'BigQuery', 'Data Pipelines'] },
  { id: 'ml-engineer',         title: 'ML Engineer',                   category: 'Tech',        skills: ['Python', 'TensorFlow', 'PyTorch', 'Scikit-learn', 'MLOps', 'Docker', 'Kubernetes', 'SQL', 'Feature Engineering', 'Model Deployment', 'MLflow', 'FastAPI'] },
  { id: 'ai-engineer',         title: 'AI Engineer',                   category: 'Tech',        skills: ['Python', 'LLMs', 'OpenAI API', 'LangChain', 'Vector Databases', 'Prompt Engineering', 'RAG', 'FastAPI', 'Docker', 'Hugging Face', 'Embeddings'] },

  // ── Security ──
  { id: 'cybersecurity',       title: 'Cybersecurity Analyst',         category: 'Tech',        skills: ['Network Security', 'SIEM', 'Penetration Testing', 'Firewalls', 'Linux', 'Python', 'Incident Response', 'OWASP', 'Vulnerability Assessment', 'Wireshark', 'Nmap', 'SOC'] },
  { id: 'security-engineer',   title: 'Security Engineer',             category: 'Tech',        skills: ['Application Security', 'Penetration Testing', 'Python', 'Linux', 'Cloud Security', 'OWASP', 'Cryptography', 'DevSecOps', 'Burp Suite', 'Zero Trust', 'IAM'] },

  // ── QA ──
  { id: 'qa-engineer',         title: 'QA Engineer',                   category: 'Tech',        skills: ['Manual Testing', 'Selenium', 'Cypress', 'Jest', 'API Testing', 'Postman', 'JIRA', 'Test Planning', 'SQL', 'Git', 'Bug Reporting', 'Test Cases'] },
  { id: 'qa-automation',       title: 'QA Automation Engineer',        category: 'Tech',        skills: ['Selenium', 'Cypress', 'Playwright', 'Python', 'Java', 'TestNG', 'CI/CD', 'API Testing', 'Git', 'Docker', 'BDD', 'Cucumber'] },

  // ── Embedded / Systems ──
  { id: 'embedded',            title: 'Embedded Systems Engineer',     category: 'Tech',        skills: ['C', 'C++', 'RTOS', 'Microcontrollers', 'Arduino', 'Raspberry Pi', 'UART', 'SPI', 'I2C', 'Firmware Development', 'Debugging', 'Assembly', 'Linux Kernel'] },
  { id: 'systems-programmer',  title: 'Systems Programmer',            category: 'Tech',        skills: ['C', 'C++', 'Linux', 'Memory Management', 'Multithreading', 'Sockets', 'Debugging', 'GDB', 'Makefile', 'Assembly', 'OS Concepts', 'Performance Optimization'] },

  // ── Blockchain ──
  { id: 'blockchain',          title: 'Blockchain Developer',          category: 'Tech',        skills: ['Solidity', 'Ethereum', 'Web3.js', 'Hardhat', 'Smart Contracts', 'DeFi', 'NFT', 'IPFS', 'JavaScript', 'Truffle', 'MetaMask', 'Cryptography'] },

  // ── Design ──
  { id: 'ui-ux',               title: 'UI/UX Designer',                category: 'Design',      skills: ['Figma', 'Adobe XD', 'Wireframing', 'Prototyping', 'User Research', 'Usability Testing', 'Design Systems', 'Information Architecture', 'Sketch', 'Zeplin', 'User Flows', 'Accessibility'] },
  { id: 'product-designer',    title: 'Product Designer',              category: 'Design',      skills: ['Figma', 'User Research', 'Prototyping', 'Design Thinking', 'Wireframing', 'A/B Testing', 'Design Systems', 'Journey Mapping', 'Interaction Design', 'Usability Testing'] },
  { id: 'graphic-designer',    title: 'Graphic Designer',              category: 'Design',      skills: ['Adobe Photoshop', 'Adobe Illustrator', 'InDesign', 'Typography', 'Branding', 'Color Theory', 'Figma', 'Print Design', 'Logo Design', 'Canva', 'Visual Identity'] },
  { id: 'motion-designer',     title: 'Motion Designer',               category: 'Design',      skills: ['Adobe After Effects', 'Adobe Premiere Pro', 'Motion Graphics', 'Cinema 4D', 'Storyboarding', 'Animation', 'Figma', 'Video Editing', 'Lottie'] },

  // ── Product / Management ──
  { id: 'product-manager',     title: 'Product Manager',               category: 'Management',  skills: ['Product Roadmap', 'Agile', 'Scrum', 'User Stories', 'Stakeholder Management', 'Data Analysis', 'SQL', 'Jira', 'A/B Testing', 'Market Research', 'OKRs', 'Prioritization', 'Go-to-Market Strategy'] },
  { id: 'project-manager',     title: 'Project Manager',               category: 'Management',  skills: ['Project Planning', 'Agile', 'Scrum', 'Risk Management', 'Stakeholder Communication', 'Jira', 'Budget Management', 'PMP', 'MS Project', 'Resource Allocation', 'Change Management', 'Gantt Charts'] },
  { id: 'scrum-master',        title: 'Scrum Master',                  category: 'Management',  skills: ['Scrum', 'Agile', 'Kanban', 'Jira', 'Sprint Planning', 'Retrospectives', 'Team Facilitation', 'Conflict Resolution', 'Velocity Tracking', 'Backlog Grooming', 'SAFe'] },
  { id: 'program-manager',     title: 'Program Manager',               category: 'Management',  skills: ['Program Management', 'Strategic Planning', 'Stakeholder Management', 'Risk Management', 'Budget Management', 'Cross-functional Leadership', 'OKRs', 'Reporting', 'Change Management'] },
  { id: 'it-manager',          title: 'IT Manager',                    category: 'Management',  skills: ['IT Infrastructure', 'Team Management', 'Vendor Management', 'ITIL', 'Budgeting', 'Network Administration', 'Cloud Services', 'Security Policies', 'SLA Management', 'Helpdesk Management'] },

  // ── Marketing ──
  { id: 'digital-marketing',   title: 'Digital Marketing Manager',     category: 'Marketing',   skills: ['SEO', 'SEM', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Email Marketing', 'Google Analytics', 'Social Media Marketing', 'CRM', 'Copywriting', 'Marketing Automation', 'HubSpot', 'Conversion Rate Optimization'] },
  { id: 'seo-specialist',      title: 'SEO Specialist',                category: 'Marketing',   skills: ['SEO', 'Google Analytics', 'Google Search Console', 'Keyword Research', 'Link Building', 'Technical SEO', 'On-page SEO', 'Content Strategy', 'Ahrefs', 'SEMrush', 'Schema Markup', 'Core Web Vitals'] },
  { id: 'content-writer',      title: 'Content Writer',                category: 'Marketing',   skills: ['Content Writing', 'SEO Writing', 'Copywriting', 'Research', 'WordPress', 'Social Media', 'Editing', 'Storytelling', 'Blog Writing', 'Grammarly', 'Content Strategy', 'Email Newsletters'] },
  { id: 'social-media',        title: 'Social Media Manager',          category: 'Marketing',   skills: ['Social Media Strategy', 'Content Creation', 'Instagram', 'LinkedIn', 'Facebook Ads', 'Analytics', 'Canva', 'Community Management', 'Influencer Marketing', 'Hootsuite', 'Buffer', 'Reels/Shorts'] },
  { id: 'brand-manager',       title: 'Brand Manager',                 category: 'Marketing',   skills: ['Brand Strategy', 'Market Research', 'Campaign Management', 'Consumer Insights', 'Competitive Analysis', 'Budget Management', 'Creative Briefing', 'Storytelling', 'Cross-functional Collaboration'] },
  { id: 'performance-marketer',title: 'Performance Marketing Manager', category: 'Marketing',   skills: ['Google Ads', 'Facebook Ads', 'Performance Marketing', 'ROI Optimization', 'A/B Testing', 'Retargeting', 'Google Analytics', 'Conversion Tracking', 'Landing Page Optimization', 'CPA/CPL/ROAS'] },

  // ── Finance ──
  { id: 'financial-analyst',   title: 'Financial Analyst',             category: 'Finance',     skills: ['Financial Modeling', 'Excel', 'SQL', 'Power BI', 'Accounting', 'Budgeting', 'Forecasting', 'Valuation', 'Bloomberg', 'DCF Analysis', 'Variance Analysis', 'PowerPoint'] },
  { id: 'accountant',          title: 'Accountant',                    category: 'Finance',     skills: ['Accounting', 'Tally', 'QuickBooks', 'Excel', 'GST', 'Tax Filing', 'Financial Reporting', 'Auditing', 'Accounts Payable', 'Accounts Receivable', 'Bank Reconciliation', 'TDS'] },
  { id: 'investment-banker',   title: 'Investment Banker',             category: 'Finance',     skills: ['Financial Modeling', 'Valuation', 'M&A', 'Excel', 'PowerPoint', 'Capital Markets', 'Due Diligence', 'Bloomberg', 'Pitch Decks', 'LBO Modeling', 'Equity Research'] },
  { id: 'ca',                  title: 'Chartered Accountant (CA)',     category: 'Finance',     skills: ['Auditing', 'Taxation', 'Financial Reporting', 'IFRS', 'Ind AS', 'GST', 'Income Tax', 'Tally', 'Excel', 'Internal Controls', 'Statutory Audit', 'Transfer Pricing'] },
  { id: 'risk-analyst',        title: 'Risk Analyst',                  category: 'Finance',     skills: ['Risk Assessment', 'Financial Modeling', 'Excel', 'SQL', 'Credit Risk', 'Market Risk', 'Operational Risk', 'Basel III', 'VaR', 'Stress Testing', 'Regulatory Compliance'] },
  { id: 'fintech-analyst',     title: 'Fintech Business Analyst',      category: 'Finance',     skills: ['Business Analysis', 'Payments', 'UPI', 'API Integration', 'SQL', 'Excel', 'Agile', 'Jira', 'Requirement Gathering', 'Process Mapping', 'Regulatory Compliance', 'KYC/AML'] },

  // ── HR ──
  { id: 'hr-manager',          title: 'HR Manager',                    category: 'HR',          skills: ['Recruitment', 'Onboarding', 'Performance Management', 'HRMS', 'Labor Law', 'Payroll', 'Employee Relations', 'Training & Development', 'HR Policies', 'Compensation & Benefits', 'Exit Management'] },
  { id: 'recruiter',           title: 'Technical Recruiter',           category: 'HR',          skills: ['Sourcing', 'LinkedIn Recruiting', 'ATS', 'Technical Screening', 'Interviewing', 'Negotiation', 'Boolean Search', 'Job Portals', 'Offer Management', 'Employer Branding', 'Naukri', 'Indeed'] },
  { id: 'hr-business-partner', title: 'HR Business Partner',           category: 'HR',          skills: ['Strategic HR', 'Talent Management', 'Organizational Development', 'Change Management', 'Employee Engagement', 'Succession Planning', 'HR Analytics', 'Stakeholder Management', 'Labor Law'] },
  { id: 'payroll-specialist',  title: 'Payroll Specialist',            category: 'HR',          skills: ['Payroll Processing', 'Statutory Compliance', 'PF/ESI', 'TDS', 'Excel', 'SAP HR', 'Greytip', 'Salary Structuring', 'Full & Final Settlement', 'Attendance Management'] },

  // ── Sales ──
  { id: 'sales-executive',     title: 'Sales Executive',               category: 'Sales',       skills: ['B2B Sales', 'CRM', 'Lead Generation', 'Cold Calling', 'Negotiation', 'Salesforce', 'Pipeline Management', 'Communication', 'Objection Handling', 'Target Achievement', 'Client Relationship'] },
  { id: 'business-dev',        title: 'Business Development Manager',  category: 'Sales',       skills: ['Business Development', 'Partnership Management', 'Market Research', 'Negotiation', 'CRM', 'Proposal Writing', 'Networking', 'Revenue Growth', 'Account Management', 'Go-to-Market Strategy'] },
  { id: 'inside-sales',        title: 'Inside Sales Representative',   category: 'Sales',       skills: ['Inside Sales', 'Cold Calling', 'Email Outreach', 'CRM', 'Lead Qualification', 'Product Demo', 'Salesforce', 'HubSpot', 'Communication', 'Quota Achievement'] },
  { id: 'key-account-manager', title: 'Key Account Manager',           category: 'Sales',       skills: ['Account Management', 'Client Retention', 'Upselling', 'Cross-selling', 'CRM', 'Negotiation', 'Relationship Management', 'Revenue Growth', 'Quarterly Business Reviews'] },

  // ── Healthcare ──
  { id: 'nurse',               title: 'Registered Nurse',              category: 'Healthcare',  skills: ['Patient Care', 'Clinical Assessment', 'IV Therapy', 'EMR', 'BLS', 'ACLS', 'Medication Administration', 'Critical Thinking', 'Wound Care', 'Vital Signs Monitoring', 'Patient Education'] },
  { id: 'doctor',              title: 'Medical Doctor',                category: 'Healthcare',  skills: ['Clinical Diagnosis', 'Patient Management', 'Medical Records', 'Pharmacology', 'EMR', 'Research', 'Communication', 'Differential Diagnosis', 'Treatment Planning', 'ICD Coding'] },
  { id: 'pharmacist',          title: 'Pharmacist',                    category: 'Healthcare',  skills: ['Drug Dispensing', 'Pharmacology', 'Drug Interactions', 'Patient Counseling', 'Inventory Management', 'Regulatory Compliance', 'Clinical Pharmacy', 'Prescription Review'] },
  { id: 'health-analyst',      title: 'Healthcare Data Analyst',       category: 'Healthcare',  skills: ['SQL', 'Excel', 'Power BI', 'Healthcare Analytics', 'EMR Systems', 'ICD Coding', 'HIPAA', 'Data Visualization', 'Python', 'Clinical Data Management'] },

  // ── Education ──
  { id: 'teacher',             title: 'School Teacher',                category: 'Education',   skills: ['Lesson Planning', 'Classroom Management', 'Curriculum Development', 'Student Assessment', 'Communication', 'MS Office', 'E-learning', 'Differentiated Instruction', 'Parent Communication', 'Google Classroom'] },
  { id: 'corporate-trainer',   title: 'Corporate Trainer',             category: 'Education',   skills: ['Training Design', 'Facilitation', 'LMS', 'Content Development', 'Presentation', 'Needs Assessment', 'E-learning', 'Articulate 360', 'Instructional Design', 'Training Evaluation'] },
  { id: 'instructional-designer', title: 'Instructional Designer',     category: 'Education',   skills: ['Instructional Design', 'ADDIE Model', 'Articulate Storyline', 'E-learning Development', 'LMS', 'Storyboarding', 'Content Writing', 'Adobe Captivate', 'Bloom\'s Taxonomy'] },

  // ── Operations ──
  { id: 'operations-manager',  title: 'Operations Manager',            category: 'Operations',  skills: ['Process Improvement', 'Supply Chain', 'Budgeting', 'Team Management', 'KPI Tracking', 'ERP', 'Lean', 'Six Sigma', 'Vendor Management', 'SOP Development', 'Root Cause Analysis'] },
  { id: 'supply-chain',        title: 'Supply Chain Manager',          category: 'Operations',  skills: ['Supply Chain Management', 'Logistics', 'Inventory Management', 'ERP', 'SAP', 'Vendor Management', 'Demand Forecasting', 'Procurement', 'Warehouse Management', 'S&OP', 'Cost Reduction'] },
  { id: 'logistics-manager',   title: 'Logistics Manager',             category: 'Operations',  skills: ['Logistics', 'Fleet Management', 'Warehouse Operations', 'Last-mile Delivery', 'Route Optimization', 'ERP', 'SAP', 'Inventory Control', 'Freight Management', 'Import/Export'] },
  { id: 'business-analyst',    title: 'Business Analyst',              category: 'Operations',  skills: ['Requirement Gathering', 'Business Process Mapping', 'SQL', 'Excel', 'Jira', 'Agile', 'Stakeholder Management', 'Use Cases', 'Wireframing', 'Gap Analysis', 'BRD/FRD Writing', 'Power BI'] },

  // ── Legal ──
  { id: 'corporate-lawyer',    title: 'Corporate Lawyer',              category: 'Legal',       skills: ['Contract Drafting', 'Corporate Law', 'M&A', 'Due Diligence', 'Regulatory Compliance', 'Legal Research', 'Negotiation', 'Company Law', 'SEBI Regulations', 'Litigation'] },
  { id: 'legal-analyst',       title: 'Legal Analyst',                 category: 'Legal',       skills: ['Legal Research', 'Contract Review', 'Compliance', 'Documentation', 'MS Office', 'Legal Drafting', 'Regulatory Analysis', 'Intellectual Property', 'Data Privacy Law'] },

  // ── Customer Success ──
  { id: 'customer-success',    title: 'Customer Success Manager',      category: 'Customer',    skills: ['Customer Onboarding', 'Account Management', 'CRM', 'Churn Reduction', 'NPS', 'Upselling', 'Product Adoption', 'Stakeholder Communication', 'Salesforce', 'HubSpot', 'QBR Presentations'] },
  { id: 'customer-support',    title: 'Customer Support Specialist',   category: 'Customer',    skills: ['Customer Service', 'Ticketing Systems', 'Zendesk', 'Freshdesk', 'Communication', 'Problem Solving', 'CRM', 'Email Support', 'Live Chat', 'Escalation Management', 'SLA Adherence'] },
];

export const CATEGORIES = [...new Set(JOB_ROLES.map(r => r.category))];
