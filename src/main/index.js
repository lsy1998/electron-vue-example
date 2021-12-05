import { app, BrowserWindow, dialog } from "electron";
import "../renderer/store";
const { ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");
const moment = require("moment");
var filePath = path.resolve("../");

//文件遍历方法
function fileDisplay(sourceFile, filePath) {
  let errorFlag = false;
  fs.readdir(filePath, function (err, files) {
    if (err) {
      console.warn(err);
    } else {
      files.forEach(function (filename) {
        var filedir = path.join(filePath, filename);
        fs.stat(filedir, function (eror, stats) {
          if (eror) {
            console.warn("获取文件stats失败");
          } else {
            var isFile = stats.isFile();
            if (isFile) {
              console.log(filename);
              if (filename == sourceFile.name) {
                let date = moment().format("YYYY-MM-DD_HH-mm-ss");
                let newPath = path.join(
                  filePath,
                  filename.replace(path.extname(filename), "") +
                    "_" +
                    date +
                    path.extname(filename)
                );
                fs.rename(filedir, newPath, (err) => {
                  if (!err) {
                    console.log(filename + "改名成功");
                    fs.copyFile(
                      sourceFile.path,
                      path.join(filePath, sourceFile.name),
                      (err) => {
                        if (err) {
                          console.error(err);
                          errorFlag = true;
                          dialog.showMessageBox(mainWindow, {
                            message: "出错啦！" + err,
                            type: "error",
                            title: "错误信息",
                          });
                        }
                      }
                    );
                  } else {
                    errorFlag = true;
                    dialog.showMessageBox(mainWindow, {
                      message: err,
                      type: "error",
                      title: "错误信息",
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
  
  return errorFlag;
}

ipcMain.on("renameFile", (event, data) => {
  let error = false;
  for (let i = 0; i < data.fileList.length; i++) {
    console.log(data.fileList[i]);
    if (fileDisplay(data.fileList[i], data.destFilepath) == true) {
      error = true;
    }else{
      event.sender.send("renameFile-reply", data.fileList[i]);
    }
  }
  if(!error){
    dialog.showMessageBox(mainWindow, {
      message: "处理成功",
      type: "info",
      title: "提示信息",
    });
    event.sender.send("renameFile-allSucceeded", data.fileList);
  }
});

ipcMain.on("copyFile", (event, arg) => {
  console.log(arg.sourcePath);
  console.log(arg.destPath);
  fs.copyFile(arg.sourcePath, arg.destPath, (err) => {
    if (err) {
      console.error(err);
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
      console.log(result[0]);
      event.sender.send("selectFolder-reply", result[0]);
    }
  );
});

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
  mainWindow = new BrowserWindow({
    height: 600,
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
