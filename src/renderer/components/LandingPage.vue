<template>
  <div id="wrapper">
    <el-tabs v-model="activeTab" @tab-click="handleClick">
      <el-tab-pane label="主界面" name="mainPage">
        <main-page></main-page>
      </el-tab-pane>
      <el-tab-pane label="部署记录" name="deployRecordPage">
        <deploy-record-page ref="deployRecordPage"></deploy-record-page>
      </el-tab-pane>
      <el-tab-pane label="新建项目" name="newProjectPage">
        <new-project-page ref="newProjectPage"></new-project-page>
      </el-tab-pane>
      <el-tab-pane label="项目列表" name="projectListPage">
        <project-list-page ref="projectListPage"></project-list-page>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import mainPage from "./MainPage/MainPage.vue";
import deployRecordPage from "./DeployRecordPage/DeployRecordPage.vue";
import newProjectPage from "./NewProjectPage/NewProjectPage.vue";
import projectListPage from "./ProjectListPage/ProjectListPage.vue";
import { remote } from "electron";
import * as DB from "../datastore";
const moment = require("moment");
const { ipcRenderer } = require("electron");
const fs = require("fs");
export default {
  name: "landing-page",
  props: { msg: String },
  components: { mainPage, deployRecordPage, newProjectPage, projectListPage },
  data() {
    return {
      activeTab: "mainPage",
      placeholder: "拖拽文件到此处",
      txt: "",
      destFilepath: "",
      fileList: [],
      successFileList: [],
      showFileList: false,
    };
  },
  mounted() {
    ipcRenderer.on("selectFolder-reply", (event, arg) => {
      console.log(arg);
      this.destFilepath = arg;
    });
    ipcRenderer.on("renameFile-reply", (event, arg) => {
      console.log(arg);
      this.successFileList.push(arg);
    });
    ipcRenderer.on("renameFile-allSucceeded", (event, arg) => {
      var record = {
        tablename: "deploy_record",
        destFilepath: this.destFilepath,
        sourceFilepath: this.fileList[0].path.split(this.fileList[0].name)[0],
        filename: this.fileList,
        date: moment().format("YYYY-MM-DD HH:mm:ss"),
      };
      DB.insertDeployRecord(record);
    });
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab);
      switch (tab.name) {
        case "deployRecordPage":
          this.$refs.deployRecordPage.$emit("reloadData");
          break;
        case "newProjectPage":
          break;
        case "projectListPage":
          this.$refs.projectListPage.$emit("reloadProjectData");
          break;
      }
    },
    insertData() {
      console.log(remote.app.getPath("userData"));
      console.log("insert data");
    },
    stopPropagation() {},
    deleteFile(filename) {
      for (let i = 0; i < this.fileList.length; i++) {
        if (this.fileList[i].name == filename) {
          this.fileList.splice(i, 1);
        }
      }
    },
    showDeleteBtn(id, flag) {
      if (flag) {
        document.getElementById(id).style.display = "inline-block";
      } else {
        document.getElementById(id).style.display = "none";
      }
    },
    dropFile(e) {
      this.fileList = [];
      var files = e.dataTransfer.files;

      for (let file of files) {
        let temp = {
          name: file.name,
          path: file.path,
        };

        this.fileList.push(temp);
        this.showFileList = true;
        this.placeholder = "";
        document.getElementById("dropBox").style.textAlign = "";
        document.getElementById("dropBox").style.lineHeight = "0px";
        console.log(temp);
      }
    },

    renameFile() {
      let data = {};

      if (this.destFilepath == "") {
        alert("Please select a destination");
      } else {
        data = {
          destFilepath: this.destFilepath,
          fileList: this.fileList,
        };
      }

      console.log(data); // prints
      ipcRenderer.send("renameFile", data);
    },
    copyFile() {
      let arg = {
        sourcePath:
          "C:\\Users\\nx017142\\jackson\\project\\example\\electronVueExample\\deploy helper\\test\\test.js",
        destPath:
          "C:\\Users\\nx017142\\jackson\\project\\example\\electronVueExample\\deploy helper\\test1\\test.js",
      };
      ipcRenderer.send("copyFile", arg);
    },
    selectFolder() {
      ipcRenderer.send("selectFolder");
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Noto+Sans+SC");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: Noto Sans SC;
}

#wrapper {
  padding: 60px 80px;
  width: 100vw;
}

#logo {
  height: auto;
  margin-bottom: 20px;
  width: 420px;
}

main {
  display: flex;
  justify-content: space-between;
}

main > div {
  flex-basis: 50%;
}

.left-side {
  display: flex;
  flex-direction: column;
}

.welcome {
  color: #555;
  font-size: 23px;
  margin-bottom: 10px;
}

.title {
  color: #2c3e50;
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 6px;
}

.title.alt {
  font-size: 18px;
  margin-bottom: 10px;
}

.doc p {
  color: black;
  margin-bottom: 10px;
}

.doc button {
  font-size: 0.8em;
  cursor: pointer;
  outline: none;
  padding: 0.75em 2em;
  border-radius: 2em;
  display: inline-block;
  color: #fff;
  background-color: #4fc08d;
  transition: all 0.15s ease;
  box-sizing: border-box;
  border: 1px solid #4fc08d;
}

.doc button.alt {
  color: #42b983;
  background-color: transparent;
}

#dropBox {
  width: 100%;
  min-height: 200px;
  border: 1px solid rgb(220, 223, 230);
  text-align: center;
  line-height: 200px;
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 30px;
  color: rgb(99, 100, 104);
  overflow-y: scroll;
}
#successFileListBox {
  width: 100%;
  min-height: 100px;
  border: 1px solid rgb(220, 223, 230);
  border-radius: 4px;
  padding: 10px;
  margin-bottom: 30px;
  color: rgb(99, 100, 104);
  overflow-y: scroll;
}
.el-icon-delete {
  float: right;
  display: none;
  position: relative;
  bottom: 5px;
}
.el-icon-check {
  float: right;
  position: relative;
  bottom: 5px;
  color: rgb(90, 201, 145);
}
.scrollbar {
  overflow: auto;
  margin: 5px;
  border: none;
}
.scrollbar-1::-webkit-scrollbar {
  width: 10px;
  height: 5px;
}
.scrollbar-1::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  background: #b9b9b9;
}
.scrollbar-1::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  background: #ededed;
}
</style>
