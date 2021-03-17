<template>
  <div :class="['search-base-component', searchClass]">
    <el-input
      :value="content"
      :placeholder="placeholder"
      :maxlength="20"
      clearable
      data-tid="searchInput"
      @keyup.enter.native="handleClick"
      @input="handleInput"
      @blur="handleBlur"
      @clear="clear"
    ></el-input>
    <el-button type="primary" data-tid="searchButton" @click="handleClick">查询</el-button>
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    placeholder: {
      type: String,
      default: '请输入内容',
    },
    searchClass: {
      type: [String, Array],
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    from: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      content: '',
    };
  },
  watch: {
    value(val) {
      this.content = val;
    },
  },
  methods: {
    handleBlur() {
      this.$emit('on-blur', this.content);
    },
    handleInput(val) {
      this.content = val.trim();
      this.$emit('on-input', this.content);
    },
    handleClick() {
      // if (this.content.trim() === '') return;
      // const regName = /^[\u4e00-\u9fa5]+$/;
      const regPhone = /^1[3-9]\d{9}$/;
      const regNumber = /^BSJ[0-9]|bsj[0-9]*$/;
      let params = {};
      switch (this.from) {
        case 'cule':
          params.keyword = this.content;
          if (params.keyword && regNumber.test(this.content)) {
            params.keywordType = 'SEARCH_BUS_NO';
          } else if (params.keyword && regPhone.test(this.content)) {
            params.keywordType = 'SEARCH_CLIENT_PHONE';
          } else if (params.keyword) {
            params.keywordType = 'SEARCH_CLIENT_NAME';
          } else {
            params.keywordType = '';
          }
          break;
        default:
          if (regNumber.test(this.content)) {
            params.bizNo = this.content;
          } else if (regPhone.test(this.content)) {
            params.phoneNo = this.content;
          } else {
            params.customerName = this.content;
          }
          break;
      }

      this.$emit('search', params, this.content);
    },
    clear() {
      this.$emit('clear', this.content);
    },
  },
};
</script>

<style lang="scss">
.search-base-component {
  display: flex;
  width: $dingqicha-title-input-width;
  .el-input__inner {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    border-right-width: 0px;
  }
  .el-button {
    width: $dingqicha-title-input-button-width;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
</style>
