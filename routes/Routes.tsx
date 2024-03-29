import React, { useEffect, useRef, useState } from 'react'
import { Platform, Text, StyleSheet, View, ActivityIndicator, Button, Image, ImageBackground } from 'react-native'
import { useRecoilValue, useSetRecoilState } from 'recoil'
import { useAuthActions } from '../hooks'
import LoginComponent from '../components/LoginComponent'
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '../helpers'
import TestingSvg from '../components/TestingLegacy/TestingSvg'
import * as Linking from 'expo-linking'
import { authAtom, authStatus, gameInstanceAtom } from '../state'
import { HomeDrawer } from './HomeDrawer'
import { LoadingComponent } from './LoadingComponent'
import GameLobby from '../components/GameLobbyComponents/GameLobby'
import GameMap from '../components/GameMapComponents/GameMap'
import { authStatusType } from '../types/authTypes'
import { GameState } from '../types/gameInstanceTypes'
import Svg, { G, Path } from 'react-native-svg'
import MockMultipleChoiceScreen from '../components/TestingComponents/MockMultipleChoiceScreen'
import MockGameMap from '../components/TestingComponents/MockGameMap'
import MockNumberChoiceScreen from '../components/TestingComponents/MockNumberChoiceScreen'
import GameLobbyCharacters from '../components/GameLobbyComponents/GameLobbyCharacters'

export * from './LoadingComponent'


const Stack = createStackNavigator()
const prefix = Linking.createURL('http://localhost:19006')
export const isDebugRunning = false

export function Routes() {
  const localAuthStatus = useRecoilValue(authStatus)
  const game = useRecoilValue(gameInstanceAtom)

  const setUser = useSetRecoilState(authAtom)

  const useuseAuthActions = useAuthActions()

  useEffect(() => {
    // Call refresh token. If auth is successful you will navigate to main component
    // If not to login / register component
    !isDebugRunning && useuseAuthActions.refreshToken()

    isDebugRunning && setUser({
      id: 1,
      status: authStatusType.LOADING
    })
  }, [])

  const linking = {
    prefixes: [prefix],
    config: {
      screens: {
        Home: 'home',
        Game: 'game'
      }
    }
  }


  useEffect(() => {
    if (Platform.OS == 'web') {
      if (__DEV__) return

      function unloadEventHandler(e: BeforeUnloadEvent) {
        // Cancel the event
        e.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
        // Chrome requires returnValue to be set
        e.returnValue = '';
      }

      if (game?.gameState == GameState.IN_PROGRESS) {
        window.addEventListener('beforeunload', unloadEventHandler);
      }
      else {
        window.removeEventListener('beforeunload', unloadEventHandler)
      }

      return () => window.removeEventListener('beforeunload', unloadEventHandler)
    }
  }, [game?.gameState])

  function ColorCheckerSvg() {
    return (
      <>
        <ImageBackground source={Platform.OS === 'web' ? require('../assets/gameBackground.svg') : require('../assets/gameBackground.png')} resizeMode="cover" style={{
          flex: 1,
          backgroundColor: "#032157",
        }}>
          <Svg
            viewBox="0 0 694.3 587.02"
          >
            <G data-name="Layer 2">
              <G data-name="Layer 1">
                <Path
                  d={"M283.54 264.44h.26a31.82 31.82 0 00-3.26-8c-5.71-8.57-16.86-7.17-24.82-10.47a1.28 1.28 0 01-.49.59c.56 1.27-.29.41-1.2.31.73 1.56-1-.27-1 1-.45-1.34-3.16-4.12-4.83-4.32-1.52 0 .71.89 1 1.84-2.28-.12-4.63-1.32-6.81-1.51-2.81-.8-.65-5.61-3.51-6.69-.64 2 .08 3.87-1 5.09.57 1.17-.41 1.82.38 3.27-.52.25-1 .28-.94 1.35-1.54-.74-1.53-.5-1.57.67a4 4 0 01-2.77-1c-.7-2.62-3.4 1.14-2.84-1.77.89-.59 2.9-4.05.76-4.77-1.89.79-.2 3-1.94 3.77-2.55.73 0-1.76-1.36-2.49 1.19.09 1.28 0 .74-1.59.17.2 1.34 1.21.71-.82.6 1.25 2.81-1.41 1.51-2.19-2.78-2.1-2.38 3.59-4.9 4-.84 2.74-5.13 2.35-7.2 4.27-1.59 2.37-1.81-1.37-3.81.42 1.75 2.33-1.68 3-2.36 3.46-.46.15-3.74-2.25-4.24.27a6.19 6.19 0 011.08 2.48c-.17 1.58-.63 1.89 1.26 2.39 2.23.33.34 1.73-.8 2.22-3.15.62 1.08 2.59-.62 3.5.11 2.32-2.17.75-1.49-.44-.73-.21-1.38 1.33-2.89.87-1.58-2.69-4.2-.13-6.29-.18-3.26-1.7-.09 2.83-1.44 3.57.25 1.65-1.2 2.54-2.3 3.91-2.51 1.17-.32-1.74.11-2.74 1.06-1.64.42-5.36-1.93-6.09-2.34-2.11-5.82-2.64-8.22-.28-.75 2.19-1.69 4.47-1.73 6.34-1.67 1.94 0 5.23 2.89 3.88 2.6-.2.82 1.71-.55 1.7-1.64 1.08-3.24-.56-4.39.4-3.17 1.18-4.31 3.4-7.28 4.56-2.54.77-4.24 1.7-6.18.44 1-.78 1.1-1.64 2.55-1.39 1-.91-2.92-.35-3.61.53s-5.53.82-3.38 0c3.17-1.29 6.1-2.19 9-4 2.32-1.65 5.08-3.48 5-6.42.87-2-.37-5.94-2.61-7-3.47-1.56-5.57 2.4-7.45 4.63s-3.49 5.33-6 6.15c.8-1.17-.24-4-1.7-3-.32-.1 2.77-2.24 3.1-3.51 0-1.66 1.95-3.09 2.5-5.12-.33-1.76 2.13-4.88 3.73-6.31.33-.83 3.31-.9 1.25-1.5a4.45 4.45 0 00-.94-4.77c-1.46-.66-3.23-4-5.5-4.3-1 2.53-4.64 4.31-4 7.53 2.81 1.12-.67 1.06-1.61 1.64-2 1.19-4.35.82-6.21 2.43.68-1.53-1.81 0-3.1-.25-1.42 1.83-2.85-.24-4.23.87-1.64-.25-.17-.46.67-.54-3.47-.33 4.3-2.58.34-2.72-1.37-1.38 1.19-.8.26-2.1.6-.59 3.39-1.29 1-1.58a2.57 2.57 0 01.15-1.29 2.65 2.65 0 01.74-1.07c.86-.46 3.49-3.74 1.85-3.13.38-1.8 1.74-2.49 1.47-4.2 1.25-1.4 3.09-4.25 3-6.66-.83.35.73-2.66-.47-1.82-.24-2.14-.79.88-1.84-1 .82-1.87-.53 1-.53-.41.49-2.1-1 1.58-1 0-.88-2 .05-4.14 0-6.35.74-2.12-1.89-.79-1.27-2.58 1.54-1.87-.28-3.65.78-5.63-.05-1.76-1.58-4-1.08-6-.48-2.77-.58-5-1.72-7.49-.46-3.36-2.78-.41-2.79 1.4-.54 2.05-2.16.67-2-1.3 1.34-.39-.58-2 .72-2 1.74-2.22-3.45-2.12-2.57.34-.93 1.79-1.31.27-1.14-1-2.1-1.31 1.68-1.12.37-2.75-1.55.33-4.8-.79-1.81-1.74-1.22-1.38 2.2 0 2.64.21 3.44 2.1 1.28-4.57-1-3.9.24.23-2.31-.24-3.13.18-2.84-.14.12-.87 1-2.07 2.51-1.89.29-2.55-.18-4.66-3-3.07-.12 2.83-2.65 2.91.2 1.65-1.47 1.37-.89 0-2-1.92 2 .48.42-2.22-.7-2.18-1.9-.7-2.52 0-1.27 2.11-.25.69-1.32-.29-1.63 1.91-1.48-2-.15-1.09 3-.1-.56-3.58-1.61-3.68.88 2.41-1.07 1-1.4-.72-1-.14-3.67 1.44-2.53 2.71-.5-.57-3.46.82-2.44-.7 2.66-2.35-3.32 1.06-1.71-.81 2-.32-.13-1.36-.6.31-3 .11-.69-1.39.63-2-1 .37 1.33-1.56 2 0 2.28-.37-1.37-2.46 1-1.45 3.65.75-3.09-2-.72-2.09 2.42 2 2.78-2.67.08-2.18-.48-1.74-4.75-3.21-2.61-.75 2 1.25-.33 1.39-.3 1.69 1.4 1.75-.44 1-.94-.2-.61-1.88-5.2-3.61-3.78-.06 1.68 1.49-.68.43-1.51.87.71-.74-.56-.85-1.3-1.24-.76 1.71-.84-.68-2.22-.08.88-1 2-.79 2.19-2.24.68-2.61-1.35.09-2.16-.63 2.2-1.36-2.07-2.63-1.84-.19-.65-1.18-.1-2.88-1.85-3.42.57 1.46-1.18 2.87 1 3.32-1.79.09-3 1.9-2.62 4-.65 2.39-1-2.12-1.8-.63-3 1.27.49-2.25-.62-3.65.85-.22 2-2.7 1-2.19-2-.23-1.14-.83-.08-1.41-.86-1.58-2.39-.12-3.54-.8-.46 1.19 1.58 3.15-.09 4.41-2.2 2.25 0-.88-1.12-1.57-.14-.25-1-1.41-.79-2.12 1.57-2.26-2.68-.16-1.32-1.49 3-2.31-2.15-.28-1-1.34 1-2-2.34-.22-3.2-.63-1-1.59-2.66-1.67-3.35.16 2.06 1.07-.08 2.88-1.41 1.47-1.48.76-.56-1.19-.33-1.62.3-1.56-1.47-.9-.81-2.07-.6-3-2.77.6-2.36 2.29-.91-1.86-3 1.44-3.83-.48-2-.63.37-2.11.65-1.67-.26-2.85-3.64-.87-5.16-1.46-2.51 1.6-3.62-1.91-6-2.57-.93 1.48-1.39.25-3 .72.16 3.07-3.56-.76-3.94 2-1.16-2-1.78-.29-3.15 1-2.42.85 1.26-2.5-.82-3.07-1.38.82-1.2-.64.13-.65-1.22-1.9-3.21 3.57-5.1.62.85-1.61-1.48-4.06 1.11-4.76-1.37-2.51-3 2.91-2.41 3.83-.52 1.32-.22 3.67 1.24 3.18-1.25 1.83 2.83-1.33 1.56.73 1.78-.32.93.67-.23.94-.32-.28-.39 1.87-1.85 1-.5.8-1.7 3.26-3.59 2.94-.25-.12-.79-4.38-2-2.26.1 3.4-2.33.63-1.87-.77 1.36-.86-1.1-4.33-1.1-1.86-2.31-1.31 1.16 1.63-.5 2.14 0 2.13-1.88 3-2 .86 1.1-1.6-.76-2.25-2.14-.61-.18-.72-1.85-1.71-2-1.88.53-2.05-1.07-.38-1.21-1.5-.32 1.43-1.75.65-1.79.85-.39-1.65-2-.66-2.87-1.68 2.43-.32-1.25-.62.27-1.06 2.3 1.49 1.1-1.23 1.46-2.14 1.32-2.28-1-.57-1.72-.12.82-1.58-.3-.79.15-1.76-1.16-1.26-.81.33-2.28.13-.05-1.19-3-.9-1-1.24 2.7-.17-.64-1-1-1.46-1.68-1.3.15-1.54.74-.65 2.44.46.4-1.26.78-1.82 3 .78 2.31-4.49-.77-2.86-.24.83-2.41 1.63-1.62.73-1.23-.85-.69-.56.14-1.43-.46-1.45-3.05.21-2.06-1.62-.94 1.15-1.29 0-.37-1.06-.29-1.23-1.56 0-2 .64.61-1.55-1.51-.8-.63-1.39.18-.68 1.35-1.54 2-2.51 2.19.76 4.89-.77 7.29.44 2-2-.59-2-1.83-1.16a1.61 1.61 0 00-.21-1 1.59 1.59 0 00-.78-.69 1.67 1.67 0 00-1.93.48c-2.54-1.33-.78-4 .48-5.52.53 1.78 2.6 0 3.49 1.41 2.39-1.75-3.31-1.47-2.66-2.41.3-1.17 1.65-1.23-.47-1.81.5-.19 1.2-2 2.7-.91 2.31 1.08.81-1.76-.28-2.18-1.48 1.47-2.16-.6-1.16-1.08 2.65.27-1.15-.56.46-1.25-.84-1-1.51-1.52-2.31-.12-2.46 1 2.7 2.72-.75 2.35-3.45.42 2.75 1.48.54 2.2-3.35.77 2.45 2-.06 2 .27.7-1.69 3-3.5 2.12-1.94.46-3.09-1.06-3-3.11-3.06.58 0-2.67-1.31-3-.43 1.19-.07 1.08-1.36 1.16-1.41 1.44-1.28-2.31-2.6.11-.32-1.45-1-1.13-1.08-2.43 1.41-.41 2.43-2.31 0-2.52-1.9 2.09-2.89-2.22-.73-1.69.64-.19 1.54-2.64.35-3.25.59-.23-1.16-1-.73-2.07-1.84-.63-.83-2-1.55-2.88 1.54-1.63-1.63-.41-.94-1.33 2.13-.79-1-.49.49-2-1.53-1.19-.68-3 1.27-2.14-.44.59.53.63 1.5.4.38-1.88-2.13-.12-2.72-1.83-1.86-2.89 1.85-.1 2.43-2.14-.59-2.16 2.45.66 2.26-1.55-1.36-1.72-1.93.49-2.8-.91 1.18-3.1-2.66 2.4-2.38-.13 2.47-1.89-2.55-3.06-1.66-5-.43-1.53-2.15-3.47-1.29-5.12 1.24 1 0-1.69.81-1.3-.56-.7.44-.87 0-1.3 0 .41-2.26 1-.58-.62 1.51-1.77 0-.87-1-1.53.39-.71 2.39-2.87 3-.47 2.09 0 .16-1.49 1.87-1.83-.43-1.91-2-.45-2.83-.22-.2-1.64-1.15.46-1.46-1-3.33-2-3.23 3.1-3.67 4.59 1.57 1.24-.89 2.76.45 2.68.07 1-1.25 2.43-1 3.54-1.12 1.59-.09 2.35.86 3.1 1 1.56-.69 1.29-.78 2-.39 1.42 1.09.46.89 1.45 2.45.58.51 2.2-.51 2.64-.94-1-1.24.67-.43.23 0 .68.69 1 .75 1.26 1.07.5-1.53 1.5-1.11 3.15-.46 1.68 1.36 2.82-.75 4.14a2.59 2.59 0 001.87-.23c-.84 1.32.68.43.45 1.44 1.69-.46.59.65.87 1.49 1.62.37.71 1.36.25 2.41-.42-1.4-1.41.51.09.09-1.11 1.8.51.3 1.19.82-.83 2 1.23.15 1.53 1.4 0 1.36-1.73.41-2.6.39.32 1 1.49.63.38 1.44 2 .48.8 2.47 1.72 2.41-1.89.48 1.21.27 0 .52-.81 1.7-1.72-.83-2.08.42-1.92-1-1 1.49.67 1-.29 1.91.26 1.24 2 .78.33.56 0 1.84-1.58 1.3-.36 1.33 1.54.35 1 2.22-1.67 1.56.64 2.45 1.18.77 0 .32 2.55.92.9 1.91-1.73-.57-.25 1.12-1.6 1.35-.67.9-2.28 1.28-1.07 3a3.39 3.39 0 001.28 1.35 3.34 3.34 0 001.8.44c1 1.87 1.92-.82 3.19-.89-1.24.88 1.35.88.33 1.79-1.73-.53-2.28 2.2-.68 1.06 2.57.7.66 1-.22 2.3.74.16 3.56 0 1.73 1.68-1.82-.2.09 1.28.61.93 1-.56 3.46-.05 2.38 1.56-2.49-1.42-3.49 4.31-.91 3.22 3-1.23 1 1.63-.46 2.16.1 1.23 1.35.22 1.69 1.72.58 2.32.61-.1 1.71 0 1.57-1 .1 1.6 1 .35.45 1.6 2.27 1.67 3 2 1.32 0-.35 1.84-2 1.66-1.4 1.65-.24 3.5 1.49 3.83 1.58-.85 1.8.29 2.52 1.28.64 1.51 1.84-1.11 1.94.29.6.36 1.66-.24 2.37.81 2.91.82-1.78.35-1.72.87 2.75.63.59 3.09-1 .85-1.32-.11-3.06-2-3.52-.21 2.49-.06.12.66.8 1.07 2.46.08-.54 1.8.68 1.77.32 1.84 1.73.49 2.23 1.75 1.75-.91 1.57 2.1 3.15 1.07 1.09.91 1.08-.2 1.11-1.36-1.55-2.21 2.31-2.41 1.54-4.12 2.42.33 0 1.34.59 2.37.66 2.38 2-1.18 1.8 1-.87 2.42.65-1.7 1 .18 3-.44-.55 4.54 2.29 2.65.52 1.14 1.5.32 2.92.09-.25-2.8 3.24-.22.72.59-.58 1.86 1.14.93 1.36.24 2.23 0-.33.43 1.55.94-1.1.84.13 1.69 1.2 1.34 1.44-.87 3.84.75 2.38 2.44.25 2.5 3.08-.18 3.52-1.37 1 .65.41 1.06 1.23 0-.38 2.38 2.27 0 2.27 2.18-.88 1.47.39 2.29 1.4 2.62 3.48 1.19-2 1.16-1.58 2.89-1.54.52-2.79 1.6-.43 1.91-1.08.37-1.5 3.92.57 2.44 1.6.31 3-1.56 4 .18 1.63-.32 2.24 1.29 3.81 1.89 1-.49 3.09 0 4.53-1 1.85.42 4.14.05 6 .74 1.85 1.51 4.9-.5 6.11 1.75 1.79-.46 1.61 1 3.61 1.9 2.33 1.55 4.7-.85 7.06.42a5.11 5.11 0 016.24 1.46c2.53 2.13 4.65 4.46 7.21 6.34-.43 2.22 1.45 4.69 1.45 6.75.52 2.06-.26 3.34-.06 5.41 1.37 2.16-2.57 3.62-.61 5.57.93 1.81-1.31 4.65.57 5.27-.52 1.41-2.19 3.19.38 3.87-1.13.6 1 1.77-.27 1.81.59.37 1 1.4 1.68 2-2.74.57.73 3.08-1.6 2.87-2.45 1.9.16 3.9-.27 5.91 1.66 1.39-1.71 2.94.74 4 .11 2-2.45.09-3-1-.56-2.46-4.52-.44-2.24.53-1.41 1-.55 2.06-.89 3.19.19 1 1.37 4.82-.1 4.09-2.7-2-4.55.29-7.13 1.47-1.43.73-4.45 3.95-1.8 4.92.87.11 3.71-.92 5.35-1 1.72.23-2.2 1.91-2.62 2.71-1.18 2.5 1.79 1.61 3.09 2.13 2.4-1.44 4.39.44 5.14 2.57-.81 1.18-.18.16.57 1.55-2.11 1.64-4.39 4-3 6.66-.22.12-1.34.78-2-.23-2 .63-.11 4-2.06 5.29-1.64 1.3-2.32 2.82-4.57 2.23-2.2.61 1.43 1.83.58 3.59 3.07.51.49 5.15-1.5 3.83.65 1.29-.41 1.67 1 2.66-1.9.81 1.18 2.62-.74 2.54-1.45 1.8-2.85-1.12-4.27-.57.27-.11-2.19-2.24-3.17-1-.44 2.4-2 3.71-1 5.63.62-2.1 4.08-1.89 5.66-.63 1.57-.09.87.51 1.5 1.87-1.12 2.12 1.86 2.77 2 3.9 2.13 1.73-.71 3.12-.16 5.28-1.67 1.51-1.5 3.67-.61 5.48-.4 1.13-.16 2.65.28 2.83 2 1 2.32 2.83.85 4.31-.18 1.66-.4 5.16 2 5-1.22 1.74 0 3.72-1.44 4.94-.06.64-1.89 2.81-.32 3.38 2 1.62-1 .77-1.93.29a51.58 51.58 0 01.14 5.45c1.54 2.27.1 4.29 2.06 6-1.27 1.9-.72 3.57.53 5.38 2.13 1.69-1 2.1.2 3.94 1.66 2.38-.76-.84-1.84-.68-1.36-.43-2.65-.05-1.6 2.29-.77 1.89.77 3 2.52 3.27 1.15-1.8 3.54-1.14 4.6-2.15 2-1.69 1.84-4 .55-6.14.1-3-1.59-5.63-.77-8.56-1.29-1.41 2.22-.5 1-2 2 .47 1.34-1.8 1.59-3 1-1.1 1.23 2.37 1.09 2.79 2.68-.7 1 2.89 2.59 3.75 2 2.36-1.31 3-.23 5.07-1 1.83-.25 2.83-.3 5 1.19 1.88 1.7-2 3.55-.35 1.94-.19 1-2.07 1.45-3.11-1-2 1.51-5.07 4-4.39-1.09-1.22 1.35 0 2-.5 1 .72 1.64-1.63 1.24-2.72a2.55 2.55 0 01-1-.68 2.59 2.59 0 01-.56-1.06 2.52 2.52 0 010-1.19 2.65 2.65 0 01.54-1.07c1.27 1.37 1.57.18 2.93 1 .51-1.63 2.64-.72 2.36 1 1.88-1.09 0-3.18.48-4.82 1.79.7 4-1.47 2.74-2.94-2.22-2.55 1.75 1.53.86-1a1.89 1.89 0 011.11.5 15.16 15.16 0 0113.29-8.3c21.77-2.13 43.53-1.43 65-2.56 19-1 37.71-3.41 56-10.44 16.59-7 30.89-23.88 26.26-42z"}
                  fill={"#292F89"}
                  stroke="#000"
                  strokeMiterlimit={10}
                  fillRule="evenodd"
                />
              </G>
            </G>
          </Svg>
        </ImageBackground>
      </>
    )
  }


  function SwitchAuthState() {

    if (isDebugRunning)
      return (
        <Stack.Screen name="Loading" options={{ headerShown: false }} >
          {() => <MockNumberChoiceScreen />}
        </Stack.Screen>
      )


    if (localAuthStatus == authStatusType.LOADING) {
      return (
        <Stack.Screen name="Loading" options={{ headerShown: false }} >
          {() => <LoadingComponent message="Authenticating user..." />}
        </Stack.Screen>
      )
    }

    if (localAuthStatus == authStatusType.LOGGED) {
      return (
        <>
          <Stack.Screen
            name="Home"
            options={{ headerShown: false }}
            component={HomeDrawer}
          />
          <Stack.Screen name="GameMap" options={{ headerShown: false }} component={GameMap} />
          <Stack.Screen name="Game" options={{ headerShown: false }} component={TestingSvg} />
          <Stack.Screen name="GameLobby" options={{ headerShown: false }} component={GameLobby} />
        </>
      )
    }



    return (
      <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginComponent} />
    )
  }

  return (
    <NavigationContainer linking={linking} ref={navigationRef}>
      <Stack.Navigator >
        {SwitchAuthState()}
      </Stack.Navigator>
    </NavigationContainer>
  )
}