import React , {useState , useReducer , useEffect , useMemo , useContext , useCallback} from 'react';

import {GameContext} from '../context/GameContext';
import Card from './Card';
import useTimer from '../hooks/useTimer';

const gameactions = { 
    SELECT: "SELECT",
};

/**
 * Manages the Memory Card Game.
 * 
 * @returns Gameboard Component.
 */
function GameBoard() {

    /** Ammount of cards at play */
    const cardsToPlay = 20;

    /** Value of the cards at play, must match to a card within the Image Resolver */
    const cardsRegistry = [
        "csharp", "c" , "css" , "haskell" , "html" , "java" , "javascript" , "mysql" , "postgres" , "python"
    ];

    const [gameWon , setGameWon] = useState(false);

    /** Manages the score of the game */
    const [score , setScore] = useState(0);

    /** Manages the attempts to match pairs */
    const [attempts , setAttempts] = useState(0);

    /**
     * Receives an array and shuffles its elements.
     * 
     * @param {*} array To shuffle
     * @returns Array with same elements but shuffled.
     */
    const shuffleArray = useCallback((array) => {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }, []);

    /** Shuffled cards to be used to create the Cards at game*/
    const shuffledCards = useMemo(() => {
        return shuffleArray([...cardsRegistry , ...cardsRegistry]);
    } , [gameWon]);

    /**
     * Manages the logic of selecting cards and ensures theres a maximum of two selected at any time.
     * @param {*} state Arrays of cards selected.
     * @param {*} action Action to take.
     * @returns 
     */
    const cardSelectionReducer = (state , action) => {
        let newState = {};
        switch(action.type){
            case "SELECT":
                if(state.card1 === null){
                    newState = {...state , card1: action.card};
                }else if(state.card1 !== action.card){
                    newState = {...state , card2: action.card};
                }
                return newState;
            
            case "RESTART":
                return {card1: null , card2: null};
            default:
                return state;
        }
    };

    /** Sets the reducer with a state of pairs represented as an array of two elements */
    const [cardsSelected , dispatchCardSelected] = useReducer(cardSelectionReducer , {card1 : null , card2: null});

    /** Diseables card selection */
    const [gameActive , setGameActive] = useState(true);

    /** Checks if there are two cards selected to start the validating matches*/
    useEffect(() => {
        if(cardsSelected.card1 !== null && cardsSelected.card2 !== null){
            setAttempts((prev) => prev + 1);
            setGameActive(false);
            setTimeout(() => {
                validateSelectedCards(cardsSelected.card1 , cardsSelected.card2);
                dispatchCardSelected({type : "RESTART"});

                setTimeout(() => {
                    setGameActive(true);
                } , 200)

                
            } , 800);
        }
    } , [cardsSelected]);

    /** Uses game Context for managing which card values have been found */
    const {state: matchedCards, dispatch: setMatchedCard} = useContext(GameContext);

    /** Routes the selection of a card to the reducer*/
    const handleSelected = useCallback((index) => {
        if(cardsSelected.card1 === null){
            dispatchCardSelected({type: "SELECT" , card: index});
        }
        
    } , []);

    /** Determines whether the two currently selected cards are matched based on its value fetched using its ID */
    const validateSelectedCards = (card1 , card2) => {
        if(shuffledCards[card1] === shuffledCards[card2]){
            setMatchedCard({type: "ADD" , card: shuffledCards[card2]});
            setScore((prev) => prev + 1);
        }
        
    };
    
    /** Custom hook that manages time */
    const [reset , setReset] = useState(false);
    const [seconds , minutes] = useTimer(reset);

    useEffect(() => {
        if(score === 10){
            setGameWon(true);
            setTimeStamp({minutes: minutes , seconds: seconds});
        }
    } , [score])

    /** Stores a time stamp when finished the game */
    const [timeStamp, setTimeStamp] = useState(null);
    
    /** Reset all states to initial value */
    const restartGame = useCallback(()=> {
        setGameWon(false);
        setTimeStamp(null);
        setAttempts(0);
        setMatchedCard({type: "RESET"});
        setScore(0);
        setReset(prev => !prev);
    } , []);

    if(gameWon){
        return (
            <React.Fragment>
                <div className='text-center'>
                    <h2>You finished!</h2>
                    <h2>{`Time: ${timeStamp.minutes}m ${timeStamp.seconds}s`}</h2>
                    <h2>{`Attempts: ${attempts}`}</h2>
                    <button className='btn-restart' onClick={restartGame}>Restart</button>
                </div>
            </React.Fragment>
        
        
    );
    }else{
        return(
            <div className='flex'>
                <div className="scoreboard">
                    <h2>{`Time: ${minutes}m ${seconds}s`}</h2>
                    <h2>{`Pairs: ${score}`}/{shuffledCards.length / 2}</h2>
                    <h2>{`Attempts: ${attempts}`}</h2>
                </div>
                <div id='gameBoard'>
                    {Array.from({length: cardsToPlay}).map((_ , index) => (
                        <Card key={shuffledCards[index] + index} id={index} value={shuffledCards[index]} handleSelected={handleSelected} selectedCards={cardsSelected} isActive={gameActive}/>
                    ))}
                </div>
            </div>

        );
    }


};

export default GameBoard;