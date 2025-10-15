import express from 'express';
import giveawayController from '../controllers/giveawayController.js';

const router = express.Router();

router.get('/giveaways', giveawayController.getGiveaways);
router.post('/giveaways', giveawayController.createGiveaway);
router.post('/giveaways/:id/enter', giveawayController.enterGiveaway);
router.post('/giveaways/:id/winner', giveawayController.pickWinner);

export default router;