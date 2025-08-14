const chatEl = document.getElementById("chat");
const inputForm = document.getElementById("inputForm");
const messageInput = document.getElementById("messageInput");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const apiUrlInput = document.getElementById("apiUrl");
const apiKeyInput = document.getElementById("apiKey");
const saveSettingsBtn = document.getElementById("saveSettings");

let messages = [];

function appendMessage(role, content) {
  const messageEl = document.createElement("div");
  messageEl.className = `message ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;
  messageEl.appendChild(bubble);
  chatEl.appendChild(messageEl);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function loadSettings() {
  apiUrlInput.value =
    localStorage.getItem("apiUrl") ||
    "https://api.openai.com/v1/chat/completions";
  apiKeyInput.value = localStorage.getItem("apiKey") || "";
}

function saveSettings() {
  localStorage.setItem("apiUrl", apiUrlInput.value);
  localStorage.setItem("apiKey", apiKeyInput.value);
  settingsModal.classList.add("hidden");
}

settingsBtn.addEventListener("click", () => {
  loadSettings();
  settingsModal.classList.remove("hidden");
});

saveSettingsBtn.addEventListener("click", saveSettings);

settingsModal.addEventListener("click", (e) => {
  if (e.target === settingsModal) settingsModal.classList.add("hidden");
});

inputForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const content = messageInput.value.trim();
  if (!content) return;
  appendMessage("user", content);
  messages.push({ role: "user", content });
  messageInput.value = "";

  const apiUrl = localStorage.getItem("apiUrl");
  const apiKey = localStorage.getItem("apiKey");

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages,
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "No response";
    appendMessage("ai", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    appendMessage("ai", "Error: " + err.message);
  }
});

loadSettings();
