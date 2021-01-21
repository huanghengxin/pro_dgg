import './index.scss';
import { get_page } from 'api/push-sheet';
import ShowTooltip from 'components/show-tooltip';
import { get_user_website, get_user_business_category } from 'api/common';
import SvgIcon from 'components/svg-icon';
import ConfirmProductServe from '../confirm-product-serve-dialog'; //确定服务产品对话框
export default {
  components: {
    ConfirmProductServe,
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      activeName: 'serve',
      tabType: '', //用于判断是那个tab页
      loading: false,
      productForm: {
        //服务产品表单
        query: '', //综合搜索
        productType: '', //产品分类
        productCity: '', //产品城市
        currentPage: 1, //当前页
        pagesize: 10, //每页显示条数
        price: {
          priceMin: null, //单价最小值
          priceMax: null, //单价最大值
        },
      },
      total: 0,
      productClassify: [
        //服务产品分类数据
        {
          value: '选项1',
          label: '黄金糕',
        },
      ],
      productCity: [
        //产品城市数据
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
      ],
      resourceForm: {
        //资源产品表单
        query: '', //综合搜索
        productType: '', //产品分类
        currentPage: 1, //当前页
        price: {
          priceMin: null, //单价最小值
          priceMax: null, //单价最大值
        },
        pagesize: 10, //每页显示条数
      },

      serveFormRules: {
        query: [{ required: true, message: '请输入客户名称/商机编号', trigger: 'blur' }],
      },
      //资源产品分类数据
      resourceClassify: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        // {
        //   value: '选项2',
        //   label: '双皮奶',
        // },
      ],
      //资源产品分类数据
      resourceCity: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        {
          value: '选项2',
          label: '双皮奶',
        },
      ],

      //交易产品表单
      dealForm: {
        query: '', //综合搜索
        productType: '', //产品分类
        currentPage: 1, //当前页
        price: {
          priceMin: null, //单价最小值
          priceMax: null, //单价最大值
        },
        pagesize: 10, //每页显示条数
      },
      //交易数据表格
      dealProductData: [],
      //产品分类
      // productProps: {
      //   value: 'showTypeCode',
      //   label: 'showTypeName',
      //   children: 'children',
      //   clearable: 'true',
      // },
      productProps: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || undefined,
            code: value,
          };
          get_user_business_category(params).then((res) => {
            if (res.code === 200) {
              let { data } = res;
              data = Array.isArray(data) ? data : [];
              const _arrMap = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              resolve(_arrMap);
            } else {
              this.$message.warning(res.message);
              resolve([]);
            }
          });
        },
      },
      // //城市分类
      // cityProps: {
      //   value: 'showTypeCode',
      //   label: 'showTypeName',
      //   children: 'children',
      //   clearable: 'true',
      // },
      cityProps: {
        lazy: true,
        lazyLoad: (node, resolve) => {
          const { level, data, value } = node;
          const params = {
            productTypeCode: data?.productTypeCode || undefined,
            code: value,
          };
          get_user_business_category(params).then((res) => {
            if (res.code === 200) {
              let { data } = res;
              data = Array.isArray(data) ? data : [];
              const _arrMap = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              resolve(_arrMap);
            } else {
              this.$message.warning(res.message);
              resolve([]);
            }
          });
        },
      },
      //交易产品分类数据
      dealClassify: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        // {
        //   value: '选项2',
        //   label: '双皮奶',
        // },
      ],
      //交易产品分类数据
      dealCity: [
        {
          value: '选项1',
          label: '黄金糕',
        },
        // {
        //   value: '选项2',
        //   label: '双皮奶',
        // },
      ],
      serviceAlreadyTableData: null, //已选择服务产品继续加购数组
      chooseProductDialog: false, //控制选择产品对话框显示隐藏
      productTableInfo: [], //统一表格数据存放
      showPaginationFlag: false,
    };
  },
  methods: {
    /**
     * @description tab页数据请求  点击重新请求
     */
    productTabClick(val) {
      this.activeName = val.name;
      console.log(this.activeName, 'activeName');
      this.productTableInfo = [];
      this.showPaginationFlag = false;
      if (this.activeName == 'serve') {
        this.getProductlist(this.activeName);
      } else if (this.activeName == 'resource') {
        // this.getProductlist(this.activeName);
      } else {
        // this.getProductlist(this.activeName);
      }
    },
    /**
     * @description 服务产品搜索
     */
    searchService() {
      if (this.activeName == 1) {
        if (this.productForm.price.priceMin && !this.checkNumber(this.productForm.price.priceMin)) {
          this.$message.warning('单价最小值格式不正确');
          return false;
        } else if (
          this.productForm.price.priceMax &&
          !this.checkNumber(this.productForm.price.priceMax)
        ) {
          this.$message.warning('单价最大值格式不正确');
        } else if (
          this.productForm.price.priceMax &&
          this.productForm.price.priceMin &&
          this.productForm.price.priceMin >= this.productForm.price.priceMax
        ) {
          this.$message.warning('请重新输入');
          this.productForm.price.priceMin = null;
          this.productForm.price.priceMax = null;
        }
      } else if (this.activeName == 2) {
        if (
          this.resourceForm.price.priceMin &&
          !this.checkNumber(this.resourceForm.price.priceMin)
        ) {
          this.$message.warning('单价最小值格式不正确');
          return false;
        } else if (
          this.resourceForm.price.priceMax &&
          !this.checkNumber(this.resourceForm.price.priceMax)
        ) {
          this.$message.warning('单价最大值格式不正确');
        } else if (
          this.resourceForm.price.priceMax &&
          this.resourceForm.price.priceMin &&
          this.resourceForm.price.priceMin >= this.resourceForm.price.priceMax
        ) {
          this.$message.warning('请重新输入');
          this.resourceForm.price.priceMin = null;
          this.resourceForm.price.priceMax = null;
        }
      } else {
        if (this.dealForm.price.priceMin && !this.checkNumber(this.dealForm.price.priceMin)) {
          this.$message.warning('单价最小值格式不正确');
          return false;
        } else if (
          this.dealForm.price.priceMax &&
          !this.checkNumber(this.dealForm.price.priceMax)
        ) {
          this.$message.warning('单价最大值格式不正确');
        } else if (
          this.dealForm.price.priceMax &&
          this.dealForm.price.priceMin &&
          this.dealForm.price.priceMin >= this.dealForm.price.priceMax
        ) {
          this.$message.warning('请重新输入');
          this.dealForm.price.priceMin = null;
          this.dealForm.price.priceMax = null;
        }
      }
    },
    /**
     * @description 服务产品重置表单
     */
    resetService() {
      if (this.activeName == 'serve') {
        this.$refs.productFormRef.resetFields();
        this.productForm.price = {};
      } else if (this.activeName == 'resource') {
        this.$refs.resourceFormRef.resetFields();
        this.resourceForm.price = {};
      } else {
        this.$refs.dealFormRef.resetFields();
        this.dealForm.price = {};
      }
    },
    /**
     * @description 服务产品 全部移除数组数据
     */
    delAll() {
      this.serviceAlreadyTableData = [];
    },
    /**
     * @description 服务产品 全部移除单行数据
     */
    remove(row, index) {
      this.serviceAlreadyTableData.splice(index, 1);
    },
    //确认产品信息弹窗的继续加购事件传来的数据 对象    服务
    OnChooseHandleServe(value, type) {
      this.tabType = type;
      console.log(value, type, '继续加购');
      if (type == 'serve') {
        if (Array.isArray(this.serviceAlreadyTableData)) {
          this.serviceAlreadyTableData.push(value);
        } else {
          this.serviceAlreadyTableData = [];
          this.serviceAlreadyTableData.push(value);
        }
      } else {
        if (Array.isArray(this.serviceAlreadyTableData)) {
          this.serviceAlreadyTableData.push(value);
        } else {
          this.serviceAlreadyTableData = [];
          this.serviceAlreadyTableData.push(value);
        }
      }
    },
    normal(value) {
      if (Array.isArray(this.resourceAlreadyTableData)) {
        this.resourceAlreadyTableData.push(value);
      } else {
        this.resourceAlreadyTableData = [];
        this.resourceAlreadyTableData.push(value);
      }
    },
    //确认产品信息弹窗的继续加购事件传来的数据 对象   资源
    OnChooseHandleResource(value, type) {
      console.log(value, type, '继续加购');
      if (type == 'serve') {
        this.normal(value);
      } else if (type == 'resource') {
        this.normal(value);
      } else {
        this.normal(value);
      }
    },
    //确认产品信息弹窗的确定事件传来的数据 对象
    OnChooseConfirmHandle(value) {
      if (Array.isArray(this.serviceAlreadyTableData)) {
        this.serviceAlreadyTableData.push(value);
      } else {
        this.serviceAlreadyTableData = [];
        this.serviceAlreadyTableData.push(value);
      }
    },
    //点击选择服务产品表格的每一项
    chooseBusinessItem(row) {
      this.$refs.confirmProductServeRef.openModal(this.activeName, row);
    },
    /**
     * @description 服务产品 改变当前页显示数量
     */
    sizeChange(val) {
      console.log(val, '服务产品 改变当前页显示数量');
      this.productForm.pagesize = val;
      this.getProductlist();
    },
    /**
     * @description 服务产品 改变当前页
     */
    currentChange(val) {
      console.log(val, '服务产品 改变当前页');
      this.productForm.currentPage = val;
      this.getProductlist();
    },
    /**
     * @description 确定选择产品
     */

    confirmProduct() {
      if (this.serviceAlreadyTableData) {
        this.$emit('continue-check-list', this.serviceAlreadyTableData);
        this.chooseProductDialog = false;
      } else {
        this.$message.warning('请先选择产品');
      }
    },
    /**
     * @description 获取服务产品表格数据
     */
    getProductlist(tabName) {
      let params = { pageSize: this.productForm.pagesize, pageNum: this.productForm.currentPage };
      get_page(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            this.showPaginationFlag = true;
            console.log(data.records, '服务产品');
            data.records.forEach((item, index) => {
              item.index = index + 1;
            });
            if (tabName == 'serve') {
              this.productTableInfo = data.records;
              this.productForm.pagesize = data.limit;
              this.productForm.currentPage = data.currentPage;
              this.total = Number(data.totalCount);
              this.loading = false;
              console.log('serve');
            } else if (tabName == 'resource') {
              console.log('resource');
            } else {
              console.log('deal');
            }
          } else {
            this.$message.warning(message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 关闭选择产品的弹框
     */
    closedChooseProductModal() {
      this.serviceAlreadyTableData = null;
      this.$refs.productFormRef.resetFields();
      this.$refs.resourceFormRef.resetFields();
      this.$refs.dealFormRef.resetFields();
      this.productForm.price.priceMin = null;
      this.productForm.price.priceMax = null;
      this.resourceForm.price.priceMin = null;
      this.resourceForm.price.priceMax = null;
      this.dealForm.price.priceMin = null;
      this.dealForm.price.priceMax = null;
    },
    /**
     * @description 等待调用的开启对话框事件
     */
    openModal() {
      this.chooseProductDialog = true;
      this.loading = true;
      //获取主页产品表格数据
      this.getProductlist('serve');
      this.getProductClassify(); //获取产品分类
      this.getCityClassify(); //获取城市分类
    },
    /**
     * @description 等待子级触发关闭对话框事件
     */
    closeModal(val) {
      console.log(val, 'val');
      this.chooseProductDialog = val;
    },
    /**
     * @description 获取产品信息的子级数据
     */
    getServeInfo(val) {},
    /**
     * @description 获取产品分类信息接口
     */
    getProductClassify() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.productClassify = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 获取产品分类信息接口
     */
    getCityClassify() {
      get_user_website()
        .then((res) => {
          if (res.code === 200) {
            res = res.data;
            this.productCity = res?.list || [];
          } else {
            this.$message.warning(res.message);
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
