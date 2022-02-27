import React, { useState, useEffect } from 'react'
import statusEnum from '../opts/enums';
import { getRequestFromAIC } from '../opts/api'
import ArtDisplay from './art_display';
import randYears from '../opts/calc'

function Game(props) {
    // Initialise the variables
    const [status, setStatus] = useState(statusEnum.LOADING);
    const [nextStatus, setNextStatus] = useState(statusEnum.LOADING);
    const [artworkArray, setArtworkArray] = useState({});
    const [score, setScore] = useState(0);

    //Acquire the necessary data
    useEffect(() => {
        //
        const years = randYears()
        const yearsNxt = randYears()

        // randomly pick a date
        Promise.all([
            getRequestFromAIC(years[0], 50),
            getRequestFromAIC(years[1], 50),
            getRequestFromAIC(yearsNxt[0], 50),
            getRequestFromAIC(yearsNxt[1], 50)])
            .then((values) => {
                setArtworkArray(values)
                setStatus(statusEnum.SUCCESS)
            })
            .catch((err) => {
                console.log("Failed to get the data.")
                console.log(err)

                setStatus(statusEnum.FAILED)
            })

        // CleanUp -> ComponentWillUnmount
        return () => {
            setStatus(statusEnum.LOADING)
            setNextStatus(statusEnum.LOADING)
            setScore(0)
            setArtworkArray({})
        }

    }, [])

    function handleClick(option) {
        if (artworkArray.length === 4) {
            // set to loading 
            setNextStatus(statusEnum.LOADING)
            const artworkA = artworkArray[0].data.date_end
            const artworkB = artworkArray[1].data.date_end

            if (option !== 0 && option !== 1) {
                console.log("not valid")
            }
            else if (((option === 0) && (artworkB > artworkA)) || ((option === 1) && (artworkA > artworkB))) {
                setScore(score => score + 1)
            }
            else {
                props.gameLost(score)
                return
            }

            setArtworkArray(artworkArray => {
                let arr = [...artworkArray]
                arr.shift()
                arr.shift()

                return arr
            })

            const years = randYears()
            Promise.all([
                getRequestFromAIC(years[0], 50),
                getRequestFromAIC(years[1], 50)
            ])
                .then((values) => {
                    setArtworkArray(artworkArray => artworkArray.concat(values))
                    setNextStatus(statusEnum.SUCCESS)
                })
                .catch((err) => {
                    console.log("Failed to get the data.")
                    console.log(err)

                    setNextStatus(statusEnum.FAILED)
                })
        }
        else {
            console.log("STOP!!!")
        }
    }

    return (
        <div className='Game'>
            {(status === statusEnum.SUCCESS) ?
                <React.Fragment>
                    <ArtDisplay
                        artworkInfo={artworkArray[0].data}
                        imgSource={artworkArray[0].url}
                        onClick={() => { handleClick(0) }}
                    />
                    <div className='btn-container'>
                        <h1>Which is the older?</h1>
                        <h1>Score: {score}</h1>
                    </div>
                    <ArtDisplay
                        artworkInfo={artworkArray[1].data}
                        imgSource={artworkArray[1].url}
                        onClick={() => { handleClick(1) }}
                    />
                </React.Fragment> :
                (status === statusEnum.LOADING) ?
                    <div className="Loading">
                        <p>Loading...</p>
                    </div> :
                    <div className='Failed'>
                        <p>Failed to load data. Please Try Again... {":("}</p>
                    </div>
            }
        </div>

    )
}

export default Game;
