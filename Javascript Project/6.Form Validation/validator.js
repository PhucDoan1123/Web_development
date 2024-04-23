function Validator(option) {
  //Hàm thực hiện validate
  const validate = (inputElement, rule) => {
    var errorElement = inputElement.parentElement.querySelector(
      option.errorSelector
    );
    var errorMessage = rule.test(inputElement.value);
    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
    }
  };

  //Lấy element của form cần validate
  var formElement = document.querySelector(option.form);

  if (formElement) {
    option.rules.forEach(function (rule) {
      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        //Xử lí khi trường hợp blur khỏi input
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        //Xử lí mỗi khi người dùng nhập input
        inputElement.oninput = function () {
          var errorElement = inputElement.parentElement.querySelector(
            option.errorSelector
          );
          errorElement.innerText = "";
          inputElement.parentElement.classList.remove("invalid");
        };
      }
    });
  }
}

Validator.isRequired = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : "Please require this flied";
    },
  };
};

Validator.isEmail = function (selector) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value) ? undefined : "This field must be an email";
    },
  };
};

Validator.minLength = function (selector, min) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : `This filed must greater than ${min} characters`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue() ? undefined : "This value is not true";
    },
  };
};
