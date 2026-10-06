import { useState, useEffect } from "react";
import "./App.css";

// ====== CHANGE THIS to the Gmail address that should receive messages ======
const RECEIVER_EMAIL = "junzfundador142@gmail.com";
// ===========================================================================

// Optional: put a photo URL here (e.g. "/team.jpg" from your public folder).
// Leave it empty to show the chat-bubble illustration instead.
const HERO_IMAGE = "";

const TYPES = [
  { title: "Verbal", text: "Name-calling, teasing, insults, and threats." },
  { title: "Physical", text: "Hitting, pushing, or taking and breaking someone's things." },
  { title: "Social", text: "Leaving people out, spreading rumors, or turning friends against someone." },
  { title: "Cyberbullying", text: "Mean messages, embarrassing posts or photos, and fake accounts." },
];

const ROLES = [
  {
    title: "If it's happening to you",
    tips: [
      "It is not your fault. You did nothing to deserve it.",
      "Tell a teacher, guidance counselor, or parent you trust.",
      "Keep screenshots or notes of what happened and when.",
      "Stay near friends and safe adults.",
    ],
  },
  {
    title: "If you see it happen",
    tips: [
      "Don't laugh, cheer, or share the post.",
      "Check in with the person afterward and be kind.",
      "Tell an adult. Reporting is not \"snitching.\"",
      "Invite them to sit with you.",
    ],
  },
  {
    title: "If you've been the bully",
    tips: [
      "Stop, and think about how the other person feels.",
      "Apologize and mean it.",
      "Talk to someone about why it happened.",
      "You can change. Start today.",
    ],
  },
];

function Header({ theme, onToggle }) {
  const isDark = theme === "dark";
  return (
    <header className="topbar">
      <div className="wrap">
        <a className="logo" href="#top">Speak Up</a>
        <nav aria-label="Main">
          <a href="#top">About</a>
          <a href="#what">Bullying</a>
          <a href="#help">What to do</a>
          <a href="#message">Contact</a>
          <button type="button" className="theme-btn" onClick={onToggle} aria-pressed={isDark}>
            {isDark ? "Light theme" : "Dark theme"}
          </button>
        </nav>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="wrap">
        <div className="hero-text">
          <h1>Hello</h1>
          <h2 className="name">We are Speak Up</h2>
          <p className="role">Student anti-bullying team</p>
          <p>
            Bullying is never okay, and nobody has to face it alone. This is a place to learn how to
            spot it, how to stop it, and how to tell someone who can help.
          </p>
          <p>
            Have something on your mind? You can send us a message at any time, and you can stay
            anonymous.
          </p>
          <div className="actions">
            <a className="btn" href="#message">Send a message</a>
            <a className="btn ghost" href="#help">What you can do</a>
          </div>
        </div>

        <div className="portrait">
          {HERO_IMAGE ? (
            <img src={HERO_IMAGE} alt="Our anti-bullying team" />
          ) : (
            <div className="bubbles" aria-hidden="true">
              <div className="bubble them">Nobody wants to sit with you.</div>
              <div className="bubble you">That really hurt.</div>
              <div className="bubble kind">Sit with us. You're not alone.</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function WhatIsBullying() {
  return (
    <section id="what" className="block">
      <div className="wrap">
        <div className="section-head">
          <h2>What counts as bullying?</h2>
          <p>
            Bullying is when someone hurts, scares, or leaves out another person again and again, on
            purpose. It can happen at school, online, or anywhere.
          </p>
        </div>
        <ul className="rows">
          {TYPES.map((t) => (
            <li key={t.title} className="row">
              <h3>{t.title}</h3>
              <p>{t.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function WhatToDo() {
  return (
    <section id="help" className="block roles">
      <div className="wrap">
        <div className="section-head">
          <h2>What you can do</h2>
          <p>
            Everyone has a part to play, whether you are being bullied, you see it happen, or you
            are the one who has been hurting others.
          </p>
        </div>
        <div className="cols">
          {ROLES.map((r) => (
            <div key={r.title}>
              <h3>{r.title}</h3>
              <ul>
                {r.tips.map((tip) => (
                  <li key={tip}>{tip}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="note law">
          In the Philippines, the Anti-Bullying Act of 2013 (Republic Act 10627) requires schools to
          have policies that protect students and respond to bullying reports.
        </p>
      </div>
    </section>
  );
}

function MessageForm() {
  const [anonymous, setAnonymous] = useState(false);
  const [name, setName] = useState("");
  const [grade, setGrade] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState("");
  const [sending, setSending] = useState(false);
  const [status, setStatus] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!message.trim()) {
      setStatus("Please write a message before sending.");
      return;
    }
    if (honey) return; // bot trap

    setSending(true);
    try {
      const res = await fetch(
        "https://formsubmit.co/ajax/" + encodeURIComponent(RECEIVER_EMAIL),
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            message: message.trim(),
            name: anonymous ? "Anonymous" : name.trim() || "Not given",
            grade_and_section: grade.trim() || "Not given",
            _subject: "New message from the Speak Up website",
            _captcha: "false",
            _template: "table",
          }),
        }
      );
      const result = await res.json();
      if (res.ok && (result.success === true || result.success === "true")) {
        setName("");
        setGrade("");
        setMessage("");
        setAnonymous(false);
        setStatus("Message sent. Thank you for speaking up.");
      } else {
        throw new Error(result.message || "Send failed");
      }
    } catch (err) {
      setStatus("Message not sent: " + err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <section id="message" className="block contact">
      <div className="wrap">
        <div>
          <h2>Send us a message</h2>
          <p>
            Ask a question, report a problem, or just tell us how you feel. You can stay anonymous.
            A real person will read it.
          </p>
          <div className="urgent">
            <strong>In danger right now?</strong> Please tell a teacher or an adult near you
            immediately, or call your local emergency number. This form is not checked instantly.
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <div className="hp" aria-hidden="true">
            <label htmlFor="honey">Leave this empty</label>
            <input
              type="text"
              id="honey"
              tabIndex={-1}
              autoComplete="off"
              value={honey}
              onChange={(e) => setHoney(e.target.value)}
            />
          </div>

          <div className="check">
            <input
              type="checkbox"
              id="anon"
              checked={anonymous}
              onChange={(e) => {
                setAnonymous(e.target.checked);
                if (e.target.checked) setName("");
              }}
            />
            <label htmlFor="anon">Send this anonymously</label>
          </div>

          {!anonymous && (
            <div className="field">
              <label htmlFor="name">Your name (optional)</label>
              <input
                type="text"
                id="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="field">
            <label htmlFor="grade">Grade and section (optional)</label>
            <input type="text" id="grade" value={grade} onChange={(e) => setGrade(e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="msg">Your message</label>
            <textarea id="msg" required value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <button className="btn" type="submit" disabled={sending}>
            {sending ? "Sending…" : "Send message"}
          </button>
          <p id="status" role="status" aria-live="polite">{status}</p>
          <p className="note">Your message goes to our school anti-bullying team.</p>
        </form>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer>
      <div className="wrap">
        <p className="foot-line">Be kind. Speak up. Look out for each other.</p>
        <nav aria-label="Footer">
          <a href="#top">About</a>
          <a href="#what">Bullying</a>
          <a href="#help">What to do</a>
          <a href="#message">Contact</a>
        </nav>
        <p className="note">© 2026 Speak Up</p>
      </div>
    </footer>
  );
}

function FloatingMessageButton() {
  const [hidden, setHidden] = useState(false);

  // Hide the button while the message form is already on screen
  useEffect(() => {
    const target = document.getElementById("message");
    if (!target || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { threshold: 0.25 }
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  function goToForm(e) {
    e.preventDefault();
    const target = document.getElementById("message");
    if (!target) return;
    target.scrollIntoView();
    setTimeout(() => {
      const box = document.getElementById("msg");
      if (box) box.focus({ preventScroll: true });
    }, 700);
  }

  return (
    <a
      href="#message"
      className={"fab" + (hidden ? " hide" : "")}
      onClick={goToForm}
      tabIndex={hidden ? -1 : 0}
      aria-hidden={hidden}
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 3.5V17H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
      Send us a message
    </a>
  );
}

function getInitialTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch {}
  return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export default function App() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    let m = document.querySelector('meta[name="viewport"]');
    if (!m) {
      m = document.createElement("meta");
      m.name = "viewport";
      document.head.appendChild(m);
    }
    m.content = "width=device-width, initial-scale=1, minimum-scale=1";
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem("theme", theme);
    } catch {}
  }, [theme]);

  return (
    <>
      <Header theme={theme} onToggle={() => setTheme(theme === "dark" ? "light" : "dark")} />
      <main id="top">
        <Hero />
        <WhatIsBullying />
        <WhatToDo />
        <MessageForm />
      </main>
      <Footer />
      <FloatingMessageButton />
    </>
  );
}