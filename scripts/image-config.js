/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at https://mozilla.org/MPL/2.0/. */

'use strict';

const path = require('path');
const fs = require('fs');
const os = require('os');

const ExifReader = require('exifreader');
const exifErrors = ExifReader.errors;

if (process.argv.length < 3) {
    console.log(`Usage: node ${path.basename(__filename)} <filename>`);
    process.exit();
}

const folder = process.argv[2];
const rootUrl = process.argv[3];

var fileInfo = [];

var filenames = fs.readdirSync(folder);
filenames = filenames.filter(item => !(/(^|\/)\.[^\/\.]/g).test(item));

filenames.forEach(function (filename) {
    var data = fs.readFileSync(folder + '/' + filename)

    try {
        const tags = ExifReader.load(data, { expanded: true });

        // The MakerNote tag can be really large. Remove it to lower memory
        // usage if you're parsing a lot of files and saving the tags.
        if (tags.exif) {
            delete tags.exif['MakerNote'];
        }

        // If you want to extract the thumbnail you can save it like this:
        if (tags['Thumbnail'] && tags['Thumbnail'].image) {
            fs.writeFileSync(path.join(os.tmpdir(), 'thumbnail.jpg'), Buffer.from(tags['Thumbnail'].image));
        }

        var content = {};
        content['url'] = rootUrl + filename;                     
        content['title'] = getTag(tags, 'xmp', 'title') || path.parse(filename).name;
        const description = getTag(tags, 'xmp', 'description');;
        if (description) {
            content['description'] = description;
        }
        fileInfo.push(content);
    } catch (error) {
        if (error instanceof exifErrors.MetadataMissingError) {
            console.log('No Exif data found');
        }

        console.error(error);
        process.exit(1);
    }
    
});

var config = {}
config['slides'] = fileInfo;

var jsonPath = path.join('..', 'slides-upload', 'config.json');

// write config
try {
    fs.writeFileSync(jsonPath, JSON.stringify(config))
} catch (err) {
    console.error(err)
}

function getTag(tags, group, name) {
    if (tags[group][name]) {
        if (group === 'gps') {
            return tags[group][name];
        } else if ((group === 'Thumbnail') && (name === 'type')) {
            return tags[group][name];
        } else if ((group === 'Thumbnail') && (name === 'image')) {
            return  '<image>';
        } else if ((group === 'Thumbnail') && (name === 'base64')) {
            return '<base64 encoded image>';
        } else if (Array.isArray(tags[group][name])) {
            return tags[group][name].map((item) => item.description).join(', ');
        } else {
            return tags[group][name].description;
        }
    }
    return null;
}