import React from 'react';

import './App.css';
import './styles.css';

import GameBoard from './components/GameBoard';
import {GameProvider} from './context/GameProvider';
import GameErrorBoundary from './components/GameErrorBoundary';

function App() {
  return (
    <React.Fragment>
      <header>
        <h1>Programming Memory Card</h1>
      </header>
      <main>
        
          <GameProvider>
            <GameErrorBoundary>
              <GameBoard/>
            </GameErrorBoundary>
          </GameProvider>
       
      </main>
    </React.Fragment>
  );
}

export default App;
