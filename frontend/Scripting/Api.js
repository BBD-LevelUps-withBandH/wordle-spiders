const baseUrl = "https://api.karle.co.za";
const wordApi = "https://api.dictionaryapi.dev/api/v2/entries/en/"

//gets the word of the day 
export async function getWordOfTheDay() {
    let token = sessionStorage.getItem('accessToken');

    const request = await fetch(`${baseUrl}/getWordsOfTheDay`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });

    if(request.status == 401){
        //user is not logged in we redirect them to the login page
        console.log("user is unauthorized!");
        return request.status;
    }else{
        const data = await request.json();
        
        
        console.log("WORD ARE: " + data[0].word);
    
        sessionStorage.setItem("word", data[0].word);
        sessionStorage.setItem("word_id", data[0].word_id);
        return data[0].word;
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
            //throw new Error('Unauthorized');
            console.log("user is unauthorized!");
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
        //user is not logged in we redirect them to the login page
        console.log("user is unauthorized!");
        return request.status;
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
        //user is not logged in we redirect them to the login page
        console.log("user is unauthorized!");
        return request.status;
    }else{
        const averageScore = await request.json();
        console.log("users highscore is: " + averageScore);
        return averageScore;
    }
    
}
