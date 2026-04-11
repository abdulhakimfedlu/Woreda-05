export const services = [
  {
    id: 'id-renewal',
    name: 'ID Card Renewal',
    category: 'Documentation',
    officeNumber: 'Office 101, Floor 1',
    officer: {
      name: 'Abebe Bekele',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      role: 'Chief Registrar'
    },
    requirements: [
      'Original Expired ID Card',
      'Two Recent Passport-Sized Photos',
      'Proof of Residency (Last 3 Months Utility Bill)',
      'Renewal Fee Receipt'
    ],
    contact: {
      phone: '+251 118 456 789',
      email: 'documentation@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Renew your national identification card for voting, banking, and legal purposes.'
  },
  {
    id: 'birth-certificate',
    name: 'Birth Certificate Issuance',
    category: 'Documentation',
    officeNumber: 'Office 102, Floor 1',
    officer: {
      name: 'Selamawit Tadesse',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      role: 'Vital Records Officer'
    },
    requirements: [
      'Hospital Birth Notification',
      'IDs of Both Parents',
      'Marriage Certificate of Parents',
      'Affidavit if Birth happened over 1 month ago'
    ],
    contact: {
      phone: '+251 118 456 790',
      email: 'vitalrecords@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Official registration and issuance of birth certificates for newborns.'
  },
  {
    id: 'marriage-registration',
    name: 'Marriage Registration',
    category: 'Legal',
    officeNumber: 'Office 201, Floor 2',
    officer: {
      name: 'Dawit Yohannes',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      role: 'Legal Affairs Officer'
    },
    requirements: [
      'IDs of Both Spouses',
      'Three Witnesses with Valid IDs',
      'Proof of Marital Status (Letter of Singleness)',
      'Passport-Sized Photos of Couple'
    ],
    contact: {
      phone: '+251 118 456 791',
      email: 'legal@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Formalize your union with the official Woreda 05 marriage registration.'
  },
  {
    id: 'death-certificate',
    name: 'Death Certificate Issuance',
    category: 'Documentation',
    officeNumber: 'Office 102, Floor 1',
    officer: {
      name: 'Selamawit Tadesse',
      photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop',
      role: 'Vital Records Officer'
    },
    requirements: [
      'Medical Certificate of Death',
      'ID Card of the Deceased',
      'ID Card of the Person Reporting',
      'Burial Permit'
    ],
    contact: {
      phone: '+251 118 456 790',
      email: 'vitalrecords@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Official issuance of death certificates for estate and legal closure.'
  },
  {
    id: 'resident-verification',
    name: 'Resident Verification Letter',
    category: 'Documentation',
    officeNumber: 'Office 105, Floor 1',
    officer: {
      name: 'Marta Hailu',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      role: 'Community Liaison'
    },
    requirements: [
      'Valid National ID Card',
      'House Ownership Document or Rental Agreement',
      'Recent Utility Bill (Electricity/Water)',
      'Letter from Neighborhood Leader'
    ],
    contact: {
      phone: '+251 118 456 792',
      email: 'residency@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Acquire official proof of residence for employment or school applications.'
  },
  {
    id: 'business-license',
    name: 'Business License Application',
    category: 'Commerce',
    officeNumber: 'Office 301, Floor 3',
    officer: {
      name: 'Kassa Tekle',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff3e?q=80&w=400&auto=format&fit=crop',
      role: 'Trade & Licensing Head'
    },
    requirements: [
      'Article of Association',
      'Office Rental Agreement / Land Title',
      'TIN Certificate',
      'Compliance Certificate from Health/Fire'
    ],
    contact: {
      phone: '+251 118 456 793',
      email: 'trade@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Start your entrepreneurship journey with a legitimate business license.'
  },
  {
    id: 'construction-permit',
    name: 'Construction Permit',
    category: 'Urban Planning',
    officeNumber: 'Office 305, Floor 3',
    officer: {
      name: 'Nebiyu Girma',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      role: 'Structural Engineer'
    },
    requirements: [
      'Approved Architectural Plan',
      'Land Title Deed',
      'Environmental Impact Assessment',
      'Structural Calculation Report'
    ],
    contact: {
      phone: '+251 118 456 794',
      email: 'urban@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Required authorization for new buildings or major structural modifications.'
  },
  {
    id: 'trade-fair',
    name: 'Trade Fair Participation',
    category: 'Commerce',
    officeNumber: 'Office 301, Floor 3',
    officer: {
      name: 'Kassa Tekle',
      photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff3e?q=80&w=400&auto=format&fit=crop',
      role: 'Trade & Licensing Head'
    },
    requirements: [
      'Active Business License',
      'Company Profile',
      'Product Sample Photos',
      'Registration Fee'
    ],
    contact: {
      phone: '+251 118 456 793',
      email: 'trade@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Apply to showcase your products in the annual Subcity Trade Expo.'
  },
  {
    id: 'land-title',
    name: 'Land Title Ownership Check',
    category: 'Urban Planning',
    officeNumber: 'Office 306, Floor 3',
    officer: {
      name: 'Nebiyu Girma',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      role: 'Land Records Officer'
    },
    requirements: [
      'Copy of Title Deed',
      'Owner ID Card',
      'Service Request Form',
      'Verification Fee Receipt'
    ],
    contact: {
      phone: '+251 118 456 794',
      email: 'urban@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Verify the authenticity and current status of property titles.'
  },
  {
    id: 'property-tax',
    name: 'Property Tax Payment',
    category: 'Finance',
    officeNumber: 'Finance Window, Floor 1',
    officer: {
      name: 'Sintayehu Kasahun',
      photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
      role: 'Finance Officer'
    },
    requirements: [
      'Previous Tax Receipt',
      'Property ID Number',
      'Owners ID Card',
      'Cash or Certified Payment Order'
    ],
    contact: {
      phone: '+251 118 456 795',
      email: 'finance@woreda05.gov.et'
    },
    hours: 'Monday - Saturday, 8:30 AM - 1:00 PM',
    description: 'Pay your annual property taxes to support local community projects.'
  },
  {
    id: 'water-utility',
    name: 'Water & Utility Support',
    category: 'Services',
    officeNumber: 'Utility Desk, Floor 1',
    officer: {
      name: 'Abeba Tesfaye',
      photo: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=400&auto=format&fit=crop',
      role: 'Utility Coordinator'
    },
    requirements: [
      'Latest Utility Bill',
      'Customer Identification Number',
      'Photo of Faulty Meter (if applicable)',
      'Service Request Form'
    ],
    contact: {
      phone: '+251 118 456 796',
      email: 'utilities@woreda05.gov.et'
    },
    hours: '24/7 Hotline for Emergencies',
    description: 'Report water leakages, faulty meters, or request new utility connections.'
  },
  {
    id: 'social-welfare',
    name: 'Social Welfare Support',
    category: 'Community',
    officeNumber: 'Office 401, Floor 4',
    officer: {
      name: 'Zenash Worku',
      photo: 'https://images.unsplash.com/photo-1594744125914-a7ef63a5a8d0?q=80&w=400&auto=format&fit=crop',
      role: 'Social Worker'
    },
    requirements: [
      'Proof of Income / Disability',
      'Letter of Need from Kebele',
      'Number of Dependents Verification',
      'Medical Records (if applicable)'
    ],
    contact: {
      phone: '+251 118 456 797',
      email: 'welfare@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Financial and logistical support programs for low-income families and citizens with disabilities.'
  },
  {
    id: 'youth-employment',
    name: 'Youth Employment Programs',
    category: 'Community',
    officeNumber: 'Office 402, Floor 4',
    officer: {
      name: 'Elias Temesgen',
      photo: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
      role: 'Youth Coordinator'
    },
    requirements: [
      'Educational Degree/Diploma',
      'National ID Card',
      'Curriculum Vitae (CV)',
      'Proof of Unemployment'
    ],
    contact: {
      phone: '+251 118 456 798',
      email: 'youth@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Job matching, training workshops, and apprenticeship opportunities for youth.'
  },
  {
    id: 'educational-sponsorship',
    name: 'Educational Sponsorship',
    category: 'Education',
    officeNumber: 'Office 405, Floor 4',
    officer: {
      name: 'Professor Kebede',
      photo: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?q=80&w=400&auto=format&fit=crop',
      role: 'Education Director'
    },
    requirements: [
      'Student Academic Records',
      'Family Income Statement',
      'Recommendation from School Principal',
      'Admissions Letter'
    ],
    contact: {
      phone: '+251 118 456 799',
      email: 'edu@woreda05.gov.et'
    },
    hours: 'Term-Based, 9:00 AM - 4:00 PM',
    description: 'Scholarship and grant applications for top-performing students from underprivileged backgrounds.'
  },
  {
    id: 'healthcare-access',
    name: 'Healthcare Access Information',
    category: 'Health',
    officeNumber: 'Office 501, Floor 5',
    officer: {
      name: 'Dr. Hana Samuel',
      photo: 'https://images.unsplash.com/photo-1559839734-2b71f153678e?q=80&w=400&auto=format&fit=crop',
      role: 'Public Health Officer'
    },
    requirements: [
      'Resident Identification',
      'Vaccination Records (if child)',
      'Previous Medical History summary',
      'Registration Card'
    ],
    contact: {
      phone: '+251 118 456 800',
      email: 'health@woreda05.gov.et'
    },
    hours: 'Daily, 8:30 AM - 8:30 PM',
    description: 'Guidance on local clinic locations, community health initiatives, and immunization schedules.'
  },
  {
    id: 'agricultural-advisory',
    name: 'Agricultural Advisory',
    category: 'Economy',
    officeNumber: 'Office 505, Floor 5',
    officer: {
      name: 'Farmer Tarekegn',
      photo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop',
      role: 'Agri-Extension Lead'
    },
    requirements: [
      'Land Ownership Proof',
      'List of Current Crops',
      'Soil Sample Report (if applicable)',
      'Membership in Farmers Cooperative'
    ],
    contact: {
      phone: '+251 118 456 801',
      email: 'agri@woreda05.gov.et'
    },
    hours: 'Seasonal, Field Visits on Fridays',
    description: 'Subsidized fertilizer, seeds, and technical training for urban and suburban farmers.'
  },
  {
    id: 'environmental-protection',
    name: 'Environmental Protection Services',
    category: 'Urban Planning',
    officeNumber: 'Office 305, Floor 3',
    officer: {
      name: 'Nebiyu Girma',
      photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop',
      role: 'Environmental Officer'
    },
    requirements: [
      'Waste Management Plan (Business)',
      'Environmental Impact report',
      'Service Request for Tree Planting',
      'Pollution Complaint Report'
    ],
    contact: {
      phone: '+251 118 456 794',
      email: 'urban@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 8:30 AM - 5:30 PM',
    description: 'Waste collection scheduling, environmental permits, and community greening initiatives.'
  },
  {
    id: 'community-group',
    name: 'Community Group Registration',
    category: 'Community',
    officeNumber: 'Office 405, Floor 4',
    officer: {
      name: 'Marta Hailu',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=400&auto=format&fit=crop',
      role: 'Community Liaison'
    },
    requirements: [
      'List of Group Members (IDs required)',
      'Group Bylaws',
      'Mission Statement',
      'Meeting Minutes from First Assembly'
    ],
    contact: {
      phone: '+251 118 456 792',
      email: 'residency@woreda05.gov.et'
    },
    hours: 'Monday - Friday, 9:00 AM - 4:00 PM',
    description: 'Register youth clubs, sports teams, or neighbor-watch groups for official recognition.'
  },
  {
    id: 'emergency-response',
    name: 'Emergency Response Services',
    category: 'Services',
    officeNumber: 'Emergency Hub, Floor 1',
    officer: {
      name: 'Commander Solomon',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      role: 'Disaster Task Force Head'
    },
    requirements: [
      'Verbal Report (Telephonic)',
      'Location of Emergency',
      'Identification of Reporter (Safe conditions)',
      'Brief Description of Incident'
    ],
    contact: {
      phone: '991 (Hotline)',
      email: 'emergency@woreda05.gov.et'
    },
    hours: '24/7/365',
    description: 'Fire, medical, or security emergency coordination for the Woreda residents.'
  },
  {
    id: 'legal-aid',
    name: 'Legal Aid Referrals',
    category: 'Legal',
    officeNumber: 'Office 202, Floor 2',
    officer: {
      name: 'Dawit Yohannes',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
      role: 'Legal Affairs Officer'
    },
    requirements: [
      'Case Summary Document',
      'ID Card of Litigant',
      'Proof of Indigence (Low Income)',
      'Correspondence from Court (if any)'
    ],
    contact: {
      phone: '+251 118 456 791',
      email: 'legal@woreda05.gov.et'
    },
    hours: 'Tuesday & Thursday, 10:00 AM - 3:00 PM',
    description: 'Free legal consultation and referral services for vulnerable citizens in civil matters.'
  }
];
