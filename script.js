
document.addEventListener("DOMContentLoaded", function () {
  const html = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const navbar = document.getElementById("navbar");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // 1. THÈME JOUR / NUIT
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem("portfolio-theme");
  } catch (error) {
    // Le site continue même si le stockage est indisponible.
  }

  const initialTheme =
    savedTheme === "day" || savedTheme === "night"
      ? savedTheme
      : "night";

  setTheme(initialTheme);

  function setTheme(theme) {
    html.dataset.theme = theme;

    if (themeToggle) {
      themeToggle.textContent =
        theme === "night" ?   "🌙 Nuit" : "☀️ Jour";

      themeToggle.setAttribute(
        "aria-label",
        theme === "night"
          ? "Activer le thème jour"
          : "Activer le thème nuit"
      );
    }

    const metaTheme = document.querySelector(
      'meta[name="theme-color"]'
    );

    if (metaTheme) {
      metaTheme.content =
        theme === "night" ? "#041226" : "#e8edf3";
    }
  }

  themeToggle.addEventListener("click", function () {
    const nextTheme =
      html.dataset.theme === "night" ? "day" : "night";

    setTheme(nextTheme);

    try {
      localStorage.setItem("portfolio-theme", nextTheme);
    } catch (error) {
      // Le changement visuel fonctionne même sans stockage.
    }
  });

  // 2. MENU MOBILE
  function closeMenu() {
    navbar.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  }

  menuToggle.addEventListener("click", function () {
    const isOpen = navbar.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  navbar.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("click", function (event) {
    if (
      !navbar.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });

  window.addEventListener("resize", function () {
    if (window.innerWidth > 700) {
      closeMenu();
    }
  });

  // 3. ANIMATIONS AU DÉFILEMENT
  const revealElements = document.querySelectorAll(".reveal");

  if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    revealElements.forEach(function (element) {
      revealObserver.observe(element);
    });
  } else {
    revealElements.forEach(function (element) {
      element.classList.add("visible");
    });
  }

  // 4. LIEN ACTIF DANS LE MENU
  const navLinks = navbar.querySelectorAll("a");
  const sections = document.querySelectorAll("main section[id]");

  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;

          navLinks.forEach(function (link) {
            const active =
              link.getAttribute("href") ===
              "#" + entry.target.id;

            link.classList.toggle("active", active);

            if (active) {
              link.setAttribute("aria-current", "page");
            } else {
              link.removeAttribute("aria-current");
            }
          });
        });
      },
      { rootMargin: "-35% 0px -55% 0px" }
    );

    sections.forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // 5. ANNÉE AUTOMATIQUE
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // 6. VALIDATION DU FORMULAIRE DE CONTACT
  // Pour envoyer réellement un email, il faut un backend PHP
  // ou un service de formulaire externe.
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      return;
    }

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();

    formMessage.textContent =
      "Merci " + name +
      " ! Le formulaire est valide, mais l'envoi réel nécessite un serveur.";

    contactForm.reset();
  });
});
