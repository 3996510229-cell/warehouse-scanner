import React, {useEffect} from 'react';
import {StatusBar} from 'react-native';
import {AppNavigator} from './navigation/AppNavigator';
import {openDatabase} from './services/database';
import {SafeAreaProvider} from 'react-native-safe-area-context';

export default function App() {
  // 初始化数据库
  useEffect(() => {
    const initDatabase = async () => {
      try {
        await openDatabase();
        console.log('Database initialized successfully');
      } catch (error) {
        console.error('Failed to initialize database:', error);
      }
    };

    initDatabase();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#1976D2" />
      <AppNavigator />
    </SafeAreaProvider>
  );
}
