import './index.scss';

export default {
  props: {
    unit: {
      type: String,
      default: '元',
    },
    connetSign: {
      type: String,
      default: '-',
    },
    value: {
      type: String,
      default: '',
    },
  },
  watch: {
    value: {
      immediate: true,
      handler() {
        if (this.value === '') return;
        const [val1, val2] = this.value.split('-');
        this.oneInput = val1;
        this.twoInput = val2;
      },
    },
  },
  data() {
    return {
      oneInput: '',
      twoInput: '',
      inFocus: '',
      message: '',
      status: true,
    };
  },
  methods: {
    resetFields() {
      this.oneInput = '';
      this.twoInput = '';
      this.inFocus = false;
      this.status = true;
      this.message = '';
    },
    validateForm() {
      if (this.twoInput) {
        if (this.status) {
          return this.oneInput + '-' + this.twoInput;
        } else {
          return undefined;
        }
      } else {
        return true;
      }
    },
    genMessage() {
      return this.status ? '' : <div class="message">{this.message}</div>;
    },
    errorHandle(message) {
      this.status = false;
      this.inFocus = false;
      this.message = message;
    },
    blurHandle(type) {
      const map = {
        one: 'twoInput',
        two: 'oneInput',
      };
      let value = this[type + 'Input'] + '';
      let otherValue = this[map[type]] + '';
      if (value === '' && otherValue === '') {
        this.status = true;
        return;
      }
      const reg = /^[0-9]{1,}([.][0-9]{1,2})?$/;
      if ((value && !value.match(reg)) || (otherValue && !otherValue.match(reg))) {
        this.errorHandle('请输入数字和两位小数');
        return;
      } else {
        if ((value && otherValue === '') || (otherValue && value === '')) {
          this.errorHandle('请输入范围的客户预算');
          return;
        } else if (Number(this.oneInput) > Number(this.twoInput)) {
          this.errorHandle('请输入正确的客户预算');
          return;
        }
        this.status = true;
      }
    },
  },
  render() {
    const { unit, connetSign, oneInput, twoInput, inFocus, status } = this;
    return (
      <div class="two-input-warp">
        <div class={['tow-input', inFocus, status ? '' : 'in-valid']}>
          <input
            maxlength="9"
            value={oneInput}
            type="text"
            onFocus={() => {
              this.inFocus = 'focus';
            }}
            onBlur={() => {
              this.blurHandle('one');
              if (this.status && this.twoInput !== '') {
                this.oneInput = parseFloat(this.oneInput);
                this.twoInput = parseFloat(this.twoInput);
              }
            }}
            onInput={(e) => {
              this.oneInput = e.target.value?.trim();
            }}
          />
          <em>{connetSign}</em>
          <input
            maxlength="9"
            value={twoInput}
            type="text"
            onFocus={() => {
              this.inFocus = 'focus';
            }}
            onBlur={() => {
              this.blurHandle('two');
              if (this.status && this.twoInput !== '') {
                this.oneInput = parseFloat(this.oneInput);
                this.twoInput = parseFloat(this.twoInput);
              }
            }}
            onInput={(e) => {
              this.twoInput = e.target.value?.trim();
            }}
          />
          <span>{unit}</span>
        </div>
        {this.genMessage()}
      </div>
    );
  },
};
