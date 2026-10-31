// Personaliza los valores iniciales aquí o directamente desde el panel de la página.
const defaults = {
  to: "alguien especial",
  from: "Alguien que se animó a tocar",
  title: "Quería decirte algo",
  body: `Hola.\n\nHay algo que quería decirte desde hace un tiempo, sin hacerlo más grande de lo que es: me gustas. Me gusta pasar tiempo contigo y hay algo en tu forma de ser que hace que mis días tengan un brillo distinto.\n\nQuizá esto sea un poco como encontrar una puertita donde antes solo había una pared. No sé qué hay del otro lado, y tampoco quiero decidirlo por ti; solo quería atreverme a tocar y preguntarte si te gustaría explorar esa posibilidad conmigo.\n\nMe gustaría invitarte a salir, conocernos de una manera un poquito más especial y ver qué pasa, a nuestro ritmo. Y si no sientes lo mismo, de verdad está bien. No cambia el cariño ni el respeto que te tengo. No tienes que responder ahora.`,
  ps: "P. D. Prometo que esta invitación no viene con botones cosidos en los ojos. :)"
};

const fields = {
  to: document.getElementById("toInput"),
  from: document.getElementById("fromInput"),
  title: document.getElementById("titleInput"),
  body: document.getElementById("bodyInput"),
  ps: document.getElementById("psInput")
};
const preview = {
  to: document.getElementById("previewTo"),
  from: document.getElementById("previewFrom"),
  title: document.getElementById("previewTitle"),
  body: document.getElementById("previewBody"),
  ps: document.getElementById("previewPs")
};
const editor = document.getElementById("editor");
const toggleEditor = document.getElementById("toggleEditor");
const saveStatus = document.getElementById("saveStatus");
const STORAGE_KEY = "carta-puerta-pequena-v1";

function readValues() {
  return Object.fromEntries(Object.entries(fields).map(([key, field]) => [key, field.value]));
}

function render(values) {
  preview.to.textContent = values.to.trim() || "alguien especial";
  preview.from.textContent = values.from.trim() || "Alguien que se animó a tocar";
  preview.title.textContent = values.title.trim() || "Quería decirte algo";
  preview.body.textContent = values.body;
  preview.ps.textContent = values.ps;
}

function saveAndRender() {
  const values = readValues();
  render(values);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
    saveStatus.textContent = "Cambios guardados en este navegador.";
  } catch (error) {
    saveStatus.textContent = "Vista previa actualizada. El navegador no permitió guardar.";
  }
}

function loadSavedValues() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === "object") {
      Object.entries(fields).forEach(([key, field]) => {
        if (typeof saved[key] === "string") field.value = saved[key];
      });
    }
  } catch (error) {
    // Si no hay datos guardados o el almacenamiento no está disponible, se usan los valores iniciales.
  }
  render(readValues());
}

Object.values(fields).forEach((field) => field.addEventListener("input", saveAndRender));

// Mostrar u ocultar el panel para editar la carta.
toggleEditor.addEventListener("click", () => {
  const isHidden = editor.hidden;
  editor.hidden = !isHidden;
  toggleEditor.setAttribute("aria-expanded", String(isHidden));
  toggleEditor.textContent = isHidden ? "Cerrar personalización" : "✎ Personalizar carta";
  if (isHidden) editor.scrollIntoView({ behavior: "smooth", block: "nearest" });
});

// Animación de la puerta y desplazamiento hacia la carta.
document.getElementById("openDoor").addEventListener("click", () => {
  document.getElementById("doorScene").classList.toggle("opened");
  document.getElementById("carta").scrollIntoView({ behavior: "smooth", block: "start" });
});

document.getElementById("resetButton").addEventListener("click", () => {
  Object.entries(fields).forEach(([key, field]) => { field.value = defaults[key]; });
  saveAndRender();
  saveStatus.textContent = "Texto original restaurado.";
});

function getLetterText() {
  const values = readValues();
  return `Para ${values.to}:\n\n${values.title}\n\n${values.body}\n\n${values.ps}\n\nCon cariño,\n${values.from}`;
}

document.getElementById("copyButton").addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(getLetterText());
    saveStatus.textContent = "Carta copiada al portapapeles.";
  } catch (error) {
    saveStatus.textContent = "No se pudo copiar automáticamente. Puedes seleccionar el texto de la vista previa.";
  }
});

document.getElementById("downloadButton").addEventListener("click", () => {
  const blob = new Blob([getLetterText()], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "mi-carta-pequena.txt";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  saveStatus.textContent = "Tu carta se descargó como archivo de texto.";
});

loadSavedValues();
