/**
 * @description 导入主应用样式
 */
const mainApplicationStyle = `.show-tooltip {
  cursor: pointer;
  min-width: 142px !important;
  max-width: 400px !important;
  line-height: 22px;
}
.el-message-box__title {
  font-size: 16px;
  font-weight: 600;
  color: #222222;
  line-height: 22px;
}
.el-message-box__message {
  font-size: 14px;
  font-weight: 400;
  color: #222222;
  line-height: 20px;
}
.el-message-box__status {
  font-size: 18px !important;
}
.list-handle-more-item{
  min-width:100px
}
.message-box-icon .el-message-box__status{
  font-size: 16px !important;
  position: static;
  -webkit-transform: translateY(0);
  transform: translateY(0)
}
.message-box-icon .el-message-box__container{
  display: flex;
  align-items: baseline;
}
.message-box-icon .el-message-box__message{
  flex-wrap: wrap;
  padding-left: 14px;
}
`;

export default mainApplicationStyle;
