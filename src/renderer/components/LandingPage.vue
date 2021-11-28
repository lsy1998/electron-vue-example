<template>
  <div id="wrapper">
    <div
      @drop.prevent="dropFile($event)"
      @dragover.prevent="stopPropagation()"
      id="dropBox"
    >
      {{ placeholder }}
      <el-row :gutter="12" v-show="showFileList">
        <el-col
          v-for="file in fileList"
          :key="file.name"
          :span="8"
          style="margin-bottom: 10px"
          @mouseover.native="showDeleteBtn(file.name, true)"
          @mouseleave.native="showDeleteBtn(file.name, false)"
        >
          <el-card
            :body-style="{ height: '40px', textAlign: 'left' }"
            shadow="always"
          >
            <label
              v-ellipsis.middle
              style="width: 80%; display: inline-block"
              >{{ file.name }}</label
            >
            <em
              
              :id="file.name"
              class="el-icon-delete"
              @click="deleteFile(file.name)"
            ></em>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <el-input
      placeholder="请输入内容"
      v-model="destFilepath"
      class="input-with-select"
      style="margin-bottom: 30px"
    >
      <el-button
        @click="selectFolder"
        slot="append"
        icon="el-icon-folder-opened"
      ></el-button>
    </el-input>
    <el-button @click="renameFile">提交</el-button>
  </div>
</template>

<script>
import service from "../../bridge/service/service";
const { ipcRenderer } = require("electron");
const fs = require("fs");
export default {
  name: "landing-page",
  props: { msg: String },
  data() {
    return {
      placeholder: "拖拽文件到此处",
      txt: "",
      destFilepath: "",
      fileList: [],
      showFileList: false,
    };
  },
  mounted() {
    ipcRenderer.on("selectFolder-reply", (event, arg) => {
      console.log(arg);
      this.destFilepath = arg;
    });
  },
  methods: {
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
      alert(111);

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
          "C:\\Users\\nx017142\\jackson\\project\\example\\electronVueExample\\my-project\\test\\test.js",
        destPath:
          "C:\\Users\\nx017142\\jackson\\project\\example\\electronVueExample\\my-project\\test1\\test.js",
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
@import url("https://fonts.googleapis.com/css?family=Source+Sans+Pro");

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: "Source Sans Pro", sans-serif;
}

#wrapper {
  background: radial-gradient(
    ellipse at top left,
    rgba(255, 255, 255, 1) 40%,
    rgba(229, 229, 229, 0.9) 100%
  );
  height: 100vh;
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
}
.el-icon-delete {
  float: right;
  display: none;
  position: relative;
  bottom: 7px;
}
</style>
