# Google Cloud Release Notes

??? info "How this page was created"

    1/ The release notes are exported from a BigQuery public dataset to a public cloud storage bucket using the following query:

    ``` sql
    export data
    options (
        uri="gs://public.unytics.io/gcp_release_notes/gcp_release_notes_*.parquet",
        format='PARQUET',
        compression='SNAPPY',
        overwrite=true
    ) as
    select
        published_at as date,
        product_name,
        release_note_type,
        description,
    from bigquery-public-data.google_cloud_release_notes.release_notes
    where published_at > '2021-01-01'
    order by published_at
    ```

    2/ The query runs everyday with a scheduled query.

    3/ You can reproduce this page by simply copy-pasting the following elements in a html page:

    ``` html
    <source-table
        name="release_notes"
        url="https://storage.googleapis.com/public.unytics.io/gcp_release_notes/gcp_release_notes_000000000000.parquet">
    </source-table>


    <bar-chart-grid
        table="release_notes"
        measure="count(*)"
        by="release_note_type, product_name"
        time_by="month"
        limit="15"
        horizontal>
    </bar-chart-grid>

    <table-chart
        table="release_notes"
        by="date, product_name, release_note_type, description"
        order_by="date desc"
        limit="50">
    </table-chart>


    <script type="module" src="../../../src/connectors/duckdb.js"></script>
    <script type="module" src="../../../src/components/source_tables.js"></script>
    <script type="module" src="../../../src/components/echarts.js"></script>
    <script type="module" src="../../../src/components/bar_chart_grid.js"></script>
    <script type="module" src="../../../src/components/datatable.js"></script>

    ```




<source-table
    name="release_notes"
    url="https://storage.googleapis.com/public.unytics.io/bigquery/release_notes/2025-06-16_gcp_release_notes_000000000000.parquet">
</source-table>


<bar-chart-grid
    table="release_notes"
    measure="count(*)"
    by="release_note_type, product_name"
    time_by="month"
    limit="15"
    horizontal>
</bar-chart-grid>

<table-chart
    table="release_notes"
    by="date, product_name, release_note_type, description"
    order_by="date desc"
    limit="50">
</table-chart>


<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
