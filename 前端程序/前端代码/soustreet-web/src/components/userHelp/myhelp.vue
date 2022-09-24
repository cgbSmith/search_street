<template>
  <div style="height: calc(100vh - 60px); overflow-y: scroll" v-loading="loading">
    <el-empty v-if="isEmpty" :image-size="500"></el-empty>
    <el-card
      class="box-card"
      v-for="item in data"
      :key="item.appeal_id"
      id="item.appeal_id"
      shadow="always"
    >
      <div slot="header" class="clearfix">
        <span>{{ item.appeal_title }}</span>
        <el-tag style="float: right; margin-top: -5px" :type="tagType(item.appeal_status)">{{
          tagContent[item.appeal_status]
        }}</el-tag>
        <el-button
          v-if="item.appeal_status === 0"
          style="float: right; padding: 3px 0; margin-right: 15px"
          type="text"
          @click="cancelClick(item)"
          >取消求助</el-button
        >
        <el-button
          v-if="item.appeal_status === 0"
          style="float: right; padding: 3px 0; margin-right: 15px"
          type="text"
          @click="alterClick(item)"
          >修改求助</el-button
        >
        <el-button
          v-if="item.appeal_status === 1"
          style="float: right; padding: 3px 0; margin-right: 15px"
          type="text"
          @click="finishClick(item)"
          >确认完成</el-button
        >
      </div>
      <div>
        {{ '求助内容：' + item.appeal_content }}
      </div>
      <div>
        {{ '求助地址：' + item.full_address }}
      </div>
      <div>
        {{ '联系电话：' + item.phone }}
      </div>
      <div>
        {{ '报酬：' + item.sou_coin }}
      </div>
      <div>
        <time>{{ '截止时间：' + item.end_time }}</time>
      </div>
    </el-card>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" append-to-body>
      <span>是否要删除该求助订单?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deletehelp">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="修改求助" :visible.sync="appealVisable" width="30%" append-to-body>
      <el-form ref="form" :model="form" label-width="80px" style="position: relative">
        <el-form-item label="求助标题">
          <el-input v-model="form.title" class="einput"></el-input>
        </el-form-item>
        <el-form-item label="求助内容">
          <el-input type="textarea" v-model="form.content" class="einput"></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" class="einput"></el-input>
        </el-form-item>
        <div>
          <img src="@/assets/help/coin.png" />
          <img src="@/assets/help/time.png" style="margin-left: 205px" />
        </div>
        <el-form-item>
          <el-input placeholder="搜币" v-model="form.coin" style="width: 70px"></el-input>
          <el-date-picker
            v-model="form.datetime"
            style="margin-left: 90px"
            type="datetime"
            placeholder="求助结束时间"
          ></el-date-picker>
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
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="appealVisable = false">取 消</el-button>
        <el-button type="primary" @click="modifyhelp">确定修改</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="finishVisible" width="30%" append-to-body>
      <span>是否确认该求助已完成?</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="finishVisible = false">取 消</el-button>
        <el-button type="primary" @click="finishHelp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const qs = require('qs')
const type = ['info', '', 'success', 'warning', 'danger']
export default {
  data() {
    return {
      data: null,
      tagContent: ['等待帮手', '已确定帮手', '已完成', '已超时', '已禁止'],
      dialogVisible: false,
      appealVisable: false,
      finishVisible: false,
      form: {
        title: '',
        content: '',
        phone: '',
        coin: '',
        address: '',
        datetime: null,
        latitude: null,
        longitude: null,
      },
      isEmpty: false,
      suggest: null,
      nowId: null,
      loading: true,
    }
  },
  methods: {
    tagType(i) {
      return type[i]
    },
    deletehelp() {
      this.dialogVisible = false
      this.$axios
        .post(
          '/ss/delByAppealid',
          qs.stringify({
            appeal_id: this.nowId,
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
          this.data = this.data.filter((item) => item.appeal_id != this.nowId)
        })
    },
    modifyhelp() {
      const form = this.form
      this.$axios
        .post(
          '/ss/modifyAppeal',
          qs.stringify({
            appeal_id: this.nowId,
            title: form.title,
            content: form.content,
            phone: form.phone,
            datetime: form.datetime,
            coin: form.coin,
            address: form.address,
            latitude: form.latitude,
            longitude: form.longitude,
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
            this.appealVisable = false
            location.reload()
          }
        })
    },
    finishHelp() {
      this.$axios.post('/ss/finishHelp', qs.stringify({ appeal_id: this.nowId })).then((res) => {
        if (res.data.status === 0) {
          this.$message({
            message: res.data.message,
            type: 'success',
            duration: 1500,
            offset: 400,
            center: true,
          })
          this.finishVisable = false
          location.reload()
        }
      })
    },
    alterClick(item) {
      this.nowId = item.appeal_id
      this.appealVisable = true

      this.form.title = item.appeal_title
      this.form.content = item.appeal_content
      this.form.phone = item.phone
      this.form.datetime = item.end_time
      this.form.coin = item.sou_coin
      this.form.address = item.full_address
      this.form.latitude = item.latitude
      this.form.longitude = item.longitude
    },
    finishClick(item) {
      this.finishVisible = true
      this.nowId = item.appeal_id
    },
    cancelClick(item) {
      this.dialogVisible = true
      this.nowId = item.appeal_id
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
      const location = item.location
      this.form.latitude = location.lat
      this.form.longitude = location.lng
      console.log(this.form.latitude, this.form.longitude)
    },
  },
  conputed: {},
  mounted() {
    this.suggest = new TMap.service.Suggestion({
      // 新建一个关键字输入提示类
      pageSize: 10, // 返回结果每页条目数
      region: '广东', // 限制城市范围
      regionFix: true, // 搜索无结果时是否固定在当前城市
    })
    this.$axios.get('/ss/getMyHelp').then((res) => {
      this.loading = false
      this.data = res.data.data
      this.isEmpty = this.data.length > 0 ? false : true
    })
  },
}
</script>

<style scoped>
img {
  position: absolute;
  margin-left: 45px;
  margin-top: 6px;
  width: 28px;
  height: 28px;
}
</style>
