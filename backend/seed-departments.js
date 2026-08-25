import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sps';

const departmentsData = [
  {
    name: 'Computer Engineering',
    slug: 'computer',
    image: 'https://www.satarapolytechnicsatara.com/assets/co-B0B6J1cD.jpeg',
    intake: 60,
    directSecond: true,
    order: 1,
    about: 'The Department of Computer Engineering was established in 1995. It offers a 3-year diploma programme with an intake of 60 students. The department has well-equipped laboratories with modern computers and software.',
    vision: 'To produce skilled computer engineers capable of contributing to the IT industry and society.',
    mission: [
      'Provide quality education in computer science and engineering',
      'Develop programming and problem-solving skills',
      'Prepare students for industry and higher education',
      'Foster innovation and entrepreneurship',
    ],
    hod: 'Ms. Sabale Komal Sanjeev',
    hodImage: 'https://ik.imagekit.io/Sps/98348207-ea2c-4b0e-95f1-80385c383280_JoWBQg4f2_',
    hodQual: 'B.Tech. (Computer Engg.)',
    hodMsg: 'The Department of Computer Engineering is committed to producing skilled professionals who can meet the demands of the ever-evolving IT industry. Our experienced faculty and modern labs provide an ideal learning environment.',
    faculty: [
      { name: 'Hema Nikam', designation: 'Technical Assistant', qual: 'B.Sc. Computer', exp: '19 Years', email: 'nikamhema66@gmail.com', image: 'https://ik.imagekit.io/Sps/3caed789-5c65-466d-8bee-047af3fe8a27_66llwTgi9' },
      { name: 'Mayuri M Mandeshi', designation: 'Lecturer', qual: 'B.Tech. (Computer Engg.)', exp: '2 Years', email: 'mmm3@gmail.com', image: 'https://i.ibb.co/xSVTKXnh/Mandeshi.jpg' },
      { name: 'Shital Padwal', designation: 'Lecturer', qual: 'B.E. (Computer Engg.)', exp: '2 Years', email: 'shitalpadwal99@gmail.com', image: 'https://ik.imagekit.io/Sps/4fb39bf8-cb19-4110-a7bf-2f26a08a6d1b_N59PdejEP' },
      { name: 'Hina Gennur', designation: 'Lecturer', qual: 'B.E. (Computer Engg.)', exp: '9 Years', email: 'hinagennur1@gmail.com', image: 'https://ik.imagekit.io/Sps/8315e56a-8333-491c-b10c-25b53d90ba08_w0-HqiJYk' },
      { name: 'Vrishali Kulkarni', designation: 'Technical Assistant', qual: 'B.Sc. Computer', exp: '26 Years', email: 'kulkarnivrishali11@gmail.com', image: 'https://ik.imagekit.io/Sps/7136eca7-0b8c-4731-9e0d-9d5905ad762f_DfyPmTUBN' },
    ],
    labs: [
      { name: 'Programming Lab' },
      { name: 'Data Structures Lab' },
      { name: 'Database Management Lab' },
      { name: 'Network Lab' },
      { name: 'Project Lab' },
    ],
    infrastructure: [
      { name: 'Computer Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
      { name: 'Department Library' },
    ],
  },
  {
    name: 'Electronics & Telecommunication',
    slug: 'entc',
    image: 'https://www.satarapolytechnicsatara.com/assets/entc-Jp6qtups.jpg',
    intake: 60,
    directSecond: true,
    order: 2,
    about: 'The Department of Electronics and Telecommunication Engineering was established in 1983. It offers a 3-year diploma programme with an intake of 60 students.',
    vision: 'To produce competent electronics and telecommunication engineers for the modern world.',
    mission: [
      'Provide strong foundation in electronics and communication',
      'Train students in embedded systems and VLSI design',
      'Develop skills in communication technologies',
      'Encourage research and innovation',
    ],
    hod: 'Mr. Suresh Jadhav',
    hodImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    hodQual: 'M.E. Electronics',
    hodMsg: 'Our department strives to create a stimulating learning environment that prepares students for careers in electronics and telecommunication engineering.',
    faculty: [
      { name: 'Mr. Suresh Jadhav', designation: 'Lecturer', qual: 'M.E. Electronics', exp: '18 Years', email: 'suresh.jadhav@college.ac.in' },
      { name: 'Mrs. Kavita More', designation: 'Lecturer', qual: 'M.E. E&TC', exp: '10 Years', email: 'kavita.more@college.ac.in' },
      { name: 'Mr. Deepak Kulkarni', designation: 'Assistant Lecturer', qual: 'B.E. Electronics', exp: '9 Years', email: 'deepak.k@college.ac.in' },
    ],
    labs: [
      { name: 'Electronics Lab' },
      { name: 'Communication Lab' },
      { name: 'Microprocessor Lab' },
      { name: 'Embedded Systems Lab' },
      { name: 'DSP Lab' },
    ],
    infrastructure: [
      { name: 'Electronics Lab' },
      { name: 'Communication Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
    ],
  },
  {
    name: 'Mechanical Engineering',
    slug: 'mechanical',
    image: 'https://www.satarapolytechnicsatara.com/assets/mecanical-BZSmFLQx.jpg',
    intake: 60,
    directSecond: true,
    order: 3,
    about: 'The Department of Mechanical Engineering is one of the oldest departments of the institute, established in 1983.',
    vision: 'To produce skilled mechanical engineers contributing to industrial growth.',
    mission: [
      'Provide comprehensive knowledge of mechanical engineering',
      'Develop practical skills through workshop training',
      'Prepare students for manufacturing and design industries',
      'Promote teamwork and professional ethics',
    ],
    hod: 'Mr. Ganesh More',
    hodImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    hodQual: 'M.E. Mechanical',
    hodMsg: 'The Mechanical Engineering department is dedicated to shaping future mechanical engineers through hands-on training and theoretical knowledge.',
    faculty: [
      { name: 'Mr. Ganesh More', designation: 'Lecturer', qual: 'M.E. Mechanical', exp: '20 Years', email: 'ganesh.more@college.ac.in' },
      { name: 'Mr. Anil Shinde', designation: 'Lecturer', qual: 'M.E. Design', exp: '14 Years', email: 'anil.shinde@college.ac.in' },
      { name: 'Mrs. Sunita Gaikwad', designation: 'Assistant Lecturer', qual: 'M.E. Thermal', exp: '11 Years', email: 'sunita.g@college.ac.in' },
      { name: 'Mr. Prakash Varne', designation: 'Technical Assistant', qual: 'B.E. Mechanical', exp: '7 Years', email: 'prakash.v@college.ac.in' },
    ],
    labs: [
      { name: 'Workshop' },
      { name: 'Fluid Mechanics Lab' },
      { name: 'Strength of Materials Lab' },
      { name: 'Thermal Engineering Lab' },
      { name: 'CAD/CAM Lab' },
    ],
    infrastructure: [
      { name: 'Workshop' },
      { name: 'CAD/CAM Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
    ],
  },
  {
    name: 'Chemical Engineering',
    slug: 'chemical',
    image: 'https://www.satarapolytechnicsatara.com/assets/chemical-C8vpqZYb.jpg',
    intake: 60,
    directSecond: true,
    order: 4,
    about: 'The Department of Chemical Engineering provides students with knowledge of chemical processes, plant design, and industrial safety.',
    vision: 'To produce skilled chemical engineers for process industries.',
    mission: [
      'Provide strong foundation in chemical engineering principles',
      'Develop skills in process design and optimization',
      'Train students in industrial safety and environmental management',
      'Prepare students for chemical and pharmaceutical industries',
    ],
    hod: 'Mr. Vikram Deshpande',
    hodImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    hodQual: 'M.E. Chemical',
    hodMsg: 'Our department focuses on building strong fundamentals and practical skills needed in the chemical process industry.',
    faculty: [
      { name: 'Mr. Vikram Deshpande', designation: 'Lecturer', qual: 'M.E. Chemical', exp: '16 Years', email: 'vikram.d@college.ac.in' },
      { name: 'Mrs. Asha Bhosale', designation: 'Lecturer', qual: 'M.Sc. Chemistry', exp: '12 Years', email: 'asha.b@college.ac.in' },
      { name: 'Mr. Nitin Kadam', designation: 'Assistant Lecturer', qual: 'B.E. Chemical', exp: '8 Years', email: 'nitin.k@college.ac.in' },
    ],
    labs: [
      { name: 'Chemistry Lab' },
      { name: 'Chemical Process Lab' },
      { name: 'Fluid Mechanics Lab' },
      { name: 'Heat Transfer Lab' },
      { name: 'Instrumentation Lab' },
    ],
    infrastructure: [
      { name: 'Chemistry Lab' },
      { name: 'Chemical Process Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
    ],
  },
  {
    name: 'Electrical Engineering',
    slug: 'electrical',
    image: 'https://www.satarapolytechnicsatara.com/assets/electrical-CxrpAj1a.jpg',
    intake: 60,
    directSecond: true,
    order: 5,
    about: 'The Department of Electrical Engineering was established in 1995. It offers a 3-year diploma programme with an intake of 60 students.',
    vision: 'To produce competent electrical engineers for power and energy sectors.',
    mission: [
      'Provide thorough knowledge of electrical systems',
      'Develop skills in power generation and distribution',
      'Train students in renewable energy technologies',
      'Prepare students for electrical utility and manufacturing industries',
    ],
    hod: 'Mr. Sunil Pawar',
    hodImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    hodQual: 'M.E. Electrical',
    hodMsg: 'The Electrical Engineering department is committed to providing quality education and practical training in all areas of electrical engineering.',
    faculty: [
      { name: 'Mr. Sunil Pawar', designation: 'Lecturer', qual: 'M.E. Electrical', exp: '17 Years', email: 'sunil.p@college.ac.in' },
      { name: 'Mr. Ramesh Tooly', designation: 'Lecturer', qual: 'M.E. Power Systems', exp: '13 Years', email: 'ramesh.t@college.ac.in' },
      { name: 'Mrs. Pooja Raut', designation: 'Assistant Lecturer', qual: 'B.E. Electrical', exp: '9 Years', email: 'pooja.r@college.ac.in' },
    ],
    labs: [
      { name: 'Electrical Machines Lab' },
      { name: 'Power Systems Lab' },
      { name: 'Control Systems Lab' },
      { name: 'Measurements Lab' },
      { name: 'Electronics Lab' },
    ],
    infrastructure: [
      { name: 'Electrical Machines Lab' },
      { name: 'Power Systems Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
    ],
  },
  {
    name: 'Automobile Engineering',
    slug: 'auto',
    image: 'https://www.satarapolytechnicsatara.com/assets/auto-DTO3Ybn7.jpg',
    intake: 60,
    directSecond: true,
    order: 6,
    about: 'The Department of Automobile Engineering was established in 2015. It offers a 3-year diploma programme with an intake of 60 students.',
    vision: 'To produce skilled automobile engineers for the automotive industry.',
    mission: [
      'Provide knowledge of automobile systems and technologies',
      'Develop skills in vehicle maintenance and diagnostics',
      'Train students in automotive electronics and emission control',
      'Prepare students for automobile manufacturing and service industries',
    ],
    hod: 'Mr. Kunal Deshmukh',
    hodImage: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    hodQual: 'M.E. Automobile',
    hodMsg: 'Our department aims to produce well-trained automobile engineers who can meet the demands of the rapidly evolving automotive industry.',
    faculty: [
      { name: 'Mr. Kunal Deshmukh', designation: 'Lecturer', qual: 'M.E. Automobile', exp: '14 Years', email: 'kunal.d@college.ac.in' },
      { name: 'Mr. Chetan Gavhane', designation: 'Lecturer', qual: 'B.E. Mechanical', exp: '10 Years', email: 'chetan.g@college.ac.in' },
      { name: 'Ms. Ritu Singh', designation: 'Assistant Lecturer', qual: 'M.E. Automotive', exp: '7 Years', email: 'ritu.s@college.ac.in' },
    ],
    labs: [
      { name: 'Automobile Lab' },
      { name: 'Engine Testing Lab' },
      { name: 'Vehicle Maintenance Lab' },
      { name: 'Automotive Electronics Lab' },
      { name: 'CAD Lab' },
    ],
    infrastructure: [
      { name: 'Automobile Lab' },
      { name: 'Engine Testing Lab' },
      { name: 'Smart Classroom' },
      { name: 'Seminar Hall' },
    ],
  },
  {
    name: 'General Science',
    slug: 'general-science',
    image: '',
    intake: 60,
    directSecond: false,
    order: 7,
    hideFromHome: true,
    about: 'The Department of General Science provides foundational science education to first-year students across all engineering disciplines.',
    vision: 'To build strong scientific fundamentals that support engineering education.',
    mission: [
      'Provide quality education in Physics, Chemistry, and Mathematics',
      'Develop analytical and scientific thinking skills',
      'Support engineering departments with strong foundational knowledge',
      'Encourage practical learning through laboratory experiments',
    ],
    hod: '',
    hodImage: '',
    hodQual: '',
    hodMsg: '',
    faculty: [],
    labs: [
      { name: 'Physics Lab' },
      { name: 'Chemistry Lab' },
      { name: 'Mathematics Lab' },
    ],
    infrastructure: [
      { name: 'Physics Lab' },
      { name: 'Chemistry Lab' },
      { name: 'Smart Classroom' },
    ],
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    await Department.deleteMany({});
    console.log('Cleared existing departments');

    await Department.insertMany(departmentsData);
    console.log(`Seeded ${departmentsData.length} departments`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
