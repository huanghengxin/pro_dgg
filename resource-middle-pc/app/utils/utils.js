'use strict';

function handleStall(peo, job) {
  if (!peo) return '-';
  const num = job ? '（' + job + '）' : '';
  return peo + num;
}

module.exports = {
  handleStall,
};
