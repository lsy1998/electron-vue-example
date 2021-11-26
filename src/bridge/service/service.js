import { ipcRenderer } from "electron";
class Service {
  readTxt(params, callback) {
    ipcRenderer.once("readTxt", (e, ret) => callback(ret)); // 将params参数传给Server
    ipcRenderer.send("readTxt", params);
  }
  test(){
      console.log(123)
  }
}
export default new Service();
