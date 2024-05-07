function Validator(options) {
  var selectorRules = [];

  function getParent(inputElement, parentSelector) {
    while (inputElement.parentElement) {
      if (inputElement.parentElement.matches(parentSelector)) {
        return inputElement.parentElement;
      }
      inputElement = inputElement.parentElement;
    }
  }

  var formElement = document.querySelector(options.form);
  function validate(inputElement, rule) {
    var errorMessage;

    var errorElement = getParent(
      inputElement,
      options.formGroupSelector
    ).querySelector(options.errorSelector);

    var rules = selectorRules[rule.selector];
    for (var i = 0; i < rules.length; i++) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          errorMessage = rules[i](
            formElement.querySelector(rule.selector + ":checked")
          );

          break;
        default:
          errorMessage = rules[i](inputElement.value);
          break;
      }

      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      getParent(inputElement, options.formGroupSelector).classList.add(
        "invalid"
      );
    } else {
      errorElement.innerText = "";
      getParent(inputElement, options.formGroupSelector).classList.remove(
        "invalid"
      );
    }

    return !errorMessage;
  }

  if (formElement) {
    formElement.onsubmit = function (e) {
      e.preventDefault();
      var isFormValid = true;
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(inputElement, rule);

        if (!isValid) {
          isFormValid = false; // Update isFormValid to false
        }
      });

      if (isFormValid) {
        if (typeof options.onSubmit === "function") {
          var inputFields = document.querySelectorAll("[name]");
          var formValues = Array.from(inputFields).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                if (input.matches(":checked")) {
                  values[input.name] = input.value;
                }
                break;
              case "checkbox":
                if (!input.matches(":checked")) return values;
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break
              default: {
                values[input.name] = input.value;
              }
            }
            return values;
          },
          {});
        }
        options.onSubmit(formValues);
      }
    };

    options.rules.forEach(function (rule) {
      var inputElements = formElement.querySelectorAll(rule.selector);

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      Array.from(inputElements).forEach(function (inputElement) {
        if (inputElement) {
          //Handle on blur
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };

          //handle on input
          inputElement.oninput = function () {
            var errorElement = getParent(
              inputElement,
              options.formGroupSelector
            ).querySelector(options.errorSelector);
            errorElement.innerText = "";
            getParent(inputElement, options.formGroupSelector).classList.remove(
              "invalid"
            );
          };
        }
      });
    });
  }
}

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var valueToCheck =
        value !== null && typeof value !== "undefined"
          ? String(value).trim()
          : "";

      return valueToCheck ? undefined : message || "Vui lòng nhập trường này";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test(value) {
      var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "This flied must be an email";
    },
  };
};
Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test(value) {
      return value.length >= min
        ? undefined
        : message || `This input must be greater than ${min}`;
    },
  };
};

Validator.isConfirmation = function (selector, getConfirmation, message) {
  return {
    selector,
    test(value) {
      return value === getConfirmation()
        ? undefined
        : message || "This value is not true";
    },
  };
};
