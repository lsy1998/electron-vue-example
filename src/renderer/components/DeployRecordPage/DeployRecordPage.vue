<template>
  <div>
    <el-collapse accordion>
      <el-collapse-item
        v-for="deployRecord in deployRecords"
        v-bind:key="deployRecord._id"
        :name="deployRecord._id"
      >
        <template slot="title">
          <label style="max-width:40%;display: inline-block;margin-right:10px;" v-ellipsis.middle >{{
            deployRecord.sourceFilepath
          }}</label>
          <i class="el-icon-right" style="color:green;font-weight: bold;font-size:20px;"></i>
          <label style="max-width:40%;display: inline-block;margin-left:10px;" v-ellipsis.middle >{{
            deployRecord.destFilepath
          }}</label>
        </template>
        <div v-for="file in deployRecord.filename" v-bind:key="file.name" style="height:30px">
         <label class="el-icon-news" style="color:green;font-weight: bold;margin-right:10px"></label> {{ file.name }}
         <label style="float:right;position:relative;right:20px">{{deployRecord.date}}</label>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import * as DB from "../../datastore";
export default {
  name: "deployRecordPage",
  data() {
    return {
      activeName: "1",
      deployRecords: [],
    };
  },
  mounted() {
    this.initData();
    this.$nextTick(function() {
        
            this.$on('reloadData', function() {
                console.log("reload")
                this.initData();
            });
        });

  },
  methods: {
    initData() {
      console.log("initData");
      DB.findDeployRecord().then((records) => {
        this.deployRecords = records;
      });
      console.log(this.deployRecords);
    },
  },
};
</script>

<style></style>
