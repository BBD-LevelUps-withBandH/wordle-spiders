const baseUrl = "https://api.karle.co.za";
const wordApi = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function redirectToLogin() {
  let state = JSON.parse(sessionStorage.getItem("state"));
  state.page = "LOGIN";
  sessionStorage.setItem("state", state);
  location.reload();
}

//gets the word of the day
export async function getWordOfTheDay() {
  let token = sessionStorage.getItem("Token");

  const request = await fetch(`${baseUrl}/getWordsOfTheDay`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });


  if (request.status == 401) {
    redirectToLogin();
  } else {
    const data = await request.json();

    let index = Math.floor(Math.random() * data.length);

    console.log("WORD IS: " + data[index].word);

    sessionStorage.setItem("word", data[index].word);
    sessionStorage.setItem("word_id", data[index].word_id);
    return data[index].word;
  }
}

export async function postScore(score) {
  let token = sessionStorage.getItem("Token");
  let word = sessionStorage.getItem("word");

  const postData = {
    word: word,
    guesses_taken: score,
  };

  fetch(`${baseUrl}/postScore`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      if (response.status === 401) {
        redirectToLogin();
      }

      if (response.status === 400) {
        Console.log("You play too much wordle!")
      }
    })
    .then((data) => {
      if (data.response == "Success") return;
    })
    .catch((error) => {
    });
}

//checks to see if the word exists
export async function checkWordExistence(word) {
  try {
    const response = await fetch(wordApi + word, {
      method: "GET",
    });

    let status = response.status;
    return status;
  }
  catch (err) {
    console.log("Word check API down")
    return 200;
  }
}

export async function addUser(token) {
  fetch(`${baseUrl}/addUser`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      const email = data;
    })
    .catch((error) => {
    });
}

export async function getUsersHighscore() {
  let token = sessionStorage.getItem("Token");
  const request = await fetch(`${baseUrl}/highScore/:user_id`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (request.status == 401) {
    redirectToLogin();
  } else {
    const score = await request.json();
    return score;
  }
}

export async function getAverageScore() {
  let word = sessionStorage.getItem("word");
  let token = sessionStorage.getItem("Token");

  const request = await fetch(`${baseUrl}/getAverageScore?word=${word}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (request.status == 401) {
    redirectToLogin();
  } else {
    const averageScore = await request.json();
    return averageScore;
  }
}
