<template>
  <div class="batch-add-limit-page">
    <el-dialog
      title="批量导入文件"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      @closed="dialogColsed"
    >
      <div class="batch-add-limit-text">
        <span>请下载导入文件模板，按格式修改后导入</span>
        <span>
          <!-- <a
            href="https://sp-img-wlh.oss-cn-beijing.aliyuncs.com/diyTest_1614244790000_%E5%85%B3%E9%BB%91%E9%99%90%E6%B5%81%E4%BA%BA%E5%91%98%E5%90%8D%E5%8D%95%E6%A8%A1%E6%9D%BF.xlsx"
          >
            下载模板
          </a> -->
          <span @click="download">下载模板</span>
        </span>
      </div>
      <div class="batch-add-limit-button">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          :disabled="isUploadButton"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-progress="uploadProgress"
          :auto-upload="false"
          :http-request="httpRequest"
          :limit="1"
          accept=".xls,.xlsx"
        >
          <el-button plain :disabled="isUploadButton">上传按钮</el-button>
        </el-upload>
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
import store from 'storejs';
import { storeError, mutations } from '../../observable';
import { import_flow_limit, find } from 'api/close-black-limit';
export default {
  components: {},
  data() {
    return {
      dialogVisible: false,
      isUploadButton: false,
      file: null,
    };
  },
  methods: {
    openModal() {
      this.dialogVisible = true;
    },
    dialogColsed() {
      this.$refs.upload.clearFiles();
    },
    /**
     * @description 下载模板
     */
    download() {
      let obj = {
        fileId: 'CLOSE_BLACK_PEOPLE_LIST',
        liked: true,
      };
      find(obj).then((res) => {
        if (res.code === 200) {
          let Anode = document.createElement('a');
          let result = res.data[0];
          Anode.href = result.filepath;
          Anode.download = result.filename;
          document.body.appendChild(Anode);
          Anode.click();
          document.body.removeChild(Anode);
        }
      });
    },
    /**
     * @description 自定义上传方式
     */
    httpRequest(options) {
      let type = store.get('platformType');
      import_flow_limit(options, type).then((res) => {
        if (res.code !== 200) {
          this.$message.warning(res.message);
          this.$refs.upload.clearFiles();
        } else {
          if (res.data.length === 0) {
            this.$message.success(res.message);
          } else {
            this.$message.info('导入文件存在错误数据，请修改后重新上传！');
          }
          // 把数据放进store里
          mutations.saveErrorList(res.data);
          if (storeError.errorList.length > 0) {
            this.$router.push('/error-list');
          } else {
            this.$emit('batch-add');
          }
          this.dialogVisible = false;
        }
        this.isUploadButton = false;
      }, options.onError);
    },
    /**
     * @description 导入
     */
    intoLimitList() {
      if (this.$refs.upload.uploadFiles.length === 0) {
        this.$message.warning('您还没有选择任何文件！');
        return;
      }
      this.$refs.upload.submit();
    },
    /**
     * @description 文件超出个数限制时的钩子
     */
    handleExceed(files, fileList) {
      this.$message.warning('一次仅支持一份文件上传');
    },
    /**
     * @description 文件上传时的钩子
     */
    uploadProgress(event, file, fileList) {
      this.isUploadButton = true;
    },
    /**
     * @description 上传文件之前的钩子，参数为上传的文件
     */
    beforeAvatarUpload(file, fileList) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (!['xls', 'xlsx'].includes(testmsg)) {
        this.$message.error('仅支持上传Excel格式文件!');
        return false;
      }
    },
  },
};
</script>
