const electron = require("electron")
const ipcRenderer = electron.ipcRenderer

const inputField = document.getElementById("input-field")
const convertBtn = document.getElementById("convert-btn")
const infoText = document.getElementById("info")

const navigation = (page)=>{
    window.location.href = page
}

console.log("js is working")
convertBtn.addEventListener('click', () => {
    if(inputField.value === "") return
    let url = inputField.value
    inputField.value = ""
    console.log("lol")
    ipcRenderer.send("input-message", url.split("=").pop())
})

ipcRenderer.on("info", (event, value) => {
    infoText.innerText = value
})





