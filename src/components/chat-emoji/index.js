import './index.scss';

export default {
  name: 'ChatEmoji',
  data() {
    return {
      visible: false,
    };
  },
  methods: {
    handleBoxClick() {},
    handleClick() {},
    genEmoji() {},
    genInput() {
      const { visible } = this;
      return (
        <div class="chat-emoji">
          <div
            ref="inputBox"
            on-click={this.handleBoxClick}
            class="input-box"
            enterkeyhint="send"
            contenteditable></div>
          <div class="utils-box">
            <i
              class="iconfont-qds-crm icon-start"
              on-click={() => {
                this.visible = !visible;
              }}></i>
            <el-button
              type="primary"
              size="small"
              data-tid="searchButton"
              on-click={this.handleClick}>
              发布
            </el-button>
          </div>
          <div v-show={visible}>dsssssssss</div>
        </div>
      );
    },
  },
  render() {
    return this.genInput();
  },
};
