import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar, StyleSheet, Text, View, LogBox } from 'react-native';
import MainNavigation from './navigation/MainNavigation';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { useColorScheme } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { BottomSheetProvider } from './components/bottomSheet/BottomSheet';
import store from './store/index';
import { Provider } from 'react-redux';
import { ToastProvider } from './components/Toast/ToastContext';
import useSWR, { SWRConfig } from 'swr'



const App = () => {
  LogBox.ignoreAllLogs();
  return (
    <>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <BottomSheetProvider>
          <Provider store={store}>
            <ToastProvider>
              <SWRConfig value={{ provider: () => new Map() }}>
                <MainNavigation />
              </SWRConfig>
            </ToastProvider>
          </Provider>
        </BottomSheetProvider>
      </GestureHandlerRootView>
    </>
  )
}

export default App

const styles = StyleSheet.create({})