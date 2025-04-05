import {
  LitElement,
  html,
  css,
} from "https://cdn.jsdelivr.net/gh/lit/dist@2/core/lit-core.min.js";

// Base widget component with data fetching capabilities
export class BaseWidget extends LitElement {
  static properties = {
    title: { type: String },
    loading: { type: Boolean },
    error: { type: String },
    data: { type: Object },
    apiEndpoint: { type: String },
  };

  constructor() {
    super();
    this.loading = false;
    this.error = null;
    this.data = null;
  }

  connectedCallback() {
    super.connectedCallback();
    if (this.apiEndpoint) {
      this.fetchData();
    }
  }

  async fetchData() {
    try {
      this.loading = true;
      this.error = null;
      const response = await fetch(this.apiEndpoint);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      this.data = this.transformData(data);
      this.loading = false;
    } catch (err) {
      console.error("Error fetching data:", err);
      this.error = err.message;
      this.loading = false;
    }
  }

  // Override this method in child classes to transform API data
  transformData(data) {
    return data;
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .widget-content {
      height: 100%;
      padding: 15px;
      position: relative;
    }

    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
      background-color: rgba(255, 255, 255, 0.7);
      z-index: 10;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3498db;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .error-message {
      color: #dc3545;
      text-align: center;
      padding: 10px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  `;

  renderLoading() {
    return html`
      <div class="loading-indicator">
        <div class="spinner"></div>
      </div>
    `;
  }

  renderError() {
    return html`
      <div class="error-message">
        <p>Error: ${this.error}</p>
        <button @click=${this.fetchData} class="btn btn-sm btn-outline-primary">
          Retry
        </button>
      </div>
    `;
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        <slot></slot>
      </div>
    `;
  }
}

// Line Chart Widget using Chart.js and CoinGecko API
export class LineChartWidget extends BaseWidget {
  static properties = {
    ...BaseWidget.properties,
    currency: { type: String },
    days: { type: Number },
  };

  constructor() {
    super();
    this.currency = "bitcoin";
    this.days = 14;
    this.apiEndpoint = `https://api.coingecko.com/api/v3/coins/${this.currency}/market_chart?vs_currency=usd&days=${this.days}`;
    this.chart = null;
  }

  updated(changedProperties) {
    if (changedProperties.has("data") && this.data) {
      this.renderChart();
    }
  }

  transformData(data) {
    // Transform CoinGecko data for Chart.js
    if (!data || !data.prices) return null;

    const prices = data.prices.map((item) => ({
      x: new Date(item[0]),
      y: item[1],
    }));

    return {
      labels: prices.map((item) => item.x.toLocaleDateString()),
      datasets: [
        {
          label: `${
            this.currency.charAt(0).toUpperCase() + this.currency.slice(1)
          } Price (USD)`,
          data: prices,
          borderColor: "#3498db",
          backgroundColor: "rgba(52, 152, 219, 0.1)",
          tension: 0.1,
          fill: true,
        },
      ],
    };
  }

  async loadChartJs() {
    if (window.Chart) return;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async renderChart() {
    if (!this.data) return;

    await this.loadChartJs();

    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) return;

    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "line",
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: "time",
            time: {
              unit: "day",
            },
          },
        },
      },
    });
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        <canvas style="width: 100%; height: 100%;"></canvas>
      </div>
    `;
  }
}
customElements.define("line-chart-widget", LineChartWidget);

// Bar Chart Widget using Chart.js and REST Countries API
export class BarChartWidget extends BaseWidget {
  constructor() {
    super();
    this.apiEndpoint =
      "https://restcountries.com/v3.1/region/europe?fields=name,population";
    this.chart = null;
  }

  transformData(data) {
    // Sort countries by population (descending) and take top 10
    const topCountries = [...data]
      .sort((a, b) => b.population - a.population)
      .slice(0, 10);

    return {
      labels: topCountries.map((country) => country.name.common),
      datasets: [
        {
          label: "Population",
          data: topCountries.map((country) => country.population),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
            "rgba(255, 159, 64, 0.7)",
            "rgba(199, 199, 199, 0.7)",
            "rgba(83, 102, 255, 0.7)",
            "rgba(40, 159, 64, 0.7)",
            "rgba(210, 199, 199, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("data") && this.data) {
      this.renderChart();
    }
  }

  async loadChartJs() {
    if (window.Chart) return;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async renderChart() {
    if (!this.data) return;

    await this.loadChartJs();

    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) return;

    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "bar",
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        <canvas style="width: 100%; height: 100%;"></canvas>
      </div>
    `;
  }
}
customElements.define("bar-chart-widget", BarChartWidget);

// Pie Chart Widget using Chart.js and OpenWeatherMap API
export class PieChartWidget extends BaseWidget {
  static properties = {
    ...BaseWidget.properties,
    cities: { type: Array },
  };

  constructor() {
    super();
    this.cities = ["London", "Paris", "Berlin", "Madrid", "Rome"];
    // Note: In a real app, you would use your own API key
    this.apiKey = "3b3cdd2a8a6d93d95f7c6a3fe59e6225"; // This is a sample key, use your own
    this.apiEndpoint = `https://api.openweathermap.org/data/2.5/group?id=2643743,2988507,2950159,3117735,3169070&units=metric&appid=${this.apiKey}`;
    this.chart = null;
  }

  transformData(data) {
    if (!data || !data.list) return null;

    return {
      labels: data.list.map((city) => city.name),
      datasets: [
        {
          label: "Temperature (°C)",
          data: data.list.map((city) => city.main.temp),
          backgroundColor: [
            "rgba(255, 99, 132, 0.7)",
            "rgba(54, 162, 235, 0.7)",
            "rgba(255, 206, 86, 0.7)",
            "rgba(75, 192, 192, 0.7)",
            "rgba(153, 102, 255, 0.7)",
          ],
          borderWidth: 1,
        },
      ],
    };
  }

  updated(changedProperties) {
    if (changedProperties.has("data") && this.data) {
      this.renderChart();
    }
  }

  async loadChartJs() {
    if (window.Chart) return;

    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/chart.js";
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  async renderChart() {
    if (!this.data) return;

    await this.loadChartJs();

    const canvas = this.shadowRoot.querySelector("canvas");
    if (!canvas) return;

    // Destroy previous chart if it exists
    if (this.chart) {
      this.chart.destroy();
    }

    const ctx = canvas.getContext("2d");
    this.chart = new Chart(ctx, {
      type: "pie",
      data: this.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "right",
          },
          title: {
            display: true,
            text: "Current Temperatures in European Cities",
          },
        },
      },
    });
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        <canvas style="width: 100%; height: 100%;"></canvas>
      </div>
    `;
  }
}
customElements.define("pie-chart-widget", PieChartWidget);

// Data Table Widget using JSONPlaceholder API
export class DataTableWidget extends BaseWidget {
  constructor() {
    super();
    this.apiEndpoint = "https://jsonplaceholder.typicode.com/posts?_limit=10";
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="table-responsive">
                <table class="table table-striped table-sm">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Title</th>
                      <th>Body</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.data.map(
                      (post) => html`
                        <tr>
                          <td>${post.id}</td>
                          <td>${post.title}</td>
                          <td>${post.body.substring(0, 50)}...</td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("data-table-widget", DataTableWidget);

// Profile Card Widget using Random User API
export class ProfileCardWidget extends BaseWidget {
  constructor() {
    super();
    this.apiEndpoint = "https://randomuser.me/api/";
  }

  transformData(data) {
    if (!data || !data.results || !data.results[0]) return null;
    return data.results[0];
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="profile-placeholder">
                <img
                  src="${this.data.picture.large}"
                  alt="Profile"
                  class="rounded-circle mb-3"
                  style="width: 80px; height: 80px;"
                />
                <h5>${this.data.name.first} ${this.data.name.last}</h5>
                <p class="text-muted">${this.data.email}</p>
                // Continuing from the ProfileCardWidget...
                <div class="d-flex flex-column mt-2">
                  <small class="text-muted">
                    <i class="bi bi-geo-alt"></i> ${this.data.location.city},
                    ${this.data.location.country}
                  </small>
                  <small class="text-muted">
                    <i class="bi bi-telephone"></i> ${this.data.phone}
                  </small>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("profile-card-widget", ProfileCardWidget);

// Metrics Widget using CoinGecko API for crypto metrics
export class MetricsWidget extends BaseWidget {
  constructor() {
    super();
    this.apiEndpoint = "https://api.coingecko.com/api/v3/global";
  }

  transformData(data) {
    if (!data || !data.data) return null;

    const marketData = data.data;
    return {
      totalMarketCap: Math.round(marketData.total_market_cap.usd),
      totalVolume: Math.round(marketData.total_volume.usd),
      marketCapPercentage: {
        btc: marketData.market_cap_percentage.btc.toFixed(1),
        eth: marketData.market_cap_percentage.eth.toFixed(1),
      },
      markets: marketData.markets,
    };
  }

  formatNumber(num) {
    if (num >= 1000000000) {
      return "$" + (num / 1000000000).toFixed(2) + "B";
    }
    if (num >= 1000000) {
      return "$" + (num / 1000000).toFixed(2) + "M";
    }
    return "$" + num.toLocaleString();
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="metrics-grid">
                <div class="metric-card">
                  <div class="metric-title">Total Market Cap</div>
                  <div class="metric-value">
                    ${this.formatNumber(this.data.totalMarketCap)}
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">24h Volume</div>
                  <div class="metric-value">
                    ${this.formatNumber(this.data.totalVolume)}
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">BTC Dominance</div>
                  <div class="metric-value">
                    ${this.data.marketCapPercentage.btc}%
                  </div>
                </div>
                <div class="metric-card">
                  <div class="metric-title">Active Markets</div>
                  <div class="metric-value">${this.data.markets}</div>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("metrics-widget", MetricsWidget);

// Calendar Widget using Holiday API
export class CalendarWidget extends BaseWidget {
  static properties = {
    ...BaseWidget.properties,
    year: { type: Number },
    country: { type: String },
  };

  constructor() {
    super();
    this.year = new Date().getFullYear();
    this.country = "US";
    // Note: In a real app, you would use your own API key
    this.apiKey = "a6d82b41-642c-4490-8c2a-29525c";
    this.apiEndpoint = `https://holidayapi.com/v1/holidays?pretty&key=${this.apiKey}&country=${this.country}&year=${this.year}`;

    // Since the free Holiday API only provides historical data,
    // we'll use a mock response for demonstration purposes
    this.mockHolidays();
  }

  mockHolidays() {
    // Create mock data instead of using the API
    setTimeout(() => {
      const currentMonth = new Date().getMonth();
      const mockData = {
        holidays: [
          {
            name: "New Year's Day",
            date: `${this.year}-01-01`,
            observed: `${this.year}-01-01`,
            public: true,
          },
          {
            name: "Martin Luther King Jr. Day",
            date: `${this.year}-01-17`,
            observed: `${this.year}-01-17`,
            public: true,
          },
          {
            name: "Valentine's Day",
            date: `${this.year}-02-14`,
            observed: `${this.year}-02-14`,
            public: false,
          },
          {
            name: "Presidents' Day",
            date: `${this.year}-02-21`,
            observed: `${this.year}-02-21`,
            public: true,
          },
          {
            name: "Memorial Day",
            date: `${this.year}-05-30`,
            observed: `${this.year}-05-30`,
            public: true,
          },
          {
            name: "Independence Day",
            date: `${this.year}-07-04`,
            observed: `${this.year}-07-04`,
            public: true,
          },
          {
            name: "Labor Day",
            date: `${this.year}-09-05`,
            observed: `${this.year}-09-05`,
            public: true,
          },
          {
            name: "Halloween",
            date: `${this.year}-10-31`,
            observed: `${this.year}-10-31`,
            public: false,
          },
          {
            name: "Veterans Day",
            date: `${this.year}-11-11`,
            observed: `${this.year}-11-11`,
            public: true,
          },
          {
            name: "Thanksgiving Day",
            date: `${this.year}-11-24`,
            observed: `${this.year}-11-24`,
            public: true,
          },
          {
            name: "Christmas Day",
            date: `${this.year}-12-25`,
            observed: `${this.year}-12-25`,
            public: true,
          },
        ],
      };

      // Filter to show upcoming holidays
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      this.data = mockData.holidays
        .filter((holiday) => {
          const holidayDate = new Date(holiday.date);
          return holidayDate >= today;
        })
        .slice(0, 5); // Show next 5 upcoming holidays

      this.loading = false;
    }, 1000);
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="calendar-container">
                <h6 class="mb-3">Upcoming Holidays</h6>
                <ul class="list-group">
                  ${this.data.map(
                    (holiday) => html`
                      <li
                        class="list-group-item d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <strong>${holiday.name}</strong>
                          <div class="text-muted small">
                            ${holiday.public ? "Public Holiday" : "Observance"}
                          </div>
                        </div>
                        <span class="badge bg-primary rounded-pill">
                          ${new Date(holiday.date).toLocaleDateString()}
                        </span>
                      </li>
                    `
                  )}
                </ul>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("calendar-widget", CalendarWidget);

// Notifications Widget using JSONPlaceholder API
export class NotificationsWidget extends BaseWidget {
  constructor() {
    super();
    this.apiEndpoint = "https://jsonplaceholder.typicode.com/comments?_limit=5";
  }

  transformData(data) {
    // Transform comments into notifications
    return data.map((comment) => ({
      id: comment.id,
      title: comment.name,
      message: comment.body.substring(0, 60) + "...",
      email: comment.email,
      time: this.getRandomTime(),
    }));
  }

  getRandomTime() {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const days = Math.floor(Math.random() * 3);

    if (days === 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")} today`;
    } else if (days === 1) {
      return "Yesterday";
    } else {
      return `${days} days ago`;
    }
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="notifications-container">
                ${this.data.map(
                  (notification) => html`
                    <div class="notification-item">
                      <div class="d-flex justify-content-between">
                        <strong>${notification.title}</strong>
                        <small class="text-muted">${notification.time}</small>
                      </div>
                      <div class="text-muted small">${notification.email}</div>
                      <div>${notification.message}</div>
                    </div>
                  `
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("notifications-widget", NotificationsWidget);

// Weather Widget using OpenWeatherMap API
export class WeatherWidget extends BaseWidget {
  static properties = {
    ...BaseWidget.properties,
    city: { type: String },
  };

  constructor() {
    super();
    this.city = "Lisbon";
    // Note: In a real app, you would use your own API key
    this.apiKey = "3b3cdd2a8a6d93d95f7c6a3fe59e6225"; // Sample key, use your own
    this.apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
  }

  updated(changedProperties) {
    if (changedProperties.has("city") && this.city) {
      this.apiEndpoint = `https://api.openweathermap.org/data/2.5/weather?q=${this.city}&units=metric&appid=${this.apiKey}`;
      this.fetchData();
    }
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="weather-container text-center">
                <h4>${this.data.name}, ${this.data.sys.country}</h4>
                <div class="d-flex justify-content-center align-items-center">
                  <img
                    src="https://openweathermap.org/img/wn/${this.data
                      .weather[0].icon}@2x.png"
                    alt="${this.data.weather[0].description}"
                  />
                  <h2>${Math.round(this.data.main.temp)}°C</h2>
                </div>
                <p class="text-capitalize">
                  ${this.data.weather[0].description}
                </p>
                <div class="row mt-3">
                  <div class="col-6">
                    <div class="text-muted">Humidity</div>
                    <div>${this.data.main.humidity}%</div>
                  </div>
                  <div class="col-6">
                    <div class="text-muted">Wind</div>
                    <div>${this.data.wind.speed} m/s</div>
                  </div>
                </div>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("weather-widget", WeatherWidget);

// Stock Market Widget using Alpha Vantage API
export class StockMarketWidget extends BaseWidget {
  static properties = {
    ...BaseWidget.properties,
    symbols: { type: Array },
  };

  constructor() {
    super();
    this.symbols = ["AAPL", "MSFT", "GOOGL", "AMZN", "META"];
    // Note: In a real app, you would use your own API key
    this.apiKey = "demo"; // Using Alpha Vantage demo key

    // Since we're using a demo key with limited requests,
    // we'll use mock data for demonstration
    this.mockStockData();
  }

  mockStockData() {
    setTimeout(() => {
      this.data = [
        { symbol: "AAPL", price: 145.86, change: 0.41, changePercent: 0.28 },
        { symbol: "MSFT", price: 258.35, change: -0.67, changePercent: -0.26 },
        { symbol: "GOOGL", price: 2290.98, change: 14.96, changePercent: 0.66 },
        { symbol: "AMZN", price: 3161.0, change: -23.0, changePercent: -0.72 },
        { symbol: "META", price: 335.94, change: 3.14, changePercent: 0.94 },
      ];
      this.loading = false;
    }, 1000);
  }

  render() {
    return html`
      <div class="widget-content">
        ${this.loading ? this.renderLoading() : ""}
        ${this.error ? this.renderError() : ""}
        ${this.data
          ? html`
              <div class="stock-container">
                <table class="table table-sm">
                  <thead>
                    <tr>
                      <th>Symbol</th>
                      <th>Price</th>
                      <th>Change</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${this.data.map(
                      (stock) => html`
                        <tr>
                          <td><strong>${stock.symbol}</strong></td>
                          <td>$${stock.price.toFixed(2)}</td>
                          <td
                            class="${stock.change >= 0
                              ? "text-success"
                              : "text-danger"}"
                          >
                            ${stock.change >= 0
                              ? "+"
                              : ""}${stock.change.toFixed(2)}
                            (${stock.change >= 0
                              ? "+"
                              : ""}${stock.changePercent.toFixed(2)}%)
                          </td>
                        </tr>
                      `
                    )}
                  </tbody>
                </table>
              </div>
            `
          : ""}
      </div>
    `;
  }
}
customElements.define("stock-market-widget", StockMarketWidget);
