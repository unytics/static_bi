# Static BI

Create interactive, filterable dashboards using only static files.

This project leverages the power of **DuckDB-WASM** for in-browser data processing, **ECharts** for rich visualizations, and **Web Components** for modular, declarative UI elements.

Ideal for embedding analytics directly into static websites, documentation (like the included MkDocs site), or any environment where a backend analytics server is not feasible or desired.



## Create your first dashboard

All you need is to write some html components & include `static_bi` js libraries.

**No Install is Needed!**.


For example, to follow the evolution of stocks value over time, create a file named `my_first_dashboard.html` with the following content.


```
<source-table
  name="stocks"
  file="https://idl.uw.edu/mosaic/data/stocks.parquet"
  columns="*, Close as stock_value, date_trunc('month', Date) as month">
</source-table>

<bar-chart
  table="stocks"
  measure="avg(stock_value)"
  by="Symbol">
</bar-chart>

<line-chart
  table="stocks"
  measure="avg(stock_value)"
  by="month"
  order_by="month">
</line-chart>


<script type="module" src="https://unytics.io/static_bi/src/connectors/duckdb.js"></script>
<script type="module" src="https://unytics.io/static_bi/src/components/source_tables.js"></script>
<script type="module" src="https://unytics.io/static_bi/src/components/echarts.js"></script>
```

Open the file in Google Chrome (or any browser) and you'll get this simple dashboard:

![simple_dashboard](docs/assets/simple_dashboard.png)


The dashboard is interactive! Click on `AMZN` bar in the bar chart to filter the data in other charts:

![simple_dashboard_filtered](docs/assets/simple_dashboard_filtered.png)


## Key Features

*   **Serverless Analytics:** Runs entirely in the browser after loading static assets (HTML, JS, CSS, data files).
*   **Interactive Filtering:** Click on chart elements (bars, lines, pie slices) to filter the data across other components on the page. Supports multi-select with `Ctrl`/`Cmd` key.
*   **Declarative UI:** Define data sources and charts using simple custom HTML tags (e.g., `<bar-chart>`, `<score-card>`, `<source-table>`).
*   **In-Browser Data Engine:** Uses DuckDB-WASM to query and aggregate data (e.g., from Parquet files) directly within the user's browser using familiar SQL.
*   **Rich Component Library:** Includes:
    *   `<score-card>`: Display key metrics with formatting.
    *   `<line-chart>`, `<bar-chart>`, `<pie-chart>`, `<doughnut-chart>`: Various ECharts visualizations with options for stacking, grouping, orientation, and breakdowns.
    *   `<table-chart>`, `<table-description-chart>`, `<tables-list-chart>`: Display raw data, table schemas, or available tables.
    *   `<bar-chart-grid>`: Automatically generate a grid of bar charts for multiple dimensions.
*   **Static Data Sources:** Load data directly from static files (like `.parquet`) hosted alongside your site or from external URLs.
*   **Static Site Generator Friendly:** Designed to integrate seamlessly with static site generators like MkDocs, Jekyll, Hugo, etc.

## Core Technologies

*   [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview): In-browser SQL OLAP database.
*   [ECharts](https://echarts.apache.org/): Powerful charting and visualization library.
*   [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components): Standard for creating reusable custom HTML elements.
*   [MkDocs](https://www.mkdocs.org/) (with Material Theme): Used for the example documentation/dashboard site.
*   [Marked](https://marked.js.org/), [DOMPurify](https://github.com/cure53/DOMPurify): Used internally for rendering Markdown content within components.
*   [SSF](https://github.com/SheetJS/ssf): For flexible number and date formatting in scorecards.

## How it Works

1.  **Data Management:** The `<source-table>` components initializes DuckDB-WASM and instruct it to load data (e.g., fetch a Parquet file) within the in-browser database.
2.  **Component Initialization:** Custom elements like `<bar-chart>`, `<score-card>`, etc., are defined in JavaScript modules and used directly in the HTML/Markdown content.
3.  **Data Querying:** When the page loads or filters change, each component constructs a SQL query based on its attributes (e.g., `table`, `measure`, `by`, `breakdown_by`) and the current global filters. It sends this query to `DuckDB`.
4.  **Rendering:** The component receives query results from DuckDB and renders the visualization using ECharts or by generating appropriate HTML (for tables/scorecards).
5.  **Interactivity:** Click events on chart elements trigger a filter update. The `base_chart.js` logic updates the global filter state and dispatches an event, causing relevant components to re-query data and re-render.


## Inspiration

- Rill Data
- Evidence
- Mosaic
- Lightdash


## TODO

- Add Documentation
- Add controls such as date-range or dimension selection.
- Create a playground to edit dashboard code online and see result in realtime
- Add connectors to:
    - cubejs
    - supabase
    - Postgrest: `docker run --rm -p 3000:3000 -e PGRST_DB_URI="postgres://cube:12345@demo-db.cube.dev/ecom" -e PGRST_DB_ANON_ROLE=cube -e PGRST_DB_AGGREGATES_ENABLED=true postgrest/postgrest`
    - buckets
    - data-warehouses...
    - unytics