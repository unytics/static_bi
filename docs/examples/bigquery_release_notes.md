# BigQuery Release Notes

<source-table
    name="__release_notes"
    url="https://xml2json.paul-marcombes.workers.dev/?url=https://cloud.google.com/feeds/bigquery-release-notes.xml"
    columns='feed, unnest(feed.entry) as entry'>
</source-table>

<simple-value
    table="release_notes"
    value="entry">
</simple-value>

<table-chart
    table="release_notes"
    by="entry_title, entry_id, entry_date, entry_link, type"
    limit="10">
</table-chart>

<source-view name="_release_notes" style="display: none">
    select
        feed.id as feed_id,
        feed.title as feed_title,
        feed.link."@_href" as feed_url,
        feed.author.name as feed_author,
        cast(feed.updated as date) as feed_date,
        entry.title as entry_title,
        entry.id as entry_id,
        cast(entry.updated as date) as entry_date,
        entry.link."@_href" as entry_link,
        unnest(regexp_split_to_array(entry.content."#text", '<h3')) as entry,
    from __release_notes
</source-view>


<source-view name="release_notes" style="display: none">
    select
        * exclude(entry),
        regexp_extract(entry, '>([^<]*)</h3') as type,
    from _release_notes
    where entry != ''
</source-view>


<table-description-chart table="release_notes"></table-description-chart>


<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
<script type="module" src="../../../src/components/score_cards.js"></script>
