import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {InventoryItem, EmptyState} from '../components/InventoryItem';
import {materialDAO} from '../services/database';
import {useInventoryStore} from '../store/inventoryStore';
import {Material} from '../types';

export const LowStockScreen: React.FC<any> = ({navigation}) => {
  const [lowStockMaterials, setLowStockMaterials] = useState<Material[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const {materials} = useInventoryStore();

  const loadData = useCallback(async () => {
    try {
      const data = await materialDAO.getLowStock();
      setLowStockMaterials(data);
    } catch (error) {
      console.error('Load low stock error:', error);
    }
  }, []);

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

  const handleMaterialPress = (material: Material) => {
    navigation.navigate('MaterialDetail', {materialId: material.id});
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>低库存预警</Text>
        <View style={styles.warningBadge}>
          <Text style={styles.warningBadgeText}>{lowStockMaterials.length} 项</Text>
        </View>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoText}>
          以下物料库存低于或等于最低预警库存，请及时补货以避免缺货。
        </Text>
      </View>

      <FlatList
        data={lowStockMaterials}
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
            title="暂无低库存物料"
            message="所有物料库存都在正常水平"
          />
        }
      />
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
  warningBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  warningBadgeText: {
    color: '#FF9800',
    fontSize: 14,
    fontWeight: '600',
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
