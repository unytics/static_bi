<style>
.md-typeset h1 {
  font-size: 0px;
}
</style>

![logo](docs/assets/static_bi_logo_and_name.svg)


<p align="center">
    <em>Embed Analytics Everywhere</em>
</p>

---


## Static BI?

Static BI is the easiest way to **embed interactive dashboards in your website** (as far as we know).


## Your first dashboard

To create a dashboard, you only need to:

> 1. [Add BI components in a html file](#1-add-bi-components-in-a-html-file)
> 2. [Open the file in a browser](#2-open-the-file-in-a-browser)
> 3. [Play with your dashboard](#3-play-with-your-dashboard)
> 4. [Deploy Anywhere](#4-deploy-anywhere)


#### 1. Add BI components in a html file

To follow the evolution of stocks value of some companies over time, create an html file with this content:


``` html title="my_first_dashboard.html"
<source-table
  name="stocks"
  url="https://idl.uw.edu/mosaic/data/stocks.parquet"
  columns="*, Symbol as company, Close as stock_value, date_trunc('month', Date) as month">
</source-table>

<bar-chart
  table="stocks"
  measure="avg(stock_value)"
  by="company">
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

#### 2. Open the file in a browser

Open the file in Google Chrome (or any browser) and you'll get this simple dashboard:

![simple_dashboard](docs/assets/simple_dashboard.png)


#### 3. Play with your dashboard

The dashboard is interactive! Click on `AMZN` bar in the bar chart to filter the data in other charts:

![simple_dashboard_filtered](docs/assets/simple_dashboard_filtered.png)


#### 4. Deploy Anywhere

You can deploy a website with Static BI components anywhere:

- in your own website, web app
- in static websites hosting services: github pages, gitlab pages, s3, google cloud storage, netlify, vercel, etc


## Key Features

1. **Declarative UI**
    - *Define data sources and charts using simple custom HTML tags (e.g., `<bar-chart>`, `<score-card>`, `<source-table>`).*
    - *Includes Rich & Customizable Component Library.*
2. **Interactive Filtering**
    - *Click on chart elements (bars, lines, pie slices) to filter the data across other components on the page.*
    - *Supports multi-select with `Ctrl`/`Cmd` key.*
3. **Serverless Analytics**
    - *Runs entirely in the browser after loading static assets (HTML, JS, CSS, data files).*
    - *Can be deployed anywhere*



<details markdown>

<summary>How it works</summary>

Static BI is Powered by [DuckDB-WASM](https://duckdb.org/docs/api/wasm/overview){ target="_blank" }, [ECharts](https://echarts.apache.org/){ target="_blank" } and [Web Components](https://developer.mozilla.org/en-US/docs/Web/API/Web_Components){ target="_blank" }.

1.  **Data Management:** The `<source-table>` components initializes DuckDB-WASM and instruct it to load data (e.g., fetch a Parquet file or fetch data from an API) within the in-browser database.
2.  **Component Initialization:** Custom elements like `<bar-chart>`, `<score-card>`, etc., are defined in JavaScript modules and used directly in the HTML/Markdown content.
3.  **Data Querying:** When the page loads or filters change, each component constructs a SQL query based on its attributes (e.g., `table`, `measure`, `by`, `breakdown_by`) and the current global filters. It sends this query to `DuckDB`.
4.  **Rendering:** The component receives query results from DuckDB and renders the visualization using ECharts or by generating appropriate HTML (for tables/scorecards).
5.  **Interactivity:** Click events on chart elements trigger a filter update. The `base_chart.js` logic updates the global filter state and dispatches an event, causing relevant components to re-query data and re-render.

</details>


<details markdown>

<summary>Inspiration</summary>

- [Evidence](https://evidence.dev/){ target="_blank" }
- [Rill Data](https://www.rilldata.com/){ target="_blank" }
- [Mosaic](https://idl.uw.edu/mosaic/){ target="_blank" }
- [Lightdash](http://lightdash.com/){ target="_blank" }

</details>



## Contribute!

Static BI is fully open-source (MIT License). Any contribution is more than welcome 🤗!

- Add a ⭐ on the repo to show your support
- [Join our Slack](https://join.slack.com/t/unytics/shared_invite/zt-1gbv491mu-cs03EJbQ1fsHdQMcFN7E1Q) and talk with us
- [Raise an issue](https://github.com/unytics/bigfunctions/issues/new/choose)
- Open a Pull-Request!


<details markdown>
  <summary>Todo Ideas</summary>

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
  - Add layout components?
    - tabs
    - grid / columns

</details>
