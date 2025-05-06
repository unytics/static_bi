---
hide:
  - navigation
---

<style>
.md-grid {
    max-width: none!important;
}
</style>

# Proposals Analysis

<source-table
    name="_proposals"
    file="https://unytics.io/api_integrations/conference_hall/forward-data/"
    columns="name as conference_name, unnest(proposals) as proposal">
</source-table>

<source-view name="proposals" style="display: none">
    select
        conference_name,
        proposal.id,
        proposal.title,
        proposal.abstract,
        (
            '### ' || proposal.title || chr(10) ||
            '**by '  || unnest(proposal.speakers).name || ' (' || unnest(proposal.speakers).company || ')**' || chr(10) || chr(10) ||
            proposal.abstract
        ) as content,
        coalesce(proposal.level, 'NA') as level,
        proposal.references as ref,
        proposal.deliberationStatus as deliberation_status,
        proposal.deliberationStatus as status,
        proposal.confirmationStatus as confirmation_status,
        proposal.publicationStatus as publication_status,
        coalesce(unnest(proposal.categories), 'NA') as category,
        unnest(proposal.tags)::VARCHAR as tag,
        split_part(coalesce(unnest(proposal.formats), 'NA'), ' — (', 1) as format,
        coalesce(unnest(proposal.languages), 'NA') as language,
        unnest(proposal.speakers).name as speaker_name,
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
      value="count(distinct speaker_name)"
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
    by="status, level, category, format, language, speaker_location, speaker_company, speaker_name"
    limit="10"
    horizontal>
</bar-chart-grid>


### Proposals

<table-chart
    table="proposals"
    by="content"
    order_by="max(review_average) desc"
    style="width: 100%; display: block; overflow-x: auto;">
</table-chart>




<script type="module" src="../../src/connectors/duckdb.js"></script>
<script type="module" src="../../src/components/source_tables.js"></script>
<script type="module" src="../../src/components/echarts.js"></script>
<script type="module" src="../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../src/components/datatable.js"></script>
<script type="module" src="../../src/components/score_cards.js"></script>
<script type="module" src="../../src/components/date_range_picker.js"></script>