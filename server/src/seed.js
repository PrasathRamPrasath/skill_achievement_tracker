/**
 * Seed script — inserts dummy students with certs, achievements, internships, activities, projects.
 * Run: node --experimental-vm-modules src/seed.js   (from /server)
 * Or:  node src/seed.js  (if package.json has "type":"module")
 *
 * Safe to re-run: skips emails that already exist.
 */

import mongoose from 'mongoose';
import User          from './models/User.js';
import Certification from './models/Certification.js';
import Achievement   from './models/Achievement.js';
import Internship    from './models/Internship.js';
import Activity      from './models/Activity.js';
import Project       from './models/Project.js';
import envConfig     from './config/envConfig.js';

const MONGO_URI = envConfig.mongodbUri;
if (!MONGO_URI) {
  console.error('❌ MONGODB_URI not set in .env');
  process.exit(1);
}

// ── Student profiles ──────────────────────────────────────────────────────────
const students = [
  {
    name: 'Arjun Kumar',        email: 'arjun.kumar@college.edu',    password: 'demo1234',
    rollNumber: 'CS21001',      department: 'Computer Science',       year: 2,
    phone: '9876543210',        skills: ['Python', 'Django', 'MySQL', 'Docker'],
    careerGoal: 'Backend Engineer at a product startup',
    linkedin: 'https://linkedin.com/in/arjunkumar',
    github:   'https://github.com/arjunkumar',
  },
  {
    name: 'Priya Sharma',       email: 'priya.sharma@college.edu',   password: 'demo1234',
    rollNumber: 'IT21002',      department: 'Information Technology', year: 3,
    phone: '9876543211',        skills: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Figma'],
    careerGoal: 'Full Stack Developer and UI/UX enthusiast',
    linkedin: 'https://linkedin.com/in/priyasharma',
    github:   'https://github.com/priyasharma',
  },
  {
    name: 'Rohit Patel',        email: 'rohit.patel@college.edu',    password: 'demo1234',
    rollNumber: 'ECE21003',     department: 'Electronics & Communication', year: 2,
    phone: '9876543212',        skills: ['Embedded C', 'Arduino', 'MATLAB', 'IoT'],
    careerGoal: 'Embedded Systems Engineer at an automotive company',
  },
  {
    name: 'Sneha Reddy',        email: 'sneha.reddy@college.edu',    password: 'demo1234',
    rollNumber: 'CS20004',      department: 'Computer Science',       year: 4,
    phone: '9876543213',        skills: ['Machine Learning', 'Python', 'TensorFlow', 'SQL', 'Power BI'],
    careerGoal: 'Data Scientist at a fintech company',
    linkedin: 'https://linkedin.com/in/snehareddy',
    github:   'https://github.com/snehareddy',
  },
  {
    name: 'Vikram Singh',       email: 'vikram.singh@college.edu',   password: 'demo1234',
    rollNumber: 'ME22005',      department: 'Mechanical Engineering', year: 1,
    phone: '9876543214',        skills: ['SolidWorks', 'AutoCAD', 'ANSYS'],
    careerGoal: 'Design Engineer at a manufacturing firm',
  },
  {
    name: 'Kavitha Lakshmi',    email: 'kavitha.l@college.edu',      password: 'demo1234',
    rollNumber: 'IT20006',      department: 'Information Technology', year: 3,
    phone: '9876543215',        skills: ['Java', 'Spring Boot', 'AWS', 'Kubernetes', 'Jenkins'],
    careerGoal: 'DevOps / Cloud Engineer',
    github: 'https://github.com/kavithalakshmi',
  },
  {
    name: 'Aditya Menon',       email: 'aditya.menon@college.edu',   password: 'demo1234',
    rollNumber: 'CS21007',      department: 'Computer Science',       year: 2,
    phone: '9876543216',        skills: ['Flutter', 'Dart', 'Firebase', 'Swift'],
    careerGoal: 'Mobile App Developer',
    linkedin: 'https://linkedin.com/in/adityamenon',
    github:   'https://github.com/adityamenon',
  },
  {
    name: 'Divya Nair',         email: 'divya.nair@college.edu',     password: 'demo1234',
    rollNumber: 'ECE20008',     department: 'Electronics & Communication', year: 4,
    phone: '9876543217',        skills: ['VLSI', 'Verilog', 'FPGA', 'Signal Processing'],
    careerGoal: 'VLSI Design Engineer at a semiconductor company',
    linkedin: 'https://linkedin.com/in/divyanair',
  },
];

// ── Per-student seed data ─────────────────────────────────────────────────────
const seedData = {
  'arjun.kumar@college.edu': {
    certifications: [
      { name: 'AWS Certified Developer – Associate', issuer: 'Amazon Web Services', date: '2024-08-10', skills: ['AWS', 'Cloud', 'Lambda'] },
      { name: 'Python for Data Science',             issuer: 'Coursera / IBM',       date: '2024-03-22', skills: ['Python', 'Pandas', 'NumPy'] },
      { name: 'Docker Essentials',                   issuer: 'Docker Inc.',           date: '2023-11-05', skills: ['Docker', 'Containers'] },
    ],
    achievements: [
      { title: 'Smart India Hackathon – Finalist', description: 'Reached finals with an AI-based crop monitoring app.', date: '2024-09-01', category: 'Hackathon', level: 'national' },
      { title: 'Coding Contest – 2nd Place',        description: 'Secured 2nd in inter-college coding contest.', date: '2024-04-15', category: 'Coding', level: 'regional' },
    ],
    internships: [
      { company: 'Zoho Corporation', role: 'Backend Developer Intern', startDate: '2024-05-01', endDate: '2024-07-31', description: 'Built REST APIs for internal HR module using Python and Django. Integrated Redis caching, reducing response time by 40%.', skills: ['Python', 'Django', 'Redis', 'PostgreSQL'] },
    ],
    activities: [
      { name: 'GDG Campus Devfest 2024', type: 'Conference', role: 'Attendee', date: '2024-10-20', description: 'Attended sessions on Gemini API, Flutter and Cloud Run by Google engineers.' },
      { name: 'Open Source Contribution – Django',   type: 'Open Source', role: 'Contributor', date: '2024-06-10', description: 'Fixed 3 bugs in Django ORM layer and submitted a PR that got merged.' },
    ],
    projects: [
      { title: 'Agri-Monitor AI', description: 'Real-time crop health monitoring using drone imagery and a CNN model. Deployed on AWS Lambda with a React dashboard.', techStack: ['Python', 'TensorFlow', 'React', 'AWS', 'OpenCV'], role: 'Full Stack + ML', startDate: '2024-01-10', endDate: '2024-04-30', status: 'completed', githubUrl: 'https://github.com/arjunkumar/agri-monitor' },
      { title: 'College ERP – Backend',              description: 'REST API backend for college ERP covering attendance, marks and fee management. Built with Django REST Framework.', techStack: ['Python', 'Django', 'PostgreSQL', 'Docker'], role: 'Backend Lead', startDate: '2024-08-01', status: 'ongoing' },
    ],
  },

  'priya.sharma@college.edu': {
    certifications: [
      { name: 'Meta Front-End Developer Certificate', issuer: 'Meta / Coursera',    date: '2024-06-15', skills: ['React', 'HTML', 'CSS', 'JavaScript'] },
      { name: 'MongoDB Developer Certification',      issuer: 'MongoDB University', date: '2024-01-20', skills: ['MongoDB', 'NoSQL', 'Aggregation'] },
      { name: 'Google UX Design Certificate',         issuer: 'Google / Coursera',  date: '2023-09-10', skills: ['Figma', 'UX Research', 'Prototyping'] },
      { name: 'Node.js Application Developer',        issuer: 'OpenJS Foundation',  date: '2023-06-25', skills: ['Node.js', 'Express', 'REST API'] },
    ],
    achievements: [
      { title: '1st Place – Code for Good Hackathon', description: 'Won first place with a digital skill tracking app for rural youth.', date: '2024-07-20', category: 'Hackathon', level: 'national' },
      { title: 'Best UI Design Award – TechFest',     description: 'Recognised for best UI/UX in the college tech fest project expo.', date: '2024-02-10', category: 'Design', level: 'local' },
      { title: 'Dean\'s Merit List – Sem 5',           description: 'Placed on Dean\'s List with 9.2 GPA for exceptional academic performance.', date: '2024-01-05', category: 'Academic', level: 'local' },
    ],
    internships: [
      { company: 'Freshworks', role: 'Frontend Engineer Intern', startDate: '2024-05-15', endDate: '2024-08-15', description: 'Developed React components for Freshdesk\'s customer portal. Improved LCP by 30% through code-splitting and lazy loading.', skills: ['React', 'TypeScript', 'Webpack', 'Jest'] },
      { company: 'Startup – PayRoute',                role: 'Full Stack Intern',     startDate: '2023-12-01', endDate: '2024-02-28', description: 'Built a payments dashboard UI and integrated Razorpay SDK. Developed backend endpoints in Node.js.', skills: ['React', 'Node.js', 'MongoDB', 'Razorpay'] },
    ],
    activities: [
      { name: 'Women in Tech Summit 2024',  type: 'Conference', role: 'Speaker', date: '2024-09-05', description: 'Spoke on "Building Accessible Web Apps" to an audience of 300+ students.' },
      { name: 'React Chennai Meetup',       type: 'Meetup',     role: 'Attendee', date: '2024-07-12', description: 'Attended talks on React Server Components and the new React 19 features.' },
      { name: 'Campus Web Dev Club – Lead', type: 'Club',       role: 'President', date: '2024-06-01', description: 'Leading a 40-member web development club. Organised 5 workshops and 2 hackathons.' },
    ],
    projects: [
      { title: 'Skills & Achievement Tracker', description: 'Full-stack app for students to track certifications, projects, and achievements with AI-powered recommendations.', techStack: ['React', 'TypeScript', 'Node.js', 'MongoDB', 'Ant Design'], role: 'Full Stack Developer', startDate: '2024-03-01', status: 'ongoing', githubUrl: 'https://github.com/priyasharma/sat' },
      { title: 'UI Component Library',         description: 'Reusable React component library with 40+ components, built with TypeScript and Storybook. Published on npm.', techStack: ['React', 'TypeScript', 'Storybook', 'Rollup'], role: 'Author', startDate: '2023-10-01', endDate: '2024-01-31', status: 'completed', githubUrl: 'https://github.com/priyasharma/ui-lib' },
      { title: 'E-Commerce – StyleHub',        description: 'Full-featured e-commerce store with cart, wishlist, Razorpay payments, and an admin panel.', techStack: ['Next.js', 'MongoDB', 'Tailwind CSS', 'Razorpay'], role: 'Full Stack', startDate: '2023-07-01', endDate: '2023-09-30', status: 'completed' },
    ],
  },

  'rohit.patel@college.edu': {
    certifications: [
      { name: 'Introduction to IoT', issuer: 'Cisco Networking Academy', date: '2024-03-18', skills: ['IoT', 'Networking', 'Python'] },
      { name: 'Embedded Systems with Arduino', issuer: 'Udemy', date: '2023-10-10', skills: ['Arduino', 'C', 'Sensors'] },
    ],
    achievements: [
      { title: 'Project Expo – Best Innovation Award', description: 'Won best innovation for a smart home automation prototype.', date: '2024-03-01', category: 'Project', level: 'local' },
    ],
    internships: [
      { company: 'TATA Electronics', role: 'Embedded Systems Intern', startDate: '2024-06-01', endDate: '2024-07-31', description: 'Worked on firmware development for IoT-based industrial sensors using Embedded C on STM32 microcontrollers.', skills: ['Embedded C', 'STM32', 'FreeRTOS', 'I2C', 'UART'] },
    ],
    activities: [
      { name: 'IEEE Student Branch Tech Talk', type: 'Workshop', role: 'Attendee', date: '2024-05-10', description: 'Attended a session on 5G NR and its applications in IoT ecosystems.' },
    ],
    projects: [
      { title: 'Smart Home Automation', description: 'IoT system to control home appliances via a mobile app using ESP32 and Firebase.', techStack: ['ESP32', 'Arduino', 'Firebase', 'Flutter'], role: 'Hardware + Firmware', startDate: '2023-11-01', endDate: '2024-02-28', status: 'completed', githubUrl: 'https://github.com/rohitpatel/smarthome' },
    ],
  },

  'sneha.reddy@college.edu': {
    certifications: [
      { name: 'TensorFlow Developer Certificate', issuer: 'Google',              date: '2024-09-10', skills: ['TensorFlow', 'Deep Learning', 'CNN', 'NLP'] },
      { name: 'IBM Data Science Professional',    issuer: 'IBM / Coursera',      date: '2024-04-22', skills: ['Python', 'Machine Learning', 'Pandas', 'SQL'] },
      { name: 'Microsoft Azure AI Fundamentals',  issuer: 'Microsoft',           date: '2024-01-30', skills: ['Azure', 'AI', 'Computer Vision'] },
      { name: 'Tableau Desktop Specialist',       issuer: 'Tableau / Salesforce', date: '2023-08-14', skills: ['Tableau', 'Data Visualization', 'BI'] },
    ],
    achievements: [
      { title: 'Kaggle Competition – Top 3%',     description: 'Ranked in top 3% in Kaggle\'s "Home Credit Default Risk" competition.', date: '2024-08-05', category: 'Data Science', level: 'international' },
      { title: 'Best Paper – ICCSE 2024',          description: 'Research paper on "Explainable AI in Medical Imaging" accepted at ICCSE.', date: '2024-06-20', category: 'Research', level: 'international' },
      { title: 'National Data Science Olympiad – Gold', description: 'Gold medal at the national level data science olympiad conducted by Analytics Vidhya.', date: '2024-02-28', category: 'Competition', level: 'national' },
    ],
    internships: [
      { company: 'PhonePe', role: 'Data Science Intern', startDate: '2024-05-01', endDate: '2024-07-31', description: 'Built a transaction fraud detection model using XGBoost and LightGBM. Reduced false positive rate by 18%.', skills: ['Python', 'XGBoost', 'Spark', 'SQL', 'MLflow'] },
      { company: 'Mu Sigma', role: 'Data Analyst Intern', startDate: '2023-12-01', endDate: '2024-02-29', description: 'Delivered business intelligence dashboards for a retail client using Tableau and SQL.', skills: ['Tableau', 'SQL', 'Python', 'Excel'] },
    ],
    activities: [
      { name: 'PyData Chennai 2024',    type: 'Conference', role: 'Attendee', date: '2024-09-28', description: 'Attended talks on LLM fine-tuning, MLOps with DVC, and real-time ML systems.' },
      { name: 'AI Club – Vice President', type: 'Club',     role: 'Vice President', date: '2024-06-01', description: 'Co-running the campus AI club. Organised monthly paper reading sessions and a national-level ML hackathon.' },
      { name: 'Guest Lecture at KCE',   type: 'Workshop',  role: 'Speaker', date: '2024-04-10', description: 'Delivered a 3-hour hands-on workshop on "Building your first ML pipeline" for 80 students.' },
    ],
    projects: [
      { title: 'MedScan AI',          description: 'Deep learning model for detecting pneumonia and tuberculosis from chest X-rays with 94% accuracy. Deployed as a FastAPI service.', techStack: ['Python', 'TensorFlow', 'FastAPI', 'Docker', 'React'], role: 'ML Engineer', startDate: '2024-02-01', endDate: '2024-06-30', status: 'completed', githubUrl: 'https://github.com/snehareddy/medscan-ai' },
      { title: 'Stock Sentiment Analyzer', description: 'NLP pipeline to extract sentiment from financial news and correlate with NIFTY50 stock movement. Uses BERT fine-tuned on FinBERT.', techStack: ['Python', 'BERT', 'Scrapy', 'PostgreSQL', 'Streamlit'], role: 'Data Scientist', startDate: '2023-09-01', endDate: '2024-01-31', status: 'completed', githubUrl: 'https://github.com/snehareddy/stock-sentiment' },
    ],
  },

  'vikram.singh@college.edu': {
    certifications: [
      { name: 'SolidWorks CSWA', issuer: 'Dassault Systèmes', date: '2024-02-14', skills: ['SolidWorks', '3D Modeling', 'CAD'] },
    ],
    achievements: [
      { title: 'Inter-College CAD Competition – 1st Place', description: 'Won first place in a 6-hour CAD design sprint with a complex mechanical assembly.', date: '2024-01-20', category: 'Design', level: 'regional' },
    ],
    internships: [],
    activities: [
      { name: 'SAE INDIA Collegiate Club', type: 'Club', role: 'Member', date: '2024-07-01', description: 'Active member of the SAE INDIA team working on the Baja off-road vehicle for the national competition.' },
    ],
    projects: [
      { title: 'Baja SAE Vehicle Design', description: 'Designed and simulated the suspension and chassis system of an off-road vehicle for SAE Baja India 2025.', techStack: ['SolidWorks', 'ANSYS', 'AutoCAD'], role: 'Suspension & Chassis Designer', startDate: '2024-07-01', status: 'ongoing' },
    ],
  },

  'kavitha.l@college.edu': {
    certifications: [
      { name: 'AWS Solutions Architect – Associate', issuer: 'Amazon Web Services', date: '2024-07-20', skills: ['AWS', 'EC2', 'S3', 'RDS', 'VPC'] },
      { name: 'Certified Kubernetes Administrator (CKA)', issuer: 'CNCF', date: '2024-05-15', skills: ['Kubernetes', 'Docker', 'Helm', 'CI/CD'] },
      { name: 'Jenkins – DevOps Bootcamp',            issuer: 'Udemy',                date: '2024-02-10', skills: ['Jenkins', 'CI/CD', 'Groovy'] },
    ],
    achievements: [
      { title: 'HackWithInfy – Top 10',        description: 'Reached top 10 in Infosys\'s national hackathon with a Kubernetes-native CI/CD automation tool.', date: '2024-08-12', category: 'Hackathon', level: 'national' },
      { title: 'Open Source – Helm Charts PRs', description: 'Contributed 5 Helm chart improvements to the bitnami/charts open source repository on GitHub.', date: '2024-06-01', category: 'Open Source', level: 'international' },
    ],
    internships: [
      { company: 'Infosys', role: 'DevOps Engineer Intern', startDate: '2024-05-01', endDate: '2024-07-31', description: 'Set up a complete GitOps pipeline using ArgoCD, Jenkins, and Kubernetes for a banking client\'s microservices. Reduced deployment time from 40 mins to 8 mins.', skills: ['Kubernetes', 'ArgoCD', 'Jenkins', 'Terraform', 'AWS'] },
    ],
    activities: [
      { name: 'KubeCon NA 2024 – Virtual', type: 'Conference', role: 'Attendee', date: '2024-11-15', description: 'Attended KubeCon North America sessions on eBPF, WASM in Kubernetes, and multi-cluster federation.' },
      { name: 'DevOps Study Circle',      type: 'Club',       role: 'Organiser', date: '2024-08-01', description: 'Running a weekly DevOps study circle with 25 members, covering topics from Docker basics to GitOps.' },
    ],
    projects: [
      { title: 'GitOps CI/CD Platform',     description: 'End-to-end GitOps platform using ArgoCD, Jenkins, and Terraform. Supports auto-scaling and blue-green deployments on EKS.', techStack: ['Kubernetes', 'ArgoCD', 'Jenkins', 'Terraform', 'AWS EKS', 'Helm'], role: 'Platform Engineer', startDate: '2024-03-01', endDate: '2024-07-31', status: 'completed', githubUrl: 'https://github.com/kavithalakshmi/gitops-platform' },
      { title: 'Microservices E-Commerce', description: 'Microservices-based e-commerce backend with 6 services, service mesh using Istio, and observability with Grafana + Prometheus.', techStack: ['Java', 'Spring Boot', 'Kubernetes', 'Istio', 'Prometheus', 'Grafana'], role: 'Backend + DevOps', startDate: '2023-10-01', status: 'ongoing', githubUrl: 'https://github.com/kavithalakshmi/micro-ecom' },
    ],
  },

  'aditya.menon@college.edu': {
    certifications: [
      { name: 'Google Associate Android Developer', issuer: 'Google',    date: '2024-04-18', skills: ['Android', 'Kotlin', 'Jetpack'] },
      { name: 'Flutter & Dart – Complete Guide',    issuer: 'Udemy',     date: '2023-12-05', skills: ['Flutter', 'Dart', 'Firebase'] },
    ],
    achievements: [
      { title: 'Google Play Student Devchallenge – Finalist', description: 'App selected as finalist in Google\'s student developer challenge for a mental health journalling app.', date: '2024-10-01', category: 'App Development', level: 'international' },
      { title: 'College Appathon – Winner',                   description: 'First place at the college app-building competition with a campus event management app.', date: '2024-03-25', category: 'Hackathon', level: 'local' },
    ],
    internships: [
      { company: 'CRED', role: 'Mobile (Flutter) Intern', startDate: '2024-06-01', endDate: '2024-08-31', description: 'Worked on the CRED Garage feature for vehicle management. Implemented 3 new screens and integrated BLE SDK for OBD-II dongle communication.', skills: ['Flutter', 'Dart', 'BLE', 'REST API', 'Riverpod'] },
    ],
    activities: [
      { name: 'FlutterFest India 2024', type: 'Conference', role: 'Attendee', date: '2024-09-14', description: 'Attended talks on Impeller engine, Flutter on Web, and Dart 3 sealed classes.' },
      { name: 'GDG On Campus – Lead',   type: 'Club',       role: 'Lead',     date: '2024-01-01', description: 'GDG On Campus lead at college. Organised Solution Challenge, workshops on Flutter & Firebase, and 2 hackathons.' },
    ],
    projects: [
      { title: 'MindJournal',         description: 'Mental health journalling app with mood tracking, streak system, and AI-generated weekly reflections. 1000+ downloads on Play Store.', techStack: ['Flutter', 'Dart', 'Firebase', 'Gemini API'], role: 'Solo Developer', startDate: '2023-08-01', endDate: '2024-02-29', status: 'completed', projectUrl: 'https://play.google.com/store/apps/mindjournal', githubUrl: 'https://github.com/adityamenon/mindjournal' },
      { title: 'Campus Events App', description: 'Cross-platform app for discovering and registering for campus events. Integrated with college portal API. Used by 800+ students.', techStack: ['Flutter', 'Dart', 'Node.js', 'MongoDB'], role: 'Mobile Lead', startDate: '2024-01-01', endDate: '2024-04-30', status: 'completed', githubUrl: 'https://github.com/adityamenon/campus-events' },
    ],
  },

  'divya.nair@college.edu': {
    certifications: [
      { name: 'VLSI Design and Verification',          issuer: 'NPTEL / IIT Madras', date: '2024-03-30', skills: ['VLSI', 'Verilog', 'Timing Analysis'] },
      { name: 'Signal Processing Fundamentals',        issuer: 'Coursera / Duke',    date: '2023-11-20', skills: ['Signal Processing', 'MATLAB', 'DSP'] },
    ],
    achievements: [
      { title: 'VLSI Design Contest – 2nd Place', description: '2nd place at national VLSI design contest for a low-power 8-bit ALU on FPGA.', date: '2024-07-15', category: 'Design Contest', level: 'national' },
      { title: 'Best Project – ECE Department',   description: 'Best final year project award for "Low-Power RISC-V Core on FPGA".', date: '2024-11-01', category: 'Academic', level: 'local' },
    ],
    internships: [
      { company: 'Qualcomm India', role: 'VLSI Design Intern', startDate: '2024-05-01', endDate: '2024-07-31', description: 'Assisted in RTL design and functional verification of a 5G modem submodule. Wrote 200+ SystemVerilog assertions.', skills: ['SystemVerilog', 'UVM', 'Synopsys VCS', 'Verilog', 'Perl'] },
    ],
    activities: [
      { name: 'IETE Technical Symposium', type: 'Conference', role: 'Paper Presenter', date: '2024-09-22', description: 'Presented a paper on "Energy-Efficient RISC-V Implementation on Xilinx FPGA" at the IETE national symposium.' },
      { name: 'Chip Design Workshop – IIT Bombay', type: 'Workshop', role: 'Participant', date: '2024-04-05', description: 'Attended a 5-day workshop on physical design flow using Cadence tools at IIT Bombay.' },
    ],
    projects: [
      { title: 'Low-Power RISC-V Core on FPGA', description: 'Designed a 32-bit single-cycle RISC-V processor in Verilog and synthesized it on Xilinx Artix-7 FPGA. Achieved 40% lower power than reference design.', techStack: ['Verilog', 'FPGA', 'Vivado', 'RISC-V'], role: 'Lead Designer', startDate: '2024-01-01', endDate: '2024-10-31', status: 'completed', githubUrl: 'https://github.com/divyanair/riscv-fpga' },
    ],
  },
};

// ── Main ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  let created = 0;
  let skipped = 0;

  for (const profile of students) {
    const existing = await User.findOne({ email: profile.email });
    if (existing) {
      console.log(`⏭  Skipping ${profile.name} (already exists)`);
      skipped++;
      continue;
    }

    // Create user (pre-save hook hashes the password)
    const user = await User.create({
      name:       profile.name,
      email:      profile.email,
      password:   profile.password,
      rollNumber: profile.rollNumber,
      department: profile.department,
      year:       profile.year,
      phone:      profile.phone,
      skills:     profile.skills,
      careerGoal: profile.careerGoal,
      linkedin:   profile.linkedin,
      github:     profile.github,
      role:       'student',
    });

    const data = seedData[profile.email];
    if (!data) continue;

    // Insert all related data in parallel
    await Promise.all([
      ...data.certifications.map(c => Certification.create({ ...c, user: user._id })),
      ...data.achievements.map(a  => Achievement.create({   ...a, user: user._id })),
      ...data.internships.map(i   => Internship.create({    ...i, user: user._id })),
      ...data.activities.map(ac   => Activity.create({      ...ac, user: user._id })),
      ...data.projects.map(p      => Project.create({       ...p, user: user._id })),
    ]);

    const counts = [
      `${data.certifications.length} certs`,
      `${data.achievements.length} achievements`,
      `${data.internships.length} internships`,
      `${data.activities.length} activities`,
      `${data.projects.length} projects`,
    ].join(', ');

    console.log(`✅ Created ${profile.name} (${profile.department}, Y${profile.year}) — ${counts}`);
    created++;
  }

  console.log(`\n🎉 Done. ${created} students created, ${skipped} skipped.`);
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
