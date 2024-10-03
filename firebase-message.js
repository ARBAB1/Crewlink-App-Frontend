import messaging from '@react-native-firebase/messaging';
// import notifee, { EventType } from '@notifee/react-native';
import { useColorScheme,Linking,AppState } from 'react-native';




messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background:', remoteMessage);
  });




