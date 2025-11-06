import express from 'express';
import { analyticsController } from '../modules/analytics/index.js';

const router = express.Router();

// GET /api/analytics/users-by-organization - Get count of users per organization
router.get('/users-by-organization', analyticsController.getUsersByOrganization);

// GET /api/analytics/organization-files - Get organization name, total files uploaded, and list of users who uploaded
router.get('/organization-files', analyticsController.getOrganizationFiles);

export default router;

