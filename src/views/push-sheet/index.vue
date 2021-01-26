<template>
  <div>
    <el-steps :active="active" align-center>
      <el-step title="填写订单信息">
        <i v-if="active >= 0" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
      </el-step>
      <el-step title="确认订单、申请合同">
        <i v-if="active >= 1" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
      <el-step title="推送成功">
        <i v-if="active >= 2" slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="16px"
            ava-class="inprogress"
            icon="icon-inprogress"
          />
        </i>
        <i v-else slot="icon">
          <svg-icon
            key="iconfont-qds-crm-inprogress"
            size="10px"
            ava-class="notinprogress"
            icon="icon-notinprogress"
          />
        </i>
      </el-step>
    </el-steps>
    <div class="emptyBg"></div>
    <div class="pushSheet">
      <!-- 顶部steps -->

      <!-- 订单信息  填写订单-->
      <div v-show="active == 0" class="inputInfo">
        <!-- 关联商机 -->
        <link-business ref="businessRef" @change-status="changeStatusLinkBus"></link-business>
        <!-- 选择产品 -->
        <product-info></product-info>
        <!-- 付款信息 -->
        <pay-info ref="payinfoRef"></pay-info>
        <!-- 订单有效期 -->
        <order-validity ref="validateRef" @change-status="changeStatusValidity"></order-validity>
      </div>
      <!-- 订单信息  确认订单-->
      <div v-show="active == 1" class="confirmInfo">
        <!-- 服务订单 -->
        <order-info
          ref="signRef"
          :product-info="this.$store.state.pushSheet.productData"
        ></order-info>
      </div>

      <!-- 底部按钮 -->
      <div class="btn">
        <div v-if="active == 0">
          <el-button size="small" style="width: 49px">取消</el-button>
          <el-button size="small" style="width: 121px" type="primary" @click="nextStep"
            >下一步,确认订单</el-button
          >
        </div>
        <div v-if="active == 1">
          <el-button size="small" style="width: 62px" @click="lastStep">上一步</el-button>
          <el-button size="small" style="width: 74px" type="primary" @click="pushStep"
            >推送订单</el-button
          >
        </div>
      </div>
      <!-- 订单推送成功提示 -->
      <el-dialog
        title="订单推送"
        :close-on-click-modal="false"
        :visible.sync="showPopover"
        width="550px"
        @closed="handleClose"
      >
        <p class="popover-title">
          <i class="el-icon-warning iconStyle" type="warning"></i>
          <span> 订单推送成功提示 </span>
        </p>
        <p class="popover-content">订单已推送给客户，客户可登陆平台进行查看并支付！</p>
        <p class="remain-time">{{ remainTime }}后自动关闭</p>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import LinkBusiness from './components/link-business/index.vue';
import ProductInfo from './components/product-info/index.vue';
import PayInfo from './components/pay-info';
import OrderValidity from './components/order-validity';
import SvgIcon from 'components/svg-icon';
import OrderInfo from './components/order-info';
import './index.scss';
export default {
  components: {
    LinkBusiness,
    ProductInfo,
    PayInfo,
    OrderValidity,
    OrderInfo,
    SvgIcon,
  },
  inject: ['reload'],
  data() {
    return {
      activeIcon: '',
      active: 0, //步骤激活
      businessCode: 0, //验证商机是否选择完毕 是否可以下一步
      productCode: 0, //验证产品是否选择完毕 是否可以下一步
      /*控制显示属性*/
      showPopover: false, //控制显示推单提示
      /*计时器*/
      remainTime: 30, //弹框关闭剩余时间
      timer: null, //计时器
      btnState: false, //防止按钮连续点击
    };
  },
  created() {
    this.$eventBus.$on('change-status-product', (code) => {
      //接收确认产品是否选择 code
      if (!code) return;
      this.productCode = code;
    });
  },
  beforeDestroy() {
    this.$eventBus.$off('change-status-product');
  },
  methods: {
    /**
     * @description 选机对话框确定按钮
     */
    chooseBusiness() {
      console.log(this.businessForm, 'this.businessForm');
      this.showLinkBusinessDialog = false;
    },
    /**
     * @description 定义一个公用的条件执行
     */
    checkFun(code) {
      const map = {
        noBiz: '请选择商机',
        noPro: '请选择产品',
      };
      this.$message.warning(map[code]);
    },
    /**
     * @description 点击按钮下一步 第一步
     */
    nextStep() {
      if (this.btnState) {
        this.btnState = false;
      }
      this.btnState = true;
      //this.$store.state.PushSheet.businessCode === 2为全部校验通过
      console.log(this.$store.state, 'this.$store.state');
      const businessCode = this.$store.state.pushSheet.businessCode;
      console.log(businessCode, 'businessCode111');
      if (!businessCode[0]) {
        //没有选择商机，默认值为0
        this.checkFun('noBiz');
        return;
      } else if (!this.$refs['businessRef'].validateForm()) {
        //校验下单区域
        return;
      } else if (!businessCode[1]) {
        //已选择商机，未选择产品
        this.checkFun('noPro');
        return;
      } else if (!businessCode[2]) {
        //校验分期
        if (!this.$refs['payinfoRef'].validateForm()) {
          return;
        }
      } else if (!this.$refs['validateRef'].checkForm()) {
        //订单有效期为自定义时，校验天数输入框
        return;
      }
      console.log(businessCode, 'businessCode');
      console.log(this.$store.state.pushSheet.businessData, 'this.$store.businessData');
      console.log(this.$store.state.pushSheet.productData, 'this.$store.productData');
      console.log(this.$refs['payinfoRef'].setInstalmentsData.instalmentsData, 'instalmentsData');
      console.log(this.$refs['payinfoRef'].query, 'query');
      console.log(this.$refs['validateRef'].ruleForm, 'validateRef');
      this.active = 1; //跳转到第二步
      this.btnState = false;
    },
    /**
     * @description 当订单处于确认订单时，显示上一步按钮  第二部
     */
    lastStep() {
      this.active = 0;
    },
    /**
     * @description 当处于第三步时，显示推送按钮
     */
    pushStep() {
      if (this.$refs['signRef'].validateForm()) {
        this.showPopover = true;
        this.timer = setInterval(() => {
          if (this.remainTime === 1) {
            clearInterval(this.timer);
            this.showPopover = false;
          }
          this.remainTime--;
        }, 1000);
      }
    },
    /**
     * @description 监听倒计时对话框的关闭事件
     */
    handleClose(done) {
      clearInterval(this.timer);
      this.remainTime = 10;
      this.reload();
    },
    /**
     * @description 监听关联商机抛出状态
     */
    changeStatusLinkBus(code) {
      if (!code) return;
      this.businessCode = code;
    },
    /**
     * @description 监听有效期抛出状态
     */
    changeStatusValidity(code) {
      if (!code) return;
      this.businessCode = code;
    },
  },
};
</script>
