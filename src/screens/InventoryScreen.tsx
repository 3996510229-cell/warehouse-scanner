import React, {useCallback, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Modal,
  TextInput,
  ScrollView,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {InventoryItem, SearchBar, EmptyState} from '../components/InventoryItem';
import {useInventoryStore} from '../store/inventoryStore';
import {materialDAO} from '../services/database';
import {Material} from '../types';

export const InventoryScreen: React.FC<any> = ({navigation}) => {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [filteredMaterials, setFilteredMaterials] = useState<Material[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [showFilterModal, setShowFilterModal] = useState(false);

  const {materials, setMaterials} = useInventoryStore();

  const loadData = useCallback(async () => {
    try {
      const materialsList = await materialDAO.getAll();
      const categoriesList = await materialDAO.getCategories();
      setMaterials(materialsList);
      setCategories(categoriesList);
    } catch (error) {
      console.error('Load materials error:', error);
    }
  }, [setMaterials]);

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

  // 搜索过滤
  useEffect(() => {
    let result = materials;

    if (searchKeyword) {
      const keyword = searchKeyword.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(keyword) ||
          m.barcode.toLowerCase().includes(keyword) ||
          m.specification.toLowerCase().includes(keyword) ||
          m.location.toLowerCase().includes(keyword)
      );
    }

    if (selectedCategory) {
      result = result.filter((m) => m.category === selectedCategory);
    }

    setFilteredMaterials(result);
  }, [materials, searchKeyword, selectedCategory]);

  const handleMaterialPress = (material: Material) => {
    navigation.navigate('MaterialDetail', {materialId: material.id});
  };

  const clearFilters = () => {
    setSearchKeyword('');
    setSelectedCategory(null);
  };

  const hasFilters = searchKeyword.length > 0 || selectedCategory !== null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>库存列表</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilterModal(true)}
        >
          <Text style={styles.filterButtonText}>
            {selectedCategory ? `筛选: ${selectedCategory}` : '筛选'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={searchKeyword}
          onChange={setSearchKeyword}
          placeholder="搜索物料名称、条码、位置..."
        />
      </View>

      {hasFilters && (
        <View style={styles.filterTags}>
          <TouchableOpacity style={styles.clearFilter} onPress={clearFilters}>
            <Text style={styles.clearFilterText}>清除筛选</Text>
          </TouchableOpacity>
          {selectedCategory && (
            <View style={styles.filterTag}>
              <Text style={styles.filterTagText}>{selectedCategory}</Text>
              <TouchableOpacity onPress={() => setSelectedCategory(null)}>
                <Text style={styles.filterTagClose}>×</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>
          共 {filteredMaterials.length} 种物料
        </Text>
        <Text style={styles.statsText}>
          总库存 {filteredMaterials.reduce((sum, m) => sum + m.currentStock, 0)}
        </Text>
      </View>

      <FlatList
        data={filteredMaterials}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({item}) => (
          <InventoryItem material={item} onPress={() => handleMaterialPress(item)} />
        )}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title={hasFilters ? '未找到物料' : '暂无物料'}
            message={
              hasFilters
                ? '请尝试其他搜索条件'
                : '开始添加您的第一个物料吧'
            }
            actionTitle={hasFilters ? undefined : '添加物料'}
            onAction={hasFilters ? clearFilters : () => navigation.navigate('AddMaterial')}
          />
        }
      />

      {/* 分类筛选弹窗 */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterModalHeader}>
              <Text style={styles.filterModalTitle}>选择分类</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Text style={styles.filterModalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterModalBody}>
              <TouchableOpacity
                style={[
                  styles.filterOption,
                  selectedCategory === null && styles.filterOptionSelected,
                ]}
                onPress={() => {
                  setSelectedCategory(null);
                  setShowFilterModal(false);
                }}
              >
                <Text
                  style={[
                    styles.filterOptionText,
                    selectedCategory === null && styles.filterOptionTextSelected,
                  ]}
                >
                  全部分类
                </Text>
              </TouchableOpacity>

              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.filterOption,
                    selectedCategory === category && styles.filterOptionSelected,
                  ]}
                  onPress={() => {
                    setSelectedCategory(category);
                    setShowFilterModal(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedCategory === category && styles.filterOptionTextSelected,
                    ]}
                  >
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}

              {categories.length === 0 && (
                <Text style={styles.noCategories}>暂无分类</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  filterButtonText: {
    color: '#1976D2',
    fontSize: 14,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  filterTags: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 8,
  },
  clearFilter: {
    paddingVertical: 4,
  },
  clearFilterText: {
    color: '#1976D2',
    fontSize: 14,
  },
  filterTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  filterTagText: {
    color: '#1976D2',
    fontSize: 12,
  },
  filterTagClose: {
    color: '#1976D2',
    fontSize: 16,
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModal: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  filterModalClose: {
    fontSize: 20,
    color: '#999',
  },
  filterModalBody: {
    padding: 16,
  },
  filterOption: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  filterOptionSelected: {
    backgroundColor: '#E3F2FD',
  },
  filterOptionText: {
    fontSize: 16,
    color: '#333',
  },
  filterOptionTextSelected: {
    color: '#1976D2',
    fontWeight: '600',
  },
  noCategories: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingVertical: 32,
  },
});
