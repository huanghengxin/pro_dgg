import './index.scss';
import ShowTooltip from 'components/show-tooltip';
// import $Bus from 'utils/store';
export default {
  components: {
    ShowTooltip,
  },
  data() {
    return {
      loading: false,
      productName: '', //判断当前是属于什么产品
      //服务
      serviceProductDialog: false, //点击服务产品选择，显示属性对话框
      sku1: [],
      sku2: [],
      sku3: [],
      addedValue: [],
      skuSubmit: {
        sku1: {},
        sku2: {},
        sku3: {},
        addedValue: {},
      },
      serveName: '',
      registerCompanyPrice: 0,
      query: {
        serviceNum: 1, //计数器 数量 服务产品
        resourceNum: 1, //计数器 数量 资源产品
        dealNum: 1, //计数器 数量 交易产品
      },
      deepColorFlag: false, //减号为0时深颜色
      shallowColorFlag: false, //加号为10时浅颜色
      confirmRowInfo: {}, //确定的一行数据
      skuAttrs: [], //sku属性
    };
  },
  computed: {},
  created() {},
  methods: {
    skuHandleClick(skuName, index, item) {
      this.$set(this.skuSubmit[skuName], 'code', item.code);
      this.skuSubmit[skuName].name = item.name;
      this.skuSubmit[skuName].id = item.id;
    },
    /**
     * @description 获取不同列表的筛选字段数据
     */
    getProductInfo() {
      let res = {
        sku1: [
          {
            id: '1234561',
            name: '创建订单1',
            code: '1',
            price: '100',
          },
          // {
          //   id: '1234562',
          //   name: '创建订单2',
          //   code: '2',
          //   price: '100',
          // },
          // {
          //   id: '1234563',
          //   name: '创建订单3',
          //   code: '3',
          //   price: '100',
          // },
        ],
        sku2: [
          {
            id: '1234564',
            name: '创建订单4',
            code: '1',
            price: '100',
          },
          // {
          //   id: '1234565',
          //   name: '创建订单5',
          //   code: '5',
          //   price: '100',
          // },
          // {
          //   id: '1234566',
          //   name: '创建订单',
          //   code: '6',
          // },
        ],
        sku3: [
          {
            id: '1234564',
            name: '创建订单7',
            code: '1',
            price: '100',
          },
          // {
          //   id: '1234565',
          //   name: '创建订单8',
          //   code: '5',
          //   price: '100',
          // },
          // {
          //   id: '1234566',
          //   name: '创建订单',
          //   code: '6',
          // },
        ],
        addedValue: [
          {
            id: '12345647',
            name: '任务项值1',
            price: '100',
            code: '1',
          },
          // {
          //   id: '1234568',
          //   name: '任务项值2',
          //   price: '100',
          //   code: '2',
          // },
        ],
      };
      // this.$set(this, "productTableInfo",res )
      this.sku1 = res.sku1;
      this.sku2 = res.sku2;
      this.sku3 = res.sku3;
      res.addedValue.forEach((item, index) => {
        item.priceContent = item.name + '/￥' + item.price;
      });
      this.addedValue = res.addedValue;
      // this.skuSubmit.sku1 = res.sku1[0]; //默认选中
      // this.skuSubmit.sku2 = res.sku2[0]; //默认选中
      // this.skuSubmit.sku3 = res.sku3[0]; //默认选中
      // this.skuSubmit.addedValue = res.addedValue[0];//默认选中
    },
    /**
     * @description 服务产品计数器
     */
    serviceNumChange(value) {
      // console.log(value);
    },
    //服务产品 产品数值减少
    reserveMinus() {
      this.query.serviceNum--;
    },
    //服务产品 产品数值增加
    reserveAdd() {
      this.query.serviceNum++;
    },
    /**
     * @description 打开对话框
     */
    openModal(name, row) {
      this.productName = name;
      if (name == 'serve') {
        this.registerCompanyPrice = row.referencePrice;
      } else {
        this.registerCompanyPrice = row.platformPrice;
      }
      this.serveName = row.name;
      console.log(name, row, 'row');
      this.skuAttrs = row.skuAttrs;
      console.log(this.skuAttrs, 'skuAttrs');
      this.confirmRowInfo = row;
      this.getProductInfo();
      this.serviceProductDialog = true;
    },
    /**
     * @description  清空
     */
    productClosed() {
      this.skuSubmit.sku1 = {};
      this.skuSubmit.sku2 = {};
      this.skuSubmit.sku3 = {};
      this.skuSubmit.addedValue = {};
    },
    /**
     * @description 继续加购 服务产品
     */
    continueBuy() {
      if (this.productName == 'serve') {
        //sku属性值组合为字符串
        if (!this.skuSubmit.sku1.code || !this.skuSubmit.sku2.code || !this.skuSubmit.sku3.code) {
          this.$message.warning('请选择SKU属性信息！');
          return false;
        }
        this.$set(this.confirmRowInfo, 'num', this.query.serviceNum);
        //任务项
        let arr = [
          { code: 1, name: '普通核名' },
          { code: 1, name: '普通核名' },
          { code: 3, name: '增值服务项', price: 100 },
        ];
        this.confirmRowInfo.taskItem = arr;
        //sku属性值组合为字符串
        const skuSubmit = this.skuSubmit;
        let str = Object.keys(skuSubmit).reduce((cur, acc) => {
          cur += skuSubmit[acc].name;
          return cur;
        }, '');
        this.confirmRowInfo.skuContent = str;
        this.$emit('on-choose-serve', this.confirmRowInfo, 'serve');
      } else if (this.productName == 'resource') {
        this.confirmRowInfo.num = 1;
        this.confirmRowInfo.name = this.serveName;
        this.$emit('on-choose-resource', this.confirmRowInfo, 'resource');
      } else {
        this.confirmRowInfo.num = 1;
        this.confirmRowInfo.name = this.serveName;
        this.$emit('on-choose-serve', this.confirmRowInfo, 'deal');
      }
      this.serviceProductDialog = false;
    },

    /**
     * @description 确定Sku 服务产品
     */
    confirmSku() {
      //服务产品
      if (this.productName == 'serve') {
        //sku属性值组合为字符串
        if (!this.skuSubmit.sku1.code || !this.skuSubmit.sku2.code || !this.skuSubmit.sku3.code) {
          this.$message.warning('请选择SKU属性信息！');
          return false;
        }
        this.loading = true;
        const skuSubmit = this.skuSubmit;
        //任务项
        let arr = [
          { code: 1, name: '普通核名' },
          { code: 1, name: '普通核名' },
          { code: 3, name: '增值服务项', price: 100 },
        ];
        this.confirmRowInfo.taskItem = arr;
        //将sku属性值 组合成字符串
        let str = Object.keys(skuSubmit).reduce((cur, acc) => {
          if (skuSubmit[acc].name) {
            cur += skuSubmit[acc].name;
          }
          return cur;
        }, '');
        let item = this.confirmRowInfo;
        item.skuContent = str;
        this.$set(item, 'num', this.query.serviceNum);
      } else {
        //资源产品 //交易产品
        this.loading = true;
      }
      this.$set(this.confirmRowInfo, 'isClick', true);

      console.log(this.confirmRowInfo, 'this.confirmRowInfo');
      setTimeout(() => {
        this.$emit('on-choose-confirm', this.confirmRowInfo); //确定的数据 传给已加购数组
        this.$eventBus.$emit('confirm-product-row', this.confirmRowInfo);
        this.$emit('close-modal', false); //关闭父级弹框
        this.serviceProductDialog = false;
        this.loading = false;
      }, 500);
    },
  },
};
