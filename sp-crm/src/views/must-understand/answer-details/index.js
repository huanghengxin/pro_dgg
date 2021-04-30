/* eslint-disable max-lines */
import ShowTooltip from 'components/show-tooltip';
import spTinymce from 'components/tinymce/index';
import AnswerReview from '../components/answer-review';
import InvitedAnswer from '../components/invited-answer';
import { filterTime } from 'utils/helper';
import { getQueryString } from 'utils/helper';
import {
  getFindDetailApi,
  getAnswerListApi,
  getQuestionArticleAddApi,
  getHandleLogApi,
  getUpdateApi,
} from 'api/answer';
import SvgIcon from 'components/svg-icon';
const imgUploadUrlMap = {
  production: 'https://spapi.shupian.cn/api/oss/v1/upload',
  test: 'https://dspapi.shupian.cn/api/oss/v1/upload',
  development: 'https://dspapi.shupian.cn/api/oss/v1/upload',
};
export default {
  name: 'AnswerDetail',
  components: {
    SvgIcon,
    ShowTooltip,
    spTinymce,
    AnswerReview,
    InvitedAnswer,
  },
  filters: {
    filterTimes(val) {
      return val ? filterTime(val, 'mustUnderstand') : '';
    },
  },
  data() {
    return {
      isImg: false,
      istc: false,
      val: undefined,
      issueLoading: false,
      isShowButton: false,
      isNoData: false,
      isDisapplaudFlag: '',
      titleLoading: false,
      listLoading: false,
      query: null,
      total: 0,
      details: {},
      param: { limit: 10, page: 1 },
      moreFlag: true,
      detailList: [], //详情回答列表
      isScrollFlag: false,
      initContent: '',
      // eslint-disable-next-line no-undef
      imgUploadUrl: imgUploadUrlMap[SP_SERVER_ENV], // 你的图片上传的接口地址
      // 你图片上传接口需要的Header头参数
      num: 0,
      dislikeThrottle: null,
      contentImageUrl: '', //图片url
      contentText: '', //文字纯文本
    };
  },
  computed: {
    // isImg() {
    //   const reg = /(<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)).+?/gim;
    //   return reg.test(this.details.questionContent);
    // },
  },
  watch: {
    initContent: function (val) {
      // val是实时监测的输入值
      this.initContent = val + '';
      this.contentText = this.removeHTMLTag(val + '');
      this.num = this.contentText.length;
      if (this.num > 5000) {
        this.$messageBox.alert('字符已超出5000字符上限，请修改后重新输入！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
      }
    },
  },
  created() {
    let query = new getQueryString();
    this.query = query.from;
    this.loading = true;
    this.param.ids = [query?.id];
    this.getDetails({ id: query?.id }, 'create');
    this.getAnswerList(this.param);
  },
  mounted() {},
  methods: {
    /**
     * @description 根据文件名处理文件名的显示
     */
    truncateText(fileName, refName, lineNum = 2) {
      const textLen = Math.ceil(this.countnums(fileName) / 2) + 6;
      let ele = this.$refs[refName];
      const eleWidth = ele.clientWidth;
      const lineWidth = +eleWidth;
      // 一行可容纳的字数(不区分中英文) 这里的12是demo 的fontsize
      const strNum = Math.floor(lineWidth / +12);
      let content = '';
      // 多行可容纳总字数
      const totalStrNum = Math.floor(strNum * lineNum);
      const suffix = fileName.substring(fileName.lastIndexOf('.') + 1);
      // 超出的文字
      const lastIndex = totalStrNum - textLen;
      if (textLen > totalStrNum) {
        content = fileName
          .slice(0, lastIndex - (suffix.length + 5))
          .concat('...' + fileName.slice(fileName.length - (suffix.length + 2)));
      } else {
        content = fileName;
      }
      ele.innerHTML = content;
    },
    /**
     * @description  富文本内容去标签正则
     */
    removeHTMLTag: function (str) {
      str = str.replace(/<\/?[^>]*>/g, '');
      str = str.replace(/[ | ]*\n/g, '\n');
      str = str.replace(/&nbsp;/gi, '');
      str = str.replace(/\s/g, '');
      return str;
    },
    /**
     * @description  正则图片地址变成字符串
     */
    getimgsrc(htmlstr) {
      let reg = /(<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)).+?/gim;
      let imgsrcArr = [];
      let tem = htmlstr.matchAll(reg);
      for (const iterator of tem) {
        imgsrcArr.push(iterator[3]);
      }
      return imgsrcArr.join(',');
    },
    isimag() {
      const reg = /(<img.+?src=('|")?([^'"]+)('|")?(?:\s+|>)).+?/gim;
      if (reg.test(this.details.questionContent)) {
        this.isImg = true;
      }
    },
    /**
     * @description 获取详情
     */
    getDetails(param, type) {
      this.titleLoading = true;
      getFindDetailApi(param)
        .then((res) => {
          const { code, data = {}, message } = res || {};
          if (code === 200) {
            this.details = data;
            this.isimag();
            if (type) {
              this.initContent = this.details.content || '';
            }
          } else {
            this.$message.warning(message);
            if (res.code === 5005) {
              this.$router.go(-1);
            }
          }
          this.titleTextlength();
        })
        .catch(() => {});
    },
    /**
     * @description 标记标题按钮
     */
    titleTextlength() {
      this.$nextTick(() => {
        const titleDiv = this.$refs.titleTextRef;
        const scrollHeight = titleDiv.scrollHeight;
        this.isShowButton = scrollHeight > 40 ? true : false;
      });
    },

    /**
     * @description  分页查询问题详情中的回答列表
     */
    getAnswerList(param) {
      this.listLoading = true;
      getAnswerListApi(param)
        .then((res) => {
          const { code, data = {}, message } = res;
          if (code === 200) {
            this.total = data.total || 0;
            if (this.answerId || this.val) {
              // 查看回答更改自己回答刷新列表
              this.detailList = data?.rows || [];
              this.answerId = undefined;
              this.val = undefined;
            } else {
              this.detailList = [...this.detailList, ...data?.rows];
            }
            this.isNoData = this.detailList.length <= 0 ? true : false;
            if (this.param.limit * this.param.page < data?.total) {
              this.moreFlag = true;
            } else {
              this.moreFlag = false;
            }
            this.showAll();
          } else {
            this.$message.warning(message);
          }
          this.listLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.isNoData = true;
        });
    },
    /**
     * @description 点踩
     */
    //  操作类型:操作类型:1 点赞 2点踩 4收藏 7取消点赞 8取消点踩 9取消收藏
    dislike(item, type) {
      this.$set(item, `${type}LikeFlag`, true);
      const params = {
        businessId: item.id,
        handleType: item.isDisapplaudFlag ? 8 : 2,
        dateType: 3,
      };
      this.getHandleLog(params, item, type, 'dislike');
    },
    /**
     * @description 点赞
     */
    //   dateType数据类型:1 问题 2文章 3 回答
    getLike(item, type) {
      this.$set(item, `${type}LikeFlag`, true);
      let obj = {
        question: () => {
          const params = {
            businessId: item.questionId,
            handleType: item.isApplaudFlag ? 7 : 1,
            dateType: 1,
          };
          this.getHandleLog(params, item, type);
        },
        answer: () => {
          const params = {
            businessId: item.id,
            handleType: item.isApplaudFlag ? 7 : 1,
            dateType: 3,
          };
          this.getHandleLog(params, item, type);
        },
      };
      obj[type]();
    },
    getHandleLog(params, item, type, operationType) {
      getHandleLogApi(params)
        .then((res) => {
          const { code, message } = res;
          if (code === 200) {
            if (operationType === 'dislike') {
              item.isDisapplaudFlag = item.isDisapplaudFlag ? 0 : 1;
            } else {
              this.operation(item, type);
            }
          } else {
            this.$message.warning(message);
          }
          this.$set(item, `${type}LikeFlag`, false);
        })
        .catch(() => {
          this.$set(item, `${type}LikeFlag`, false);
        });
    },
    operation(item, type) {
      if (item.isApplaudFlag == 1) {
        if (type === 'question') {
          item.questionApplaudCount = item.questionApplaudCount * 1 - 1;
        } else {
          item.applaudCount = item.applaudCount * 1 - 1;
        }
      } else if (item.isApplaudFlag == 0) {
        if (type === 'question') {
          item.questionApplaudCount = item.questionApplaudCount * 1 + 1;
        } else {
          item.applaudCount = item.applaudCount * 1 + 1;
        }
      }
      item.isApplaudFlag = item.isApplaudFlag ? 0 : 1;
    },
    /**
     * @description 头更多
     */
    titleMore() {
      this.istc = true;
      this.isShowButton = false;
      this.isImg = false;
    },
    titleMorePickUp() {
      this.istc = false;
      this.titleTextlength();
      this.isimag();
    },

    /**
     * @description
     */
    pack(item) {
      if (item.sign) {
        this.$set(item, 'flag', true);
      }
    },
    /**
     * @description 点击查看全文
     */
    seeAllText(item) {
      this.$set(item, 'flag', false);
    },
    /**
     * @description 显示阅读全文按钮
     */
    showAll() {
      this.$nextTick(() => {
        const textArr = this.$refs.subjectMainContent;
        const detailList = this.detailList;
        const setFlag = (item, detail) => {
          if ((item?.clientHeight || item?.offsetHeight) > 200) {
            this.$set(detail, 'flag', true);
            this.$set(detail, 'sign', true);
          }
        };
        for (let i = 0; i < textArr?.length; i++) {
          const item = textArr[i];
          const imgs = item.querySelectorAll('img');
          if (imgs.length > 0) {
            for (const iterator of imgs) {
              if (iterator.complete) {
                setFlag(item, detailList[i]);
              } else {
                iterator.onload = () => {
                  setFlag(item, detailList[i]);
                };
              }
            }
          } else {
            setFlag(item, detailList[i]);
          }
        }
      });
    },
    // 图片上传成功的回调
    imgUploadSuccess(data, success, failure) {
      if (data.code === 200) {
        success(data.data.url); // 回调将上传图片成功后接口返回的图片地址插入到编辑器中
      } else {
        failure('上传失败');
      }
    },
    spTinymceVal(val) {
      this.initContent = val;
    },
    // 点击取消发布
    handleCancel() {
      const text = this.details.answerId
        ? '退出后已经修改内容不会被保存?'
        : '退出后已填写的内容将会清空是否继续?';
      this.$nextTick(() => {
        if (this.initContent.trim() == '') {
          this.query = null;
        } else {
          this.$messageBox
            .confirm(`${text}`, '温馨提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning',
              closeOnClickModal: false,
            })
            .then(() => {
              this.answerId = undefined;
              this.query = null;
            })
            .catch(() => {});
        }
      });
    },
    /**
     * @description 点击底部更多
     */
    hanleMore() {
      this.param.page += 1;
      this.getAnswerList(this.param);
    },
    // 来源类型：1 问题 2 文章 3 回答 4 视频 5课程
    answerReview(id, type) {
      this.val = null;
      this.$refs.answerReviewRef.openModal(id, type === 'answer' ? 3 : 1);
    },
    /**
     * @description  点击邀请回答
     */
    invitedAnswer(id) {
      this.$refs.invitedAnsweRef.openModal(id);
    },
    /**
     * @description 写回答
     */
    writeAnswer(id) {
      this.query = this.query ? '' : 'editor';
      // if (this.query) {
      // }else{
      // }
      // if (id) {
      //   this.initContent = this.details.content;
      //   this.answerId = id;
      // }
    },
    // 富文本点击发布
    handleIssue() {
      //正则匹配掉内容的iframe标签和script标签，以及position为fixed
      this.initContent = (this.initContent + '').replace(
        /script|iframe|\/script|\/iframe|position: ?fixed;?/g,
        '',
      );
      if (this.initContent) {
        this.contentImageUrl = this.getimgsrc(this.initContent);
        const params = {
          content: this.initContent,
          sourceId: this.details.questionId,
          contentText: this.contentText,
          contentImageUrl: this.contentImageUrl,
          categoryCode: this.details.categoryCode,
          categoryId: this.details.categoryId,
          categoryLevelIds: this.details.categoryLevelIds,
          categoryName: this.details.categoryName,
        };
        if (!this.contentText && this.contentImageUrl) {
          params.contentText = '[图片]';
        }
        let apiLocation;
        if (this.details.answerId) {
          this.answerId = this.details.answerId;
          params.id = this.details.answerId;
          apiLocation = getUpdateApi;
        } else {
          apiLocation = getQuestionArticleAddApi;
        }
        this.issueLoading = true;
        apiLocation(params)
          .then((res) => {
            if (res.code === 200) {
              this.$message.success(res.message);
              this.query = null;
              setTimeout(() => {
                this.getDetails({ id: this.details.questionId });
                this.getAnswerList({ ids: [this.details.questionId] });
              }, 3000);
            } else {
              this.$message.warning(res.message);
            }
            this.issueLoading = false;
          })
          .catch(() => {
            this.issueLoading = false;
          });
      } else {
        this.$messageBox.alert('回答内容不能为空哦?', '温馨提示', {
          confirmButtonText: '确定',
          type: 'warning',
        });
      }
    },
    // 弹框关闭刷新列表数据
    resetList(val) {
      this.val = val;
      if (val == 3) {
        this.getAnswerList(this.param);
      } else if (val == 1) {
        this.getDetails({ id: this.param.ids[0] });
      }
    },
  },
};
