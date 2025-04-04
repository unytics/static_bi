---
hide:
  - navigation
  - toc
---


# Stats

<source-table name="stats" file="../data/2025-03-28_stats.parquet"></source-table>







## hey



<bar-chart-grid
  table="stats"
  measure="count(distinct user)"
  by="user_month_profile, bigfunction, domain, status, project"
  order_by="count(distinct user) desc"
  limit="15"
  horizontal="true">
</bar-chart-grid>




---



### Table Description Chart

<div>
<table-description-chart table="stats"></table-description-chart>
</div>


<script type="module" src="../../src/duckdb.js"></script>
<script type="module" src="../../src/data_manager.js"></script>
<script type="module" src="../../src/echarts.js"></script>
<script type="module" src="../../src/datatable.js"></script>
