// models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  date: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
});

const Announcement = mongoose.model('Announcement', announcementSchema);

export default Announcement;
