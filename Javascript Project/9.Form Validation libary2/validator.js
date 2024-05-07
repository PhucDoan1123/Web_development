function Validator(selector) {
  var formRules = {};
  var _this = this;
  console.log(_this);

  function getParent(input, selector) {
    while (input.parentElement) {
      if (input.parentElement.matches(selector)) {
        return input.parentElement;
      }
      input = input.parentElement;
    }
  }

  var ValidatorRules = {
    required(value) {
      var valueCheck =
        value !== null || value !== undefined ? value : String(value).trim;
      return valueCheck ? undefined : "This filed must required";
    },
    email(value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

      return regex.test(value)
        ? undefined
        : "This filed must be an email address";
    },
    min(min) {
      return function (value) {
        return value.length >= min
          ? undefined
          : `This input must be greater than ${min}`;
      };
    },
    max(max) {
      return function (value) {
        return value.length <= max
          ? undefined
          : `This input must be smaller than ${max}`;
      };
    },
  };

  var formElement = document.querySelector(selector);
  if (formElement) {
    var inputs = formElement.querySelectorAll("[name][rules]");

    for (const input of inputs) {
      var rules = input.getAttribute("rules").split("|");

      for (rule of rules) {
        var ruleInfor;
        var isRuleHasValue = rule.includes(":");

        if (isRuleHasValue) {
          ruleInfor = rule.split(":");
          rule = ruleInfor[0];
        }

        var ruleFunction = ValidatorRules[rule];

        if (isRuleHasValue) {
          ruleFunction = ruleFunction(ruleInfor[1]);
        }

        if (Array.isArray(formRules[input.name])) {
          formRules[input.name].push(ruleFunction);
        } else {
          formRules[input.name] = [ruleFunction];
        }
      }
      input.onblur = handleValidate;
      input.oninput = handleClearError;
    }

    function handleValidate(e) {
      var rules = formRules[e.target.name];
      var errorMessage;
      rules.some(function (rule) {
        errorMessage = rule(e.target.value);

        return errorMessage;
      });

      if (errorMessage) {
        var formGroup = getParent(e.target, ".form-group");

        if (formGroup) {
          var formMessage = formGroup.querySelector(".form-message");
          if (formMessage) {
            formGroup.classList.add("invalid");
            formMessage.innerText = errorMessage;
          }
        }
      }
      return !errorMessage;
    }

    function handleClearError(e) {
      var formGroup = getParent(e.target, ".form-group");
      var formMessage = formGroup.querySelector(".form-message");

      if (formGroup.classList.contains("invalid")) {
        formGroup.classList.remove("invalid");
        formMessage.innerText = "";
      }
    }
  }

  formElement.onsubmit = function (e) {
    e.preventDefault();
    var inputs = formElement.querySelectorAll("[name][rules]");
    var isValid = true;
    for (input of inputs) {
      if (!handleValidate({ target: input })) {
        isValid = false;
      }
    }

    if (isValid) {
      if (typeof _this.onSubmit === "function") {
        var formValue = Array.from(inputs).reduce(function (vales, input) {
          switch (input.type) {
            case "radio":
              if (input.checked) {
                vales[input.name] = input.value;
              }
              break;
            case "checkbox":
              if (!input.matches(":checked")) return vales;
              if (!Array.isArray(vales[input.name])) {
                vales[input.name] = [];
              }
              vales[input.name].push(input.value);
              break;
            default:
              vales[input.name] = input.value;
          }
          return vales;
        }, {});
        _this.onSubmit(formValue);
      } else {
        formElement.submit();
      }
    }
  };
}
