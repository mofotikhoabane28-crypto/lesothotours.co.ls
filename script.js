document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".current-year").forEach(el => {
    el.textContent = new Date().getFullYear();
  });

  const galleryItems = Array.from(document.querySelectorAll(".gallery-thumb"));
  const galleryModalElement = document.getElementById("galleryModal");
  if (galleryItems.length && galleryModalElement) {
    const galleryModal = bootstrap.Modal.getOrCreateInstance(galleryModalElement);
    const previewImage = document.getElementById("previewImage");
    const previewCaption = document.getElementById("previewCaption");
    const modalTitle = document.getElementById("galleryModalLabel");
    let activeIndex = 0;

    const showImage = index => {
      activeIndex = (index + galleryItems.length) % galleryItems.length;
      const thumb = galleryItems[activeIndex];
      const image = thumb.querySelector("img");
      previewImage.src = image.src;
      previewImage.alt = image.alt;
      previewCaption.textContent = thumb.querySelector("span").textContent;
      modalTitle.textContent = `Photo ${activeIndex + 1} of ${galleryItems.length}`;
    };

    galleryItems.forEach((button, index) => {
      button.addEventListener("click", () => {
        showImage(index);
        galleryModal.show();
      });
    });
    document.getElementById("previousImage")?.addEventListener("click", () => showImage(activeIndex - 1));
    document.getElementById("nextImage")?.addEventListener("click", () => showImage(activeIndex + 1));
    document.addEventListener("keydown", event => {
      if (!galleryModalElement.classList.contains("show")) return;
      if (event.key === "ArrowLeft") showImage(activeIndex - 1);
      if (event.key === "ArrowRight") showImage(activeIndex + 1);
    });
  }

  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    const travelDate = document.getElementById("travelDate");
    const today = new Date();
    const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
    travelDate.min = localToday;

    bookingForm.addEventListener("submit", event => {
      event.preventDefault();
      const phone = document.getElementById("bookingPhone");
      phone.setCustomValidity(phone.value.trim() && !/^[0-9+() -]{7,20}$/.test(phone.value.trim()) ? "Enter a valid phone number." : "");
      const dateInput = document.getElementById("travelDate");
      dateInput.setCustomValidity(dateInput.value && dateInput.value < localToday ? "Choose a future date." : "");
      if (!bookingForm.checkValidity()) {
        event.stopPropagation();
        bookingForm.classList.add("was-validated");
        document.getElementById("bookingMessage").innerHTML = '<div class="alert alert-danger" role="alert">Please correct the highlighted fields and try again.</div>';
        bookingForm.querySelector(":invalid")?.focus();
        return;
      }
      bookingForm.classList.add("was-validated");
      document.getElementById("bookingMessage").innerHTML = '<div class="alert alert-success" role="status">Thank you! Your demo booking enquiry is complete. No information has been sent to a server.</div>';
      bookingForm.reset();
      bookingForm.classList.remove("was-validated");
      travelDate.min = localToday;
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const phone = document.getElementById("regPhone");

    const validatePasswords = () => {
      confirmPassword.setCustomValidity(
        confirmPassword.value && confirmPassword.value !== password.value
          ? "Passwords do not match."
          : ""
      );
    };
    password.addEventListener("input", validatePasswords);
    confirmPassword.addEventListener("input", validatePasswords);
    phone.addEventListener("input", () => {
      phone.setCustomValidity(phone.value.trim() && !/^[0-9+() -]{7,20}$/.test(phone.value.trim()) ? "Enter a valid phone number." : "");
    });

    registerForm.addEventListener("submit", event => {
      event.preventDefault();
      validatePasswords();
      if (!registerForm.checkValidity()) {
        event.stopPropagation();
        registerForm.classList.add("was-validated");
        document.getElementById("registerMessage").innerHTML = '<div class="alert alert-danger" role="alert">Please check the highlighted fields. Passwords must match and contain at least 8 characters.</div>';
        registerForm.querySelector(":invalid")?.focus();
        return;
      }
      registerForm.classList.add("was-validated");
      document.getElementById("registerMessage").innerHTML = '<div class="alert alert-success" role="status">Registration successful for this demonstration. Your information has not been saved or sent anywhere.</div>';
      registerForm.reset();
      registerForm.classList.remove("was-validated");
    });
  }
});
