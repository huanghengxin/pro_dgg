/**
 * @description 打电话指令
 * @param {}
 * @returns {}
 */

const callLoading = {
  update(el, binding) {
    const value = binding.value;
    if (value) {
      //禁止父级div点击事件
      el.parentNode.classList.add('call-loading-color');
      // el.classList.replace('icon-dianhua')
    } else {
      el.parentNode.classList.remove('call-loading-color');
    }
  },
};
export default callLoading;
