import React , {useState , useReducer , useEffect , useMemo , useContext} from 'react';

import {GameContext} from '../context/GameContext';
import Card from './Card';

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

    /** Manages the score of the game */
    const [score , setScore] = useState(0);

    /** Manages the timer of the game */
    const [time , setTime] = useState(0);

    /** Shuffled cards to be used to create the Cards at game*/
    const shuffledCards = useMemo(() => {
        return shuffleArray([...cardsRegistry , ...cardsRegistry]);
    } , []);

    /**
     * Receives an array and shuffles its elements.
     * 
     * @param {*} array To shuffle
     * @returns Array with same elements but shuffled.
     */
    function shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    };
    

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
                }else if(state.card1 !== null){
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
            setGameActive(false);
            setTimeout(() => {
                validateSelectedCards(cardsSelected.card1 , cardsSelected.card2);
                dispatchCardSelected({type : "RESTART"});
                setGameActive(true);
            } , 1000);
        }
    } , [cardsSelected]);

    /** Uses game Context for managing which card values have been found */
    const {state: matchedCards, dispatch: setMatchedCard} = useContext(GameContext);

    /** Routes the selection of a card to the reducer*/
    const handleSelected = (index) => {
        dispatchCardSelected({type: "SELECT" , card: index});
    }

    /** Determines whether the two currently selected cards are matched based on its value fetched using its ID */
    const validateSelectedCards = (card1 , card2) => {
        if(shuffledCards[card1] === shuffledCards[card2]){
            setMatchedCard({type: "ADD" , card: shuffledCards[card1]});
            setScore((prev) => prev + 1);
        }
        
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setTime(prev => prev + 1);
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    


    //ToDo: Add GameContext for Timer and Game Score

    return(
        <div>
            <div className="scoreboard">
                <h2>{`Time: ${time}s`}</h2>
                <h2>{`Pairs: ${score}`}/{shuffledCards.length / 2}</h2>
            </div>
            <div id='gameBoard'>
                {Array.from({length: cardsToPlay}).map((_ , index) => (
                    <Card key={shuffledCards[index] + index} id={index} value={shuffledCards[index]} handleSelected={handleSelected} selectedCards={cardsSelected} isActive={gameActive}/>
                ))}
            </div>
        </div>

    );
};

export default GameBoard;