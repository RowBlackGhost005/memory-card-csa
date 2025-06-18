import {useReducer} from 'react';
import {GameContext} from './GameContext';

const reducer = (state , action) => {
    switch(action.type) {
        case "ADD":
            return [...state , action.card];
        default:
            return state;
    }
};

export const GameProvider = ({children}) => {
    const [state , dispatch] = useReducer(reducer , []);

    return (
        <GameContext.Provider value={{ state, dispatch}}>
            {children}
        </GameContext.Provider>
    );
};