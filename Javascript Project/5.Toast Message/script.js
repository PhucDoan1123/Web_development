function toast({ title, message, type = "infor", duration = 3000 }) {
  const main = document.getElementById("toast");

  if (main) {
    const toast = document.createElement("div");

    //auto remove
    const removeTime = duration + 1000;
    const autoRemoveID = setTimeout(() => {
      main.removeChild(toast);
    }, removeTime);

    //remove toast on click
    toast.onclick = function (e) {
      if (e.target.closest(".toast_close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveID);
      }
    };
    const icons = {
      success: "fa-circle-check",
      info: "fa-circle-info",
      warning: "fa-exclamation",
      error: "fa-exclamation",
    };
    const icon = icons[type];
    const deplay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = ` slideInLeft ease .3s, fedOut linear 1s ${deplay}s forwards`;
    toast.innerHTML = `<div class="toast_icon">
  <i class="fa-regular ${icon}"></i>
        </div>
<div class="toast_body">
<h3 class="toast_title">${title}</h3>
<p class="toast_msg">${message}</p>
</div>
<div class="toast_close">
<i class="fa-solid fa-xmark"></i>
</div>`;
    main.appendChild(toast);
  }
}
function showSuccessToast() {
  toast({
    title: "Success",
    message:
      "Check out the all-new Web Awesome AND get an exclusive lifetime discount on Font Awesome Pro!",
    type: "success",
    duration: 5000,
  });
}

function showErrorToast() {
  toast({
    title: "Error",
    message:
      "Check out the all-new Web Awesome AND get an exclusive lifetime discount on Font Awesome Pro!",
    type: "error",
    duration: 5000,
  });
}
