import SQLite, {SQLiteDatabase} from 'react-native-sqlite-storage';
import {Material, InventoryOperation} from '../types';

const DATABASE_NAME = 'warehouse_scanner.db';
const DATABASE_VERSION = '1.0';
const DATABASE_DISPLAY_NAME = 'Warehouse Scanner Database';

let db: SQLiteDatabase | null = null;

/**
 * 打开数据库连接
 */
export const openDatabase = async (): Promise<SQLiteDatabase> => {
  if (db) {
    return db;
  }

  db = SQLite.openDatabase(
    DATABASE_NAME,
    DATABASE_VERSION,
    DATABASE_DISPLAY_NAME,
    2 * 1024 * 1024, // 2MB
    () => {
      console.log('Database opened successfully');
    },
    (error) => {
      console.error('Database open error:', error);
      throw error;
    }
  );

  await createTables();
  return db;
};

/**
 * 创建数据库表
 */
const createTables = async () => {
  if (!db) return;

  // 创建物料表
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS materials (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      barcode TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      specification TEXT,
      unit TEXT DEFAULT '个',
      currentStock INTEGER DEFAULT 0,
      minStock INTEGER DEFAULT 0,
      maxStock INTEGER DEFAULT 999999,
      location TEXT,
      category TEXT,
      description TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      updatedAt TEXT DEFAULT (datetime('now', 'localtime'))
    )
  `);

  // 创建操作记录表
  await db.executeSql(`
    CREATE TABLE IF NOT EXISTS inventory_operations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      materialId INTEGER NOT NULL,
      materialBarcode TEXT NOT NULL,
      materialName TEXT NOT NULL,
      operationType TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      previousStock INTEGER NOT NULL,
      currentStock INTEGER NOT NULL,
      operator TEXT DEFAULT '管理员',
      reason TEXT,
      createdAt TEXT DEFAULT (datetime('now', 'localtime')),
      FOREIGN KEY (materialId) REFERENCES materials(id)
    )
  `);

  // 创建索引
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_materials_barcode ON materials(barcode)`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category)`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_materials_location ON materials(location)`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_operations_material ON inventory_operations(materialId)`);
  await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_operations_created ON inventory_operations(createdAt)`);
};

/**
 * 关闭数据库连接
 */
export const closeDatabase = async () => {
  if (db) {
    await db.close();
    db = null;
    console.log('Database closed successfully');
  }
};

/**
 * 物料数据访问对象
 */
export const materialDAO = {
  // 插入物料
  insert: async (material: Omit<Material, 'id'>): Promise<number> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      `INSERT INTO materials (barcode, name, specification, unit, currentStock, minStock, maxStock, location, category, description)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        material.barcode,
        material.name,
        material.specification,
        material.unit,
        material.currentStock,
        material.minStock,
        material.maxStock,
        material.location,
        material.category,
        material.description
      ]
    );

    return result[0].insertId;
  },

  // 更新物料
  update: async (id: number, updates: Partial<Material>): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    const fields: string[] = [];
    const values: any[] = [];

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt') {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    });

    if (fields.length === 0) return;

    fields.push('updatedAt = ?');
    values.push(new Date().toISOString());
    values.push(id);

    await db.executeSql(
      `UPDATE materials SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  },

  // 删除物料
  delete: async (id: number): Promise<void> => {
    if (!db) throw new Error('Database not initialized');

    await db.executeSql('DELETE FROM materials WHERE id = ?', [id]);
  },

  // 根据ID获取物料
  getById: async (id: number): Promise<Material | null> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql('SELECT * FROM materials WHERE id = ?', [id]);
    
    if (result[0].rows.length === 0) return null;
    
    const row = result[0].rows.item(0);
    return mapRowToMaterial(row);
  },

  // 根据条码获取物料
  getByBarcode: async (barcode: string): Promise<Material | null> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql('SELECT * FROM materials WHERE barcode = ?', [barcode]);
    
    if (result[0].rows.length === 0) return null;
    
    const row = result[0].rows.item(0);
    return mapRowToMaterial(row);
  },

  // 获取所有物料
  getAll: async (): Promise<Material[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql('SELECT * FROM materials ORDER BY name ASC');
    const materials: Material[] = [];

    for (let i = 0; i < result[0].rows.length; i++) {
      materials.push(mapRowToMaterial(result[0].rows.item(i)));
    }

    return materials;
  },

  // 搜索物料
  search: async (keyword: string): Promise<Material[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      `SELECT * FROM materials 
       WHERE name LIKE ? OR barcode LIKE ? OR specification LIKE ? OR location LIKE ?
       ORDER BY name ASC`,
      [`%${keyword}%`, `%${keyword}%`, `%${keyword}%`, `%${keyword}%`]
    );

    const materials: Material[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      materials.push(mapRowToMaterial(result[0].rows.item(i)));
    }

    return materials;
  },

  // 按分类获取物料
  getByCategory: async (category: string): Promise<Material[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      'SELECT * FROM materials WHERE category = ? ORDER BY name ASC',
      [category]
    );

    const materials: Material[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      materials.push(mapRowToMaterial(result[0].rows.item(i)));
    }

    return materials;
  },

  // 获取低库存物料
  getLowStock: async (): Promise<Material[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      'SELECT * FROM materials WHERE currentStock <= minStock ORDER BY currentStock ASC'
    );

    const materials: Material[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      materials.push(mapRowToMaterial(result[0].rows.item(i)));
    }

    return materials;
  },

  // 获取分类列表
  getCategories: async (): Promise<string[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      'SELECT DISTINCT category FROM materials WHERE category != "" ORDER BY category ASC'
    );

    const categories: string[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      categories.push(result[0].rows.item(i).category);
    }

    return categories;
  },

  // 获取位置列表
  getLocations: async (): Promise<string[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      'SELECT DISTINCT location FROM materials WHERE location != "" ORDER BY location ASC'
    );

    const locations: string[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      locations.push(result[0].rows.item(i).location);
    }

    return locations;
  }
};

/**
 * 库存操作数据访问对象
 */
export const operationDAO = {
  // 插入操作记录
  insert: async (operation: Omit<InventoryOperation, 'id'>): Promise<number> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      `INSERT INTO inventory_operations 
       (materialId, materialBarcode, materialName, operationType, quantity, previousStock, currentStock, operator, reason)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        operation.materialId,
        operation.materialBarcode,
        operation.materialName,
        operation.operationType,
        operation.quantity,
        operation.previousStock,
        operation.currentStock,
        operation.operator || '管理员',
        operation.reason || ''
      ]
    );

    return result[0].insertId;
  },

  // 根据物料ID获取操作记录
  getByMaterialId: async (materialId: number): Promise<InventoryOperation[]> => {
    if (!db) throw new Error('Database not initialized');

    const result = await db.executeSql(
      'SELECT * FROM inventory_operations WHERE materialId = ? ORDER BY createdAt DESC',
      [materialId]
    );

    const operations: InventoryOperation[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      operations.push(mapRowToOperation(result[0].rows.item(i)));
    }

    return operations;
  },

  // 获取所有操作记录
  getAll: async (limit?: number): Promise<InventoryOperation[]> => {
    if (!db) throw new Error('Database not initialized');

    const sql = limit 
      ? 'SELECT * FROM inventory_operations ORDER BY createdAt DESC LIMIT ?'
      : 'SELECT * FROM inventory_operations ORDER BY createdAt DESC';
    
    const params = limit ? [limit] : [];

    const result = await db.executeSql(sql, params);

    const operations: InventoryOperation[] = [];
    for (let i = 0; i < result[0].rows.length; i++) {
      operations.push(mapRowToOperation(result[0].rows.item(i)));
    }

    return operations;
  },

  // 获取今日操作记录数量
  getTodayCount: async (): Promise<number> => {
    if (!db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    const result = await db.executeSql(
      "SELECT COUNT(*) as count FROM inventory_operations WHERE date(createdAt) = ?",
      [today]
    );

    return result[0].rows.item(0).count;
  }
};

/**
 * 将数据库行映射为 Material 对象
 */
const mapRowToMaterial = (row: any): Material => ({
  id: row.id,
  barcode: row.barcode,
  name: row.name,
  specification: row.specification || '',
  unit: row.unit || '个',
  currentStock: row.currentStock || 0,
  minStock: row.minStock || 0,
  maxStock: row.maxStock || 999999,
  location: row.location || '',
  category: row.category || '',
  description: row.description || '',
  createdAt: row.createdAt,
  updatedAt: row.updatedAt
});

/**
 * 将数据库行映射为 InventoryOperation 对象
 */
const mapRowToOperation = (row: any): InventoryOperation => ({
  id: row.id,
  materialId: row.materialId,
  materialBarcode: row.materialBarcode,
  materialName: row.materialName,
  operationType: row.operationType,
  quantity: row.quantity,
  previousStock: row.previousStock,
  currentStock: row.currentStock,
  operator: row.operator || '管理员',
  reason: row.reason || '',
  createdAt: row.createdAt
});
