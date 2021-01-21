import 'assets/font-crm/iconfont.js';
import './index.scss';
const TYPE = {
  nodata: {
    fontSize: '60px',
    text: '暂无数据',
  },
  noSearch: {
    fontSize: '300px',
    text: '没有搜索到结果~',
  },
};
export default {
  props: {
    type: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    tag: {
      type: String,
      default: 'div',
    },
    textContent: {
      type: String,
      default: '',
    },
    avaClass: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: '',
    },
  },

  methods: {
    isImage(icon) {
      return icon ? icon.indexOf('/') !== -1 : false;
    },
    genSvg() {
      const { size, icon, type, avaClass, tag, textContent } = this;
      const newSize = size ? size : TYPE[type]?.fontSize || '';
      const node = this.isImage(icon) ? (
        <img src={icon} />
      ) : (
        <svg class="svg-icon" style={{ fontSize: newSize }} aria-hidden="true">
          <use xlinkHref={'#' + icon}></use>
        </svg>
      );
      if (TYPE[type]) {
        const text = textContent ? textContent : TYPE[type]?.text;
        return (
          <tag class={['data-available', avaClass]}>
            {node}
            {text ? <p class="type-text">{text}</p> : ''}
          </tag>
        );
      } else {
        return node;
      }
    },
  },
  render() {
    return this.genSvg();
  },
};
