import express from 'express';
import userRoutes from './user.routes.js';
import organizationRoutes from './organization.routes.js';
import fileRoutes from './file.routes.js';
import analyticsRoutes from './analytics.routes.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/organizations', organizationRoutes);
router.use('/files', fileRoutes);
router.use('/analytics', analyticsRoutes);

export default router;

