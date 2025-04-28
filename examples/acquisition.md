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


# Acquisition Dashboard <unytics-app tables="subscriptions_grouped"></unytics-app>

<div class="grid cards" markdown>

-   <score-card
      title="Nb Subscriptions"
      table="subscriptions_grouped"
      value="sum(nb)"
      format='#,##0'>
    </score-card>

-   <score-card
      title="Nb Subscriptions per month"
      table="subscriptions_grouped"
      value="sum(nb) / count(distinct date_trunc('month', date))"
      format='#,##0'>
    </score-card>

</div>


<bar-chart-grid
  table="subscriptions_grouped"
  measure="sum(nb)"
  limit="15"
  horizontal="true">
</bar-chart-grid>

<div>
<table-description-chart table="subscriptions_grouped"></table-description-chart>
</div>

<script type="module" src="../../src/components/unytics_app.js"></script>
<script type="module" src="../../src/connectors/duckdb.js"></script>
<script type="module" src="../../src/components/echarts.js"></script>
<script type="module" src="../../src/components/datatable.js"></script>
<script type="module" src="../../src/components/score_cards.js"></script>
