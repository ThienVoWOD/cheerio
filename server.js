const express = require("express");
const request = require("request-promise");
const cheerio = require("cheerio");
const moment = require("moment");
moment.locale("vi");
// const bodyParser = require("body-parser");
const tough = require("tough-cookie");

const app = express();

// app.use(bodyParser());

app.get("/movies", async (req, res) => {
  const url = "https://moveek.com/dang-chieu/";

  const $ = await request({
    url,
    transform: cheerio.load,
  });

  // return res.send($('title').text());

  const movies = [];
  $(".item").each((index, element) => {
    const href = $(element).find("h3 > a").attr("href");
    const title = $(element).find("h3 > a").attr("title");
    const thumbUrl = $(element).find("img").attr("data-src");
    const date = $(element).find(".no-gutters .col").first().text().trim();

    const dateFormated = moment(date, "DD/MM").fromNow();

    movies.push({
      href: `https://moveek.com${href}`,
      title,
      thumbUrl,
      dateFormated,
    });
  });

  return res.json(movies);
});

app.get("/movies/:slug", async (req, res) => {
  const url = `https://moveek.com/phim/${req.params.slug}`;

  const $ = await request({
    url,
    transform: cheerio.load,
  });

  return res.send($("title").text());
});

app.get("/posts", async (req, res) => {});

app.get("/post/:slug/:id", async (req, res) => {});

const port = process.env.port || 9000
app.listen(port, () => {
  console.log("connect success")
});
