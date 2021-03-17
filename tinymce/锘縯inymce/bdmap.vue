<template>
  <!-- ** 
 * @Author: maliang
 * @Date: 2020-10-16 09:37:00
 * @LastEditors: maliang
 * @LastEditTime: 2020-10-16 09:37:00
 * @Description: baidu map page
** -->
  <div v-if="bdMapShow" class="bd-map-container">
    <!-- S loading 遮罩层 -->
    <div v-if="lodingShow" class="loding">
      <!-- <sp-spin loading></sp-spin> -->
    </div>
    <!-- E loading 遮罩层 -->
    <div class="bd-map-content">
      <span class="close-btn" @click="bdMapShow = false">&#215;</span>
      <p>百度地图</p>
      <div class="search-content">
        <!-- S 搜索框 -->
        <span class="search-box">
          <input
            id="kw"
            class="search-input"
            type="text"
            v-model="keyword"
            autocomplete="off"
            @input="searchPosition"
            @focus="searchPosition"
            placeholder="输入要搜索的地点"
          />
          <span v-if="!searchResult" class="no-data">暂无结果</span>
          <ul ref="search" v-else-if="searchResult.length > 0" class="search-list">
            <li v-for="(item, index) in searchResult" :key="index" @click="chooseAddress(item)">
              <p class="title">{{ item.title }}</p>
              <p class="address"><span>地址：</span>{{ item.address }}</p>
            </li>
          </ul>
        </span>
        <!-- <input
            class="search-btn"
            type="button"
            value="搜索"
            @click="searchPosition"
          /> -->
        <!-- E 搜索框 -->
      </div>
      <!-- S 地图内容 -->
      <baidu-map
        id="map_canvas"
        :center="center"
        :zoom="zoom"
        :dragging="true"
        :scroll-wheel-zoom="true"
        class="map"
        @ready="handler"
        @moving="syncCenterAndZoom"
        @click="addMarkerHandle"
        @moveend="syncCenterAndZoom"
        @zoomend="syncCenterAndZoom"
      >
        <!-- S 缩放控件 -->
        <bm-navigation anchor="BMAP_ANCHOR_TOP_LEFT" :enableGeolocation="true"></bm-navigation>
        <!-- E 缩放控件 -->
        <!-- S 定位控件 -->
        <bm-geolocation
          anchor="BMAP_ANCHOR_BOTTOM_RIGHT"
          :showAddressBar="true"
          :autoLocation="true"
        ></bm-geolocation>
        <!-- E 定位控件 -->
      </baidu-map>
      <!-- E 地图内容 -->
      <div class="map-btn-box">
        <button class="cancel-btn" @click="bdMapShow = false">取消</button>
        <button class="save-btn" @click="saveMap">保存</button>
      </div>
    </div>
  </div>
</template>
<script>
// import { spSpin } from "$ui";
import markerIcon from '@/assets/tinymce/icon/marker-icon.png';
import BaiduMap from 'vue-baidu-map';
import Vue from 'vue';
Vue.use(BaiduMap, {
  ak: 'rQxHPQX1ua21rWnXzTbUh5KSSUbnefxR',
});
let BdMap = null;
export default {
  name: 'bdmap',
  components: {},
  data() {
    return {
      bdMapShow: false,
      lodingShow: true,
      keyword: '', // 搜索关键词
      center: { lng: 104.070223, lat: 30.676464 }, // 初始化地图经纬度
      zoom: 14, // 地图缩放层级
      searchResult: [], // 搜索结果
      position: {}, // 覆盖物位置记录
      url: '', // 正式环境url
    };
  },
  created() {
    //获取域名
    this.url = window.location.host;
  },
  mounted() {
    document.addEventListener('click', (e) => {
      if (e.target.classname != 'search-input') {
        this.searchResult = [];
      }
    });
  },
  methods: {
    // 百度地图初始化（一定要！否则地图回加载不出来）
    handler({ BMap, map }) {
      BdMap = BMap;
      this.map = map;
      this.lodingShow = false;
      // 定位当前城市大概位置
      //   let geolocation = new BMap.Geolocation();
      //   geolocation.getCurrentPosition(r => {
      //     this.center.lng = r.point.lng;
      //     this.center.lat = r.point.lat;
      //     this.lodingShow = false;
      //   });
    },
    // 检索城市
    searchPosition() {
      if (this.keyword) {
        let localSearch = new BdMap.LocalSearch(this.map);
        this.map.clearOverlays(); //清空原来的标注
        localSearch.search(this.keyword);
        setTimeout(() => {
          localSearch.setSearchCompleteCallback((searchResult) => {
            if (searchResult.Hr.length == 0) {
              this.searchResult = null;
              return false;
            }
            // 缓存检错结果
            this.searchResult = searchResult.Hr;
          });
        });
        return false;
      } else {
        this.searchResult = [];
      }
    },
    // 选择某个城市检索结果
    chooseAddress(item) {
      // 根据选择城市的经纬度设置地图中心位置
      this.map.centerAndZoom(item.point, 14);

      // 设置自定义覆盖物图标
      let lightMyIcon = new BdMap.Icon(markerIcon, new BdMap.Size(23, 25), {
        imageSize: new BdMap.Size(25, 25),
      });
      let marker = new BdMap.Marker(new BdMap.Point(item.point.lng, item.point.lat), {
        icon: lightMyIcon,
      });

      parent.tinymceLng = item.point.lng;
      parent.tinymceLat = item.point.lat;
      this.center.lng = item.point.lng;
      this.center.lat = item.point.lat;

      // 缓存覆盖物坐标
      this.position.lng = item.point.lng;
      this.position.lat = item.point.lat;

      // 添加覆盖物
      this.map.addOverlay(marker);
      this.searchResult = [];
    },
    // 缩放地图与移动地图记录zoom层级 与 地图中心点坐标
    syncCenterAndZoom(e) {
      const { lng, lat } = e.target.getCenter();
      this.center.lng = lng;
      this.center.lat = lat;
      this.zoom = e.target.getZoom();
    },
    // 点击地图某个坐标点，在该点添加覆盖物
    addMarkerHandle(e) {
      const lng = e.point.lng;
      const lat = e.point.lat;
      this.position.lng = lng;
      this.position.lat = lat;
      let lightMyIcon = new BdMap.Icon(markerIcon, new BdMap.Size(23, 25), {
        imageSize: new BdMap.Size(25, 25),
      });
      let marker = new BdMap.Marker(new BdMap.Point(lng, lat));
      marker.setIcon(lightMyIcon);
      this.map.clearOverlays();
      this.map.addOverlay(marker);
      parent.tinymceLng = lng;
      parent.tinymceLat = lat;
    },
    // 保存地图
    saveMap() {
      this.keyword = '';
      let iframeUrl = `https://${this.url}/bdMap/?lng=${this.center.lng}&lat=${this.center.lat}&zoom=${this.zoom}&positionLng=${this.position.lng}&positionLat=${this.position.lat}`;
      let html = `<iframe src=${iframeUrl} width='530' height='342' frameborder='0'></iframe>`;

      // 插入iframe到富文本内容编辑中
      this.$parent.editor.insertContent(html);
      this.bdMapShow = false;
    },
  },
};
</script>
<style lang="scss" scoped>
.bd-map-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.75);
  bottom: 0;
  left: 0;
  position: fixed;
  right: 0;
  top: 0;
  z-index: 999;
  .loding {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 3;
    background-color: rgba(0, 0, 0, 0.6);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bd-map-content {
    position: relative;
    width: 564px;
    background-color: #fff;
    border-color: #ccc;
    border-radius: 3px;
    border-style: solid;
    border-width: 1px;
    box-shadow: 0 16px 16px -10px rgba(34, 47, 62, 0.15), 0 0 40px 1px rgba(34, 47, 62, 0.15);
    display: flex;
    flex-direction: column;
    max-height: 100%;
    overflow: hidden;
    position: relative;
    padding: 12px 16px 24px 16px;
    box-sizing: border-box;
    .close-btn {
      width: 34px;
      height: 34px;
      border-radius: 3px;
      text-align: center;
      line-height: 34px;
      position: absolute;
      right: 16px;
      top: 8px;
      font-size: 26px;
      cursor: pointer;
      &:hover {
        background-color: #dddddd;
      }
    }
    > p {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu,
        Cantarell, 'Helvetica Neue', sans-serif;
      font-size: 20px;
      font-style: normal;
      font-weight: normal;
      line-height: 1.3;
      margin: 0;
      text-transform: none;
    }
    .search-content {
      display: flex;
      border-top: 1px solid #e5e5e5;
      padding-top: 22px;
      margin-top: 8px;
      margin-bottom: 14px;
      .search-box {
        position: relative;
        width: 300px;
        margin-right: 0;
        .search-input {
          width: 100%;
          height: 32px;
          background: #ffffff;
          border: 1px solid #e5e5e5;
          padding-left: 12px;
          font-size: 12px;
          border-radius: 0;
        }
        .no-data {
          position: absolute;
          left: 0;
          top: 32px;
          width: 100%;
          color: #666;
          font-size: 12px;
          padding: 4px 12px;
          box-sizing: border-box;
          z-index: 4;
          line-height: 32px;
          background: #fff;
          border: 1px solid #e4e6e7;
        }
        .search-list {
          width: 100%;
          position: absolute;
          left: 0;
          top: 32px;
          z-index: 4;
          border: 1px solid #e4e6e7;
          background: #fff;
          margin: 0;
          padding: 0;
          max-height: 300px;
          overflow-y: scroll;
          > li {
            width: 100%;
            list-style: none;
            cursor: pointer;
            padding: 4px 12px;
            box-sizing: border-box;
            &:hover {
              background-color: #eee;
            }
            p {
              margin: 0;
              line-height: 16px;
            }
            .title {
              color: #3162f4;
              font-size: 12px;
            }
            .address {
              color: #666;
              font-size: 12px;
              span {
                color: rgba(0, 0, 0, 0.87);
              }
            }
          }
        }
      }
      .search-btn {
        width: 50px;
        height: 32px;
        background: #ffffff;
        border: 1px solid #4974f5;
        opacity: 1;
        border-radius: 3px;
        font-size: 12px;
        font-family: MicrosoftYaHei;
        line-height: 15px;
        color: #4974f5;
        cursor: pointer;
        margin-left: 12px;
      }
    }
    #map_canvas {
      position: relative;
      width: 100%;
      height: 342px;
    }
    .map-btn-box {
      display: flex;
      margin-top: 24px;
      justify-content: flex-end;
      .cancel-btn {
        background-color: #eaeaea;
        border-color: #eaeaea;
        border-radius: 3px;
        border-style: solid;
        border-width: 1px;
        color: #222f3e;
        font-size: 14px;
        font-style: normal;
        font-weight: bold;
        padding: 4px 16px;
        cursor: pointer;
        &:hover {
          background-color: #dddddd;
          border-color: #dddddd;
        }
      }
      .save-btn {
        background-color: #4974f5;
        border-color: #4974f5;
        border-radius: 3px;
        border-style: solid;
        border-width: 1px;
        color: #fff;
        cursor: pointer;
        font-size: 14px;
        font-style: normal;
        font-weight: bold;
        line-height: 24px;
        padding: 4px 16px;
        text-align: center;
        text-decoration: none;
        margin-left: 8px;
        &:hover {
          background-color: #3162f4;
          border-color: #3162f4;
        }
      }
    }
  }
}
</style>
