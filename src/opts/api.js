export function getDateseQuery_AIC(begin_date, end_date, as_string = false) {
    const apiQuery = {
        "query": {
            "bool": {
                "must": [
                    {
                        "range":
                            { "date_end": { "gte": begin_date, "lt": end_date } }
                    },
                    {
                        "term":
                            { "is_public_domain": true }
                    },
                    {
                        "terms":
                            { "artwork_type_id": [30, 31, 32, 34, 38, 40, 43, 45, 13, 1, 14, 18] }
                    }
                ]
            }
        }
    }

    if (as_string) {
        return JSON.stringify(apiQuery)
    }

    return apiQuery
}

export function composeURI(apiURL, endpoint = undefined, params = undefined) {
    let URL = apiURL

    if (endpoint || params) {
        let uriParams = params

        if (params) {
            let paramsKeys = Object.keys(params)

            // Edits the params key to the a encoded URI component.
            if (paramsKeys.includes("params")) {
                uriParams = { ...params, params: encodeURIComponent(JSON.stringify(params.params)) }
            }

            // Maps this to a useable link
            uriParams = paramsKeys.map(k => `${k}=${uriParams[k]}`).join('&')
        }

        // returns the URL
        URL = (params) ? (apiURL + endpoint + '?' + uriParams) : (apiURL + endpoint)
    }

    return URL

}

// async functions
export async function requestData(URI, funcToExecute) {
    try {
        let response = await fetch(URI)
        let data = await response.json()

        let output = funcToExecute(data)
        return output

    }
    catch (err) {
        throw new Error(err)
    }
}

export async function getRequestFromAIC(year, range) {
    const inParamsArt = {
        fields: "title,image_id,artist_title,date_end,medium_display"
    }

    const inParams = {
        params: getDateseQuery_AIC(year, year + range),
        fields: "api_link",
        limit: 100
    }

    const findArtURI = composeURI("https://api.artic.edu/api/v1/", "artworks/search", inParams);
    let artworkURL

    try {
        // Get the random choice 
        await requestData(findArtURI, res => {
            const pageObj = res.pagination
            const dataObj = res.data

            const randIndex = Math.floor(Math.random() * ((pageObj.total >= 100) ? 99 : pageObj.total))
            artworkURL = dataObj[randIndex].api_link
        })

        // Get the URI information
        const artworkURI = composeURI(artworkURL, '', inParamsArt)
        let out = await requestData(artworkURI, res => {
            return {
                data: res.data,
                url: `https://www.artic.edu/iiif/2/${res.data.image_id}/full/843,/0/default.jpg`
            }
        })

        return out
    }
    catch (err) {
        throw new Error(err)
    }
}