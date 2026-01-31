import {Platform} from 'react-native';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Material} from '../types';
import {materialDAO} from './database';
import {useInventoryStore} from '../store/inventoryStore';

/**
 * 相机权限状态
 */
export type PermissionStatus = 'granted' | 'denied' | 'restricted' | 'undetermined';

/**
 * 请求相机权限
 */
export const requestCameraPermission = async (): Promise<PermissionStatus> => {
  const permission = Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

  const result = await request(permission);
  
  switch (result) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.RESTRICTED:
      return 'restricted';
    case RESULTS.UNAVAILABLE:
      return 'undetermined';
    default:
      return 'undetermined';
  }
};

/**
 * 检查相机权限
 */
export const checkCameraPermission = async (): Promise<PermissionStatus> => {
  const permission = Platform.OS === 'ios'
    ? PERMISSIONS.IOS.CAMERA
    : PERMISSIONS.ANDROID.CAMERA;

  const result = await check(permission);
  
  switch (result) {
    case RESULTS.GRANTED:
      return 'granted';
    case RESULTS.DENIED:
      return 'denied';
    case RESULTS.RESTRICTED:
      return 'restricted';
    case RESULTS.UNAVAILABLE:
      return 'undetermined';
    default:
      return 'undetermined';
  }
};

/**
 * 扫码服务
 */
export const barcodeService = {
  /**
   * 处理扫描结果
   */
  processScan: async (barcode: string, format: string): Promise<{
    success: boolean;
    material?: Material;
    message: string;
  }> => {
    try {
      // 保存扫码记录
      const {addScanResult} = useInventoryStore.getState();
      addScanResult({
        barcode,
        format,
        timestamp: Date.now()
      });

      // 查找物料
      const material = await materialDAO.getByBarcode(barcode);
      
      if (material) {
        return {
          success: true,
          material,
          message: '物料查询成功'
        };
      } else {
        return {
          success: false,
          message: `未找到条码为 "${barcode}" 的物料，是否需要新建？`
        };
      }
    } catch (error) {
      console.error('Process scan error:', error);
      return {
        success: false,
        message: '处理扫码结果时发生错误'
      };
    }
  },

  /**
   * 创建新物料并入库
   */
  createAndStockIn: async (
    barcode: string,
    name: string,
    quantity: number,
    specification?: string,
    unit?: string,
    location?: string,
    category?: string
  ): Promise<{
    success: boolean;
    material?: Material;
    message: string;
  }> => {
    try {
      // 检查是否已存在
      const existing = await materialDAO.getByBarcode(barcode);
      if (existing) {
        return {
          success: false,
          material: existing,
          message: '该条码已存在物料，是否需要更新库存？'
        };
      }

      // 创建新物料
      const materialId = await materialDAO.insert({
        barcode,
        name,
        specification: specification || '',
        unit: unit || '个',
        currentStock: quantity,
        minStock: 10,
        maxStock: 99999,
        location: location || '',
        category: category || '',
        description: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // 获取新创建的物料
      const newMaterial = await materialDAO.getById(materialId);
      
      if (newMaterial) {
        // 记录操作
        await recordOperation(newMaterial, 'in', quantity, '新建物料并入库');
        
        // 更新状态
        useInventoryStore.getState().addMaterial(newMaterial);
        
        return {
          success: true,
          material: newMaterial,
          message: `新建物料 "${name}" 成功，入库 ${quantity}`
        };
      }
      
      return {
        success: false,
        message: '创建物料失败'
      };
    } catch (error) {
      console.error('Create and stock in error:', error);
      return {
        success: false,
        message: '创建物料时发生错误'
      };
    }
  }
};

/**
 * 记录库存操作
 */
const recordOperation = async (
  material: Material,
  operationType: 'in' | 'out' | 'adjustment',
  quantity: number,
  reason: string
): Promise<void> => {
  const previousStock = material.currentStock;
  let currentStock = previousStock;
  
  switch (operationType) {
    case 'in':
      currentStock += quantity;
      break;
    case 'out':
      currentStock -= quantity;
      break;
    case 'adjustment':
      currentStock = quantity;
      break;
  }

  await operationDAO.insert({
    materialId: material.id,
    materialBarcode: material.barcode,
    materialName: material.name,
    operationType,
    quantity,
    previousStock,
    currentStock,
    operator: '管理员',
    reason
  });

  // 更新物料库存
  await materialDAO.update(material.id, {currentStock});
};

/**
 * 更新库存
 */
export const stockService = {
  /**
   * 入库
   */
  stockIn: async (
    material: Material,
    quantity: number,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      await recordOperation(material, 'in', quantity, reason || '入库');
      
      // 更新状态
      useInventoryStore.getState().updateStock(material.id, quantity, 'in');
      
      return {
        success: true,
        message: `入库成功，${material.name} 库存 ${material.currentStock} → ${material.currentStock + quantity}`
      };
    } catch (error) {
      console.error('Stock in error:', error);
      return {
        success: false,
        message: '入库操作失败'
      };
    }
  },

  /**
   * 出库
   */
  stockOut: async (
    material: Material,
    quantity: number,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      if (material.currentStock < quantity) {
        return {
          success: false,
          message: `出库失败，${material.name} 当前库存 ${material.currentStock}，不足以出库 ${quantity}`
        };
      }

      await recordOperation(material, 'out', quantity, reason || '出库');
      
      // 更新状态
      useInventoryStore.getState().updateStock(material.id, quantity, 'out');
      
      return {
        success: true,
        message: `出库成功，${material.name} 库存 ${material.currentStock} → ${material.currentStock - quantity}`
      };
    } catch (error) {
      console.error('Stock out error:', error);
      return {
        success: false,
        message: '出库操作失败'
      };
    }
  },

  /**
   * 调整库存
   */
  adjustStock: async (
    material: Material,
    newStock: number,
    reason?: string
  ): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      await recordOperation(material, 'adjustment', newStock, reason || '库存调整');
      
      // 更新状态
      useInventoryStore.getState().updateStock(material.id, newStock, 'adjustment');
      
      return {
        success: true,
        message: `库存调整成功，${material.name} 库存 ${material.currentStock} → ${newStock}`
      };
    } catch (error) {
      console.error('Adjust stock error:', error);
      return {
        success: false,
        message: '库存调整失败'
      };
    }
  }
};
