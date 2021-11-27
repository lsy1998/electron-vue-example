import { app, BrowserWindow, dialog } from "electron";
import "../renderer/store";
const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
var filePath = path.resolve("../");
//调用文件遍历方法

//文件遍历方法
function fileDisplay(sourceFile, filePath) {
  //根据文件路径读取文件，返回文件列表
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      //遍历读取到的文件列表
      files.forEach(function (filename) {
        //获取当前文件的绝对路径
        var filedir = path.join(filePath, filename);
        //根据文件路径获取文件信息，返回一个fs.Stats对象
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile(); 

            if (isFile) {

              console.log(filename);
              if (filename == sourceFile.name) {
                let date = moment().format("YYYY-MM-DD_HH-mm-ss");
                let newPath = path.join(filePath, filename.replace(path.extname(filename),"")+"_"+date+path.extname(filename));
                fs.rename(filedir, newPath, (err) => {
                  // 重命名文件名称
                  if (!err) {
                    console.log(filename + "改名成功");
                    fs.copyFile(sourceFile.path, path.join(filePath,sourceFile.name), (err) => {
                      if (err) {
                        console.log(err);
                      } else {
                        console.log("copy file succeed");
                      }
                    });
                  }
                });
              }

            }

          }
        });
      });
    }
  });
}

ipcMain.on("renameFile", (event, data) => {
  console.log("a");
  for (let i=0;i<data.fileList.length;i++) {
    console.log(data.fileList[i]);
    fileDisplay(data.fileList[i], data.destFilepath);
  }
  // event.sender.send("asynchronous-reply", "pong");
});

// ipcMain.on("renameFile", (event, arg) => {
//   fileDisplay("../../");
//   console.log("b");
//   event.returnValue = "pong";
// });

ipcMain.on("copyFile", (event, arg) => {
  console.log("c");
  console.log(arg.sourcePath);
  console.log(arg.destPath);
  fs.copyFile(arg.sourcePath, arg.destPath, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("copy file succeed");
    }
  });
});

ipcMain.on("selectFolder", (event, arg) => {
  dialog.showOpenDialog(
    mainWindow,
    {
      properties: ["openDirectory"],
    },
    (result) => {
      console.log(result);
      console.log(result[0]);
      event.sender.send("selectFolder-reply", result[0]);
    }
  );
});
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow;
const winURL =
  process.env.NODE_ENV === "development"
    ? `http://localhost:9080`
    : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
