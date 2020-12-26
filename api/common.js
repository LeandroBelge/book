module.exports = app => {
    const getDateTimeNowPostgres = () => new Date(Date.now()).toISOString().replace('T',' ').replace('Z','')
    
    return { getDateTimeNowPostgres }
}