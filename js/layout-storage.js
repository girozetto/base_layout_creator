// Save layout to localStorage
export function saveLayout(layout) {
  localStorage.setItem("dashboardLayout", JSON.stringify(layout));

  // In a real environment, you would also send to server
  // return fetch('/api/save-layout', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ layout })
  // });

  return Promise.resolve({ success: true });
}

// Load layout from localStorage
export function loadLayout() {
  const savedLayout = localStorage.getItem("dashboardLayout");

  if (savedLayout) {
    return JSON.parse(savedLayout);
  }

  return []; // Return empty layout if nothing is saved
}

// Get the next widget ID based on existing layout
export function getNextWidgetId(layout) {
  return layout.reduce((maxId, item) => {
    const idMatch = item.id?.match(/widget-(\d+)/);
    if (idMatch) {
      return Math.max(maxId, parseInt(idMatch[1], 10) + 1);
    }
    return maxId;
  }, 0);
}
