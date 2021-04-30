import './index.scss';
import Popup from '../popup';
import emojiJSON from './utils/emoji.json';
const { emojiList } = emojiJSON;
export default {
  name: 'ChatEmoji',
  props: {
    width: {
      type: String,
      default: '100%px',
    },
  },
  components: {
    Popup,
  },
  data() {
    return {
      currentAlbum: 'Emotions',
      cursorPosition: undefined,
    };
  },
  computed: {
    curItemEmoji() {
      return emojiList[this.currentAlbum];
    },
  },

  methods: {
    handleClick() {},
    changeEmojiSort(e) {
      const sort = e.target.dataset?.sort;
      if (!sort && sort != this.currentAlbum) return;
      this.currentAlbum = sort;
    },
    /**
     * 获取光标位置
     * @param {DOMElement} element 输入框的dom节点
     * @return {Number} 光标位置
     */
    getCursorPosition(element) {
      let caretOffset = 0;
      const doc = element.ownerDocument || element.document;
      const win = doc.defaultView || doc.parentWindow;
      const sel = win.getSelection();
      if (sel.rangeCount > 0) {
        const range = win.getSelection().getRangeAt(0);
        const preCaretRange = range.cloneRange();
        preCaretRange.selectNodeContents(element);
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        caretOffset = preCaretRange.toString().length;
      }
      return caretOffset;
    },
    /**
     * 设置光标位置
     * @param {DOMElement} element 输入框的dom节点
     * @param {Number} cursorPosition 光标位置的值
     */
    setCursorPosition(element, cursorPosition) {
      const range = document.createRange();
      range.setStart(element.firstChild, cursorPosition);
      range.setEnd(element.firstChild, cursorPosition);
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getCursor() {
      const editor = this.$refs.inputBox;
      this.cursorPosition = this.getCursorPosition(editor);
    },
    insertEmoji(emoji) {
      const cursorPosition = this.cursorPosition;
      const editor = this.$refs.inputBox;
      const text = editor.innerHTML;
      // 插入 emoji
      editor.innerHTML =
        text.slice(0, cursorPosition) + emoji + text.slice(cursorPosition, text.length);
      // 光标位置后挪一位，以保证在刚插入的 emoji 后面
      this.setCursorPosition(editor, this.cursorPosition + 1);
      // 更新本地保存的光标位置变量（注意 emoji 占两个字节大小，所以要加1）
      this.cursorPosition = this.getCursorPosition(editor) + 1; //  emoji 占两位
    },
    chooseEmojiItem(e) {
      const item = e.target.dataset?.item;
      const emoji = e.target.dataset?.emoji;
      if (!item) return;
      this.insertEmoji(emoji);
    },
    genEmoji() {
      const { currentAlbum, curItemEmoji, changeEmojiSort, chooseEmojiItem } = this;
      return (
        <div slot="content" class="content">
          <div class="scroll-emoji">
            <div class="content-emoji" on-click={chooseEmojiItem}>
              {Object.entries(curItemEmoji).map(([key, value]) => {
                return (
                  <img
                    title={key}
                    data-item={key}
                    data-emoji={value.emoji}
                    src={require(`assets/emoji/${key}.png`)}
                    class="content-emoji_item"
                  />
                );
              })}
            </div>
          </div>
          <div class="content-bar" on-click={changeEmojiSort}>
            {Object.keys(emojiList).map((emoji) => {
              return (
                <img
                  src={require(`assets/image/${emoji}.png`)}
                  data-sort={emoji}
                  class={{
                    'content-bar_sort-active': currentAlbum === emoji,
                    'content-bar_sort': true,
                  }}
                />
              );
            })}
          </div>
        </div>
      );
    },
    genInput() {
      return (
        <div class="chat-emoji" style={this.width}>
          <div
            ref="inputBox"
            on-keyup={this.getCursor}
            on-click={this.getCursor}
            class="input-box"
            enterkeyhint="send"
            contenteditable></div>
          <div class="utils-box">
            <Popup placement="top" width="412" visibleArrow={false} appendToBody={false}>
              <div>
                <i class="iconfont-qds-crm icon-start icon"></i>
              </div>
              {this.genEmoji()}
            </Popup>
            <el-button
              type="primary"
              size="small"
              data-tid="searchButton"
              on-click={this.handleClick}>
              发布
            </el-button>
          </div>
          <div slot="content"></div>
        </div>
      );
    },
  },
  render() {
    return this.genInput();
  },
};
