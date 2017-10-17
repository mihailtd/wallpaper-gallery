'use strict'
import { app, BrowserWindow } from 'electron'
// import Datastore from 'nedb'
import path from 'path'

// database
// const options = {
//   filename: path.join(__dirname, '/data/database.db').replace(/\\/g, '\\\\'),
//   autoload: true
// }
// let db = new Datastore(options)

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */

global.__static = path.join(__dirname, '/data').replace(/\\/g, '\\\\')
if (process.env.NODE_ENV !== 'development') {
  global.__static = path.join(__dirname, '/data').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    title: 'Wallpaper Gallery',
    height: 800,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      webSecurity: false
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
