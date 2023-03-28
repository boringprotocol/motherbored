/** InfluxDB v2 URL */
const url = process.env["INFLUX_URL"] || "http://localhost:8086";
const token = process.env["INFLUX_TOKEN"] || "my-token";
const org = process.env["INFLUX_ORG"] || "my-org";
const bucket = "my-bucket";

type InfluxData = {
  result: number;
  [key: string]: any;
};

import { InfluxDB, FluxTableMetaData } from "@influxdata/influxdb-client";

export async function GetPeersForPubkey(pubkey: string, range: string) {
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);

  const fluxQuery =
    'from(bucket:"boringstats") |> range(start: -' +
    range +
    ') |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["mypubkey"] == "' +
    pubkey +
    '") |> group(columns: ["mypubkey"], mode: "by") |> distinct(column: "public_key") |> count()';

  console.log("*** QUERY: ***" + fluxQuery);
  try {
    const data = await queryApi.collectRows(
      fluxQuery /*, you can specify a row mapper as a second arg */
    );
    console.log("\nCollect ROWS SUCCESS");
    const connectedCount = (data[0] as InfluxData)?.["result"] || 0;
    return connectedCount;
  } catch (e) {
    console.error(e);
    console.log("\nCollect ROWS ERROR");
    return e;
  }
}

export async function GetStatsForPubkey(pubkey: string) {
  const queryApi = new InfluxDB({ url, token }).getQueryApi(org);
  const fluxQuery =
    'from(bucket:"boringstats") |> range(start: -7d) |> filter(fn: (r) => r["_measurement"] == "wireguard_peer") |> filter(fn: (r) => r["_field"] == "tx_bytes" or r["_field"] == "rx_bytes" ) |> filter(fn: (r) => r["mypubkey"] == "' +
    pubkey +
    '") |> difference(nonNegative: true) |> group(columns: ["_measurement", "_field", "public_key"]) |> aggregateWindow(every: 1d, fn: sum, createEmpty: false)';
  console.log("*** QUERY: ***" + fluxQuery);

  try {
    const data = await queryApi.collectRows(
      fluxQuery /*, you can specify a row mapper as a second arg */
    );

    data.forEach((x) => {
      console.log(JSON.stringify(x));
    });

    //res.status(200).json(data)
    console.log("\nCollect ROWS SUCCESS");
    return data;
  } catch (e) {
    console.error(e);
    console.log("\nCollect ROWS ERROR");
    return e;
  }
}

export { url, token, org, bucket };
