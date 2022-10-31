/** InfluxDB v2 URL */
const url = process.env['INFLUX_URL'] || 'http://localhost:8086'
/** InfluxDB authorization token */
const token = process.env['INFLUX_TOKEN'] || 'my-token'
/** Organization within InfluxDB  */
const org = process.env['INFLUX_ORG'] || 'my-org'
/**InfluxDB bucket used in examples  */
const bucket = 'my-bucket'

import { InfluxDB, FluxTableMetaData } from '@influxdata/influxdb-client'

export async function GetPeersForPubkey(pubkey: string, range: string) {
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org)

    const fluxQuery = 'from(bucket:"boringstats") |> range(start: -' + range + ') |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '") |> group(columns: ["mypubkey"], mode: "by") |> distinct(column: "public_key") |> count()'

    console.log('*** QUERY: ***' + fluxQuery)
    try {
        const data = await queryApi.collectRows(
            fluxQuery /*, you can specify a row mapper as a second arg */
        )
        console.log('\nCollect ROWS SUCCESS')
        //res.status(200).json(data)
        return data
    } catch (e) {
        console.error(e)
        console.log('\nCollect ROWS ERROR')
        return e
    }
}

export async function GetStatsForPubkey(pubkey: string) {
    const queryApi = new InfluxDB({ url, token }).getQueryApi(org)
    const fluxQuery = 'from(bucket:"boringstats") |> range(start: -7d) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "tx_bytes" or r["_field"] == "rx_bytes" ) |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '") |> difference(nonNegative: true) |> group(columns: ["_measurement", "_field", "public_key"]) |> aggregateWindow(every: 1d, fn: sum, createEmpty: false)'
    //const fluxQuery = 'from(bucket:"boringstats") |> range(start: -7d) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "rx_bytes" ) |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '" and r["_field"] == "rx_bytes") |> difference(nonNegative: true) |> group(columns: ["_measurement", "_field", "public_key"]) |> aggregateWindow(every: 1d, fn: sum, createEmpty: true)'

    //'from(bucket:"boringstats") |> range(start: -7d) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "rx_bytes") |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '") |> group(columns: ["_measurement", "_field", "public_key"]) |> derivative(unit: 1h, nonNegative: true)|> aggregateWindow(every: 24h, fn: sum, createEmpty: false)'
    //'from(bucket:"boringstats") |> range(start: -7d) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "rx_bytes") |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '") |> group(columns: ["_measurement", "_field", "public_key"]) |> derivative(unit: 1s, nonNegative: true)|> aggregateWindow(every: 24h, fn: mean, createEmpty: false)'


    //'from(bucket:"boringstats") |> range(start: -15m) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "rx_bytes" or r["_field"] == "tx_bytes") |> filter(fn: (r) => r["mypubkey"] == "' + pubkey + '") |> group(columns: ["_measurement", "_field", "public_key"]) |> derivative(unit: 1m, nonNegative: true)|> aggregateWindow(every: 10m, fn: mean, createEmpty: false) |> truncateTimeColumn(unit: 1s) |> yield(name: "mean")'
    console.log('*** QUERY: ***' + fluxQuery)

    try {
        const data = await queryApi.collectRows(
            fluxQuery /*, you can specify a row mapper as a second arg */
        )
        /*
        data.forEach((x) => {

            console.log(JSON.stringify(x))

        })
        */
        //res.status(200).json(data)
        console.log('\nCollect ROWS SUCCESS')
        return data
    } catch (e) {
        console.error(e)
        console.log('\nCollect ROWS ERROR')
        return e
    }

    /*
    // this method didn't work right (exception)
       queryApi.queryRows(fluxQuery, {
           next: (row: string[], tableMeta: FluxTableMetaData) => {
               const o = tableMeta.toObject(row)
               console.log(JSON.stringify(o, null, 2))
               //res.status(200).json(JSON.stringify(o, null, 2))
           },
           error: (error: Error) => {
               console.error(error)
               console.log('\nFinished ERROR')
           },
           complete: () => {
               console.log('\nFinished SUCCESS')
           },
       })
   
   */
}

export { url, token, org, bucket }