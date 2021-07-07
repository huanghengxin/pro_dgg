import './index.scss';
export default {
  props: {
    width: { type: Number, required: true },
    text: String,
    textHtml: String,
    effect: String,
    placement: String,
    tooltipLineClamp: { type: Number, default: 1 },
    tooltipClass: String,
    title: String,
    titleClass: String,
  },
  data() {
    return {
      showTooltip: false,
      contentWidth: '',
    };
  },
  watch: {
    text: {
      handler() {
        this.showTooltip = false;
        this.computedWidth();
      },
      immediate: true,
    },
  },
  methods: {
    computedWidth() {
      if (this.text) {
        // this.$nextTick(() => {
        let node = document.createElement('span');
        const text = this.text?.replace(/\s/g, '');
        node.innerText = this.title ? this.title + text : text;
        const body = document.body;
        body.appendChild(node);
        const width = node?.getBoundingClientRect().width;
        body.removeChild(node);
        node = null;
        this.showTooltip = width >= this.width * this.tooltipLineClamp ? true : false;
        if (this.tooltipLineClamp > 1) {
          this.contentWidth = this.width + 'px';
        }
        // });
      }
    },
    /**
     * @description dom
     */
    genContent(h) {
      const { title, width, text, showTooltip, placement, effect, tooltipLineClamp, textHtml } =
        this;
      const tooltipClassName =
        tooltipLineClamp > 1 ? 'multi-ellipsis-l' + tooltipLineClamp : 'ellipsis';
      const textTitle = title ? <span class={this.titleClass}>{text}</span> : '';
      if (showTooltip) {
        return (
          <el-tooltip
            open-delay={400}
            effect={effect || 'dark'}
            content={text}
            placement={placement || 'top-start'}
            popper-class="show-tooltip">
            <div style={{ width: width + 'px' }} class={[tooltipClassName, this.tooltipClass]}>
              {textTitle}
              <span domPropsInnerHTML={textHtml || text}></span>
            </div>
          </el-tooltip>
        );
      } else {
        return (
          <span
            ref="content"
            style={{
              width: this.contentWidth ? this.contentWidth : 'max-content',
            }}
            class={['multi-line-clamp-l' + tooltipLineClamp, this.tooltipClass]}>
            <span class={this.titleClass}>{title ?? ''}</span>
            <span domPropsInnerHTML={textHtml || text}></span>
          </span>
        );
      }
    },
  },
  render(h) {
    return this.genContent(h);
  },
};
