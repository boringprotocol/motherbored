hello


##motherbored

We serve the front-end from this repo on a continuous deployment of the main branch to [the falcon].app (moving this to motherbored.app when we go to production)


We also have a stable dev only branch at boring.surf where things are expected to just work. DNS settings on the pi allow users who have not punched out to the internet to access this site if there is a problem. this is a emmergency door to use if the main branch has something new that has not been debugged yet. it happens almsost daily in dev


## motherbored image 

flash this upon your pi or use [these instructions for a cloud based provider]
[link to image](#)

this image should run on most anything and the GUI will give you a config file to use if you are trying to connect your machine to the network and it is not a currently supported machine such as the motherbored itself.


##motherbored-docs

- MySQL database - holds the Users, and Peers tables. read write perms to authenticated users. (Planetscale managed)
- Inlux database - reports usage statistics. we can expose this data in graphana or an influx dashboard for admins to read from. from this data a settlements implimentation can roll out. We are planning to run an influx DB on each pi. s
- 


T3 Small AWS - boring.surf. stable. no migrations. emmergency back-door. ngnx 
Netlify - GUI and Management Server. 

boring.surf 






In the file .npmrc, `engine-strict=true` is enforcing in package.json:

`"engines" : { 
    "npm" : ">=7.21.1",
    "node" : ">=16.17.0"
  },`
 
Package manager:
`yarn install` -

ESLint:
`yarn run lint` -

Database:
`npx prisma studio` - http://localhost:5555/
