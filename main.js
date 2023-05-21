const { app, BrowserWindow } = require('electron');
const { ipcMain } = require("electron")

// Create a new browser window when the app is ready
const application = async () => {
    await app.whenReady()

    const mainWindow = new BrowserWindow()

    mainWindow.loadFile("Frondend/index.html")

    mainWindow.on("close", () => {
        app.quit()
    })
}

ipcMain.on("input-message", (event, value) => {
    console.log(value)
})

application()

  
