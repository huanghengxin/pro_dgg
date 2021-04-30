const findEle = (parent, type) => {
  return parent.tagName.toLowerCase() === type ? parent : parent.querySelector(type);
};
const trigger = (el, type) => {
  const e = document.createEvent('HTMLEvents');
  e.initEvent(type, true, true);
  el.dispatchEvent(e);
};
const regPhone = /1[3-9]\d{9}|1[3-9][0-9]-\d{4}-\d{4}|1[3-9][0-9]\s+\d{4}\s+\d{4}/;
// const regRule = /[`~!@#$%^&*()_\-+=<>?:"{}|,;'\\[\]·~！@#￥%……&*（）——\-+={}|《》？：“”【】、；‘'，。、]/g;
const handleTextarea = function(el, node) {
  el.$inp = node;
  node.handle = function() {
    let val = node.value;
    node.value = val.replace(regPhone, '');
    trigger(node, 'input');
  };
  node.addEventListener('blur', el.$inp.handle);
};
// const handleText = function(el, node, vnode) {
//   el.$inp = node;
//   node.handle = function() {
//     let val = node.value;
//     if (regRule.test(val)) {
//       el.classList.add('el-form_error');
//     } else {
//       el.classList.remove('el-form_error');
//     }
//     trigger(node, 'input');
//   };
//   node.addEventListener('blur', el.$inp.handle);
// };
export default {
  bind(el, binding, vnode, oldVnode) {
    const value = binding.value;
    if (!['input', 'textarea'].includes(value)) return;
    let node = findEle(el, value);
    if (value === 'textarea') handleTextarea(el, node);
    // if (value === 'input') handleText(el, node, vnode);
  },
  unbind: function(el, binding) {
    if (binding.value === 'textarea') {
      el.$inp.removeEventListener('blur', el.$inp.handle);
    }
  },
};
