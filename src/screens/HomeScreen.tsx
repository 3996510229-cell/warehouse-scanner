import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {StatsCard} from '../components/InventoryItem';
import {useInventoryStore} from '../store/inventoryStore';
import {operationDAO, materialDAO} from '../services/database';

export const HomeScreen: React.FC<any> = ({navigation}) => {
  const [refreshing, setRefreshing] = useState(false);
  const {
    materials,
    totalMaterials,
    totalStock,
    lowStockCount,
    setMaterials
  } = useInventoryStore();

  const loadData = useCallback(async () => {
    try {
      const materialsList = await materialDAO.getAll();
      const todayCount = await operationDAO.getTodayCount();
      setMaterials(materialsList);
    } catch (error) {
      console.error('Load data error:', error);
    }
  }, [setMaterials]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  // 页面聚焦时刷新数据
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  // 计算统计数据
  const totalValue = materials.reduce((sum, m) => sum + m.currentStock, 0);
  const categories = [...new Set(materials.map(m => m.category).filter(Boolean))].length;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>仓库管理</Text>
        <Text style={styles.headerSubtitle}>欢迎使用仓库扫码系统</Text>
      </View>

      <View style={styles.statsGrid}>
        <StatsCard
          title="物料种类"
          value={totalMaterials}
          subtitle="当前库存物料"
          color="#1976D2"
          onPress={() => navigation.navigate('Inventory')}
        />
        <StatsCard
          title="总库存量"
          value={totalValue}
          subtitle="全部物料总和"
          color="#4CAF50"
        />
        <StatsCard
          title="低库存预警"
          value={lowStockCount}
          subtitle="需要补货"
          color="#FF9800"
          onPress={() => navigation.navigate('LowStock')}
        />
        <StatsCard
          title="分类数量"
          value={categories}
          subtitle="物料分类"
          color="#9C27B0"
        />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>快捷操作</Text>
        </View>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={[styles.quickAction, styles.scanAction]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Text style={styles.quickActionIcon}>📷</Text>
            <Text style={styles.quickActionText}>扫码入库</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('Inventory')}
          >
            <Text style={styles.quickActionIcon}>📦</Text>
            <Text style={styles.quickActionText}>库存列表</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('History')}
          >
            <Text style={styles.quickActionIcon}>📋</Text>
            <Text style={styles.quickActionText}>操作记录</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.quickAction}
            onPress={() => navigation.navigate('AddMaterial')}
          >
            <Text style={styles.quickActionIcon}>➕</Text>
            <Text style={styles.quickActionText}>新建物料</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>最近更新</Text>
          <TouchableOpacity onPress={() => navigation.navigate('History')}>
            <Text style={styles.seeAll}>查看全部</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.recentList}>
          {materials.length > 0 ? (
            materials
              .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
              .slice(0, 5)
              .map((material) => (
                <TouchableOpacity
                  key={material.id}
                  style={styles.recentItem}
                  onPress={() => navigation.navigate('MaterialDetail', {materialId: material.id})}
                >
                  <View style={styles.recentInfo}>
                    <Text style={styles.recentName}>{material.name}</Text>
                    <Text style={styles.recentBarcode}>{material.barcode}</Text>
                  </View>
                  <View style={styles.recentStock}>
                    <Text style={styles.recentStockLabel}>库存</Text>
                    <Text style={styles.recentStockValue}>{material.currentStock}</Text>
                  </View>
                </TouchableOpacity>
              ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>暂无物料数据</Text>
              <TouchableOpacity 
                style={styles.addButton}
                onPress={() => navigation.navigate('AddMaterial')}
              >
                <Text style={styles.addButtonText}>添加第一个物料</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 12,
    gap: 12,
  },
  section: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#1976D2',
  },
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickAction: {
    width: '22%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scanAction: {
    backgroundColor: '#E3F2FD',
  },
  quickActionIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  recentList: {
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  recentInfo: {
    flex: 1,
  },
  recentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recentBarcode: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  recentStock: {
    alignItems: 'flex-end',
  },
  recentStockLabel: {
    fontSize: 12,
    color: '#999',
  },
  recentStockValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
