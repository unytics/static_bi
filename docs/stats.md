---
hide:
  - navigation
  - toc
---


# Stats

<div>
<data-manager>

  <data-manager-table name="stats" file="../data/2025-03-26_stats.parquet"></data-manager-table>

</data-manager>
</div>


### Nb users
<div>
<line-chart
  table="stats"
  measure="count(distinct user)"
  by="strftime(date, '%Y-%m')"
  order_by="strftime(date, '%Y-%m')"
>
</line-chart>
</div>

### Bar Chart Grid (by user)
<div>
<bar-chart-grid
  table="stats"
  measure="count(distinct user)"
  by="bigfunction, is_service_account, domain, status, project"
  order_by="count(distinct user) desc"
  limit="10"
  horizontal="true"
>
</bar-chart-grid>
</div>





### Table Description Chart

<div>
<table-description-chart table="stats"></table-description-chart>
</div>



### Horitonal Bar Chart by user
<div>
<bar-chart
  table="stats"
  measure="count(distinct date)"
  by="project"
  order_by="count(distinct date) desc"
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
>
</line-chart>
</div>



<script type="module" src="../dist/data_manager.js"></script>
<script type="module" src="../dist/echarts.js"></script>
<script type="module" src="../dist/datatable.js"></script>
