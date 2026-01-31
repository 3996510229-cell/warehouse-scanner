import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {HomeScreen} from '../screens/HomeScreen';
import {InventoryScreen} from '../screens/InventoryScreen';
import {ScannerScreen} from '../screens/ScannerScreen';
import {MaterialDetailScreen} from '../screens/MaterialDetailScreen';
import {HistoryScreen} from '../screens/HistoryScreen';
import {AddMaterialScreen} from '../screens/AddMaterialScreen';
import {EditMaterialScreen} from '../screens/EditMaterialScreen';
import {LowStockScreen} from '../screens/LowStockScreen';
import {PaperProvider} from 'react-native-paper';
import {theme} from '../theme';

const Stack = createNativeStackNavigator();

export const AppNavigator: React.FC = () => {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#1976D2',
            },
            headerTintColor: '#fff',
            headerTitleStyle: {
              fontWeight: '600',
            },
            headerBackTitleVisible: false,
          }}>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: '仓库管理',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Inventory"
            component={InventoryScreen}
            options={{
              title: '库存列表',
            }}
          />
          <Stack.Screen
            name="Scanner"
            component={ScannerScreen}
            options={{
              title: '扫码操作',
              headerShown: false,
              presentation: 'fullScreenModal',
            }}
          />
          <Stack.Screen
            name="MaterialDetail"
            component={MaterialDetailScreen}
            options={{
              title: '物料详情',
            }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{
              title: '操作记录',
            }}
          />
          <Stack.Screen
            name="AddMaterial"
            component={AddMaterialScreen}
            options={{
              title: '新建物料',
            }}
          />
          <Stack.Screen
            name="EditMaterial"
            component={EditMaterialScreen}
            options={{
              title: '编辑物料',
            }}
          />
          <Stack.Screen
            name="LowStock"
            component={LowStockScreen}
            options={{
              title: '低库存预警',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};
