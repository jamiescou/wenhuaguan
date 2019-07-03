<template>
  <div class="content-404">
    <img src="static/images/404.png" class="img-404" />
    <p class="p-404">:( 很抱歉，您访问的页面不存在！
      <a href="/" class="btn-act">返回首页</a>
    </p>
  </div>
</template>
<script>
export default {
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  outline: none;
  font-family: "\5fae\8f6f\96c5\9ed1", "宋体";
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
  cursor: default;
  font-weight: lighter;
}
.img-404 {
  margin: 0 auto;
  border-bottom: 1px solid #314b62;
}
.content-404 {
  width: 100%;
  text-align: center;
  height: 400px;
  position: absolute;
  top: 50%;
  margin-top: -230px;
}
.p-404 {
  color: #333;
  margin-top: 40px;
  font-size: 24px;
}
.p-404 .btn-act {
  display: inline-block;
  color: #3c3c3c;
  cursor: pointer; // padding: 0 5px;
  &:hover {
    color: #f40;
    text-decoration: underline;
  }
}
#num {
  margin: 0 5px;
  font-weight: bold;
}
</style>
