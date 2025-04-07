---
hide:
  - navigation
  - toc
---


# Stats

<source-table
  name="stats"
  file="../data/2025-03-28_stats.parquet"
  columns="*, date_trunc('month', date) as month">
</source-table>







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


<script type="module" src="../../src/database_connectors/duckdb.js"></script>
<script type="module" src="../../src/data_components/source_tables.js"></script>
<script type="module" src="../../src/visualization_components/echarts.js"></script>
<script type="module" src="../../src/visualization_components/datatable.js"></script>
<script type="module" src="../../src/visualization_components/score_cards.js"></script>
