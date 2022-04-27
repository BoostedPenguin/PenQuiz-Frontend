import { Box, Center, Container, HStack, Text, VStack, Image, Divider, Pressable, Input, Button, IconButton } from 'native-base'
import React, { useEffect, useState } from 'react'
import { ImageBackground, Platform, View } from 'react-native'
import { gameInstanceMock, gameSvgs, GetAvatarColor, multipleChoiceQuestionMock, numberChoicePvpQuestionMock, numberChoiceQuestionMock, playerQuestionAnswersMock, playerQuestionNumberAnswersMock } from '../CommonGameFunc'
import { authAtom, gameTimerAtom } from '../../../state'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { MaterialIcons } from '@expo/vector-icons'


export default function AnswerNumberQuestionComponent({ question, AnswerNumberQuestion }) {
    const [answer, setAnswer] = useState("")
    const [isAnswered, setisAnswered] = useState(false)
    const user = useRecoilValue(authAtom)
    const timer = useRecoilValue(gameTimerAtom)

    const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, "backspace"]

    function OnMobileButtonClick(number) {
        if (/^\d+$/.test(number) || !number) {

            setAnswer(old => `${old}${number}`)
            return
        }

        if (number == "backspace") {
            setAnswer(old => old.substring(0, old.length - 1))
            return
        }
    }



    return (
        <>
            {isAnswered ?
                <Box width="100%">
                    <HStack mt={9} mb={2} justifyContent="center">
                        <Box width="33%" paddingY={6} borderRadius={25} bg={GetAvatarColor(question.participants.find(y => y.playerId == user.id).avatarName)}>
                            <Center alignItems="center" justifyContent="center">
                                <Text fontSize={{ base: "md", md: "lg", lg: "xl", xl: 26 }}>{answer}</Text>
                            </Center>
                        </Box>
                    </HStack>
                </Box>
                :
                <Center mt={Platform.OS == "web" ? 9 : 0} mb={2}>
                    <HStack>
                        <Input editable={Platform.OS == "web" ? true : false} onChangeText={(e) => {
                            if (/^\d+$/.test(e) || !e) {
                                setAnswer(e)
                            }
                        }}
                            onSubmitEditing={() => {
                                if (isAnswered) return
                                setisAnswered(true)
                                AnswerNumberQuestion(answer, timer)
                            }}
                            value={answer}
                            maxLength={14}
                            mr={2}
                            keyboardType="numeric"
                            variant="rounded"
                            backgroundColor="#D4EDFD"
                            color="black"
                            _hover={{ backgroundColor: "#A8CCE2" }}
                            size="md"
                            minWidth="250px"
                            width={Platform.OS == "web" ? "40vw" : "40%"}
                            placeholderTextColor="#737373"
                            style={{
                                fontStyle: "italic"
                            }}
                            placeholder="123" />

                        <IconButton
                            onPress={() => {
                                if (isAnswered) return
                                setisAnswered(true)
                                AnswerNumberQuestion(answer, timer)
                            }}
                            size="md"
                            colorScheme={Platform.OS == "web" ? "blue_button_bd" : "success"}
                            borderWidth={1}
                            borderRadius={10}
                            variant="solid"
                            _icon={{
                                as: MaterialIcons,
                                name: "check",
                                color: "white"
                            }}
                        />


                    </HStack>
                    {Platform.OS != "web" && <HStack mt={3}>

                        {numbers.map(e => {


                            return (
                                <Button px={4} colorScheme={"blue_button_bd"} m={1} borderRadius={10} onPress={() => OnMobileButtonClick(e)}>
                                    {e == "backspace" ? <MaterialIcons name="backspace" size={24} color="white" /> :
                                        <Text userSelect={'none'}>
                                            {e || `0`}
                                        </Text>}
                                </Button>
                            )
                        })}

                    </HStack>}
                </Center>
            }
        </>
    )
}