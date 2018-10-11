const express = require("express");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const bodyParser = require("body-parser");
const dataBuilder = require("./utils/dataBuilder");

const port = process.env.PORT || 9000;
const domain = process.env.DOMAIN;

const app = express();

function ensureDomain(req, res, next) {
  if (!domain || req.hostname === domain) {
    return next();
  }

  res.redirect(`http://${domain}${req.url}`);
}

app.all("*", ensureDomain);

app.use(compression());

// app.enable("trust proxy");
//
// app.use(
//   rateLimit({
//     windowMs: 1 * 60 * 1000,
//     max: 25
//   })
// );

app.use(bodyParser.json());

app.get("/v1/tags/:tag/media/recent", (req, res) => {
  const { tag } = req.params,
    result = dataBuilder.fetchMediaByTag(tag, parseInt(req.query["page"]));
  pagination = {};

  if (result.nextPage !== 1) {
    pagination["next_url"] = result.data.length
      ? `${req.protocol}://${req.get(
          "host"
        )}/v1/tags/${tag}/media/recent?page=${result.nextPage}`
      : null;
  }

  res.status(200).send({
    pagination: pagination,
    data: result.data,
    meta: {
      code: 200
    }
  });
});

app.get("/v1/tags/:tag", (req, res) => {
  const { tag } = req.params,
    result = dataBuilder.fetchAllMediaByTag(tag);

  res.status(200).send({
    data: {
      name: tag,
      media_count: result ? result : 0
    },
    meta: {
      code: 200
    }
  });
});

app.get("/v1/tags/:tag/media/generate", (req, res) => {
  const count = req.query["count"] || 1;

  dataBuilder.buildTagAndAddMedias(req.params.tag, count);

  res.status(200).send({
    meta: {
      code: 200
    }
  });
});

app.listen(port, () => console.log("Server running..."));
