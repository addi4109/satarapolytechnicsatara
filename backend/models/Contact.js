import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['office', 'enquiry', 'feedback', 'departments'],
    unique: true,
  },
  officeContacts: {
    type: [{ designation: String, name: String, phone: String, email: String }],
    default: [],
  },
  enquiryFields: {
    type: [String],
    default: ['name', 'phone', 'email', 'message'],
  },
  feedbackFields: {
    type: [String],
    default: ['name', 'email', 'subject', 'message'],
  },
  phone: {
    type: String,
    default: '+91-94233 42843',
  },
  email: {
    type: String,
    default: 'satarapolyinfo@gmail.com',
  },
  address: {
    type: String,
    default: 'At Post: Songaon, Khindwadi, Near NH-4, Satara - 415002, Maharashtra',
  },
  officeHours: {
    type: String,
    default: 'Monday – Saturday, 10:30 AM – 5:00 PM',
  },
  mapEmbedUrl: {
    type: String,
    default: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3801.94073621475!2d74.0093987!3d17.6529606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2399e87a8a1e3%3A0xaae19259100b0879!2sSatara%20Polytechnic!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin',
  },
  departmentDetails: {
    type: [{
      name: String,
      hod: String,
      phone: String,
      email: String,
      address: String,
      description: String,
    }],
    default: [],
  },
  active: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model('Contact', ContactSchema);
