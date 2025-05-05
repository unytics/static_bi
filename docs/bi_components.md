# BI Components


## Source Table

=== "UI"
    > Source Table component is invisible on the page. The file is downloaded in the background and loaded into a DuckDB table.
    <source-table
      name="stocks"
      file="https://idl.uw.edu/mosaic/data/stocks.parquet"
      columns="*, Symbol as company, Close as stock_value, date_trunc('month', Date) as month, strftime(date, '%Y') as year">
    </source-table>

=== "Code"
    ``` html
    <source-table
      name="stocks"
      file="https://idl.uw.edu/mosaic/data/stocks.parquet"
      columns="*, Symbol as company, Close as stock_value, date_trunc('month', Date) as month, strftime(date, '%Y') as year">
    </source-table>
    ```




## Score Card

=== "UI"
    <score-card
      title="Nb companies"
      table="stocks"
      value="count(distinct company)">
    </score-card>

=== "Code"
    ``` html
    <score-card
      title="Nb companys"
      table="stocks"
      value="count(distinct company)">
    </score-card>
    ```


## Bar Chart

### Simple

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc">
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc">
    </bar-chart>
    ```

### Horizontal

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc"
      horizontal>
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc"
      horizontal>
    </bar-chart>
    ```


### Grouped

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10">
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10">
    </bar-chart>
    ```


### Grouped Horizontal

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      horizontal>
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      horizontal>
    </bar-chart>
    ```



### Stacked

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked>
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked>
    </bar-chart>
    ```


### Stacked Horizontal

=== "UI"
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked
      horizontal>
    </bar-chart>

=== "Code"
    ``` html
    <bar-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked
      horizontal>
    </bar-chart>
    ```




## Line Chart

### Simple

=== "UI"
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc">
    </line-chart>

=== "Code"
    ``` html
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="company"
      limit="10"
      order_by="max(stock_value) desc">
    </line-chart>
    ```

### Grouped

=== "UI"
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10">
    </line-chart>

=== "Code"
    ``` html
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10">
    </line-chart>
    ```



### Stacked

=== "UI"
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked>
    </line-chart>

=== "Code"
    ``` html
    <line-chart
      table="stocks"
      measure="max(stock_value)"
      by="year"
      breakdown_by="company"
      limit="10"
      stacked>
    </line-chart>
    ```




## Table Chart


### Tables List

=== "UI"
    <tables-list-chart></tables-list-chart>

=== "Code"
    ``` html
    <tables-list-chart></tables-list-chart>
    ```


### Table Schema

=== "UI"
    <table-description-chart table="stocks"></table-description-chart>

=== "Code"
    ``` html
    <table-description-chart table="stocks"></table-description-chart>
    ```


### Table Chart

=== "UI"
    <table-chart
      table="stocks"
      measures="sum(volume), sum(close)"
      by="date, company"
      limit="10"
      order_by="date desc">
    </table-chart>

=== "Code"
    ``` html
    <table-chart
      table="stocks"
      measures="sum(volume), sum(close)"
      by="date, company"
      limit="10"
      order_by="date desc">
    </table-chart>
    ```





## Controls

### Date Range

=== "UI"
    <date-range-picker></date-range-picker>

=== "Code"
    ``` html
    <date-range-picker></date-range-picker>
    ```





<script type="module" src="../../src/connectors/duckdb.js"></script>
<script type="module" src="../../src/components/source_tables.js"></script>
<script type="module" src="../../src/components/echarts.js"></script>
<script type="module" src="../../src/components/datatable.js"></script>
<script type="module" src="../../src/components/score_cards.js"></script>
<script type="module" src="../../src/components/date_range_picker.js"></script>
