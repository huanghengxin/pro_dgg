<template>
  <!-- **
 * @Author: maliang
 * @Date: 2020-10-16 09:37:00
 * @LastEditors: maliang
 * @LastEditTime: 2020-10-16 09:37:00
 * @Description: Tinymce page
** -->
  <div class="tinymce">
    <editor class="spTinymce" v-model="content" :init="init"></editor>
    <my-bd-map ref="myBdmap"></my-bd-map>
  </div>
</template>
<script>
import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver/theme';
import Editor from '@tinymce/tinymce-vue';

// 引入 plugins
import 'tinymce/plugins/image';
import 'tinymce/plugins/link';
import 'tinymce/plugins/code';
import 'tinymce/plugins/table';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/textcolor';
import 'tinymce/plugins/fullscreen';
import 'tinymce/plugins/media';
import 'tinymce/plugins/preview';
import 'tinymce/plugins/charmap';
import 'tinymce/plugins/print';
import 'tinymce/plugins/hr';
import 'tinymce/plugins/pagebreak';
import 'tinymce/plugins/save';
import 'tinymce/plugins/emoticons';
import 'tinymce/plugins/paste';

import 'tinymce/icons/default/icons';

import zhCN from '@/assets/tinymce/zh_CN.js';
import oxide from '@/assets/tinymce/skins/ui/default/skin.css';
import emojis from '@/assets/tinymce/plugins/emojis.js';
import spIcons from '@/assets/tinymce/icon/sp-icon/icons.js';

import { oss } from '@/assets/tinymce/utls/ossUpload.js';

import myBdMap from './bdmap';
export default {
  name: 'spTinymce',
  props: {
    // 回显内容
    initContent: {
      type: String,
      default: '',
    },
    // 宽度
    width: {
      type: Number,
    },
    // 高度
    height: {
      type: Number,
      default: 270,
    },
    // 最小高度
    minHeight: {
      type: Number,
      default: 270,
    },
    // 插件配置
    plugins: {
      type: String,
      default:
        'code link lists image table textcolor fullscreen media preview charmap print hr pagebreak save emoticons paste',
    },
    // 富文本工具栏配置
    toolbar: {
      type: [String, Array],
      default: () => {
        return [
          'code | bold italic underline strikethrough | superscript subscript | forecolor backcolor | removeformat | numlist bullist formatselect fontselect fontsizeselect redo undo fullscreen',
          'alignright aligncenter alignleft | link unlink | emoticons image  media | bdMap | hr pagebreak print preview charmap',
        ];
      },
    },
    // toolbar 超出展示方式
    toolbarMode: {
      type: String,
      default: 'scrolling',
    },
    // 内容区域是否可拖动
    statusbar: {
      type: Boolean,
      default: true,
    },
    // 一级菜单显示隐藏
    menubar: {
      type: Boolean,
      default: false,
    },
    fontFormats: {
      type: String,
      default:
        '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;',
    },
    fontsizeFormats: {
      type: String,
      default: '10px 12px 16px 18px 24px 32px 48px',
    },
    blockFormats: {
      type: String,
      default: 'p=p;h1=h1;h2=h2;h3=h3;h4=h4;h5=h5;h6=h6',
    },
    // 使用默认上传地址需要xdyToken
    xdyToken: {
      type: String,
      default: '',
    },
    // 自定义图片上传接口地址
    imgUploadUrl: {
      type: String,
      default: '',
    },
    // 自定义图片上传接口formData参数
    formData: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // 自定义图片上传接口的Header参数
    setHeaders: {
      type: Object,
      default: () => {
        return {};
      },
    },
  },
  components: { Editor, myBdMap },
  data() {
    return {
      tinymceIndex: 1,
      editor: null,
      content: '', // 富文本内容
      init: {
        selector: '.spTinymce',
        width: this.width, // 宽度
        height: this.height, // 高度
        min_height: this.minHeight, // 最小高度
        language_url: zhCN, // 语言包地址
        language: 'zh_CN',
        skin_url: oxide, // 皮肤包地址
        icons_url: spIcons, // 引入图标包
        icons: 'sp-icon', // 自定义icon包文件夹名称
        toolbar_mode: this.toolbarMode, // toolbar 工具栏配置超出展示方式
        plugins: this.plugins, // 引入的插件
        menubar: this.menubar, // 一级菜单是否隐藏
        toolbar: this.toolbar, // 富文本功能配置
        block_formats: this.blockFormats, // 标题选择配置
        fontsize_formats: this.fontsizeFormats, // 字体大小选择配置
        font_formats: this.fontFormats, // 字体样式选择配置
        emoticons_database_url: emojis, // 表情包
        paste_data_images: true, // 设置为“true”将允许粘贴图像，而将其设置为“false”将不允许粘贴图像。
        branding: false, // 隐藏下方品牌商
        statusbar: this.statusbar, // 内容区域是否可拖动
        // 图片上传
        images_upload_handler: (blobInfo, success, failure) => {
          if (this.imgUploadUrl && this.imgUploadUrl != '') {
            this.uploadImg(blobInfo, success, failure); // 自定义图片上传地址
          } else {
            this.defaultUploadImg(blobInfo, success, failure); // 默认上传dgg oss
          }
        },
        // 自定义地图插件
        setup: (editor) => {
          editor.ui.registry.addButton('bdMap', {
            icon: 'bdmap',
            tooltip: '地图',
            onAction: () => {
              this.$refs.myBdmap.bdMapShow = true;
              this.editor = editor;
            },
          });
        },
      },
    };
  },
  watch: {
    // 富文本内容改变返回值
    content: {
      handler() {
        this.$emit('change', this.content);
      },
    },
    initContent: {
      handler() {
        this.content = this.initContent;
      },
      immediate: true,
    },
  },
  mounted() {
    // 初始化tinymce
    tinymce.init({});
    // 内容回显
    if (this.initContent) {
      this.content = this.initContent;
    }
  },
  methods: {
    // updateLows() {
    //   setTimeout(() => {
    //     this.content = this.content.replace(/<img\s?src="data.*?>/, "");
    //   }, 200);
    // },
    // 自定义图片上传地址
    uploadImg(blobInfo, success, failure) {
      try {
        let xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        xhr.open('POST', this.imgUploadUrl, true);
        formData = new FormData();
        // 遍历设置formData
        Object.keys(this.formData).forEach((key) => {
          formData.append(key, this.formData[key]);
        });
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        // 遍历设置Header
        Object.keys(this.setHeaders).forEach((key) => {
          xhr.setRequestHeader(key, this.setHeaders[key]);
        });
        xhr.send(formData);
        xhr.onload = () => {
          var res = JSON.parse(xhr.responseText);
          this.$emit('imgUploadSuccess', res, success, failure);
        };
        xhr.onerror = function () {
          failure('图片上传失败！');
        };
      } catch (e) {
        failure(e);
      }
    },
    // 默认图片上传dgg oss
    defaultUploadImg(blobInfo, success, failure) {
      if (!this.xdyToken || this.xdyToken == '') {
        failure('使用默认图片上传地址需要传入xdyToken');
        return;
      }
      oss(blobInfo.filename(), this.xdyToken, failure).then((res) => {
        let xhr, formData;
        xhr = new XMLHttpRequest();
        xhr.withCredentials = false;
        formData = new FormData();
        formData.append('host', res.host);
        formData.append('key', res.key);
        formData.append('policy', res.policy);
        formData.append('OSSAccessKeyId', res.OSSAccessKeyId);
        formData.append('success_action_status', res.success_action_status);
        formData.append('signature', res.signature);
        formData.append('file', blobInfo.blob(), blobInfo.filename());
        xhr.open('POST', res.host);
        xhr.send(formData);
        if (xhr.status < 200 || xhr.status >= 300) {
          failure('图片上传失败！');
          return;
        }
        const url = res.host + '/' + res.key;
        success(url);
      });
    },
  },
};
</script>
