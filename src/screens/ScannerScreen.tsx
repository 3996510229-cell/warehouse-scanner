import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import {BarcodeScanner, ScanResultModal} from '../components/BarcodeScanner';
import {barcodeService, stockService} from '../services/barcodeService';
import {materialDAO} from '../services/database';
import {useInventoryStore} from '../store/inventoryStore';
import {Material} from '../types';

export const ScannerScreen: React.FC<any> = ({navigation}) => {
  const [showScanner, setShowScanner] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material | null>(null);
  const [lastBarcode, setLastBarcode] = useState<string>('');

  const {addOperation, updateStock} = useInventoryStore();

  const handleScan = useCallback(async (barcode: string, format: string) => {
    setLastBarcode(barcode);

    const result = await barcodeService.processScan(barcode, format);

    if (result.success && result.material) {
      setCurrentMaterial(result.material);
      setShowResultModal(true);
    } else {
      // 未找到物料，询问是否新建
      setCurrentMaterial(null);
      setShowResultModal(true);
    }
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
    navigation.goBack();
  }, [navigation]);

  const handleStockIn = async (quantity: number) => {
    if (!currentMaterial) return;

    const result = await stockService.stockIn(currentMaterial, quantity, '扫码入库');

    if (result.success) {
      // 记录操作
      const operation = {
        materialId: currentMaterial.id,
        materialBarcode: currentMaterial.barcode,
        materialName: currentMaterial.name,
        operationType: 'in' as const,
        quantity,
        previousStock: currentMaterial.currentStock,
        currentStock: currentMaterial.currentStock + quantity,
        operator: '管理员',
        reason: '扫码入库',
        createdAt: new Date().toISOString(),
      };
      addOperation(operation);
      updateStock(currentMaterial.id, quantity, 'in');

      Alert.alert('入库成功', result.message, [
        {text: '继续扫码', onPress: () => setShowResultModal(false)},
        {text: '返回', onPress: () => navigation.goBack()},
      ]);
    } else {
      Alert.alert('入库失败', result.message);
    }
  };

  const handleStockOut = async (quantity: number) => {
    if (!currentMaterial) return;

    const result = await stockService.stockOut(currentMaterial, quantity, '扫码出库');

    if (result.success) {
      // 记录操作
      const operation = {
        materialId: currentMaterial.id,
        materialBarcode: currentMaterial.barcode,
        materialName: currentMaterial.name,
        operationType: 'out' as const,
        quantity,
        previousStock: currentMaterial.currentStock,
        currentStock: currentMaterial.currentStock - quantity,
        operator: '管理员',
        reason: '扫码出库',
        createdAt: new Date().toISOString(),
      };
      addOperation(operation);
      updateStock(currentMaterial.id, quantity, 'out');

      Alert.alert('出库成功', result.message, [
        {text: '继续扫码', onPress: () => setShowResultModal(false)},
        {text: '返回', onPress: () => navigation.goBack()},
      ]);
    } else {
      Alert.alert('出库失败', result.message);
    }
  };

  const handleCreateNew = async (name: string, quantity: number) => {
    const result = await barcodeService.createAndStockIn(
      lastBarcode,
      name,
      quantity,
      undefined,
      undefined,
      undefined,
      undefined
    );

    if (result.success && result.material) {
      setCurrentMaterial(result.material);

      Alert.alert('创建成功', result.message, [
        {text: '继续扫码', onPress: () => setShowResultModal(false)},
        {text: '返回', onPress: () => navigation.goBack()},
      ]);
    } else {
      Alert.alert('创建失败', result.message || '请重试');
    }
  };

  if (!showScanner) {
    return null;
  }

  return (
    <View style={styles.container}>
      <BarcodeScanner
        onScan={handleScan}
        onClose={handleCloseScanner}
      />

      <ScanResultModal
        visible={showResultModal}
        material={currentMaterial}
        onClose={() => setShowResultModal(false)}
        onStockIn={handleStockIn}
        onStockOut={handleStockOut}
        onCreateNew={handleCreateNew}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
