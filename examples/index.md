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

# BigQuery Finops <unytics-app></unytics-app>

<div class="grid cards" markdown>

-   <score-card
      title="Cost ($)"
      table="stocks"
      value="sum(cost)"
      format='$#,##0'>
    </score-card>

-   <score-card
      title="Nb queries"
      table="stocks"
      value="sum(nb)"
      format='#,##0.0,"k"'>
    </score-card>

-   <score-card
      title="Nb users"
      table="stocks"
      value="count(distinct user_email)">
    </score-card>

</div>




<bar-chart-grid
  table="stocks"
  measure="sum(cost)"
  by="user_email,node_type,node_id"
  limit="15"
  horizontal="true">
</bar-chart-grid>


> More style [here](https://philipwalton.github.io/solved-by-flexbox/)


<script type="module" src="../src/components/unytics_app.js"></script>
<script type="module" src="../src/connectors/duckdb.js"></script>
<script type="module" src="../src/components/echarts.js"></script>
<script type="module" src="../src/components/datatable.js"></script>
<script type="module" src="../src/components/score_cards.js"></script>
