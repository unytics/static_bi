# Example 2

## Examples

<script type="module" src="../../dist/staticBI.js"></script>

<div>
<data-manager>

  <data-table
    name="athletes"
    file="https://idl.uw.edu/mosaic/data/athletes.parquet"
  ></data-table>

</data-manager>

<line-chart
  table="athletes"
  dimension="nationality"
  measure="count(*)"
  limit="500"
  order_by="count(*) desc">
</line-chart>
</div>