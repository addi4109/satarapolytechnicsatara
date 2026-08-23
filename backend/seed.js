import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Cell from './models/Cell.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sps';

const cellsData = [
  {
    name: 'Training & Placement Cell',
    slug: 'placement',
    description:
      'The Training & Placement Cell coordinates campus recruitment drives, soft skill training, and industry-institute interaction activities. It helps students prepare for placements through aptitude training, mock interviews, and group discussions.',
    type: 'cell',
    order: 1,
    members: [
      { name: 'Mr. Sunil Pawar', designation: 'Placement Officer', phone: '+91-9876543210' },
      { name: 'Mr. Ramesh Tooly', designation: 'Training Coordinator', phone: '+91-9876543211' },
    ],
  },
  {
    name: 'Anti-Ragging Cell',
    slug: 'anti-ragging',
    description:
      'Every Institution imparting technical education shall constitute a Committee to be known as Anti-ragging Committee to be nominated and headed by the Head of the Institution and consisting of representatives of civil and police administration, local media, Non-Governmental Organizations involved in youth activities, representative of faculty members, representative of parents, representative of students belonging to the fresher\'s category as well as senior students, Non-Teaching staff, and shall have diverse mix of membership in terms of level as well as gender.',
    type: 'cell',
    order: 2,
    members: [
      { name: 'Mr. B.V. Kadam', designation: 'Chairman', phone: '8600149944' },
      { name: 'Mrs. M.M. Patil', designation: 'Nodal Officer-1', phone: '7709829249' },
      { name: 'Mr. S.S. Yewale', designation: 'Nodal Officer-2', phone: '9623694899' },
      { name: 'Adv. Anjali A. Patil', designation: 'Legal Advisor', phone: '9975114373' },
    ],
  },
  {
    name: 'Grievance Redressal Cell',
    slug: 'grievance',
    description:
      'The Grievance Redressal Cell provides a platform for students to report complaints and grievances related to academics, infrastructure, or any other institutional matters. The cell ensures timely resolution of all complaints.',
    type: 'cell',
    order: 3,
    members: [
      { name: 'Mr. Vikram Deshpande', designation: 'Chairman', phone: '+91-9876543230' },
      { name: 'Mrs. Asha Bhosale', designation: 'Member', phone: '+91-9876543231' },
    ],
  },
  {
    name: 'Women Grievance Cell',
    slug: 'womens-grievance',
    description:
      'The Women Grievance Cell addresses issues related to women students and staff. It works towards creating a safe and empowering environment for women on campus.',
    type: 'committee',
    order: 4,
    members: [
      { name: 'Mrs. Kavita More', designation: 'Chairperson', phone: '+91-9876543240' },
      { name: 'Mrs. Pooja Raut', designation: 'Member', phone: '+91-9876543241' },
    ],
  },
  {
    name: 'SC/ST Cell',
    slug: 'sc-st',
    description:
      'The SC/ST Cell works for the welfare of students belonging to Scheduled Castes and Scheduled Tribes. It ensures proper implementation of reservation policies and provides support for scholarships and academic assistance.',
    type: 'cell',
    order: 5,
    members: [
      { name: 'Mr. Prakash Varne', designation: 'Chairman', phone: '+91-9876543250' },
      { name: 'Mr. Nitin Kadam', designation: 'Member', phone: '+91-9876543251' },
    ],
  },
  {
    name: 'NSS Cell',
    slug: 'nss',
    description:
      'The National Service Scheme (NSS) Cell organizes community service activities, blood donation camps, tree plantation drives, and social awareness programmes. It encourages students to participate in nation-building activities.',
    type: 'cell',
    order: 6,
    members: [
      { name: 'Mr. Amit Patil', designation: 'Programme Officer', phone: '+91-9876543260' },
      { name: 'Mrs. Sunita Gaikwad', designation: 'Member', phone: '+91-9876543261' },
    ],
  },
  {
    name: 'Internal Complaint Committee',
    slug: 'internal-committee',
    description:
      'The Internal Complaint Committee (ICC) is constituted as per the Sexual Harassment of Women at Workplace Act. It handles complaints related to sexual harassment and ensures a safe working environment.',
    type: 'committee',
    order: 7,
    members: [
      { name: 'Mrs. Kavita More', designation: 'Chairperson', phone: '+91-9876543270' },
      { name: 'Mrs. Pooja Raut', designation: 'Member', phone: '+91-9876543271' },
      { name: 'Mr. Deepak Kulkarni', designation: 'Member', phone: '+91-9876543272' },
    ],
  },
  {
    name: 'IQAC Cell',
    slug: 'iqac',
    description:
      'The Internal Quality Assurance Cell (IQAC) is established to improve the academic and administrative performance of the institute. It coordinates quality enhancement activities and ensures compliance with accreditation requirements.',
    type: 'cell',
    order: 8,
    members: [
      { name: 'Mr. Suresh Jadhav', designation: 'Chairman', phone: '+91-9876543280' },
      { name: 'Mr. Rajesh Kumar', designation: 'Coordinator', phone: '+91-9876543281' },
      { name: 'Mrs. Asha Bhosale', designation: 'Member', phone: '+91-9876543282' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Cell.deleteMany({});
    console.log('Cleared existing cells');

    await Cell.insertMany(cellsData);
    console.log(`Seeded ${cellsData.length} cells/committees`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
