module.exports = {
    app: {

    },
    kipalogLastPage: process.env.KIPALOG_LAST_PAGE,
    daynhauhocLastPage: process.env.DAYNHAUHOC_LAST_PAGE,
    giaphiepLastPage: process.env.GIAPHIEP_LAST_PAGE,
    vibloquestionLastPage: process.env.VIBLOQUESTION_LAST_PAGE,
    viblopostLastPage: process.env.VIBLOPOST_LAST_PAGE,
    crawlFrom: String(process.env.CRAWL_FROM).split(',')
}