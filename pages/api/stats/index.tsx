import { getSession } from "next-auth/react";
import { GetStatsForPubkey } from "../../../lib/influx";
// import prisma from "../../../lib/prisma";

// GET /api/stats
// This function fetches stats data for a peer with a given pubkey
// It returns a JSON object with the stats data
export default async function handle(req: any, res: any) {
// Get the pubkey from the query string of the request
const pubkey = req.query.pubkey
// Get the session object for the current request
const session = await getSession({ req });
// If session is invalid, return a 403 status code
if (!session) {
res.statusCode = 403;
return "session invalid"
}
// Try to get the stats data for the given pubkey
// If successful, return a 200 status code with the stats data in the response
// Otherwise, return a 500 status code with an error message
try {
const statsResult = await GetStatsForPubkey("LrTPUkTIv5J5gaBBY2vsyWiD90qQlhGfDYN7iIveXEg=");
//const statsResult = await GetStatsForPubkey(pubkey);
res.statusCode = 200;
res.json(statsResult);
} catch {
res.status(500).json("error")
}

}
