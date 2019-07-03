<template>
    <div class="amap-page-container">
        <el-amap-search-box id="search-box"  class="search-box" :search-option="search.searchOption" placeholder="绿地" :events="search.events" :on-search-result="onSearchResult"></el-amap-search-box>
        <el-amap vid="amapDemo" :center="mapCenter" :zoom="zoom" class="u-map" :plugin="plugin" :events="events">
            <el-amap-marker v-for="(marker,index) in markers" :position="marker.position" :events="marker.events" :icon="marker.icon" :zIndex="marker.zIndex" :key="index"></el-amap-marker>
        </el-amap>
        <!-- <el-amap :vid="'amap-vue'" ref="map" :amap-manager="amapManager" :center="center" :zoom="zoom" :plugin="plugin" :events="events" class="u-map"></el-amap> -->
        <div class="infobar">
            经度：
            <span class="emphasize">{{ lng }}</span>
            维度：
            <span class="emphasize">{{ lat }}</span>
            <div><span>{{ address }}</span><button class="tag-read" :data-clipboard-text="address" @click="copy">复制</button>   </div>
            <div>{{ poiName }}</div>
        </div>
    </div>
</template>
<script>
import Clipboard from 'clipboard';
export default {
    props: {
        coordinate: {
            type: Function,
            default: function(lng, lat) { }
        },
        addr: {
            type: String,
            default: ''
        },
        searchType: {
            type: String,
            default: ''
        }
    },
    data() {
        let self = this;
        return {
            address: '',
            lng: 0,
            lat: 0,
            zoom:13,
            poiName:'',
            cMark: null,
            search: {
                searchOption: {
                    city: '长沙',
                    citylimit: false
                },
                events: {
                    init(instance) { 
                        if(self.searchType=="address")      
                        {
                            if (self.addr !== '') {                            
                            var placeSearch = instance.placeSearch;
                            placeSearch.search(self.addr, function(status, result) {
                                if (status === 'complete') {
                                    let pois = result.poiList.pois;
                                    if (pois.length > 0) {
                                        //  第一个点选中
                                        let firstPoint = pois[0];                                                                                                          
                                        self.addMarker(firstPoint.location);
                                        self.mapCenter=[firstPoint.location.lng,firstPoint.location.lat];
                                        self.lng = firstPoint.location.lng;
                                        self.lat = firstPoint.location.lat;
                                        self.address = firstPoint.address;     
                                        self.poiName = firstPoint.name;
                                        self.coordinate(self.lng, self.lat);
                                    }
                                }
                            });
                        }
                        }else
                        {
                             self.mapCenter=[self.lng,self.lat];  
                             self.getAddress(self.lng,self.lat);  
                             self.addMarkerSingle();
                        }               
                        
                    }
                }
            },
            markers: [],
            mapCenter: [112.980023, 28.109925],
            plugin: [
                {
                    pName: 'Scale',
                    events: {
                        init(instance) {
                        }
                    }
                },
                {
                    pName: 'ToolBar',
                    events: {
                        init(instance) {
                        }
                    }
                }
            ],
            events: {
                click(e) {
                    let { lng, lat } = e.lnglat;
                    self.getAddress(lng, lat);
                    self.currentMark(e.lnglat);
                    self.mapCenter=[lng,lat];
                }
            }
        }
    },
    methods: { 
      
        getAddress(lng, lat) {     
            let self = this;
            self.lng = lng; // 经度
            self.lat = lat; // 纬度
            // 这里通过高德 SDK 完成。
            var geocoder = new AMap.Geocoder({
                radius: 1000,
                extensions: 'all'
            });
            geocoder.getAddress([lng, lat], function(status, result) {               
                if (status === 'complete' && result.info === 'OK') {
                    if (result && result.regeocode) {                        
                        if(result.regeocode.aois.length>0){
                            self.poiName= result.regeocode.aois[0].name; 
                        }else
                        {
                            self.poiName= ""; 
                        }                        
                        self.address = result.regeocode.formattedAddress;
                        self.$nextTick();
                    }
                }
            });
            self.coordinate(lng, lat);
        },
        currentMark(poi) {   
            let self = this;
            if (!self.cMark) {
                self.cMark = {
                    position: [poi.lng, poi.lat],
                    icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
                    zIndex: 111
                }
                self.markers.push(self.cMark);
            } else {
                self.cMark.position = [poi.lng, poi.lat];
            }
            // self.markers.push({
            //     position: [poi.lng, poi.lat],
            //     icon: 'http://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
            //     events: {
            //         click: (e) => {
            //             let { lng, lat } = e.lnglat;
            //             self.getAddress(lng, lat);
            //         }
            //     }
            // })
        },
        addMarker(poi) {              
            let self = this;
            self.markers.push({
                position: [poi.lng, poi.lat],
                events: {
                    click: (e) => {
                        let { lng, lat } = e.lnglat;
                        self.getAddress(lng, lat);
                        self.currentMark(e.target.G.position);
                    }
                }
            })
        },
         addMarkerSingle() {              
            let self = this;           
            self.markers.push({
                position: [this.mapCenter[0],this.mapCenter[1] ],
                events: {
                    click: (e) => {
                        let { lng, lat } = e.lnglat;
                        self.getAddress(lng, lat);
                        self.currentMark(e.target.G.position);
                    }
                }
            })
        },
        onSearchResult(pois) {            
            let latSum = 0;
            let lngSum = 0;
            let self = this;
            self.markers = [];
            if (pois.length > 0) {
                pois.forEach(poi => {
                    let { lng, lat } = poi;
                    lngSum += lng;
                    latSum += lat;
                    self.addMarker(poi);
                });
                let firstPoint = pois[0];                             
                self.poiName= firstPoint.name; 
                self.mapCenter=[firstPoint.location.lng,firstPoint.location.lat];              
            }
        },
        copy() { 
        var clipboard = new Clipboard('.tag-read')  
        clipboard.on('success', e => {  
          // 释放内存  
          clipboard.destroy()  
        })  
        clipboard.on('error', e => {  
          // 不支持复制  
          // 释放内存  
          clipboard.destroy()  
        })  
      } ,
    },
    
    mounted() {     
             
        //    document.getElementById("search-box").getElementsByTagName("input").value=this.props;
    }
}
</script>

<style type="text/css" lang="scss" rel="stylesheet/scss">
.amap-page-container {
  position: relative;
  .u-map {
    height: 400px;
  }
  .search-box {
    position: absolute;
    top: 15px;
    right: 20px;
    margin: 0 auto;
  }
  .infobar {
    background: #fff;
    margin-top: 10px;
    line-height: 20px;
  }
}
</style>
