<template>
    <div class="content">
        <!-- 运行时情境 -->
        <div class="card-container" style="height: 500px;">
            <!-- 应用情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;height:100%;overflow: scroll;">
                <div slot="header"  style="font-size: 20px;font-weight: bold; margin-bottom: 20px;display: flex; align-items: center;">
                  <span style="margin-right: 50px;">任务情境</span>
                  <div class="custom-select">
                        <select v-model="selectedJob" @change="selectQctxJob(selectedJob['job_id'])">
                        <option value="" disabled selected>选择查询任务</option>
                        <option
                            v-for="(values, job_id, index) in job_info_dict"
                            :key="job_id"
                            :value="{'job_id':values['job_id'],'selectedIp':values['selectedIp'],'selectedVideoId':values['selectedVideoId'],
                                      'type':values['type'],'mode':values['mode'],'delay_constraint':values['delay_constraint'],'acc_constraint':values['acc_constraint']
                          }"
                        
                        >{{ values['selectedIp'] + " - " + values['selectedVideoId'] }}</option>
                        </select>
                        <span class="custom-arrow">&#9662;</span>
                        
                  </div>
                  
                  
                </div>
                <div style="display:flex;font-size:13px;font-weight:500;margin-left:20px;width:100%;color:gray;">
                      <div style="flex:1;margin-left:10px;">描述: {{ selectedJob.type }}</div>
                      <div style="flex:1;margin-left:10px;">优化模式: <div v-show="selectedJob" style="display:inline-block">{{ selectedJob.mode == 'latency'? '时延优先':'精度优先' }}</div></div>
                      <div style="flex:1;margin-left:10px;">
                        {{ selectedJob.mode === 'latency' ? '时延约束' : '精度约束' }}: {{ selectedJob.mode === 'latency' ? selectedJob.delay_constraint+'s' : selectedJob.acc_constraint }}
                      </div>
                </div>
              
                <el-card shadow="hover" style="margin: 20px; overflow: scroll; height: 100%;">
                  <!-- 选框容器 -->
                  <div ref="checkboxContainer">
                    <el-checkbox @change="toggleQctxDelay()" :disabled="!selected" v-model="qctx_check_delay">时延</el-checkbox>
                    <!-- <el-checkbox v-for="(item, idx) in keyList" :key="idx" :label="item" @change="toggleChart(item)" :disabled="!selected">{{ item }}</el-checkbox> -->
                    <el-checkbox v-for="(item, idx) in qctx_key_list" 
                    :key="idx" 
                    :label="item" 
                    @change="toggleChart(KEY_TYPE_QCTX, item)" 
                    :disabled="!selected" 
                    v-model="qctx_check_boxes[idx]">{{ item }}</el-checkbox>
                  </div>

                  <!-- 画布容器 -->
                  <div>
                    <!-- <div v-show="showOriginal" style="width: 500px; height: 250px; margin-top: 20px; float: left;">
                      <img :src="videoUrl + selected" style="width: 100%; height: 90%;" />
                    </div> -->
                    <div v-for="(item, idx) in qctx_key_list" :key="idx" style="float: left;margin-left: 20px;">
                      <div v-show="shouldShowChart(KEY_TYPE_QCTX, item)" :id="item" style="width: 500px; height: 250px; margin-top: 20px;"></div>
                    </div>
                  </div>
              </el-card>

            </el-card>
            
            <!-- 资源情境 -->
            <el-card shadow="hover" class="card" style="flex: 1;height:100%;overflow: scroll;">
                <div slot="header"  style="font-size: 20px;font-weight: bold; margin-bottom: 20px;display: flex; align-items: center;">
                    <span style="margin-right: 50px;">资源情境</span>
                    <div class="custom-select">
                        <select v-model="rtss_selected_node" @change="selectRtssNode(rtss_selected_node)">
                        <option value="" disabled selected>选择节点</option>
                        <option
                            v-for="(info, ip) in cluster_info"
                            :key="ip"
                            :value="ip"
                        >{{ ip }}</option>
                        </select>
                        <span class="custom-arrow">&#9662;</span>
                    </div>
                </div>

                <el-card shadow="hover" style="margin: 20px; overflow: scroll; height: 100%;">
                  <!-- 选框容器 -->
                  <div ref="rtssCheckboxContainer">
                    <el-checkbox v-for="(item, idx) in rtss_key_list" 
                    :key="idx" 
                    :label="item" 
                    @change="toggleChart(KEY_TYPE_RTSS, item)" 
                    :disabled="!selected" 
                    v-model="rtss_check_boxes[idx]">{{ item }}</el-checkbox>
                  </div>

                  <!-- 画布容器 -->
                  <div>
                    <!-- <div v-show="showOriginal" style="width: 500px; height: 250px; margin-top: 20px; float: left;">
                      <img :src="videoUrl + selected" style="width: 100%; height: 90%;" />
                    </div> -->
                    <div v-for="(item, idx) in rtss_key_list" :key="idx" style="float: left;margin-left: 20px;">
                      <div v-show="shouldShowChart(KEY_TYPE_RTSS, item)" :id="item" style="width: 500px; height: 250px; margin-top: 20px;"></div>
                    </div>
                  </div>
                </el-card>
                    
            </el-card>
        </div>

        <!-- 任务调度配置 -->
        <el-card shadow="hover" style="margin: 20px; height: 100%;overflow: scroll;">
          <div slot="header" style="font-size: 20px;font-weight: bold; margin-bottom: 20px;">任务调度配置</div>

          <el-card shadow="hover" style="margin: 20px; overflow: scroll; height: 100%;">
              <!-- 选框容器 -->
              <div ref="planCheckboxContainer">
                <el-checkbox v-for="(item, idx) in plan_key_list" 
                :key="idx" 
                :label="item" 
                @change="toggleChart(KEY_TYPE_PLAN, item)" 
                :disabled="!selected" 
                v-model="plan_check_boxes[idx]">{{ item }}</el-checkbox>
              </div>

              <!-- 画布容器 -->
              <div>
                <!-- <div v-show="showOriginal" style="width: 500px; height: 250px; margin-top: 20px; float: left;">
                  <img :src="videoUrl + selected" style="width: 100%; height: 90%;" />
                </div> -->
                <div v-for="(item, idx) in plan_key_list" :key="idx" style="float: left;margin-left: 20px;">
                  <div v-show="shouldShowChart(KEY_TYPE_PLAN, item)" :id="item" style="width: 500px; height: 250px; margin-top: 20px;"></div>
                </div>
              </div>
          </el-card>
          
        </el-card>

    </div>
</template>
<script>
import { ElLoading, ElMessage } from "element-plus";
import * as echarts from "echarts";
import * as common from '../common.js';
export default{
    data(){
        return{
            // url
            resultUrl: "/dag/get_agg_info",
            sched_ctx_url: "/dag/sched_ctx",
            videoUrl: "video/user/video/",

            // 可查询任务
            submit_jobs:[],
            // 选取的查询任务
            submit_job:null,
            selectedJob:"",
            // 查询结果
            result:null,
            appended_result: null,
            cluster_info: null,

            // 显示chart的信息类型（仅支持固定类型）
            KEY_TYPE_QCTX: "qctx",
            KEY_TYPE_RTSS: "rtss",
            KEY_TYPE_PLAN: "plan",

            // 任务情境
            qctx_key_list: [],
            qctx_check_delay: false,
            qctx_check_boxes: [],
            qctx_select_charts: [],

            // 资源情境
            rtss_key_list: [],
            rtss_check_boxes: [],
            rtss_select_charts: [],
            rtss_selected_node: null,

            // 调度配置
            plan_key_list: [],
            plan_check_boxes: [],
            plan_select_charts: [],

            // 选择的查询任务
            selected: null,

            // 前端获取已经提交的任务
            job_info_dict: {},

            // 绘制结果折线图
            chart: null,

            // 定时器
            timer: null,
            
        };
    },
    methods: {
        mapTOChinese(item){
          if(item === 'encoder'){
            return "编 码";
          }else if(item === 'fps'){
            return "帧 率";
          }else if(item === 'resolution'){
            return "分辨率";
          }else{
            return item;
          }
        },
        
        // 选定所需要查询的任务，触发qctx_key_list和plan_key_list生成
        selectQctxJob(job_id) {
          // console.log(job_id);
          // console.log(this.selectJob);
          this.selected = job_id;
          sessionStorage.setItem("job_id", JSON.stringify(this.selected));
          this.submit_job = job_id;
          this.updateResultUrl();
          this.clearQctxCheckboxesAndCharts();
          this.clearRtssCheckboxesAndCharts();
          this.clearPlanCheckboxesAndCharts();
        },

        // 选定所需要查询的节点，触发rtss_key_list生成
        selectRtssNode(node_id) {
          console.log("[selectRtssNode] this.rtss_selected_node=", this.rtss_selected_node);
          console.log("[selectRtssNode] node_id=", node_id);
          this.updateKeyList(this.cluster_info[node_id], this.KEY_TYPE_RTSS);
          this.clearRtssCheckboxesAndCharts();
        },

        // 获取appended_result中的query_ctx的key列表，更新前端key列表
        updateKeyList(data, key_type) {
          if (!data) {
            console.log("[updateKeyList] data is null");
            return;
          }
          console.log("[updateKeyList] data=", data);
          console.log("[updateKeyList] key_type=", key_type);

          var curr_kl = [];
          for(var i = 0;i < data.length;i ++) {
            var obj_kl;
            switch (key_type) {
              case this.KEY_TYPE_RTSS: {
                obj_kl = Object.keys(data[i]);
                break;
              }
              case this.KEY_TYPE_QCTX: {
                obj_kl = Object.keys(data[i][common.QSS_INFO_KEY_QUERY_CTX]);
                break;
              }
              case this.KEY_TYPE_PLAN: {
                obj_kl = [common.QSS_INFO_KEY_FPS, common.QSS_INFO_KEY_RESOL, common.QSS_INFO_KEY_SERVMAP];
                break;
              }
              default: {
                console.log("[updateKeyList] unsupport key_type=", key_type);
                break;
              }
            }
            for(var j = 0; j < obj_kl.length; j++){
              if(curr_kl.indexOf(obj_kl[j]) == -1){
                curr_kl.push(obj_kl[j]);
              }
            }
          }
          const isSame = (arr1, arr2) => {
            if (arr1.length !== arr2.length) {
              return false;
            }
            return arr1.every(item => arr2.includes(item));
          };

          // 如果keyList有变化则清空selectedCharts和checkboxes的选中状态
          console.log("[updateKeyList] curr_kl=", curr_kl);
          switch (key_type) {
            case this.KEY_TYPE_QCTX: {
              if (!isSame(this.qctx_key_list, curr_kl)) {
                this.qctx_key_list = curr_kl;
                this.clearQctxCheckboxesAndCharts();
              }
              break;
            }
            case this.KEY_TYPE_RTSS: {
              if (!isSame(this.rtss_key_list, curr_kl)) {
                this.rtss_key_list = curr_kl;
                this.clearRtssCheckboxesAndCharts();
              }
              break;
            }
            case this.KEY_TYPE_PLAN: {
              if (!isSame(this.plan_key_list, curr_kl)) {
                this.plan_key_list = curr_kl;
                this.clearPlanCheckboxesAndCharts();
              }
              break;
            }
            default:
              break;
          }
        },

        // 清除qctx复选框的勾选状态
        clearQctxCheckboxesAndCharts() {
          this.qctx_check_boxes = this.qctx_check_boxes.map(() => false);
          this.qctx_select_charts = [];
        },
        clearRtssCheckboxesAndCharts() {
          this.rtss_check_boxes = this.rtss_check_boxes.map(() => false);
          this.rtss_select_charts = [];
        },
        clearPlanCheckboxesAndCharts() {
          this.plan_check_boxes = this.plan_check_boxes.map(() => false);
          this.plan_select_charts = [];
        },

        toggleQctxDelay(){
          if(!this.showOriginal){
            this.showOriginal = true;
          }else{
            this.showOriginal = !this.showOriginal;
          }
          console.log(this.showOriginal);
        },

        // 选择需要显示的chart
        toggleChart(key_type, item_key){
          // 已经被选择则清除，没被选择则加入到list中
          console.log("[toggleChart] key_type = ", key_type);
          console.log("[toggleChart] item_key = ", item_key);
          switch (key_type) {
            case this.KEY_TYPE_QCTX: {
              console.log("[toggleChart] (before) len(this.qctx_select_charts) = ", this.qctx_select_charts.length);
              console.log(this.qctx_select_charts.includes(item_key));
              if (this.qctx_select_charts.includes(item_key)) {
                this.qctx_select_charts = this.qctx_select_charts.filter(item => item !== item_key);
                echarts.dispose(document.getElementById(item_key));
              } else {
                this.qctx_select_charts.push(item_key);
                this.plotChart(key_type, item_key);
              }
              console.log("[toggleChart] this.qctx_select_charts = ", this.qctx_select_charts);
              break;
            }
            case this.KEY_TYPE_RTSS: {
              if (this.rtss_select_charts.includes(item_key)) {
                this.rtss_select_charts = this.rtss_select_charts.filter(item => item !== item_key);
                echarts.dispose(document.getElementById(item_key));
              } else {
                this.rtss_select_charts.push(item_key);
                this.plotChart(key_type, item_key);
              }
              console.log("[toggleChart] this.rtss_select_charts = ", this.rtss_select_charts);
              break;
            }
            case this.KEY_TYPE_PLAN: {
              console.log("[toggleChart] (before) len(this.plan_select_charts) = ", this.plan_select_charts.length);
              console.log(this.plan_select_charts.includes(item_key));
              if (this.plan_select_charts.includes(item_key)) {
                this.plan_select_charts = this.plan_select_charts.filter(item => item !== item_key);
                echarts.dispose(document.getElementById(item_key));
              } else {
                this.plan_select_charts.push(item_key);
                this.plotChart(key_type, item_key);
              }
              console.log("[toggleChart] this.plan_select_charts = ", this.plan_select_charts);
              break;
            }
            default:
              break;
          }

        },

        // 提供给v-show，决定是否显示chart
        shouldShowChart(key_type, item_key){
          var flag = false;
          switch (key_type) {
            case this.KEY_TYPE_QCTX: {
              flag = this.qctx_select_charts.includes(item_key);
              break;
            }
            case this.KEY_TYPE_RTSS: {
              flag = this.rtss_select_charts.includes(item_key);
              break;
            }
            case this.KEY_TYPE_PLAN: {
              flag = this.plan_select_charts.includes(item_key);
              break;
            }
            default: {
              console.log("[shouldShowChart] unsupport key_type=", key_type);
              break;
            }
          }
          return flag;
        },

        plotChart(key_type, itemKey){
          console.log("[plotChart] key_type = " + key_type);
          console.log("[plotChart] itemKey = " + itemKey);
          // this.updateResultUrl();
          
          // 1、获取画图的chart
          var chart;
          if (echarts.getInstanceByDom(document.getElementById(itemKey)) === undefined) {
            chart = echarts.init(document.getElementById(itemKey));
          } else {
            chart = echarts.getInstanceByDom(document.getElementById(itemKey));
            // chart.clear();
          }
          // var chart = echarts.init(document.getElementById(itemKey));

          // 2、获取itemKey字段的数据，itemKey可能是以下两种类型数据：
          // （1）序列
          // （2）序列的字典
          const DATA_KEY_X = 'X';
          const DATA_KEY_Y = 'Y';
          var itemXYData;

          switch (key_type) {
            case this.KEY_TYPE_QCTX: {
              itemXYData = this.appended_result.map(function(item) {
                var X_val = item[common.QSS_INFO_KEY_TID];
                var Y_dict = item[common.QSS_INFO_KEY_QUERY_CTX][itemKey];
                if (typeof Y_dict !== 'object') {
                  Y_dict = {[itemKey]: Y_dict};
                }
                return {[DATA_KEY_X]: X_val, [DATA_KEY_Y]: Y_dict};
              });
              break;
            }
            case this.KEY_TYPE_RTSS: {
              itemXYData = this.cluster_info[this.rtss_selected_node].map(function(item) {
                var X_val = item[common.RTSS_INFO_KEY_RTSS_ID];
                var Y_dict = item[itemKey];
                if (typeof Y_dict !== 'object') {
                  Y_dict = {[itemKey]: Y_dict};
                }
                return {[DATA_KEY_X]: X_val, [DATA_KEY_Y]: Y_dict};
              });
              break;
            }
            case this.KEY_TYPE_PLAN: {
              itemXYData = this.appended_result.map(function(item) {
                var X_val = item[common.QSS_INFO_KEY_TID];
                var Y_dict = item[itemKey];
                if (typeof Y_dict !== 'object') {
                  Y_dict = {[itemKey]: Y_dict};
                }
                return {[DATA_KEY_X]: X_val, [DATA_KEY_Y]: Y_dict};
              });
              break;
            }
            default:
              break;
          }

          console.log("[plotChart] itemXYData=", itemXYData);

          var series_v = {};
          var series_kl = [];

          // 3、初始化itemKey值字段的数据列表
          for (var i = 0; i < itemXYData.length; i++) {
            var kl = Object.keys(itemXYData[i][DATA_KEY_Y]);
            for (var j = 0; j < kl.length; j++) {
              if (series_kl.indexOf(kl[j]) == -1) {
                series_kl.push(kl[j]);
              }
            }
          }
          for (var i = 0; i < series_kl.length; i++) {
            var k = series_kl[i];
            series_v[k] = [];
          }
          // 4、生成各itemKey值字段的数据序列
          for (var i = 0; i < itemXYData.length; i++) {
            var value_dict = itemXYData[i][DATA_KEY_Y];
            for (var value_k in value_dict) {
              var k = value_k;
              var v = value_dict[value_k];
              series_v[k].push(v);
            }
          }
          // 5、生成各itemKey值字段的chart数据序列和与其对应的legend列表
          var y_axis_type = 'value';
          var chart_series_list = [];
          var chart_legend_list = [];
          // console.log("seriesData entries: " + Object.entries(seriesData));
          for (var ent of Object.entries(series_v)) {
            // console.log("ent[0]=" + ent[0]);
            // console.log("ent[1]=" + ent[1]);
            var k = ent[0];
            var v_list = ent[1];
            if (v_list.length > 0 && typeof v_list[0] === 'string') {
              y_axis_type = 'category';
            }
            chart_legend_list.push(k);
            chart_series_list.push({
              name: k,
              type: "line",
              label: {
                show: true,
                position: "top",
                color: "black",
                fontSize: 5,
                formatter: function (d) {
                  return d.data;
                },
              },
              data: v_list,
            });
          }

          // 6、喂数据画图
          const option = {
            xAxis: {
              type: 'category',
              data: itemXYData.map((item) => item[DATA_KEY_X]), // 使用映射后的横坐标数据
              name: "任务ID"
            },
            yAxis:{
              type: y_axis_type,
              name: '值'
            },
            legend: {
              data: chart_legend_list
            },
            series: chart_series_list,
            title:{
              show: true,
              text: this.mapTOChinese(itemKey),
            }
          };
          chart.setOption(option);
        },

        // 将获取的qss和rtss赋值给全局变量
        assignAggData(data, job_id) {
          if (!data) {
            data = common.STATIC_RESULT;
          }
          console.log("[assignAggData] data=");
          console.log(data);

          if (!job_id) {
            job_id = Object.keys(data[common.KEY_QSS])[0];
          }
          console.log("[assignAggData] job_id=" + job_id);

          this.appended_result = data[common.KEY_QSS][job_id];
          this.cluster_info = data[common.KEY_RTSS];

          const len = this.appended_result.length;

          console.log("[assignAggData] result len=" + len);
        
          // 获取一次agg_data后，需要更新qctx_key_list、rtss_key_list
          // this.updateQctxKeyList();
          this.updateKeyList(this.appended_result, this.KEY_TYPE_QCTX);
          this.updateKeyList(this.appended_result, this.KEY_TYPE_PLAN);
        },
        
        // 更新qctx、rtss、plan的已选图标
        updateSelectCharts() {
          var update_list = {
            [this.KEY_TYPE_QCTX]: this.qctx_select_charts,
            [this.KEY_TYPE_RTSS]: this.rtss_select_charts,
            [this.KEY_TYPE_PLAN]: this.plan_select_charts,
          }
          console.log("[updateSelectCharts] update_list=%O", update_list);
          for (var ent of Object.entries(update_list)) {
            console.log(ent);
            var key_type = ent[0];
            var item_key_list = ent[1];
            for (var i = 0; i < item_key_list.length; i++) {
              var item_key = item_key_list[i];
              this.plotChart(key_type, item_key);
            }
            console.log("[updateSelectCharts] key_type=%s, len=%d, item_key_list=%O",
                        key_type, item_key_list.length, item_key_list);
          }
          for (var i = 0; i < this.qctx_select_charts.length; i++) {
            var item_key = this.qctx_select_charts[i];
            this.plotChart(this.KEY_TYPE_QCTX, item_key);
          }
          console.log
          for (var i = 0; i < this.rtss_select_charts.length; i++) {
            var item_key = this.rtss_select_charts[i];
            this.plotChart(this.KEY_TYPE_RTSS, item_key);
          }
          for (var i = 0; i < this.plan_select_charts.length; i++) {
            var item_key = this.plan_select_charts[i];
            this.plotChart(this.KEY_TYPE_PLAN, item_key);
          }
        },

        // 查询qss和rtss结果
        updateResultUrl() {
          // console.log(this.submit_job);
          if (this.submit_job) {
            // const url = this.resultUrl + this.submit_job;
            const url = this.resultUrl;
            console.log("[updateResultUrl] url = ", url);

            // const loading = ElLoading.service({
            //   lock: true,
            //   text: "Loading",
            //   background: "rgba(0, 0, 0, 0.7)",
            // });

            // 静态填充调试
            // this.assignAggData(null, null);

            // 对接接口调试
            fetch(url)
              .then((response) => response.json())
              .then((data) => {
                // loading.close();

                this.assignAggData(data, this.submit_job);

              })
              .catch((error) => {
                console.log("[updateResultUrl] fetch error=", error);

                this.assignAggData(null, null);

                // loading.close();
                ElMessage({
                  showClose: true,
                  message: "结果尚未生成,请稍后",
                  type: "error",
                  duration: 1500,
                });
              });
          }
          
        },

        assignSchedCtx(data, job_id) {
          if (!data) {
            data = common.STATIC_SCHED_CTX;
          }
          console.log("[assignSchedCtx] data=");
          console.log(data);

          if (!job_id) {
            job_id = Object.keys(data)[0];
          }
          console.log("[assignSchedCtx] job_id=" + job_id);

          const ctx_list = data[job_id];

          const len = ctx_list.length;

          console.log("[assignSchedCtx] ctx_list len=" + len);

        },

        // 更新调度器状态
        updateSchedCtxUrl() {
          const url = this.sched_ctx_url;

          fetch(url)
            .then((resp) => resp.json())
            .then((data) => {
              // this.cluster_info = data;

              this.assignSchedCtx(data, this.submit_job);

            })
            .catch((err) => {
              console.log(err);
              this.assignSchedCtx(null, null);
            });
        },
        
    },
    computed: {
        // 改写中文
        modifiedInfo() {
            if (!this.job_info_dict) {
                return null;
            }
            let modified_info = Object.fromEntries(
                Object.entries(this.job_info_dict).map(([key, value]) => {
                let mode = value.mode === "latency" ? "时延优先" : "精度优先";
                return [
                    key,
                    {
                    job_id: value.job_id,
                    selectedIp:value.selectedIp,
                    摄像头ID: value.selectedVideoId,
                    描述: value.type,
                    优化模式: mode,
                    时延约束: value.delay_constraint,
                    精度约束: value.acc_constraint
                    }
                ];
                })
            );
            return modified_info;
        },
    },
    mounted(){
        
        // 获取可查询的任务相关信息 存储在submit_jobs和job_info_dict中
        const submitJobs = sessionStorage.getItem("submit_jobs");
        if (submitJobs) {
            this.submit_jobs = JSON.parse(submitJobs);
            // console.log(this.submit_jobs);
        }

        const job_info = sessionStorage.getItem("job_info_dict");
        if (job_info) {
          this.job_info_dict = JSON.parse(job_info);
        } else {
          this.job_info_dict = common.STATIC_SUBMITED_JOB_DICT;
        }
        console.log("[mounted] this.job_info_dict = ", this.job_info_dict);

        // this.initChart();
        this.timer = setInterval(() => {
          this.updateResultUrl();
          // this.updateSchedCtxUrl();

          // 更新toggleChart选中的图标数据
          this.updateSelectCharts();
        }, 6000);
    },
    beforeUnmount() {
      clearInterval(this.timer);
    },
}
</script>
<style>
.content {
    margin-top: 20px;
}
.card-container {
  display: flex;
  margin-left: 20px;
  margin-right: 20px;
}
.image-container{
    width: 100%;
    height: 80%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.card {
  height: 600px;
  margin-right: 10px; /* 添加适当的间距 */
}
.info-header {
  text-align: center;
  color: #2f74ff;
  font-weight: 1000;
  line-height: 40px;
  border: 2px solid rgb(77, 77, 77);
  margin: 5px;
  border-radius: 5px;
}
.info-box {
  /* height: 80px; */
  /* border: 2px dashed grey; */
  margin: 20px;
  display: flex;
  /* border-radius: 10px; */
}

.info-h1 {
  width: min-content;
  white-space: nowrap;
  text-align: center;
  font-weight: 750;
  font-size:18px;
  margin-top:10px;
  margin-bottom:10px;
}
.info-h1-flex-text {
  display: flex;
  align-items: center;
}
.info-h2-1 {
  width: min-content;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #6c9bd4;
  height:30px;
  /* width:120px; */
  line-height:30px;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  /* border-left: 5px solid rgb(77, 77, 77); */
  border-radius: 5px;
  margin: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 40px;
  margin-right: 5px;
}
.info-h2-2 {
  width: 60px;
  height: min-content;
  white-space: nowrap;
  text-align: center;
  color: #6c9bd4;
  height:30px;
  /* width:120px; */
  line-height:30px;
  background-color: rgb(220, 220, 220);
  /* line-height: 20px; */
  /* border: 2px dashed rgb(77, 77, 77); */
  /* margin: 5px; */
  /* padding: 5px; */
  font-weight: 500;
  /* border-left: 5px solid rgb(77, 77, 77); */
  border-radius: 5px;
  margin: 5px;
  padding-left: 10px;
  padding-right: 10px;
  margin-left: 40px;
  margin-right: 5px;
}
.info-h2-flex-text {
  display: flex;
  align-items: center;
  margin: 5px;
}
.info-h2-flex-text-items {
  margin-right: 10px;
  border-bottom: 2px dashed #2f74ff;
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

.available-node-result{
  display: inline-block;
  margin: 20px;
  /* background-color: cadetblue; */
  width: 320px;
  border: 1px solid #5c5858;
  border-radius: 10px;
  height: 180px;
}
.centered-div {
  margin-top: 10px;
  display: flex;
  justify-content: center; /* 在水平方向上居中对齐 */
  
}
.selected{
  background-color: #deebf7;
  /* color:white; */
}
.canvas-container {
    display: flex;
    justify-content: space-between;
}

.inner-div {
    display: flex;
    flex-direction: column;
    align-items: center;
}

canvas {
    margin-top: 10px; /* 为了将span内容留出一些空间 */
}
.custom-select {
  position: relative;
  display: inline-block;
  width: 200px; /* 自定义宽度 */
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
.subli {
  font-size: 18px;
  margin-top: 10px;
  padding: 0px;
}
.button-not-selected{
  width:75px;
  height:40px;
  border: 1px solid #ffffff;
  margin-left:8px;
  border-radius:5px;
  background: #dcdcdc;
  text-align:center;
  color:white;
}
.button-selected{
  width:75px;
  height:40px;
  /* color:blue; */
  border: 1px solid #ffffff;
  margin-left:8px;
  border-radius:5px;
  text-align:center;
  color:white;
  background-color: #9dc3e6;
  /* justify-content:center; */
}
.centered-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* 使元素高度充满父元素，实现垂直居中 */
}
</style>

<style lang="scss" scoped>
:deep(.user-radio) {
  // ::v-deep .user-radio {
  .el-radio-button__inner {
    color: #ffffff;
    border: 1px solid #ffffff;
    margin-left:8px;
    border-radius:5px;
    // border-radius: 4px;
    background: #dcdcdc;
  }

  .el-radio-button__original-radio:disabled:checked + .el-radio-button__inner {
    background-color: #9dc3e6;
  }
}
</style>