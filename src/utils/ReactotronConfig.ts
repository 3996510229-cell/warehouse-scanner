/**
 * Reactotron Configuration
 * Debugging tool for React Native
 */
import Reactotron from 'reactotron-react-native';

Reactotron.configure({
  name: 'Warehouse Scanner',
  host: 'localhost',
})
  .useReactNative({
    networking: {
      ignoreUrls: /symbolicate/,
    },
    editor: false,
    errors: {veto: (stackFrame) => false},
    overlay: false,
  })
  .connect();

console.log('Reactotron Configured');
