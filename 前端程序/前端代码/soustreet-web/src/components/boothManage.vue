<template>
  <el-scrollbar class="scrollbar">
    <div>
      <h3 id="head">商铺信息管理</h3>
      <el-divider></el-divider>
    </div>
    <el-table :data="tableData" border style="width: 100%" :cell-style="{'text-align':'center'}" >
      <!-- <el-table-column fixed prop="shop_id" label="序号" width="150">
      </el-table-column> -->

      <el-table-column fixed prop="shop_name" label="商铺名字" width="200"  align="center">
      </el-table-column>

      <el-table-column prop="business_scope" label="主营业务" width="200" align="center">
      </el-table-column>

      <el-table-column prop="per_cost" label="消费水平" width="200" align="center">
      </el-table-column>

      <el-table-column prop="is_mobile" label="地摊类型" width="200" align="center">
      </el-table-column>

      <el-table-column prop="business_license_code" label="营业执照编码" width="200" align="center">
      </el-table-column>
       <el-table-column prop="enable_status" label="审核结果" width="250" align="center">
      </el-table-column>

      <el-table-column label="管理操作" width="350" align="center"> 
        <template slot-scope="scope">
          <el-button @click="handleClick(scope.row.shop_id)" size="small" type="primary"
            >查看详细信息</el-button
          >
          <el-button size="small" type="danger" @click="del(scope.row.shop_id)"
            >删除该地摊</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </el-scrollbar>
</template>

<script>
import qs from "qs";
export default {
  name: "boothManage",
  data() {
    return {
      tableData: [],
    };
  },
  methods: {
    handleClick(id) {
      //  console.log(id);
      this.$router.push({
        name: "boothHandle",
        params: {
          shop_id: id,
        },
      });
    },
    del(id) {
      this.$confirm("此操作将永久删除该地摊, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.$axios
          .post(
            "ss/boothDelete",
            qs.stringify({
              shop_id: id,
            })
          )
          .then((res) => {
            if (res.data.status === 0) {
              //表示数据库中删除完成
              this.$message({
                message: res.data.message,
                type: "success",
                offset: 400,
                center: true,
                duration: 1000,
              });
            }
          })
          .then(() => {
            //tabledata上同步数据库的操作实现页面的渲染
            length = this.tableData.length;
            console.log(length);
            for (var i = 0; i < length; i++) {
              if (this.tableData[i].shop_id === id) {
                this.tableData.splice(i, 1);
              }
            }
          });
      });
    },
    judge(item) {
      console.log('judge');
      if (item.enable_status === 0)
        item.enable_status = "审核中"
      if (item.enable_status === 1)
        item.enable_status = "许可";
      if (item.enable_status === 2)
        item.enable_status = "不许可";
    },
    changeNum(item){
      if(item.is_mobile===1)
      item.is_mobile="移动地摊"
      if(item.is_mobile===0)
      item.is_mobile="固定地摊"
    },
    sendRequest() {
      this.$axios.post("/ss/boothManage").then((res) => {
        console.log("---------++++++++++++", res.data.results);
        this.tableData = res.data.results;
        let temp = this.tableData.slice(-1);
        // console.log(temp);
        this.tableData.push(temp); //因为页面渲染不实时同步，用这种方法可以实现实时同步
        this.tableData.pop();
        this.tableData.forEach(element => {
          this.judge(element)
          this.changeNum(element)
        });
      });
    },
  },
  mounted() {
    // .catch(()=>{})
    this.sendRequest();
   
    
  },
};
</script>

<style scoped>
.scrollbar {
  width: 100%;
  height: 90%;
  justify-content: right;
  overflow-y: auto;
}

#head {
  font-size: 20px;
  margin-left: 1em;
}
</style>