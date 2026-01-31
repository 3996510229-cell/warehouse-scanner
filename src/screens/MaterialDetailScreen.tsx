import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Material} from '../types';
import {materialDAO, operationDAO} from '../services/database';
import {stockService} from '../services/barcodeService';
import {useInventoryStore} from '../store/inventoryStore';

interface MaterialDetailScreenProps {
  route: any;
  navigation: any;
}

export const MaterialDetailScreen: React.FC<MaterialDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const {materialId} = route.params;
  const [material, setMaterial] = useState<Material | null>(null);
  const [operations, setOperations] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showAdjustModal, setShowAdjustModal] = useState(false);
  const [adjustQuantity, setAdjustQuantity] = useState('');
  const [adjustReason, setAdjustReason] = useState('');

  const {updateStock, addOperation} = useInventoryStore();

  const loadData = useCallback(async () => {
    try {
      const materialData = await materialDAO.getById(materialId);
      const operationsData = await operationDAO.getByMaterialId(materialId);
      setMaterial(materialData);
      setOperations(operationsData);
    } catch (error) {
      console.error('Load data error:', error);
    }
  }, [materialId]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const handleStockIn = async () => {
    if (!material) return;
    const quantity = parseInt(adjustQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('提示', '请输入有效的入库数量');
      return;
    }

    const result = await stockService.stockIn(material, quantity, adjustReason || '手动入库');

    if (result.success) {
      addOperation({
        materialId: material.id,
        materialBarcode: material.barcode,
        materialName: material.name,
        operationType: 'in',
        quantity,
        previousStock: material.currentStock,
        currentStock: material.currentStock + quantity,
        operator: '管理员',
        reason: adjustReason || '手动入库',
        createdAt: new Date().toISOString(),
      });
      updateStock(material.id, quantity, 'in');
      setShowAdjustModal(false);
      setAdjustQuantity('');
      setAdjustReason('');
      loadData();
      Alert.alert('成功', '入库成功');
    } else {
      Alert.alert('失败', result.message);
    }
  };

  const handleStockOut = async () => {
    if (!material) return;
    const quantity = parseInt(adjustQuantity, 10);
    if (isNaN(quantity) || quantity <= 0) {
      Alert.alert('提示', '请输入有效的出库数量');
      return;
    }

    const result = await stockService.stockOut(material, quantity, adjustReason || '手动出库');

    if (result.success) {
      addOperation({
        materialId: material.id,
        materialBarcode: material.barcode,
        materialName: material.name,
        operationType: 'out',
        quantity,
        previousStock: material.currentStock,
        currentStock: material.currentStock - quantity,
        operator: '管理员',
        reason: adjustReason || '手动出库',
        createdAt: new Date().toISOString(),
      });
      updateStock(material.id, quantity, 'out');
      setShowAdjustModal(false);
      setAdjustQuantity('');
      setAdjustReason('');
      loadData();
      Alert.alert('成功', '出库成功');
    } else {
      Alert.alert('失败', result.message);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditMaterial', {materialId: material?.id});
  };

  if (!material) {
    return (
      <View style={styles.loadingContainer}>
        <Text>加载中...</Text>
      </View>
    );
  }

  const isLowStock = material.currentStock <= material.minStock;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* 物料基本信息 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>物料信息</Text>
          <TouchableOpacity onPress={handleEdit}>
            <Text style={styles.editButton}>编辑</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>条码</Text>
          <Text style={styles.infoValue}>{material.barcode}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>名称</Text>
          <Text style={styles.infoValue}>{material.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>规格</Text>
          <Text style={styles.infoValue}>{material.specification || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>单位</Text>
          <Text style={styles.infoValue}>{material.unit}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>分类</Text>
          <Text style={styles.infoValue}>{material.category || '-'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>位置</Text>
          <Text style={styles.infoValue}>{material.location || '-'}</Text>
        </View>
      </View>

      {/* 库存信息 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>库存信息</Text>
          {isLowStock && (
            <View style={styles.warningBadge}>
              <Text style={styles.warningText}>低库存预警</Text>
            </View>
          )}
        </View>

        <View style={styles.stockDisplay}>
          <View style={styles.stockMain}>
            <Text style={styles.stockLabel}>当前库存</Text>
            <Text style={[styles.stockValue, isLowStock && styles.lowStockValue]}>
              {material.currentStock}
            </Text>
            <Text style={styles.stockUnit}>{material.unit}</Text>
          </View>

          <View style={styles.stockLimits}>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>最低预警</Text>
              <Text style={styles.limitValue}>{material.minStock}</Text>
            </View>
            <View style={styles.limitItem}>
              <Text style={styles.limitLabel}>最高限制</Text>
              <Text style={styles.limitValue}>{material.maxStock}</Text>
            </View>
          </View>
        </View>

        {isLowStock && (
          <Text style={styles.warningMessage}>
            当前库存低于最低预警库存，请及时补货
          </Text>
        )}

        {/* 入库出库按钮 */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.stockInButton]}
            onPress={() => setShowAdjustModal(true)}
          >
            <Text style={styles.actionButtonText}>入库</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, styles.stockOutButton]}
            onPress={() => {
              setAdjustQuantity('');
              setAdjustReason('');
              setShowAdjustModal(true);
            }}
          >
            <Text style={styles.actionButtonText}>出库</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* 操作记录 */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>操作记录</Text>
          <Text style={styles.recordCount}>{operations.length} 条</Text>
        </View>

        {operations.length > 0 ? (
          operations.slice(0, 10).map((op, index) => (
            <View key={op.id || index} style={styles.operationItem}>
              <View style={styles.operationHeader}>
                <View style={[
                  styles.operationType,
                  op.operationType === 'in' && styles.operationIn,
                  op.operationType === 'out' && styles.operationOut,
                  op.operationType === 'adjustment' && styles.operationAdjustment,
                ]}>
                  <Text style={styles.operationTypeText}>
                    {op.operationType === 'in' ? '入库' : op.operationType === 'out' ? '出库' : '调整'}
                  </Text>
                </View>
                <Text style={styles.operationQuantity}>
                  {op.operationType === 'out' ? '-' : '+'}{op.quantity}
                </Text>
              </View>
              <View style={styles.operationDetails}>
                <Text style={styles.operationStock}>
                  {op.previousStock} → {op.currentStock}
                </Text>
                <Text style={styles.operationDate}>
                  {new Date(op.createdAt).toLocaleString()}
                </Text>
              </View>
              {op.reason && (
                <Text style={styles.operationReason}>{op.reason}</Text>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noRecords}>暂无操作记录</Text>
        )}
      </View>

      {/* 调整库存弹窗 */}
      <Modal
        visible={showAdjustModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAdjustModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>调整库存</Text>
              <TouchableOpacity onPress={() => setShowAdjustModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalBody}>
              <Text style={styles.currentStock}>
                当前库存: {material.currentStock} {material.unit}
              </Text>

              <Text style={styles.inputLabel}>数量</Text>
              <TextInput
                style={styles.quantityInput}
                value={adjustQuantity}
                onChangeText={setAdjustQuantity}
                keyboardType="numeric"
                placeholder="输入数量"
              />

              <Text style={styles.inputLabel}>原因 (选填)</Text>
              <TextInput
                style={styles.reasonInput}
                value={adjustReason}
                onChangeText={setAdjustReason}
                placeholder="输入调整原因"
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalStockInButton]}
                  onPress={handleStockIn}
                >
                  <Text style={styles.modalButtonText}>确认入库</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalStockOutButton]}
                  onPress={handleStockOut}
                >
                  <Text style={styles.modalButtonText}>确认出库</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  editButton: {
    color: '#1976D2',
    fontSize: 14,
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  warningText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 70,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  stockDisplay: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stockMain: {
    alignItems: 'center',
    marginBottom: 16,
  },
  stockLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  stockValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  lowStockValue: {
    color: '#FF5722',
  },
  stockUnit: {
    fontSize: 16,
    color: '#999',
    marginTop: 4,
  },
  stockLimits: {
    flexDirection: 'row',
    gap: 32,
  },
  limitItem: {
    alignItems: 'center',
  },
  limitLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  limitValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  warningMessage: {
    color: '#FF5722',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  stockInButton: {
    backgroundColor: '#4CAF50',
  },
  stockOutButton: {
    backgroundColor: '#FF9800',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  recordCount: {
    fontSize: 12,
    color: '#999',
  },
  operationItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  operationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  operationType: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  operationIn: {
    backgroundColor: '#E8F5E9',
  },
  operationOut: {
    backgroundColor: '#FFF3E0',
  },
  operationAdjustment: {
    backgroundColor: '#E3F2FD',
  },
  operationTypeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  operationQuantity: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  operationDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  operationStock: {
    fontSize: 12,
    color: '#666',
  },
  operationDate: {
    fontSize: 12,
    color: '#999',
  },
  operationReason: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  noRecords: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '85%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalClose: {
    fontSize: 20,
    color: '#999',
  },
  modalBody: {
    padding: 16,
  },
  currentStock: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  quantityInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalStockInButton: {
    backgroundColor: '#4CAF50',
  },
  modalStockOutButton: {
    backgroundColor: '#FF9800',
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
