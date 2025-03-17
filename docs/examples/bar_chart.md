# Bar Chart

<script type="module" src="../../dist/static_bi.js"></script>

<div>
<data-manager>

  <data-table
    name="athletes"
    file="https://idl.uw.edu/mosaic/data/athletes.parquet"
  ></data-table>

</data-manager>

<bar-chart
  table="athletes"
  dimension="nationality"
  measure="count(*)"
  limit="500"
  order_by="count(*) desc">
</bar-chart>
</div>