export default {
  props: {
    currentPos: {
      type: Number,
      default: 0,
    },
    isBuffer: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      startPosition: this.currentPos,
      currentPosition: this.currentPos,
      currentValue: 0,
      isDragging: false,
      startX: 0,
    };
  },
  mounted() {
    if (this.currentPosition) {
      this.updateView();
    }
  },
  methods: {
    /**
     * @description 改变当前播放进度位子
     * @param {String} 距离位子
     */
    changeCurrentPosition(position) {
      if (this.isDragging) return;
      this.currentPosition = position || 0;
      this.updateView();
    },
    // 更新视图
    updateView() {
      const { thumbBoxRef, progressBoxRef } = this.$refs;
      const currentPosition = this.currentPosition;
      this.currentValue = Math.floor(currentPosition);
      thumbBoxRef.style.left = currentPosition + '%';
      progressBoxRef.style.width = currentPosition + '%';
    },

    // 根据点击位置计算对应时间或音量
    changeAudioAbort() {
      let percent = this.currentPosition * 0.01;
      if (this.isBuffer) {
        this.$parent.changeAudioCurrTime(percent);
      } else {
        const volume = Math.max(0, Math.min(percent.toFixed(1), 1));
        this.$parent.setCurrentVolume(volume);
      }
    },
    setPosition(clientX) {
      const sliderBox = this.$refs.sliderRef;
      const contentWidth = sliderBox.offsetWidth;
      // 计算当前拖动位置与初始拖动位置的距离
      const diff = clientX - this.startX;
      // 计算差距占精度条的百分比
      const percent = (diff / contentWidth).toFixed(6) * 100;
      this.currentPosition = Math.max(0, Math.min(this.startPosition + percent, 100));
      this.updateView();
    },
    dragStart(event) {
      this.isDragging = true;
      // 记录开始滑动时clientX
      this.startX = event.clientX;
      // 记录当前位置为开始值
      this.startPosition = this.currentPosition;
    },
    dragEnd() {
      this.changeAudioAbort();
      this.isDragging = false;
      document.removeEventListener('mousemove', this.dragging);
      document.removeEventListener('mouseup', this.dragEnd);
    },
    dragging(event) {
      if (!this.isDragging) return;
      this.setPosition(event.clientX);
      // 进度在拖动过程中不改变当前播放进度
      // 音量设置立即改变
      if (!this.isBuffer) {
        this.changeAudioAbort();
      }
    },
    /**
     * @description 进度条
     */
    genSlider() {
      const progressBufferNode = this.isBuffer ? <div class="progress-buffer"></div> : '';
      return (
        <div
          class="slider"
          ref="sliderRef"
          onClick={(event) => {
            const contentBox = event.currentTarget.getBoundingClientRect();
            const percent = ((event.clientX - contentBox.left) / contentBox.width) * 100;
            this.currentPosition = Math.max(0, Math.min(percent, 100));
            this.updateView();
            this.changeAudioAbort();
          }}>
          <div class="slider-progress" ref="progressBoxRef">
            {progressBufferNode}
          </div>
          <div
            class="slider-runway"
            ref="thumbBoxRef"
            onMousedown={(event) => {
              event.stopPropagation();
              this.dragStart(event);
              document.addEventListener('mousemove', this.dragging);
              document.addEventListener('mouseup', this.dragEnd);
            }}>
            <div class="thumb"></div>
          </div>
        </div>
      );
    },
  },
  render() {
    return this.genSlider();
  },
};
