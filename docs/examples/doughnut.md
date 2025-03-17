# Doughtnut Chart

<script type="module" src="../../dist/static_bi.js"></script>

<div>
<data-manager>

  <data-table
    name="athletes"
    file="https://idl.uw.edu/mosaic/data/athletes.parquet"
  ></data-table>

</data-manager>

<doughnut-chart
  table="athletes"
  dimension="nationality"
  measure="count(*)"
  limit="10"
  order_by="count(*) desc">
</doughnut-chart>
</div>