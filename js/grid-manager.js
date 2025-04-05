import { WIDGET_TYPES } from "./widget-registry.js";

let grid = null;
let widgetCounter = 0;

// Load GridStack scripts dynamically
export async function loadGridStackScripts() {
  return new Promise((resolve) => {
    if (window.GridStack) {
      resolve();
      return;
    }

    // Load CSS
    const cssLink1 = document.createElement("link");
    cssLink1.rel = "stylesheet";
    cssLink1.href =
      "https://cdn.jsdelivr.net/npm/gridstack@7.2.3/dist/gridstack.min.css";
    document.head.appendChild(cssLink1);

    const cssLink2 = document.createElement("link");
    cssLink2.rel = "stylesheet";
    cssLink2.href =
      "https://cdn.jsdelivr.net/npm/gridstack@7.2.3/dist/gridstack-extra.min.css";
    document.head.appendChild(cssLink2);

    // Load custom GridStack CSS
    const customCssLink = document.createElement("link");
    customCssLink.rel = "stylesheet";
    customCssLink.href = "css/gridstack-custom.css";
    document.head.appendChild(customCssLink);

    // Load JS
    const script = document.createElement("script");
    script.src =
      "https://cdn.jsdelivr.net/npm/gridstack@7.2.3/dist/gridstack-all.js";
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// Get icon for widget type
function getWidgetIcon(widgetType) {
  const iconMap = {
    lineChart: "bi-graph-up",
    barChart: "bi-bar-chart",
    pieChart: "bi-pie-chart",
    dataTable: "bi-table",
    profileCard: "bi-person-circle",
    metrics: "bi-speedometer2",
    calendar: "bi-calendar-event",
    notifications: "bi-bell",
    weather: "bi-cloud-sun",
    stockMarket: "bi-currency-dollar",
  };

  return iconMap[widgetType] || "bi-grid";
}

// Initialize GridStack
export async function initGridStack(onChangeCallback) {
  await loadGridStackScripts();

  grid = GridStack.init({
    column: 12,
    cellHeight: 60,
    margin: 10,
    animate: true,
    resizable: {
      handles: "all",
    },
    draggable: {
      handle: ".widget-header",
    },
  });

  // Add listener for layout changes
  grid.on("change", () => {
    const gridItems = grid.getGridItems();
    const currentLayout = gridItems.map((el) => {
      const gridStackNode = el.gridstackNode;
      const widgetType = el.getAttribute("data-widget-type");

      return {
        id: gridStackNode.id,
        x: gridStackNode.x,
        y: gridStackNode.y,
        w: gridStackNode.w,
        h: gridStackNode.h,
        widgetType,
      };
    });

    onChangeCallback(currentLayout);
  });

  return grid;
}

// Add a widget to the grid
export function addWidget(widgetType, widgetId = null) {
  if (!grid) return null;

  const widgetConfig = WIDGET_TYPES[widgetType];
  const id = widgetId || `widget-${widgetCounter++}`;

  // Create widget element
  const widgetElement = document.createElement("div");
  widgetElement.className = "grid-stack-item";
  widgetElement.dataset.widgetType = widgetType;

  // Create widget content
  const widgetContent = document.createElement("div");
  widgetContent.className = "grid-stack-item-content";

  // Create widget header
  const widgetHeader = document.createElement("div");
  widgetHeader.className = "widget-header";

  const widgetTitle = document.createElement("h6");
  widgetTitle.className = "widget-title";

  // Add icon to widget title
  const icon = document.createElement("i");
  icon.className = `${getWidgetIcon(widgetType)} me-2`;
  widgetTitle.appendChild(icon);

  const titleText = document.createTextNode(widgetConfig.title);
  widgetTitle.appendChild(titleText);

  const removeButton = document.createElement("button");
  removeButton.className = "btn-remove-widget";
  removeButton.innerHTML = '<i class="bi bi-x-lg"></i>';
  removeButton.title = "Remove widget";
  removeButton.addEventListener("click", () => {
    grid.removeWidget(widgetElement);
  });

  widgetHeader.appendChild(widgetTitle);
  widgetHeader.appendChild(removeButton);

  // Create Lit component
  const litComponent = document.createElement(widgetConfig.tagName);

  // Assemble widget structure
  widgetContent.appendChild(widgetHeader);
  widgetContent.appendChild(litComponent);
  widgetElement.appendChild(widgetContent);

  // Add widget to grid
  grid.addWidget(widgetElement, {
    x: 0, // Auto position
    y: 0, // Auto position
    w: widgetConfig.width,
    h: widgetConfig.height,
    id: id,
  });

  return widgetElement;
}

// Load widgets from layout data
export function loadWidgetsFromLayout(layout) {
  if (!grid) return;

  // Clear grid
  grid.removeAll();

  // Add widgets from layout
  layout.forEach((item) => {
    const widgetType = item.widgetType;
    const widgetConfig = WIDGET_TYPES[widgetType];

    if (!widgetConfig) return;

    // Create widget element
    const widgetElement = document.createElement("div");
    widgetElement.className = "grid-stack-item";
    widgetElement.dataset.widgetType = widgetType;

    // Create widget content
    const widgetContent = document.createElement("div");
    widgetContent.className = "grid-stack-item-content";

    // Create widget header
    const widgetHeader = document.createElement("div");
    widgetHeader.className = "widget-header";

    const widgetTitle = document.createElement("h6");
    widgetTitle.className = "widget-title";

    // Add icon to widget title
    const icon = document.createElement("i");
    icon.className = `${getWidgetIcon(widgetType)} me-2`;
    widgetTitle.appendChild(icon);

    const titleText = document.createTextNode(widgetConfig.title);
    widgetTitle.appendChild(titleText);

    const removeButton = document.createElement("button");
    removeButton.className = "btn-remove-widget";
    removeButton.innerHTML = '<i class="bi bi-x"></i>';
    removeButton.title = "Remove widget";
    removeButton.addEventListener("click", () => {
      grid.removeWidget(widgetElement);
    });

    widgetHeader.appendChild(widgetTitle);
    widgetHeader.appendChild(removeButton);

    // Create Lit component
    const litComponent = document.createElement(widgetConfig.tagName);

    // Assemble widget structure
    widgetContent.appendChild(widgetHeader);
    widgetContent.appendChild(litComponent);
    widgetElement.appendChild(widgetContent);

    // Add widget to grid
    grid.addWidget(widgetElement, {
      x: item.x,
      y: item.y,
      w: item.w,
      h: item.h,
      id: item.id,
    });
  });
}

// Clear all widgets
export function clearGrid() {
  if (grid) {
    grid.removeAll();
  }
}

// Set widget counter
export function setWidgetCounter(count) {
  widgetCounter = count;
}
