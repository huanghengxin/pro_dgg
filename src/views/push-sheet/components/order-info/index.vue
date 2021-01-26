<template>
  <div class="order-info">
    <div class="order-info-title">
      <p class="order-info-title-titleWord">订单信息</p>
    </div>
    <div v-for="(item, index) in orderDataList" :key="index" class="order-info-item">
      <div class="order-info-item-header">
        <p class="order-info-item-header-text">订单信息{{ index + 1 }}：</p>
        <div class="order-info-item-header-introduce">
          <div class="order-info-item-header-introduce-main">
            服务主体：<span class="order-info-item-header-introduce-main_redcolor">{{
              item.mainBody
            }}</span>
          </div>
          <div class="order-info-item-header-introduce-orderType">
            订单类型：<span class="order-info-item-header-introduce-main_redcolor">{{
              item.orderType == 1 ? '服务订单' : item.orderType == 2 ? '资源订单' : '交易订单'
            }}</span>
          </div>
        </div>
        <div class="order-info-item-header-apply">
          <!-- `checked` 为 true 或 false -->
          <el-checkbox v-model="item.isApply" data-tid="checkChange" @change="checkChange"
            >是否申请合同</el-checkbox
          >
          <p v-if="item.isApply" class="order-info-item-header-apply-copy">
            [资源产品共用模板] <i class="iconfont-qds-crm icon-view1 eye"></i>
          </p>
        </div>
        <div class="table">
          <el-table :data="item.orderTableData" style="width: 100%; margin-top: 12px">
            <el-table-column type="index" width="68" label="序号"> </el-table-column>
            <el-table-column prop="id" label="产品ID" width="120">
              <template slot-scope="scope">
                <p>
                  <show-tooltip :text="scope.row.id" :width="80" />
                </p> </template
            ></el-table-column>
            <el-table-column prop="name" label="产品名称" width="200">
              <template slot-scope="scope">
                <p>
                  <show-tooltip :text="scope.row.productName.name1" :width="160" />
                </p>
                <p>
                  <show-tooltip :text="scope.row.productName.name2" :width="160" />
                </p>
              </template>
            </el-table-column>
            <el-table-column prop="taskItem" label="任务项" width="180">
              <template slot-scope="scope">
                <div class="task">
                  <div
                    v-for="(itemson, i) in scope.row.taskItem"
                    :key="i"
                    class="task-item-content"
                  >
                    <div class="task-item-content_left">
                      <span>
                        {{ i + 1 + '.' }}
                      </span>
                      <show-tooltip
                        :text="itemson.name"
                        :width="100"
                        style="color: #222"
                      ></show-tooltip>
                    </div>
                    <span v-if="itemson.price" class="task-item-content-price"
                      >￥{{ itemson.price }}</span
                    >
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="city" label="产品城市" width="120"></el-table-column>
            <el-table-column prop="price" label="产品单价" width="120"></el-table-column>
            <el-table-column prop="discount" label="产品折扣" width="96"></el-table-column>
            <el-table-column prop="number" label="数量" width="68"></el-table-column>
            <el-table-column prop="subTotalPrice" label="小计金额" width="120"></el-table-column>
            <el-table-column prop="product" label="关联产品" width="120">
              <template slot-scope="scope">
                <p>
                  <show-tooltip :text="scope.row.product" :width="80" />
                </p>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="order-info-total">
      <p class="order-info-total-titleWord">总计</p>
      <div class="order-info-total-content">
        <p class="order-info-total-content-text">
          产品总金额：<span class="order-info-total-content-text_redcolor">￥{{ total }}</span>
        </p>
        <p class="order-info-total-content-text">
          产品总数：<span class="order-info-total-content-text_redcolor">{{ productNum }}</span>
        </p>
        <p class="order-info-total-content-text">
          优惠合计：<span class="order-info-total-content-text_redcolor">￥{{ memberPrice }}</span>
        </p>
        <p class="order-info-total-content-text">
          应付/实付金额：<span class="order-info-total-content-text_redcolor"
            >￥{{ total - memberPrice }}</span
          >
        </p>
      </div>
    </div>
    <p class="orderValidPeriod">订单有效期: <span class="hour">48小时</span></p>
    <div v-if="applyContract" class="order-info-sign">
      <p class="order-info-sign-titleWord">签署信息</p>
      <div class="order-info-sign-content">
        <el-form
          ref="signFormRef"
          :model="signForm"
          :rules="signRules"
          label-width="110px"
          class="demo-ruleForm"
          status-icon
          size="small"
          label-position="left"
        >
          <el-form-item label="客户名称：" prop="name">
            <el-input v-model="signForm.name" data-tid="nameInput" maxlength="50"></el-input>
          </el-form-item>
          <el-form-item label="E-MAIL：" prop="email" maxlength="50">
            <el-input v-model="signForm.email" data-tid="emailInput"></el-input>
          </el-form-item>
          <el-form-item label="联系电话：" prop="phone">
            <el-input v-model="signForm.phone" data-tid="phoneInput" disabled></el-input>
          </el-form-item>
          <el-form-item label="联系人：" prop="person" maxlength="50">
            <el-input v-model="signForm.person" data-tid="personInput"></el-input>
          </el-form-item>
          <el-form-item label="客户地址：" maxlength="50">
            <el-input v-model="signForm.address" data-tid="addressInput"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import './index.scss';
import ShowTooltip from 'components/show-tooltip';
export default {
  components: {
    ShowTooltip,
  },
  props: {
    productInfo: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    let emailReg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/;
    var checkEmail = (rule, value, callback) => {
      if (!emailReg.test(value)) {
        callback(new Error('填写正确的邮箱'));
      } else {
        callback();
      }
    };
    return {
      applyContract: false, //申请合同
      orderDataList: [
        {
          mainBody: '四川ABCDSD公司', //服务主体
          orderType: '1',
          isApply: false,
          orderTableData: [
            //订单表格数据
            {
              id: '12987122',
              productName: {
                name1: '有限公司注册',
                name2: '属性值1属性值2属性值',
              },
              taskItem: [
                {
                  name: '普通核名',
                },
                {
                  name: '普通核名',
                  price: '199',
                },
              ],
              city: '3.2',
              price: 10,
              discount: 10,
              number: 1,
              memeberPrice: 20,
              subTotalPrice: 800.0,
              product: 'CP10000003',
            },
            {
              id: '12987123',
              productName: {
                name1: '有限公司注册',
                name2: '属性值1属性值2属性值',
              },
              taskItem: [
                {
                  name: '普通核名',
                  price: '199',
                },
              ],
              city: '3.2',
              price: 10,
              discount: 10,
              number: 1,
              memeberPrice: 20,
              subTotalPrice: 802.0,
              product: 'CP10000003',
            },
          ],
        },
        {
          mainBody: '四川ABCDSD公司', //服务主体
          isApply: true,
          orderType: '2',
          orderTableData: [
            //订单表格数据
            {
              id: '129871223',
              productName: {
                name1: '有限公司注册',
                name2: '属性值1属性值2属性值',
              },
              taskItem: [
                {
                  name: '普通核名',
                },
              ],
              city: '3.2',
              price: 10,
              discount: 10,
              number: 1,
              memeberPrice: 20,
              subTotalPrice: 800.0,
              product: 'CP10000003',
            },
            {
              id: '129871233',
              productName: {
                name1: '有限公司注册',
                name2: '属性值1属性值2属性值',
              },
              taskItem: [
                {
                  name: '普通核名',
                },
              ],
              city: '3.2',
              price: 10,
              discount: 10,
              number: 1,
              memeberPrice: 20,
              subTotalPrice: 802.0,
              product: 'CP10000003',
            },
          ],
        },
      ],

      signForm: {
        name: '',
        email: '',
        phone: '15181034322',
        person: '',
        address: '',
      },
      signRules: {
        name: [{ required: true, message: '请填写客户名称', trigger: 'blur' }],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        phone: [{ required: true, message: '请填写联系电话', trigger: 'blur' }],
        person: [{ required: true, message: '请填写联系人', trigger: 'blur' }],
      },
    };
  },
  computed: {
    //产品合计
    total() {
      let res = 0;
      let arr = this.orderDataList;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].orderTableData.length; j++) {
          res += Number(arr[i].orderTableData[j].subTotalPrice);
        }
      }
      return res.toFixed(2);
    },
    //产品数量
    productNum() {
      let res = 0;
      let arr = this.orderDataList;
      for (let i = 0; i < arr.length; i++) {
        res += Number(arr.length);
      }
      return res;
    },
    //优惠合计
    memberPrice() {
      let res = 0;
      let arr = this.orderDataList;
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].orderTableData.length; j++) {
          res += Number(arr[i].orderTableData[j].memeberPrice);
        }
      }
      return res.toFixed(2);
    },
    //小计
    // subTotalPrice() {
    //   let res = 0;
    //   let arr = this.orderDataList;
    //   for (let i = 0; i < arr.length; i++) {
    //     for (let j = 0; j <= arr[i].taskItem.length; j++) {
    //       if (arr[i].taskItem[j] && arr[i].taskItem[j].price) {
    //         res +=
    //           Number(arr[i].price) *
    //           Number(arr[i].discount) *
    //           Number(arr[i].number) *
    //           Number(arr[i].taskItem[j].price);
    //       }
    //     }
    //   }
    //   return res.toFixed(2);
    // },
    //实付
    actualPayment() {
      let res = 0;
      res = this.total - this.memberPrice;
      return res.toFixed(2);
    },
  },
  created() {},
  methods: {
    // 校验数据
    validateForm() {
      let flag = false;
      let ref = this.$refs.signFormRef;
      console.log(ref, 'ref');
      // if (!ref) return;
      if (this.applyContract) {
        ref.validate((valid) => {
          console.log(valid, 'valid');
          if (valid) {
            flag = true;
          } else {
            flag = false;
          }
        });
        console.log(flag, 'signflag');
        return flag;
      } else {
        return true;
      }
    },
    checkChange(val) {
      console.log(val, 'val');
      this.applyContract = val;
    },
  },
};
</script>
