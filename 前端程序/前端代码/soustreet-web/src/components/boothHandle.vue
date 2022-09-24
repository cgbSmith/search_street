<template>
  <el-scrollbar class="scrollbar">
    <div class="bgc">
      <div class="box">
        <el-form ref="form" :model="tableData" label-width="120px">
          <div>
            <h1>注册商铺信息编辑</h1>
            <el-divider></el-divider>
          </div>
          <el-form-item label="地摊名字">
            <el-input
              :disabled="tag"
              clearable
              v-model="tableData.shop_name"
            ></el-input>
          </el-form-item>
          <el-form-item label="主营业务">
            <el-input
              :disabled="tag"
              clearable
              v-model="tableData.business_scope"
            ></el-input>
          </el-form-item>
          <el-form-item label="人均消费水平">
            <el-input
              :disabled="tag"
              clearable
              v-model="tableData.per_cost"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="地摊类型" label-width="120px">
            <el-input
              :disabled="tag"
              clearable
              placeholder="修改请输入：固定或移动"
              v-model="btype"
            ></el-input>
          </el-form-item> -->

          <!-- 地摊类型选择 -->
          <el-form-item label="地摊类型" label-width="120px">
          <el-select v-model="value"  :disabled="tag"  placeholder="请选择">
            <el-option
              v-for="item in booth_options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          </el-form-item>
          <!-- ************************* -->
          <el-form-item label="营业执照编码">
            <el-input
              :disabled="tag"
              clearable
              v-model="tableData.business_license_code"
            ></el-input>
          </el-form-item>
          <el-form-item label="营业执照">
            <el-upload
              ref="upload"
              list-type="picture-card"
              action="#"
              :limit="1"
              :append-to-body="true"
              :auto-upload="false"
              :file-list="fileList"
              :on-change="onChange"
            >
              <i v-if="!disabled" slot="default" class="el-icon-plus"></i>
              <div slot="file" slot-scope="{ file }">
                <img
                  class="el-upload-list__item-thumbnail"
                  :src="file.url"
                  alt=""
                />

                <span class="el-upload-list__item-actions">
                  <span
                    class="el-upload-list__item-preview"
                    @click="handlePictureCardPreview(file)"
                  >
                    <i class="el-icon-zoom-in"></i>
                  </span>

                  <span
                    v-if="!disabled"
                    class="el-upload-list__item-delete"
                    @click="handleRemove(file)"
                  >
                    <i class="el-icon-delete"></i>
                  </span>
                </span>
              </div>
            </el-upload>
            <el-button type="primary" @click="upload"
              >上传图片到服务器</el-button
            >
            <el-form-item>
              <!-- <label style="color: #606266"
                >（若要重新提交或删除图片，请先点击“编辑”按钮,图片限制上传一张）</label
              > -->
              <el-alert
                title="若要重新提交或删除图片，请先点击“编辑”按钮,图片限制上传一张。更换图片后，需要点击“上传图片到服务器”"
                type="info"
                show-icon
                :closable="false"
              >
              </el-alert>
            </el-form-item>
            <el-form-item>
              <!-- <label style="color: #606266"
                >（更换图片后，需要点击“上传图片到服务器”）</label
              > -->
            </el-form-item>
            <el-dialog :visible.sync="pic_dialogVisible" :append-to-body="true">
              <img width="100%" :src="dialogImageUrl" alt="" />
            </el-dialog>
          </el-form-item>
          <!-- ********************** -->
          <el-form-item label="省份">
            <el-input
              :disabled="true"
              clearable
              v-model="tableData.province"
            ></el-input>
          </el-form-item>

          <el-form-item label="城市">
            <el-input
              :disabled="true"
              clearable
              v-model="tableData.city"
            ></el-input>
          </el-form-item>

          <el-form-item label="地区">
            <el-input
              :disabled="true"
              clearable
              v-model="tableData.district"
            ></el-input>
          </el-form-item>
          <el-form-item label="详细定位地址">
            <el-input
              :disabled="true"
              clearable
              v-model="tableData.full_address"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item label="经度">
        <el-input
          :disabled="tag"
          clearable
          v-model="tableData.longitude"
        ></el-input>
      </el-form-item>
      <el-form-item label="纬度">
        <el-input
          :disabled="tag"
          clearable
          v-model="tableData.latitude"
        ></el-input>
      </el-form-item> -->
          <!-- ************* -->
          <el-form-item>
            <el-button
              @click.once="relocation"
              size="small"
              type="primary"
              id="btn"
              :disabled="this.btntag"
              >重新定位</el-button
            >
          </el-form-item>
          <el-form-item>
            <el-alert
              title="每次修改信息只能使用重新定位功能一次！请谨慎使用"
              type="warning"
              show-icon
              :closable="false"
            >
            </el-alert>
          </el-form-item>
          <el-dialog
            :visible.sync="dialogVisible"
            width="50%"
            :append-to-body="true"
          >
            <el-form>
              <el-form-item label="省/市/区">
                <el-cascader
                  :options="options"
                  v-model="form.selectedOptions"
                  @change="handleChange"
                  ref="cplace"
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址信息">
                <el-autocomplete
                  :fetch-suggestions="querySearch"
                  placeholder="请输入详细地址"
                  style="width: 80%"
                  v-model="form.address"
                  :trigger-on-focus="false"
                  @select="handleSelect"
                  value-key="title"
                >
                </el-autocomplete>
                <!-- 定位 -->
                <el-button @click="location">定位</el-button>
              </el-form-item>
              <el-form-item>
                <i class="el-icon-caret-bottom"></i>
              </el-form-item>
              <el-form-item>
                <div id="map"></div>
              </el-form-item>
              <el-button type="primary" @click="onconfirm"> 确认 </el-button>
            </el-form>
          </el-dialog>

          <!-- <el-form-item> -->

          <!-- </el-form-item> -->

          <!-- ************ -->
          <el-form-item label="地摊审核结果">
            <el-input
              :disabled="true"
              clearable
              v-model="tableData.enable_status"
            ></el-input>
          </el-form-item>
          <!-- <el-form-item>
      <el-button type="primary" @click="pic_dialog=true">营业执照图片修改</el-button>
      </el-form-item> -->
          <el-form-item>
            <el-alert
              title="基本信息、图片信息和位置信息修改后，要点击“提交”按钮提交本次修改！"
              type="danger"
              show-icon
              :closable="false"
            >
            </el-alert>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="(tag = false), (disabled = false)"
              >编辑</el-button
            >
            <el-button type="danger" @click="onSubmit">提交</el-button>
            <el-button type="warning" @click="onback">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
import { regionData } from "element-china-area-data";
import qs from "qs";
export default {
  name: "boothHandle",
  data() {
    return {
      baseurl: "",
      tableData: {},
      tag: true,
      srcList: [],
      // ****
      dialogImageUrl: "",
      disabled: true,
      fileList: [],
      filelist: [],
      picurl: "",
      pic_dialog: false,
      // ***********地理位置
      form: {
        selectedOptions: "",
        // selectedOptions_2: ""
        district: " ",
        city: " ",
        province: "",
        address: "",
        latitude: null,
        longitude: null,
      },
      options: regionData,
      res: [],
      suggest: null,
      target: null,
      map: null,
      dialogVisible: false,
      pic_dialogVisible: false,
      btntag: false,
      //地毯的类型
      btype: "",
      booth_options:[
        {
          value:"1",
          label:"移动地摊"
        },
        {
          value:"0",
          label:"固定地摊"
        }
        ],
        value:""
    };
  },

  methods: {
    onconfirm() {
      this.$message({
        message: "重新定位成功！",
        type: "success",
        offset: 400,
        center: true,
        duration: 1000,
      });
      this.dialogVisible = false;
      this.btntag = true;
    },
    relocation() {
      this.dialogVisible = true;
      this.$nextTick(() => {
        this.init();
      });
      // this.init();
    },
    location() {
      const Nodes = this.$refs["cplace"].getCheckedNodes()[0];
      this.form.district = Nodes.label;
      this.form.city = Nodes.parent.label;
      this.form.province = Nodes.parent.parent.label;
      this.tableData.province = this.form.province;
      this.tableData.city = this.form.city;
      this.tableData.district = this.form.district;
      console.log(
        this.form.province,
        "+",
        this.form.city,
        "+",
        this.form.district
      );
      const location = this.target.location;
      this.form.latitude = location.lat;
      this.form.longitude = location.lng;
      const tar = new TMap.LatLng(location.lat, location.lng);
      this.map.setCenter(tar);
      console.log("this form at location", this.form);
      console.log("this table", this.tableData);
      console.log("this formdata", this.form);
      this.tableData.latitude = this.form.latitude;
      this.tableData.longitude = this.form.longitude;
      this.tableData.full_address = this.form.address;
    },
    handleChange(value) {
      //console.log(value);
    },
    init() {
      console.log("this init函数执行");
      //    this.mapShow = true;
      let center = new TMap.LatLng(39.98412, 116.307484);
      // this.$nextTick(() => {
      //   this.$set(this.map, null);
      //   // this.init();
      // });
      this.map = new TMap.Map(document.getElementById("map"), {
        center: center, //设置地图中心点坐标
        zoom: 17.2, //设置地图缩放级别
        pitch: 43.5, //设置俯仰角
        rotation: 45, //设置地图旋转角度
      });
    },
    handleSelect(item) {
      this.target = item;
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

    handleRemove(file) {
      console.log("1fileList", this.fileList[0]);
      this.$refs.upload.handleRemove(file);
      this.fileList.pop();
      console.log("last fileList", this.fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      console.log("dialogimageurl", this.dialogImageUrl);
      this.pic_dialogVisible = true;
    },
    onChange(file, filelist) {
      //file.raw 才是真实的 file 对象
      this.filelist.push(file.raw);
      console.log("filelist", this.filelist);
      console.log("fileList", this.fileList);
    },
    // **********
    judge() {
      console.log("judge");
      if (this.tableData.enable_status === 0)
        this.tableData.enable_status = "审核中";
      if (this.tableData.enable_status === 1)
        this.tableData.enable_status = "许可";
      if (this.tableData.enable_status === 2)
        this.tableData.enable_status = "不许可";
    },

    addRequest() {
      console.log("--------", this.$route.params.shop_id);
      this.$axios
        .post(
          "/ss/boothHandle",
          qs.stringify({ shop_id: this.$route.params.shop_id })
        )
        .then((res) => {
          console.log("+++++___)))))", res);
          this.tableData = res.data.results[0];
          console.log("this.table", this.tableData);
          this.judge();
          if (this.tableData.is_mobile === 1) this.value = "1";
          if (this.tableData.is_mobile === 0) this.value = "0";
          // console.log("this.btype", this.btype);

          // this.changeNum()
          this.baseurl =
            "http://127.0.0.1:3007/" + this.tableData.business_license_img;
          console.log("baseurl", this.baseurl);
          this.srcList.push(this.baseurl);
          console.log("srclist", this.srcList[0]);
          this.fileList.push({ name: "pic", url: this.baseurl });
          console.log("fileList", this.fileList);
        });
    },

    onback() {
      this.$router.push("/boothManage");
    },

    upload() {
      let formData = new FormData();
      this.filelist.forEach((file) => {
        console.log("uid", file.uid);
        console.log("file", file);
        formData.append("file", file);
      });
      formData.append("path", "pictures/");
      this.$axios
        .post("http://127.0.0.1:3007/ss/getpic", formData)
        .then((res) => {
          if (res.data.status === 0)
            this.$message({
              message: res.data.message,
              type: "success",
              offset: 400,
              center: true,
              duration: 3000,
            });
          this.picurl = res.data.path;
          console.log("this.picurl", this.picurl);
          this.tableData.business_license_img = this.picurl;
        });
    },

    onSubmit() {
      this.disabled = true;
      this.tag = true;
      // console.log("this.btype", this.btype);
      if (this.value === "1") this.tableData.is_mobile = 1;
      if (this.value === "0") this.tableData.is_mobile = 0;
      console.log("this.tableData.ismobile", this.tableData.is_mobile);

      console.log("submit", this.tableData);
      this.$axios
        .post(
          //数据库端的修改
          "/ss/boothModify",
          qs.stringify(this.tableData)
        )
        .then((res) => {
          this.$message({
            message: res.data.message,
            type: "success",
            offset: 400,
            center: true,
            duration: 1000,
          });
        })
        .catch((e) => {}),
        this.onback();
    },
  },
  mounted() {
    this.addRequest();
    console.log("srclist", this.srcList[0]);
    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: "广东", // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    });
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
#map {
  width: 900px;
  height: 400px;
}
.bgc {
  /* position: relative; */
  width: 100%;
  height: 100%;
  /* background:none; */
  background-color: #fff;
}
.box {
  width: 100%;
  height: 100%;
  background: #fff;
  display: flex;
  justify-content: center;
}
</style>
