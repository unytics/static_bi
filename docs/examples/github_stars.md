# GitHub Stars

Show the Stars History of any public GitHub repository.

<div style="display: flex">
    <input id="repo_input" placeholder="unytics/bigfunctions" style="border: 1px #c2f0f0 solid; font-size: 0.8rem; padding: 0.5rem; line-height: 1.6;"></input>
    <button id="repo_input_submit_button" class="md-button md-button--primary">Get Stars</button>
</div>


<source-table
    name="stars_history"
    records="stars_history">
</source-table>

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
const DEFAULT_PER_PAGE = 30;

function range(from, to) {
    const r = []
    for (let i = from; i <= to; i++) {
        r.push(i)
    }
    return r
}

function getDateString(t, format = "yyyy/MM/dd hh:mm:ss") {
    return new Date(t).toISOString().substring(0, 10);
}

async function getGithubResource(url, token) {
    url = `https://api.github.com/${url}`;

    const response = await fetch(url, {
        headers: {
            Accept: "application/vnd.github.v3.star+json",
            Authorization: token ? `token ${token}` : ""
        }
    })
    const data = await response.json();
    return {
        data,
        headers: response.headers,
        status: response.status,
    }
}

async function getRepoStargazers(repo, token, page=1) {
    return await getGithubResource(`repos/${repo}/stargazers?per_page=${DEFAULT_PER_PAGE}&page=${page}`, token)
}

async function getRepoStargazersCount(repo, token) {
    const {data, headers, status} = await getGithubResource(`repos/${repo}`, token)
    return data.stargazers_count
}

async function getRepoLogoUrl(repo, token) {
    const owner = repo.split("/")[0]
    const {data, headers, status} = await getGithubResource(`users/${owner}`, token)
    return data.owner.avatar_url
}


async function getRepoStarRecords(repo, token, maxRequestAmount) {
    const {data, headers, status} = await getRepoStargazers(repo, token)

    const headerLink = headers.get("link") || ""

    let pageCount = 1
    const regResult = /next.*&page=(\d*).*last/.exec(headerLink)

    if (regResult) {
        if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
            pageCount = Number(regResult[1])
        }
    }

    if (pageCount === 1 && data?.length === 0) {
        throw {
            status: status,
            data: []
        }
    }

    const requestPages = []
    if (pageCount < maxRequestAmount) {
        requestPages.push(...range(1, pageCount))
    } else {
        range(1, maxRequestAmount).map((i) => {
            requestPages.push(Math.round((i * pageCount) / maxRequestAmount) - 1)
        })
        if (!requestPages.includes(1)) {
            requestPages[0] = 1;
        }
    }

    const resArray = await Promise.all(
        requestPages.map((page) => {
            return getRepoStargazers(repo, token, page)
        })
    )

    const starRecordsMap = new Map()

    if (requestPages.length < maxRequestAmount) {
        const starRecordsData = []
        resArray.map((res) => {
            const { data } = res
            starRecordsData.push(...data)
        })
        for (let i = 0; i < starRecordsData.length; ) {
            starRecordsMap.set(getDateString(starRecordsData[i].starred_at), i + 1)
            i += Math.floor(starRecordsData.length / maxRequestAmount) || 1
        }
    } else {
        resArray.map(({ data }, index) => {
            if (data.length > 0) {
                const starRecord = data[0]
                starRecordsMap.set(getDateString(starRecord.starred_at), DEFAULT_PER_PAGE * (requestPages[index] - 1))
            }
        })
    }

    const starAmount = await getRepoStargazersCount(repo, token)
    starRecordsMap.set(getDateString(Date.now()), starAmount)

    const starRecords = []

    starRecordsMap.forEach((v, k) => {
        starRecords.push({
            date: k,
            nb_stars: v
        })
    })

    console.log(starRecords);
    window.stars_history = starRecords;
    return starRecords
}





getRepoStarRecords('unytics/bigfunctions', undefined, 15);

</script>





<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
<script type="module" src="../../../src/components/score_cards.js"></script>
