import { ipcMain } from "electron";
import fs from "fs";
export default class Server {
  constructor(app, win) {
    this.app = app;
    this.win = win;
  }
  initEventHandler() {
    ipcMain.on("readTxt", (e, params) => {
      // 这里将参数转化为json，然后读取G:\\0.txt的内容一起返回
      const pms = JSON.stringify(params);
      const ret = fs.readFileSync("G:\\0.txt");
      e.sender.send("readTxt", pms + "::::" + ret);
    });
  }
}
