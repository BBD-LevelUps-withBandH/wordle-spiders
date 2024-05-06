const dialogElem = document.getElementById("dialog");
const showBtn = document.querySelector(".show");
const closeBtn = document.querySelector(".close");

showBtn.addEventListener("click", () => {
    dialogElem.showModal();
});

closeBtn.addEventListener("click", () => {
    dialogElem.close();
});