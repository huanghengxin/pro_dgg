<template>
  <div class="answer_detail">
    <div class="answer_detail-title-text">问题详情</div>
    <div class="answer_detail-title">
      <div class="title-content-1">
        <div class="problem-title">
          <show-tooltip
            v-if="details.title"
            :tooltip-line-clamp="2"
            :text="details.title"
            :width="850"
          ></show-tooltip>
        </div>
        <div v-if="Object.keys(details).length > 0" class="answer-tag">
          <template v-for="(item, index) in details.categoryName.split(',')">
            <el-tag v-if="item" :key="index">{{ item }} </el-tag>
          </template>
        </div>
        <div class="question-title">
          <div
            ref="titleTextRef"
            :class="{ 'answer-content': true, 'answer-content-hidden': isShowButton }"
            v-html="istc ? details.questionContent : details.questionText"
          ></div>
        </div>
        <div v-if="(isShowButton || isImg) && !istc" class="show-more" @click="titleMore">
          <em>显示更多</em>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div v-if="istc" class="close-more">
          <span @click="titleMorePickUp"> <em>收起</em> <i class="el-icon-arrow-up"></i> </span>
        </div>
        <div v-show="details.questionId" class="answer-button">
          <el-button
            v-if="details.answerId"
            :class="query ? 'bgc' : 'click-active'"
            size="mini"
            @click="writeAnswer(details.answerId)"
            ><i class="iconfont-qds-crm icon-surface_edit font-icon"></i> <i> 编辑回答</i>
          </el-button>
          <el-button
            v-else
            size="mini"
            :class="query ? 'bgc' : 'click-active'"
            @click="writeAnswer('')"
            ><i class="iconfont-qds-crm icon-surface_edit font-icon"></i> <i>写回答</i>
          </el-button>
          <el-button
            v-show="details.questionId"
            size="mini"
            @click="invitedAnswer(details.questionId)"
          >
            <i class="iconfont-qds-crm icon-surface_addcustomer font-icon"></i> <i>邀请回答</i>
          </el-button>
          <el-button
            size="mini"
            type="text"
            :class="details.isApplaudFlag ? 'font-active' : 'default-font'"
            :disabled="details && details.questionLikeFlag"
            @click="getLike(details, 'question')"
            ><i class="iconfont-qds-crm icon-dianzan_mian font-icon"></i>
            <i>点赞&nbsp;{{ details.questionApplaudCount }}</i>
          </el-button>
          <el-button
            size="mini"
            type="text"
            class="default-font"
            @click="answerReview(details.questionId, 'question')"
          >
            <i class="iconfont-qds-crm icon-zixun_mian font-icon"></i>
            <i>评论&nbsp;{{ details.questionRemarkCount }}</i>
          </el-button>
        </div>
      </div>
      <div class="title-content-2">
        <div class="collect">
          <p class="text">收藏</p>
          <p>{{ details.collectCount }}</p>
        </div>
        <div class="browse">
          <p class="text">浏览</p>
          <p>{{ details.totalBrowseCount }}</p>
        </div>
      </div>
    </div>
    <transition>
      <!-- 富文本（）详情也编辑按钮进来 -->
      <div v-show="query" class="answer_detail-richtext">
        <div class="richtext-title">
          <img v-if="details.headPortraitUrl" :src="details.headPortraitUrl" alt="" />
          <img v-else src="~@/assets/image/default-head.png" alt="" />
          <span>{{ details.userName }}</span>
        </div>
        <sp-tinymce
          ref="tinymce"
          :toolbar="[' bold  italic hr| image| alignright aligncenter alignleft|  redo undo']"
          :img-upload-url="imgUploadUrl"
          :set-headers="{
            'request-origin': 'WAP',
          }"
          :init-content="initContent"
          @imgUploadSuccess="imgUploadSuccess"
          @change="spTinymceVal"
        />
        <div class="richtext-btn">
          <p class="grayColor">
            <span :class="num === 0 ? '' : num > 5000 ? 'redColor' : 'blackColor'">{{ num }}</span
            >/<span>5000</span>
          </p>
          <div>
            <el-button @click="handleCancel">取消</el-button>
            <el-button
              :loading="issueLoading"
              type="primary"
              size="medium"
              data-tid="recordsCancelButton"
              @click="handleIssue"
              >发布</el-button
            >
          </div>
        </div>
      </div>
    </transition>
    <div v-loading="listLoading" class="answer_detail-content">
      <div class="content-title">共有 {{ total }} 条回复</div>
      <div
        v-if="!isNoData"
        ref="contentSubjectRef"
        class="scroll-ele"
        :class="isScrollFlag ? 'is-scroll' : ''"
      >
        <div v-for="(item, i) in detailList" :key="i + 'detailList'" class="content-subject">
          <div class="subject-title">
            <img v-if="item.headPortraitUrl" :src="item.headPortraitUrl" alt="" />
            <img v-else src="~@/assets/image/default-head.png" alt="" />
            <span class="subject-title-name">{{ item.userName }}</span>
            <span class="subject-title-time">{{ item.updateTime | filterTimes }}</span>
          </div>
          <div class="subject-main" :class="item.flag ? 'subject-main-all' : ''">
            <div ref="subjectMainContent" class="subject-main-content" v-html="item.content"></div>
            <div v-if="item.flag" class="seeAll">
              <div class="lucency"></div>
              <span @click="seeAllText(item)">查看全文</span>
            </div>
          </div>
          <div class="subject-btn">
            <el-button
              v-show="!item.isDisapplaudFlag"
              size="mini"
              type="primary"
              :class="item.isApplaudFlag ? 'bgc' : 'nobgc'"
              plain
              :disabled="item && item.answerLikeFlag"
              @click="getLike(item, 'answer')"
              ><i class="iconfont-qds-crm icon-zantong_mian font-icon"></i> 赞同&nbsp;{{
                item.applaudCount
              }}</el-button
            >
            <el-button
              v-show="!item.isApplaudFlag"
              size="mini"
              type="primary"
              class="dislike"
              :class="item.isDisapplaudFlag ? 'bgc' : 'nobgc'"
              plain
              :disabled="item && item.answerLikeFlag"
              @click="dislike(item, 'answer')"
            >
              <i class="iconfont-qds-crm icon-fandui_mian font-icon"></i
            ></el-button>
            <el-button
              v-if="item.sign && !item.flag"
              size="mini"
              type="primary"
              plain
              @click="pack(item)"
              >收起</el-button
            >
            <el-button
              size="mini"
              type="text"
              class="default-font"
              @click="answerReview(item.id, 'answer')"
            >
              <i class="iconfont-qds-crm icon-zixun_mian font-icon"></i> 评论&nbsp;{{
                item.remarkCount
              }}</el-button
            >
          </div>
        </div>
      </div>
      <template v-else>
        <svg-icon key="item-warp" ava-class="empty" type="nodata" icon="icon-icon_nodata" />
      </template>
    </div>
    <div v-show="moreFlag" class="answer_detail-more" @click="hanleMore">查看更多</div>
    <answer-review ref="answerReviewRef" data-tid="answerReviewResetList" @reset-list="resetList" />
    <invited-answer ref="invitedAnsweRef" data-tid="invitedAnsweResetList" />
  </div>
</template>

<script>
import './index.scss';
import answerDetails from './index.js';
export default answerDetails;
</script>
