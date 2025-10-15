import express from 'express';
import cors from 'cors';
import { JSONFilePreset } from 'lowdb/node';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const defaultData = { giveaways: [] };
const db = await JSONFilePreset('db.json', defaultData);

app.get('/api/giveaways', async (req, res) => {
  try {
    await db.read();
    res.json(db.data.giveaways);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch giveaways' });
  }
});

app.post('/api/giveaways', async (req, res) => {
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

    await db.read();
    db.data.giveaways.push(newGiveaway);
    await db.write();

    res.status(201).json(newGiveaway);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create giveaway' });
  }
});

app.post('/api/giveaways/:id/enter', async (req, res) => {
  try {
    const { id } = req.params;

    await db.read();
    const giveaway = db.data.giveaways.find(g => g.id === id);

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

    giveaway.entries.push(entry);
    await db.write();

    res.status(201).json({ message: 'Successfully entered giveaway', entryId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to enter giveaway' });
  }
});

app.post('/api/giveaways/:id/winner', async (req, res) => {
  try {
    const { id } = req.params;

    await db.read();
    const giveaway = db.data.giveaways.find(g => g.id === id);

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

    giveaway.winner = {
      entryId: winningEntry.id,
      pickedAt: new Date().toISOString()
    };

    await db.write();

    res.json({ message: 'Winner picked successfully', winner: giveaway.winner });
  } catch (error) {
    res.status(500).json({ error: 'Failed to pick winner' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
