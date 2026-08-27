document.addEventListener("DOMContentLoaded", () => {

  /* ========================================
     CURSOR GLOW
  ======================================== */

  const cursorGlow = document.querySelector(".cursor-glow");

  window.addEventListener("mousemove", (event) => {
    if (!cursorGlow) return;

    cursorGlow.style.left = event.clientX + "px";
    cursorGlow.style.top = event.clientY + "px";
  });


  /* ========================================
     SCROLL REVEAL
  ======================================== */

  const revealElements = document.querySelectorAll(
    ".reveal, .reveal-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {

      entries.forEach((entry) => {

        if (entry.isIntersecting) {

          entry.target.classList.add("visible");

          observer.unobserve(entry.target);
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


  /* ========================================
     MAGNETIC BUTTONS
  ======================================== */

  const magneticElements =
    document.querySelectorAll(".magnetic");

  magneticElements.forEach((element) => {

    element.addEventListener("mousemove", (event) => {

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
        `translate(${x * 0.12}px, ${y * 0.12}px)`;

    });


    element.addEventListener("mouseleave", () => {

      element.style.transform =
        "translate(0, 0)";

    });

  });


  /* ========================================
     3D CARD TILT
  ======================================== */

  const tiltCards =
    document.querySelectorAll(".tilt");

  tiltCards.forEach((card) => {

    card.addEventListener("mousemove", (event) => {

      const rect =
        card.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) /
        rect.width;

      const y =
        (event.clientY - rect.top) /
        rect.height;

      const rotateY =
        (x - 0.5) * 16;

      const rotateX =
        (0.5 - y) * 16;

      card.style.transform =
        `perspective(800px)
         rotateX(${rotateX}deg)
         rotateY(${rotateY}deg)
         scale(1.04)`;

    });


    card.addEventListener("mouseleave", () => {

      card.style.transform = "";

    });

  });


  /* ========================================
     PARALLAX HERO ELEMENTS
  ======================================== */

  const parallaxElements = [
    {
      selector: ".card-1",
      speed: 0.015
    },
    {
      selector: ".card-2",
      speed: -0.012
    },
    {
      selector: ".card-3",
      speed: 0.02
    },
    {
      selector: ".sticker-1",
      speed: 0.025
    },
    {
      selector: ".sticker-2",
      speed: -0.02
    }
  ];


  window.addEventListener("mousemove", (event) => {

    const centerX =
      window.innerWidth / 2;

    const centerY =
      window.innerHeight / 2;

    const x =
      event.clientX - centerX;

    const y =
      event.clientY - centerY;


    parallaxElements.forEach((item) => {

      const element =
        document.querySelector(item.selector);

      if (!element) return;

      element.style.marginLeft =
        `${x * item.speed}px`;

      element.style.marginTop =
        `${y * item.speed}px`;

    });

  });


  /* ========================================
     SMOOTH CARD HOVER EFFECT
  ======================================== */

  const experienceCards =
    document.querySelectorAll(".experience-card");

  experienceCards.forEach((card) => {

    card.addEventListener("mouseenter", () => {

      experienceCards.forEach((otherCard) => {

        if (otherCard !== card) {
          otherCard.style.opacity = "0.65";
        }

      });

    });


    card.addEventListener("mouseleave", () => {

      experienceCards.forEach((otherCard) => {
        otherCard.style.opacity = "1";
      });

    });

  });


  /* ========================================
     SCROLL NAVBAR EFFECT
  ======================================== */

  const navbar =
    document.querySelector(".navbar");

  window.addEventListener("scroll", () => {

    if (!navbar) return;

    if (window.scrollY > 80) {

      navbar.style.width =
        "min(1200px, 90%)";

      navbar.style.background =
        "rgba(10, 10, 14, 0.92)";

    } else {

      navbar.style.width =
        "min(1400px, 94%)";

      navbar.style.background =
        "rgba(14, 14, 19, 0.7)";

    }

  });


  /* ========================================
     RANDOM FLOATING SYMBOLS
  ======================================== */

  const symbols = ["✦", "✺", "●", "✳"];

  const darkCard =
    document.querySelector(".dark-card");

  if (darkCard) {

    setInterval(() => {

      const symbol =
        document.createElement("span");

      symbol.textContent =
        symbols[
          Math.floor(
            Math.random() * symbols.length
          )
        ];

      symbol.style.position =
        "absolute";

      symbol.style.left =
        Math.random() * 90 + "%";

      symbol.style.top =
        Math.random() * 80 + "%";

      symbol.style.fontSize =
        Math.random() * 20 + 10 + "px";

      symbol.style.color =
        "rgba(200,255,61,.4)";

      symbol.style.pointerEvents =
        "none";

      symbol.style.transition =
        "all 1.5s ease";

      darkCard.appendChild(symbol);


      requestAnimationFrame(() => {

        symbol.style.transform =
          "translateY(-30px) rotate(90deg)";

        symbol.style.opacity = "0";

      });


      setTimeout(() => {
        symbol.remove();
      }, 1500);

    }, 1200);

  }


  /* ========================================
     BACK TO TOP
  ======================================== */

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


  /* ========================================
     REDUCED MOTION
  ======================================== */

  if (
    window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
  ) {

    document
      .querySelectorAll(
        ".reveal, .reveal-card"
      )
      .forEach((element) => {

        element.classList.add("visible");

      });

  }

});