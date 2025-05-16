# GitHub Stars

Show the Stars History of any public GitHub repository.


<div style="display: flex">
    <input id="repo_input" placeholder="unytics/bigfunctions" value="unytics/bigfunctions" style="border: 1px #c2f0f0 solid; font-size: 0.8rem; padding: 0.5rem; line-height: 1.6;"></input>
    <button id="submit_button" class="md-button md-button--primary">Get Stars</button>
</div>


<source-table name="stars_history"></source-table>

<score-card
    table="stars_history"
    title="Nb Stars"
    value="max(nb_stars)">
</score-card>

<line-chart
    table="stars_history"
    by="date"
    measure="nb_stars"
    order_by="date">
</line-chart>


> This example fetches data from GitHub API using javascript and then call `source_table.load` to load the data into the component.


??? info "See the code"

    ``` html
    # GitHub Stars

    Show the Stars History of any public GitHub repository.

    <div>
        <input id="repo_input"></input>
        <button id="submit_button">Get Stars</button>
    </div>


    <source-table name="stars_history"></source-table>

    <score-card
        table="stars_history"
        title="Nb Stars"
        value="max(nb_stars)">
    </score-card>

    <line-chart
        table="stars_history"
        by="date"
        measure="nb_stars"
        order_by="date">
    </line-chart>


    <script>
        const source_table = document.querySelector("source-table");
        const repo_input = document.getElementById("repo_input");

        const load_data = async () => {
            const repo = repo_input.value;
            const response = await fetch(`https://unytics.io/github_star_history/?repo=${repo}`)
            source_table.data = await response.json();
            await source_table.load(true);
        }

        const submit_button = document.getElementById("submit_button");
        submit_button.onclick = load_data;
    </script>

    <script type="module" src="../../../src/connectors/duckdb.js"></script>
    <script type="module" src="../../../src/components/source_tables.js"></script>
    <script type="module" src="../../../src/components/score_cards.js"></script>
    <script type="module" src="../../../src/components/echarts.js"></script>
    ```




<script>

const source_table = document.querySelector("source-table");
const repo_input = document.getElementById("repo_input");
const submit_button = document.getElementById("submit_button");

const load_data = async () => {
    const repo = repo_input.value;
    if (!repo) {
        return;
    }
    const response = await fetch(`https://unytics.io/github_star_history/?repo=${repo}`)
    source_table.data = await response.json();
    await source_table.load(true);
}

submit_button.onclick = load_data;
repo_input.addEventListener("keyup", ({key}) => {
    if (key === "Enter") {
        load_data();
    }
});

load_data();



</script>





<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/score_cards.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
