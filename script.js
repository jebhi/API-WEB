const chatEl = document.getElementById("chat");
const inputForm = document.getElementById("inputForm");
const messageInput = document.getElementById("messageInput");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const apiUrlInput = document.getElementById("apiUrl");
const apiKeyInput = document.getElementById("apiKey");
const saveSettingsBtn = document.getElementById("saveSettings");
const providerSelect = document.getElementById("provider");
const modelSelect = document.getElementById("model");
const customModelInput = document.getElementById("customModel");
const apiUrlLabel = document.getElementById("apiUrlLabel");

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
  const provider = localStorage.getItem("provider") || "openai";
  providerSelect.value = provider;
  updateApiUrlVisibility();
  apiUrlInput.value =
    localStorage.getItem("apiUrl") ||
    "https://api.openai.com/v1/chat/completions";
  apiKeyInput.value = localStorage.getItem("apiKey") || "";
  const model = localStorage.getItem("model") || "gpt-3.5-turbo";
  if ([...modelSelect.options].some((o) => o.value === model)) {
    modelSelect.value = model;
    customModelInput.value = "";
    updateModelInput();
  } else {
    modelSelect.value = "custom";
    customModelInput.value = model;
    updateModelInput();
  }
}

function saveSettings() {
  localStorage.setItem("provider", providerSelect.value);
  localStorage.setItem("apiUrl", apiUrlInput.value);
  localStorage.setItem("apiKey", apiKeyInput.value);
  const model =
    modelSelect.value === "custom" ? customModelInput.value : modelSelect.value;
  localStorage.setItem("model", model);
  settingsModal.classList.add("hidden");
}

function updateApiUrlVisibility() {
  if (providerSelect.value === "openai") {
    apiUrlLabel.classList.add("hidden");
  } else {
    apiUrlLabel.classList.remove("hidden");
  }
}

function updateModelInput() {
  if (modelSelect.value === "custom") {
    customModelInput.classList.remove("hidden");
  } else {
    customModelInput.classList.add("hidden");
  }
}

providerSelect.addEventListener("change", updateApiUrlVisibility);
modelSelect.addEventListener("change", updateModelInput);

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

  const provider = localStorage.getItem("provider") || "openai";
  const apiUrl =
    provider === "openai"
      ? "https://api.openai.com/v1/chat/completions"
      : localStorage.getItem("apiUrl");
  const apiKey = localStorage.getItem("apiKey");
  const model = localStorage.getItem("model") || "gpt-3.5-turbo";

  try {
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
      }),
    });
    const data = await res.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || "无响应";
    appendMessage("ai", reply);
    messages.push({ role: "assistant", content: reply });
  } catch (err) {
    appendMessage("ai", "错误: " + err.message);
  }
});

loadSettings();
