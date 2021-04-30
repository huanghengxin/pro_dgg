<template>
  <div v-loading="loading" class="torch-plan">
    <!-- 说明 -->
    <div class="explain">
      <div class="explain__title">
        <div class="explain__title-txt1">薪火计划师徒规则</div>
        <el-button type="primary" data-tid="savePlatformRule" @click="saveRuleChange"
          >保存</el-button
        >
      </div>
      <div class="explain__text">
        <div class="explain__text-1">
          1、每个【】对应一个输入框，数值的请直接输入数字；各规则需都满足时才能达成徒弟、师傅的条件
        </div>

        <div class="explain__text-1">
          2、要成为薪火计划管理员（具有指派师傅，解除/更换师傅等权限）的用户，需要将其配置到“企大顺规划师经理”角色中
          <span class="to-allocation" @click="toAllocation">去配置></span>
        </div>
      </div>
    </div>
    <div class="staff-box">
      <div class="staff">
        <div class="staff__title">成为徒弟规则</div>
        <el-form ref="getStaffListRef" :model="getStaffList" :rules="rules">
          <el-table :data="getStaffList.apprenticeList" class="staff__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column prop="name" label="规则名称" min-width="237">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="197"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="规则内容" min-width="577">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.description"
                  :text="scope.row.description"
                  :width="557"
                  :tooltip-line-clamp="1"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="value" label="值" min-width="120">
              <template slot-scope="scope">
                <el-form-item
                  :prop="'apprenticeList.' + scope.$index + '.value'"
                  :rules="rules.value"
                >
                  <el-input
                    v-model="scope.row.value"
                    type="text"
                    class="val"
                    :data-tid="'valueInput' + scope.$index"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
      <div class="staff">
        <div class="staff__title">成为师傅规则</div>
        <el-form ref="getMasterListRef" :model="getStaffList" :rules="rules">
          <el-table :data="getStaffList.masterList" class="staff__table">
            <template slot="empty">
              <svg-icon key="item-warp" type="nodata" icon="icon-icon_nodata" />
            </template>
            <el-table-column prop="name" label="规则名称" min-width="237">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.name"
                  :text="scope.row.name"
                  :width="197"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column prop="description" label="规则内容" min-width="577">
              <template slot-scope="scope">
                <show-tooltip
                  v-if="scope.row.description"
                  :text="scope.row.description"
                  :width="557"
                  :tooltip-line-clamp="1"
                ></show-tooltip>
              </template>
            </el-table-column>
            <el-table-column class-name="list-input" prop="value" label="值" min-width="120">
              <template slot-scope="scope">
                <el-form-item :prop="'masterList.' + scope.$index + '.value'" :rules="rules.value">
                  <el-input
                    v-model="scope.row.value"
                    type="text"
                    class="val"
                    :data-tid="'valueInput' + scope.$index"
                  ></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import SvgIcon from 'components/svg-icon';
import ShowTooltip from 'components/show-tooltip';
import { get_config_by_detail, add_update_config } from 'api/torch-plan';
import stores from 'storejs';
// import config from 'config/index.js';
import './index.scss';
export default {
  components: {
    SvgIcon,
    ShowTooltip,
  },
  data() {
    const validateVal1 = (rule, value, callback) => {
      console.log(value, 'value');
      console.log(rule, 'rule');
      const field = rule.field;
      const indexArr = field.split('.');
      const d = indexArr[0];
      const i = indexArr[1];
      console.log(i, 'i');
      console.log(d, 'd');
      const item = this.getStaffList.apprenticeList[i];
      const item2 = this.getStaffList.masterList[i];
      //获取师傅入职天数下限
      const item3 = this.getStaffList.masterList.find((_) => {
        return _.code === 'SALARY_FIRE_MASTER_CONFIG_ONE';
      });
      //徒弟入职天数上限
      const item4 = this.getStaffList.apprenticeList.find((_) => {
        return _.code === 'SALARY_FIRE_APPRENTICE_CONFIG_ONE';
      });
      // var reg = /^[1-9][0-9]{0,6}$/;
      // var reg1 = /^[0-9][0-9]{0,3}$/;//数值≤9999正整数
      var regex = /^([1-9]|[1-9][0-9]|[1-2][0-9][0-9]|[3][0-5][0-9]|(360|361|363|362|364|365))$/;
      // var regOneToFive = /^\d{1,5}$/; //1到5位
      var regOneToFive = /^[1-5]$/; //1到5
      if (d === 'apprenticeList') {
        if (item.code === 'SALARY_FIRE_APPRENTICE_CONFIG_ONE') {
          if (value == '') {
            callback(new Error('值不能为空'));
          } else if (!regex.test(value)) {
            callback(new Error('请输入1到365整数'));
          } else if (value >= item3?.value) {
            callback(new Error('徒弟入职天数上限需小于师傅入职天数上限'));
          }
          callback();
        }
        callback();
        // //业绩规则
        // else {
        //   if (value <= 0 !|| !reg.test(!value)) {
        //     callback(new Error('数值≤9999999正整数'));
        //   }

        // }
      } else {
        //师傅
        if (item2.code === 'SALARY_FIRE_MASTER_CONFIG_ONE') {
          if (value == '') {
            callback(new Error('值不能为空'));
          } else if (!regex.test(value)) {
            callback(new Error('请输入1到365整数'));
          } else if (value <= item4?.value) {
            callback(new Error('师傅入职天数上限需大于徒弟入职天数上限'));
          }
          callback();
          //带教徒弟
        } else if (item2.code == 'SALARY_FIRE_MASTER_CONFIG_THREE') {
          if (value == '') {
            callback(new Error('值不能为空'));
          } else if (!regOneToFive.test(value)) {
            callback(new Error('请输入1到5整数'));
          }
          callback();
        }
        callback();
      }
    };
    return {
      getStaffList: {
        apprenticeList: [],
        masterList: [],
      },
      mchDetailId: stores.get('mchInfo')?.mchDetailId,
      loading: false,
      rules: {
        value: [{ validator: validateVal1, trigger: 'blur' }],
      },
    };
  },
  created() {
    this.getRuleList();
  },
  methods: {
    //去配置
    toAllocation() {
      const appCodeMap = {
        production: 'crisps-qds-pc-node',
        test: 'crisps-qdb-pc-node',
      };
      this.$mainService?.openAppPage(
        // eslint-disable-next-line no-undef
        appCodeMap[SP_SERVER_ENV],
        `/business-management/role-management`,
      );
    },
    //获取列表信息
    getRuleList() {
      const params = {
        mchDetailId: this.mchDetailId,
        // mchDetailId: '607997736314103037',
      };
      get_config_by_detail(params).then((res) => {
        const { code, data, message } = res;
        if (code == 200) {
          this.getStaffList.apprenticeList = data.apprenticeList;
          this.getStaffList.masterList = data.masterList;
        } else {
          this.$message.warning(message);
        }
      });
    },
    /**
     * @description 保存规则校验
     */
    saveRuleChange() {
      let check1 = null;
      let check2 = null;
      this.$refs.getStaffListRef.validate((valid) => {
        check1 = valid;
      });
      this.$refs.getMasterListRef.validate((valid) => {
        check2 = valid;
      });
      console.log(check1, check2, 11666);
      if (check1 && check2) {
        this.$messageBox
          .confirm('请确定保存规则, 是否继续?', '保存提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'message-box-min-height',
          })
          .then(() => {
            this.saveData();
          });
      } else {
        return;
      }
    },
    /**
     * @description 保存数据
     */
    saveData() {
      const params = {
        mchDetailId: this.mchDetailId,
        // mchDetailId: '607997736314103037',
      };
      [...this.getStaffList.apprenticeList, ...this.getStaffList.masterList].map((item) => {
        console.log(item, 'item');
        //徒弟入职天数上限
        if (item.code == 'SALARY_FIRE_APPRENTICE_CONFIG_ONE') {
          params.apprenticeEntryTimeMax = item.value;
        }
        //师傅入职天数下限
        if (item.code == 'SALARY_FIRE_MASTER_CONFIG_ONE') {
          params.masterEntryTimeMin = item.value;
        }
        //师傅带教徒弟上限
        if (item.code == 'SALARY_FIRE_MASTER_CONFIG_THREE') {
          params.masterApprenticeMax = item.value;
        }
      });
      this.loading = true;
      add_update_config(params)
        .then((res) => {
          const { code, data, message } = res;
          if (code == 200) {
            console.log(data);
            this.$message.success('保存成功');
          } else {
            this.$message.warning(message);
          }
          this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style></style>
