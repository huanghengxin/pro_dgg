import Vue from 'vue';
import emoji from './emoji';
import accControls from './access-controls';

const directiveMap = {
  emoji,
  accControls,
};
Object.keys(directiveMap).forEach((key) => {
  Vue.directive(key, directiveMap[key]);
});
