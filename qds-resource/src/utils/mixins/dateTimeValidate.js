import dayjs from 'dayjs';
export default function nextOneHourLate(feild, dataNum, type, isrequire = false) {
  return {
    data() {
      const validateNextFollowTime = (rule, value, callback) => {
        if (value) {
          if (dayjs(value).valueOf() <= this.nextTime) {
            callback('选择时间需要大于当前时间5分钟');
          } else {
            callback();
          }
        } else {
          if (isrequire) {
            callback('请选择时间');
          } else {
            callback();
          }
        }
      };
      return {
        nextTime: '',
        nowTime: '',
        rules: {
          [feild]: [{ validator: validateNextFollowTime, trigger: 'blur', required: isrequire }],
        },
        pickerOptions: {
          disabledDate(time) {
            const day = dayjs(time);
            return day < dayjs().subtract(1, 'day') || day > dayjs().add(dataNum, type);
          },
        },
      };
    },
    methods: {
      focusHandle() {
        this.nowTime = dayjs().format('HH:mm:ss');
      },
    },
  };
}
