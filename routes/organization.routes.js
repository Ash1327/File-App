import express from 'express';
import { organizationController, organizationValidate } from '../modules/organization/index.js';

const router = express.Router();

// POST /api/organizations - Create organization
router.post('/', 
  organizationValidate.validateCreateOrganization,
  organizationController.createOrganization
);

export default router;

