const {
    app,
    BrowserWindow,
    webContents,
    ipcMain,
    dialog,
} = require("electron");
const axios = require("axios");
const { download } = require("electron-dl");
require("dotenv").config();

const API_KEY = process.env.API_KEY;

let link;
let mainWindow;

const downloadOption = {
    directory: app.getPath("downloads"),
    onProgress: (progress) => {
        mainWindow.webContents.send("progress", progress)
    }
};

// Create a new browser window when the app is ready
const application = async () => {
    await app.whenReady();

    mainWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false,
        },
    });

    mainWindow.loadFile("Frondend/index.html");

    mainWindow.webContents.on("did-finish-load", () => {
        mainWindow.webContents.send("change-dir", downloadOption.directory);
    });

    mainWindow.on("close", () => {
        app.quit();
    });
};

ipcMain.on("input-message", async (event, value) => {
    await fetch(value);
});

application();

const fetch = async (url) => {
    console.log("Fetching")
    const options = {
        method: "GET",
        url: "https://youtube-mp36.p.rapidapi.com/dl",
        params: { id: url },
        headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": "youtube-mp36.p.rapidapi.com",
        },
    };
    mainWindow.webContents.send("info", "Fetching...");
    try{

    const response = await axios.request(options);
    mainWindow.webContents.send("info", "Fetched!");

    if (response.data.link) {
        link = response.data.link;
    } else {
        await fetch(url);
        console.log("Trying again");
    }
    }
    catch(error){
        mainWindow.webContents.send("info", `Something went worong!!!`);
        return
    }
    await downloadFunction();
};

const downloadFunction = async () => {
    mainWindow.webContents.send("info", "Downloading...");

    try{
        const dl = await download(mainWindow, link, downloadOption);
        mainWindow.webContents.send("info", `File saved to ${dl.getSavePath()}`);
    }
    catch(error){
        mainWindow.webContents.send("info", 'Download failed!!!');
    }

};

ipcMain.on("open-dir", async (event) => {
    const directory = await dialog.showOpenDialog(mainWindow, {
        properties: ["openDirectory", "createDirectory"],
    });

    if (!directory.canceled) {
        downloadOption.directory = directory.filePaths[0];
    }
    mainWindow.webContents.send("change-dir", downloadOption.directory);
});
