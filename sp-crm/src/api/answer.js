import api from 'utils/api';
import { param } from 'utils/helper';

// 我被邀请回答的问题分页查询
export function getInviteAnswersLimitQueryApi(params) {
  return api.get(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/invite_answers_list`,
    params,
  );
}
// 为你推荐回答
export function getFindPageApi(params) {
  return api.get('/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/find_page', params);
}
// 关键字搜索
export function getSearchListApi(params) {
  return api.get(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/search_list`, params);
}

// 我的回答列表
export function getAnswerLimitQuerApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/my_answer_list`,
    params,
  );
}

// 新增回答
export function getQuestionArticleAddApi(params) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/add`, params);
}

// 评论列表
export function getFindPagApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/comment/comment_list`,
    params,
  );
}

//修改回答
export function getUpdateApi(params) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/update`, params);
}

// 邀请回答用户列表

export function getInviteUserListApi(params) {
  return api.get(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/invite_user_list`,
    params,
  );
}
// 用户邀请其他用户回答问题
export function getInviteAnswerApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/invite_answer`,
    params,
  );
}
// 添加对于问题/文章/回答用户收藏/取消收藏、点赞/取消点赞、点踩/取消/操作
export function getHandleLogApi(params) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/handle_log`, params);
}

// 根据ID查询问题详情  id
export function getFindDetailApi(params) {
  return api.get(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/find_detail`, params);
}

// 删除回答
export function getDeleteApi(id = 0) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/delete?id=${id}`);
}
// 分页查询问题详情中的回答列表
export function getAnswerListApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/question/answer_list`,
    params,
  );
}
// 对评论进行点赞/取消点赞
export function getCommentHandleLogApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/comment/comment_handle_log`,
    params,
  );
}

// 删除评论
export function getCommentDeleteApi(params) {
  return api.post(
    `/crm-middle-pc/api/crisps-crm/service/yk/must_know/comment/comment_delete`,
    params,
  );
}
// 新增评论
export function getAnswerCommentAddApi(params) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/yk/must_know/comment/comment_add`, params);
}

// 新增评论

export function getListMchUserApi(params) {
  return api.post(`/crm-middle-pc/api/crisps-crm/service/nk/v1/list_mch_user.do`, params);
}
