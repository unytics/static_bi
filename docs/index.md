---
hide:
  - navigation
---

# Welcome to Static BI!

## Examples


<div>
<data-manager>

  <data-manager-table name="_stocks" file="https://idl.uw.edu/mosaic/data/stocks.parquet"></data-manager-table>
  <!-- <data-manager-table name="rides"  file="https://idl.uw.edu/mosaic-datasets/data/nyc-rides-2010.parquet"></data-manager-table> -->

  <data-manager-view name="stocks">
    select
      *,
      strftime(Date, '%Y-%m') as month,
    from _stocks
  </data-manager-view>

</data-manager>
</div>


### Dashboard

<div>


  <bar-chart
    table="stocks"
    measure="max(Close)"
    by="Symbol"
    limit="10"
    order_by="max(Close) desc"
    style="width: 49%; display: inline-block;"
  >
  </bar-chart>

  <line-chart
    table="stocks"
    measure="max(close)"
    by="Date"
    breakdown_by="Symbol"
    style="width: 49%; display: inline-block;"
  >
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
  by="strftime(Date, '%Y-%m')"
  limit="500"
  order_by="strftime(Date, '%Y-%m')"
>
</line-chart>
</div>



### Line Chart
<div>
<line-chart
  table="stocks"
  measure="sum(Close)"
  by="strftime(Date, '%Y-%m')"
  limit="500"
  order_by="strftime(Date, '%Y-%m')"
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


### Doughnut Chart
<div>
<doughnut-chart
  table="stocks"
  measure="max(Close)"
  by="Symbol"
  limit="10"
  order_by="max(Close) desc"
>
</doughnut-chart>
</div>


### Pie Chart
<div>
<pie-chart
  table="stocks"
  measure="max(Close)"
  by="Symbol"
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

<script type="module" src="dist/data_manager.js"></script>
<script type="module" src="dist/echarts.js"></script>
<script type="module" src="dist/datatable.js"></script>
