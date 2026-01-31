import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {Material} from '../types';
import {useNavigation} from '@react-navigation/native';

interface InventoryItemProps {
  material: Material;
  onPress?: () => void;
}

export const InventoryItem: React.FC<InventoryItemProps> = ({material, onPress}) => {
  const navigation = useNavigation<any>();
  const isLowStock = material.currentStock <= material.minStock;

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      navigation.navigate('MaterialDetail', {materialId: material.id});
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.header}>
        <Text style={styles.name} numberOfLines={1}>{material.name}</Text>
        {isLowStock && <View style={styles.warningBadge}><Text style={styles.warningText}>低库存</Text></View>}
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>条码</Text>
          <Text style={styles.value}>{material.barcode}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>规格</Text>
          <Text style={styles.value}>{material.specification || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Text style={styles.label}>位置</Text>
          <Text style={styles.value}>{material.location || '-'}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={styles.label}>分类</Text>
          <Text style={styles.value}>{material.category || '-'}</Text>
        </View>
      </View>
      
      <View style={styles.stockContainer}>
        <View style={styles.stockItem}>
          <Text style={styles.stockLabel}>当前库存</Text>
          <Text style={[styles.stockValue, isLowStock && styles.lowStockText]}>
            {material.currentStock}
          </Text>
          <Text style={styles.unit}>{material.unit}</Text>
        </View>
        <View style={styles.stockItem}>
          <Text style={styles.stockLabel}>预警</Text>
          <Text style={styles.minStock}>{material.minStock}</Text>
          <Text style={styles.unit}>{material.unit}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: string;
  onPress?: () => void;
}

export const StatsCard: React.FC<StatsCardProps> = ({title, value, subtitle, color = '#1976D2', onPress}) => {
  return (
    <TouchableOpacity 
      style={[styles.statsCard, {borderLeftColor: color}]} 
      onPress={onPress}
      disabled={!onPress}
    >
      <Text style={styles.statsTitle}>{title}</Text>
      <Text style={[styles.statsValue, {color}]}>{value}</Text>
      {subtitle && <Text style={styles.statsSubtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  );
};

interface EmptyStateProps {
  title: string;
  message: string;
  actionTitle?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({title, message, actionTitle, onAction}) => {
  return (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      {actionTitle && onAction && (
        <TouchableOpacity style={styles.emptyAction} onPress={onAction}>
          <Text style={styles.emptyActionText}>{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

interface SearchBarProps {
  value: string;
  onChange: (text: string) => void;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({value, onChange, placeholder = '搜索物料'}) => {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.searchIcon}>🔍</Text>
      <TextInput
        style={styles.searchInput}
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor="#999"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={() => onChange('')}>
          <Text style={styles.clearIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  warningBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginLeft: 8,
  },
  warningText: {
    color: '#FF9800',
    fontSize: 12,
    fontWeight: '600',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#999',
    width: 40,
  },
  value: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  stockContainer: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  stockItem: {
    flex: 1,
    alignItems: 'center',
  },
  stockLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  stockValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  unit: {
    fontSize: 12,
    color: '#999',
    marginLeft: 2,
  },
  lowStockText: {
    color: '#FF5722',
  },
  minStock: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  statsCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 12,
    color: '#999',
    marginBottom: 8,
  },
  statsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  statsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAction: {
    backgroundColor: '#1976D2',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyActionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  clearIcon: {
    fontSize: 16,
    color: '#999',
    padding: 4,
  },
});
