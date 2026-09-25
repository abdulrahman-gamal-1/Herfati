const asyncHandler = require('express-async-handler');
const Campaign = require('../models/Campaign');
const Contribution = require('../models/Contribution');

// @route GET /api/campaigns
const getCampaigns = asyncHandler(async (req, res) => {
  const { status = 'active' } = req.query;
  const filter = status === 'all' ? {} : { status };
  const campaigns = await Campaign.find(filter)
    .populate('artisan', 'name region craft')
    .sort({ createdAt: -1 });
  res.json(campaigns);
});

// @route GET /api/campaigns/:id
const getCampaignById = asyncHandler(async (req, res) => {
  const campaign = await Campaign.findById(req.params.id).populate('artisan', 'name region craft bio');
  if (!campaign) {
    res.status(404);
    throw new Error('الحملة غير موجودة');
  }
  res.json(campaign);
});

// @route POST /api/campaigns (artisan only)
const createCampaign = asyncHandler(async (req, res) => {
  const { title, story, goalAmount, deadline } = req.body;
  const campaign = await Campaign.create({
    artisan: req.user._id,
    title,
    story,
    goalAmount,
    deadline,
  });
  res.status(201).json(campaign);
});

// @route POST /api/campaigns/:id/contribute (any authenticated buyer)
// Records a contribution and updates the campaign's raised amount atomically.
const contribute = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('من فضلك أدخل مبلغًا صحيحًا للدعم');
  }

  const campaign = await Campaign.findById(req.params.id);
  if (!campaign) {
    res.status(404);
    throw new Error('الحملة غير موجودة');
  }
  if (campaign.status !== 'active') {
    res.status(400);
    throw new Error('هذه الحملة لم تعد تستقبل تمويلًا');
  }

  const contribution = await Contribution.create({
    campaign: campaign._id,
    backer: req.user._id,
    amount,
  });

  campaign.raisedAmount += amount;
  if (campaign.raisedAmount >= campaign.goalAmount) {
    campaign.status = 'funded';
  }
  await campaign.save();

  res.status(201).json({ contribution, campaign });
});

module.exports = { getCampaigns, getCampaignById, createCampaign, contribute };
