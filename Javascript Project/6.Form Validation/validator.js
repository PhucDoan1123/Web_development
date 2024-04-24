function Validator(option) {
  var selectorRules = {};

  // Function to perform validation
  const validate = (inputElement, rule) => {
    var errorElement = inputElement.parentElement.querySelector(
      option.errorSelector
    );
    var errorMessage;
    var rules = selectorRules[rule.selector];

    for (var i = 0; i < rules.length; ++i) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errorElement.innerText = errorMessage;
      inputElement.parentElement.classList.add("invalid");
    } else {
      errorElement.innerText = "";
      inputElement.parentElement.classList.remove("invalid");
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
        var isValid = validate(inputElement, rule);
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
            values[input.name] = input.value;
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

      var inputElement = formElement.querySelector(rule.selector);

      if (inputElement) {
        // Handle blur event
        inputElement.onblur = function () {
          validate(inputElement, rule);
        };

        // Handle input event
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

// Define validation rules

Validator.isRequired = function (selector, message) {
  return {
    selector: selector,
    test: function (value) {
      return value.trim() ? undefined : message || "Please require this field";
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
