# Stats

<div>
<data-manager>

  <data-manager-table name="stats" file="../data/stats_000000000000.parquet"></data-manager-table>

</data-manager>
</div>


### Table Description Chart

<div>
<table-description-chart table="stats"></table-description-chart>
</div>


### Horitonal Bar Chart by user
<div>
<bar-chart
  table="stats"
  measure="sum(nb_calls)"
  by="domain"
  order_by="sum(nb_calls) desc"
  limit="10"
  horizontal="true"
>
</bar-chart>
</div>



### Bar Chart by user
<div>
<bar-chart
  table="stats"
  measure="sum(nb_calls)"
  by="domain"
  order_by="sum(nb_calls) desc"
  limit="10"
>
</bar-chart>
</div>

### Nb Calls Over Time

### Table Chart
<div>
<table-chart
  table="stats"
  by="date"
  measures="sum(nb_calls)"
  order_by="date desc"
  limit="10"
>
</table-chart>
</div>


### Line Chart by user
<div>
<line-chart
  table="stats"
  measure="sum(nb_calls)"
  by="date"
  breakdown_by="domain"
  order_by="date"
  limit="10"
>
</line-chart>
</div>

### Line Chart
<div>
<line-chart
  table="stats"
  measure="sum(nb_calls)"
  by="date"
  order_by="date"
  limit="10"
>
</line-chart>
</div>



<script type="module" src="../dist/data_manager.js"></script>
<script type="module" src="../dist/echarts.js"></script>
<script type="module" src="../dist/datatable.js"></script>
