/**
 * @format
 */
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, Linking } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import "./firebase-message"








AppRegistry.registerComponent(appName, () => App);
