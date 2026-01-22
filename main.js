const terminalBody = document.getElementById("terminal-body")
const panels = Array.from(document.querySelectorAll(".panel"))
const navLinks = Array.from(document.querySelectorAll(".nav-link"))
const toggleThemeBtn = document.querySelector(".toggle-theme")
const contactForm = document.getElementById("contact-form")
const sendBtn = document.getElementById("send-btn")
const formStatus = document.getElementById("form-status")
const ctaContact = document.getElementById("cta-contact")
const ctaResume = document.getElementById("cta-resume")
const ctaGithub = document.getElementById("cta-github")
const ctaCopyEmail = document.getElementById("cta-copy-email")
const printResumeBtn = document.getElementById("print-resume")

function setActive(id) {
  panels.forEach(p => p.classList.toggle("active", p.id === id))
  navLinks.forEach(n => {
    const active = n.dataset.section === id
    n.setAttribute("aria-current", active ? "page" : "false")
  })
}

function writeLine(text, delay = 0) {
  return new Promise(resolve => {
    const line = document.createElement("div")
    line.className = "line"
    const prompt = document.createElement("span")
    prompt.className = "prompt"
    prompt.textContent = "user@linux:~$"
    const content = document.createElement("span")
    content.textContent = ""
    line.appendChild(prompt)
    line.appendChild(content)
    terminalBody.appendChild(line)
    let i = 0
    function tick() {
      if (i <= text.length) {
        content.textContent = text.slice(0, i)
        i += 1
        setTimeout(tick, 12)
      } else {
        resolve()
      }
    }
    setTimeout(tick, delay)
  })
}

async function boot() {
  terminalBody.innerHTML = ""
  await writeLine("login: user")
  await writeLine("host: linux")
  await writeLine("welcome to 2026 professional portfolio")
  await writeLine("type: about | skills | projects | contact")
}

function handleNav(e) {
  const id = e.currentTarget.dataset.section
  location.hash = id
  setActive(id)
  const cmd = `open ${id}`
  writeLine(cmd)
}

function initNav() {
  navLinks.forEach(b => b.addEventListener("click", handleNav))
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "") || "about"
    setActive(id)
    writeLine(`open ${id}`)
  })
}

function initTheme() {
  const saved = localStorage.getItem("theme")
  if (saved === "light") document.documentElement.classList.add("light")
  toggleThemeBtn.addEventListener("click", () => {
    document.documentElement.classList.toggle("light")
    const mode = document.documentElement.classList.contains("light") ? "light" : "dark"
    localStorage.setItem("theme", mode)
  })
}

function init() {
  initNav()
  initTheme()
  const initial = location.hash.replace("#", "") || "about"
  setActive(initial)
  boot()
  initContact()
  initCtas()
}

document.addEventListener("DOMContentLoaded", init)

function validateEmail(v) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
}

function initContact() {
  if (!contactForm) return
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault()
    const data = new FormData(contactForm)
    const name = String(data.get("name") || "").trim()
    const email = String(data.get("email") || "").trim()
    const message = String(data.get("message") || "").trim()
    const website = String(data.get("website") || "").trim()
    if (website) {
      formStatus.textContent = "failed to send, try again later"
      return
    }
    if (!name || !email || !message || !validateEmail(email)) {
      formStatus.textContent = "please fill all fields with a valid email"
      return
    }
    sendBtn.disabled = true
    formStatus.textContent = "sending..."
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message })
      })
      if (!res.ok) throw new Error("request failed")
      formStatus.textContent = "sent successfully"
      contactForm.reset()
      sendBtn.disabled = true
    } catch (err) {
      formStatus.textContent = "failed to send, try again later"
    } finally {
      setTimeout(() => { sendBtn.disabled = false }, 2000)
    }
  })
}

function initCtas() {
  if (ctaContact) ctaContact.addEventListener("click", () => {
    location.hash = "contact"
    setActive("contact")
    writeLine("open contact")
  })
  if (ctaResume) ctaResume.addEventListener("click", () => {
    location.hash = "resume"
    setActive("resume")
    writeLine("generate resume")
    window.print()
  })
  if (ctaCopyEmail) ctaCopyEmail.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("ramgawas55@gmail.com")
      writeLine("copied email")
    } catch (e) {
      writeLine("copy failed")
    }
  })
  if (printResumeBtn) printResumeBtn.addEventListener("click", () => {
    window.print()
  })
}
