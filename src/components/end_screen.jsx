function End(props) {
    return (
        <div className={`end-screen ${(props.className) ? props.className : ""}`}>
            <div>
                <h1>Game Over!</h1>
                <h2>Score: {props.score}</h2>
                <h2>High Score: {props.highscore}</h2>
                <button onClick={props.gameReplay}>Replay</button>
            </div>
        </div>
    )
}

export default End