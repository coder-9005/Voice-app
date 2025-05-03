
document.addEventListener("DOMContentLoaded", () => {
  const addButton = document.getElementById("addSectionBtn");
  const sectionsContainer = document.getElementById("sectionsContainer");

  function saveToStorage() {
    localStorage.setItem("voiceNotesData", sectionsContainer.innerHTML);
  }

  function loadFromStorage() {
    const data = localStorage.getItem("voiceNotesData");
    if (data) sectionsContainer.innerHTML = data;
  }

  function addDeleteFunctionality() {
    document.querySelectorAll(".delete-text").forEach(btn => {
      btn.onclick = () => {
        btn.parentElement.remove();
        saveToStorage();
      };
    });

    document.querySelectorAll(".delete-section").forEach(btn => {
      btn.parentElement.remove();
      saveToStorage();
    });
  }

  addButton.addEventListener("click", () => {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.onresult = (event) => {
      const sectionName = event.results[0][0].transcript;

      const section = document.createElement("div");
      section.className = "section";

      const title = document.createElement("h2");
      title.className = "section-title";
      title.textContent = sectionName;

      const deleteSectionBtn = document.createElement("span");
      deleteSectionBtn.textContent = "×";
      deleteSectionBtn.className = "delete-section";
      title.appendChild(deleteSectionBtn);

      const addTextBtn = document.createElement("button");
      addTextBtn.textContent = "Add";
      addTextBtn.className = "add-text-btn";

      const content = document.createElement("div");
      content.className = "section-content";

      section.appendChild(title);
      section.appendChild(addTextBtn);
      section.appendChild(content);

      sectionsContainer.appendChild(section);
      saveToStorage();

      addTextBtn.addEventListener("click", () => {
        const rec = new webkitSpeechRecognition() || new SpeechRecognition();
        rec.lang = "en-US";
        rec.onresult = (e) => {
          const text = e.results[0][0].transcript;
          const p = document.createElement("p");
          p.textContent = text;

          const del = document.createElement("span");
          del.textContent = "×";
          del.className = "delete-text";
          p.appendChild(del);

          content.appendChild(p);
          saveToStorage();
          addDeleteFunctionality();
        };
        rec.start();
      });

      addDeleteFunctionality();
    };
    recognition.start();
  });

  loadFromStorage();
  addDeleteFunctionality();
});
