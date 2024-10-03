import 'react-native-gesture-handler';
import React, {useState, useEffect} from 'react';
import {StatusBar, StyleSheet, Text, View, LogBox, Linking} from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import {DefaultTheme, DarkTheme} from '@react-navigation/native';
import {useColorScheme} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {BottomSheetProvider} from './components/bottomSheet/BottomSheet';
import store from './store/index';
import {Provider} from 'react-redux';
import {ToastProvider} from './components/Toast/ToastContext';
import useSWR, {SWRConfig} from 'swr';
import {baseUrl} from './store/config.json';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';

const App = () => {
  // useEffect(() => {
  //   const handleDeepLink = (event) => {
  //     let url = event.url;
  //     // Handle the deep link here
  //     console.log('Deep link URL:', url);
  //   };

  //   // Listen for deep links
  //   Linking.addEventListener('url', handleDeepLink);

  //   // Remove event listener on cleanup
  //   return () => {
  //     Linking.removeEventListener('url', handleDeepLink);
  //   };
  // }, []);

  useEffect(() => {
    // Request notification permissions for iOS
    messaging().requestPermission();

    // Handle foreground messages (when the app is open)
    const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
      console.log('Foreground message received:', remoteMessage);

      // Display notification with Notifee
      await notifee.displayNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        android: {
          channelId: 'default',
          pressAction: {
            id: 'default',
          },
        },
        apn: {
          headers: {
            'apns-priority': '10',
          },
        },
        data: remoteMessage.data, // Pass data for deep linking
      });
    });

    // Handle foreground notification click event
    const unsubscribeNotifeeForeground = notifee.onForegroundEvent(
      ({type, detail}) => {
        const {notification, pressAction} = detail;

        if (type === EventType.ACTION_PRESS) {
          // if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
          const deepLinkUrl = notification.data.deepLinkUrl;
          if (deepLinkUrl) {
            console.log('Opening deep link from foreground:', deepLinkUrl);
            Linking.openURL(deepLinkUrl).catch(err =>
              console.error('Failed to open URL:', err),
            );
          }
        }
      },
    );

    // Handle background notification click event
    notifee.onBackgroundEvent(async ({type, detail}) => {
      const {notification, pressAction} = detail;

      if (type === EventType.ACTION_PRESS) {
        // if (type === EventType.ACTION_PRESS && pressAction.id === 'default') {
        const deepLinkUrl = notification.data.deepLinkUrl;
        if (deepLinkUrl) {
          console.log('Opening deep link from background:', deepLinkUrl);
          Linking.openURL(deepLinkUrl).catch(err =>
            console.error('Failed to open URL:', err),
          );
        }
      }
    });

    // Handle app opened by a notification (background/terminated)
    messaging().onNotificationOpenedApp(remoteMessage => {
      const deepLinkUrl = remoteMessage.data.deepLinkUrl;
      if (deepLinkUrl) {
        console.log('App opened by notification (background):', deepLinkUrl);
        Linking.openURL(deepLinkUrl).catch(err =>
          console.error('Failed to open URL:', err),
        );
      }
    });

    // Handle when the app is opened from a quit state by a notification
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const deepLinkUrl = remoteMessage.data.deepLinkUrl;
          console.log('App opened by notification (terminated):', deepLinkUrl);
          Linking.canOpenURL(deepLinkUrl)
            .then(supported => {
              if (!supported) {
                console.log('URL scheme not supported');
              } else {
                console.log('URL scheme supported');
              }
            })
            .catch(err => console.error('Error checking URL:', err));
          Linking.openURL(deepLinkUrl).catch(err =>
            console.error('Failed to open URL:', err),
          );
        }
      });

    return () => {
      unsubscribeForeground(); // Unsubscribe the foreground message handler
      unsubscribeNotifeeForeground(); // Unsubscribe the Notifee event listener
    };
  }, []);

  return (
    <>
      <GestureHandlerRootView style={{flex: 1}}>
        <BottomSheetProvider>
          <Provider store={store}>
            <ToastProvider>
              <SWRConfig value={{provider: () => new Map()}}>
                <MainNavigation />
              </SWRConfig>
            </ToastProvider>
          </Provider>
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </>
  );
};

export default App;

const styles = StyleSheet.create({});
