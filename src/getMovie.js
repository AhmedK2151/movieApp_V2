var resultsArray = []
const frontPageArray = []
const slideShowArray = []

async function getMovie(name) {
    if (name.length === 0 ) {
        return false
    } else {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=faac618f8b55fe67036720b29d0f430d&query=${name}`)
        const data = await response.json()
        //console.log(JSON.stringify(data, null, 4))
        var providerObject;
    
        if(data.total_results === 0) {  //making sure that the name is valid

            return false
            
        } else {
            //console.log("This is the data: " + JSON.stringify(data, null, 5))
            const movieData = data.results
            for(let i = 0; i < movieData.length; i++) {   //getting the movie info
                const individualMovie = {"image": movieData[i].poster_path ,"title" : movieData[i].title, "movie_id": movieData[i].id, "overview": movieData[i].overview, "rating": movieData[i].vote_average, "release_date": movieData[i].release_date, "providers": []}
                //console.log(individualMovie)

                const getMovie_id = movieData[i].id
                const response2 = await fetch(`https://api.themoviedb.org/3/movie/${getMovie_id}/watch/providers?api_key=faac618f8b55fe67036720b29d0f430d`)
                const data2 = await response2.json()
                const ssP = data2.results.GB //ssp = streaming service providers
                if(ssP !== undefined) {
                    console.log(JSON.stringify(ssP, null, 4))
                    individualMovie['links'] = ssP.link

                    console.log(`This is the ssP flatrate ${JSON.stringify(ssP.flatrate, null, 4)}`)
                    if (ssP.flatrate !== undefined){
                        const streaming = ssP.flatrate
                        for(let k = 0; k < streaming.length; k++) { //going through the providers array
                            for(let n in streaming[k]) { //going through each object in the provider's array so that the correct details can be extracted
                                console.log(JSON.stringify(streaming[k], null, 4))
                                providerObject = {"providerName": streaming[k].provider_name, "providerLogo": streaming[k].logo_path }
                                //console.log(JSON.stringify(providerObject,null,4))
                            }
                            individualMovie.providers.push(providerObject) //adds the providers' details into the nested array 
                        } 
                    } else {
                        providerObject = null
                    }
                } else {
                    individualMovie['links'] = []
                }
                //console.log(`Individual movie: ${JSON.stringify(individualMovie,null,4)}`)
                resultsArray.push(individualMovie)   //adds a new movie object into the movie array
            }

            //console.log(`Here is the results array: ${JSON.stringify(resultsArray, null, 4)}`)
            return(resultsArray);
            
        } 
    }
}

function traversal(dataset) { //for loop function to save on time
    const dataToTraverse = dataset.results
    for(let i = 0; i < dataToTraverse.length; i++) {
        const frontMovieData = {"image": dataToTraverse[i].poster_path ,"title" : dataToTraverse[i].title, "movie_id": dataToTraverse[i].id, "overview": dataToTraverse[i].overview, "rating": dataToTraverse[i].vote_average, "release_date": dataToTraverse[i].release_date}
        frontPageArray.push(frontMovieData)
    }
}

async function frontPageMovies(filterType) {
    switch(filterType) {
        case "top rated":
            let response4 =  await fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=faac618f8b55fe67036720b29d0f430d&language=en-US&page=1")
            let data4 = await response4.json()
            traversal(data4)
            return data4;
        case "popular":
            let response5 =  await fetch("https://api.themoviedb.org/3/movie/popular?api_key=faac618f8b55fe67036720b29d0f430d&language=en-US&page=1")
            let data5 = await response5.json()
            traversal(data5)
            return data5;
        case "upcoming":
            let response6 =  await fetch("https://api.themoviedb.org/3/movie/upcoming?api_key=faac618f8b55fe67036720b29d0f430d&language=en-US&page=1")
            let data6 = await response6.json()
            traversal(data6)
            return data6;
    }
}

// fucntion to fill the slideshow array with info
async function slideShowDataFunction(numberOfSlides) {
    let response = await fetch("https://api.themoviedb.org/3/movie/popular?api_key=faac618f8b55fe67036720b29d0f430d&language=en-US&page=1")
    let data = await response.json()
    var pop_shows = data.results
    for(let i = 0; i < numberOfSlides; i++) {
        const slideShowData = {"image": pop_shows[i].poster_path ,"title" : pop_shows[i].title, "movie_id": pop_shows[i].id, "overview": pop_shows[i].overview, "rating": pop_shows[i].vote_average, "release_date": pop_shows[i].release_date}
        slideShowArray.push(slideShowData)
    }
}

// the following 3 async functions actually return the relevant arrays

async function outputFrontPage(filterName) { //front page movies displayed by default
    if(filterName === undefined) {
        filterName = "popular"
    }
    const output2 = await frontPageMovies(filterName)
    console.log(`This is the front page movies array: ${JSON.stringify(frontPageArray,null,6)}`)
    return output2;
}

async function outputMovie(movieName) {
    console.log(movieName)
        await resetResults();
        const output1 = await getMovie(movieName)
        if( getMovie !== false) {
        //console.log(`This is the search output: ${JSON.stringify(output1, null, 4)}`)
            iterate(output1)
        } else {
            return("Failed")
        }

}

function iterate(input) {
    for(let i = 0; i < input.length; i++) {
        createCard(input[i].title, input[i].overview, input[i].image, input[i].rating,input[i].release_date, input[i].providers, input[i].links)
    }
}

async function outputSlideShow(num) {
    const output3 = await slideShowDataFunction(num)
    console.log(`This array contains the information for the slideshow: ${JSON.stringify(slideShowArray, null, 4)}`)
    return output3;
}


//outputMovie("jack") //has no default
//outputFrontPage() //By default will shows a page of popular movies
//outputSlideShow(4) // has no defualt must be set manually

const movieCard = document.querySelector(".movieContainer")

function createCard(title, description, image, rating, releaseDate, streamingServices, link ) {

    const eventDiv = document.createElement('div')
    eventDiv.classList.add("eventCardContainer")
    
    const eventName = document.createElement("h2")
    eventName.setAttribute("id", title )
    eventName.classList.add("eventName")
    eventName.innerText = title

    const eventImg = document.createElement("img")
    eventImg.classList.add("eventImg")
    if( image == null ) {
        eventImg.src = "../assets/no_image_available.png"
    } else {
        eventImg.src = `https://image.tmdb.org/t/p/original/${image}`
    }

    const eventDesc = document.createElement("p")
    eventDesc.classList.add("eventDesc")
    eventDesc.innerText = `Description: ${description}`

    const eventDate = document.createElement("p")
    eventDate.classList.add("eventReleaseDate")
    eventDate.innerText = `Date: ${releaseDate}`

    const eventRating = document.createElement("p")
    eventRating.classList.add("eventRating")
    eventRating.innerText = `Rating: ${rating} stars`

    const eventSS = document.createElement("div")
    eventSS.classList.add(`eventSS`)
    console.log(JSON.stringify(streamingServices, null, 4))
    if (streamingServices.length > 0) {
        //eventSS.innerText = `${streamingServices}`
        for (let i = 0; i < streamingServices.length; i++){
            var anotherProvider = document.createElement("div")
            anotherProvider.classList.add("providerList")

            var providerImg = document.createElement("img")
            providerImg.classList.add("providerImg")
            providerImg.src = `https://image.tmdb.org/t/p/original/${streamingServices[i].providerLogo}`

            eventSS.appendChild(anotherProvider)
            anotherProvider.appendChild(providerImg)
        }
    } else {
        eventSS.innerText = "This Movie is Not Available for Streaming in the UK"
    }

    const eventLinks = document.createElement("a")
    eventLinks.classList.add(`eventLinks`)
    console.log("this is a link check " + link)
    if (link.length > 0){
        eventLinks.href = link
        eventLinks.innerHTML = "Where to Watch"
    } else {
        eventLinks.innerHTML = "Not available to watch"
    }

    //appending everything together
    movieCard.appendChild(eventDiv)
    eventDiv.appendChild(eventImg)
    eventDiv.appendChild(eventName)
    eventDiv.appendChild(eventRating)
    eventDiv.appendChild(eventSS)
    eventDiv.appendChild(eventLinks)
}

const searchButton = document.querySelector('.searchButton')
searchButton.addEventListener('click', () =>{
    const input1 = document.querySelector('input').value
    outputMovie(input1)
})

const searchBox = document.querySelector('input')
searchBox.addEventListener('keypress', function (e) {
    if(e.key === "Enter"){
        const input1 = document.querySelector('input').value
        outputMovie(input1)
    }
})

async function resetResults() {
    var elementsForDeletion = document.querySelectorAll('.eventCardContainer')
    resultsArray = []
    if(elementsForDeletion.length > 0) {
        elementsForDeletion.forEach(e => e.remove())
    }
    resultsArray = []
}

const resetButton = document.querySelector('.resetButton')
resetButton.addEventListener('click', () => {
    resetResults();
})



//.....................//
// for(let j in ssP) { //getting the steaming service providers
                //     if( j == "link") { //checking if there is a link to a site that can redirect to the streaming service providers
                //         const movieLink = ssP[j]
                //         individualMovie['links'] = movieLink 
                //     } else if( j == "flatrate") {
                //         //console.log(`This is the ssP[j] ${JSON.stringify(ssP[j], null, 4)}`)
                //         const streaming = ssP[j]
                //         for(let k = 0; k < streaming.length; k++) { //going through the providers array
                //             for(let n in streaming[k]) { //going through each object in the provider's array so that the correct details can be extracted
                //                 //console.log(streaming[k])
                //                 providerObject = {"providerName": streaming[k].provider_name, "providerLogo": streaming[k].logo_path }
                //                 //console.log(JSON.stringify(providerObject,null,4))
                //             }
                //             individualMovie.providers.push(providerObject) //adds the providers' details into the nested array 
                //         } 
                //     } 
                // }

