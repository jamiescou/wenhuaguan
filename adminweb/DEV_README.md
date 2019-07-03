ElementUI：前端UI框架
Vuex：状态管理

## 文件命名
统一小写，单词与单词之间用“_”下划线连接


## 路由定义，参数说明
```
hidden：表示不显示在侧边栏
code：菜单编号，权限过滤用
parent：所属上级菜单编号code，权限过滤用，有hidden属性，必须指定parent
menuName：菜单名称（有hidden属性，可以不指定）
icon：菜单上的图片
name：路由命名（慎用）
path：路由路径
component：路由对应的页面组件
```

## 表格
统一调用mixins的：base-table
统一样式：有边框，有loading动画，内容过长被隐藏的tooltip样式、有斑马纹
```
:data="dataList" border stripe v-loading.body="loading" tooltip-effect="custom-effect"
```


## 全局组件
```
detailItem: 组织管理页面中的详情项
pagination：分页
nodata：暂无数据
pageheader：页面顶部的面包屑
option：select控件的Options选项
uploadimg：上传图片
richeditor：富文本
```
## 字典
this.dicts.dictInit(字典名称)
* 初始化指定字典；在created或mounted中调用；
* 如果使用了mixins: [BaseTable]，可以直接在data中指定dictNames字典集合
如：dictNames: ['venueRoomType']
 
getValueByCode(字典名称,code)
* 将字典中的code转换成对应的value


## 状态管理
统一通过getter获取
```
this.$store.getters.user 用户信息
this.$store.getters.AuditUser 返回{ userId: '', userName: '' }
this.$store.getters.menus 菜单
this.$store.getters.token token
``` 