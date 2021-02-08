import dayjs from 'dayjs';

class FilterTime {
  constructor(type, format) {
    this.type = type;
    this.format = format || 'YYYY-MM-DD HH:mm:ss';
    this.time = this.mergeTime();
  }
  monthStartTime() {
    return dayjs().startOf('month').format(this.format);
  }
  weekStartTime() {
    return dayjs().day(1).startOf('day').format(this.format);
  }
  dayStartTime() {
    return dayjs().startOf('day').format(this.format);
  }
  sevenStartTime() {
    return dayjs().subtract(6, 'day').startOf('day').format(this.format);
  }
  threeStartTime() {
    return dayjs().subtract(2, 'day').startOf('day').format(this.format);
  }
  thirtyStartTime() {
    return dayjs().subtract(29, 'day').format(this.format);
  }
  getEndTime() {
    return dayjs().endOf('day').format(this.format);
  }
  mergeTime() {
    const start = this[this.type + 'StartTime']();
    const end = this.getEndTime();
    return [start, end];
  }
}

export default FilterTime;
