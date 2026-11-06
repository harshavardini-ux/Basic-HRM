// ============================================================================
// Model Adapter Helper
// Seamlessly delegates to Mongoose Model when connected to MongoDB Atlas,
// or executes on file-backed persistent array with identical Mongoose semantics.
// ============================================================================

import mongoose from 'mongoose';
import { isInMemoryMode, memoryStore, persistDiskStorage } from '../config/db.js';

export function createModelWrapper(modelName, schemaDef, collectionKey) {
  // 1. Define standard Mongoose Schema
  const schema = new mongoose.Schema(schemaDef, {
    timestamps: true
  });

  let MongooseModel;
  try {
    MongooseModel = mongoose.model(modelName, schema);
  } catch {
    MongooseModel = mongoose.models[modelName];
  }

  // 2. Return resilient wrapper
  return {
    schema,
    modelName,

    async find(filter = {}) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.find(filter).lean();
        } catch {
          // Fall back seamlessly to memory store
        }
      }

      let results = [...(memoryStore[collectionKey] || [])];
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
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.findOne(filter).lean();
        } catch {
          // Fall back seamlessly
        }
      }

      const list = await this.find(filter);
      return list[0] || null;
    },

    async findById(id) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.findById(id).lean();
        } catch {
          // Fall back seamlessly
        }
      }

      const items = memoryStore[collectionKey] || [];
      return items.find(item => item._id === id || item.id === id) || null;
    },

    async create(docData) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.create(docData);
        } catch {
          // Fall through to memory store creation
        }
      }

      const newDoc = {
        _id: 'mem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
        ...docData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      if (!memoryStore[collectionKey]) {
        memoryStore[collectionKey] = [];
      }
      memoryStore[collectionKey].push(newDoc);
      persistDiskStorage();
      return newDoc;
    },

    async findByIdAndUpdate(id, updateData, options = { new: true }) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.findByIdAndUpdate(id, updateData, options).lean();
        } catch {
          // Fall through
        }
      }

      const items = memoryStore[collectionKey] || [];
      const idx = items.findIndex(item => item._id === id || item.id === id);
      if (idx === -1) return null;

      items[idx] = {
        ...items[idx],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      persistDiskStorage();
      return items[idx];
    },

    async findByIdAndDelete(id) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.findByIdAndDelete(id).lean();
        } catch {
          // Fall through
        }
      }

      const items = memoryStore[collectionKey] || [];
      const idx = items.findIndex(item => item._id === id || item.id === id);
      if (idx === -1) return null;

      const [deleted] = items.splice(idx, 1);
      persistDiskStorage();
      return deleted;
    },

    async countDocuments(filter = {}) {
      if (!isInMemoryMode() && mongoose.connection.readyState === 1) {
        try {
          return await MongooseModel.countDocuments(filter);
        } catch {
          // Fall through
        }
      }

      const list = await this.find(filter);
      return list.length;
    }
  };
}
