import React, { useState } from 'react';

import { ImageBackground, Platform, StyleSheet, View } from "react-native";
import { VStack, Box, Divider, Text, Center, Heading, Button, Icon, Image } from 'native-base';
import { FontAwesome5 } from "@expo/vector-icons"
import { authStatus, authAtom } from '../../state';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';

export default function NativeBaseExample({ history, onLogin }) {
  return (
    <View style={styles.container}>
      <ImageBackground source={require('../assets/crackbd.jpg')} blurRadius={3} resizeMode="cover" style={styles.image}>
        <Center>
          <RenderCard onLogin={onLogin} />

        </Center>
      </ImageBackground>
    </View>
  );
}

function RenderAntarctica() {
  if (Platform.OS === 'web') {
    return (
      <Center >
        <Image
          source={require('../assets/minified_antarctica.svg')}
          style={{ resizeMode: 'contain' }}
          alt="alt"
          size="2xl"
        />
      </Center>
    )
  }
  else {
    return null;
  }
}


function RenderCard({ onLogin }) {
  const localAuthStatus = useRecoilValue(authStatus);
  const setAuth = useSetRecoilState(authAtom);

  function onLoginClick() {
    setAuth({ status: 'LOADING' })
    onLogin();
  }

  return (
    <Box shadow={9} bg="#0E85A4" p={4} borderRadius={50}>


      <VStack space={4} >
        {RenderAntarctica()}
        <Box px={4} >
          <Text textAlign="center" color="#fff" fontSize={{ base: 40, md: 60, lg: 80, xl: 90 }} style={{ fontFamily: 'Before-Collapse', }}>
            PenQuiz
          </Text>
        </Box>
        <Box px={4}>
          <Text textAlign="center" color="#fff" fontSize={{ base: 18, md: 24, lg: 36, xl: 40 }} style={{ fontFamily: 'Before-Collapse' }}>
            start your{"\n"}
            adventure now
          </Text>

        </Box>
        <Box px={4} pb={4} pt={4}>
          <Button
            isDisabled={localAuthStatus == 'LOADING' ? true : false}
            isLoading={localAuthStatus == 'LOADING' ? true : false}
            bg="#fff"
            size="lg"
            onPress={() => onLoginClick()}
            leftIcon={<Icon as={FontAwesome5} name="google" size="sm" color="green" />}
          >
            Sign in with Google

          </Button>
        </Box>
        <Divider />

        <Button.Group
          mx={{
            base: "auto",
            md: 0,
          }}
          justifyContent="space-around"
        >
          <Button size="lg" bg="#006078">Rules</Button>
          <Button size="lg" bg="#006078">About us</Button>
        </Button.Group>
      </VStack>
    </Box>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: "center"
  },
});