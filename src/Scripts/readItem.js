const {BrowserWindow} = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {

    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true,
            nodeIntegration: false
        }
    })
    offscreenWindow.loadURL(url);
    offscreenWindow.webContents.on('did-finish-load', e => {

        // get title
        let title = offscreenWindow.getTitle();
        //  get screen
        offscreenWindow.webContents.capturePage().then(image => {
            let screenShot = image.toDataURL()
            callback({title, screenShot, url})
            // close
            offscreenWindow.close();
            offscreenWindow = null

        })

    })

}
