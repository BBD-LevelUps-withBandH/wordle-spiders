const loginButton = document.getElementById("auth");
const otkenButton = document.getElementById("token");
const getButton = document.getElementById("get");

let token;

function login(){
    console.log("TRYING TO LOGIN!");
    let oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

    let form = document.createElement('form');
    form.setAttribute('method', 'GET')

    form.setAttribute('action', oauthEndpoint);

    let params = {
        'client_id': '890978323670-1gn2pk7r9dfttucr7f6je4qu39sd9ckb.apps.googleusercontent.com',
        'redirect_uri':'http://localhost:3000',
        'response_type':'token',
        'scope':'https://www.googleapis.com/auth/userinfo.profile',
        'include_granted_scopes': 'true',
        'state': 'pass-through-value'
    }

    for(let p in params){
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]); // Corrected line
        form.appendChild(input);
    }

    document.body.appendChild(form);

    form.submit();
}

function handleRedirect() {
    let hash = location.hash.substring(1); // Remove the '#' from the beginning
    let fragmentParams = new URLSearchParams(hash);
    console.log("hello");
    let accessToken = fragmentParams.get('access_token');
    console.log("temp: " + accessToken);
    let email;

    // Fetch user info using the access token
    fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken)
        .then(response => response.json())
        .then(data => {
            email = data.email;
            token = accessToken;
            console.log('Access Token:', accessToken);
            console.log('Email:', email);
            // Use the access token and email as needed
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getSomething(){

    fetch('http://localhost:3000/protected-route', {
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
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}


let tokenPromise;

function handleRedirect() {
    // Your existing code to retrieve the token
    let hash = location.hash.substring(1); // Remove the '#' from the beginning
    let fragmentParams = new URLSearchParams(hash);
    let accessToken = fragmentParams.get('access_token');
    let email;

    tokenPromise = fetch('https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=' + accessToken)
        .then(response => response.json())
        .then(data => {
            email = data.email;
            token = accessToken;
            console.log('Access Token:', accessToken);
            console.log('Email:', email);
            return token; // Return the token to resolve the promise
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getSomething(){
    
    tokenPromise.then(accessToken => {
        console.log("accessToken: "+accessToken);
        console.log("token"+ token);
        fetch('http://localhost:3000/protected-route', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch');
            }
            return response.json();
        })
        .then(data => {
            console.log("data: "+data);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
}



loginButton.addEventListener("click", function (){
    console.log("hellpppppp!");
    login();
});

otkenButton.addEventListener("click", function(){
    console.log("YOOOO");
    handleRedirect();
})

getButton.addEventListener("click", function(){
    console.log("we are trying to get something");
    getSomething();
})
