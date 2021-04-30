<template>
  <div class="batch-add-limit-page">
    <el-dialog
      title="批量导入文件"
      :visible.sync="dialogVisible"
      width="480px"
      :close-on-click-modal="false"
      :close-on-press-escape="closeEscape"
      @closed="dialogColsed"
    >
      <div class="batch-add-limit-text">
        <span>请下载导入文件模板，按格式修改后导入</span>
        <span>
          <span data-tid="batchAddLimitPageDownload" @click="download">下载模板</span>
        </span>
      </div>
      <div class="batch-add-limit-button">
        <el-upload
          ref="upload"
          class="upload-demo"
          action="/"
          :disabled="disabledButton"
          :on-exceed="handleExceed"
          :before-upload="beforeAvatarUpload"
          :on-progress="uploadProgress"
          :on-error="error"
          :auto-upload="false"
          :http-request="httpRequest"
          :limit="1"
          accept=".xls,.xlsx"
        >
          <el-button plain :disabled="disabledButton">上传文件</el-button>
        </el-upload>
        <div slot="tip" class="el-upload__tip">
          <p>提示：</p>
          <p>1、仅支持上传Excel格式文件（同时支持各版本下xls、xlsx格式）</p>
          <p>2、一次仅支持一份文件上传；一份文件最多上传100条</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          plain
          :disabled="disabledButton"
          data-tid="batchAddLimitPageCancelButton"
          @click="dialogVisible = false"
          >取消</el-button
        >
        <el-button
          type="primary"
          :disabled="disabledButton"
          data-tid="batchAddLimitPageIntoLimitList"
          @click="intoLimitList"
          >导入</el-button
        >
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
      disabledButton: false,
      closeEscape: true,
      file: null,
    };
  },
  methods: {
    openModal() {
      this.dialogVisible = true;
    },
    dialogColsed() {
      this.$refs.upload.clearFiles();
      this.disabledButton = false;
    },
    /**
     * @description 解决下载模板文件名字
     */
    downloadFile(url, fileName) {
      let x = new XMLHttpRequest();
      x.open('GET', url, true);
      x.responseType = 'blob';
      x.onload = function(e) {
        //会创建一个 DOMString，其中包含一个表示参数中给出的对象的URL。这个 URL 的生命周期和创建它的窗口中的 document 绑定。这个新的URL 对象表示指定的 File 对象或 Blob 对象。
        const url = window.URL.createObjectURL(x.response);
        let a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a = null;
      };
      x.send();
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
          let result = res.data[0];
          this.downloadFile(result.filepath, result.filename);
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
          }
          // 把数据放进store里
          mutations.saveErrorList(res.data);
          if (storeError.errorList.length > 0) {
            this.$router.push('/error-list');
          } else {
            this.$emit('update-list');
          }
          this.dialogVisible = false;
        }
        this.disabledButton = false;
        this.closeEscape = true;
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
      this.closeEscape = false;
    },
    /**
     * @description 文件上传失败时的钩子
     */
    error() {
      this.$message.warning('导入文件失败！');
      this.disabledButton = false;
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
      this.disabledButton = true;
    },
    /**
     * @description 上传文件之前的钩子，参数为上传的文件
     */
    beforeAvatarUpload(file, fileList) {
      let testmsg = file.name.substring(file.name.lastIndexOf('.') + 1);
      if (!['xls', 'xlsx'].includes(testmsg)) {
        this.$message.warning('仅支持上传Excel格式文件!');
        return false;
      } else if (file.size > 1048576) {
        this.$message.warning('导入的文件不能大于1M!');
        return false;
      }
    },
  },
};
</script>
