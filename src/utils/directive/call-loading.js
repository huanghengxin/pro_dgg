/**
 * @description 打电话指令
 * @param {}
 * @returns {}
 */

const callLoading = {
  update(el, binding) {
    console.log('sssssssssssssssssssssss', el);
    const value = binding.value;
    if (value) {
      el.classList.add('call-loading-color');
    } else {
      el.classList.remove('call-loading-color');
    }
  },
};
export default callLoading;
