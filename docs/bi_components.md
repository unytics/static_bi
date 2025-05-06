# BI Components


## Bar Chart

### Simple Bar Chart

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

### Horizontal Bar Chart

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


### Multi Bar Chart

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


### Multi Horizontal Bar Chart

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



### Stacked Bar Chart

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


### Stacked Horizontal Bar Chart

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

### Simple Line Chart

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

### Multi Line Chart

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



### Stacked Line Chart

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
      title="Nb companies"
      table="stocks"
      value="count(distinct company)">
    </score-card>
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


## Source Table

=== "UI"
    > Source Table component is invisible on the page. The data is downloaded in the background and loaded into a DuckDB table.
    <source-table
      name="stocks"
      url="https://idl.uw.edu/mosaic/data/stocks.parquet"
      columns="*, Symbol as company, Close as stock_value, date_trunc('month', Date) as month, strftime(date, '%Y') as year">
    </source-table>

=== "Code"
    ``` html
    <source-table
      name="stocks"
      url="https://idl.uw.edu/mosaic/data/stocks.parquet"
      columns="*, Symbol as company, Close as stock_value, date_trunc('month', Date) as month, strftime(date, '%Y') as year">
    </source-table>
    ```




## Controls

### Date Range

=== "UI"
    <date-range-picker></date-range-picker>

=== "Code"
    ``` html
    <date-range-picker></date-range-picker>
    ```



<input id="email_input"></input>
<button id="email_input_submit_button">Submit</button>

<script>
document.getElementById('email_input_submit_button').onclick = async (event) => {
    alert('hello!');
    const email = document.getElementById('email_input_submit_button').value;
    alert(email);
    const google_form_url = 'https://docs.google.com/forms/d/e/1FAIpQLSe03sAb8y_h4YWTNujH3vFpYFkgAAsGeH8l3kK6wOygIqV08w/viewform?usp=pp_url&entry.1010327462=';
    const submission_url = google_form_url + email;
    const response = await fetch(
        submission_url,
        {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );
    alert('Thanks');
</script>


<script type="module" src="../../src/connectors/duckdb.js"></script>
<script type="module" src="../../src/components/source_tables.js"></script>
<script type="module" src="../../src/components/echarts.js"></script>
<script type="module" src="../../src/components/datatable.js"></script>
<script type="module" src="../../src/components/score_cards.js"></script>
<script type="module" src="../../src/components/date_range_picker.js"></script>
