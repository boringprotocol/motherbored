# motherbored

Oh yeah!!

https://motherbored.app - dev-preview

This is the front-end GUI for managing peers (Motherboreds). It is a Next.js application running atop [Netbird](https://github.com/boringprotocol/netbird) (fork), WireGuard®, Pion ICE (WebRTC), and Coturn. All open-source technologies making up the network stack.

It is running in constant contact with another Node.js app installed on each peer. That repository can be found here:
[connect-pi](https://github.com/boringprotocol/connect-pi)

This peer application, connect-pi, handles communication with the user interface served at https://motherbored.app and handles running of various configuration scripts which can be found here:

- [boring-scripts](https://github.com/boringprotocol/boring-scripts) - startup scripts for motherbored (PI/arm)
- [boring-scripts-intel](https://github.com/boringprotocol/boring-scripts-intel) - startup scripts for motherbored (intel edition)

### Run a Peer

1. Flash this [image](https://s3.us-east-2.amazonaws.com/boringfiles.dank.earth/2022-10-03-boring-lite.zip) on a Raspberry Pi or use [these instructions for a cloud based provider](#)
2. https://motherbored.app (follow steps presented here)

Build an image: [pi-gen](https://github.com/boringprotocol/pi-gen) - raspi image builder

---

### Local Development

A MySql DB and managament of schema with Prisma contained within this applicaiton. Influx is running on connect-pi. next-auth is modified to use Solana wallet authentication w/ Auth0.

## .env

```
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# Environment variables declared in this file are automatically made available to Prisma.
# See /prisma/schema.prisma and migrations


# Prisma supports the native connection string format for MySQL which we use to store Peer and User records.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

# Database connection (MySql)
DATABASE_URL=""
# SHADOW_DATABASE_URL=""
# DATABASE_URL=""


INFLUX_TOKEN=""
INFLUX_URL=""
INFLUX_ORG=""
INFLUX_BUCKET=""
```
