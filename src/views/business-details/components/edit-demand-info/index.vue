<template>
  <el-dialog
    title="修改/新增客户需求"
    custom-class="edit-demand-info"
    :visible.sync="dialogVisible"
    :close-on-click-modal="false"
    width="480px"
    @close="diologHandleClose"
  >
    <el-form
      ref="ruleForm"
      label-position="left"
      size="small"
      label-width="120px"
      :rules="rules"
      :model="ruleForm"
    >
      <!-- 客户需求： -->
      <el-form-item class="from-name" label="客户需求：" prop="customerRequire">
        <template v-if="demandId">
          <el-input v-model="ruleForm.customerRequire" disabled placeholder="请输入"></el-input>
        </template>
        <template v-else>
          <el-cascader
            ref="customerRequireRef"
            v-model="ruleForm.customerRequire"
            placeholder="请选择客户需求"
            :props="props"
            @change="requireChangeHandle"
          ></el-cascader>
        </template>
      </el-form-item>
      <!-- 业务区域： -->
      <el-form-item class="from-name" label="业务区域：" prop="demandArea">
        <el-select v-model="ruleForm.demandArea" data-tid="demandAreaSelect" placeholder="请选择">
          <el-option v-for="item in areaList" :key="item.key" :label="item.value" :value="item.key">
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 意向产品 -->
      <el-form-item class="from-name" label="意向产品：" prop="demandProduct">
        <el-select
          v-model="ruleForm.demandProduct"
          clearable
          value-key="productCode"
          :disabled="proDisable"
          data-tid="productCodeSelect"
          placeholder="请先选择需求在选择对应产品"
        >
          <el-option
            v-for="item in demandProductList"
            :key="item.value"
            :label="item.productName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <!-- 客户预算： -->
      <el-form-item class="from-budget" label="客户预算：">
        <tow-input ref="twoInputRefs" :value="ruleForm.budget" />
      </el-form-item>
      <!-- 预计完结时间 -->
      <el-form-item class="from-name" label="预计完结时间：" prop="expectFinishTime">
        <el-date-picker
          v-model="ruleForm.expectFinishTime"
          placeholder="选择日期"
          :picker-options="pickerOptions"
          value-format="yyyy-MM-dd"
          data-tid="expectFinishTimePick"
          size="small"
        >
        </el-date-picker>
      </el-form-item>
      <!-- 业务属性1： -->
      <template v-for="parent in busAttrList">
        <el-form-item :key="parent.id" class="from-name" :label="parent.name">
          <el-select
            v-model="ruleForm.service[parent.code]"
            value-key="attriValueCode"
            clearable
            data-tid="serviceSelect"
            placeholder="请选择"
          >
            <el-option
              v-for="item in parent.children"
              :key="item.id"
              :label="item.attriValue"
              :value="item.attriValueCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <!-- 弹层按钮 -->
    <span slot="footer" class="footer">
      <el-button size="small" data-tid="recordsCancelButton" @click="dialogVisible = false"
        >取消</el-button
      >
      <el-button
        type="primary"
        size="small"
        :loading="loading"
        data-tid="infoSubmitHandleClick"
        @click="submitHandleClick"
        >提交</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import './index.scss';
import TowInput from 'components/two-input';
import dayjs from 'dayjs';
import { PRODUCE_TYPE_MAP } from 'constants/type';
import {
  get_user_business_category,
  get_user_website,
  get_product_list,
  getTreeBook,
  create,
  edit_demand,
} from 'api/common';
export default {
  name: 'EditDemandInfo',
  components: {
    TowInput,
  },
  data() {
    const validateRequire = (rule, value, callback) => {
      if (!value) {
        callback('请选择需求');
      } else if (this.followDemandList.includes(value[2])) {
        callback('你已有该需求,请选择其他需求');
      } else {
        callback();
      }
    };
    return {
      pickerOptions: {
        disabledDate(time) {
          const day = dayjs(time);
          return day < dayjs().subtract(1, 'day');
        },
      },
      requirementNo: '',
      businessId: '',
      followDemandList: [],
      attributeList: [],
      demandProductList: [], //意向产品
      dialogVisible: false,
      loading: false,
      props: {
        lazy: true, //开启动态加载
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
              const nodes = data.map((item) => {
                return {
                  value: item.code,
                  label: item.name,
                  leaf: level >= 2,
                  productTypeCode: item.productTypeCode,
                };
              });
              // 通过调用resolve将子节点数据返回，通知组件数据加载完成
              resolve(nodes);
            } else {
              resolve([]);
            }
          });
        },
      },
      ruleForm: {
        customerRequire: '',
        demandArea: '',
        demandProduct: {},
        budget: '',
        expectFinishTime: '',
        service: {},
      },
      busAttrList: [],
      areaList: [], //地区
      expectFinishTimeList: [], //预计完成时间
      rules: {
        customerRequire: [{ required: true, validator: validateRequire, trigger: 'change' }],
        demandArea: [{ required: true, message: '请选择区域', trigger: 'blur' }],
      },
      demandId: '',
      proDisable: true, //未选择需求时禁用意向产品选择框
    };
  },
  methods: {
    /**
     * @description 获取意向产品list
     */
    getProdectList(classCodes = '', feild, item) {
      const params = {
        classCodes,
        limit: 1000,
        start: 1,
        productType: PRODUCE_TYPE_MAP[feild],
      };
      get_product_list(params).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.demandProductList = res?.records || [];
          this.ruleForm.demandProduct =
            this.demandProductList.find((_) => _.productCode === item?.intentionProductCode) || '';
        } else {
          this.$message.warning(res.message);
        }
      });
    },
    /**
     * @description 获取业务属性List
     */
    getAttrList(parentCode) {
      if (!parentCode) return;
      this.getTreeBooKList(parentCode, 2, 3).then((res) => {
        if (res.code === 200) {
          res = res.data;
          if (!Array.isArray(res)) return;
          const map = res.reduce((acc, cur) => {
            acc[cur.code] = cur;
            return acc;
          }, {});

          this.busAttrList = res.reduce((acc, cur) => {
            const parent = map[cur.pcode];
            if (parent) {
              const obj = {
                attriName: parent.name,
                attriNameCode: parent.code,
                attriValue: cur.name,
                attriValueCode: cur.code,
              };
              if (parent.children) {
                parent.children.push(obj);
              } else {
                parent.children = [obj];
              }
            } else {
              this.$set(this.ruleForm.service, cur.code, '');
              acc.push(cur);
            }
            return acc;
          }, []);
          //回显业务属性
          const attributeList = this.attributeList;
          if (attributeList.length) {
            attributeList.forEach((item) => {
              if (item.attriNameCode) {
                this.ruleForm.service[item.attriNameCode] = item.attriValueCode
                  ? item.attriValueCode
                  : '';
              }
            });
          }
        }
      });
    },
    /**
     * @description 选择需求后加载对应的意向产品
     * @param {String} 选中的值
     */
    requireChangeHandle(val) {
      if (!val) return;
      this.proDisable = false;
      const quire = this.$refs.customerRequireRef.getCheckedNodes();
      const feild = quire && quire[0]?.data?.productTypeCode;
      if (!feild) return;
      this.getProdectList(val[2], feild); //获取意向产品接口
      const parentCode = quire[0].parent.value;
      this.getAttrList(parentCode); //获取业务属性List
    },
    /**
     * @description 获取用户授权的区域范围
     */
    getAreaList(item) {
      get_user_website().then((res) => {
        if (res.code === 200) {
          res = res.data || {};
          const curArea = res.list?.find((it) => it.key === item?.bizAreaCode);
          if (item && !curArea) {
            this.$message.info('业务区域不在授权范围内，请重新选择或联系商户管理员。');
          }
          this.ruleForm.demandArea = curArea ? item?.bizAreaCode : '';
          this.areaList = res?.list || [];
        }
      });
    },

    /**
     * @description 提交表单
     */
    submitHandleClick() {
      const flag = this.$refs.twoInputRefs.validateForm();
      this.$refs.ruleForm.validate((valid) => {
        if (valid && flag) {
          const ruleForm = this.ruleForm;
          const service = [];
          // debugger;
          this.busAttrList.forEach((item, index) => {
            const itemCode = ruleForm.service[item.code];
            if (itemCode) {
              service.push(
                item.children.find((it) => {
                  return it.attriValueCode === itemCode;
                }),
              );
            } else {
              service.push({
                attriName: item.name,
                attriNameCode: item.code,
                attriValue: '',
                attriValueCode: '',
              });
            }
          });
          let params = {
            areaCode: ruleForm.demandArea,
            bizAreaName:
              this.areaList.find((item) => item.key === ruleForm.demandArea)?.value || '',
            businessId: this.businessId,
            expectedCompletedTime: ruleForm.expectFinishTime
              ? dayjs(ruleForm.expectFinishTime).format('YYYY-MM-DD') + ' 23:59:59'
              : undefined,
            expectedMoney: typeof flag === 'boolean' ? undefined : flag,
            intentionProduct: ruleForm.demandProduct?.productName || undefined,
            intentionProductCode: ruleForm.demandProduct?.productCode || undefined,
          };
          params.attributes = service.length === 0 ? undefined : service;
          let path;
          if (this.demandId) {
            path = edit_demand; //编辑接口
            params.requirementId = this.demandId;
            params.requirementNo = this.requirementNo;
          } else {
            const quire = this.$refs.customerRequireRef.getCheckedNodes();
            path = create; //新建接口
            params.parentCode = quire[0].parent.value;
            params.parentName = quire[0].parent.label;
            params.intentionName = quire[0].label;
            params.intentionCode = quire[0].value;
            params.productType = quire[0].data.productTypeCode;
          }
          this.loading = true;
          path(params)
            .then((res) => {
              if (res.code === 200) {
                res = res.data;
                this.$emit('on-submit');
                if (!this.demandId) {
                  this.$eventBus.$emit('edit-on-submit_update-business-info');
                }
                this.$message.success('修改成功');
                this.dialogVisible = false;
              } else {
                this.$message.warning(res.message);
                if (res.code === 5002) {
                  this.$router.go(-1);
                }
              }
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
    /**
     * @description 供父组件调用打开弹层
     */
    openModal(item, bizId, attributeList, followDemandList) {
      let ruleForm = this.ruleForm;
      this.businessId = bizId;
      if (item.requireId) {
        //回显
        this.demandId = item.requireId;
        this.requirementNo = item.requirementNo;
        this.getProdectList(item.intentionCode, item.productType, item);
        this.getAttrList(item.parentCode);
        ruleForm.customerRequire = item.intentionName;
        ruleForm.expectFinishTime = item.expectedCompletedTime;
        ruleForm.budget = item.expectedMoney;
        this.proDisable = false;
        this.attributeList = attributeList;
      }
      this.followDemandList = followDemandList;
      this.dialogVisible = true;
      this.getAreaList(item); //区域
      this.getTreeBooKList('CRM_REQ_EXPECTED_TIME', 2).then((res) => {
        if (res.code === 200) {
          res = res.data;
          this.expectFinishTimeList = res;
        }
      }); //预计完结时间
    },
    /**
     * @description 数据字典接口
     */
    async getTreeBooKList(code, type, level = 1) {
      let params = {
        code,
        level,
        status: 1,
        type,
      };
      return await getTreeBook(params);
    },
    /**
     * @description 弹层关闭抛出事件,重置表单数据
     */
    diologHandleClose() {
      this.busAttrList = [];
      this.demandId = '';
      this.businessId = '';
      this.proDisable = true;
      this.ruleForm = {
        customerRequire: '',
        demandArea: '',
        demandProduct: {},
        budget: '',
        expectFinishTime: '',
        service: {},
      };
      this.$refs.ruleForm.resetFields();
      this.$refs.twoInputRefs.resetFields();
    },
  },
};
</script>
