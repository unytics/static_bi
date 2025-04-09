# Static BI

Postgrest:

```bash
docker run --rm -p 3000:3000 -e PGRST_DB_URI="postgres://cube:12345@demo-db.cube.dev/ecom" -e PGRST_DB_ANON_ROLE=cube -e PGRST_DB_AGGREGATES_ENABLED=true postgrest/postgrest
```


[![Static BI Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Site-brightgreen?style=for-the-badge)](https://unytics.io/static_bi/) <!-- Placeholder - Update with actual demo link if available -->
[![GitHub Repo](https://img.shields.io/badge/GitHub-Repo-blue?style=for-the-badge&logo=github)](https://github.com/unytics/static_bi) <!-- Placeholder - Update with actual repo link -->

Create interactive, filterable dashboards using only static files. This project leverages the power of **DuckDB-WASM** for in-browser data processing, **ECharts** for rich visualizations, and **Web Components** for modular, declarative UI elements.

Ideal for embedding analytics directly into static websites, documentation (like the included MkDocs site), or any environment where a backend analytics server is not feasible or desired.

## Key Features

*   **Serverless Analytics:** Runs entirely in the browser after loading static assets (HTML, JS, CSS, data files).
*   **Interactive Filtering:** Click on chart elements (bars, lines, pie slices) to filter the data across other components on the page. Supports multi-select with `Ctrl`/`Cmd` key.
*   **Declarative UI:** Define data sources and charts using simple custom HTML tags (e.g., `<bar-chart>`, `<score-card>`, `<data-manager>`).
*   **In-Browser Data Engine:** Uses DuckDB-WASM to query and aggregate data (e.g., from Parquet files) directly within the user's browser using familiar SQL.
*   **Rich Component Library:** Includes:
    *   `<score-card>`: Display key metrics with formatting.
    *   `<line-chart>`, `<bar-chart>`, `<pie-chart>`, `<doughnut-chart>`: Various ECharts visualizations with options for stacking, grouping, orientation, and breakdowns.
    *   `<table-chart>`, `<table-description-chart>`, `<tables-list-chart>`: Display raw data, table schemas, or available tables.
    *   `<bar-chart-grid>`: Automatically generate a grid of bar charts for multiple dimensions.
*   **Static Data Sources:** Load data directly from static files (like `.parquet`) hosted alongside your site or from external URLs. Define complex views using SQL within `<data-manager-view>`.
*   **Static Site Generator Friendly:** Designed to integrate seamlessly with static site generators like MkDocs, Jekyll, Hugo, etc.

## Core Technologies

*   [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview): In-browser SQL OLAP database.
*   [ECharts](https://echarts.apache.org/): Powerful charting and visualization library.
*   [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components): Standard for creating reusable custom HTML elements.
*   [MkDocs](https://www.mkdocs.org/) (with Material Theme): Used for the example documentation/dashboard site.
*   [Marked](https://marked.js.org/), [DOMPurify](https://github.com/cure53/DOMPurify): Used internally for rendering Markdown content within components.
*   [SSF](https://github.com/SheetJS/ssf): For flexible number and date formatting in scorecards.

## How it Works

1.  **Data Management:** The `<data-manager>` component initializes DuckDB-WASM. Child elements like `<data-manager-table file="...">` or `<data-manager-view sql="...">` instruct it to load data (e.g., fetch a Parquet file) or create SQL views within the in-browser database.
2.  **Component Initialization:** Custom elements like `<bar-chart>`, `<score-card>`, etc., are defined in JavaScript modules and used directly in the HTML/Markdown content.
3.  **Data Querying:** When the page loads or filters change, each component constructs a SQL query based on its attributes (e.g., `table`, `measure`, `by`, `breakdown_by`) and the current global filters. It sends this query to the `data_manager`.
4.  **Rendering:** The component receives query results from DuckDB via the `data_manager` and renders the visualization using ECharts or by generating appropriate HTML (for tables/scorecards).
5.  **Interactivity:** Click events on chart elements trigger a filter update. The `base_chart.js` logic updates the global filter state and dispatches an event, causing relevant components to re-query data and re-render.
