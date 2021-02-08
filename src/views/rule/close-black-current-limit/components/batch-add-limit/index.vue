<template>
  <div class="batch-add-limit-page">
    <el-dialog
      title="批量导入文件"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
    >
      <div class="batch-add-limit-text">
        <span>请下载导入文件模板，按格式修改后导入</span>
        <span>
          <a
            href="http://sp-img-wlh.oss-cn-beijing.aliyuncs.com/sp-test_1612754342000_%E5%85%B3%E9%BB%91%E9%99%90%E6%B5%81%E4%BA%BA%E5%91%98%E5%90%8D%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx"
          >
            下载模板
          </a>
        </span>
      </div>
      <div class="batch-add-limit-button">
        <el-upload
          class="upload-demo"
          action="http://172.16.133.198:10103/yk/rule_planner_flow_limit/v1/import_flow_limit.do"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
          :limit="1"
          :file-list="fileList"
          accept=".xls,.xlsx"
        >
          <el-button plain>上传按钮</el-button>
        </el-upload>

        <!-- <sp-upload
          ref="SpUpLoad"
          file-id="sp-test"
          :list-url="'https://dspmicrouag.shupian.cn/tac-external-platform-server/oss/find'"
          :delete-url="'https://dspmicrouag.shupian.cn/tac-external-platform-server/oss/deleteSingle'"
          :call-back-url="'https://dspmicrouag.shupian.cn/tac-external-platform-server/oss/callback'"
          :limit="1"
          :multiple="false"
          :control-options="{ preview: false, delete: true, download: false, upload: true }"
          :show-upload-button="true"
          :before-upload="beforeAvatarUpload"
          :on-success="uploadSuccess"
        /> -->
        <div slot="tip" class="el-upload__tip">
          <p>提示：</p>
          <p>1、仅支持上传Excel格式文件（同时支持各版本下xls、xlsx格式）</p>
          <p>2、一次仅支持一份文件上传；一份文件最多上传500条；</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button plain @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="intoLimitList">导入</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import './index.scss';
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      fileList: [], //上传的文件列表
      errorList: [],
    };
  },
  methods: {
    openModal() {
      this.dialogVisible = true;
    },
    /**
     * @description 导入
     */
    intoLimitList() {
      if (this.errorList.length > 0) {
        this.$router.push('/error-list');
      } else {
        this.$emit('batch-add');
      }
      this.dialogVisible = false;
    },
    /**
     * @description 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      this.$message.warning('一次仅支持一份文件上传');
    },
    /**
     * @description 文件上传成功时的钩子
     */
    uploadSuccess(response, file, fileList) {
      this.errorList = response.data;
    },
    /**
     * @description 上传文件之前的钩子，参数为上传的文件
     */
    beforeAvatarUpload(file, fileList) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      const xls = testmsg === 'xls';
      const xlsx = testmsg === 'xlsx';
      if (!xls && !xlsx) {
        this.$message.error('仅支持上传Excel格式文件!');
        return false;
      }
    },
  },
};
</script>
