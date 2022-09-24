<template>
  <div id="box">
    <el-scrollbar class="content">
      <el-form ref="form" :model="form" label-width="80px" style="position: relative">
        <h3 class="txt">发布求助</h3>
        <el-form-item label="求助标题">
          <el-input v-model="form.title" class="einput"></el-input>
        </el-form-item>
        <el-form-item label="求助内容">
          <el-input type="textarea" v-model="form.content" class="einput"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="form.phone" class="einput"></el-input>
        </el-form-item>
        <div>
          <img src="../assets/help/coin.png" />
          <img src="../assets/help/time.png" style="margin-left: 230px" />
        </div>
        <el-form-item>
          <el-input placeholder="搜币" v-model="form.coin" style="width: 100px"></el-input>
          <el-date-picker
            v-model="form.datetime"
            style="margin-left: 80px"
            type="datetime"
            placeholder="求助结束时间"
          ></el-date-picker>
        </el-form-item>

        <h3 class="txt">添加求助地址</h3>

        <el-form-item label="省市区">
          <el-cascader
            :options="options"
            v-model="form.selectedOptions"
            @change="handleChange"
            ref="cascader"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-autocomplete
            :fetch-suggestions="querySearch"
            placeholder="请输入详细地址"
            style="width: 80%"
            v-model="form.address"
            :trigger-on-focus="false"
            @select="handleSelect"
            value-key="title"
          ></el-autocomplete>
          <el-button @click="location">定位</el-button>
        </el-form-item>
        <el-form-item label="补充信息:">
          <el-input
            placeholder="可以让更多人找到你哦!"
            class="einput"
            type="textarea"
            v-model="form.extra"
          ></el-input>
        </el-form-item>
        <div id="map"></div>
        <el-button
          type="primary"
          @click="onSubmit"
          style="
            position: relative;
            margin: 22px;
            width: 160px;
            left: 50%;
            transform: translate(-50%);
          "
          >发布求助</el-button
        >
      </el-form>
    </el-scrollbar>
  </div>
</template>

<script>
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      form: {
        title: '',
        content: '',
        phone: '',
        coin: '',
        datetime: '',
        selectedOptions: '',
        province: '',
        city: '',
        district: '',
        address: '',
        extra: '',
        latitude: null,
        longitude: null,
      },
      options: regionData,
      res: [],
      suggest: null,
      target: null,
      map: null,
    }
  },
  methods: {
    init() {
      //定义地图中心点坐标
      const center = new TMap.LatLng(39.98412, 116.307484)
      //定义map变量，调用 TMap.Map() 构造函数创建地图
      this.map = new TMap.Map(document.getElementById('map'), {
        center: center, //设置地图中心点坐标
        zoom: 17.2, //设置地图缩放级别
        pitch: 43.5, //设置俯仰角
        rotation: 45, //设置地图旋转角度
      })
    },
    onSubmit() {
      const Nodes = this.$refs['cascader'].getCheckedNodes()[0]
      let date = this.form.datetime
      date =
        date.getFullYear() +
        '-' +
        (date.getMonth() + 1) +
        '-' +
        date.getDate() +
        ' ' +
        date.getHours() +
        ':' +
        date.getMinutes() +
        ':' +
        date.getSeconds()
      this.form.datetime = date
      this.form.district = Nodes.label
      this.form.city = Nodes.parent.label
      this.form.province = Nodes.parent.parent.label
      console.log(this.form.city)
      const qs = require('qs')
      this.$axios.post('/ss/forhelp', qs.stringify(this.form)).then((res) => {
        if (res.data.status === 0) {
          this.$message({
            message: '提交成功！',
            type: 'success',
            duration: 1000,
            offset: 400,
            center: true,
          })
        }
      })
    },
    location() {
      const location = this.target.location
      this.form.latitude = location.lat
      this.form.longitude = location.lng
      const tar = new TMap.LatLng(location.lat, location.lng)
      this.map.setCenter(tar)
    },
    handleRemove(file) {
      console.log(file)
    },
    handlePictureCardPreview(file) {
      // this.dialogImageUrl = file.url;
      // this.dialogVisible = true;
    },
    handleChange() {},
    handleSelect(item) {
      this.target = item
    },
    querySearch(queryString, cb) {
      if (queryString) {
        this.res = []
        this.suggest.getSuggestions({ keyword: queryString }).then((res) => {
          const data = res.data
          data.forEach((item) => {
            let tmp = {}
            tmp.title = item.title
            tmp.address = item.address
            tmp.location = item.location
            this.res.push(tmp)
          })
        })
      }
      cb(this.res)
    },
  },
  mounted() {
    this.init()

    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: '广东', // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    })
  },
}
</script>

<style scoped>
#box {
  position: relative;
  width: 100vw;
  height: calc(100% - 60px);
  background-color: #fff;
}
.einput {
  width: 90%;
}
.txt {
  text-align: center;
}
.content {
  width: 100vw;
  height: 100%;
  background-color: rgb(225, 228, 227);
  overflow: hidden;
}
#map {
  width: 100%;
  height: 500px;
}
img {
  position: absolute;
  margin-left: 45px;
  margin-top: 6px;
  width: 28px;
  height: 28px;
}
</style>
