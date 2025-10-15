import { JSONFilePreset } from 'lowdb/node';

const defaultData = { giveaways: [] };
let db;

const initDB = async () => {
  db = await JSONFilePreset('db.json', defaultData);
  return db;
};

const getAllGiveaways = async () => {
  await db.read();
  return db.data.giveaways;
};

const getGiveawayById = async (id) => {
  await db.read();
  return db.data.giveaways.find(g => g.id === id);
};

const createGiveaway = async (giveawayData) => {
  await db.read();
  db.data.giveaways.push(giveawayData);
  await db.write();
  return giveawayData;
};

const addEntry = async (giveawayId, entry) => {
  await db.read();
  const giveaway = db.data.giveaways.find(g => g.id === giveawayId);
  if (giveaway) {
    giveaway.entries.push(entry);
    await db.write();
  }
  return giveaway;
};

const setWinner = async (giveawayId, winner) => {
  await db.read();
  const giveaway = db.data.giveaways.find(g => g.id === giveawayId);
  if (giveaway) {
    giveaway.winner = winner;
    await db.write();
  }
  return giveaway;
};

export default {
  initDB,
  getAllGiveaways,
  getGiveawayById,
  createGiveaway,
  addEntry,
  setWinner
};