<template>
    <div>
      <div class="content">

        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">任务信息总览</div>
          <!-- {{ ipVideoFlowInfo }} -->
          <el-table :data="ipVideoFlowInfo" style="width: 100%">
              <el-table-column label="节点" width="200">
              <template #default="scope">
                  <div style="display: flex; align-items: center">
                  <!-- <el-icon><timer /></el-icon> -->
                  <span style="margin-left: 10px">{{ scope.row.selectedIp }}</span>
                  </div>
              </template>
              </el-table-column>
              <el-table-column label="摄像头" width="200">
              <template #default="scope">
                  <div>{{ scope.row.selectedVideoId }}</div>
              </template>
              </el-table-column>
              <el-table-column label="流水线" width="200">
              <template #default="scope">
                  <div>{{ scope.row.selectedFlow }}</div>
              </template>
              </el-table-column>
              <el-table-column label="调度器" width="200">
              <template #default="scope">
                  <div>{{ scope.row.selectedScheduler }}</div>
              </template>
              </el-table-column>
              
          </el-table>

        </el-card>


        <!-- 选择视频流 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">选择视频流</div>
            <el-carousel :autoplay="false" arrow="always" trigger="click">
              <el-carousel-item v-for="(node_info, node_id, index) in node_video_info" :key="index">
                <div class="carousel-item-content">
                  <div class="horizontal-scroll-container">
                    <div v-for="(video_info, video_id) in node_info['videos']" class="available-node"
                    v-on:click="selectNodeVideo(node_id, video_id, node_id + '-' + video_id)"
                    v-bind:class="{ 'selected': selected_box_id === node_id + '-' + video_id }"
                    >
                      <div class="centered-item">
                        <ul style="list-style-type: none;"
                        >
                          <li class="subli">节点: {{ node_id }}（{{ node_info['ip'] }}）</li>
                          <li class="subli">摄像头: {{ video_id }}</li>
                          <li class="subli">描述: {{ video_info['description'] }}</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </el-carousel-item>
            </el-carousel>
          
        </el-card>

        <!-- 选择任务流水 -->
        <el-card shadow="hover" style="margin: 20px;">
          <div slot="header" style="font-size: 20px;font-weight: bold;">选择任务流水</div>
          <el-row>

            <el-col :span="6">
              <table style="margin-top: 30px;">
                <tr>
                  <td><span class="param">选择流水线</span></td>
                  <td>
                    <div class="custom-select" style="margin-left: 50px;">
                    <select v-model="selected_dag_id">
                      <option value="" disabled selected>选择流水线</option>
                      <option 
                        v-for="(dag_info, dag_id, index) in dag_dict"
                        :key="dag_id"
                        :value="dag_id">
                        {{ dag_info['name'] }}
                      </option>
                    </select>                    
                    <span class="custom-arrow">&#9662;</span>
                  </div>
                  </td>
                </tr>
              </table>
            </el-col>

            <el-col :span="6">
              <div style="flex: 1;margin-top: 30px;">

                <table style="margin-top: 30px;">
                  <tr>
                    <td><span class="param">选择调度器</span></td>
                    <td>
                      <div class="custom-select" style="margin-left: 50px;">
                      <select v-model="selected_scheduler_id">
                        <option value="" disabled selected>选择调度器</option>
                        <option 
                          v-for="(scheduler_info, scheduler_id, index) in scheduler_dict"
                          :key="scheduler_id"
                          :value="scheduler_id">
                          {{ scheduler_info['description'] }}
                        </option>
                      </select>                    
                      <span class="custom-arrow">&#9662;</span>
                    </div>
                    </td>
                  </tr>
                </table>
              </div>
            </el-col>

            <el-col :span="6">
              <div style="flex: 1;margin-top: 30px;">
                <div>
                  <span class="param" style="margin-right: 20px;">时延约束(s)</span>
                  <el-input v-model="delay_constraint" placeholder="输入时延约束" style="width: 100%; max-width: 200px;margin-left: 63px;" />
                </div>
                <!-- <div style="margin-top: 10px;">
                  <span class="param" style="margin-right: 20px;">精度约束(F1 Score)</span>
                  <el-input v-model="acc_constraint" placeholder="输入精度约束" style="width: 100%; max-width: 200px;" />
                </div> -->
              </div>
            </el-col>
          </el-row>
          
          <!-- 提交任务 -->
        <div style="display: flex; justify-content: center;margin-top: 20px;">
          <el-button type="primary" plain @click="submitText">提交任务</el-button>
        </div>



        </el-card>
      </div>
    </div>
  </template>
  
<script> 
import { ElMessage } from "element-plus";
import * as common from "../common.js";
export default {
data() {
    return {
        activeStep: 0, // 当前激活的步骤索引
        selectedMode: "时延优先", // 时延优先vs精度优先
        options:[
            {
                value:'latency',
                label:'时延优先',
            },
            {
                value:'accuracy',
                label:'精度优先',
            }
        ],
        delay_constraint: 0.2,
        acc_constraint: null,

        // 任务相关
        inputText: null,
        submit_jobs: [],
        job_info_dict:{},

        // 视频流
        node_video_info: common.STATIC_NODE_VIDEO_INFO,
        selected_box_id: null,
        selected_node_id: null,
        selected_video_id: null,

        // 分页控件
        itemsPerPage: 3, // 每页显示的数量
        currentPage: 1, // 当前页数

        // 流水线
        dag_dict: common.STATIC_DAG_DICT,
        selected_dag_id: null,

        // 调度器
        scheduler_dict: common.STATIC_SCHEDULER_DICT,
        selected_scheduler_id: null,

        // 每个摄像头的套餐配置情况
        ipVideoFlowInfo: [],

        timer: null

    };
},
    methods: {
        // 出错处理
        errHandler(err) {
          console.error(err);
          sessionStorage.clear();
          // 清空已有任务
          this.submit_jobs = [];
          // 更新sessionStorage
          sessionStorage.setItem("submit_jobs", JSON.stringify(this.submit_jobs));
          // ?
          // sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
          // sessionStorage.setItem("accCons", JSON.stringify(this.accCons));
        },

        // 获取视频流信息
        getNodeVideoInfo() {
          fetch("/dag/get_node_video")
            .then((response) => response.json())
            .then((data) => {
              console.log(data);
              this.node_video_info = data;
            })
            .catch((error) => {
              this.errHandler(error);
            });
        },

        // 获取合法DAG
        getValidDAG() {
          fetch('/dag/get_valid_dag')
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.dag_dict = data;
          })
          .catch(error =>{
            this.errHandler(err);
          });
        },

        // 获取合法调度器
        getValidScheduler() {
          fetch('/dag/get_scheduler')
          .then(response => response.json())
          .then(data => {
            console.log(data);
            this.scheduler_dict = data;
          })
          .catch(error =>{
            this.errHandler(err);
          });
        },

        // 选择视频流
        selectNodeVideo(node_id, video_id, box_id) {
          console.log("[selectNodeVideo] node_id=%s, video_id=%s, box_id=%s", node_id, video_id, box_id);

          this.selected_box_id = box_id;
          this.selected_node_id = node_id;
          this.selected_video_id = video_id;
        },

        // 提交任务
        submitText() {
          this.inputText = {
            node_id: this.selected_node_id,
            video_id: this.selected_video_id,
            dag: this.dag_dict[this.selected_dag_id]['dag'],
            user_constraint: {
              delay: parseFloat(this.delay_constraint),
              accuracy: parseFloat(this.acc_constraint),
            },
            scheduler_id: this.selected_scheduler_id
          };
          console.log(this.inputText);
          // console.log(this.selectedFlow['dag']);

          // let text = this.inputText.replace(/[\r\n\s]/g, ""); // remove all newlines and spaces
          let text = JSON.stringify(this.inputText);

          // console.log(JSON.stringify(text))
          console.log(text);

          // // 静态填充：模拟提交成功后的信息显示
          // const query_info = {
          //   selectedIp: this.selected_node_id, // 节点
          //   selectedVideoId: this.selected_video_id, // 摄像头
          //   selectedFlow: this.dag_dict[this.selected_dag_id]['name'], // 流水线
          //   selectedScheduler: this.scheduler_dict[this.selected_scheduler_id]['description'] // 调度器
          // }
          // console.log(query_info);
          // this.ipVideoFlowInfo.push(query_info);

          fetch("/dag/submit_query", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: text,
          })
          .then((response) => response.json())
          .then((data) => {
              let qid = data['qid'];
              // let job_info = {
              //   job_id: qid, // 任务序号
              //   selectedIp: this.selected_node_id, // IP
              //   selectedVideoId: this.selected_video_id, // 摄像头ID
              //   type: this.node_video_info[this.selected_node_id][this.selected_video_id]['description'],
              //   mode: this.selectedMode, // 优化模式
              //   delay_constraint: this.delay_constraint,
              //   acc_constraint:this.acc_constraint,
              // };

              // this.job_info_dict[qid] = job_info;
              // // console.log(this.job_info_dict);
              // sessionStorage.setItem("job_info_dict", JSON.stringify(this.job_info_dict));

              // 设置任务信息总览
              const query_info = {
                selectedIp: this.selected_node_id, // 节点
                selectedVideoId: this.selected_video_id, // 摄像头
                selectedFlow: this.dag_dict[this.selected_dag_id]['name'], // 流水线
                selectedScheduler: this.scheduler_dict[this.selected_scheduler_id]['description'] // 调度器
              }
              console.log(query_info);

              this.ipVideoFlowInfo.push(query_info);
              // sessionStorage.setItem(
              //   "ipVideoFlowInfo",
              //   JSON.stringify(this.ipVideoFlowInfo)
              // )


              // sessionStorage.setItem("delayCons", JSON.stringify(this.delayCons));
              // sessionStorage.setItem("accCons", JSON.stringify(this.accCons));

              // 显示交互信息
              ElMessage({
                message: "上传成功",
                showClose: true,
                type: "success",
                duration: 3000,
              });
          })
          .catch((error) => {
              console.error(error);
              ElMessage.error("上传失败");
          });

          // console.log(this.inputText)
          // console.log(JSON.stringify(text) )
        },

        // 获取正在运行的任务
        updateQueryInfo() {
          fetch("/dag/get_query_meta")
            .then((resp) => resp.json())
            .then((data) => {
              console.log(data);
              this.job_info_dict = data;
              this.ipVideoFlowInfo = [];
              
              for (var ent of Object.entries(data)) {
                var job = ent[1];
                const query_info = {
                  selectedIp: job['node_id'], // 节点
                  selectedVideoId: job['video_id'], // 摄像头
                  selectedFlow: '', // 流水线
                  selectedScheduler: this.scheduler_dict[job['scheduler_id']]['description'] // 调度器
                }
                console.log(query_info);
                this.ipVideoFlowInfo.push(query_info);
              }

            })
            .catch((err) => {
              console.log(err);
              this.job_info_dict = common.STATIC_SUBMITED_JOB_DICT;
            });
        },
  },

    mounted(){
      // console.log("mounted!");
      // this.flows = {
      //   "face_estimation":["face_detection","face_alignment"],
      //   "car_detecion":['car_detection'],
      // };
      const submitJobs = sessionStorage.getItem("submit_jobs");
      if (submitJobs) {
        this.submit_jobs = JSON.parse(submitJobs);
      }

      // const storedJobInfo = sessionStorage.getItem("job_info_dict");

      // if (storedJobInfo) {
      //   // 如果 sessionStorage 中存在保存的任务信息，则将其解析为对象并赋值给 this.job_info_dict
      //   this.job_info_dict = JSON.parse(storedJobInfo);
      // }

      // const storedService = sessionStorage.getItem("ipVideoFlowInfo");
      // if(storedService){
      //   this.ipVideoFlowInfo = JSON.parse(storedService);
      // }

      this.updateQueryInfo();

      this.timer = setInterval(() => {
        this.getNodeVideoInfo();
        this.getValidDAG();
        this.getValidScheduler();
        this.updateQueryInfo();
      }, 6000);

      // this.ipVideoFlowInfo = [
      //       {
      //         selectedIp:"192.168.11.1",
      //         selectedVideoId:1,
      //         selectedFlow:{ 'dag': ["face_detection","face_alignment"], 'dag_name': "face_estimation" },
      //       }
      // ];
    },

    beforeUnmount() {
      clearInterval(this.timer);
    },
};
</script>

<style>
.content {
margin-top: 20px;
}

.param{
    font-size: 18px;
}
.carousel-item-content {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%; /* 设置高度以确保内容垂直居中 */
}

.horizontal-scroll-container {

  display: flex;
  overflow-x: auto;
  white-space: nowrap;

  max-width: 80%; /* 设置最大宽度为80% */
  margin: 0 auto; /* 水平居中 */
}

.available-node{
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: 320px;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 120px;
}
.arrow {
    margin: 0 10px; /* 调整箭头与按钮之间的间距 */
    font-size: 24px;
  }
.subli {
  font-size: 18px;
  margin-top: 10px;
  padding: 0px;
}

/* 走马灯指示条 */
/* 修改页码指示器的颜色 */
.el-carousel__indicator {
  background-color: rgb(238, 230, 221);
}

/* 修改激活页码的颜色 */
/* .el-carousel__button.is-active {
  background-color: darksalmon;
} */

/* 修改悬停时的颜色 */
/* .el-carousel__button:hover {
  background-color: paleturquoise;
} */
.ipcontent-button{
  height: 90px;
  width: 230px;
}
.centered-item{
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: 100%; */
}
.selected{
  /* background-color: rgb(96, 158, 254);
  color:white; */
  background-color: #deebf7;;
}
.custom-select {
  position: relative;
  display: inline-block;
  width: 150px; /* 自定义宽度 */
  background-color: #f5f5f5; /* 自定义背景颜色 */
  border: 1px solid #ccc; /* 自定义边框样式 */
  border-radius: 4px; /* 自定义圆角 */
  overflow: hidden; /* 隐藏溢出内容 */
}

select {
  width: 100%;
  padding: 10px; /* 自定义内边距 */
  background-color: transparent; /* 透明背景色 */
  border: none; /* 移除默认边框 */
  outline: none; /* 移除选中边框 */
  appearance: none; /* 隐藏默认下拉箭头 */
  cursor: pointer; /* 鼠标样式 */
}
.custom-arrow {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  font-size: 16px; /* 自定义箭头图标大小 */
}
</style>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

form {
  max-width: 600px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
}

h3 {
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
}

input[type="text"],
input[type="file"] {
  width: calc(100% - 20px);
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
}

input[type="file"] {
  cursor: pointer;
}

.el-button {
  font-size: 16px;
  margin-right: 10px;
}

.el-button:first-child {
  margin-left: 0;
  
  
}

.outline{
    /* max-width: 600px; */
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    /* box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); */
  }

.new-dag-font-style{
    font-size: 16px;
    margin-bottom: 20px;
    font-weight: bold;
}

.svc-container {
    display: flex;
    flex-wrap: wrap;
    padding: 5px; /* 可根据需要调整 */
    list-style-type: none;
}

.svc-item {
    margin: 2px; /* 可根据需要调整 */
    padding: 2px; /* 可根据需要调整 */
    border-radius: 10px; /* 圆角矩形 */
}

.el-button {
    font-size: 16px;
    margin-right: 10px;
}

.el-button:first-child {
  margin-left: 0;
    
}
</style>