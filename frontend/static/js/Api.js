const baseUrl = "https://api.karle.co.za";
const wordApi = "https://api.dictionaryapi.dev/api/v2/entries/en/"


function redirectToLogin(){
    let state = JSON.parse(sessionStorage.getItem('state'));
    state.page = 'LOGIN';
    sessionStorage.setItem('state', state);
    location.reload();
}

//gets the word of the day 
export async function getWordOfTheDay() {
    let token = sessionStorage.getItem('accessToken');
    console.log(token);

    const request = await fetch(`${baseUrl}/getWordsOfTheDay`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(request.status == 401){
        redirectToLogin();
    }else{
        const data = await request.json();
        
        // let index = Math.floor(Math.random() * (max + 1));

        let index = Math.floor(Math.random() * data.length);
        console.log("Words", data);
        console.log("Len", data.length);
        console.log("Index", index)

        console.log("WORD ARE: " + data[index].word);
    
        sessionStorage.setItem("word", data[index].word);
        sessionStorage.setItem("word_id", data[index].word_id);
        return data[index].word;
    }
}

export async function postScore(score){
    let token = sessionStorage.getItem('accessToken');
    let word = sessionStorage.getItem('word');

    const postData = {
        word: word,
        guesses_taken: score
    };

    fetch(`${baseUrl}/postScore`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    }).then(response => {
        if (response.status === 401) {
            redirectToLogin();
        }

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

export async function addUser(token){

    fetch(`${baseUrl}/addUser`, {
        method: 'POST',
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
        const email = data;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

export async function getUsersHighscore(){
    let token = sessionStorage.getItem('accessToken');
    const request = await fetch(`${baseUrl}/highScore/:user_id`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    if(request.status == 401){
        redirectToLogin();
    }else{
        const score = await request.json();
        console.log("users highscore is: " + score);
        return score;
    }
    
}

export async function getAverageScore() {
    let word = sessionStorage.getItem('word');
    let token = sessionStorage.getItem('accessToken');

    const request = await fetch(`${baseUrl}/getAverageScore?word=${word}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
   

    if(request.status == 401){
        redirectToLogin();
    }else{
        const averageScore = await request.json();
        console.log("users highscore is: " + averageScore);
        return averageScore;
    }
    
}