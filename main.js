const { app, BrowserWindow, ipcMain, Menu } = require('electron')
const path = require('node:path')

const createWindow = () => {
    const win = new BrowserWindow({
        webPreferences: {
            preload: path.join(__dirname, './scripts/preload.js')
        },
        autoHideMenuBar: true
    })

    const menuTemplate = [
        {
            label: 'Save',
            submenu: [
                {
                    label: 'Save times',
                    accelerator: 'Control+S',
                    click: () => {
                        win.webContents.send('save-times', false)
                    }
                },
                {
                    label: 'Save times and quit',
                    click: () => {
                        win.webContents.send('save-times', true)
                    }
                }
            ]
        },
        {
            label: 'Reset',
            submenu: [
                {
                    label: 'Game',
                    submenu: [
                        {
                            label: 'Super Mario 64',
                            click: () => {
                                win.webContents.send('reset-time', 0)
                            }
                        },
                        {
                            label: 'Super Mario Sunshine',
                            click: () => {
                                win.webContents.send('reset-time', 1)
                            }
                        },
                        {
                            label: 'Super Mario Galaxy',
                            click: () => {
                                win.webContents.send('reset-time', 2)
                            }
                        },
                        {
                            label: 'Super Mario Galaxy 2',
                            click: () => {
                                win.webContents.send('reset-time', 3)
                            }
                        },
                        {
                            label: 'Super Mario 3D World',
                            click: () => {
                                win.webContents.send('reset-time', 4)
                            }
                        },
                        {
                            label: 'Super Mario Odyssey',
                            click: () => {
                                win.webContents.send('reset-time', 5)
                            }
                        }
                    ]
                },
                {
                    label: 'Reset time played and all games (not total time)',
                    click: () => {
                        win.webContents.send('reset-time', -1)
                    }
                },
                {
                    label: 'Reset ALL times and quit',
                    click: () => {
                        win.webContents.send('reset-times')
                    }
                }
            ]
        },
        {
            label: 'Dev',
            submenu: [
                {
                    label: 'Toggle devtools',
                    click(_item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools();
                    }
                },
                {
                    label: 'Reload app',
                    accelerator: 'Control+R',
                    click(_item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.reload();
                    },
                }
            ]
        }
    ]
    const menu = Menu.buildFromTemplate(menuTemplate)
    Menu.setApplicationMenu(menu)

    win.loadFile('index.html')
}

function handleSetTitle (event, title) {
    const webContents = event.sender
    const win = BrowserWindow.fromWebContents(webContents)
    win.setTitle(title)
}

function handleClose (event) {
    app.quit()
}

app.whenReady().then(() => {
    ipcMain.on('set-title', handleSetTitle)
    ipcMain.on('close-app', handleClose)
    mainWindow = createWindow()
})