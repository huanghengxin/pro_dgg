<template>
  <div class="out-call">
    <div class="sp-call">
      <div class="sp-call-state">
        <Badge v-if="callState === 0" status="success"> 空闲中 </Badge>
        <Badge v-if="callState === 1" status="warning"> 呼叫中... </Badge>
        <Badge v-if="callState === 2" status="error"> 通话中 {{ callDuration }} </Badge>
        <!-- 显示通话信息 -->
        <div v-if="callState === 1 || callState === 2" class="sp-call-state__user_info">
          <el-input v-model="userName" class="item-input" readonly></el-input>
          <el-input v-model="userNoTel" class="item-input" readonly></el-input>
        </div>
        <!-- 选择号码 -->
        <div v-if="callState === 0 && optCallInfo.length > 0" class="sp-call-state__opt_number">
          <el-select
            v-model="userName"
            placeholder="请选择客户"
            class="item-input"
            @change="changeUser"
          >
            <el-option
              v-for="item in optCallInfo"
              :key="item.name"
              :label="item.name"
              :value="item.name"
            >
            </el-option>
          </el-select>
          <el-select
            v-model="userNoTel"
            placeholder="请选择电话号码"
            class="item-input"
            @change="changePhoneNumber"
          >
            <el-option
              v-for="item in optNumber"
              :key="item.notel"
              :label="item.notel"
              :value="item.notel"
            >
            </el-option>
          </el-select>
        </div>
        <!-- 拨号操作 -->
        <div class="sp-call-state__but">
          <el-button
            v-if="optCallInfo.length > 0 && callState === 0"
            type="success"
            @click="optNumberCallPhone"
          >
            拨打
          </el-button>
          <el-button
            v-if="optCallInfo.length === 0 && callState === 0"
            type="success"
            @click="openDialogCall"
            >拨号</el-button
          >
          <el-button v-if="callState === 1 || callState === 2" type="danger" @click="hangupHandle">
            挂断
          </el-button>
          <el-button
            v-if="optCallInfo.length > 1 && callState === 0"
            type="primary"
            @click="changeUserNext"
          >
            拨打下一个
          </el-button>
        </div>
      </div>
      <video ref="remoteVideo" name="remoteVideo" style="display: none"></video>
      <video ref="localVideo" name="localVideo" muted="muted" style="display: none"></video>

      <!-- S 拨打电话-弹框 -->
      <el-dialog
        v-drag
        title="拨打电话"
        width="276px"
        custom-class="sp-call-dialog"
        :visible.sync="dialogCall"
        :close-on-click-modal="false"
        :modal="false"
      >
        <div class="call-body">
          <div class="call-input">
            <input
              ref="callPhoneInput"
              v-model="phone_number"
              type="tel"
              class="input"
              @keyup.enter="handleCall"
            />
            <img
              src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsBAMAAADsqkcyAAAALVBMVEVHcEz////////////////////////////////////////////////////////NXt0CAAAADnRSTlMAzewqDLaMX0IG3hRTdYhJYxgAAACwSURBVCjPY2AYMYAj6B0yWOYAEa57hwokIYrRRN+9BQsboQs/BYmyyKELPwQJs77DKpwHYUvowQiwMA9USQPQiocOeTBhmIXKzHrvRNhhhnCvgwo/MjB66FAHE54Kt0iZOYQdbmUeXPiRAcy7KMLvAlj03mEa8tDBwegdhpVAZ4Acg+5AoDOAjnmH7h2Qm6HKkT3fUAdyTB56UKnBCYgwjoDFEQ24Ig1HFONKEMMeAABxoG2AsyaLkgAAAABJRU5ErkJggg=="
              @click="clearPhoneNumber"
            />
          </div>
          <div class="call-number">
            <el-row v-for="(item, index) in num" :key="index + item" :gutter="16">
              <el-col v-for="(items, indexs) in item" :key="indexs + items" :span="8">
                <div class="number" @click="handleClick(items)">{{ items }}</div>
              </el-col>
            </el-row>
          </div>
          <div class="call-but">
            <el-button type="success" icon="el-icon-phone" round @click="handleCall">
              拨打电话
            </el-button>
          </div>
        </div>
      </el-dialog>
      <!-- E 拨打电话-弹框 -->

      <!-- S 通话中-弹框 -->
      <el-dialog
        v-drag
        :title="dialogCallInTitle"
        width="310px"
        custom-class="sp-call-in-dialog"
        :visible.sync="dialogCallIn"
        :close-on-click-modal="false"
        :modal="false"
      >
        <div class="call-in-body dgg-cl">
          <div class="on-line dgg-fl">
            <div class="number">{{ phone_number }}</div>
            <div class="phone-wap">
              <div class="phone-wap-1">
                <div class="phone-wap-2">
                  <i class="el-icon-phone-outline"></i>
                </div>
              </div>
              <div class="text">{{ callDuration }}</div>
            </div>

            <div class="but">
              <el-button type="danger" icon="el-icon-phone" round @click="hangupHandle">
                挂断
              </el-button>
            </div>
          </div>
        </div>
      </el-dialog>
      <!-- E 通话中-弹框 -->
    </div>
  </div>
</template>

<script>
import OutCall from './out-call';
export default OutCall;
</script>
