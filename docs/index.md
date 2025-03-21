---
hide:
  - navigation
---

# Welcome to Static BI!

## Examples


<div>
<data-manager>

  <data-manager-table
    name="stocks"
    file="https://idl.uw.edu/mosaic/data/stocks.parquet"
  ></data-manager-table>

  <!-- <data-manager-table
    name="rides"
    file="https://idl.uw.edu/mosaic-datasets/data/nyc-rides-2010.parquet"
  ></data-manager-table> -->

</data-manager>
</div>


### MultiLine Chart
<div>
<line-chart
  table="stocks"
  dimension="Date"
  breakdown_dimension="Symbol"
  measure="max(close)"
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
  limit="10"
  dimensions="date, symbol"
  measures="sum(volume), sum(close)"
  order_by="date desc"
>
</table-chart>
</div>


### Line Chart (COUNT)
<div>
<line-chart
  table="stocks"
  dimension="strftime(Date, '%Y-%m')"
  measure="count(*)"
  limit="500"
  order_by="strftime(Date, '%Y-%m')"
>
</line-chart>
</div>



### Line Chart
<div>
<line-chart
  table="stocks"
  dimension="strftime(Date, '%Y-%m')"
  measure="sum(Close)"
  limit="500"
  order_by="strftime(Date, '%Y-%m')"
>
</line-chart>
</div>


### Bar Chart
<div>
<bar-chart
  table="stocks"
  dimension="Symbol"
  measure="max(Close)"
  limit="10"
  order_by="max(Close) desc"
>
</bar-chart>
</div>


### Doughnut Chart
<div>
<doughnut-chart
  table="stocks"
  dimension="Symbol"
  measure="max(Close)"
  limit="10"
  order_by="max(Close) desc"
>
</doughnut-chart>
</div>


### Pie Chart
<div>
<pie-chart
  table="stocks"
  dimension="Symbol"
  measure="max(Close)"
  limit="10"
  order_by="max(Close) desc"
>
</pie-chart>
</div>


### Bar Chart Grid
<div>
<bar-chart-grid
  table="stocks"
  measure="max(Close)"
  limit="10"
  order_by="max(Close) desc"
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


<script type="module" src="dist/data_manager.js"></script>
<script type="module" src="dist/charts.js"></script>