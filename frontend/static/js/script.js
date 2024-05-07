import Dashboard from "./views/Dashboard.js";
import Tests from "./views/Test.js";

// const navigateTo = url => {
//     history.pushState(null, null, url);
//     router();
// };

const router = async () => {
    let view = localStorage.getItem('view');
    if(view == 'Dashboard'){
        view = Dashboard;
    } else {
        view = Tests;
    }


    if(view){
        const test = new view();
        document.querySelector("#app").innerHTML = await test.getHtml();
    } else {
        const dash = new Dashboard();
        document.querySelector("#app").innerHTML = await dash.getHtml();
    }
};

window.addEventListener("popstate", router);

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target.matches("[data-link]")) {
            e.preventDefault();
            if (e.target.matches("[data-dash]")) {
                e.preventDefault();
                localStorage.setItem('view', 'Dashboard');
            }
            if (e.target.matches("[data-tests]")) {
                e.preventDefault();
                localStorage.setItem('view', 'Tests');
            }
        }
        router();
    });

    router();
});