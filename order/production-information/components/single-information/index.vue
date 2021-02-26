<template>
  <div>
    <div class="basic-information">基础信息</div>
    <el-table :data="basicData" style="width: 100%" class="basic-information-table">
      <el-table-column prop="status" label="底单状态">
        <template slot-scope="scope">
          <span
            :class="
              scope.row.status == '已驳回'
                ? 'danger'
                : scope.row.status == '待确认'
                ? 'warning'
                : 'info'
            "
            >{{ scope.row.status }}</span
          >
        </template>
      </el-table-column>
      <el-table-column prop="affirmWay" label="确认方式"> </el-table-column>
      <el-table-column prop="affirmTime" label="确认时间"> </el-table-column>
      <el-table-column prop="handle" label="操作">
        <template slot-scope="scope">
          <router-link to="/add-business">
            <span class="basic-information-handle">{{ scope.row.handle }}</span>
          </router-link>
        </template>
      </el-table-column>
    </el-table>
    <div class="document">文件资料</div>
    <div class="document-content">
      <div v-for="(item, index) in documentList" :key="index + 'documentList'">
        <p>{{ item.documentName }}</p>
        <p class="document-content-document">
          <span>
            <span
              :class="{
                'iconfont-qds-crm': true,
                'icon-tupian': item.code == 'contract' ? false : true,
                'icon-WPS': item.code == 'contract' ? true : false,
              }"
            ></span>
            <span>{{ item.documentContent }}</span>
          </span>
          <span class="image-download">
            <el-image v-if="!item.code" :src="url" :preview-src-list="srcList"></el-image>
            <span class="iconfont-qds-crm icon-11-04"></span>
          </span>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import { production_bottom } from 'api/order-details';

export default {
  data() {
    return {
      url: 'src/assets/image/magnifying-glass.png',
      srcList: [
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608377677130&di=43568ae0be72971a4d52d990ea643bd2&imgtype=0&src=http%3A%2F%2Fcdn.duitang.com%2Fuploads%2Fitem%2F201512%2F07%2F20151207170504_sTVKG.thumb.700_0.jpeg',
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1608377734764&di=37d8b7096639c0c85f9534aad33d8964&imgtype=0&src=http%3A%2F%2Fattachments.gfan.com%2Fforum%2F201705%2F02%2F143508lonzghshnhn7mhks.jpg',
      ],
      //文件资料列表
      documentList: [
        { documentName: '营业执照：', documentContent: '营业执照.doc' },
        { documentName: '法人身份证：', documentContent: '身份证正面.doc' },
        { documentName: '地址租赁合同：', documentContent: '地址租赁.doc', code: 'contract' },
      ],
      //基础信息表格
      basicData: [],
    };
  },
  mounted() {
    this.getBasicData(); //生产信息-底单信息
  },
  methods: {
    /**
     * @description 生产信息-底单信息
     */
    getBasicData() {
      production_bottom().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.basicData = res;
        }
      });
    },
  },
};
</script>
