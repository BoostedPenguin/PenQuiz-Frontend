import { Center, Container, HStack, Text, Image, VStack, Box, ZStack } from "native-base";
import React, { useState } from "react"
import { View, StyleSheet } from 'react-native';
import { GetParticipantColor, RoundAttackStage, gameInstanceMock } from './CommonGameFunc'
import { useRecoilValue } from 'recoil'
import { gameInstanceAtom } from '../../state'

export default function GameRounding({ gameInstance = gameInstanceMock }) {
    if (!gameInstance) {
        return null
    }


    function RenderRound() {
        switch (RoundAttackStage(gameInstance.rounds.find(x => x.gameRoundNumber == gameInstance.gameRoundNumber).attackStage)) {
            case "MULTIPLE_NEUTRAL":
                const ENUM_ID = 0;
                let rounds = gameInstance.rounds.filter(x => x.attackStage == ENUM_ID)

                // Rounds hold a single round question // Contain 3 territory attackers
                return (
                    <>
                        <HStack style={{ flex: 1 }}>
                            {rounds.map(round =>
                                <React.Fragment key={round.id}>
                                    {round.neutralRound.territoryAttackers.map((pAttack, index) =>
                                        <View key={pAttack.id} style={[round.gameRoundNumber == gameInstance.gameRoundNumber 
                                            && pAttack.attackOrderNumber == round.neutralRound.attackOrderNumber ? {
                                            outlineColor: 'rgba(6, 28, 83, 0.8)',
                                            outlineStyle: "solid",
                                            outlineWidth: 4,
                                            elevation: 5,
                                        } : null, {
                                            flex: 1,
                                            backgroundColor: GetParticipantColor(gameInstance, pAttack.attackerId),
                                            margin: 10,
                                            borderRadius: 5,
                                            marginRight: index % 3 == 2 ? 10 : 0,
                                            marginVertical: 34,
                                        }]} />
                                    )}
                                </React.Fragment>
                            )}
                        </HStack>
                    </>
                )
        }
    }
    return (
        <>
            <View style={{
                flex: 1,
                backgroundColor: "#BFD2D4",
                borderRadius: 25,
                justifyContent: "center",
            }}>
                {/* In case we want to make every rounding stage (4 stages total) unique
                    We'd need to make it dynamic in case we want to add stuff later
                    By receiving the whole game instance object we can do the following:
                     */}
                <RenderRound />
            </View>
        </>
    )
}