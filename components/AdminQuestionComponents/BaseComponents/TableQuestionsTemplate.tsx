import React, { useState, useEffect } from 'react'
import { View, ImageBackground, StyleSheet, ActivityIndicator, Platform } from 'react-native'
import { Text, Button, Center, Box, Pressable, Alert, VStack, HStack, AspectRatio, Icon, ScrollView } from 'native-base'
import { useFetchWrapper } from '../../../helpers'
import { QUESTION_SERVICE_API_URL } from '../../../injectable'
import { useIsFocused } from '@react-navigation/native'
import { MaterialIcons } from '@expo/vector-icons';
import { Dimensions } from 'react-native';
import { NumberQuestionTemplate } from './NumberQuestionTemplate'
import { MCQuestionTemplate } from './MCQuestionTemplate'
import { PaginatedQuestionsResponse, Questions } from '../../../types/adminQuestionTypes'

export enum QuestionsTemplateMode {
    VIEW,
    VERIFY
}
export function TableQuestionsTemplate({ mode }: { mode: QuestionsTemplateMode }) {
    const windowWidth = Dimensions.get('screen').width;
    const [questionsResponse, setQuestionsResponse] = useState<PaginatedQuestionsResponse>()
    const [onSuccess, setOnSuccess] = useState<{
        message: string;
        status: string;
    } | null>()
    const fetchWrapper = useFetchWrapper()
    const isFocused = useIsFocused()


    const [selectedQuestion, setSelectedQuestion] = useState<Questions>()
    const [currentScreen, setCurrentScreen] = useState<"number" | "multiple" | "base">("base")

    useEffect(() => {
        if (!isFocused) return
        fetchQuestions(1)

    }, [isFocused])

    useEffect(() => {
        if (!isFocused) {
            setCurrentScreen("base")
            setOnSuccess(null)
        }
    }, [isFocused])

    function fetchQuestions(pageIndex: number) {

        const baseUrl = `${QUESTION_SERVICE_API_URL}/api/questionadmin/${mode == QuestionsTemplateMode.VIEW ? "verified" : "unverified"}?pageNumber=${pageIndex}&pageEntries=${Platform.OS == "web" ? 12 : 4}`
        fetchWrapper.get(`${baseUrl}`)
            .then((response: PaginatedQuestionsResponse) => {
                setQuestionsResponse(response)
            })
            .catch(er => {
                console.log(er)
            })
    }

    function SuccessAlert({ message, status }: { message: string, status: string }) {
        return (
            <Alert my={3} maxW="90%" status={status}>
                <VStack space={2} flexShrink={1} w="100%">
                    <HStack flexShrink={1} space={2} >
                        <Alert.Icon mt="1" />
                        <Text fontSize="md" color="coolGray.800">
                            {message}
                        </Text>
                    </HStack>
                </VStack>
            </Alert>
        )
    }
    const goPrevious = () => {
        if (!questionsResponse) return;
        fetchQuestions(questionsResponse.pageIndex - 1)
    }

    const goNext = () => {
        if (!questionsResponse) return;
        fetchQuestions(questionsResponse.pageIndex + 1)
    }


    function ButtonTemplate({ onPressEvent, buttonText, left = false, right = false }: { onPressEvent: () => void, buttonText: string, left?: boolean, right?: boolean }) {
    return (
        <Pressable onPress={() => {
            onPressEvent()
        }}>
            {({ isHovered, isFocused, isPressed }) => {
                return (
                    <Box px={9} shadow={3} bg={isPressed ? "#8EC8CD" : isHovered ? "#ACE6EB" : "#C8FBFF"} p={2} borderRadius={50}>
                        <Box px={4} pb={1} pt={1}>
                            <HStack justifyContent="center">
                                {left && <Center>
                                    <MaterialIcons name="keyboard-arrow-left" size={24} color="black" />
                                </Center>}

                                <Text selectable={false} fontSize={{ base: "sm", md: "md", lg: "lg", xl: "xl" }} color="#032157" fontStyle="italic">
                                    {buttonText}
                                </Text>

                                {right && <Center>
                                    <MaterialIcons name="keyboard-arrow-right" size={24} color="black" />
                                </Center>}
                            </HStack>

                        </Box>
                    </Box>
                )
            }}
        </Pressable>
    )
}

function QuestionRow({ type, question, onPress }: { type: "multiple" | "number", question: string, onPress: () => void }) {
    return (
        <Pressable onPress={() => {
            onPress()
        }}>
            {({ isHovered, isFocused, isPressed }) => {
                return (
                    <Box width="100%" p={2} borderWidth={2} borderColor="#B6F6FF" bg={isPressed ? "#0C3958" : isHovered ? "#0E466D" : "#0F5688"}>
                        <HStack justifyContent="space-between">
                            <Box>
                                <HStack>
                                    <AspectRatio p={Platform.OS == "web" ? 4 : 3} bg="white" ratio={1 / 1} borderRadius={10}>
                                        <Center>
                                            <Text selectable={false} color="black" fontSize={Platform.OS == "web" ? "md" : "xs"}>
                                                {type == "multiple" ? "abc" : type == "number" ? "123" : "--"}
                                            </Text>
                                        </Center>
                                    </AspectRatio>
                                    <Text alignSelf="center" ml={3} isTruncated maxW={windowWidth * 0.4} fontSize={{ base: "md", md: "md", lg: "lg", xl: "xl" }}>
                                        {question}
                                    </Text>
                                </HStack>
                            </Box>
                            <Center>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color="white" />
                            </Center>


                        </HStack>
                    </Box>
                )
            }}
        </Pressable>
    )
}

function RenderBase() {
    return (
        <View style={{ alignItems: "center", flex: 0.9 }}>

            <Box flex={0.9} width="90%" minWidth="70%" bg="#071D56" p={8} borderRadius={25}>
                <Text mb={5} textAlign="center" color="#fff" fontSize={{ base: "md", md: "lg", lg: "xl", xl: "3xl" }} style={{ fontFamily: 'Before-Collapse', }}>
                    {mode == QuestionsTemplateMode.VERIFY ? "question submissions" : "game questions"}
                </Text>

                {onSuccess && <SuccessAlert message={onSuccess.message} status={onSuccess.status} />}


                {!questionsResponse && <ActivityIndicator size="large" />}

                {questionsResponse && questionsResponse.questions.length == 0 &&
                    <Text textAlign="center">
                        {mode == QuestionsTemplateMode.VERIFY ?
                            `No questions that require verification at this moment.${'\n'}Check back later.` :
                            `No additional questions available in the database.${'\n'}Warning! System will only be using the initial pre-defined questions!`
                        }
                    </Text>
                }

                <VStack flex={1}>
                    <ScrollView>
                        {questionsResponse && questionsResponse.questions.map(e => {
                            return (
                                <QuestionRow key={e.id} type={e.type} question={e.question} onPress={() => {
                                    setCurrentScreen(e.type)
                                    setSelectedQuestion(e)
                                }} />
                            )
                        })}
                    </ScrollView>




                </VStack>

                {questionsResponse && <HStack justifyContent={questionsResponse.hasPreviousPage && questionsResponse.hasNextPage ? "space-between" : questionsResponse.hasNextPage ? "flex-end" : "flex-start"} mt={5} mx={2}>
                    {questionsResponse.hasPreviousPage && <ButtonTemplate left buttonText="Previous" onPressEvent={() => {
                        goPrevious()
                    }} />}
                    {questionsResponse.hasNextPage && <ButtonTemplate right buttonText="Next" onPressEvent={() => {
                        goNext()
                    }} />}
                </HStack>}

            </Box>
        </View>
    )
}

return (
    <ImageBackground source={Platform.OS === 'web' ? require('../../../assets/homeBackground.svg') : require('../../../assets/homeBackground.png')} resizeMode="cover" style={styles.image}>
        {currentScreen != "base" && <Button onPress={() => {
            setOnSuccess(null)
            setCurrentScreen("base")
        }} borderColor="white" borderWidth={2} colorScheme='white_bd' variant="outline" color="white" style={{ position: "absolute", top: 5, left: 5 }} leftIcon={<Icon as={MaterialIcons} name="arrow-back-ios" size="sm" />}>
            Back
        </Button>}
        {currentScreen == "multiple" ?

            <MCQuestionTemplate
                mode={mode}
                questionProp={selectedQuestion!.question}
                questionId={selectedQuestion!.id}
                backToBase={(e) => {
                    setOnSuccess(e ? e : null)
                    fetchQuestions(questionsResponse!.pageIndex == 1 ? 1 : questionsResponse!.questions.length <= 1 ? questionsResponse!.pageIndex - 1 : questionsResponse!.pageIndex)
                    setCurrentScreen("base")
                }}
                answerProp={undefined}
                answersProp={selectedQuestion!.answers} /> :

            currentScreen == "number" ?

                <NumberQuestionTemplate
                    mode={mode}
                    questionProp={selectedQuestion!.question}
                    questionId={selectedQuestion!.id}
                    backToBase={(e) => {
                        setOnSuccess(e ? e : null)
                        fetchQuestions(questionsResponse!.pageIndex == 1 ? 1 : questionsResponse!.questions.length <= 1 ? questionsResponse!.pageIndex - 1 : questionsResponse!.pageIndex)
                        setCurrentScreen("base")
                    }}
                    answersProp={[]}
                    answerProp={selectedQuestion!.answers[0].answer} /> :

                currentScreen == "base" ?

                    <RenderBase /> : null}

    </ImageBackground>
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
})