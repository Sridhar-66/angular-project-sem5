document.addEventListener("DOMContentLoaded", () => {

  /* CURSOR GLOW */

  const cursorGlow =
    document.querySelector(".cursor-glow");

  window.addEventListener("mousemove", (event) => {

    if (!cursorGlow) return;

    cursorGlow.style.left =
      event.clientX + "px";

    cursorGlow.style.top =
      event.clientY + "px";

  });


  /* SCROLL REVEAL */

  const revealElements =
    document.querySelectorAll(
      ".reveal, .reveal-card"
    );

  const observer =
    new IntersectionObserver(
      (entries) => {

        entries.forEach((entry) => {

          if (entry.isIntersecting) {

            entry.target.classList.add(
              "visible"
            );

            observer.unobserve(
              entry.target
            );

          }

        });

      },
      {
        threshold: 0.12
      }
    );

  revealElements.forEach((element) => {
    observer.observe(element);
  });


  /* MAGNETIC BUTTONS */

  const magneticElements =
    document.querySelectorAll(".magnetic");

  magneticElements.forEach((element) => {

    element.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          element.getBoundingClientRect();

        const x =
          event.clientX -
          rect.left -
          rect.width / 2;

        const y =
          event.clientY -
          rect.top -
          rect.height / 2;

        element.style.transform =
          `translate(${x * 0.1}px, ${y * 0.1}px)`;

      }
    );

    element.addEventListener(
      "mouseleave",
      () => {

        element.style.transform =
          "translate(0, 0)";

      }
    );

  });


  /* HERO CARD TILT */

  const tiltCards =
    document.querySelectorAll(".tilt");

  tiltCards.forEach((card) => {

    card.addEventListener(
      "mousemove",
      (event) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
          rect.width;

        const y =
          (event.clientY - rect.top) /
          rect.height;

        const rotateY =
          (x - 0.5) * 12;

        const rotateX =
          (0.5 - y) * 12;

        card.style.transform =
          `perspective(800px)
           rotateX(${rotateX}deg)
           rotateY(${rotateY}deg)
           scale(1.04)`;

      }
    );

    card.addEventListener(
      "mouseleave",
      () => {

        card.style.transform = "";

      }
    );

  });


  /* ROLE TABS */

  const roleTabs =
    document.querySelectorAll(".role-tab");

  const roleDisplays =
    document.querySelectorAll(".role-display");

  roleTabs.forEach((tab) => {

    tab.addEventListener(
      "click",
      () => {

        const role =
          tab.dataset.role;

        roleTabs.forEach((item) => {
          item.classList.remove("active");
        });

        roleDisplays.forEach((display) => {
          display.classList.remove("active");
        });

        tab.classList.add("active");

        const selectedRole =
          document.querySelector(
            `.${role}-role`
          );

        if (selectedRole) {
          selectedRole.classList.add("active");
        }

      }
    );

  });


  /* FEED CATEGORY BUTTONS */

  const feedButtons =
    document.querySelectorAll(
      ".feed-toolbar button:not(.filter-btn)"
    );

  feedButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        feedButtons.forEach((item) => {
          item.classList.remove("active");
        });

        button.classList.add("active");

      }
    );

  });


  /* SAVE BUTTONS */

  const heartButtons =
    document.querySelectorAll(
      ".heart-btn, .pin-actions button"
    );

  heartButtons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        button.classList.toggle("saved");

        const icon =
          button.querySelector("i");

        if (!icon) return;

        if (
          icon.classList.contains(
            "fa-regular"
          )
        ) {

          icon.classList.remove(
            "fa-regular"
          );

          icon.classList.add(
            "fa-solid"
          );

        }

      }
    );

  });


  /* NAVBAR SCROLL */

  const navbar =
    document.querySelector(".navbar");

  window.addEventListener(
    "scroll",
    () => {

      if (!navbar) return;

      if (window.scrollY > 80) {

        navbar.style.width =
          "min(1200px, 90%)";

        navbar.style.background =
          "rgba(9,9,13,.95)";

      } else {

        navbar.style.width =
          "min(1400px, 94%)";

        navbar.style.background =
          "rgba(12,12,18,.72)";

      }

    }
  );


  /* HOTSPOTS */

  const hotspots =
    document.querySelectorAll(".hotspot");

  const lookItems =
    document.querySelectorAll(".look-item");

  hotspots.forEach((hotspot, index) => {

    hotspot.addEventListener(
      "click",
      () => {

        lookItems.forEach((item) => {
          item.style.background = "transparent";
        });

        if (lookItems[index]) {

          lookItems[index].style.background =
            "rgba(200,255,61,.08)";

          lookItems[index].scrollIntoView({
            behavior: "smooth",
            block: "center"
          });

        }

      }
    );

  });


  /* BACK TO TOP */

  const topLink =
    document.querySelector(
      '.footer-links a[href="#"]'
    );

  if (topLink) {

    topLink.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: "smooth"
        });

      }
    );

  }

});