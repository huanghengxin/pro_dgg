import './index.scss';
import Slider from './slider';
export default {
  props: {
    src: {
      type: [String, Array],
      default: () => {
        return [];
      },
    },
    audioClass: {
      type: String,
      default: '',
    },
    isPause: {
      type: Boolean,
      default: false, //关闭弹框重置播放
    },
    isLoop: {
      type: Boolean,
      default: false, //是否可以切换上一首下一首
    },
    isRepeat: {
      type: Boolean,
      default: false, //是否结束后播放下一首
    },
    isSound: {
      type: Boolean,
      default: false, //是否需要声音
    },
  },
  components: {
    Slider,
  },
  data() {
    return {
      isPlaying: false,
      currentIndex: 0,
      isBuffer: true,
      currentPosition: 0,
      currentTime: '00:00',
      endTime: '00:00',
      meta: {
        duration: 0,
        currentTime: 0,
      },
      currentValue: 0.7,
    };
  },
  computed: {
    changeCurrentPosition() {
      return this.$refs.peogressSliderRef.changeCurrentPosition;
    },
  },
  methods: {
    changeState() {
      if (this.src.length === 0 || this.src[0] == '') {
        this.$message.warning('无录音数据');
        return;
      }
      this.isPlaying = !this.isPlaying;
    },
    changeStateIcon() {
      const { isPlaying, stateIcon } = this;
      const currentClass = isPlaying ? 'fa-pause' : 'fa-play';
      const targetClass = !isPlaying ? 'fa-pause' : 'fa-play';
      stateIcon.className = stateIcon.className.replace(currentClass, targetClass);
    },
    autoPlay() {
      const audio = this.$refs.audioPlayerRef;
      if (audio) {
        audio.load();
      }
    },
    changeCurrentSrc() {
      const audio = this.$refs.audioPlayerRef;
      audio.src = this.src[this.currentIndex];
      audio.load();
    },
    next() {
      const targetIndex = this.currentIndex + 1;
      this.currentIndex = targetIndex > this.src.length - 1 ? 0 : targetIndex;
      this.changeCurrentSrc();
      this.play();
    },
    pause() {
      const audio = this.$refs.audioPlayerRef;
      audio.pause();
      this.isPlaying = false;
    },
    prev() {
      const targetIndex = this.currentIndex - 1;
      this.currentIndex = targetIndex < 0 ? this.src.length - 1 : targetIndex;
      this.changeCurrentSrc();
      this.play();
    },
    play() {
      console.log('dddddddddddddddddddddd', this.src);
      if (this.src.length === 0) return;
      const audio = this.$refs.audioPlayerRef;
      audio.play();
      this.isPlaying = true;
    },
    genController() {
      const icon = this.isPlaying ? 'icon-surface_suspend' : 'icon-start';
      const isLoop = this.isLoop;
      return (
        <div>
          {isLoop ? (
            <i
              class="iconfont-qds-crm icon-surface_leftswitch icon__back"
              onClick={() => {
                this.prev();
              }}></i>
          ) : (
            ''
          )}
          <i
            class={['iconfont-qds-crm', icon, 'icon__state']}
            onClick={() => {
              this.changeState();
              this.isPlaying ? this.play() : this.pause();
            }}></i>
          {isLoop ? (
            <i
              class="iconfont-qds-crm icon-surface_rightswitch icon__next"
              onClick={() => {
                this.next();
              }}></i>
          ) : (
            ''
          )}
        </div>
      );
    },
    /**
     * @description audio标签
     */
    genAudio() {
      return (
        <audio
          class="audio-player"
          src={this.src[this.currentIndex]}
          preload="auto"
          ref="audioPlayerRef"
          onloadedmetadata={(e) => {
            const duration = e.target.duration;
            this.meta.duration = duration;
            this.$emit('records-time', duration);
            this.changeEndTime(this.formatTime(duration));
            this.play();
          }}
          ontimeupdate={(e) => {
            const currentTime = e.target.currentTime;
            const meta = this.meta;
            meta.currentTime = currentTime;
            this.changeCurrentTime(this.formatTime(currentTime));
            // 计算当前时间占总时间的百分比，以此计算对应的位置
            const percent = (currentTime / meta.duration).toFixed(6) * 100;
            this.setCurrentProgress(percent);
          }}
          onended={() => {
            if (this.isRepeat) {
              this.next();
            } else {
              this.resetAudio();
            }
          }}
        />
      );
    },
    resetAudio() {
      this.isPlaying = false;
      this.changeCurrentTime('00:00');
      this.setCurrentProgress(0);
      const audio = this.$refs.audioPlayerRef;
      audio.pause();
      audio.currentTime = 0;
    },
    /**
     * @description 改变结束时间
     * @param {String} 结束时间
     */
    changeEndTime(endTime) {
      this.endTime = endTime;
    },
    /**
     * @description 改变当前时间
     * @param {String} 当前时间
     */
    changeCurrentTime(currentTime) {
      this.currentTime = currentTime;
    },
    /**
     * @description 设置当前进度条位子
     * @param {String} 距离位子
     */
    setCurrentProgress(percent) {
      this.changeCurrentPosition(percent);
    },
    /**
     * @description 格式化时间
     * @param {String} 时间
     */
    formatTime(time) {
      let secs = 0,
        mins = 0,
        hours = 0,
        displayHours,
        seperator = ':';

      secs = parseInt(time % 60);
      mins = parseInt((time / 60) % 60);
      hours = parseInt((time / 60 / 60) % 60);
      displayHours = parseInt((time / 60 / 60) % 60) > 0;
      secs = ('0' + secs).slice(-2);
      mins = ('0' + mins).slice(-2);
      return (displayHours ? hours + ':' : '') + mins + seperator + secs;
    },
    setCurrentVolume(volume) {
      const audio = this.$refs.audioPlayerRef;
      audio.volume = volume || 0;
    },
    setCurrentTime(percent = 0) {
      const audio = this.$refs.audioPlayerRef;
      audio.currentTime = this.meta.duration * percent;
    },
    changeAudioCurrTime(percent) {
      this.setCurrentTime(percent);
    },
    genPeogress() {
      return (
        <div class="audio-progress">
          <div class="slider-container">
            <slider isBuffer ref="peogressSliderRef" />
          </div>
          <span class="time__current">{this.currentTime}</span>
          <span>/</span>
          <span class="time__end">{this.endTime}</span>
        </div>
      );
    },
    genVolume() {
      return (
        <div class="audio-volume">
          <i class="iconfont-qds-crm icon-surface_volume icon__volume"></i>
          <slider currentPos={this.currentValue * 100} />
        </div>
      );
    },
  },
  render() {
    return (
      <div class={['paly-audio', 'audio', this.callClass]}>
        {this.genAudio()}
        {this.genController()}
        {this.genPeogress()}
        {this.isSound ? this.genVolume() : ''}
      </div>
    );
  },
};
