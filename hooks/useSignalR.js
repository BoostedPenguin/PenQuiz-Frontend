import { setupSignalRConnection } from './SignalRSetup';
import { authToken, gameInstanceAtom, joiningGameExceptionAtom, connectionStatusAtom, gameTimerAtom, gameMapExceptionAtom, canUserAnswerQuestionAtom, showMultipleChoiceQuestionAtom, multipleChoiceQuestionAtom, authAtom, questionParticipantsAtom, roundQuestionAtom, playerQuestionAnswersAtom } from '../state';
import { useRecoilValue, useRecoilState } from 'recoil';
import { BACKEND_GAME_API_URL } from '@env'
import { navigate } from '../helpers'
import { getConnection } from './SignalRSetup'
import { useEffect, useState } from 'react';

const connectionHub = `${BACKEND_GAME_API_URL}/gamehubs`;

export const StatusCode = {
    "CONNECTED": 1,
    "DISCONNECTED": 0
}
export function useSignalR() {
    const userJwt = useRecoilValue(authToken)
    const currentUser = useRecoilValue(authAtom)
    const [gameInstance, setGameInstance] = useRecoilState(gameInstanceAtom);
    const [joiningGameException, setJoiningGameException] = useRecoilState(joiningGameExceptionAtom);
    const [connectionStatus, setConnectionStatus] = useRecoilState(connectionStatusAtom);
    const [gameTimer, setGameTimer] = useRecoilState(gameTimerAtom);
    const [currentAttackerId, setCurrentAttackerId] = useState(0);
    const [gameMapException, setGameMapException] = useRecoilState(gameMapExceptionAtom);
    const [roundQuestion, setRoundQuestion] = useRecoilState(roundQuestionAtom)
    const [playerQuestionAnswers, setPlayerQuestionAnswers] = useRecoilState(playerQuestionAnswersAtom)
    let connection = getConnection()

    useEffect(() => {
        if (!connection) {

            connection = setupSignalRConnection(connectionHub, userJwt);
            setConnectionStatus({
                StatusCode: StatusCode.CONNECTED,
                Error: null,
            })
        }
        if (connection)
            setupEvents()
    }, [])

    function setupEvents() {


        connection.onreconnecting((error) => {
            setConnectionStatus({
                StatusCode: StatusCode.DISCONNECTED,
                Error: error,
            })
        })
        connection.onreconnected(() => {
            setConnectionStatus({
                StatusCode: StatusCode.CONNECTED,
                Error: {},
            })
        })

        connection.onclose(error => {
            setConnectionStatus({
                StatusCode: StatusCode.DISCONNECTED,
                Error: error ? error : { message: "Connection to the server lost. Please try again later." },
            })
        });

        // On server event handler
        // Lobby events
        connection.on('LobbyCanceled', ((msg) => {
            setJoiningGameException(msg)
            navigate("Home")
        }))
        connection.on('TESTING', ((msg) => {
            console.log(msg)
        }))
        
        connection.on('CallerLeftGame', (() => {
            navigate("Home")
        }))
        connection.on('PersonLeftGame', ((disconnectedPersonId) => {
            setGameInstance(old => ({
                ...old,
                participants: old.participants.map(
                    el => el.playerId === disconnectedPersonId ? { ...el, isBot: true } : el
                )
            }))
        }))
        connection.on('NavigateToLobby', ((gi) => {
            navigate("GameLobby")
        }))
        connection.on('NavigateToGame', ((gi) => {
            navigate("GameMap")
        }))
        connection.on('GetGameInstance', ((gi) => {
            setGameInstance(gi)

            setJoiningGameException(null)
        }))
        connection.on('PlayerRejoined', ((participId) => {
            setGameInstance(old => ({
                ...old,
                participants: old.participants.map(
                    el => el.playerId === participId ? { ...el, isBot: false } : el
                )
            }))
        }))
        connection.on('GameStarting', (() => {
            navigate("GameMap")
        }))
        connection.on('GameException', ((er) => {
            setJoiningGameException(er)
        }))



        // Game events
        connection.on('Game_Show_Main_Screen', (() => {
            navigate("GameMap")
        }))

        connection.on('ShowRoundingAttacker', ((attackerId, msTimeForAction) => {
            setCurrentAttackerId(attackerId)
            setRoundQuestion("")
            setGameTimer((msTimeForAction - 1000) / 1000)
        }))

        connection.on('BorderSelectedGameException', ((msg) => {
            setGameMapException(msg)
        }))

        // Question events
        connection.on('GetRoundQuestion', ((roundQuestion, msTimeForAction) => {
            setRoundQuestion(roundQuestion)
            setGameTimer((msTimeForAction - 1000) / 1000)
        }))

        connection.on('QuestionPreviewResult', ((previewResult) => {
            setPlayerQuestionAnswers(previewResult)
            setGameMapException("")
        }))
    }

    // Game map events
    function SelectTerritory(territoryName) {
        connection?.invoke("SelectTerritory", territoryName)
    }

    function AnswerMCQuestion(answerId) {
        connection?.invoke("AnswerMCQuestion", answerId)
    }

    // Send events to server
    function CreateGameLobby() {
        connection?.invoke("CreateGameLobby")
    }

    function LeaveGameLobby() {
        connection?.invoke("LeaveGameLobby")
    }

    function JoinLobby(code) {
        connection?.invoke("JoinGameLobby", code)
    }

    function StartGame() {
        connection?.invoke("StartGame")
    }

    return {
        // Game
        currentAttackerId,
        gameTimer,
        gameMapException,
        SelectTerritory,

        // Question rounding
        roundQuestion,
        AnswerMCQuestion,
        playerQuestionAnswers,

        connection,
        gameInstance,
        joiningGameException,
        connectionStatus,
        CreateGameLobby,
        JoinLobby,
        LeaveGameLobby,
        StartGame
    }
}