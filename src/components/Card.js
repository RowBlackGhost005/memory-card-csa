import React , {useState , useContext} from 'react';
import {GameContext} from '../context/GameContext';

import misteryImg from '../assets/mistery.png';
import {imageResolve} from '../util/imageResolver';

const useMatchedCard = (value) => {
    const {state: matchedCards} = useContext(GameContext);

    return matchedCards.includes(value);
}

const Card = React.memo(({id , value , handleSelected , selectedCards , isActive}) => {

    const isMatched = useMatchedCard(value);

    const cardImg = imageResolve(value);

    const isSelected = (selectedCards.card1 === id || selectedCards.card2 === id)

    const selected = () => {
        handleSelected(id);
    }

    return(
        <div className={`card clickeable border-1 ${isMatched ? "diseabled hidden" : ""}`} onClick={isActive ? selected : undefined}>
            <img className={`cardImage ${isSelected ? 'fade-in flipped' : ''}`} src={(isSelected) ? cardImg : misteryImg} alt="Card"></img>
        </div>
    );
});

export default Card;