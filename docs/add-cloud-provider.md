---
title: 'Add cloud provider'
metaTitle: 'Add cloud provider'
metaDesc: 'Whether your want to be logged in as root or not is up to you bud.'
socialImage: public/img/cathy.png
date: '2022-09-24'
tags:
  - cloud
  - provider
---

# Add cloud provider workflow Genereal Instructions

*Whether your want to be logged in as root or not is up to you bud.*

1. First create provider peer in the Motherbored interface. 
2. Download boring.env use this config on your server at /boot/boring.env )

## SSH into your server

`ssh root@[IP]`

tldr;

```
sudo su -
```


## The Boring Config

ssh to your server

`vi /boot/boring.env` 
paste the boring.env config file that was downloaded
and save it.

## The Boring Installer

download and run the installer

```
wget https://s3.us-east-2.amazonaws.com/boringfiles.dank.earth/install.sh
chmod +x install.sh
./install.sh
```

congrats you're done!


---
#forgot to get the config? or need to use a different config 

edit the /boot/boring.env and:

```
systemctl restart boring
```

# to read the boring logs
```
journalctl -u boring
```

and then there will be birb

Now you can activate on the falcon

and then there will be birb for sure this time
