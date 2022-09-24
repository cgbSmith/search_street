<template>
  <el-scrollbar class="scrollbar">
    <div class="bgc">
      <div class="box">
        <el-form>
          <h3 id="fname">地摊注册</h3>
          <el-divider></el-divider>
          <!-- #########注册方式选择 -->
          <el-radio-group v-model="labelPosition" size="small" fill="#67C23A">
            <el-radio-button label="fixed">固定地摊注册</el-radio-button>
            <el-radio-button label="moved">移动地摊注册</el-radio-button>
          </el-radio-group>
          <!-- 固定商铺注册   -->
          <el-form v-if="labelPosition === 'fixed'">
            <el-form-item>
              <label style="color: #606266">商铺名字</label>
              <el-input
                v-model="boothName"
                :class="{ rborder: !userTips.isHide }"
                placeholder="请输入注册商铺名"
                @blur="uBlur"
                clearable
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: userTips.isHide }">{{ userTips.val }}</p>

            <el-form-item>
              <label style="color: #606266">主营业务</label>
              <el-input
                v-model="bussinessScope"
                :class="{ rborder: !numberTips.isHide }"
                placeholder="请输入主营业务"
                @blur="pBlur"
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: numberTips.isHide }">{{ numberTips.val }}</p>

            <el-form-item>
              <label style="color: #606266">人均消费</label>
              <el-input
                v-model="cost"
                :class="{ rborder: !costTips.isHide }"
                placeholder="请填写人均消费(/元)"
                @blur="cBlur"
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: costTips.isHide }">{{ costTips.val }}</p>

            <!-- 营业执照编码 -->
            <el-form-item>
              <label style="color: #606266">营业执照编码</label>
              <el-input
                v-model="license"
                :class="{ rborder: !MliTips.isHide }"
                placeholder="请输入您的营业执照编码"
                @blur="licBlur"
                clearable
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: MliTips.isHide }">{{ MliTips.val }}</p>

            <!-- 上传营业执照 -->
            <el-form-item>
              <label style="color: #606266"
                >请点击上传营业执照,最多只上传一张</label
              >
              <el-upload
                ref="upload"
                class="upload-demo"
                :auto-upload="false"
                action="'none'"
                list-type="picture-card"
                :on-remove="onRemove"
                :on-change="onChange"
                :limit="1"
                :on-preview="handlePreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              >
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            </el-form-item>

            <!-- 定位功能！！！  -->
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
              <el-button @click="location">定位</el-button>
            </el-form-item>
            <i class="el-icon-caret-bottom"></i>

            <div id="map"></div>
            <el-form-item>
              <el-button class="btnSize" @click="btnClick">注册</el-button>
              <!-- <a href="" @click="aClick">已有店铺,去登录</a> -->
            </el-form-item>

            <el-form-item>
              <!-- <div class="size">
                注册即代表同意 <a href="">《注册协议》</a>和<a href=""
                  >《隐私政策》</a
                >
              </div> -->
            </el-form-item>
            <el-divider></el-divider>
          </el-form>

          <!-- 移动商家注册 -->
          <el-form v-if="labelPosition === 'moved'">
            <el-form-item>
              <label style="color: #606266">商铺名字</label>
              <el-input
                v-model="boothName_2"
                :class="{ rborder: !userTips_2.isHide }"
                placeholder="请输入注册商铺名"
                @blur="uBlur_2"
                clearable
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: userTips_2.isHide }">{{ userTips_2.val }}</p>

            <el-form-item>
              <label style="color: #606266">主营业务</label>
              <el-input
                v-model="bussinessScope_2"
                :class="{ rborder: !numberTips_2.isHide }"
                placeholder="请输入主营业务"
                @blur="pBlur_2"
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: numberTips_2.isHide }">
              {{ numberTips_2.val }}
            </p>

            <el-form-item>
              <label style="color: #606266">人均消费</label>
              <el-input
                v-model="cost_2"
                :class="{ rborder: !costTips_2.isHide }"
                placeholder="请填写人均消费(/元)"
                @blur="cBlur_2"
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: costTips_2.isHide }">{{ costTips_2.val }}</p>

            <!-- 营业执照编码 -->
            <el-form-item>
              <label style="color: #606266">营业执照编码</label>
              <el-input
                v-model="license_2"
                :class="{ rborder: !MliTips_2.isHide }"
                placeholder="请输入您的营业执照编码"
                @blur="licBlur_2"
                clearable
              ></el-input>
            </el-form-item>
            <p :class="{ isShow: MliTips_2.isHide }">{{ MliTips_2.val }}</p>

            <!-- 上传营业执照 -->
            <el-form-item>
              <label style="color: #606266"
                >请点击上传营业执照,最多只上传一张</label
              >
              <el-upload
                ref="upload"
                class="upload-demo"
                :auto-upload="false"
                action="'none'"
                list-type="picture-card"
                :on-remove="onRemove"
                :on-change="onChange"
                :limit="1"
                :on-preview="handlePreview"
              >
                <i class="el-icon-plus"></i>
              </el-upload>
              <el-button
                style="margin-left: 10px"
                size="small"
                type="success"
                @click="submitUpload"
                >上传到服务器</el-button
              >
              <el-dialog :visible.sync="dialogVisible">
                <img width="100%" :src="dialogImageUrl" alt="" />
              </el-dialog>
              <!-- <el-button size="small" type="primary">点击上传</el-button> -->
            </el-form-item>

            <!-- 定位功能！！！ -->
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
            <i class="el-icon-caret-bottom"></i>

            <div id="map"></div>
            <el-form-item>
              <el-button class="btnSize" @click="btnClick_2">注册</el-button>
              <!-- <a href="" @click="aClick">已有店铺,去登录</a> -->
            </el-form-item>

            <el-form-item>
              <!-- <span class="size"
                >注册即代表同意 <a href="">《注册协议》</a>和<a href=""
                  >《隐私政策》</a
                >
              </span> -->
            </el-form-item>
          </el-form>
        </el-form>
      </div>
    </div>
  </el-scrollbar>
</template>



<script>
import { regionData } from "element-china-area-data";
const qs = require("qs");
// import { setCode, getCode } from "../utils/code";
// console.log(this.labelPosition)
export default {
  name: "boothRegister",
  data() {
    return {
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
      // selectedOptions: [],
      // selectedOptions_2: [],
      res: [],
      suggest: null,
      target: null,

      //**** */
      dialogImageUrl: "",
      dialogVisible: false,
      fileList: [],

      //***** */
      labelPosition: "moved",
      map: null,

      //移动和固定端的错误提示相关信息
      is_move: 0,
      license: "",
      license_2: "",
      MliTips: { val: "必填字段", isHide: true },
      MliTips_2: { val: "必填字段", isHide: true },
      boothName: "",
      boothName_2: "",
      bussinessScope: "",
      bussinessScope_2: "",
      cost: "",
      cost_2: "",
      code: "",
      code_2: "",
      userTips: { val: "必填字段", isHide: true },
      userTips_2: { val: "必填字段", isHide: true },
      numberTips: { val: "必填字段", isHide: true },
      numberTips_2: { val: "必填字段", isHide: true },
      costTips: { val: "必填字段", isHide: true },
      costTips_2: { val: "必填字段", isHide: true },
      phoneTips: { val: "必填字段", isHide: true },
      phoneTips_2: { val: "必填字段", isHide: true },
      verificationTips: { val: "必填字段", isHide: true },
      verificationTips_2: { val: "必填字段", isHide: true },
      id: "",
      rtime: "",
    };
  },
  mounted() {
    // console.log(localStorage.token);
    console.log("token", this.$store.state);

    this.init();
    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: "广东", // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    });
  },
  // watch: {
  //   labelPosition: {
  //     immediate: false,
  //     handler(value) {
  //       this.init();
  //       alert('1');
  //     },
  //   },
  // },

  methods: {
    // 定位功能函数
    init() {
      console.log("this init函数执行");
      //    this.mapShow = true;
      const center = new TMap.LatLng(39.98412, 116.307484);
      this.map = new TMap.Map(document.getElementById("map"), {
        center: center, //设置地图中心点坐标
        zoom: 17.2, //设置地图缩放级别
        pitch: 43.5, //设置俯仰角
        rotation: 45, //设置地图旋转角度
      });
      // let markerLayer = new TMap.MultiMarker({
      //   id: "marker-layer",
      //   map: this.map,
      // });

      //监听点击事件添加marker
      // map.on("click", (evt) => {
      //   markerLayer.add({
      //     position: evt.latLng,
      //   });
      // });
    },

    handleChange(value) {
      //console.log(value);
    },

    onChange(file, filelist) {
      //file.raw 才是真实的 file 对象
      this.fileList.push(file.raw);
      console.log("file.raw", file.raw);
    },
    //文件列表移除文件时的钩子
    onRemove(file, fileList) {
      //file.raw 才是真实的 file 对象
      this.fileList.splice(this.fileList.indexOf(file.raw), 1);
      console.log("onremove");
    },

    onChange(file, filelist) {
      //file.raw 才是真实的 file 对象
      console.log("onchange");

      this.fileList.push(file.raw);
      console.log(this.fileList);
    },
    // 上传文件函数集合@@
    handleProgress(e, file, filelist) {
      console.log("handleProgress", e, file, filelist);
      
    },

    handleRemove(file, filelist) {
      console.log("handleRemove:", file, filelist);
    },
    handlePreview(file) {
      // console.log("handlepreview");
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
      // console.log(file);
      // console.log("diaurl", this.dialogImageUrl);
      console.log(file);
    },
    submitUpload() {
      const formData = new FormData();
      console.log(this.fileList);

      this.fileList.forEach((file) => {
        console.log("uid", file.uid);
        formData.append("file", file);
      });
      console.log(formData);
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
          this.dialogImageUrl = res.data.path;
          console.log("this.dialogimag", this.dialogImageUrl);
        });
    },
    handleSuccess(e, file, filelist) {
      console.log("handleSuccess");
      console.log("++++++++", e, file, filelist);
      console.log(
        "上传文件的url是",
        file.url,
        " 上传文件的url和文件名",
        file.name
      );
      this.dialogImageUrl = file.url;
      console.log("dialog", this.dialogImageUrl);
    },
    //*********************** */
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
    location() {
      const Nodes = this.$refs["cplace"].getCheckedNodes()[0];
      this.form.district = Nodes.label;
      this.form.city = Nodes.parent.label;
      this.form.province = Nodes.parent.parent.label;
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
    },
    // handleRemove(file) {
    //   console.log(file);
    // this.fileList = this.fileList.filter((p) => {
    //   return p.name != file.name;
    // });
    // },

    //上传文件函数集合end

    isPhone(str) {
      const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
      return reg.test(str);
    },
    aClick() {
      this.$router.push("/login").catch(() => {});
    },

    // 营业执照框失去焦点执行函数
    licBlur() {
      const len = this.license.length;
      if (!this.MliTips.isHide && len >= 6 && len <= 11) {
        this.MliTips.isHide = true;
      } else if (!len) {
        this.MliTips.val = "必填字段";
        this.MliTips.isHide = false;
      } else if (len < 6 || len > 11) {
        this.MliTips.val = "营业执照编码为6~11位";
        this.MliTips.isHide = false;
      }
    },
    // 营业执照框失去焦点执行函数
    licBlur_2() {
      const len = this.license_2.length;
      if (!this.MliTips_2.isHide && len >= 6 && len <= 11) {
        this.MliTips_2.isHide = true;
      } else if (!len) {
        this.MliTips_2.val = "必填字段";
        this.MliTips_2.isHide = false;
      } else if (len < 6 || len > 11) {
        this.MliTips_2.val = "营业执照编码为6~11位";
        this.MliTips_2.isHide = false;
      }
    },

    uBlur() {
      const len = this.boothName.length;
      if (!this.userTips.isHide && len >= 3 && len <= 10) {
        this.userTips.isHide = true;
      } else if (!len) {
        this.userTips.val = "必填字段";
        this.userTips.isHide = false;
      } else if (len < 3 || len > 10) {
        this.userTips.val = "商铺名字要求在3-10个字符之间哦";
        this.userTips.isHide = false;
      }
    },
    uBlur_2() {
      const len = this.boothName_2.length;
      if (!this.userTips_2.isHide && len >= 3 && len <= 10) {
        this.userTips_2.isHide = true;
      } else if (!len) {
        this.userTips_2.val = "必填字段";
        this.userTips_2.isHide = false;
      } else if (len < 3 || len > 10) {
        this.userTips_2.val = "商铺名字要求在3-10个字符之间哦";
        this.userTips_2.isHide = false;
      }
    },
    pBlur() {
      const len = this.bussinessScope.length;
      if (!this.numberTips.isHide && len > 0 && len < 30) {
        this.numberTips.isHide = true;
      } else if (!len) {
        this.numberTips.val = "必填字段";
        this.numberTips.isHide = false;
      } else if (len < 0 || len > 30) {
        this.numberTips.val = "要求字数在0~30字以内";
        this.numberTips.isHide = false;
      }
    },
    pBlur_2() {
      const len = this.bussinessScope_2.length;
      if (!this.numberTips_2.isHide && len > 0 && len < 30) {
        this.numberTips_2.isHide = true;
      } else if (!len) {
        this.numberTips_2.val = "必填字段";
        this.numberTips_2.isHide = false;
      } else if (len < 0 || len > 30) {
        this.numberTips_2.val = "要求字数在0~30字以内";
        this.numberTips_2.isHide = false;
      }
    },
    cBlur() {
      const cost = this.cost;
      const len = this.cost.toString().length;
      // console.log(len);
      if (!this.costTips.isHide && cost > 0) {
        this.costTips.isHide = true;
      } else if (!len) {
        this.costTips.val = "必填字段";
        this.costTips.isHide = false;
      } else if (cost <= 0) {
        this.costTips.val = "数值不能小于或等于0";
        this.costTips.isHide = false;
      }
    },
    cBlur_2() {
      const cost = this.cost_2;
      const len = this.cost_2.toString().length;
      // console.log(len);
      if (!this.costTips_2.isHide && cost > 0) {
        this.costTips_2.isHide = true;
      } else if (!len) {
        this.costTips_2.val = "必填字段";
        this.costTips_2.isHide = false;
      } else if (cost <= 0) {
        this.costTips_2.val = "数值不能小于或等于0";
        this.costTips_2.isHide = false;
      }
    },
    eBlur() {
      const len = this.phone.length;
      if (!this.phoneTips.isHide && this.isPhone(this.phone)) {
        this.phoneTips.isHide = true;
      } else if (!len) {
        this.phoneTips.val = "必填字段";
        this.phoneTips.isHide = false;
      } else if (!this.isPhone(this.phone)) {
        this.phoneTips.val = "手机格式错误";
        this.phoneTips.isHide = false;
      }
    },
    eBlur_2() {
      const len = this.phone_2.length;
      if (!this.phoneTips_2.isHide && this.isPhone(this.phone_2)) {
        this.phoneTips_2.isHide = true;
      } else if (!len) {
        this.phoneTips_2.val = "必填字段";
        this.phoneTips_2.isHide = false;
      } else if (!this.isPhone(this.phone_2)) {
        this.phoneTips_2.val = "手机格式错误";
        this.phoneTips_2.isHide = false;
      }
    },
    vBlur() {
      const len = this.code.length;
      if (!len) {
        this.verificationTips.val = "必填字段";
        this.verificationTips.isHide = false;
      } else {
        this.verificationTips.isHide = true;
      }
    },
    vBlur_2() {
      const len = this.code_2.length;
      if (!len) {
        this.verificationTips_2.val = "必填字段";
        this.verificationTips_2.isHide = false;
      } else {
        this.verificationTips_2.isHide = true;
      }
    },
    // gettime() {

    // },

    // padZero(n) {
    //   return n > 9 ? n : "0" + n;
    // },
    btnClick() {
      // console.log(this.time);
      console.log("this.dialogimageurl", this.dialogImageUrl);

      if (this.labelPosition == "fixed") this.is_move = 0;
      if (this.labelPosition == "moved") this.is_move = 1;
      // console.log('ello');
      this.$axios
        .post(
          "/ss/boothRegister",
          qs.stringify({
            boothName: this.boothName,
            bussinessScope: this.bussinessScope,
            cost: this.cost,
            labelPosition: this.is_move,
            license: this.license,
            district: this.form.district,
            city: this.form.city,
            province: this.form.province,
            address: this.form.address,
            latitude: this.form.latitude,
            longitude: this.form.longitude,
            business_license_img: this.dialogImageUrl,
          })
        )
        .then((res) => {
          //  console.log(res);
          if (res.data.status === 0) {
            this.$message({
              message: res.data.message,
              type: "success",
              offset: 400,
              center: true,
              duration: 1000,
            });
            this.$router.push("/boothManage");
          }
        });
    },
    btnClick_2() {
      // console.log('ello');
      if (this.labelPosition == "fixed") this.is_move = 0;
      if (this.labelPosition == "moved") this.is_move = 1;
      this.$axios
        .post(
          "/ss/boothRegister",
          qs.stringify({
            boothName: this.boothName_2,
            bussinessScope: this.bussinessScope_2,
            cost: this.cost_2,
            labelPosition: this.is_move,
            license: this.license_2, //无执照
            district: this.form.district,
            city: this.form.city,
            province: this.form.province,
            address: this.form.address,
            latitude: this.form.latitude,
            longitude: this.form.longitude,
            business_license_img: this.dialogImageUrl,
            // user_id:this.$store.userInfo
          })
        )
        .then((res) => {
          if (res.data.status === 0) {
            this.$message({
              message: res.data.message,
              type: "success",
              offset: 400,
              center: true,
              duration: 1000,
            });
            this.$router.push("/boothManage");
          }
        });
      console.log("this form at btn2", this.form);
    },
  },

  computed: {
    getec() {
      if (!this.isEmit) {
        return this.ec;
      }
      return `${this.ec}(${this.time})`;
      // return this.ec + '(' + this.time + ')';
    },
    getec_2() {
      if (!this.isEmit_2) {
        return this.ec_2;
      }
      return `${this.ec_2}(${this.time_2})`;
      // return this.ec + '(' + this.time + ')';
    },
  },
  // components:{Amap}
};
</script>

<style scoped>
#fname {
  font-size: 25px;
}
#map {
  width: 900px;
  height: 400px;
}
.scrollbar {
  width: 100%;
  height: 100%;
  justify-content: right;
  overflow-y: auto;
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
.btnSize {
  width: 150px;
  border-radius: 10px;
  background-color: #eee;
  margin: 10px 10px 10px 0;
}
p {
  /* margin: 0; */
  margin: -20px 0 -10px 5px;
  font-size: 10px;
  color: red;
}
.isShow {
  visibility: hidden;
}
.rborder >>> input {
  border-color: red;
}
.size {
  font-size: 10px;
  margin: 2ex;
}
</style>
