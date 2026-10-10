const { ObjectId } = require('mongodb');
const { getDB } = require('../config/database');
const CONFIG = require('../constants/config');

class Repository {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  getCollection() {
    const db = getDB();
    return db.collection(this.collectionName);
  }

  async findAll(sort = {}) {
    const collection = this.getCollection();
    return await collection.find({}).sort(sort).toArray();
  }

  async findById(id) {
    const collection = this.getCollection();
    return await collection.findOne({ _id: new ObjectId(id) });
  }

  async findOne(filter) {
    const collection = this.getCollection();
    return await collection.findOne(filter);
  }

  async create(data) {
    const collection = this.getCollection();
    const document = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const result = await collection.insertOne(document);
    return await this.findById(result.insertedId.toString());
  }

  async update(id, data) {
    const collection = this.getCollection();
    const updateData = {
      ...data,
      updatedAt: new Date()
    };
    await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    return await this.findById(id);
  }

  async delete(id) {
    const collection = this.getCollection();
    const result = await collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }

  async deleteMany(filter) {
    const collection = this.getCollection();
    const result = await collection.deleteMany(filter);
    return result.deletedCount;
  }
}

module.exports = Repository;
