import mongoose from 'mongoose';

const facultySchema = new mongoose.Schema({
  name: { type: String, required: true },
  designation: { type: String, default: '' },
  qual: { type: String, default: '' },
  exp: { type: String, default: '' },
  expYear: { type: Number, default: () => new Date().getFullYear() },
  email: { type: String, default: '' },
  image: { type: String, default: '' },
});

const labSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, default: '' },
  count: { type: String, default: '' },
});

const curriculumSchema = new mongoose.Schema({
  year: { type: String, required: true },
  semester: { type: Number, required: true },
  name: { type: String, required: true },
  url: { type: String, default: '' },
});

const deptNoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

const deptEventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  images: [{ type: String }],
});

const deptTimetableSchema = new mongoose.Schema({
  year: { type: String, required: true, enum: ['1st Year', '2nd Year', '3rd Year'] },
  title: { type: String, required: true },
  url: { type: String, default: '' },
});


// Department library book categories (summary table on the Library tab)
const libBookSchema = new mongoose.Schema({
  particulars: { type: String, required: true },
  count: { type: String, default: '' },
});

// Department library titles list (name + optional author)
const libTitleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  author: { type: String, default: '' },
});

const achievementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, default: '' },
  description: { type: String, default: '' },
  order: { type: Number, default: 0 },
});

const departmentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, default: '' },
    intake: { type: Number, default: 60 },
    directSecond: { type: Boolean, default: true },
    about: { type: String, default: '' },
    vision: { type: String, default: '' },
    mission: [{ type: String }],
    hod: { type: String, default: '' },
    hodImage: { type: String, default: '' },
    hodQual: { type: String, default: '' },
    hodMsg: { type: String, default: '' },
    faculty: [facultySchema],
    labs: [labSchema],
    infrastructure: [labSchema],
    curriculum: [curriculumSchema],
    peos: [{ title: { type: String, default: '' }, description: { type: String, default: '' } }],
    pos: [{ title: { type: String, default: '' }, description: { type: String, default: '' } }],
    psos: [{ title: { type: String, default: '' }, description: { type: String, default: '' } }],
    cos: [{ title: { type: String, default: '' }, description: { type: String, default: '' } }],
    deptNotices: [deptNoticeSchema],
    deptEvents: [deptEventSchema],
    deptTimetable: [deptTimetableSchema],
    // Rankers tab: a single banner image managed from the admin panel
    // (replaces the old per-year rankers table).
    rankersBannerImage: { type: String, default: '' },
    achievements: [achievementSchema],
    library: {
      description: { type: String, default: '' },
      books: [libBookSchema],
      titles: [libTitleSchema],
    },
    order: { type: Number, default: 0 },
    hideFromHome: { type: Boolean, default: false },
  },
  { timestamps: true }
);

departmentSchema.pre('validate', function () {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

const Department = mongoose.model('Department', departmentSchema);
export default Department;
