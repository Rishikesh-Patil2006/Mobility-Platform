import { AppRegistry } from 'react-native';
import App from './App';
import appName from './app.json';

AppRegistry.registerComponent(appName.expo.name, () => App);

if (window.document) {
  const rootTag = document.getElementById('root') || document.getElementById('main');
  AppRegistry.runApplication(appName.expo.name, { rootTag });
}
