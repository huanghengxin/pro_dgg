# Tinymce 富文本

基于 `Tinymce`实现的富文本编辑器, 文档 <a href="https://www.tiny.cloud/docs/quick-start/" target="_blank" >Tinymce 富文本编辑器</a>

- @Author: MaLiang
- @Date: 2020-10-16 09:37:00
- @LastEditors: MaLiang
- @LastEditTime: 2020-10-16 09:37:00
- @Description: Tinymce

## 代码示例

### 基础用法

:::demo 基础用法

```html
<template>
  <spTinymce @change="spTinymceVal" :initContent="initContent" />
</template>

<script>
  import spTinymce from '@/components/public/Tinymce/index';
  export default {
    components: {
      spTinymce,
    },
    data() {
      return {
        initContent: '回显内容！',
      };
    },
    methods: {
      spTinymceVal(val) {
        console.log(val);
      },
    },
  };
</script>
```

:::

### 工具栏配置

:::demo 工具栏配置

```html
<template>
  <sp-tinymce @change="spTinymceVal" :initContent="initContent" :toolbar="myToolbar"></sp-tinymce>
</template>

<script>
  import { spTinymce } from '@/components/public/Tinymce/index';
  export default {
    components: {
      spTinymce,
    },
    data() {
      return {
        initContent: '回显内容！',
        myToolbar: ['code | bold'],
      };
    },
    methods: {
      spTinymceVal(val) {
        console.log(val);
      },
    },
  };
</script>
```

:::

### 使用默认图片上传地址

- 使用默认图片上传地址，需要传入 xdyToken

:::demo 使用默认图片上传地址

```html
<template>
  <sp-tinymce :toolbar="myToolbar" xdyToken="A535AD968CEC3D43A3DF5694FA8CD394"></sp-tinymce>
</template>

<script>
  import { spTinymce } from '@/components/public/Tinymce/index';
  export default {
    components: {
      spTinymce,
    },
    data() {
      return {
        myToolbar: 'image',
      };
    },
  };
</script>
```

:::

### 自定义图片上传地址

:::demo 自定义图片上传地址

```html
<template>
  <sp-tinymce
    ref="tinymce"
    :toolbar="myToolbar"
    :imgUploadUrl="imgUploadUrl"
    :formData="formData"
    :setHeaders="setHeaders"
    :initContent="initContent"
    @imgUploadSuccess="imgUploadSuccess"
    @change="spTinymceVal"
  ></sp-tinymce>
</template>

<script>
  import { spTinymce } from '@/components/public/Tinymce/index';
  export default {
    components: {
      spTinymce,
    },
    data() {
      return {
        initContent: '123',
        myToolbar: 'image',
        imgUploadUrl: 'https://dspapi.shupian.cn/api/oss/v1/upload', // 你的图片上传的接口地址
        // 你图片上传接口需要的formData参数
        formData: {},
        // 你图片上传接口需要的Header头参数
        setHeaders: {
          'request-origin': 'WAP',
        },
      };
    },
    methods: {
      // 图片上传成功的回调
      imgUploadSuccess(data, success, failure) {
        if (data.res.status === 200) {
          success(data.url); // 回调将上传图片成功后接口返回的图片地址插入到编辑器中
        } else {
          failure('上传失败');
        }
      },
      spTinymceVal(val) {
        console.log(77, val);
      },
    },
  };
</script>
```

:::

### API：

#### props：

<br/>

| 参数 | 说明 | 默认 | 类型 |
| :-: | :-: | :-: | --- |
| initContent | <font size=1>需要在富文本中回显的内容</font> |  | String |
| width | <font size=1>富文本编辑器宽度</font> | 百分百 | Number |
| height | <font size=1>富文本编辑器高度</font> | 270 | Number |
| minHeight | <font size=1>富文本编辑器最小高度</font> | 270 | Number |
| plugins | <font size=1>富文本编辑器插件配置</font> | "code link lists image table textcolor fullscreen media preview charmap print hr pagebreak save emoticons" | String |
| toolbar | <font size=1>富文本编辑器工具栏配置</font> | <font size=2>["code \| bold italic underline strikethrough \| superscript subscript \| forecolor backcolor \| removeformat \| numlist bullist formatselect fontselect fontsizeselect redo undo fullscreen","alignright aligncenter alignleft \| link unlink \| emoticons image media \| bdMap \| hr pagebreak print preview charmap"]</font> | String/Array |
| toolbarMode | <font size=1>富文本编辑器功能功能按钮超出一行的展示</font> | scrolling （可选：scrolling、wrap、floating） | String |
| statusbar | <font size=1>富文本编辑器内容区域是否可拖动</font> | true | Boolean |
| menubar | <font size=1>一级菜单显示隐藏</font> |  | Boolean |
| fontFormats | <font size=1>字体样式选择功能配置</font> | "微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;黑体=黑体;仿宋=仿宋;楷体=楷体;隶书=隶书;幼圆=幼圆;" | String |
| fontsizeFormats | <font size=1>字体大小选择功能配置</font> | "10px 12px 16px 18px 24px 32px 48px" | String |
| blockFormats | <font size=1>文本标签选择功能配置</font> | "p=p;h1=h1;h2=h2;h3=h3;h4=h4;h5=h5;h6=h6" | String |
| imgUploadUrl | <font size=1>图片上传接口地址</font> |  | String |
| formData | <font size=1>图片上传接口 formData 参数</font> |  | Object |
| setHeaders | <font size=1>图片上传接口 Header</font> |  | Object |
| xdyToken | <font size=1>使用默认图片上传接口需要传入的小顶云 token</font> |  | String |

**toolbar 配置：** 这里 toolbar 的默认配置为：

#### events

<br/>

| 事件名 | 说明 | 返回值 |
| :-: | :-: | :-: |
| @change | 编辑器内容改变触发 | Sting |
| @imgUploadSuccess | 图片上传接口成功回调 | Object：图片上传接口返回的参数； callback：将上传图片成功后接口返回的图片地址插入到编辑器中 |
