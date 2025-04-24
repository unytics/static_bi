---
hide:
  - navigation
  - toc
---

<style>
.md-grid {
    max-width: none!important;
}
</style>


# BigQuery Finops <unytics-app tables="daily_jobs_cost"></unytics-app>


<div class="grid cards" markdown>

-   <score-card
      title="Cost ($)"
      table="daily_jobs_cost"
      value="sum(cost)"
      format='$#,##0'>
    </score-card>

-   <score-card
      title="Nb queries"
      table="daily_jobs_cost"
      value="sum(nb)"
      format='#,##0.0,"k"'>
    </score-card>

-   <score-card
      title="Nb users"
      table="daily_jobs_cost"
      value="count(distinct user_email)">
    </score-card>

</div>




<bar-chart-grid
  table="daily_jobs_cost"
  measure="sum(cost)"
  by="user_email,node_type,node_id"
  limit="15"
  horizontal="true">
</bar-chart-grid>


<div class="grid cards" markdown>

-   <score-card
      title="Top Query Cost"
      table="daily_jobs_cost"
      value="sum(cost)"
      where="query is not null"
      by="query"
      order_by="sum(cost) desc"
      format="$#,##0">
    </score-card>

-   <score-card
      title="Top Query User"
      table="daily_jobs_cost"
      value="any_value(user_email)"
      where="query is not null"
      by="query"
      order_by="sum(cost) desc">
    </score-card>


-   <score-card
      title="Top Query"
      table="daily_jobs_cost"
      value="query"
      where="query is not null"
      order_by="sum(cost) desc"
      style_value="font-size: 0.5rem; text-align: left;">
    </score-card>

</div>


> More style [here](https://philipwalton.github.io/solved-by-flexbox/)


<script type="module" src="../src/components/unytics_app.js"></script>
<script type="module" src="../src/connectors/duckdb.js"></script>
<script type="module" src="../src/components/echarts.js"></script>
<script type="module" src="../src/components/datatable.js"></script>
<script type="module" src="../src/components/score_cards.js"></script>
