import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {Camera, useCameraDevices, useFrameProcessor} from 'react-native-vision-camera';
import {useScanBarcodes, BarcodeFormat} from 'vision-camera-code-scanner';
import {checkCameraPermission, requestCameraPermission} from '../services/barcodeService';
import {Material} from '../types';

interface BarcodeScannerProps {
  onScan: (barcode: string, format: string) => void;
  onClose: () => void;
}

export const BarcodeScanner: React.FC<BarcodeScannerProps> = ({onScan, onClose}) => {
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState(true);
  const [lastScanned, setLastScanned] = useState<string | null>(null);
  const cameraRef = useRef<Camera>(null);
  const devices = useCameraDevices();
  const device = devices.back;

  // 检查并请求权限
  useEffect(() => {
    const checkPermission = async () => {
      const status = await checkCameraPermission();
      if (status === 'undetermined') {
        const newStatus = await requestCameraPermission();
        setHasPermission(newStatus === 'granted');
      } else {
        setHasPermission(status === 'granted');
      }
    };
    checkPermission();
  }, []);

  // 帧处理器
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    // 条码识别逻辑在 VisionCamera 扩展中处理
  }, []);

  // 使用 hooks 进行条码识别
  const [barcodes, setBarcodes] = useScanBarcodes(
    device ? [BarcodeFormat.QR_CODE, BarcodeFormat.EAN_13, BarcodeFormat.EAN_8, BarcodeFormat.CODE_128, BarcodeFormat.CODE_39, BarcodeFormat.UPC_A, BarcodeFormat.UPC_E] : [],
    {
      checkTimerInterval: 500,
    }
  );

  // 处理扫描结果
  useEffect(() => {
    if (barcodes.length > 0 && isScanning) {
      const barcode = barcodes[0];
      if (barcode?.rawValue && barcode.rawValue !== lastScanned) {
        setLastScanned(barcode.rawValue);
        setIsScanning(false);
        onScan(barcode.rawValue, barcode.format.toString());
      }
    }
  }, [barcodes, isScanning, lastScanned, onScan]);

  if (!device) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>正在加载相机...</Text>
        <ActivityIndicator size="large" color="#1976D2" />
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>需要相机权限才能扫描条码</Text>
        <TouchableOpacity style={styles.button} onPress={onClose}>
          <Text style={styles.buttonText}>关闭</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFillObject}
        device={device}
        isActive={true}
        frameProcessor={frameProcessor}
        videoStabilizationMode="auto"
      />
      
      {/* 扫描框 */}
      <View style={styles.scanOverlay}>
        <View style={styles.scanFrame}>
          <View style={[styles.corner, styles.topLeft]} />
          <View style={[styles.corner, styles.topRight]} />
          <View style={[styles.corner, styles.bottomLeft]} />
          <View style={[styles.corner, styles.bottomRight]} />
        </View>
        <Text style={styles.hintText}>将条码放入框内自动识别</Text>
      </View>
      
      {/* 关闭按钮 */}
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <Text style={styles.closeButtonText}>✕</Text>
      </TouchableOpacity>
    </View>
  );
};

interface ScanResultModalProps {
  visible: boolean;
  material: Material | null;
  onClose: () => void;
  onStockIn: (quantity: number) => void;
  onStockOut: (quantity: number) => void;
  onCreateNew: (name: string, quantity: number) => void;
}

export const ScanResultModal: React.FC<ScanResultModalProps> = ({
  visible,
  material,
  onClose,
  onStockIn,
  onStockOut,
  onCreateNew
}) => {
  const [quantity, setQuantity] = useState('1');
  const [newMaterialName, setNewMaterialName] = useState('');

  const handleStockIn = () => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onStockIn(qty);
      setQuantity('1');
    }
  };

  const handleStockOut = () => {
    const qty = parseInt(quantity, 10);
    if (!isNaN(qty) && qty > 0) {
      onStockOut(qty);
      setQuantity('1');
    }
  };

  const handleCreateNew = () => {
    const qty = parseInt(quantity, 10);
    if (newMaterialName.trim() && !isNaN(qty) && qty > 0) {
      onCreateNew(newMaterialName.trim(), qty);
      setNewMaterialName('');
      setQuantity('1');
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {material ? '物料信息' : '新建物料'}
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.modalCloseText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalBody}>
            {material ? (
              <>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>条码:</Text>
                  <Text style={styles.infoValue}>{material.barcode}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>名称:</Text>
                  <Text style={styles.infoValue}>{material.name}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>规格:</Text>
                  <Text style={styles.infoValue}>{material.specification}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>单位:</Text>
                  <Text style={styles.infoValue}>{material.unit}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>当前位置:</Text>
                  <Text style={styles.infoValue}>{material.location}</Text>
                </View>
                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>当前库存:</Text>
                  <Text style={[
                    styles.stockValue,
                    material.currentStock <= material.minStock && styles.lowStock
                  ]}>
                    {material.currentStock} {material.unit}
                  </Text>
                </View>
                
                {material.currentStock <= material.minStock && (
                  <Text style={styles.warningText}>库存低于最低库存预警！</Text>
                )}

                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>数量:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="输入数量"
                  />
                </View>

                <View style={styles.buttonRow}>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.stockInButton]} 
                    onPress={handleStockIn}
                  >
                    <Text style={styles.actionButtonText}>入库</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={[styles.actionButton, styles.stockOutButton]} 
                    onPress={handleStockOut}
                  >
                    <Text style={styles.actionButtonText}>出库</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
                <Text style={styles.newMaterialHint}>未找到该条码对应的物料</Text>
                
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>物料名称:</Text>
                  <TextInput
                    style={styles.nameInput}
                    value={newMaterialName}
                    onChangeText={setNewMaterialName}
                    placeholder="输入物料名称"
                  />
                </View>
                
                <View style={styles.inputRow}>
                  <Text style={styles.inputLabel}>入库数量:</Text>
                  <TextInput
                    style={styles.quantityInput}
                    value={quantity}
                    onChangeText={setQuantity}
                    keyboardType="numeric"
                    placeholder="输入数量"
                  />
                </View>

                <TouchableOpacity 
                  style={[styles.actionButton, styles.createButton]} 
                  onPress={handleCreateNew}
                >
                  <Text style={styles.actionButtonText}>创建并入库</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 20,
  },
  scanOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 250,
    height: 150,
    borderWidth: 2,
    borderColor: 'rgba(25, 118, 210, 0.5)',
    backgroundColor: 'transparent',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#1976D2',
  },
  topLeft: {
    top: -2,
    left: -2,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: -2,
    right: -2,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: -2,
    left: -2,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: -2,
    right: -2,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  hintText: {
    color: '#fff',
    fontSize: 14,
    marginTop: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  button: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
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
  modalCloseText: {
    fontSize: 20,
    color: '#999',
  },
  modalBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  infoLabel: {
    width: 80,
    fontSize: 14,
    color: '#666',
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  stockRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    padding: 12,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  stockLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stockValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
    marginLeft: 12,
  },
  lowStock: {
    color: '#FF5722',
  },
  warningText: {
    color: '#FF5722',
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  inputLabel: {
    fontSize: 14,
    color: '#666',
    width: 80,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  nameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 24,
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
  createButton: {
    backgroundColor: '#2196F3',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  newMaterialHint: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
});
