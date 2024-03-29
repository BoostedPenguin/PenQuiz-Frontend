import { Box, Text } from "native-base"
import React from "react"
import { Pressable } from "native-base"
import { QuestionsTemplateMode } from "./TableQuestionsTemplate"

interface TemplateButtonData {
    onClick: Function,
    mode: QuestionsTemplateMode,
    accept?: boolean,
    reject?: boolean,
    isEditable?: boolean,
}
export default function TemplateButton({ onClick, mode, accept = false, reject = false, isEditable = true }: TemplateButtonData) {
    return (
        <Pressable disabled={!isEditable} onPress={() => {
            onClick()
        }}>
            {({ isHovered, isFocused, isPressed }) => {
                return (
                    <Box borderColor="white" borderWidth={1} px={9} shadow={3} bg={!isEditable ? "gray.500" : accept && isPressed ? "green.700" : accept && isHovered ? "green.600" : accept ? "#00930F" : reject && isPressed ? "red.700" : reject && isHovered ? "red.600" : "#A01B1B"} borderRadius={50}>
                        <Box pb={2} pt={2}>
                            <Text selectable={false} fontSize={{ base: "md", md: "lg", lg: "xl", xl: "xl" }}>
                                {accept && mode == QuestionsTemplateMode.VIEW ? "Edit" : accept && mode == QuestionsTemplateMode.VERIFY ? "Accept" : null}
                                {reject && "Reject"}
                            </Text>
                        </Box>
                    </Box>
                )
            }}
        </Pressable>
    )
}