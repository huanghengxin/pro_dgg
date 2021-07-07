const validatePhone = (inputValue) => {
  const regPhone = /^1[3-9]\d{9}$/;
  return regPhone.test(inputValue);
};

const validateNo = (inputValue) => {
  const regNumber = /^BSJ[0-9]|bsj[0-9]*$/;
  return regNumber.test(inputValue);
};

const golbalSearchAddParams = (inputValue) => {
  let params = {
    bizNo: undefined,
    customerPhone: undefined,
    customerName: undefined,
  };
  if (validateNo(inputValue)) {
    params.bizNo = inputValue;
  } else if (validatePhone(inputValue)) {
    params.customerPhone = inputValue;
  } else {
    params.customerName = inputValue;
  }
  return params;
};

export { golbalSearchAddParams, validateNo, validatePhone };
