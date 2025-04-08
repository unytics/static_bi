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



<date-range-picker></date-range-picker>



## hey

<input type="date" id="my-date-picker" name="my-date" />



<bar-chart-grid
  table="stats"
  measure="count(distinct user)"
  by="user_month_profile, bigfunction, domain, status, project"
  limit="15"
  horizontal="true">
</bar-chart-grid>




---



### Table Description Chart

<div>
<table-description-chart table="stats"></table-description-chart>
</div>


<script type="module" src="../../src/connectors/duckdb.js"></script>
<script type="module" src="../../src/components/source_tables.js"></script>
<script type="module" src="../../src/components/echarts.js"></script>
<script type="module" src="../../src/components/datatable.js"></script>
<script type="module" src="../../src/components/score_cards.js"></script>
<script type="module" src="../../src/components/date_range_picker.js"></script>
