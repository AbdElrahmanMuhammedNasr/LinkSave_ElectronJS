const {app, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
const readItem = require('../src/Scripts/readItem')

if (require('electron-squirrel-startup')) {
    app.quit();
}

ipcMain.on('new-item',(e, itemUrl) =>{
    readItem(itemUrl, item =>{
        e.sender.send('new-item-success',item)
    })
})

const createWindow = () => {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 1000,
        minHeight: 800,
        maxWidth:1000,
        maxHeight:800,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(path.join(__dirname, 'index.html'));
    // mainWindow.webContents.openDevTools();
};




app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

