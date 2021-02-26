<template>
  <div class="money-information-page">
    <div class="finance-title">发票申请记录</div>
    <div class="finance-list">
      <el-table :data="invoiceTable">
        <el-table-column prop="way" label="开票类型/方式" min-width="160"> </el-table-column>
        <el-table-column prop="money" label="发申请票/已开金额" min-width="300">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.money.split(',')"
              :key="index + 'money'"
              class="finance-list-ticket"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="message" label="开票信息" min-width="300">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.message.split(',')"
              :key="index + 'message'"
              class="finance-list-ticket"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="time" label="开票时间" min-width="300">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.time.split(',')"
              :key="index + 'time'"
              class="finance-list-ticket"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="state" label="状态" min-width="100"> </el-table-column>
      </el-table>
    </div>
    <div class="finance-title finance-title-mp">合同申请记录</div>
    <div class="finance-list">
      <el-table :data="contractTable">
        <el-table-column prop="contract" label="合同信息" min-width="280">
          <template slot-scope="scope">
            <div class="finance-list-ticket">
              <p>
                <span>合同编号：</span>
                <span class="finance-list-ticket-span">{{ scope.row.contract.split(',')[0] }}</span>
              </p>
              <p class="finance-list-ticket-p">
                <span>合同名称：</span>
                <span>{{ scope.row.contract.split(',')[1] }}</span>
              </p>
              <p>
                <span>合同金额：</span>
                <span>{{ scope.row.contract.split(',')[2] }}</span>
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="owner" label="甲方信息" min-width="260">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.owner.split(',')"
              :key="index + 'owner'"
              class="finance-list-ticket"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="commercialTenant" label="商户" min-width="260"> </el-table-column>
        <el-table-column prop="contractTime" label="合同时间" min-width="260">
          <template slot-scope="scope">
            <div
              v-for="(item, index) in scope.row.contractTime.split(',')"
              :key="index + 'contractTime'"
              class="finance-list-ticket"
            >
              <p>{{ item }}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="contractType" label="合同类型" min-width="80"> </el-table-column>
        <el-table-column prop="contractState" label="合同状态" min-width="80"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { order_details_invoice_table, order_details_contract_table } from 'api/order-details';
export default {
  data() {
    return {
      // 发票申请记录表格
      invoiceTable: [],
      // 合同申请记录表格
      contractTable: [],
    };
  },
  mounted() {
    this.getInvoiceTable(); //发票申请记录
    this.getContractTable(); //合同申请记录表格
  },
  methods: {
    /**
     * @description 发票申请记录
     */
    getInvoiceTable() {
      order_details_invoice_table().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.invoiceTable = res;
        }
      });
    },
    /**
     * @description 合同申请记录
     */
    getContractTable() {
      order_details_contract_table().then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.contractTable = res;
        }
      });
    },
  },
};
</script>
