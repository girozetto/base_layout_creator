import { WIDGET_TYPES, createWidgetButtons } from "./widget-registry.js";
import { loadLayout, saveLayout, getNextWidgetId } from "./layout-storage.js";
import {
  initGridStack,
  addWidget,
  loadWidgetsFromLayout,
  clearGrid,
  setWidgetCounter,
} from "./grid-manager.js";

// Current layout state
let currentLayout = [];

// Render layout in view mode
function renderViewMode(layoutData) {
  const viewGrid = document.getElementById("viewModeGrid");

  // Clear current grid
  viewGrid.innerHTML = "";

  // Render each widget
  layoutData.forEach((item) => {
    const widgetType = item.widgetType;
    const widgetConfig = WIDGET_TYPES[widgetType];

    if (!widgetConfig) return;

    // Create widget element
    const widgetElement = document.createElement("div");
    widgetElement.className = "dashboard-item";
    widgetElement.style.gridColumn = `${item.x + 1} / span ${item.w}`;
    widgetElement.style.gridRow = `${item.y + 1} / span ${item.h}`;

    // Create header
    const widgetHeader = document.createElement("div");
    widgetHeader.className = "widget-header";

    const widgetTitle = document.createElement("h6");
    widgetTitle.className = "widget-title";
    widgetTitle.textContent = widgetConfig.title;

    widgetHeader.appendChild(widgetTitle);

    // Create Lit component
    const litComponent = document.createElement(widgetConfig.tagName);

    // Assemble widget structure
    widgetElement.appendChild(widgetHeader);
    widgetElement.appendChild(litComponent);

    // Add to grid
    viewGrid.appendChild(widgetElement);
  });
}

// Enter edit mode
async function enterEditMode() {
  document.body.classList.add("is-editing");

  // Initialize GridStack if not already initialized
  const grid = await initGridStack((layout) => {
    currentLayout = layout;
  });

  // Load widgets from current layout
  loadWidgetsFromLayout(currentLayout);

  document.getElementById("toggleEditMode").textContent =
    "Voltar para Visualização";
}

// Exit edit mode
function exitEditMode() {
  document.body.classList.remove("is-editing");
  renderViewMode(currentLayout);
  document.getElementById("toggleEditMode").textContent = "Editar Dashboard";
}

// Toggle between modes
function toggleEditMode() {
  if (document.body.classList.contains("is-editing")) {
    exitEditMode();
  } else {
    enterEditMode();
  }
}

// Save current layout
function handleSaveLayout() {
  saveLayout(currentLayout)
    .then(() => {
      alert("Layout salvo com sucesso!");
      exitEditMode();
    })
    .catch((error) => {
      console.error("Erro ao salvar layout:", error);
      alert("Erro ao salvar layout");
    });
}

// Clear current layout
function handleClearLayout() {
  if (confirm("Tem certeza que deseja limpar o layout atual?")) {
    clearGrid();
    currentLayout = [];
  }
}

// Initialize application
async function init() {
  // Load saved layout
  currentLayout = loadLayout();

  // Set widget counter based on existing layout
  setWidgetCounter(getNextWidgetId(currentLayout));

  // Create widget buttons
  createWidgetButtons((widgetType) => {
    addWidget(widgetType);
  });

  // Render initial view
  renderViewMode(currentLayout);

  // Add event listeners
  document
    .getElementById("toggleEditMode")
    .addEventListener("click", toggleEditMode);
  document
    .getElementById("saveLayout")
    .addEventListener("click", handleSaveLayout);
  document
    .getElementById("clearLayout")
    .addEventListener("click", handleClearLayout);
  document.getElementById("cancelEdit").addEventListener("click", exitEditMode);
}

// Initialize when document is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
