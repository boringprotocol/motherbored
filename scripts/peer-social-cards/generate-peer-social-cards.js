#!/usr/bin/env node
const fs = require('fs');
const csv = require('csv-parser');
const { execSync } = require('child_process');

fs.createReadStream('./data/peers.csv')
    .pipe(csv())
    .on('data', (row) => {
        const name = row[0];
        const description = row[1];
        const location = row[2];
        const qrCode = `qr ${name} -o qrcode.png`;
        execSync(qrCode);
        const command = `convert background.png qrcode.png -gravity SouthWest -geometry +10+10 -composite -font jetbrains.ttf -pointsize 16 -gravity SouthWest -geometry +10+40 -annotate 0 "${name}\n${description}\n${location}" images/${name}.png`;
        execSync(command);
    })
    .on('end', (rowCount) => console.log(`Parsed ${rowCount} rows`));
