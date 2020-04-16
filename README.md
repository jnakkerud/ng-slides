# ng-slides

Simple slideshow web application. 

## Getting started

### Prerequisites

Latest [Node.js](https://www.nodejs.org/) is installed.

**1. Install Angular CLI**:
```
npm install -g @angular/cli
```
**2. Run**:
```
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`
```

## Customize

### Serve images from a local directory

Create a slides-upload directory at the same level as the `ng-slides` project directory

Put images in the directory. The images will be copied to /slides-data for the server runtime

Create a json configuration file, i.e. slides-config.json

Specify the image files to serve in the config file:

```
{
    "slides": [
        {
            "url": "/slides-data/4946032222.jpg"
        },
        {
            "url": "/slides-data/4977472554.jpg",
            "title": "Central Park: ice skating",
        },
        {
            "url": "/slides-data/4977563294.jpg"
        }
    ]
}
```

Add the config file to the url: `http://localhost:4200/?config=/slides-data/slides-config.json` The url will need to be URL encoded before it can be pasted into the address bar of the browser.

### Serve images remotely

Image files can be also served remotely, just specify the url to the image:

```
{
    "slides": [
        {
            "url": "https://source.unsplash.com/1600x900/?nature,water"
        },
        {
            "url": "https://source.unsplash.com/1600x1600/?nature,forest",
        },
    ]
}
```

The config file can also be specified from a remote location. Since `ng-slides` will be loading the config from another domain, [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) can be an issue. Either
the remote server will need to allow Cross-Origin Resource Sharing or the config file will need to go through a proxy. 

### Custom configuration

Its possible to add additional configuration in the json config file.  For example add auto-play to the slideshow or adding sound to play in the background:

```
{
    "slides": [
        {
            "url": "/slides-data/4946032222.jpg"
        },
        {
            "url": "/slides-data/4977472554.jpg",
            "title": "Central Park: ice skating",
        },
        {
            "url": "/slides-data/4977563294.jpg"
        }
    ],
    "sounds": [
        {
            "url": "/slides-data/favorite-tune.mp3"
        },
    ],
   "imageSliderConfig": {
        "autoPlayDuration": 5000,
    }
}
```

There are more config options available, see [data.service.ts](https://github.com/jnakkerud/ng-slides/blob/master/src/app/data.service.ts)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

