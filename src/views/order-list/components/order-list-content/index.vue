<template>
  <div class="order-list-content-page">
    <div
      v-for="(listContent, listContentIndex) in orderList"
      :key="listContentIndex + 'listContent'"
      class="order-list-main"
    >
      <!-- 订单列表标题 -->
      <div class="order-list-content-title">
        <div v-for="(listName, listNameIndex) in orderListName" :key="listNameIndex + 'listName'">
          <span v-if="listName.name1" style="color: #555555"> {{ listName.name1 }} </span>
          <template v-if="listName.code1 === 'payStatus'">
            <el-tag
              :type="
                listContent.payStatus == '未付款'
                  ? 'danger'
                  : listContent.payStatus == '已付款'
                  ? 'info'
                  : listContent.payStatus == '部分付款'
                  ? 'warning'
                  : ''
              "
              :hit="tagBorder"
              >{{ listContent[listName.code1] }}</el-tag
            >
          </template>
          <template v-else>
            <span>
              <show-tooltip
                v-if="['userName', 'homeName'].includes(listName.code1)"
                :text="listContent[listName.code1]"
                :width="70"
              ></show-tooltip>
              <span v-else>{{ listContent[listName.code1] }}</span>
            </span>
            <span v-if="['userName', 'homeName'].includes(listName.code1)">/</span>
            <span>{{
              ['userName', 'homeName'].includes(listName.code1)
                ? listContent[listName.code1 === 'userName' ? 'userPhone' : 'homeNumber']
                : ''
            }}</span>
          </template>
        </div>
      </div>
      <!-- 订单列表表格 -->
      <div
        v-for="(listContentTable, listContentTableIndex) in listContent.tables"
        :key="listContentTableIndex + 'listContentTable'"
        class="order-list-content-table"
      >
        <!-- 订单信息 -->
        <div>
          <span>订单信息：</span>
          <el-tag
            :type="
              listContentTable.orderInformation == '未付款'
                ? 'danger'
                : listContentTable.orderInformation == '已付款'
                ? 'info'
                : listContentTable.orderInformation == '部分付款'
                ? 'warning'
                : ''
            "
            :hit="tagBorder"
            >{{ listContentTable.orderInformation }}</el-tag
          >
          <el-tag class="order-type" type="info" effect="dark">
            {{ listContentTable.orderType }}
          </el-tag>
          <span class="order-number">{{ listContentTable.orderNumber }}</span>
          <span class="contract-number">{{ listContentTable.contractNumber }}</span>
          <span>合同主体：</span>
          <show-tooltip
            :text="listContentTable.contractMain"
            :width="160"
            class="contract-main"
          ></show-tooltip>
          <span class="apply-contract">申请合同</span>
          <span class="order-details">订单详情</span>
          <span
            v-if="listContentTable.tableList.length > 3"
            class="order-list-more"
            @click="handleOrderListMore(listContentTable)"
          >
            <span>{{ listContentTable.isOrderListMore ? '收起' : '更多' }}</span>
            <i
              :class="[
                'el-icon-d-arrow-right',
                'arrow_right',
                listContentTable.isOrderListMore ? 'icon-up' : 'icon-down',
              ]"
            ></i>
          </span>
          <span v-else></span>
        </div>
        <!-- 订单列表内容 -->
        <div>
          <div
            v-for="(listContentTableList, listContentTableListIndex) in listContentTable.tableList"
            v-show="listContentTable.isOrderListMore || listContentTable.tableList.length <= 3"
            :key="listContentTableListIndex + 'listContentTableList'"
            class="order-list-content-table-list"
          >
            <div class="product-name">
              <div>
                <show-tooltip :text="listContentTableList.productName" :width="160"></show-tooltip>
              </div>
              <div>
                <show-tooltip
                  :text="listContentTableList.productAttribute"
                  :width="160"
                ></show-tooltip>
              </div>
            </div>
            <div class="product-count">
              <span>×</span>
              <span>{{ listContentTableList.productCount }}</span>
              <span>【{{ listContentTableList.productArea }}】</span>
            </div>
            <div class="product-price">
              <div>
                <span>定价：</span>
                <span>¥{{ listContentTableList.productPrice }}</span>
              </div>
              <div>
                <span>优惠：</span>
                <span>¥{{ listContentTableList.discount }}</span>
              </div>
            </div>
            <div class="cope-with">
              <span>应付：</span>
              <span>¥{{ listContentTableList.copeWith }}</span>
            </div>
            <div>
              <span>实付：</span>
              <span>{{
                listContentTableList.actuallyPaid ? '¥' + listContentTableList.actuallyPaid : '-'
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="order-list-footer">
      <el-pagination
        :current-page="start"
        :page-sizes="[20, 50, 100, 200]"
        background
        layout="total, prev, pager, next,sizes,  jumper"
        :total="tableDataPage"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import './index.scss';
import { order_list } from 'api/order-details';
import { ORDER_LIST_MAIN } from 'constants/constants';
import ShowTooltip from 'components/show-tooltip';
export default {
  components: {
    ShowTooltip,
  },
  data() {
    return {
      tagBorder: true, //是否有边框描边
      orderList: [],
      orderListName: [],
      orderListData: [],
      tableDataPage: 0, //总页数
      limit: 10, //每页显示多少条
      start: 1, //页数
    };
  },
  mounted() {
    this.getOrderList();
    this.getOrderListName();
  },
  methods: {
    /**
     * @description 分页
     * @param {Number}
     */
    handleSizeChange(val) {
      //每页多少条
      console.log('每页多少条', val);
      this.limit = val;
    },
    handleCurrentChange(val) {
      //第几页
      console.log('第几页', val);
      this.start = val;
    },
    /**
     * @description 点击显示更多列表数据
     * @param {listContentTable} object
     *
     */
    handleOrderListMore(obj) {
      this.$set(obj, 'isOrderListMore', !obj.isOrderListMore);
    },
    /**
     * @description 获取订单列表数据
     */
    getOrderList() {
      order_list().then((res) => {
        if (res.code === 200) {
          this.orderList = res.data;
        }
      });
    },
    getOrderListName() {
      this.orderListName = Object.freeze(ORDER_LIST_MAIN);
    },
  },
};
</script>
