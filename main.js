const { app, BrowserWindow, webContents, ipcMain, dialog } = require('electron');
const axios = require("axios")
const { download } = require("electron-dl")
let link
let mainWindow

const downloadOption = {
    directory: app.getPath("downloads")
}

// Create a new browser window when the app is ready
const application = async () => {
    await app.whenReady()

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        }
    })

    mainWindow.loadFile("Frondend/index.html")

    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("change-dir", downloadOption.directory)
    })

    mainWindow.on("close", ()=> {
        app.quit()
    })
}

ipcMain.on("input-message", async (event, value) => {
    await fetch(value)
    await downloadFunction()
})

application()


const fetch = async (url) => {
    const options = {
        method: 'GET',
        url: 'https://youtube-mp36.p.rapidapi.com/dl',
        params: {id: url},
        headers: {
          'X-RapidAPI-Key': '7f8341c9b1msh9f97ae4050c29fep1d2f9djsnf6a27066176b',
          'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };
    mainWindow.webContents.send("info", "Fetching...")
    const response = await axios.request(options)
    mainWindow.webContents.send("info", "Fetched!")

    if(response.data.link){
        link = response.data.link
        console.log(link)
    }
    else{
        fetch(url)
        console.log("Trying again")
    }
}

const downloadFunction = async () => {
    mainWindow.webContents.send("info", "Downloading...")
    const dl = await download(mainWindow, link, downloadOption)

    mainWindow.webContents.send("info", `File saved to ${dl.getSavePath()}`)
}


ipcMain.on("open-dir", async (event) => {
    const directory = await dialog.showOpenDialog(mainWindow, {
        properties: ['openDirectory', 'createDirectory']
    })

    if(!directory.canceled){
        downloadOption.directory = directory.filePaths[0]
    }
    mainWindow.webContents.send("change-dir", downloadOption.directory)
})



  
