<template>
  <div id="wrapper">
    <el-upload
      drag
      action="https://jsonplaceholder.typicode.com/posts/"
      multiple
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text" style="width: 100%">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>

    <el-input
      placeholder="请输入内容"
      v-model="destFilepath"
      class="input-with-select"
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

export default {
  name: "landing-page",
  props: { msg: String },
  data() {
    return {
      txt: "",
      destFilepath: "",
    };
  },
  mounted() {
    document.getElementsByClassName("el-upload")[0].style.width = "100%";
    document.getElementsByClassName("el-upload-dragger")[0].style.width =
      "100%";
    ipcRenderer.on("selectFolder-reply", (event, arg) => {
      console.log(arg);
      this.destFilepath = arg;
    });
  },
  methods: {
    uploadSuccess(file, fileList) {
      console.log(fileList);
      // console.log(file)
    },
    renameFile() {
      alert(111);
      let files = document
        .getElementsByClassName("el-upload-list")[0]
        .getElementsByTagName("a");
      let fileName = [];
      let data = {};
      for (let i = 0; i < files.length; i++) {
        fileName.push(files[i].innerText);
      }
      console.log(fileName);
      if(this.destFilepath==''){
        alert("Please select a destination")
      }else{
        data = {
          "filenames":fileName,
          "destFilepath":this.destFilepath
        }
      }
      // 这里传入两个参数，并将返回结果赋值给txt，在div中显示出来
      // service.readTxt({ p1: "参数1", p2: "参数2" }, (resp) => {
      //   this.txt = resp;
      // });
      // service.test();
      // ipcRenderer.on("asynchronous-reply", (event, arg) => {
      //   console.log(arg); // prints "pong"
      // });
      ipcRenderer.send("renameFile", data);
      // const { shell } = require("electron").remote;
      // shell.showItemInFolder(`C:\\Users\\nx017142\\jackson\\project\\example\\electronVueExample\\my-project\\`)
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
</style>
