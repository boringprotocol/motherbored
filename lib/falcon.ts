import prisma from "./prisma";

export async function GetFalconToken() {
  // if we don't have a token yet, get one
  const now = new Date(Date.now());
  try {
    const prismatoken = await prisma.falconToken.findFirstOrThrow();

    if (prismatoken.expires_at < now) {
      // token expired, get a new one
      console.log("falcon token is expired, fetching a new one");
    } else {
      console.log("found a token to use, using it");
      // use the current token
      return prismatoken.token;
    }
  } catch {
    console.log("no token yet, grabbing one");
    // create an initial blank token for updating
    const myNewToken = await prisma.falconToken.create({
      data: {
        token: "",
        expires_at: now,
      },
    });
  }

  const tokenRefresh = await prisma.falconToken.findFirst();

  if (tokenRefresh == null) {
    console.log("we screwed up, there is no db record to update for tokens");
    return "";
  }

  //if (response.status == 401) {
  console.log("fetching auth token");
  const tokenbody = {
    client_id: process.env.FALCON_CLIENT_ID,
    client_secret: process.env.FALCON_CLIENT_SECRET,
    audience: process.env.FALCON_AUDIENCE,
    grant_type: "client_credentials",
  };

  const oAuthURL = process.env.FALCON_AUTH_URL;
  if (!oAuthURL) {
    console.log(
      "FALCON_AUTH_URL is unset.  Cannot perform falcon call getToken."
    );
    return;
  }
  if (
    tokenbody.client_id != null &&
    tokenbody.client_secret != null &&
    tokenbody.audience != null
  ) {
    const tokenresponse = await fetch(oAuthURL, {
      method: "post",
      body: JSON.stringify(tokenbody),
      headers: {
        "Content-Type": "application/json",
      },
    });
    let tokendata = (await tokenresponse.json()) as any;
    let bearer_token = "Bearer " + tokendata.access_token;
    const newExpires = new Date();
    newExpires.setSeconds(now.getSeconds() + 84000);
    const setNewToken = await prisma.falconToken.update({
      where: { id: tokenRefresh.id },
      data: {
        token: bearer_token,
        expires_at: newExpires,
      },
    });

    return bearer_token;
  } else {
    return "";
  }
}

export async function CreateFalconSetupkey(
  peer_id: string,
  target_id: string,
  accesstoken: string
) {
  if (accesstoken == "") {
    console.log("FALCON CALLED W NO ACCESSKEY, set some settings.");
    return;
  }
  const body = {
    type: "reusable",
    name: target_id,
    account_id_override: target_id,
    user_id_override: target_id,
  };
  const response = await fetch(
    "https://netbird.boring.surf:33073/api/setup-keys",
    {
      method: "post",
      body: JSON.stringify(body),
      headers: {
        Accept: "application/json",
        Authorization: accesstoken,
      },
    }
  );
  console.log(response);
  const data = (await response.json()) as any;
  console.log(data);
  const updateit = await prisma.peer.update({
    where: { id: peer_id },
    data: {
      setupkey: data.key,
    },
  });
  console.log(updateit);
  return updateit;
}

export async function FalconGetPeer(id: string, accesstoken: string) {
  console.log("fetching falcon peer");
  const fetchUrl = "https://netbird.boring.surf:33073/api/peers/" + id;
  const response = await fetch(fetchUrl, {
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: accesstoken,
    },
  });

  console.log(response);
  const data = (await response.json()) as any;
  console.log(data);
  const firstPeer = data[0];

  if (response.ok) {
    if (data != null && firstPeer != null && firstPeer.key != null) {
      const peer = await prisma.peer.update({
        where: { id: id },
        data: {
          pubkey: String(firstPeer.key),
        },
      });
      console.log("updated record for." + id);
      return true;
    } else {
      console.log("data was null");
      return false;
    }
  } else {
    console.log("falcon got a bad response");
    return false;
  }
}

export async function FalconGetPeers(id: string, accesstoken: string) {
  console.log("fetching falcon peers");
  const fetchUrl =
    "https://netbird.boring.surf:33073/api/peers?user_id_override=" + id;
  const response = await fetch(fetchUrl, {
    method: "get",
    headers: {
      Accept: "application/json",
      Authorization: accesstoken,
    },
  });

  console.log(response);
  const data = (await response.json()) as any;
  const firstPeer = data[0];

  if (response.ok) {
    if (data != null && firstPeer != null && firstPeer.key != null) {
      const peer = await prisma.peer.update({
        where: { id: id },
        data: {
          pubkey: String(firstPeer.key),
        },
      });
      console.log("updated record for." + id);
      return true;
    } else {
      console.log("data was null");
      return false;
    }
  } else {
    console.log("falcon got a bad response");
    return false;
  }
}
