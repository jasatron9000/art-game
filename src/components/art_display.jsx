import React from 'react'

function ArtDisplay(props) {
    const { artworkInfo, imgSource } = props
    const { className } = props

    const { title, artist_title, medium_display } = artworkInfo

    return (
        <div className={`ArtDisplay ${(className) ? className : ""}`}>
            <div className='img-container' onClick={props.onClick}>
                <img src={imgSource} alt={title} />
            </div>
            <div className='text-box'>
                <h1>{(artist_title) ? artist_title : "Unknown"}</h1>
                <h2><b>{`${(title) ? title : "Unnamed work"},`}</b></h2>
                <h2>{"c. "}<span>{"LMAO"}</span></h2>
                <p>{medium_display}</p>
            </div>
        </div>
    )
}

export default ArtDisplay