<template>
  <el-dialog
    title="播放录音"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    custom-class="play-recording"
    @close="diologHandleClose"
  >
    <div>
      <p class="dialog-p">
        <span>客户姓名：</span>
        <span>{{ customerName || '暂无数据' }}</span>
      </p>
      <p v-for="(item, index) in audioContent" :key="index + 'audio'" class="dialog-p">
        <span>{{ item.name }}</span>
        <span>{{
          item.value === 'soundTime'
            ? soundTime || '暂无数据'
            : followInfo[item.value] || followInfo[item.value1]
        }}</span>
      </p>
    </div>
    <play-audio
      ref="playAudioRef"
      :src="urls"
      audio-class="play-recording_audio"
      :is-pause="dialogVisible"
      data-tid="recordHandleChangeTime"
      @records-time="handleChangeTime"
    />
  </el-dialog>
</template>

<script>
import './index.scss';
import PlayAudio from 'components/audio';
export default {
  components: {
    PlayAudio,
  },
  props: {
    customerName: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      dialogVisible: false,
      urls: [],
      followInfo: {},
      soundTime: '',
      audioContent: [
        { name: '录音时间：', value: 'followTime', value1: 'create_time' },
        { name: '录音时长：', value: 'soundTime' },
        { name: '拨打人：', value: 'followPerson', value1: 'creater_name' },
      ],
    };
  },
  methods: {
    handleChangeTime(val) {
      this.$set(this, 'soundTime', (parseInt(val) || 0) + '秒');
    },
    openModal(item) {
      if (item.soundUrl || item.opp_obj4) {
        this.followInfo = item;
        // this.followInfo.customerName = customerName || '';
        if (item.soundUrl) {
          this.urls = [item.soundUrl];
        } else {
          this.urls = [item.opp_obj4];
        }
        this.$refs.playAudioRef?.autoPlay();
        this.dialogVisible = true;
      }
    },
    diologHandleClose() {
      this.$refs.playAudioRef?.resetAudio(); //清除当前播放进度
    },
  },
};
</script>

<style></style>
