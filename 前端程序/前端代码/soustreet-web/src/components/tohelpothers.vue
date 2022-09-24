<template>
  <div>
    <div class="search-box">
      <el-autocomplete
        style="width: 500px; margin-left: 10px"
        v-model="content"
        :fetch-suggestions="querySearch"
        placeholder="输入地址搜索附近需要帮助的订单"
        :trigger-on-focus="false"
        @select="handleSelect"
        value-key="title"
      ></el-autocomplete>
      <el-select v-model="value" style="width: 150px">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <el-button @click="btnClick">搜索</el-button>
      <el-button type="text" @click="dialogVisible = true">当前定位不准确?手动输入地址</el-button>
      <el-button @click="drawer = true" type="primary" style="margin-left: 16px" v-if="desc">
        路线描述
      </el-button>
      <el-drawer
        title="路线描述"
        :visible.sync="drawer"
        :direction="direction"
        :append-to-body="true"
      >
        <span style="white-space: pre-wrap">{{ routeDesc }}</span>
      </el-drawer>

      <el-dialog
        title="手动输入地址重新定位"
        :visible.sync="dialogVisible"
        width="30%"
        :append-to-body="true"
        :show-close="false"
      >
        <el-autocomplete
          style="width: 400px; margin: 0 10px"
          v-model="address"
          :fetch-suggestions="querySearch"
          placeholder="输入地址"
          :trigger-on-focus="false"
          @select="dialogSelect"
          value-key="title"
        ></el-autocomplete>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="positioning">重新定位</el-button>
        </span>
      </el-dialog>
    </div>
    <el-descriptions
      v-show="showdesc"
      title="求助信息"
      style="position: fixed; z-index: 9999; background-color: #fff"
      border
    >
      <el-descriptions-item label="求助标题">{{
        targetMarker && targetMarker.appeal_title
      }}</el-descriptions-item>
      <el-descriptions-item label="求助内容">{{
        targetMarker && targetMarker.appeal_content
      }}</el-descriptions-item>
      <el-descriptions-item label="联系方式">{{
        targetMarker && targetMarker.phone
      }}</el-descriptions-item>
      <el-descriptions-item label="补充说明">
        {{ targetMarker && targetMarker.appeal_more_info }}
      </el-descriptions-item>
      <el-descriptions-item label="求助地址">{{
        targetMarker && targetMarker.full_address
      }}</el-descriptions-item>
      <el-descriptions-item label="截止时间">{{
        targetMarker && targetMarker.end_time
      }}</el-descriptions-item>
      <el-descriptions-item label="报酬"
        >{{ (targetMarker && targetMarker.sou_coin) || 0 }}搜币</el-descriptions-item
      >
      <template slot="extra"
        ><el-button type="primary" size="mini" @click="helpit">帮助他</el-button></template
      >
      <template slot="extra"
        ><el-button type="info" size="mini" @click="go">到这去</el-button></template
      >
      <template slot="extra"><el-button size="mini" @click="cancel">取消</el-button></template>
    </el-descriptions>
    <div id="map"></div>
  </div>
</template>

<script>
import { busRoutePlanning, drivingRoutePlanning } from '@/utils/routePlanning'
export default {
  data() {
    return {
      map: null,
      content: '',
      address: '',
      res: [],
      markerLayer: null,
      current: null,
      target: null,
      search: null,
      suggest: null,
      dialogVisible: false,
      reposition: null,
      helpData: null,
      targetMarker: null,
      showdesc: false,
      drawer: false,
      desc: false,
      direction: 'ltr',
      routeDesc: '',
      options: [
        {
          value: '0.5',
          label: '附近500m内',
        },
        {
          value: '1',
          label: '附近1km内',
        },
        {
          value: '3',
          label: '附近3km内',
        },
        {
          value: '5',
          label: '附近5km内',
        },
      ],
      value: '0.5',
    }
  },
  mounted() {
    this.init()
    // this.search = new TMap.service.Search({ pageSize: 10 }) // 新建一个地点搜索类
    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: '广东', // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    })
  },
  methods: {
    init() {
      var geolocation = new qq.maps.Geolocation('QWABZ-NGGCR-IEDWR-WWKHG-4NXDV-SXFU6', 'i搜街')
      geolocation.getLocation((res) => {
        //定义地图中心点坐标
        var center = new TMap.LatLng(res.lat, res.lng)
        this.current = center
        //定义map变量，调用 TMap.Map() 构造函数创建地图
        this.map = new TMap.Map(document.getElementById('map'), {
          center: center, //设置地图中心点坐标
          zoom: 17.2, //设置地图缩放级别
          pitch: 0, //设置俯仰角
          rotation: 45, //设置地图旋转角度
        })

        this.markerLayer = new TMap.MultiMarker({
          map: this.map,
          styles: {
            current: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              src: require('@/assets/point.png'), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),
            target: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              src: require('@/assets/target.png'), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),
            help: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              src: require('@/assets/help.png'), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),
          },
          geometries: [
            {
              id: '1', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
              styleId: 'current', //指定样式id
              position: new TMap.LatLng(res.lat, res.lng), //点标记坐标位置
              properties: {
                //自定义属性
                title: 'marker1',
              },
            },
          ],
        })
      })
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
    handleSelect(item) {
      this.target = item
    },
    dialogSelect(item) {
      this.reposition = item
    },
    btnClick() {
      const location = this.target.location
      const tar = new TMap.LatLng(location.lat, location.lng)
      this.markerLayer.remove('2')
      let Interface = '/ss/helpothers?'
      Interface +=
        'latitude=' + location.lat + '&longitude=' + location.lng + '&scope=' + this.value
      this.$axios.get(Interface).then((res) => {
        const data = res.data.data
        this.helpData = data
        console.log('res:', data)
        const length = data.length
        for (let i = 0; i < length; ++i) {
          this.markerLayer.add([
            {
              id: data[i].appeal_id, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
              styleId: 'help', //指定样式id
              position: new TMap.LatLng(data[i].latitude, data[i].longitude), //点标记坐标位置
              // properties: {
              //   //自定义属性
              //   title: 'marker2',
              // },
            },
          ])
        }
        this.markerLayer.on('click', (evt) => {
          const appeal_id = evt.geometry.id
          const data = this.helpData
          for (let i in data) {
            if (data[i].appeal_id == appeal_id) {
              this.targetMarker = data[i]
              break
            }
          }
          if (!this.showdesc) this.showdesc = true
        })
      })
      this.map.setCenter(tar)
    },
    positioning() {
      this.dialogVisible = false
      const location = this.reposition.location
      const cur = new TMap.LatLng(location.lat, location.lng)
      this.current = cur
      this.map.setCenter(cur)
      this.markerLayer.remove('1')
      this.markerLayer.add([
        {
          id: '1', //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
          styleId: 'current', //指定样式id
          position: new TMap.LatLng(location.lat, location.lng), //点标记坐标位置
          properties: {
            //自定义属性
            title: 'marker1',
          },
        },
      ])
    },
    helpit() {
      const qs = require('qs')
      const tar = this.targetMarker
      this.$axios
        .post(
          'ss/help/addHelpInfo',
          qs.stringify({
            appeal_id: tar.appeal_id,
            title: tar.appeal_title,
            datetime: tar.end_time,
            status: 1,
          })
        )
        .then((res) => {
          if (res.data.status === 0) {
            this.$message({
              message: res.data.message,
              type: 'success',
              duration: 1500,
              offset: 400,
              center: true,
            })
          }
        })
      // this.$axios
      //   .post(
      //     '/ss/help/changestatus',
      //     qs.stringify({
      //       appeal_id: tar.appeal_id,
      //       status: 1,
      //     })
      //   )
      //   .then((res) => {
      //     if (res.data.status === 0) {

      //     }
      //   })
    },
    go() {
      // busRoutePlanning(this.current, tar, this.map)
      const target = this.targetMarker
      const tar = new TMap.LatLng(target.latitude, target.longitude)
      drivingRoutePlanning(this.current, tar, this.map, (res) => {
        this.routeDesc = res + '到达终点。'
      })
      const mid = new TMap.LatLng(
        0.5 * (target.latitude + this.current.lat),
        0.5 * (target.longitude + this.current.lng)
      )
      this.map.setCenter(mid)
      // 设置合适的zoom
      this.map.setZoom(13)
      this.desc = true
    },
    cancel() {
      this.showdesc = false
    },
  },
}
</script>

<style>
#map {
  width: 100vw;
  height: calc(100vh - 100px);
}
.search-box {
  background-color: #fff;
  opacity: 0.9;
}
</style>
