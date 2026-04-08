// Minimal JS (expand later if you want animations, lightbox, etc.)
document.addEventListener("DOMContentLoaded", () => {
  // Example: highlight external link subtly if needed later
});

// assets/js/main.js

(function () {
  function initImageModal() {
    const modal = document.getElementById("imgModal");
    if (!modal) return; // only run on pages that have the modal

    const modalImg = document.getElementById("modalImg");
    const closeBtn = document.getElementById("modalClose");
    const prevBtn = document.getElementById("modalPrev");
    const nextBtn = document.getElementById("modalNext");

    let lastFocusedEl = null;
    let tiles = [];
    let currentIndex = -1;

    function refreshTiles() {
      tiles = Array.from(document.querySelectorAll("img.tile-img"));
    }

    function setModalImageByIndex(idx) {
      if (!tiles.length) return;
      const safeIdx = (idx + tiles.length) % tiles.length; // wrap
      currentIndex = safeIdx;

      const img = tiles[currentIndex];
      const src = img.currentSrc || img.src;

      modalImg.src = src;
      modalImg.alt = img.alt || "Full image preview";
    }

    function openModalAtIndex(idx) {
      lastFocusedEl = document.activeElement;

      refreshTiles();
      setModalImageByIndex(idx);

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");

      modalImg.src = "";
      modalImg.alt = "";

      document.body.style.overflow = "";

      if (lastFocusedEl && typeof lastFocusedEl.focus === "function") {
        lastFocusedEl.focus();
      }

      currentIndex = -1;
    }

    function nextImage() {
      if (currentIndex === -1) return;
      setModalImageByIndex(currentIndex + 1);
    }

    function prevImage() {
      if (currentIndex === -1) return;
      setModalImageByIndex(currentIndex - 1);
    }

    // Open: click any tile
    document.addEventListener("click", (e) => {
      const img = e.target.closest("img.tile-img");
      if (!img) return;

      refreshTiles();
      const idx = tiles.indexOf(img);
      openModalAtIndex(idx);
    });

    // Controls
    closeBtn?.addEventListener("click", closeModal);
    nextBtn?.addEventListener("click", nextImage);
    prevBtn?.addEventListener("click", prevImage);

    // Click outside image closes
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // Keyboard: Esc closes, arrows navigate
    document.addEventListener("keydown", (e) => {
      if (!modal.classList.contains("is-open")) return;

      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    });

    // Touch swipe (mobile): left/right
    let startX = null;

    modal.addEventListener(
      "touchstart",
      (e) => {
        if (!modal.classList.contains("is-open")) return;
        startX = e.touches[0].clientX;
      },
      { passive: true },
    );

    modal.addEventListener(
      "touchend",
      (e) => {
        if (startX === null) return;
        const endX = e.changedTouches[0].clientX;
        const dx = endX - startX;
        startX = null;

        if (Math.abs(dx) < 40) return; // threshold
        if (dx < 0)
          nextImage(); // swipe left -> next
        else prevImage(); // swipe right -> prev
      },
      { passive: true },
    );
  }

  // Ensure DOM exists before grabbing elements
  document.addEventListener("DOMContentLoaded", initImageModal);
})();

// booking page

document.addEventListener("DOMContentLoaded", function () {
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxClose = document.getElementById("lightboxClose");
  const clickableImages = document.querySelectorAll(".digitals-grid img");

  if (!lightbox || !lightboxImage || !lightboxClose || !clickableImages.length)
    return;

  function openLightbox(src, alt) {
    lightboxImage.src = src;
    lightboxImage.alt = alt || "";
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImage.src = "";
    lightboxImage.alt = "";
    document.body.classList.remove("lightbox-open");
  }

  clickableImages.forEach((img) => {
    img.addEventListener("click", function () {
      const fullSrc = img.getAttribute("data-full") || img.src;
      openLightbox(fullSrc, img.alt);
    });
  });

  lightboxClose.addEventListener("click", closeLightbox);

  lightbox.addEventListener("click", function (e) {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && lightbox.classList.contains("open")) {
      closeLightbox();
    }
  });
});
