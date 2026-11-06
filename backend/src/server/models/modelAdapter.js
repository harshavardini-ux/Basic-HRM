import mongoose from 'mongoose';
import { isInMemoryMode, memoryStore } from '../config/db.js';

export function createModelWrapper(modelName, schemaDef, collectionKey) {
  // 1. Define standard Mongoose Schema
  const schema = new mongoose.Schema(schemaDef, {
    timestamps: true
  });

  // Ensure index if specified in schema
  let MongooseModel;
  try {
    MongooseModel = mongoose.model(modelName, schema);
  } catch {
    MongooseModel = mongoose.models[modelName];
  }

  // 2. Return wrapper that delegates to Mongoose or MemoryStore
  return {
    schema,
    modelName,

    async find(filter = {}) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        return await MongooseModel.find(filter).lean();
      }

      let results = [...memoryStore[collectionKey]];
      for (const [key, val] of Object.entries(filter)) {
        if (val !== undefined && val !== null && val !== '') {
          if (typeof val === 'object' && val.$regex) {
            const regex = new RegExp(val.$regex, val.$options || 'i');
            results = results.filter(item => regex.test(String(item[key] || '')));
          } else {
            results = results.filter(item => String(item[key]) === String(val));
          }
        }
      }
      return results;
    },

    async findOne(filter = {}) {
      const list = await this.find(filter);
      return list[0] || null;
    },

    async findById(id) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        return await MongooseModel.findById(id).lean();
      }
      return memoryStore[collectionKey].find(item => item._id === id || item.id === id) || null;
    },

    async create(docData) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        return await MongooseModel.create(docData);
      }
      const newDoc = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...docData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      memoryStore[collectionKey].push(newDoc);
      return newDoc;
    },

    async findByIdAndUpdate(id, updateData, options = { new: true }) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndUpdate(id, updateData, options).lean();
      }
      const idx = memoryStore[collectionKey].findIndex(item => item._id === id || item.id === id);
      if (idx === -1) return null;
      memoryStore[collectionKey][idx] = {
        ...memoryStore[collectionKey][idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      return memoryStore[collectionKey][idx];
    },

    async findByIdAndDelete(id) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        return await MongooseModel.findByIdAndDelete(id).lean();
      }
      const idx = memoryStore[collectionKey].findIndex(item => item._id === id || item.id === id);
      if (idx === -1) return null;
      const [deleted] = memoryStore[collectionKey].splice(idx, 1);
      return deleted;
    },

    async countDocuments(filter = {}) {
      const list = await this.find(filter);
      return list.length;
    }
  };
}
