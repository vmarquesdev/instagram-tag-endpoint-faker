## INSTAGRAM TAGS ENDPOINT FAKER

It is a simple library that simulates the responses of the tags endpoint of the instagram API, this library stores the data in a local folder in json format.

## Demo

[View demo application](http://159.203.102.243)
You can use the endpoints below to see how it works.

## Usage

Install dependencies and start app

```console
$ npm install && npm start
```

Generate new tags:

```console
$ curl -I http://localhost:3000/v1/tags/:tag-name/media/generate
```

Add new medias to an existing tag:

```console
$ curl -I http://localhost:3000/v1/tags/:tag-name/media/generate?count=500
```

See a Tag:

```console
$ curl -s -D "/dev/stderr" http://localhost:3000/v1/tags/:tag-name | jq
```

See the medias of a tag:

```console
$ curl -s -D "/dev/stderr" http://localhost:3000/v1/tags/:tag-name/media/recent | jq
```

## Author

- **Victor Hugo Marques** - [https://vmarquesdev.github.io](https://vmarquesdev.github.io)
