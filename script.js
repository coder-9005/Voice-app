
let sections = JSON.parse(localStorage.getItem('sections')) || [];

function saveSections() {
  localStorage.setItem('sections', JSON.stringify(sections));
}

function startMainRecording() {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
    console.error("webkitSpeechRecognition not supported.");
    return;
  }

  try {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
      const title = event.results[0][0].transcript;
      const section = { title, notes: [] };
      sections.push(section);
      saveSections();
      renderSections();
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error:", event.error);
      alert("Speech recognition error: " + event.error);
    };
  } catch (err) {
    console.error("Exception during startMainRecording:", err);
    alert("Exception: " + err.message);
  }
}

function startNoteRecording(index) {
  if (!('webkitSpeechRecognition' in window)) {
    alert("Your browser does not support Speech Recognition. Please use Google Chrome.");
    console.error("webkitSpeechRecognition not supported.");
    return;
  }

  try {
    const recognition = new webkitSpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.start();

    recognition.onresult = function(event) {
      const noteText = event.results[0][0].transcript;
      sections[index].notes.push(noteText);
      saveSections();
      renderSections();
    };

    recognition.onerror = function(event) {
      console.error("Speech recognition error while recording note:", event.error);
      alert("Note recording error: " + event.error);
    };
  } catch (err) {
    console.error("Exception during note recording:", err);
    alert("Exception: " + err.message);
  }
}

function deleteNote(sectionIndex, noteIndex) {
  sections[sectionIndex].notes.splice(noteIndex, 1);
  saveSections();
  renderSections();
}

function renderSections() {
  const content = document.getElementById('content');
  content.innerHTML = '';

  sections.forEach((section, sectionIndex) => {
    const card = document.createElement('div');
    card.className = 'card';

    const heading = document.createElement('h3');
    heading.textContent = section.title;

    const addNoteBtn = document.createElement('button');
    addNoteBtn.className = 'add-btn';
    addNoteBtn.textContent = '+ Add Note';
    addNoteBtn.onclick = () => startNoteRecording(sectionIndex);

    card.appendChild(heading);
    card.appendChild(addNoteBtn);

    section.notes.forEach((noteText, noteIndex) => {
      const note = document.createElement('div');
      note.className = 'note';
      note.textContent = noteText;

      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-note';
      deleteBtn.textContent = '×';
      deleteBtn.onclick = () => deleteNote(sectionIndex, noteIndex);

      note.appendChild(deleteBtn);
      card.appendChild(note);
    });

    content.appendChild(card);
  });
}

try {
  renderSections();
} catch (err) {
  console.error("Render error:", err);
  alert("Render error: " + err.message);
}
