const chatEl = document.getElementById("chat");
const inputForm = document.getElementById("inputForm");
const messageInput = document.getElementById("messageInput");
const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");
const apiUrlInput = document.getElementById("apiUrl");
const apiKeyInput = document.getElementById("apiKey");
const saveSettingsBtn = document.getElementById("saveSettings");
const providerSelect = document.getElementById("provider");
const modelSelect = document.getElementById("modelSelect");
const customModelInput = document.getElementById("customModel");

const providers = {
  openai: {
    url: "https://api.openai.com/v1/chat/completions",
    models: ["gpt-3.5-turbo", "gpt-4o"],
  },
  anthropic: {
    url: "https://api.anthropic.com/v1/messages",
    models: ["claude-3-haiku", "claude-3-sonnet"],
  },
  custom: {
    url: "",
    models: [],
  },
};

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

function populateModels(provider) {
  modelSelect.innerHTML = "";
  const models = providers[provider].models;
  models.forEach((m) => {
    const opt = document.createElement("option");
    opt.value = m;
    opt.textContent = m;
    modelSelect.appendChild(opt);
  });
  const customOpt = document.createElement("option");
  customOpt.value = "custom";
  customOpt.textContent = "自定义模型";
  modelSelect.appendChild(customOpt);
}

function toggleCustomModelInput() {
  if (modelSelect.value === "custom") {
    customModelInput.classList.remove("hidden");
  } else {
    customModelInput.classList.add("hidden");
  }
}

function loadSettings() {
  const provider = localStorage.getItem("provider") || "openai";
  providerSelect.value = provider;
  populateModels(provider);
  apiUrlInput.value = localStorage.getItem("apiUrl") || providers[provider].url;
  apiKeyInput.value = localStorage.getItem("apiKey") || "";
  const model =
    localStorage.getItem("model") || providers[provider].models[0] || "";
  if (providers[provider].models.includes(model)) {
    modelSelect.value = model;
  } else {
    modelSelect.value = "custom";
    customModelInput.value = model;
  }
  toggleCustomModelInput();
}

function saveSettings() {
  localStorage.setItem("provider", providerSelect.value);
  localStorage.setItem("apiUrl", apiUrlInput.value);
  localStorage.setItem("apiKey", apiKeyInput.value);
  localStorage.setItem("model", getSelectedModel());
  settingsModal.classList.add("hidden");
}

settingsBtn.addEventListener("click", () => {
  loadSettings();
  settingsModal.classList.remove("hidden");
});

saveSettingsBtn.addEventListener("click", saveSettings);

providerSelect.addEventListener("change", () => {
  const provider = providerSelect.value;
  apiUrlInput.placeholder = providers[provider].url;
  if (provider !== "custom") {
    apiUrlInput.value = providers[provider].url;
  }
  populateModels(provider);
  modelSelect.value = providers[provider].models[0] || "custom";
  if (modelSelect.value === "custom") {
    customModelInput.value = localStorage.getItem("model") || "";
  }
  toggleCustomModelInput();
});

function getSelectedModel() {
  return modelSelect.value === "custom"
    ? customModelInput.value.trim()
    : modelSelect.value;
}

modelSelect.addEventListener("change", () => {
  toggleCustomModelInput();
  localStorage.setItem("model", getSelectedModel());
});

customModelInput.addEventListener("change", () => {
  localStorage.setItem("model", getSelectedModel());
});

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
  const model = localStorage.getItem("model") || getSelectedModel();

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
