'use strict';
/**
 * @description 客源中心接口
 */
module.exports = {
  find_by_biz_ids: '/yk/v1/business_resource/find_by_biz_ids.do',
  find_by_biz_id: '/yk/v1/business_resource/find_by_biz_id.do',
  add_allot_business: '/yk/v1/business/add_allot_business.do',
  add: '/yk/v1/resource_simulate/add_biz.do',
  find_list: '/yk/v1/business_record/find_list.do',
  pick_up: '/yk/v1/business/pick_up.do',
  delete_business: '/yk/v1/business/delete_business.do',
  update_business: '/yk/v1/business/update_business.do',
  find_test_list: '/yk/v1/resource_simulate/find_list.do',
  delete_by_id: '/yk/v1/resource_simulate/delete_by_id.do',
  delete_resource: '/yk/v1/clue_resource/delete_by_id.do',
  complete_clue: '/yk/v1/business/complete_clue.do', // 完善线索并转化为商机并分配
};
