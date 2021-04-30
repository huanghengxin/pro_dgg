/**
 * @description 导入主应用样式
 */
const mainApplicationStyle = `.show-tooltip {
  cursor: pointer;
  min-width: 142px !important;
  max-width: 400px !important;
  line-height: 22px;
}
.danger-limit-way .el-icon-warning{
    color: #f1524e;
    font-size: 18px !important;
}
.team-manage-error .el-message-box__status{
  font-size: 14px !important;
  position: static;
  -webkit-transform: translateY(0);
  transform: translateY(0)
}
.team-manage-error .el-message-box__container{
  display: flex;
  align-items: baseline;
}
.team-manage-error .el-message-box__message{
  flex-wrap: wrap;
  padding-left: 14px;
}
.business-right-more-handle{
  min-width:100px
}
.search-popover {
  width: 304px;
}
.search-history-title {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 400;
  color: #999999;
  line-height: 20px;
  padding-bottom: 10px;
  margin-bottom: 8px;
  border-bottom: 1px solid #e5e5e5;
}
.search-history-title-icon {
  cursor: pointer;
}
.search-history {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  height: 36px;
}
.search-history:hover {
  background-color: #f2f2f2;
}
.search-history-content {
  width: 260px;
  height: 36px;
  line-height: 36px;
  font-size: 14px;
  font-weight: 400;
  color: #222222;
}
.more-popover {
  width: 158px;
  line-height: 36px;
}`;

export default mainApplicationStyle;
