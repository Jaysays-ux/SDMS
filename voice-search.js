/* ==========================================================================
   SRI DURGA MEDICAL & GENERAL STORES - VOICE SEARCH (voice-search.js)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  initVoiceSearch();
});

function initVoiceSearch() {
  const voiceBtn = document.getElementById("btn-voice-search");
  const searchInput = document.getElementById("catalog-search");

  if (!voiceBtn || !searchInput) return; // Exit if elements are missing

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    // Hide microphone button if browser doesn't support Web Speech API
    voiceBtn.style.display = "none";
    console.warn("Speech Recognition API is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-IN"; // Set dialect (Indian English/Local search)
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  let isRecording = false;

  voiceBtn.addEventListener("click", () => {
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
    }
  });

  recognition.onstart = () => {
    isRecording = true;
    voiceBtn.style.backgroundColor = "var(--danger)";
    voiceBtn.style.color = "var(--white)";
    voiceBtn.style.animation = "pulseBorder 1.5s infinite";
    const icon = voiceBtn.querySelector("i");
    if (icon) icon.className = "fas fa-microphone-slash";
    showToast("Listening... speak your medicine name", "warning");
  };

  recognition.onend = () => {
    isRecording = false;
    voiceBtn.style.backgroundColor = "";
    voiceBtn.style.color = "";
    voiceBtn.style.animation = "none";
    const icon = voiceBtn.querySelector("i");
    if (icon) icon.className = "fas fa-microphone";
  };

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    searchInput.value = speechResult;
    searchInput.dispatchEvent(new Event("input")); // Trigger live search query filter
    showToast(`Searching for: "${speechResult}"`);
  };

  recognition.onerror = (event) => {
    console.error("Speech Recognition Error:", event.error);
    if (event.error === "not-allowed") {
      showToast("Microphone access blocked. Enable permissions in your browser.", "error");
    } else {
      showToast("Could not recognize your voice. Please try again.", "error");
    }
  };
}
