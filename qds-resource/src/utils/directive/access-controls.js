/**
 * @description 权限控制
 */

import { accControls } from 'constants/access-controls';

function isObject(val) {
  return val !== null && typeof val === 'object';
}

const accessControls = {
  inserted(el, binding) {
    const arg = binding.arg;
    const value = isObject(binding.value) ? binding.value[arg] : binding.value;
    const controls = accControls[arg]; //当前是控制状态对象
    const parentNode = el.parentNode;
    if (value == controls[arg]) {
      parentNode?.removeChild(el);
    }
  },
  update(el, binding, vnode, oldVnode) {
    const arg = binding.arg;
    const value = isObject(binding.value) ? binding.value[arg] : binding.value;
    const controls = accControls[arg]; //当前是控制状态对象
    const parentNode = el.parentNode;
    if (value == controls[arg]) {
      parentNode?.removeChild(el);
    }
  },
};

export default accessControls;
