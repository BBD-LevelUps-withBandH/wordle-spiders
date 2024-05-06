const baseUrl = "http://localhost:5000";
const wordApi = "https://api.dictionaryapi.dev/api/v2/entries/en/"

//gets the word of the day 
export async function getWordOfTheDay() {
    const request = await fetch(`${baseUrl}/getWordsOfTheDay`);

    if(request.status == 401){
        //user is not logged in we redirect them to the login page
        console.log("user is unauthorized!");
    }else{
        const data = await request.json();
        sessionStorage.setItem("word", data);
        console.log(data.word);
        return data[0].word;
    }
}

export async function postScore(score){
    const postData = {
        jwt: sessionStorage.getItem('jwtToken'),
        word_id: sessionStorage.getItem('word'),
        guesses_taken: score
    };

    fetch(`${baseUrl}/postScore`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(response => {
        if (!response.ok) {
            throw new Error('Failed to save score');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score saved:', data);
    })
    .catch(error => {
        console.error('Error saving score:', error);
    })

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

export async function getUsersHighscore(){
    const request = await fetch(`${baseUrl}/highScore/:user_id`);
    const score = await request.json();
    console.log("users highscore is: " + score);
    return score;
}
