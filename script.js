const header = document.getElementById("header");

if (header) {
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });
}

const phrases = [
  "Сайты, которые приносят прибыль",
  "Сначала результат — потом оплата",
  "От идеи до заявок под ключ"
];

const typingText = document.getElementById("typing-text");

if (typingText) {
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function typeEffect() {
    const currentPhrase = phrases[phraseIndex];

    if (!isDeleting) {
      typingText.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentPhrase.length) {
        isDeleting = true;
        setTimeout(typeEffect, 1500);
        return;
      }
    } else {
      typingText.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
      }
    }

    const speed = isDeleting ? 38 : 72;
    setTimeout(typeEffect, speed);
  }

  typeEffect();
}

const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  },
  {
    threshold: 0.14
  }
);

revealElements.forEach((element) => {
  revealObserver.observe(element);
});
const burgerBtn = document.getElementById("burgerBtn");
const navMenu = document.getElementById("navMenu");

if (burgerBtn && navMenu) {
  burgerBtn.addEventListener("click", () => {
    navMenu.classList.toggle("open");
  });
}

// ── TELEGRAM FORM HANDLER ───────────────────────────────────

const TG_TOKEN = "8938773084:AAGEif-h5kVf4FfBoktotY-M0e3_DHpX3D8";
const TG_CHAT  = "1086655007";

function sendToTelegram(fields) {
  const text =
    "🔔 Новая заявка — AVANTRAS\n\n" +
    "👤 Имя: "      + (fields.name    || "—") + "\n" +
    "📞 Телефон: "  + (fields.phone   || "—") + "\n" +
    (fields.message ? "💬 Сообщение: " + fields.message + "\n" : "") +
    "📄 Страница: " + document.title;

  return fetch("https://api.telegram.org/bot" + TG_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: TG_CHAT, text })
  }).then(r => r.ok).catch(() => false);
}

function bindForm(id, mini) {
  const form = document.getElementById(id);
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn  = form.querySelector("[type='submit']");
    const orig = btn.textContent;
    btn.textContent = "Отправляем...";
    btn.disabled = true;

    const ok = await sendToTelegram({
      name:    form.querySelector("[name='name']")?.value,
      phone:   form.querySelector("[name='phone']")?.value,
      message: form.querySelector("[name='message']")?.value
    });

    if (ok) {
      if (mini) {
        form.innerHTML = '<div class="nav-mini-success">✓ Перезвоним вам!</div>';
      } else {
        form.innerHTML = `
          <div class="form-success">
            <div class="form-success-icon">✓</div>
            <h3>Заявка отправлена!</h3>
            <p>Свяжемся с вами в течение часа</p>
          </div>`;
      }
    } else {
      btn.textContent = orig;
      btn.disabled = false;
      alert("Не удалось отправить заявку. Позвоните: +7 913 005-94-87");
    }
  });
}

bindForm("contactForm");
bindForm("feedbackForm");
bindForm("navMiniForm", true);

// ── FAQ ACCORDION ───────────────────────────────────────────
document.querySelectorAll(".faq-q").forEach((btn) => {
  btn.addEventListener("click", () => {
    const item = btn.closest(".faq-item");
    const isOpen = item.classList.contains("open");

    document.querySelectorAll(".faq-item.open").forEach((el) => el.classList.remove("open"));

    if (!isOpen) item.classList.add("open");
  });
});