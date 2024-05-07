function Validator(option) {
  function getParent(element, selector) {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  }

  var selectorRules = {};

  const validate = (formElement, inputElement, rule) => {
    if (!inputElement) return false; // Return false if inputElement is null or undefined

    var parentFormGroup = getParent(inputElement, option.formGroupSelector);

    if (!parentFormGroup) return false; // Return false if parentFormGroup is not found

    var errorElement = parentFormGroup.querySelector(option.errorSelector);
    var errorMessage;
    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; ++i) {
      switch (inputElement.type) {
        case "radio":
        case "checkbox":
          var checkedElement = formElement.querySelector(
            rule.selector + ":checked"
          );
          errorMessage = rules[i](checkedElement);
          break;

        default:
          errorMessage = rules[i](inputElement.value);
      }

      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      parentFormGroup.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      parentFormGroup.classList.remove("invalid");
    }
    return !errorMessage;
  };

  // Get the form element to validate
  var formElement = document.querySelector(option.form);

  if (formElement) {
    //Validate if submit form before full filed
    formElement.onsubmit = function (e) {
      e.preventDefault();

      var isFormValid = true;

      //Go through all of rules and do validate
      option.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
        var isValid = validate(formElement, inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      console.log();

      if (isFormValid) {
        //submit with javascript
        if (typeof option.onSubmit === "function") {
          var enableInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          var formValues = Array.from(enableInputs).reduce(function (
            values,
            input
          ) {
            switch (input.type) {
              case "radio":
                values[input.name] = formElement.querySelector(
                  'input[name="' + input.name + '"]:checked'
                ).value;
              case "checkbox":
                if (!input.matches(":checked")) {
                  values[input.name] = "";
                  return values;
                }
                if (!Array.isArray(values[input.name])) {
                  values[input.name] = [];
                }
                values[input.name].push(input.value);
                break;
              case "file":
                values[input.name] = input.files;
                break;
              default:
                values[input.name] = input.value;
            }

            return values;
          },
          {});
          option.onSubmit(formValues);

          //submit with default behavior of browser
        } else {
          formElement.submit();
        }
      }
    };
    option.rules.forEach(function (rule) {
      // Save the rules for each input
      if (selectorRules[rule.selector]) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      // Select all elements that match the selector
      var inputElements = formElement.querySelectorAll(rule.selector);

      // Iterate over each selected element
      inputElements.forEach(function (inputElement) {
        // Handle blur event
        inputElement.onblur = function () {
          validate(formElement, inputElement, rule);
        };

        // Handle input event
        inputElement.oninput = function () {
          var errorElement = getParent(
            inputElement,
            option.formGroupSelector
          ).querySelector(option.errorSelector);
          errorElement.innerText = "";
          getParent(inputElement, option.formGroupSelector).classList.remove(
            "invalid"
          );
        };
      });
    });
  }
}

// Define validation rules

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value ? undefined : message || "Please require this field";
    },
  };
};

Validator.isEmail = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      var regex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(value)
        ? undefined
        : message || "This field must be an email";
    },
  };
};

Validator.minLength = function (selector, min, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.length >= min
        ? undefined
        : message || `This field must have at least ${min} characters`;
    },
  };
};

Validator.isConfirmed = function (selector, getConfirmValue, message) {
  return {
    selector: selector,
    test: function (value) {
      return value === getConfirmValue()
        ? undefined
        : message || "This value does not match";
    },
  };
};
