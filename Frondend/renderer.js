const electron = require("electron");
const ipcRenderer = electron.ipcRenderer;

const inputField = document.getElementById("input-field");
const convertBtn = document.getElementById("convert-btn");
const infoText = document.getElementById("info");
const dir = document.getElementById("dir");
const dirChangeBtn = document.getElementById("dir-change");
const percentage = document.getElementById("percentage");

let progressValue;

ipcRenderer.on("change-dir", (event, path) => {
    console.log("called change-dir");
    dir.innerText = path;
});

const navigation = (page) => {
    window.location.href = page;
};

console.log("js is working");
convertBtn.addEventListener("click", () => {
    if (inputField.value === "") return;
    percentage.innerText = ""
    let url = inputField.value;
    inputField.value = "";
    console.log("lol");
    ipcRenderer.send("input-message", url.split("=").pop());
});

ipcRenderer.on("info", (event, value) => {
    infoText.innerText = value;
});

dirChangeBtn.addEventListener("click", () => {
    ipcRenderer.send("open-dir");
});

ipcRenderer.on("progress", (event, progress) => {
    progressValue = (progress.percent * 100).toFixed(2);
    percentage.innerText = `${progressValue}%`;
});
