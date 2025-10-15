import { v4 as uuidv4 } from 'uuid';
import giveawayModel from '../models/giveawayModel.js';

const getGiveaways = async (req, res) => {
  try {
    const giveaways = await giveawayModel.getAllGiveaways();
    res.json(giveaways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch giveaways' });
  }
};

const createGiveaway = async (req, res) => {
  try {
    const { title } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title is required' });
    }

    const newGiveaway = {
      id: uuidv4(),
      title: title.trim(),
      entries: [],
      winner: null,
      createdAt: new Date().toISOString()
    };

    const createdGiveaway = await giveawayModel.createGiveaway(newGiveaway);
    res.status(201).json(createdGiveaway);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create giveaway' });
  }
};

const enterGiveaway = async (req, res) => {
  try {
    const { id } = req.params;

    const giveaway = await giveawayModel.getGiveawayById(id);

    if (!giveaway) {
      return res.status(404).json({ error: 'Giveaway not found' });
    }

    if (giveaway.winner) {
      return res.status(400).json({ error: 'Giveaway has already ended' });
    }

    const entryId = uuidv4();
    const entry = {
      id: entryId,
      enteredAt: new Date().toISOString()
    };

    await giveawayModel.addEntry(id, entry);

    res.status(201).json({ message: 'Successfully entered giveaway', entryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enter giveaway' });
  }
};

const pickWinner = async (req, res) => {
  try {
    const { id } = req.params;

    const giveaway = await giveawayModel.getGiveawayById(id);

    if (!giveaway) {
      return res.status(404).json({ error: 'Giveaway not found' });
    }

    if (giveaway.entries.length === 0) {
      return res.status(400).json({ error: 'No entries to pick from' });
    }

    if (giveaway.winner) {
      return res.status(400).json({ error: 'Winner already picked', winner: giveaway.winner });
    }

    const randomIndex = Math.floor(Math.random() * giveaway.entries.length);
    const winningEntry = giveaway.entries[randomIndex];

    const winner = {
      entryId: winningEntry.id,
      pickedAt: new Date().toISOString()
    };

    await giveawayModel.setWinner(id, winner);

    res.json({ message: 'Winner picked successfully', winner });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pick winner' });
  }
};

export default {
  getGiveaways,
  createGiveaway,
  enterGiveaway,
  pickWinner
};