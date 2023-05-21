const electron = require("electron")
const ipc = electron.ipcRenderer

const inputField = document.getElementById("input-field")
const convertBtn = document.getElementById("convert-btn")

const navigation = (page)=>{
    window.location.href = page
}

console.log("js is working")
convertBtn.addEventListener('click', () => {
    if(inputField.value === "") return
    let url = inputField.value
    inputField.value = ""
    console.log("lol")
    ipc.send("input-message", url.split("=").pop())
})





