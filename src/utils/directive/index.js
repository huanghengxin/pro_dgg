import Vue from 'vue';
import emoji from './emoji';
import accControls from './access-controls';
import callLoading from './call-loading';
const directiveMap = {
  emoji,
  accControls,
  callLoading,
};
Object.keys(directiveMap).forEach((key) => {
  Vue.directive(key, directiveMap[key]);
});
