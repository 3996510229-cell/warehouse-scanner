import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {materialDAO} from '../services/database';
import {useInventoryStore} from '../store/inventoryStore';

interface AddMaterialScreenProps {
  navigation: any;
}

export const AddMaterialScreen: React.FC<AddMaterialScreenProps> = ({navigation}) => {
  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [specification, setSpecification] = useState('');
  const [unit, setUnit] = useState('个');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');
  const [currentStock, setCurrentStock] = useState('0');
  const [minStock, setMinStock] = useState('10');
  const [maxStock, setMaxStock] = useState('99999');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const {addMaterial} = useInventoryStore();

  const handleSave = async () => {
    // 验证必填字段
    if (!barcode.trim()) {
      Alert.alert('提示', '请输入条码');
      return;
    }
    if (!name.trim()) {
      Alert.alert('提示', '请输入物料名称');
      return;
    }

    const stock = parseInt(currentStock, 10);
    const min = parseInt(minStock, 10);
    const max = parseInt(maxStock, 10);

    if (isNaN(stock) || stock < 0) {
      Alert.alert('提示', '请输入有效的当前库存');
      return;
    }
    if (isNaN(min) || min < 0) {
      Alert.alert('提示', '请输入有效的最低库存');
      return;
    }
    if (isNaN(max) || max < 0 || max < min) {
      Alert.alert('提示', '最高库存必须大于最低库存');
      return;
    }

    setSaving(true);

    try {
      // 检查条码是否已存在
      const existing = await materialDAO.getByBarcode(barcode.trim());
      if (existing) {
        Alert.alert('提示', `条码 "${barcode}" 已存在，是否更新？`, [
          {text: '取消', style: 'cancel'},
          {
            text: '更新',
            onPress: () =>
              navigation.navigate('EditMaterial', {materialId: existing.id}),
          },
        ]);
        setSaving(false);
        return;
      }

      // 创建新物料
      const id = await materialDAO.insert({
        barcode: barcode.trim(),
        name: name.trim(),
        specification: specification.trim(),
        unit: unit.trim() || '个',
        currentStock: stock,
        minStock: min,
        maxStock: max,
        location: location.trim(),
        category: category.trim(),
        description: description.trim(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      // 获取新创建的物料
      const newMaterial = await materialDAO.getById(id);

      if (newMaterial) {
        // 更新状态
        addMaterial(newMaterial);

        Alert.alert('成功', '物料创建成功', [
          {text: '继续添加', onPress: () => clearForm()},
          {text: '查看详情', onPress: () => navigation.navigate('MaterialDetail', {materialId: id})},
        ]);
      }
    } catch (error) {
      console.error('Save material error:', error);
      Alert.alert('错误', '保存失败，请重试');
    } finally {
      setSaving(false);
    }
  };

  const clearForm = () => {
    setBarcode('');
    setName('');
    setSpecification('');
    setUnit('个');
    setCategory('');
    setLocation('');
    setCurrentStock('0');
    setMinStock('10');
    setMaxStock('99999');
    setDescription('');
  };

  const isValid = barcode.trim() && name.trim();

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 基本信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>基本信息</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.requiredLabel}>条码</Text>
            <TextInput
              style={styles.input}
              value={barcode}
              onChangeText={setBarcode}
              placeholder="输入或扫描条码"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.requiredLabel}>物料名称</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="输入物料名称"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>规格型号</Text>
            <TextInput
              style={styles.input}
              value={specification}
              onChangeText={setSpecification}
              placeholder="输入规格型号"
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>单位</Text>
              <TextInput
                style={styles.input}
                value={unit}
                onChangeText={setUnit}
                placeholder="个/件/箱"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>分类</Text>
              <TextInput
                style={styles.input}
                value={category}
                onChangeText={setCategory}
                placeholder="物料分类"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>存放位置</Text>
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholder="例如: A区-3层-5架"
            />
          </View>
        </View>

        {/* 库存信息 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>库存信息</Text>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.requiredLabel}>当前库存</Text>
              <TextInput
                style={styles.input}
                value={currentStock}
                onChangeText={setCurrentStock}
                keyboardType="numeric"
                placeholder="0"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>最低预警</Text>
              <TextInput
                style={styles.input}
                value={minStock}
                onChangeText={setMinStock}
                keyboardType="numeric"
                placeholder="10"
              />
            </View>
            <View style={[styles.inputGroup, styles.halfInput]}>
              <Text style={styles.label}>最高限制</Text>
              <TextInput
                style={styles.input}
                value={maxStock}
                onChangeText={setMaxStock}
                keyboardType="numeric"
                placeholder="99999"
              />
            </View>
          </View>
        </View>

        {/* 描述 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>描述</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="输入物料描述备注"
            multiline
            numberOfLines={3}
            textAlignVertical="top"
/>
        </View>

        {/* 保存按钮 */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.saveButton, !isValid && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!isValid || saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? '保存中...' : '保存物料'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.clearButton} onPress={clearForm}>
            <Text style={styles.clearButtonText}>清空表单</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfInput: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  requiredLabel: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 80,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#1976D2',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#1976D2',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonDisabled: {
    backgroundColor: '#ccc',
    shadowOpacity: 0,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  clearButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 12,
  },
  clearButtonText: {
    color: '#666',
    fontSize: 14,
  },
});
