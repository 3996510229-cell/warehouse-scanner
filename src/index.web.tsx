/**
 * Web 入口文件
 * 用于 Web 平台渲染
 */
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.runApplication(appName, {
  rootTag: document.getElementById('root'),
});
