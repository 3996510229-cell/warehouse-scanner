import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  DatePickerIOS,
  Platform,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {EmptyState} from '../components/InventoryItem';
import {operationDAO} from '../services/database';
import {InventoryOperation} from '../types';

export const HistoryScreen: React.FC<any> = ({navigation}) => {
  const [operations, setOperations] = useState<InventoryOperation[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const loadData = useCallback(async () => {
    try {
      const data = await operationDAO.getAll(100);
      setOperations(data);
    } catch (error) {
      console.error('Load operations error:', error);
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

  const filteredOperations = selectedDate
    ? operations.filter((op) => {
        const opDate = new Date(op.createdAt).toDateString();
        return opDate === selectedDate.toDateString();
      })
    : operations;

  const clearDateFilter = () => {
    setSelectedDate(null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return '今天 ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else if (date.toDateString() === yesterday.toDateString()) {
      return '昨天 ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    } else {
      return (
        date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
      );
    }
  };

  const getOperationIcon = (type: string) => {
    switch (type) {
      case 'in':
        return '📥';
      case 'out':
        return '📤';
      case 'adjustment':
        return '⚖️';
      default:
        return '📋';
    }
  };

  const getOperationColor = (type: string) => {
    switch (type) {
      case 'in':
        return '#4CAF50';
      case 'out':
        return '#FF9800';
      case 'adjustment':
        return '#2196F3';
      default:
        return '#666';
    }
  };

  const renderOperationItem = ({item}: {item: InventoryOperation}) => (
    <TouchableOpacity
      style={styles.operationItem}
      onPress={() =>
        navigation.navigate('MaterialDetail', {materialId: item.materialId})
      }
    >
      <View style={styles.operationLeft}>
        <Text style={styles.operationIcon}>{getOperationIcon(item.operationType)}</Text>
        <View style={styles.operationInfo}>
          <Text style={styles.operationName}>{item.materialName}</Text>
          <Text style={styles.operationBarcode}>{item.materialBarcode}</Text>
          <Text style={styles.operationReason}>{item.reason || '无原因'}</Text>
        </View>
      </View>

      <View style={styles.operationRight}>
        <View
          style={[
            styles.operationTypeBadge,
            {backgroundColor: getOperationColor(item.operationType) + '20'},
          ]}
        >
          <Text
            style={[styles.operationTypeText, {color: getOperationColor(item.operationType)}]}
          >
            {item.operationType === 'in'
              ? '入库'
              : item.operationType === 'out'
              ? '出库'
              : '调整'}
          </Text>
        </View>
        <Text style={styles.operationQuantity}>
          {item.operationType === 'out' ? '-' : item.operationType === 'adjustment' ? '' : '+'}
          {item.quantity}
        </Text>
        <Text style={styles.operationStock}>
          {item.previousStock} → {item.currentStock}
        </Text>
        <Text style={styles.operationDate}>{formatDate(item.createdAt)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>操作记录</Text>
        <TouchableOpacity
          style={[
            styles.dateFilter,
            selectedDate && styles.dateFilterActive,
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text style={[styles.dateFilterText, selectedDate && styles.dateFilterTextActive]}>
            {selectedDate
              ? selectedDate.toLocaleDateString()
              : '筛选日期'}
          </Text>
        </TouchableOpacity>
      </View>

      {selectedDate && (
        <View style={styles.filterBar}>
          <Text style={styles.filterText}>
            筛选: {selectedDate.toLocaleDateString()}
          </Text>
          <TouchableOpacity onPress={clearDateFilter}>
            <Text style={styles.clearFilter}>清除</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.statsRow}>
        <Text style={styles.statsText}>共 {filteredOperations.length} 条记录</Text>
      </View>

      <FlatList
        data={filteredOperations}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOperationItem}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <EmptyState
            title="暂无记录"
            message="开始扫码操作后将会显示记录"
          />
        }
      />

      {/* 日期选择器弹窗 */}
      {showDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <View style={styles.datePickerHeader}>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerCancel}>取消</Text>
              </TouchableOpacity>
              <Text style={styles.datePickerTitle}>选择日期</Text>
              <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                <Text style={styles.datePickerConfirm}>确定</Text>
              </TouchableOpacity>
            </View>
            {Platform.OS === 'ios' ? (
              <DatePickerIOS
                date={selectedDate || new Date()}
                onDateChange={(date) => setSelectedDate(date)}
                mode="date"
              />
            ) : (
              <Text style={styles.androidHint}>请使用系统日历选择日期</Text>
            )}
          </View>
        </View>
      )}
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
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  dateFilter: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  dateFilterActive: {
    backgroundColor: '#E3F2FD',
  },
  dateFilterText: {
    fontSize: 14,
    color: '#666',
  },
  dateFilterTextActive: {
    color: '#1976D2',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E3F2FD',
  },
  filterText: {
    fontSize: 14,
    color: '#1976D2',
  },
  clearFilter: {
    fontSize: 14,
    color: '#1976D2',
    fontWeight: '600',
  },
  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  statsText: {
    fontSize: 12,
    color: '#666',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  operationItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  operationLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  operationIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  operationInfo: {
    flex: 1,
  },
  operationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  operationBarcode: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  operationReason: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
  operationRight: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  operationTypeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 8,
  },
  operationTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  operationQuantity: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  operationStock: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  operationDate: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  datePickerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  datePickerContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingBottom: 34,
  },
  datePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  datePickerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  datePickerCancel: {
    fontSize: 16,
    color: '#666',
  },
  datePickerConfirm: {
    fontSize: 16,
    color: '#1976D2',
    fontWeight: '600',
  },
  androidHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    padding: 24,
  },
});
