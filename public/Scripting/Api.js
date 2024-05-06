const baseUrl = "http://localhost:5000";
const wordApi = "https://api.dictionaryapi.dev/api/v2/entries/en/"

//gets the word of the day 
export async function getWordOfTheDay() {
    const request = await fetch(`${baseUrl}/getWordsOfTheDay`);
    const data = await request.json();
    console.log(data.word);
    return data[0].word;
}


//checks to see if the word exists 
export async function checkWordExistence(word) {
    console.log("WE HIT HERE!");
    const response = await fetch(wordApi + word, {
        method: 'GET'
    });

    let status = response.status;
    console.log("STATUS IS " + status);
    return status;
}

export async function generateJWT(token){

    fetch("http://localhost:5000/generateJWTToken", {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch');
        }
        return response.json();
    })
    .then(data => {
        const jwtToken = data.jwtToken;
        sessionStorage.setItem('jwtToken', jwtToken);
        console.log('JWT Token:', jwtToken);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}
