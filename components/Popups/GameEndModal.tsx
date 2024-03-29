import { Box, Container, HStack, Modal, Text, VStack, Image, Center, AspectRatio, Pressable } from 'native-base'
import React, { useState } from 'react'
import { Platform } from 'react-native'
import { GameInstanceResponse, ParticipantsResponse } from '../../types/gameInstanceTypes';
import { GetAvatarColor, GetPenguinAvatarImage } from '../GameMapComponents/CommonGameFunc'

interface GameEndModalParams {
    onExit: () => void,
    gameInstance: GameInstanceResponse;
}

export default function GameEndModal({ gameInstance, onExit }: GameEndModalParams) {
    const [isModalOpen, setIsModalOpen] = useState<boolean>(true)

    function GenerateScoreboardNumber({ participant, position }: { participant: ParticipantsResponse, position: number }) {
        return (
            <Box backgroundColor={GetAvatarColor(participant.inGameParticipantNumber)} borderColor="white" borderWidth={3} p={1} m={1} borderRadius={15}>
                <Center flex={1}>
                    <Text color="white"
                        fontWeight="bold"
                        fontSize={{ base: "sm", md: "md", lg: "xl" }}>
                        {position == 1 ? "1st" : position == 2 ? "2nd" : "3rd"}
                    </Text>
                </Center>
            </Box>
        )
    }
    function PlayerBoard({ participant, position }: { participant: ParticipantsResponse, position: number }) {
        return (
            <HStack>
                {Platform.OS == "web" ?
                    <Center>
                        <AspectRatio height="70%" ratio={1 / 1}>
                            <GenerateScoreboardNumber participant={participant} position={position} />
                        </AspectRatio>
                    </Center> :
                    <GenerateScoreboardNumber participant={participant} position={position} />
                }



                <Box width={500} backgroundColor={GetAvatarColor(participant.inGameParticipantNumber)} borderColor="white" borderWidth={3} p={1} m={1} borderRadius={25}>
                    <HStack justifyContent="space-around">
                        <Container bg="#fff" borderRadius={200} p={2}>
                            <Image
                                source={GetPenguinAvatarImage(participant.gameCharacter!.character.avatarName)}
                                alt="alt"
                                resizeMode="contain"
                                size="xs"
                            />

                        </Container>
                        <Center>
                            <Text ml={2} isTruncated maxWidth={180} fontSize={{ base: "sm", md: "md", lg: "2xl" }}>
                                {participant.player?.username}
                            </Text>
                        </Center>
                        <Center>
                            <Box ml={2} width="150" bg="#fff" borderRadius={15}>
                                <Center>
                                    <Text color="black"
                                        fontSize={{ base: "sm", md: "md", lg: "xl" }}>
                                        {participant.score}
                                    </Text>
                                </Center>
                            </Box>
                        </Center>

                    </HStack>
                </Box>
            </HStack>
        )
    }


    function ExitGame() {
        return (
            <Pressable mt={4} onPress={() => {
                setIsModalOpen(false)
                onExit()
            }}>
                {({ isHovered, isFocused, isPressed }) => {
                    return (
                        <Box px={9} shadow={3} bg={isPressed ? "#0D569B" : isHovered ? "#06326F" : "#071D56"} p={2} borderRadius={50}>
                            <Box px={4} pb={2} pt={2}>
                                <Text selectable={false} fontSize={{ base: "md", md: "lg", lg: "xl", xl: 35 }}>
                                    Exit Game
                                </Text>
                            </Box>
                        </Box>
                    )
                }}
            </Pressable>
        )
    }

    return (
        <>
            <Modal defaultIsOpen={false} isOpen={isModalOpen} closeOnOverlayClick={false} isKeyboardDismissable={false} size="full" px={8}>
                <Modal.Content borderRadius={25}>
                    <Modal.Body px={8} bg="#2F4887">

                        <VStack alignItems="center">
                            <Text color="#fff" fontSize={{ base: 40, lg: 50 }} style={{ fontFamily: 'Before-Collapse', }}>
                                Game Over
                            </Text>

                            {[...gameInstance.participants].sort((first, second) => {
                                if (first.score < second.score)
                                    return 1
                                if (first.score > second.score)
                                    return -1
                                return 0
                            }).map((x, index) =>
                                <PlayerBoard key={x.id} participant={x} position={index + 1} />
                            )}
                            <ExitGame />
                        </VStack >

                    </Modal.Body>
                </Modal.Content>
            </Modal>
        </>
    )
}