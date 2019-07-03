<template>
  <section class="container block-container">

    <div class="flex-item media-box detail">
      <div class="cell fixed media-object">
        <img :src="detailInfo.coverPic" onerror="this.onerror=null;this.src='/images/default.png'">
      </div>
      <div class="cell media-bd">
        <h4 class="media-title">{{detailInfo.name}}</h4>
        <p class="media-info bottom" v-html="detailInfo.brief"></p>
      </div>
    </div>

    <div class="split"></div>

    <div class="field-wrapper clct-form">
      <div class="form-item">
        <label>作品标题</label>
        <mt-field placeholder="请输入作品标题" type="textarea" rows="1" v-model="title"></mt-field>
      </div>
      <div class="form-item">
        <label>作品描述</label>
        <mt-field placeholder="请输入作品描述" type="textarea" rows="8" v-model="brief"></mt-field>
      </div>

      <div class="form-item">
        <label>添加作品</label>
        <div class="photo">
          <div class="addphoto" @click="showAlbum">
            <i class="icon icon-camera"></i>
          </div>
          <v-uploadimg ref='avatarCropper' class="showPhoto" @loadimg="loadimg" @changeFiles="changeFiles">
            <img :src="imgsrc" alt="">
          </v-uploadimg>
        </div>
      </div>

    </div>

    <div class="split"></div>
    <div class="footer pre-footer">
      <mt-button class="btn go" @click='submit'>确定</mt-button>
    </div>

  </section>
</template>
<script>
import axios from "axios";
import rules from "~/util/validateRules";
import uploadImg from "~/components/uploadImg.vue";
import { toastMixin } from '~/components/mixins'
export default {
  middleware: "auth",
  mixins: [toastMixin],
  components: {
    "v-uploadimg": uploadImg
  },

  async asyncData({ params, error, query }) {
    let detailInfo = await axios.get("/collect/detail/" + query.activityId);
    return {
      activityId: query.activityId,
      detailInfo: detailInfo.data
    };
  },

  data() {
    return {
      title: "",
      detailInfo: {},
      brief: "",
      sheetVisible: false,
      actions: [],
      imgsrc: "",

      imgFile: '',
      activityId: ""
    };
  },

  head() {
    return {
      title: "作品上传"
    };
  },

  mounted() {
    this.actions = [
      {
        name: "从相册中选择",
        method: this.showAlbum
      }
    ];
  },

  methods: {
    loadimg(url) {       //预览
      this.imgsrc = url;
    },
    changeFiles(file) {  //选择文件
      this.imgFile = file;
    },
    showAlbum() {
      this.$refs.avatarCropper.handleClick();
      // this.$refs.imageSelect.click();
    },
    async submit() {
      if (!rules.required(this.title, '请输入作品名称！')) return false;
      if (!rules.required(this.brief, '请输入作品介绍！')) return false;
      if (!rules.required(this.imgFile, '请上传作品文件')) return false;

      let formData = new FormData();
      formData.append('file', this.imgFile);
      formData.append("title", this.title);
      formData.append("brief", this.brief);
      formData.append('activityId', this.activityId);
      let res = await axios.post("/collect/workupload", formData);
      if (res.data.success) {
        this.showMsg("提交成功");
        this.$router.replace('/preset?id=collect');
      } else {
        this.showMsg("提交失败");
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "~static/styles/pages/collect.scss";
.block-container .detail p {
  height: px2rem(36*2);
  overflow: hidden;
}
</style>
