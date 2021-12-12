<template>
  <div>
    <el-row v-for="project in projects" v-bind:key="project._id">
      <el-col :span="24">
        <el-card style="margin: 10px 10px 10px 10px" shadow="always">
          <el-collapse>
            <el-collapse-item>
              <template slot="title" >
                
                  <div style="width:95%;display:inline-block">{{ project.projectName }}</div>
                  <div style="width:5%;display:inline-block" ><em :class="run?pause:play" style="color: green; font-size: 24px" @click.prevent.stop="runProject"></em></div>
                
              </template>
              <div v-for="paths in project.pathsMapping" v-bind:key="paths.id" :name="paths._id" style="height: 30px;width:100%">
                <label style="min-width: 40%;max-width: 40%; display: inline-block; margin-right: 10px" v-ellipsis.middle>{{ paths.sourceFilepath }}</label >
                <em class="el-icon-right" style="color: green; font-size: 20px" ></em>
                <label style="min-width: 40%;max-width: 40%; display: inline-block; margin-right: 10px" v-ellipsis.middle>{{ paths.destFilepath }}</label >
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as DB from "../../datastore";
export default {
  name: "projectListPage",
  data() {
    return {
      pause:'el-icon-video-pause',
      play:'el-icon-video-play',
      run:false,
      projects: [],
    };
  },
  mounted() {
    this.initData();
    this.$nextTick(function () {
      this.$on("reloadProjectData", function () {
        console.log("reload");
        this.initData();
      });
    });
  },
  methods: {
    runProject(){
      this.run=!this.run
    },
    initData() {
      console.log("initData");
      DB.findAllProjects().then((projects) => {
        this.projects = projects;
      });
    },
  },
};
</script>

<style></style>
