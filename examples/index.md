# Unytics App

<unytics-app></unytics-app>


### Dashboard


<div class="grid cards" markdown>

-   <bar-chart
      table="stocks"
      measure="max(Close)"
      by="Symbol"
      limit="10"
      order_by="max(Close) desc">
    </bar-chart>

-   <line-chart
      table="stocks"
      measure="max(close)"
      by="Date"
      breakdown_by="Symbol">
    </line-chart>

</div>


<script type="module" src="../src/components/unytics_app.js"></script>
<script type="module" src="../src/connectors/duckdb.js"></script>
<script type="module" src="../src/components/echarts.js"></script>
