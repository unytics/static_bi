---
hide:
  - navigation
  - toc
---


# Stats

<div>
<data-manager>

  <data-manager-table name="stats" file="../data/2025-03-28e/stats_000000000000.parquet"></data-manager-table>

</data-manager>
</div>







## hey

<div class="grid cards" markdown>

-   <bar-chart
      table="stats"
      measure="count(distinct user)"
      by="strftime(date, '%Y-%m')"
      breakdown_by="user_month_profile"
      order_by="date"
      stacked="true">
    </bar-chart>

-   <bar-chart
      table="stats"
      measure="count(distinct user)"
      by="date"
      breakdown_by="user_month_profile"
      order_by="date"
      stacked="true">
    </bar-chart>

-   <line-chart
      table="stats"
      measure="count(distinct user)"
      by="strftime(date, '%Y-%m')"
      order_by="strftime(date, '%Y-%m')">
    </line-chart>

</div>



<bar-chart-grid
  table="stats"
  measure="count(distinct user)"
  by="user_month_profile, bigfunction, domain, status, project"
  order_by="count(distinct user) desc"
  limit="10"
  horizontal="true">
</bar-chart-grid>




---



### Table Description Chart

<div>
<table-description-chart table="stats"></table-description-chart>
</div>


<script type="module" src="../dist/data_manager.js"></script>
<script type="module" src="../dist/echarts.js"></script>
<script type="module" src="../dist/datatable.js"></script>
