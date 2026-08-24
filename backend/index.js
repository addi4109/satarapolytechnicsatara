import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import dns from 'dns';
import cellsRouter from './routes/cells.js';
import departmentsRouter from './routes/departments.js';
import photosRouter from './routes/photos.js';
import videosRouter from './routes/videos.js';
import newsRouter from './routes/news.js';
import recruitersRouter from './routes/recruiters.js';
import noticesRouter from './routes/notices.js';
import slidesRouter from './routes/slides.js';
import placementsRouter from './routes/placements.js';
import placementProcessRouter from './routes/placement-process.js';
import managementRouter from './routes/management.js';
import aboutRouter from './routes/about.js';
import admissionsAdminRouter from './routes/admissions.js';
import placementsAdminRouter from './routes/placements-admin.js';
import examinationsRouter from './routes/examinations.js';
import governingBodyRouter from './routes/governing-body.js';
import campusRouter from './routes/campus.js';
import activitiesRouter from './routes/activities.js';
import settingsRouter from './routes/settings.js';

// Use Google DNS to resolve MongoDB Atlas SRV records
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/sps';

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/cells', cellsRouter);
app.use('/api/departments', departmentsRouter);
app.use('/api/photos', photosRouter);
app.use('/api/videos', videosRouter);
app.use('/api/news', newsRouter);
app.use('/api/recruiters', recruitersRouter);
app.use('/api/notices', noticesRouter);
app.use('/api/slides', slidesRouter);
app.use('/api/placements', placementsRouter);
app.use('/api/placement-process', placementProcessRouter);
app.use('/api/management', managementRouter);
app.use('/api/about', aboutRouter);
app.use('/api/admissions-admin', admissionsAdminRouter);
app.use('/api/placements-admin', placementsAdminRouter);
app.use('/api/examinations', examinationsRouter);
app.use('/api/governing-body', governingBodyRouter);
app.use('/api/campus', campusRouter);
app.use('/api/activities', activitiesRouter);
app.use('/api/settings', settingsRouter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  });
