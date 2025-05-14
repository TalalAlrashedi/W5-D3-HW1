const alertPlaceholder = document.getElementById("liveAlertPlaceholder");

const appendAlert = (message, type = "success") => {
  if (!alertPlaceholder) return;

  alertPlaceholder.innerHTML = ""
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    </div>
  `;
  alertPlaceholder.append(wrapper);
};