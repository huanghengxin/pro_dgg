'use strict';
const Controller = require('egg').Controller;
const { Get, Post, Prefix } = require('egg-shell-decorators');
@Prefix('/yk/resource_details')
class ResourceDetailsController extends Controller {
  /**
   * @description 根据商机id查询字表商机详情
   */
  @Get('/v1/get_business_detail.do')
  async findDetailed() {
    const { ctx, app } = this;
    const rules = {
      bizId: {
        type: 'string',
        required: true,
      },
    };
    const query = ctx.query;
    const valiErrors = app.validator.validate(rules, query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    try {
      const promiseList = [];
      promiseList.push(
        ctx.service.addSource.detailed(query),
        ctx.service.addSource.getBiz(query)
      );
      const [result0, result1] = await Promise.all(promiseList);
      const { code, data = {}, message } = result0 || {};
      const { code: code1, data: data1 } = result1 || {};
      if (code === 200 && code1 === 200) {
        let obj = {};
        if (data1) {
          obj = {
            firstSource: data1.firstSourceChannel || '',
            secondSource: data1.secondSourceChannel || '',
            keyword: data1.keyword || '',
            sourceUrl: data1.sourceUrl || '',
            customerAttribute: data1.customerAttribute || '',
          };
        }
        const info = Object.assign(obj, data);
        ctx.status = 200;
        ctx.body = {
          code,
          data: info,
          message,
        };
        return;
      }
      ctx.helper.error(ctx, code !== 200 ? result0 : result1);
    } catch (error) {
      ctx.helper.fail({
        ctx,
        code: 500,
        res: '后端接口异常！',
      });
      ctx.logger.error(error);
    }
  }
  /**
   * @description 新增备用联系人
   */
  @Post('/v1/save_customer_contact.do')
  async saveCustomer() {
    const { ctx, app } = this;
    const rules = {
      contactNo: 'string',
      customerId: 'id',
      contactRlat: 'string',
      bizId: 'string',
    };
    const query = ctx.request.body;
    const valiErrors = app.validator.validate(rules, query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const service = ctx.service;
    try {
      query.contactWay = 'CONTACT_WAY_MB';
      const result0 = await service.resourceDetails.addContact(query);
      if (!(result0 && result0.code === 200)) {
        return ctx.helper.error(ctx, result0);
      }
      ctx.status = 200;
      ctx.body = {
        code: 200,
        data: result0.data,
        message: '新增成功',
      };
    } catch (error) {
      ctx.helper.fail({
        ctx,
        code: 500,
        res: '后端接口异常！',
      });
      ctx.logger.error(error);
    }
  }
  /**
   * @description 修改未分配商机的需求
   */
  @Post('/v1/edit_unallocated.do')
  async editUnallocated() {
    const { ctx, app } = this;
    const rules = {
      bizAreaName: 'string',
      businessId: 'id',
      areaCode: 'string',
    };
    const query = ctx.request.body;
    const valiErrors = app.validator.validate(rules, query);
    // 参数校验未通过
    if (valiErrors) {
      ctx.helper.fail({ ctx, code: 422, res: valiErrors });
      return;
    }
    const service = ctx.service;
    try {
      const result = await service.resourceDetails.editUnallocated(query);
      const { code } = result || {};
      if (code === 200) {
        ctx.status = 200;
        ctx.body = result;
        return;
      }
      ctx.helper.error(ctx, result);
    } catch (error) {
      ctx.helper.fail({
        ctx,
        code: 500,
        res: '后端接口异常！',
      });
      ctx.logger.error(error);
    }
  }
}

module.exports = ResourceDetailsController;
