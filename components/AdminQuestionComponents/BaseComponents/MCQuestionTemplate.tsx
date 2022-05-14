import React from 'react'
import { Platform } from 'react-native'
import { Text, Center, Box, Input, VStack, HStack, Icon } from 'native-base'
import DefaultAlert from '../../Popups/DefaultAlert'
import { MaterialIcons } from '@expo/vector-icons';
import { QuestionType, useQuestionVerification, useQuestionVerificationParams } from '../../../hooks/useQuestionVerification'
import TemplateButton from './ActionButton'

import { QuestionsTemplateMode } from './TableQuestionsTemplate';

function InputField({ answer, onChangeText, isEditable }) {
    return (
        <VStack width={Platform.OS == "web" ? "100%" : "70%"}>
            <Text ml={2} fontSize="lg">Enter {answer.correct ? "correct" : "wrong"} answer:</Text>

            <Input onChangeText={(e) => {
                onChangeText(e)
            }}

                maxLength={50}
                shadow={3}
                value={answer.answer}
                keyboardType="numeric"
                mb={2}
                variant="rounded"

                backgroundColor={answer.correct && isEditable ? "#fff" : isEditable ? "#DEDEDE" : "#CDCDCD"}
                editable={isEditable}
                color={isEditable ? "#000" : "#505050"}
                _hover={{ backgroundColor: isEditable ? "#E8E8E8" : "#CDCDCD" }}
                size="md" />
        </VStack>
    )
}

export function MCQuestionTemplate(stateParameters: useQuestionVerificationParams) {

    const { isEditable,
        setIsEditable,
        question,
        setQuestion,

        // Multiple
        answers,
        setAnswers,
        //

        serverError,
        RejectQuestion,
        AcceptQuestion, EditQuestion } =
        useQuestionVerification(stateParameters)



    return (
        <Center>
            {serverError && <DefaultAlert message={serverError} />}

            {/* Question */}
            <Box width="50%" minWidth="250px" maxWidth="600px">
                {question.error && DefaultAlert({
                    message: question.error
                })}
                <Text ml={2} fontSize="lg">User question:</Text>

                <Input onChangeText={(e) => {
                    setQuestion({
                        question: e,
                        error: "",
                    })
                }}
                    color={isEditable ? "#000" : "#505050"}
                    shadow={3}
                    value={question.question}
                    mb={2}
                    variant="rounded"
                    backgroundColor={isEditable ? "#fff" : "#CDCDCD"}
                    editable={isEditable}
                    _hover={{ backgroundColor: isEditable ? "#E8E8E8" : "#CDCDCD" }}
                    size="md"
                    InputRightElement={<Icon onPress={() => {
                        setIsEditable(!isEditable)
                    }} as={<MaterialIcons name="edit" />} size={5} mr="2" color="black" />}
                />


                <VStack>
                    <HStack width="50%">
                        <InputField isEditable={isEditable} answer={answers[0]} onChangeText={(e) => {
                            setAnswers(old => old.map(
                                el => el == answers[0] ? { ...el, answer: e } : el
                            ))
                        }} />
                        <Box mx={1} />
                        <InputField isEditable={isEditable} answer={answers[1]} onChangeText={(e) => {
                            setAnswers(old => old.map(
                                el => el == answers[1] ? { ...el, answer: e } : el
                            ))
                        }} />
                    </HStack>
                    <HStack width="50%">
                        <InputField isEditable={isEditable} answer={answers[2]} onChangeText={(e) => {
                            setAnswers(old => old.map(
                                el => el == answers[2] ? { ...el, answer: e } : el
                            ))
                        }} />
                        <Box mx={1} />
                        <InputField isEditable={isEditable} answer={answers[3]} onChangeText={(e) => {
                            setAnswers(old => old.map(
                                el => el == answers[3] ? { ...el, answer: e } : el
                            ))
                        }} />
                    </HStack>
                </VStack>
            </Box>

            <Box mt={6} />

            <HStack width="50%" minWidth="250px" maxWidth="600px" justifyContent="space-between">
                <TemplateButton mode={stateParameters.mode} reject onClick={() => {
                    RejectQuestion()
                }} />
                <TemplateButton isEditable={stateParameters.mode == QuestionsTemplateMode.VIEW ? isEditable : true} accept mode={stateParameters.mode} onClick={() => {
                    stateParameters.mode == QuestionsTemplateMode.VIEW ? EditQuestion(QuestionType.MULTIPLE) : AcceptQuestion(QuestionType.MULTIPLE)
                }} />
            </HStack>

        </Center>
    )
}