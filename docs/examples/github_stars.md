# GitHub Stars

<source-table
    name="stars_history"
    records="stars_history">
</source-table>

<line-chart
    table="stars_history"
    by="date"
    measure="any_value(count)"
    order_by="date">
</line-chart>
<table-description-chart table="stars_history"></table-description-chart>




<script src="https://cdnjs.cloudflare.com/ajax/libs/axios/1.9.0/axios.min.js" integrity="sha512-FPlUpimug7gt7Hn7swE8N2pHw/+oQMq/+R/hH/2hZ43VOQ+Kjh25rQzuLyPz7aUWKlRpI7wXbY6+U3oFPGjPOA==" crossorigin="anonymous" referrerpolicy="no-referrer"></script>
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

async function getRepoStargazers(repo, token, page) {
    let url = `https://api.github.com/repos/${repo}/stargazers?per_page=${DEFAULT_PER_PAGE}`

    if (page !== undefined) {
        url = `${url}&page=${page}`
    }
    return axios.get(url, {
        headers: {
            Accept: "application/vnd.github.v3.star+json",
            Authorization: token ? `token ${token}` : ""
        }
    })
}

async function getRepoStargazersCount(repo, token) {
    const { data } = await axios.get(`https://api.github.com/repos/${repo}`, {
        headers: {
            Accept: "application/vnd.github.v3.star+json",
            Authorization: token ? `token ${token}` : ""
        }
    })

    return data.stargazers_count
}

async function getRepoStarRecords(repo, token, maxRequestAmount) {
    const patchRes = await getRepoStargazers(repo, token)

    const headerLink = patchRes.headers["link"] || ""

    let pageCount = 1
    const regResult = /next.*&page=(\d*).*last/.exec(headerLink)

    if (regResult) {
        if (regResult[1] && Number.isInteger(Number(regResult[1]))) {
            pageCount = Number(regResult[1])
        }
    }

    if (pageCount === 1 && patchRes?.data?.length === 0) {
        throw {
            status: patchRes.status,
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
            count: v
        })
    })

    console.log(starRecords);
    window.stars_history = starRecords;
    return starRecords
}

async function getRepoLogoUrl(repo, token) {
    const owner = repo.split("/")[0]
    const { data } = await axios.get(`https://api.github.com/users/${owner}`, {
        headers: {
            Accept: "application/vnd.github.v3.star+json",
            Authorization: token ? `token ${token}` : ""
        }
    })

    return data.avatar_url
}


getRepoStarRecords('unytics/bigfunctions', undefined, 15);

</script>





<script type="module" src="../../../src/connectors/duckdb.js"></script>
<script type="module" src="../../../src/components/source_tables.js"></script>
<script type="module" src="../../../src/components/echarts.js"></script>
<script type="module" src="../../../src/components/bar_chart_grid.js"></script>
<script type="module" src="../../../src/components/datatable.js"></script>
<script type="module" src="../../../src/components/score_cards.js"></script>
