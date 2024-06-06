const { app, BrowserWindow, session } = require('electron')

app.commandLine.appendSwitch('disable-site-isolation-trials')

app.whenReady().then(() => {
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    delete details.requestHeaders['Sec-Fetch-Site']
    delete details.requestHeaders['Sec-Fetch-Dest']
    delete details.requestHeaders['Sec-Fetch-Mode']
    callback({cancel: false, requestHeaders: details.requestHeaders})
  })

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    delete details.responseHeaders['content-security-policy-report-only']
    delete details.responseHeaders['content-security-policy']
    delete details.responseHeaders['x-webkit-csp']
    delete details.responseHeaders['x-content-security-policy']
    delete details.responseHeaders['x-frame-options']
    details.responseHeaders['Access-Control-Allow-Origin'] = '*'
    callback({cancel: false, responseHeaders: details.responseHeaders})
  })

  createWindow()
})

function createWindow () {
  const win = new BrowserWindow({
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    }
  })

  win.loadFile('index.html')
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})