import { getAddressResource } from 'api/push-sheet';
import ChooseProduct from '../choose-product';
import TaskItemDialog from '../task-item-dialog'; //任务项对话框
// import $Bus from 'utils/store';
import ShowTooltip from 'components/show-tooltip';
import SvgIcon from 'components/svg-icon';
import './index.scss';
import { _moneyToChinese } from 'utils/moneyToChinese';

export default {
  components: {
    ChooseProduct,
    TaskItemDialog,
    ShowTooltip,
    SvgIcon,
  },
  data() {
    var validateDiscount = (rule, value, callback) => {
      var reg = /^(0.\d+|0|1)$/;
      console.log('rule', value, callback);
      if (!value) {
        callback(new Error('请输入产品折扣'));
      } else if (!reg.test(value)) {
        callback(new Error('折扣不能大于1'));
      } else {
        callback();
      }
    };
    var validateNumber = (rule, value, callback) => {
      console.log('rule', value, callback);
      if (!value) {
        callback(new Error('请输入产品数量'));
      } else {
        callback();
      }
    };
    return {
      activeName: '1', //选择产品对话框内tab
      setProductTableInfo: {
        productTableInfo: [], //产品信息表格数据
      },
      productRules: {
        discount: [{ validator: validateDiscount, trigger: 'blur' }],
        number: [{ validator: validateNumber, trigger: 'blur' }],
      },
      linkAddressForm: {
        //地址关联资源表单
        query: '', //综合搜索
        price: {
          priceMin: null, //单价最小值
          priceMax: null, //单价最大值
        },
        currentPage: 1, //当前页
        pagesize: 10, //每页显示条数
      },
      //404 关联资源表单
      numForm: {
        currentPage: 1, //当前页
        pagesize: 10, //每页显示条数
        four: '', //404  前四位
        afterFour: '', //404  后四位
        price: {
          priceMin: null, //单价最小值
          priceMax: null, //单价最大值
        },
      },
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
      loading: false,
      linkTabsActiveName: '1', //关联产品tab

      addressTableData: [], //地址资源
      //服务产品表格数据
      serveTableData: [],
      //服务产品请求数据
      serveForm: {
        currentPage: 1,
        pagesize: 10,
      },
      addressIndex: -1,
      linkResourceDialog: false, //产品信息表格编辑对对话框
      selectedServiceInfo: [], //已选择服务产品数字数组
      selectedServiceRowInfo: {}, //已选择服务产品一行的数据
      deepColorFlag: false, //减号为0时深颜色
      shallowColorFlag: false, //加号为10时浅颜色
      selectIds: [], //选中的列表数据
      discountShow: false,
      multipleSelection: [], //表格多选删除的数据
      delarr: [], //删除的id数组
      spanArr1: [], //存放每一行记录的合并数
      position1: 0, //记录spanArr1的索引值
    };
  },
  computed: {
    //产品合计
    total() {
      let res = 0;
      res += Number(this.subTotalPrice);
      return res.toFixed(2);
    },
    //优惠合计  产品的优惠金额=产品单价*（1-产品折扣）*产品数量；
    memberPrice() {
      let res = 0;
      let arr = this.setProductTableInfo.productTableInfo;
      for (let i = 0; i < arr.length; i++) {
        res +=
          Number(arr[i].referencePrice) * (1 - Number(arr[i].goodsExecutionsNumber)) * arr[i].num;
      }
      return res.toFixed(2);
    },
    //小计   小计金额=产品单价*折扣*产品数量+增值服务单价*数量
    //产品单价不包含增值服务项价格，折扣不包含增值服务
    subTotalPrice() {
      let res = 0;
      let arr = this.setProductTableInfo.productTableInfo;
      for (let i = 0; i < arr.length; i++) {
        res +=
          Number(arr[i].referencePrice) *
            Number(arr[i].goodsExecutionsNumber) *
            Number(arr[i].num) +
          Number(arr[i].taskItem[arr[i].taskItem.length - 1].price) * Number(arr[i].num);
        this.setProductTableInfo.productTableInfo[i].subTotalPrice = res; //向数组中加入小计
      }
      return res.toFixed(2);
    },
    //实付
    actualPayment() {
      let res = 0;
      res = this.total - Math.abs(this.memberPrice);
      return res.toFixed(2);
    },
    //中文价格a
    chinesePrice() {
      let res = 0;
      res = _moneyToChinese(Number(this.actualPayment));
      return res;
    },
  },
  watch: {
    'setProductTableInfo.productTableInfo': {
      handler: function(val, oldval) {
        console.log('修改后', val, '修改前', oldval);
        if (val.length > 0) {
          this.$store.commit('pushSheet/editBusinessCode', { index: 1, flag: true });
          setTimeout(() => {
            this.loading = false;
          }, 1000);
        } else {
          this.$store.commit('pushSheet/editBusinessCode', { index: 1, flag: false });
        }
        this.$store.commit('pushSheet/editProductData', val);
      },
    },
  },
  created() {
    this.$eventBus.$on('confirm-product-row', (row) => {
      //接收确认产品服务页面的一行数据
      let list = this.setProductTableInfo.productTableInfo;
      list.push(row);
      list?.forEach((item, index) => {
        item.index = index + 1;
      });
      console.log(list, 'list');
      this.GetSpanArr();
    });
  },
  methods: {
    keyup() {
      console.log('keyup');
    },
    /**
     * @description 焦点控制输入框显示隐藏
     */
    discountInput(row) {
      console.log(row);
    },
    /**
     * @description 选择产品 控制对话框显示隐藏
     */
    chooseProduct() {
      let list = this.setProductTableInfo.productTableInfo;
      this.$refs.chooseProductRef.openModal(list);
    },
    /**
     * @description 选择产品tabs切换点击
     */
    productTabClick() {
      console.log(this.activeName);
    },
    /**
     * @description 表格合并单元格
     * @param {Object}
     */
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // const linkSourceCode = this.setProductTableInfo.productTableInfo[rowIndex + 1]?.addressIndex;
      // // if (row.typeCode === linkSourceCode) {
      // if (linkSourceCode >= 0) {
      //   if (columnIndex == 1) {
      //     if (rowIndex === linkSourceCode) {
      //       return {
      //         rowspan: 2,
      //         colspan: 1,
      //       };
      //     } else {
      //       return {
      //         rowspan: 0,
      //         colspan: 0,
      //       };
      //     }
      //   }
      // }
      // // }
      if (columnIndex === 1) {
        //每次走到第2列时给单元格加上rowspan和colspan属性
        const _row = this.spanArr1[rowIndex];
        const _col = _row > 0 ? 1 : 0; //1为不合并 0为合并至最后一列
        return {
          //返回需要合并的对象
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    //处理数据
    GetSpanArr() {
      //由于数据是动态的，所以页面加载时需要调用下面的方法，根据后台数据处理以知道要合并的行/列
      //得到的spanArr数组表示某一行所需要合并的列数
      var data = this.setProductTableInfo.productTableInfo;
      if (data.length <= 0) {
        return;
      }
      data.forEach((element, index) => {
        //遍历数据 得到每项 和下标
        if (index === 0) {
          //如果是一条数据 直接不合并
          this.spanArr1.push(1); //记录合并数
          this.position = 0; //记录spanArr1的索引值
        } else {
          console.log(data[index - 1], 'data[index - 1]');
          if (element.name === data[index - 1].name) {
            //非第一条数据 则判断是否与上一条相邻的数据值相等
            this.spanArr1[this.position1] += 1; //相等则说明需要合并 rousoan:2 = 合并一行
            this.spanArr1.push(0); //记录索引
            console.log(this.spanArr1, 'this.spanArr1');
          } else {
            this.spanArr1.push(1); //与上一单元格数据不相等 则不合并 rowspan:1 = 不合并
            this.position1 = index; //记录索引
          }
        }
      });
    },
    showEditDialoga(val) {
      console.log(val, 'val');
    },
    /**
     * @description 关联资源表格数据请求
     */
    linkResource(index, row) {
      console.log(index, row);
      this.addressIndex = index;
      getAddressResource().then(() => {
        // this.
      });
      const res = [
        {
          index: '1',
          typeCode: 1,
          code: 'SJ23237767',
          type: '2',
          id: '129871233',
          name: '创建订单',
          taskItem: [
            {
              id: 1,
              content: '任务项一',
            },
            {
              id: 2,
              content: '任务项二',
            },
            {
              id: 23,
              content: '任务项三',
            },
          ],
          city: '嘻嘻嘻',
          price: 10,
          discount: 10,
          number: 1,
          memberPrice: 100,
          subTotalPrice: 802.0,
          product: 'CP10000003',
          mainBody: '四川ABCD公司',
        },
        {
          index: '2',
          typeCode: 2,
          code: 'SJ23237767',
          type: '2',
          id: '129871233',
          name: '创建订单',
          taskItem: [
            {
              id: 1,
              content: '任务项一',
            },
            {
              id: 2,
              content: '任务项二',
            },
          ],
          city: '嘻嘻嘻',
          price: 10,
          discount: 10,
          number: 1,
          memberPrice: 100,
          subTotalPrice: 802.0,
          product: 'CP10000003',
          mainBody: '四川ABCD公司',
        },
      ];
      this.addressTableData = res;
      this.linkResourceDialog = true;
    },
    /**
     * @description 关联数据 删除一行
     * @param {param id}
     */
    async delAddressClick(index, rows, id) {
      console.log(index, rows, id);
      //询问用户是否删除数据
      const confirmResult = await this.$messageBox
        .confirm('此操作将删除该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((err) => err);
      if (confirmResult != 'confirm') {
        return this.$message.info('已经取消删除');
      }
      rows.splice(index, 1);
      this.$message.success('删除成功');
    },
    /**
     * @description 点击选择关联资源每行数据
     */
    addressClick(row) {
      console.log(row);
      this.linkResourceDialog = false;
      row.addressIndex = this.addressIndex;
      row.linkSourceCode = this.setProductTableInfo.productTableInfo[this.addressIndex].typeCode;
      this.setProductTableInfo.productTableInfo.splice(this.addressIndex + 1, 0, row);
    },
    /**
     * @description 确定关联资源
     */
    confirmLinkResource() {
      this.linkResourceDialog = false;
    },
    /**
     * @description 服务产品 改变当前页
     */
    serveCurrentChange(val) {
      this.serveForm.currentPage = val;
    },
    /**
     * @description 服务产品 改变当前页显示数量
     */
    serveSizeChange(val) {
      this.serveForm.pagesize = val;
    },
    /**
     * @description 验证字符串是否是数字
     * @param {any}
     * @returns {Boolean}
     */
    checkNumber(data) {
      var reg = /^[0-9]+.?[0-9]*$/;
      if (!reg.test(data)) return false;
    },
    /**
     * @description 点击编辑任务项
     * @param {id} 每一项数据id
     */
    editTaskItem(id) {
      console.log(id);
      this.$refs.taskItemRef.openTaskItemDialog();
    },
    /**
     * @description  获取已选中的产品数组
     */
    continueList(val) {
      this.setProductTableInfo.productTableInfo = this.setProductTableInfo.productTableInfo.concat(
        val,
      );
    },
    /**
     * @description  获取已选中的产品数组
     */
    confirmList(val) {
      this.setProductTableInfo.productTableInfo = this.setProductTableInfo.productTableInfo.concat(
        val,
      );
    },
    /**
     * @description 数据多选
     */
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectIds = val.map((item) => {
        //将选中数据的id组合至一个数组
        return item.id;
      });
      console.log(this.selectIds);
    },
    //批量删除
    async delAll() {
      // var ids= this.sels.map(item => item.id).join()//获取所有选中行的id组成的字符串，以逗号分隔
      // const length = this.multipleSelection.length;
      // for (let i = 0; i < length; i++) {
      //   this.delarr.push(this.multipleSelection[i].id);
      // }
      let tableData = this.setProductTableInfo.productTableInfo;
      for (let i = 0; i < tableData.length; i++) {
        const element = tableData[i];
        element.id = i;
      }
      if (this.multipleSelection.length == 0) {
        this.$message.warning('请先至少选择一项');
        return false;
      }
      const confirmResult = await this.$messageBox
        .confirm('此操作将删除该产品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        .catch((err) => err);
      if (confirmResult != 'confirm') {
        return this.$message.info('已经取消删除');
      }
      this.multipleSelection.forEach((element) => {
        tableData.forEach((e, i) => {
          if (element.id == e.id) {
            tableData.splice(i, 1);
          }
        });
      });
      this.$message.success('删除成功');
    },
    // 表头样式设置
    headClass() {
      return 'background:#f2f2f2;';
    },
    // 表格样式设置
    rowClass() {
      return '';
    },

    //地址资源
    searchAddress() {
      if (this.linkTabsActiveName == 1) {
        console.log(this.linkAddressForm, 'this.linkAddressForm');
      } else {
        console.log(this.numForm, 'this.numForm');
      }
    },
  },
};
