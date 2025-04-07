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


<date-picker></date-picker>


## hey

<input type="date" id="my-date-picker" name="my-date" />


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

<bar-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol"
  stacked="true">
</bar-chart>


### Grouped Bar Chart

<bar-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol">
</bar-chart>


### MultiLine Chart

<line-chart
  table="stocks"
  measure="max(close)"
  by="Date"
  breakdown_by="Symbol">
</line-chart>


### Tables List

<tables-list-chart></tables-list-chart>


### Table Description Chart

<table-description-chart table="stocks"></table-description-chart>


### Table Chart

<table-chart
  table="stocks"
  measures="sum(volume), sum(close)"
  by="date, symbol"
  limit="10"
  order_by="date desc">
</table-chart>


### Line Chart (COUNT)

<line-chart
  table="stocks"
  measure="count(*)"
  by="month">
</line-chart>


### Line Chart

<line-chart
  table="stocks"
  measure="sum(Close)"
  by="month"
  limit="500"
  order_by="month">
</line-chart>


### Bar Chart

<bar-chart
  table="stocks"
  measure="max(Close)"
  by="Symbol"
  limit="10"
  order_by="max(Close) desc">
</bar-chart>


### Bar Chart Grid

<bar-chart-grid
  table="stocks"
  measure="max(Close)"
  order_by="max(Close) desc"
  limit="10">
</bar-chart-grid>


### Rides Table Description Chart

<table-description-chart table="rides"></table-description-chart>


### Rides Bar Chart Grid

<bar-chart-grid
  table="rides"
  measure="count(*)"
  limit="10"
  order_by="count(*) desc">
</bar-chart-grid>

<script type="module" src="../src/connectors/duckdb.js"></script>
<script type="module" src="../src/components/data/source_tables.js"></script>
<script type="module" src="../src/components/visualization/echarts.js"></script>
<script type="module" src="../src/components/visualization/datatable.js"></script>
<script type="module" src="../src/components/visualization/score_cards.js"></script>
<script type="module" src="../src/components/controls/date_controls.js"></script>
