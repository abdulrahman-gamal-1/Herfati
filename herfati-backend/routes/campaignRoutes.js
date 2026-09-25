const express = require('express');
const {
  getCampaigns,
  getCampaignById,
  createCampaign,
  contribute,
} = require('../controllers/campaignController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.get('/', getCampaigns);
router.get('/:id', getCampaignById);
router.post('/', protect, authorize('artisan', 'admin'), createCampaign);
router.post('/:id/contribute', protect, contribute);

module.exports = router;
