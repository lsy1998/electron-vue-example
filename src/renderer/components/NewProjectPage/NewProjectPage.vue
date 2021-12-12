<template>
  <div>
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
      label-width="140px"
      label-position="top"
    >
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName"></el-input>
      </el-form-item>
      <el-form-item>
        <template slot="label">
          路径映射<el-button
            type="primary"
            size="mini"
            style="margin-left: 10px"
            @click="addPathsMapping"
            >New</el-button
          >
        </template>
        <el-form-item
          v-for="paths in form.pathsMapping"
          v-bind:key="paths.id"
          style="margin-top: 10px"
        >
          <el-col :span="9">
            <el-input v-model="paths.sourceFilepath" :ref="paths.id">
              <el-button
                slot="append"
                icon="el-icon-folder-opened"
                @click="selectSourceFilepath(paths.id)"
              ></el-button>
            </el-input>
          </el-col>
          <el-col class="line" :span="2" style="text-align: center"
            ><i class="el-icon-right" style="font-size: 20px"></i
          ></el-col>
          <el-col :span="9">
            <el-input v-model="paths.destFilepath" :ref="paths.id">
              <el-button
                slot="append"
                icon="el-icon-folder-opened"
                @click="selectDestFilepath(paths.id)"
              ></el-button>
            </el-input>
          </el-col>
          <el-col :span="2">
            <el-button
              @click.prevent="removePathsMapping(paths.id)"
              style="margin-left: 15px"
              >删除</el-button
            >
          </el-col>
        </el-form-item>
      </el-form-item>
      <el-form-item label="是否直接写入新文件">
        <el-switch v-model="form.isWriteNewFile"></el-switch>
      </el-form-item>
      <el-form-item label="备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">立即创建</el-button>
        <el-button>取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
const { ipcRenderer } = require("electron");
import * as DB from "../../datastore";
const moment = require("moment");
export default {
  name: "newProjectPage",
  data() {
    return {
      pathsMappingId: 1,
      selectPathType: "",
      selectPathId: 0,
      form: {
        tablename:"projects",
        projectName: "",
        pathsMapping: [
          {
            id: 0,
            sourceFilepath: "",
            destFilepath: "",
            isWriteNewFile: false,
          },
        ],
        isWriteNewFile: false,
        remark: "",
        date: moment().format("YYYY-MM-DD HH:mm:ss")
      },
      rules: {
        projectName: [
          { required: true, message: "请输入项目名称", trigger: "blur" },
        ],
      },
    };
  },
  mounted() {
    ipcRenderer.on("selectFolder-reply", (event, arg) => {
      console.log(this.selectPathType);
      console.log(this.selectPathId);
      console.table(this.form.pathsMapping);
      if (this.selectPathType == "sourceFilepath") {
        let paths = this.form.pathsMapping.find((paths) => {
          return paths.id == this.selectPathId;
        });
        paths.sourceFilepath = arg;
      }
      if (this.selectPathType == "destFilepath") {
        let paths = this.form.pathsMapping.find((paths) => {
          return paths.id == this.selectPathId;
        });
        paths.destFilepath = arg;
      }
      console.log(arg);
    });
  },
  methods: {
    selectSourceFilepath(id) {
      this.selectPathType = "sourceFilepath";
      this.selectPathId = id;
      ipcRenderer.send("selectFolder");
    },
    selectDestFilepath(id) {
      this.selectPathType = "destFilepath";
      this.selectPathId = id;
      ipcRenderer.send("selectFolder");
    },
    removePathsMapping(id) {
      let index = this.form.pathsMapping.findIndex((paths) => {
        return paths.id == id;
      });
      console.log(index);
      this.form.pathsMapping.splice(index, 1);
    },
    onSubmit() {
      let submitFlag = true;
      if (this.form.projectName == "") {
        submitFlag = false;
        this.$notify.error({
          title: "错误",
          message: "项目名称不能为空",
        });
      }
      for (let paths of this.form.pathsMapping) {
        if (paths.sourceFilepath == "" || paths.destFilepath == "") {
          submitFlag = false;
          this.$notify.error({
            title: "错误",
            message: "不能有路径为空",
          });
        }
      }
      if (submitFlag) {
        let result = DB.insertProject(this.form);
        if(result){
           this.$notify({
          title: '成功',
          message: '创建成功',
          type: 'success'
        });
        }
      }
    },
    addPathsMapping() {
      this.pathsMappingId += 1;
      console.log(this.pathsMappingId);
      let paths = {
        id: this.pathsMappingId,
        sourceFilepath: "",
        destFilepath: "",
      };
      console.log(paths);
      this.form.pathsMapping.push(paths);
    },
  },
};
</script>

<style></style>
