<template>
  <div id="app" class="pages">
    <v-head :user="user"></v-head>
    <v-sidebar :menus="menus"></v-sidebar>
    <div class="main-container">
      <router-view></router-view>
    </div>
    <v-backtotop :visibilityHeight="300"></v-backtotop>
  </div>
</template>

<script>
import Api from '@/api'
import header from '@/pages/layout/header';
import sidebar from '@/pages/layout/sidebar';
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      menus: [],
      dictNames: [
        "volunteerServiceType",
        "occupation",
        "political",
        "education",
        'activityForm',
        'artistClass',
        'heritageLevel',
        'heritageType',
        'heritageBatch',
        'venueType',
        "videoType",
        "cultural"]
    }
  },
  components: {
    'v-head': header,
    'v-sidebar': sidebar
  },
  computed: {
    ...mapGetters([
      'user'
    ])
  },
  created() {
    let menus = this.$parent.menuData;

    if (menus) {
      this.menus = menus;
    }
    if (this.dictNames.length > 0) {
      for (let i = 0; i < this.dictNames.length; i++) {
        this.dicts.dictInit(this.dictNames[i]);
      }
    }
    this.getAllchildren()
  },
  methods: {
    getAllchildren() {
      Api.system.getUnitAllchildren(this.user.unit.id).then((res) => {
        let allchildren = res.map(x => x.id).join('~');
        sessionStorage.setItem('allchildren', allchildren);
      });
      let user = this.$store.getters.user;
      let orgchildren = user.orgUnit.id;
      sessionStorage.setItem('orgchildren', orgchildren);
    },
    setTitle(title) {
      document.title = title
      var u = navigator.userAgent
      // var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
      if (isiOS) {
        // document.title = title
        var $iframe = document.createElement('iframe');
        $iframe.src = '/favicon.ico';
        $iframe.style.display = 'none';
        $iframe.onload = function() {
          setTimeout(function() {
            $iframe.remove();
          }, 9)
        };
      }
    },

  },
  mounted() {
    this.$nextTick(() => {
      let user = this.$store.getters.user;
      this.setTitle(user.orgUnit.name + '数字平台管理系统');
      // this.getAllchildren();
    });
  }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
@import "../styles/variables";
.pages {
  position: relative;
  min-width: 1200px;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
  padding-top: $head-height;
}

.main-container {
  padding: 20px 15px; // min-height: 100%;
  transition: all 0.28s ease-out;
  margin-left: $left-sidebar-w;
}
.edit-wrapper .cover img {
  width: 354px;
  height: 216px;
}
.left-side.collapse ~ .main-container {
  margin-left: $left-sidebar-w-c;
}
.view-wrapper {
  .coveret img {
    width: 354px;
    height: 236px;
  }
}
</style>
