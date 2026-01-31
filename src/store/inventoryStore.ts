import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import {Material, InventoryOperation, ScanResult} from '../types';

interface InventoryState {
  // 物料列表
  materials: Material[];
  operations: InventoryOperation[];
  recentScans: ScanResult[];
  
  // 统计数据
  totalMaterials: number;
  totalStock: number;
  lowStockCount: number;
  
  // 加载状态
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setMaterials: (materials: Material[]) => void;
  addMaterial: (material: Material) => void;
  updateMaterial: (id: number, updates: Partial<Material>) => void;
  deleteMaterial: (id: number) => void;
  
  addOperation: (operation: InventoryOperation) => void;
  getOperations: (materialId?: number) => InventoryOperation[];
  
  addScanResult: (result: ScanResult) => void;
  clearRecentScans: () => void;
  
  updateStock: (materialId: number, quantity: number, operationType: string) => void;
  
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      // 初始状态
      materials: [],
      operations: [],
      recentScans: [],
      totalMaterials: 0,
      totalStock: 0,
      lowStockCount: 0,
      isLoading: false,
      error: null,
      
      // Actions
      setMaterials: (materials) => {
        const totalStock = materials.reduce((sum, m) => sum + m.currentStock, 0);
        const lowStockCount = materials.filter(m => m.currentStock <= m.minStock).length;
        
        set({
          materials,
          totalMaterials: materials.length,
          totalStock,
          lowStockCount
        });
      },
      
      addMaterial: (material) => {
        set((state) => ({
          materials: [...state.materials, material],
          totalMaterials: state.totalMaterials + 1,
          totalStock: state.totalStock + material.currentStock,
          lowStockCount: material.currentStock <= material.minStock 
            ? state.lowStockCount + 1 
            : state.lowStockCount
        }));
      },
      
      updateMaterial: (id, updates) => {
        set((state) => {
          const materials = state.materials.map((m) =>
            m.id === id ? {...m, ...updates, updatedAt: new Date().toISOString()} : m
          );
          
          const updatedMaterial = materials.find(m => m.id === id);
          const oldMaterial = state.materials.find(m => m.id === id);
          
          if (!updatedMaterial || !oldMaterial) return {materials};
          
          const totalStockChange = updatedMaterial.currentStock - oldMaterial.currentStock;
          const lowStockChanged = updatedMaterial.currentStock <= updatedMaterial.minStock 
            !== (oldMaterial.currentStock <= oldMaterial.minStock);
          
          return {
            materials,
            totalStock: state.totalStock + totalStockChange,
            lowStockCount: lowStockChanged
              ? (updatedMaterial.currentStock <= updatedMaterial.minStock
                  ? state.lowStockCount + 1
                  : state.lowStockCount - 1)
              : state.lowStockCount
          };
        });
      },
      
      deleteMaterial: (id) => {
        set((state) => {
          const material = state.materials.find(m => m.id === id);
          if (!material) return {materials: state.materials};
          
          return {
            materials: state.materials.filter(m => m.id !== id),
            totalMaterials: state.totalMaterials - 1,
            totalStock: state.totalStock - material.currentStock,
            lowStockCount: material.currentStock <= material.minStock
              ? state.lowStockCount - 1
              : state.lowStockCount
          };
        });
      },
      
      addOperation: (operation) => {
        set((state) => ({
          operations: [operation, ...state.operations]
        }));
      },
      
      getOperations: (materialId) => {
        const state = get();
        if (materialId === undefined) {
          return state.operations;
        }
        return state.operations.filter(op => op.materialId === materialId);
      },
      
      addScanResult: (result) => {
        set((state) => ({
          recentScans: [result, ...state.recentScans.slice(0, 49)]
        }));
      },
      
      clearRecentScans: () => {
        set({recentScans: []});
      },
      
      updateStock: (materialId, quantity, operationType) => {
        set((state) => {
          const materials = state.materials.map(m => {
            if (m.id === materialId) {
              let newStock = m.currentStock;
              
              switch (operationType) {
                case 'in':
                  newStock += quantity;
                  break;
                case 'out':
                  newStock -= quantity;
                  break;
                case 'adjustment':
                  newStock = quantity;
                  break;
              }
              
              return {...m, currentStock: newStock, updatedAt: new Date().toISOString()};
            }
            return m;
          });
          
          const material = materials.find(m => m.id === materialId);
          const oldMaterial = state.materials.find(m => m.id === materialId);
          
          if (!material || !oldMaterial) return {materials};
          
          const totalStock = materials.reduce((sum, m) => sum + m.currentStock, 0);
          const lowStockCount = materials.filter(m => m.currentStock <= m.minStock).length;
          
          return {
materials,
            totalStock,
            lowStockCount
          };
        });
      },
      
      setLoading: (loading) => {
        set({isLoading: loading});
      },
      
      setError: (error) => {
        set({error});
      }
    }),
    {
      name: 'warehouse-inventory-storage',
      partialize: (state) => ({
        recentScans: state.recentScans
      })
    }
  )
);
