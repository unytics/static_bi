# <strong><simple-value table="proposals" value="conference_name"></simple-value></strong> Conference-Hall Proposals

<style>
.md-typeset .grid {
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
}
</style>

<source-table
    name="_proposals"
    url="https://unytics.io/api_integrations/conference_hall/forward-data/"
    columns="name as conference_name, unnest(proposals) as proposal">
</source-table>

<source-view name="proposals" style="display: none">
    select
        conference_name,
        proposal.id,
        coalesce(proposal.level, 'NA') as level,
        proposal.deliberationStatus as deliberation_status,
        proposal.deliberationStatus as status,
        proposal.confirmationStatus as confirmation_status,
        proposal.publicationStatus as publication_status,
        coalesce(unnest(proposal.categories), 'NA') as category,
        unnest(proposal.tags)::VARCHAR as tag,
        split_part(coalesce(unnest(proposal.formats), 'NA'), ' — (', 1) as format,
        coalesce(unnest(proposal.languages), 'NA') as language,
        unnest(proposal.speakers).name as speaker_id,
        coalesce(unnest(proposal.speakers).company, 'NA') as speaker_company,
        coalesce(unnest(proposal.speakers).location, 'NA') as speaker_location,
        proposal.review.average as review_average,
    from _proposals
</source-view>


<div class="grid cards" markdown>

-   <score-card
      title="Nb Proposals"
      table="proposals"
      value="count(distinct id)"
      format='#,##0'>
    </score-card>

-   <score-card
      title="Nb Speakers"
      table="proposals"
      value="count(distinct speaker_id)"
      format='#,##0'>
    </score-card>

-   <score-card
      title="Nb Companies"
      table="proposals"
      value="count(distinct speaker_company)"
      format='#,##0'>
    </score-card>

</div>


<bar-chart-grid
    table="proposals"
    measure="count(distinct id)"
    by="status, level, category, format, language, speaker_location, speaker_company"
    limit="10"
    horizontal>
</bar-chart-grid>






<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
<script type="module" src="../../../src/components/score_cards.js"></script>
<script type="module" src="../../../src/components/date_range_picker.js"></script>