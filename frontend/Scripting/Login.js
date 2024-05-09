import { addUser } from './Api.js';

const loginButton = document.getElementById("auth");

let token;

function login() {
    return new Promise((resolve, reject) => {
        console.log("TRYING TO LOGIN!");
        let oauthEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"
    
        let form = document.createElement('form');
        form.setAttribute('method', 'GET')
    
        form.setAttribute('action', oauthEndpoint);
    
        let params = {
            'client_id': '890978323670-1gn2pk7r9dfttucr7f6je4qu39sd9ckb.apps.googleusercontent.com', //google client id 
            'redirect_uri':'https://web.karle.co.za',
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
    
        // Resolve the Promise when login is successful
        resolve();
    });
}

async function handleRedirect() {
    let hash = location.hash.substring(1); // Remove the '#' from the beginning
    let fragmentParams = new URLSearchParams(hash);
    let accessToken = fragmentParams.get('access_token');
    sessionStorage.setItem('accessToken', accessToken);
    
    console.log("temp: " + accessToken);

    if (accessToken) {
        await addUser(accessToken);
    }

    history.replaceState(null, null, window.location.href.split('#')[0]);
}

// Check for access token on page load
window.addEventListener('load', handleRedirect);

async function auth(){
    await login();
}

loginButton.addEventListener("click", function (){
    auth();
});


