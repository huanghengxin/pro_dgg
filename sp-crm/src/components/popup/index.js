import PopupManager from 'element-ui/lib/utils/popup/popup-manager';
import Vue from 'vue';
import PopperJS from './popper';
const stop = (e) => e.stopPropagation();
import './index.scss';
export default {
  props: {
    width: {
      type: String,
      default: '100',
    },
    placement: {
      type: String,
      default: 'bottom',
    },
    transformOrigin: {
      type: [Boolean, String],
      default: true,
    },
    visibleArrow: {
      type: Boolean,
      default: true,
    },
    arrowOffset: {
      type: Number,
      default: 0,
    },
    offset: {
      type: Number,
      default: 0,
    },
    appendToBody: {
      type: Boolean,
      default: true,
    },
    popperOptions: {
      type: Object,
      default() {
        return {
          gpuAcceleration: false,
        };
      },
    },
  },
  data() {
    return {
      tooltipId: `tooltip-${Math.floor(Math.random() * 10000)}`,
      showPopper: false,
      currentPlacement: '',
    };
  },
  created() {
    if (this.appendToBody) {
      this.popperVM.$mount();
    }
  },
  beforeCreate() {
    this.popperVM = new Vue({
      data: { node: '' },
      render(h) {
        return this.node;
      },
    }).$mount();
  },
  watch: {
    showPopper(val) {
      val ? this.updatePopper() : this.destroyPopper();
    },
  },
  render() {
    const { showPopper, width, tooltipId } = this;
    if (this.popperVM) {
      this.popperVM.node = (
        <transition name="crm-fade-in-linear">
          <div
            class="crm-popup"
            ref="popper"
            role="tooltip"
            v-show={showPopper}
            style={{ width: width + 'px' }}
            id={tooltipId}>
            {this.$slots.content}
          </div>
        </transition>
      );
    }
    return this.$slots.default[0];
  },
  mounted() {
    const referenceElm = (this.referenceElm = this.$el);
    if (this.$el.nodeType === 1) {
      this.$el.setAttribute('aria-describedby', this.tooltipId);
      this.$el.setAttribute('tabindex', 0);
      referenceElm.addEventListener('click', this.doToggle);
      document.addEventListener('click', this.handleDocumentClick);
    }
  },
  methods: {
    appendArrow(element) {
      let hash;
      if (this.appended) {
        return;
      }

      this.appended = true;

      for (let item in element.attributes) {
        if (/^_v-/.test(element.attributes[item].name)) {
          hash = element.attributes[item].name;
          break;
        }
      }

      const arrow = document.createElement('div');

      if (hash) {
        arrow.setAttribute(hash, '');
      }
      arrow.setAttribute('x-arrow', '');
      arrow.className = 'popper__arrow';
      element.appendChild(arrow);
    },
    createPopper() {
      this.currentPlacement = this.currentPlacement || this.placement;
      if (!/^(top|bottom|left|right)(-start|-end)?$/g.test(this.currentPlacement)) {
        return;
      }

      const options = this.popperOptions;
      const popper = this.$refs.popper;
      let reference = this.referenceElm;
      if (!popper || !reference) return;
      if (this.visibleArrow) this.appendArrow(popper);
      if (this.appendToBody) {
        document.body.appendChild(popper);
      } else {
        this.$el.appendChild(popper);
      }
      if (this.popperJS && this.popperJS.destroy) {
        this.popperJS.destroy();
      }
      options.placement = this.currentPlacement;
      options.offset = this.offset;
      options.arrowOffset = this.arrowOffset;
      this.popperJS = new PopperJS(reference, popper, options);
      this.popperJS.onCreate((_) => {
        this.$emit('created', this);
        this.resetTransformOrigin();
        this.$nextTick(this.updatePopper);
      });
      popper.addEventListener('click', stop);
    },
    resetTransformOrigin() {
      if (!this.transformOrigin) return;
      let placementMap = {
        top: 'bottom',
        bottom: 'top',
        left: 'right',
        right: 'left',
      };
      let placement = this.popperJS._popper.getAttribute('x-placement').split('-')[0];
      let origin = placementMap[placement];
      this.popperJS._popper.style.transformOrigin =
        typeof this.transformOrigin === 'string'
          ? this.transformOrigin
          : ['top', 'bottom'].indexOf(placement) > -1
          ? `center ${origin}`
          : `${origin} center`;
    },
    destroyPopper() {
      if (this.popperJS) {
        this.resetTransformOrigin();
      }
    },
    updatePopper() {
      const popperJS = this.popperJS;
      if (popperJS) {
        popperJS.update();
        if (popperJS._popper) {
          popperJS._popper.style.zIndex = PopupManager.nextZIndex();
        }
      } else {
        this.createPopper();
      }
    },
    doToggle() {
      this.showPopper = !this.showPopper;
    },
    handleDocumentClick(e) {
      const el = this.$el;
      if ((el && el.contains(e.target)) || this.$refs.popper?.contains(e.target)) {
        return;
      }
      this.showPopper = false;
    },
  },
  beforeDestroy() {
    this.popperVM && this.popperVM.$destroy();
  },
  destroyed() {
    const referenceElm = this.referenceElm;
    referenceElm.removeEventListener('click', this.doToggle);
    document.removeEventListener('click', this.handleDocumentClick);
  },
};
