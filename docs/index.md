---
hide:
  - navigation
---

# Welcome to Static BI!

## Examples


<source-table
  name="stocks"
  file="https://idl.uw.edu/mosaic/data/stocks.parquet"
  columns="*, date_trunc('month', Date) as month">
</source-table>


### Score Cards

<score-card
  title="Nb Symbols"
  table="stocks"
  value="count(distinct Symbol)">
</score-card>
<score-card
  title="Highest Close"
  table="stocks"
  value="max(Close)"
  format='#,##0.0,"k"'>
</score-card>
<score-card
  title="Symbol with highest close"
  table="stocks"
  value="Symbol"
  order_by="max(Close) desc">
</score-card>
<score-card
  title="Date of highest close"
  table="stocks"
  value="Date"
  order_by="max(Close) desc"
  format='yyyy-mm-dd'>
</score-card>


### Dashboard


<div class="grid cards" markdown>

-   <bar-chart
      table="stocks"
      measure="max(Close)"
      by="Symbol"
      limit="10"
      order_by="max(Close) desc">
    </bar-chart>

-   <line-chart
      table="stocks"
      measure="max(close)"
      by="Date"
      breakdown_by="Symbol">
    </line-chart>

</div>




### Stacked Bar Chart
<div>
<bar-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol"
  stacked="true"
>
</bar-chart>
</div>

### Grouped Bar Chart
<div>
<bar-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol"
>
</bar-chart>
</div>

### MultiLine Chart
<div>
<line-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol"
>
</line-chart>
</div>


### Tables List
<div>
<tables-list-chart></tables-list-chart>
</div>


### Table Description Chart
<div>
<table-description-chart table="stocks"></table-description-chart>
</div>


### Table Chart
<div>
<table-chart
  table="stocks"
  measures="sum(volume), sum(close)"
  by="date, symbol"
  limit="10"
  order_by="date desc"
>
</table-chart>
</div>


### Line Chart (COUNT)
<div>
<line-chart
  table="stocks"
  measure="count(*)"
  by="month"
>
</line-chart>
</div>



### Line Chart
<div>
<line-chart
  table="stocks"
  measure="sum(Close)"
  by="month"
  limit="500"
  order_by="month"
>
</line-chart>
</div>


### Bar Chart
<div>
<bar-chart
  table="stocks"
  measure="max(Close)"
  by="Symbol"
  limit="10"
  order_by="max(Close) desc"
>
</bar-chart>
</div>


### Bar Chart Grid
<div>
<bar-chart-grid
  table="stocks"
  measure="max(Close)"
  order_by="max(Close) desc"
  limit="10"
>
</bar-chart-grid>
</div>



### Rides Table Description Chart
<div>
<table-description-chart table="rides"></table-description-chart>
</div>


### Rides Bar Chart Grid
<div>
<bar-chart-grid
  table="rides"
  measure="count(*)"
  limit="10"
  order_by="count(*) desc"
>
</bar-chart-grid>
</div>

<script type="module" src="../src/database_connectors/duckdb.js"></script>
<script type="module" src="../src/data_components/source_tables.js"></script>
<script type="module" src="../src/visualization_components/echarts.js"></script>
<script type="module" src="../src/visualization_components/datatable.js"></script>
<script type="module" src="../src/visualization_components/score_cards.js"></script>
