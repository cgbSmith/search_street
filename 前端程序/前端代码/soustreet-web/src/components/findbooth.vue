<template>
  <div>
    <div class="search-box">
      <el-row>
        <el-autocomplete
          style="width: 500px; margin-left: 10px"
          v-model="content"
          :fetch-suggestions="querySearch"
          placeholder="输入地址搜索附近的地摊"
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
      </el-row>

      <el-divider></el-divider>

      <el-row>
        <el-autocomplete
          style="width: 500px; margin-left: 10px"
          v-model="myplace"
          :fetch-suggestions="querySearch"
          placeholder="请输入你的起始位置"
          :trigger-on-focus="false"
          @select="handleSelect_2"
          value-key="title"
        ></el-autocomplete>
        <el-button @click="myposition">标记现在位置</el-button>
        <el-button @click="resetMark">删除目前位置标点</el-button>
      </el-row>
      <!-- <el-button type="text" @click="dialogVisible = true"
        >当前定位不准确?手动输入地址</el-button
      > -->

      <el-drawer
        title="路线描述"
        :visible.sync="drawer"
        :direction="direction"
        :append-to-body="true"
        :before-close="handleclose"
        size="25%"
      >
        <span style="white-space: pre-wrap">{{ routeDesc }}</span>
      </el-drawer>
    </div>
    <el-descriptions
      v-show="showdesc"
      title="商铺信息"
      style="position: fixed; z-index: 9999; background-color: #fff"
      border
    >
      <el-descriptions-item label="地摊名字">{{
        targetMarker && targetMarker.shop_name
      }}</el-descriptions-item>
      <el-descriptions-item label="地摊服务">{{
        targetMarker && targetMarker.business_scope
      }}</el-descriptions-item>
      <el-descriptions-item label="移动/固定地摊">{{
        targetMarker && targetMarker.is_mobile
      }}</el-descriptions-item>
      <el-descriptions-item label="人均消费">{{
        targetMarker && targetMarker.per_cost
      }}</el-descriptions-item>
      <el-descriptions-item label="营业执照">{{
        targetMarker && targetMarker.business_license_code
      }}</el-descriptions-item>
      <el-descriptions-item label="省份/城市/地区"
        >{{ targetMarker && targetMarker.province }}/{{
          targetMarker && targetMarker.city
        }}/{{ targetMarker && targetMarker.district }}</el-descriptions-item
      >
      <el-descriptions-item label="是否审核通过">{{
        targetMarker && targetMarker.enable_status
      }}</el-descriptions-item>
      <template slot="extra">
        <el-button
          @click="drawer = true"
          type="primary"
          style="margin-left: 16px"
          v-if="desc"
        >
          路线描述
        </el-button>
      </template>
      <template slot="extra"
        ><el-button type="primary" plain @click="go"
          >到这去</el-button
        ></template
      >
      <template slot="extra"
        ><el-button type="success" plain @click="cancel"
          >关闭信息</el-button
        ></template
      >
    </el-descriptions>
    <div id="map"></div>
  </div>
</template>

<script>
import { busRoutePlanning, drivingRoutePlanning } from "@/utils/routePlanning";
export default {
  data() {
    return {
      myplace: "",
      content: "",
      address: "",
      res: [],
      markerLayer: null,
      current: null,
      target: null,
      mytarget: null,
      search: null,
      suggest: null,
      dialogVisible: false,
      reposition: null,
      helpData: null,
      targetMarker: null,
      showdesc: false,
      drawer: false,
      desc: false,
      direction: "ltr",
      routeDesc: "",
      map: null,
      options: [
        {
          value: "0.5",
          label: "附近500m内",
        },
        {
          value: "1",
          label: "附近1km内",
        },
        {
          value: "3",
          label: "附近3km内",
        },
        {
          value: "5",
          label: "附近5km内",
        },
        {
          value: "10",
          label: "附近10km内",
        },
      ],
      value: "0.5",
    };
  },
  mounted() {
    this.init();
    // this.map.setCenter(this.current)
    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: "广东", // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    });
    console.log("mounted");
  },

  methods: {
    handleclose(done) {
      this.$confirm("确认关闭？").then((_) => {
        done();
      });
    },
    myposition() {
      console.log("确认位置", this.mytarget);
      var point = this.mytarget.location;
      this.markerLayer.updateGeometries([
        {
          id: "1", //用来记录 个人现在位置的点
          styleId: "myposition",
          position: new TMap.LatLng(point.lat, point.lng),
        },
      ]);
      this.map.setCenter(point);
    },
    resetMark() {
      this.markerLayer.remove(["1"]);
    },
    init() {
      //定义地图中心点坐标
      var geolocation = new qq.maps.Geolocation(
        "QWABZ-NGGCR-IEDWR-WWKHG-4NXDV-SXFU6",
        "i搜街"
      );
      // console.log(geolocation.getLocation);
      console.log("geolocation之前");
      geolocation.getLocation((res) => {
        console.log("geolocation之后");
        var center = new TMap.LatLng(res.lat, res.lng);
        this.current = center;
        //
        this.map = new TMap.Map(document.getElementById("map"), {
          center: center,
          zoom: 17.2,
          pitch: 0,
          rotation: 45,
        });
        console.log("geoloation之后");
        // console.log('this,map',this.map);
        this.markerLayer = new TMap.MultiMarker({
          map: this.map,
          styles: {
            current: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              color: "#DDFFF",
              verticalAlignment: "middle",
              size: 20,
              offset: { x: 0, y: 0 },
              angle: 0,
              alignment: "center",
              src: require("@/assets/point.png"), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),

            target: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              src: require("@/assets/target.png"), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),

            help: new TMap.MarkerStyle({
              width: 25, // 点标记样式宽度（像素）
              height: 35, // 点标记样式高度（像素）
              src: require("@/assets/help.png"), //图片路径
              //焦点在图片中的像素位置，一般大头针类似形式的图片以针尖位置做为焦点，圆形点以圆心位置为焦点
              anchor: { x: 16, y: 32 },
            }),
            myposition: new TMap.MarkerStyle({
              width: 40,
              height: 40,
              src: require("@/assets/myposition.png"),
              anchor: { x: 16, y: 32 },
            }),
          },

          geometries: [
            {
              id: "1", //用来记录 个人现在位置的点
              styleId: "myposition",
              position: new TMap.LatLng(res.lat, res.lng),
              // properties: {
              //   //自定义属性
              //   title: "marker1",
              // },
            },
          ],
        });
        // this.map.setCenter(this.current);
      });
    },

    go() {
      if (!this.mytarget)
        return this.$alert("当前位置为空，请输入您当前位置！");
      const target = this.targetMarker;
      console.log("targetMarker:", target);
      console.log("mytarget:", this.mytarget);
      const tar = new TMap.LatLng(target.latitude, target.longitude);
      const myposition = new TMap.LatLng(
        this.mytarget.location.lat,
        this.mytarget.location.lng
      );
      drivingRoutePlanning(myposition, tar, this.map, (res) => {
        this.routeDesc = res + "到达终点。";
      });
      console.log("routeDesc", this.routeDesc);
      console.log("tar", tar);
      console.log("myposition", myposition);
      this.desc = true;
    },

    querySearch(queryString, cb) {
      if (queryString) {
        this.res = [];
        this.suggest.getSuggestions({ keyword: queryString }).then((res) => {
          const data = res.data;
          data.forEach((item) => {
            let tmp = {};
            tmp.title = item.title;
            tmp.address = item.address;
            tmp.location = item.location;

            this.res.push(tmp);
          });
        });
      }
      cb(this.res);
    },

    handleSelect(item) {
      this.target = item;
      console.log("target", this.target);
    },
    handleSelect_2(item) {
      this.mytarget = item;
      console.log("mytarget:", this.mytarget);
    },
    dialogSelect(item) {
      this.reposition = item;
    },
    cancel() {
      this.showdesc = false;
    },
    is_mobile(temp) {
      if (temp.is_mobile === 1) temp.is_mobile = "移动";
      if (temp.is_mobile === 0) temp.is_mobile = "固定";
    },
    is_permit(temp) {
      if (temp.enable_status === 0) temp.enable_status = "审核中";
      if (temp.enable_status === 1) temp.enable_status = "许可";
      if (temp.enable_status === 2) temp.enable_status = "不许可";
    },
    btnClick() {
      console.log("res on btnfunction::", this.res);
      console.log("when btn.target", this.target);

      const location = this.target.location;
      const tar = new TMap.LatLng(location.lat, location.lng);
      let Interface = "/ss/findBooth?";
      Interface +=
        "latitude=" +
        location.lat +
        "&longitude=" +
        location.lng +
        "&scope=" +
        this.value;
      this.$axios.get(Interface).then((res) => {
        const data = res.data.data;
        this.helpData = data;
        console.log("res:", data);
        const length = data.length;
        console.log("length", length);

        for (let i = 0; i < length; ++i) {
          this.markerLayer.add([
            {
              id: data[i].shop_id, //点标记唯一标识，后续如果有删除、修改位置等操作，都需要此id
              styleId: "current", //指定样式id
              position: new TMap.LatLng(data[i].latitude, data[i].longitude), //点标记坐标位置
              content: data[i].shop_name,
              color: "#FF0000",
              // properties: {
              //   //自定义属性
              //   title: 'marker2',
              // },
            },
          ]);
          console.log("i", data[i].shop_id);
          console.log("data[i]", data[i]);
        }
        this.markerLayer.on("click", (evt) => {
          const appeal_id = evt.geometry.id;
          const data = this.helpData;

          for (let i in data) {
            if (data[i].shop_id == appeal_id && appeal_id !== 1) {
              this.targetMarker = data[i];
              console.log(appeal_id, "::::::", this.targetMarker);
              //  console.log(this.targetMarker);
              this.is_mobile(this.targetMarker);
              this.is_permit(this.targetMarker);
              if (!this.showdesc) this.showdesc = true;
              break;
            }
          }
        });
      });
      this.map.setCenter(tar);
    },
  },
};
</script>

<style>
#map {
  width: 90vw;
  height: calc(100vh - 100px);
}
.search-box {
  background-color: #fff;
  opacity: 0.9;
}
</style>
