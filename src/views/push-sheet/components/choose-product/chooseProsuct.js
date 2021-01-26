import './index.scss';
import { get_page, get_resource_page, get_deal_page } from 'api/push-sheet';
import ShowTooltip from 'components/show-tooltip';
import TowInput from 'components/two-input';
import { get_user_website, get_user_business_category } from 'api/common';
import SvgIcon from 'components/svg-icon';
import ConfirmProductServe from '../confirm-product-serve-dialog'; //确定服务产品对话框
import { timesSeries } from 'async';
export default {
  components: {
    TowInput,
    ConfirmProductServe,
    ShowTooltip,
    SvgIcon,
  },
  data() {
    return {
      parentList: [], //父页面展示数据
      activeName: 'serve',
      tabType: '', //用于判断是那个tab页
      loading: false,
      serveForm: {
        //服务产品表单
        searchKey: undefined, //综合搜索
        cityCode: undefined, //地区code
        classifyCode: undefined, //分类code
        parentClassifyCode: undefined, //父级分类
        maxPrice: undefined,
        minPrice: undefined,
      },
      pageData: {
        pageNum: 1, //当前页
        pageSize: 10, //每页显示条数
      },
      productPrice: '', //服务产品单价
      total: 0,
      //服务产品分类数据
      productClassify: [], //产品城市数据
      productCity: [],
      //资源产品表单
      resourceForm: {
        searchKey: undefined, //综合搜索
        classifyCode: undefined, //分类code
        parentClassifyCode: undefined, //父级分类
        maxPrice: undefined,
        minPrice: undefined,
      },

      serveFormRules: {
        searchKey: [{ required: true, message: '请输入客户名称/商机编号', trigger: 'blur' }],
      },

      //交易产品表单
      dealForm: {
        searchKey: undefined, //综合搜索
        classifyCode: undefined, //分类code
        parentClassifyCode: undefined, //父级分类
        maxPrice: undefined,
        minPrice: undefined,
      },
      //交易数据表格
      dealProductData: [],
      //产品分类 共用一个
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
      serviceAlreadyTableData: null, //已选择服务产品继续加购数组
      chooseProductDialog: false, //控制选择产品对话框显示隐藏
      productTableInfo: [], //统一表格数据存放
      showPaginationFlag: false,
    };
  },
  methods: {
    /**
     * @description 清空综合筛选值事件
     */
    clearQuery() {
      this.serveForm.searchKey = undefined;
      this.getProductlist(this.activeName);
    },
    /**
     * @description 清空分类选值事件
     */
    clearClass() {
      this.serveForm.classifyCode = undefined;
      this.serveForm.parentClassifyCode = undefined;
      this.getProductlist(this.activeName);
    },
    /**
     * @description 级联选择器改变
     */
    productPropsChange(val) {
      console.log(val, 'val');
      if (val) {
        if (this.activeName == 'serve') {
          this.serveForm.parentClassifyCode = val ? val[0] : undefined;
          this.serveForm.classifyCode = val ? val[2] : undefined;
        } else if (this.activeName == 'resource') {
          this.resourceForm.parentClassifyCode = val ? val[0] : undefined;
          this.resourceForm.classifyCode = val ? val[2] : undefined;
        } else {
          this.dealForm.parentClassifyCode = val ? val[0] : undefined;
          this.dealForm.classifyCode = val ? val[2] : undefined;
        }
      } else {
        this.getProductlist(this.activeName);
      }
    },
    /**
     * @description 获取产品分类信息接口
     */
    getCityClassify() {
      get_user_website().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.productCity = res?.list || [];
          this.resourceCity = res?.list || [];
          this.dealCity = res?.list || [];
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取产品分类信息接口
     */
    getProductClassify() {
      get_user_website().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.productClassify = res?.list || [];
          this.resourceClassify = res?.list || [];
          console.log(this.resourceClassify, 'this.resourceClassify');
          this.dealClassify = res?.list || [];
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 改变用户授权的区域范围-服务产品
     */
    cityChange(code) {
      if (code) {
        this.serveForm.cityCode = code;
      } else {
        this.serveForm.cityCode = undefined;
        this.getProductlist(this.activeName);
      }
    },
    /**
     * @description tab页切换 数据请求  点击重新请求
     */
    productTabClick(val) {
      console.log(val.name, 'tabval');
      this.activeName = val.name;
      this.pageData.pageNum = 1;
      this.productPrice = '';
      this.resourceForm.parentClassifyCode = val ? val[0] : undefined;
      this.getProductClassify();
      this.getProductlist(this.activeName);
    },
    /**
     * @description 验证字符串是否是数字
     * @param {any}
     * @returns {Boolean}
     */
    checkNumber(data) {
      console.log(data, 'data');
      var reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(data)) return false;
    },
    /**
     * @description 服务产品搜索
     */
    searchService() {
      const flag = this.$refs[this.activeName + 'TwoInputRefs'].validateForm();
      // console.log(flag, 'productflag');
      this.productPrice = flag;
      if (!flag) return;
      this.getProductlist(this.activeName);
    },
    /**
     * @description 服务产品重置表单筛选值
     */
    resetService() {
      this.$refs[this.activeName + 'FormRef'].resetFields();
      this.$refs[this.activeName + 'TwoInputRefs'].resetFields();
      const MAP = {
        serve: 'serveForm',
        resource: 'resourceForm',
        deal: 'dealForm',
      };
      this[MAP[this.activeName]].minPrice = undefined;
      this[MAP[this.activeName]].maxPrice = undefined;
      this[MAP[this.activeName]].parentClassifyCode = undefined;
      console.log(this.activeName, 'this.activeName');
      //将单价范围的值清空
      this.productPrice = '';
      this.getProductlist(this.activeName);
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
      for (let i = 0; i < this.serviceAlreadyTableData.length; i++) {
        for (let j = 0; j < this.productTableInfo.length; j++) {
          if (this.serviceAlreadyTableData[i].id == this.productTableInfo[j].id) {
            this.$set(this.productTableInfo[j], 'isClick', true);
          }
        }
      }
    },
    //供 OnChooseHandleResource 调用
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
      let params = { ...this.pageData };
      const MAP = {
        serve: 'serveForm',
        resource: 'resourceForm',
        deal: 'dealForm',
      };
      const productPrice = this.productPrice;
      if (productPrice) {
        let price;
        if (typeof productPrice === 'boolean') {
          price = [undefined, undefined, undefined];
        } else {
          price = this.productPrice?.split('-');
        }
        this[MAP[this.activeName]].minPrice = price[0];
        this[MAP[this.activeName]].maxPrice = price[1];
      } else {
        this[MAP[this.activeName]].minPrice = undefined;
        this[MAP[this.activeName]].maxPrice = undefined;
      }
      params = { ...this[MAP[this.activeName]], ...this.pageData };
      let path =
        tabName == 'serve' ? get_page : tabName == 'resource' ? get_resource_page : get_deal_page;
      path(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            this.showPaginationFlag = true;
            data.records.forEach((item, index) => {
              item.index = index + 1;
            });
            //将交易列表中的attr 转换为数组
            if (tabName == 'deal') {
              data.records.forEach((item) => {
                if (item.attr) {
                  item.attr = item.attr.split('|');
                }
              });
            }
            for (let i = 0; i < this.parentList.length; i++) {
              for (let j = 0; j < data.records.length; j++) {
                if (this.parentList[i].id == data.records[j].id) {
                  this.$set(data.records[j], 'isClick', true);
                }
              }
            }

            console.log(
              this.productTableInfo,
              'this.productTableInfothis.productTableInfothis.productTableInfo',
            );
            this.productTableInfo = data.records;
            this.total = Number(data.totalCount);
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /**
     * @description 选择产品的弹框关闭时的事件
     */
    closedChooseProductModal() {
      this.serviceAlreadyTableData = null;
      this.$refs.serveFormRef.resetFields();
      this.$refs.resourceFormRef.resetFields();
      this.$refs.dealFormRef.resetFields();
      this.serveForm.price = null;
      this.resourceForm.price = null;
      this.dealForm.price = null;
    },
    /**
     * @description 开启对话框事件
     */
    openModal(parentList) {
      //接收到父级传下来的数组
      this.parentList = parentList;
      this.chooseProductDialog = true;
      this.loading = true;
      //获取主页产品表格数据
      this.getProductlist('serve'); //获取产品列表数据
      this.getProductClassify(); //获取产品分类
      this.getCityClassify(); //获取城市分类
    },
    /**
     * @description 子级触发关闭对话框事件
     */
    closeModal(val) {
      console.log(val, 'val');
      this.chooseProductDialog = val;
    },
    /**
     * @description 改变当前页显示数量
     */
    sizeChange(val) {
      this.pageData.pageSize = val;
      this.getProductlist(this.activeName);
    },
    /**
     * @description 改变当前页
     */
    currentChange(val) {
      this.pageData.pageNum = val;
      this.getProductlist(this.activeName);
    },
    /**
     * @description 获取产品信息的子级数据
     */
    getServeInfo(val) {},
  },
};
