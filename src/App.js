import { useState, useEffect } from 'react'
import './App.css';
import Game from './components/game_screen';
import End from './components/end_screen';
import './styles.css'
import statusEnum from './opts/enums';

function App() {
    const [gameState, setGameState] = useState(statusEnum.SUCCESS);
    const [score, setScore] = useState(0)
    const [highscore, setHighscore] = useState(0)

    useEffect(() => {
        let highScore = localStorage.getItem("high-score")

        if (highScore === null) {
            localStorage.setItem("high-score", 0)
        }

        setHighscore(highScore)
    }, [])


    function handleLostState(score) {
        setGameState(statusEnum.FAILED)
        setScore(score)

        if (score > highscore) {
            setHighscore(score)
            localStorage.setItem("high-score", score)
        }
    }

    function handleReplay() {
        //loading
        setGameState(statusEnum.LOADING)

        //wait 0.5 seconds
        setTimeout(() => {
            setGameState(statusEnum.SUCCESS)
        }, 200)
    }

    return (
        <div className='App'>
            <End
                className={(gameState === statusEnum.SUCCESS) ? "hidden" : ""}
                score={score}
                highscore={highscore}
                gameReplay={handleReplay} />
            {(gameState !== statusEnum.LOADING) ? <Game gameLost={handleLostState} /> : <div />}
        </div>
    )
}

export default App;
