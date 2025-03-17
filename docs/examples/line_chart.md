# Line Chart


<script type="module" src="../../dist/static_bi.js"></script>

<div>
<data-manager>

  <data-table
    name="stocks"
    file="https://idl.uw.edu/mosaic/data/stocks.parquet"
  ></data-table>

</data-manager>

<line-chart
  table="stocks"
  dimension="strftime(Date, '%Y-%m')"
  measure="sum(Close)"
  limit="500"
  order_by="strftime(Date, '%Y-%m')">
</line-chart>
</div>