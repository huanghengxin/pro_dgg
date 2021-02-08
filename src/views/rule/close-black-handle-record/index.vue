<template>
  <div class="close-black-handle-record-page">
    <search-title></search-title>
    <handle-record></handle-record>
  </div>
</template>
<script>
import SearchTitle from './components/search-title';
import HandleRecord from './components/handle-record';
export default {
  components: {
    SearchTitle,
    HandleRecord,
  },
};
</script>
