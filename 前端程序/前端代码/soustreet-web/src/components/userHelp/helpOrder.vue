<template>
  <div v-loading="loading">
    <el-empty v-if="isEmpty" :image-size="500"></el-empty>
    <el-card class="box-card" shadow="always" v-for="item in data" :key="item.help_id">
      <div slot="header" class="clearfix">
        <span>{{ item.appeal_title }}</span>
        <el-button
          style="float: right; padding: 3px 0"
          type="text"
          @click="queryDetail(item.appeal_id)"
          >查看详情</el-button
        >
      </div>
      <div>
        <time class="time">{{ '截止时间：' + item.end_time }}</time>
      </div>
    </el-card>
    <el-dialog title="帮助详情" :visible.sync="isShow" width="30%" append-to-body>
      <el-form ref="form" :model="form" label-width="80px" style="position: relative">
        <el-form-item label="求助标题">
          <el-input v-model="form.title" class="einput" disabled></el-input>
        </el-form-item>
        <el-form-item label="求助内容">
          <el-input type="textarea" v-model="form.content" class="einput" disabled></el-input>
        </el-form-item>
        <el-form-item label="联系电话">
          <el-input v-model="form.phone" class="einput" disabled></el-input>
        </el-form-item>
        <div>
          <img src="@/assets/help/coin.png" />
          <img src="@/assets/help/time.png" style="margin-left: 205px" />
        </div>
        <el-form-item>
          <el-input placeholder="搜币" v-model="form.coin" style="width: 70px" disabled></el-input>
          <el-input
            v-model="form.datetime"
            style="margin-left: 90px; width: 220px"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="form.address" class="einput" disabled></el-input>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loading: true,
      data: null,
      isEmpty: false,
      detail: null,
      isShow: false,
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
    }
  },
  methods: {
    queryDetail(id) {
      const Interface = '/ss/getHelpOrderByHelpId?appeal_id=' + id
      this.$axios.get(Interface).then((res) => {
        if (res.data.status === 0) {
          const detail = res.data.data
          console.log('detail:', detail)
          this.isShow = true
          this.form.title = detail.appeal_title
          this.form.content = detail.appeal_content
          this.form.phone = detail.phone
          this.form.coin = detail.sou_coin
          this.form.address = detail.full_address
          this.form.datetime = detail.end_time
          this.form.latitude = detail.latitude
          this.form.longitude = detail.longitude
        }
      })
    },
  },
  mounted() {
    this.$axios.get('/ss/getHelpByUId').then((res) => {
      this.loading = false
      this.data = res.data.data
      this.isEmpty = this.data.length > 0 ? false : true
    })
  },
}
</script>

<style scoped>
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: '';
}

.clearfix:after {
  clear: both;
}
img {
  position: absolute;
  margin-left: 45px;
  margin-top: 6px;
  width: 28px;
  height: 28px;
}
</style>
