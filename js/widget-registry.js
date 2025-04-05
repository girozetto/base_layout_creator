// Widget type definitions
export const WIDGET_TYPES = {
  lineChart: {
    title: "Crypto Price Chart",
    tagName: "line-chart-widget",
    width: 4,
    height: 4,
  },
  barChart: {
    title: "Population Chart",
    tagName: "bar-chart-widget",
    width: 4,
    height: 4,
  },
  pieChart: {
    title: "Weather Comparison",
    tagName: "pie-chart-widget",
    width: 4,
    height: 4,
  },
  dataTable: {
    title: "Data Table",
    tagName: "data-table-widget",
    width: 6,
    height: 5,
  },
  profileCard: {
    title: "User Profile",
    tagName: "profile-card-widget",
    width: 3,
    height: 4,
  },
  metrics: {
    title: "Crypto Market Metrics",
    tagName: "metrics-widget",
    width: 4,
    height: 4,
  },
  calendar: {
    title: "Holiday Calendar",
    tagName: "calendar-widget",
    width: 4,
    height: 5,
  },
  notifications: {
    title: "Notifications",
    tagName: "notifications-widget",
    width: 3,
    height: 4,
  },
  weather: {
    title: "Weather Forecast",
    tagName: "weather-widget",
    width: 3,
    height: 4,
  },
  stockMarket: {
    title: "Stock Market",
    tagName: "stock-market-widget",
    width: 4,
    height: 4,
  },
};

// Create widget buttons in the toolbox
export function createWidgetButtons(addWidgetCallback) {
  const widgetButtonsContainer = document.getElementById("widgetButtons");

  Object.entries(WIDGET_TYPES).forEach(([type, widgetConfig]) => {
    const button = document.createElement("button");
    button.className = "btn btn-outline-primary btn-sm widget-button";
    button.textContent = widgetConfig.title;
    button.dataset.widgetType = type;

    button.addEventListener("click", () => addWidgetCallback(type));

    widgetButtonsContainer.appendChild(button);
  });
}
