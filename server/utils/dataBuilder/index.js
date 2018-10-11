const _ = require("underscore");
const fs = require("fs");
const casual = require("casual");

const PAGINATION_DEFAULT_LIMIT = 33;

const fetchMediaByTag = (tag, page = 1) => {
  page = page || 1;

  try {
    const path = `./server/utils/dataBuilder/data/${tag}.json`,
      json = JSON.parse(fs.readFileSync(path))
        .reverse()
        .filter(item => !item.private)
        .sort((a, b) => b.created_time - a.created_time),
      data = paginate(json, PAGINATION_DEFAULT_LIMIT, page),
      nextPage =
        page < 1
          ? 1
          : page < Math.ceil(json.length / PAGINATION_DEFAULT_LIMIT)
            ? page + 1
            : 1;

    return {
      data,
      nextPage
    };
  } catch (e) {
    return {
      data: []
    };
  }
};

const fetchAllMediaByTag = tag => {
  try {
    const path = `./server/utils/dataBuilder/data/${tag}.json`;
    return JSON.parse(fs.readFileSync(path)).length;
  } catch (e) {
    return false;
  }
};

const buildTagAndAddMedias = (tag, count) => {
  const path = `./server/utils/dataBuilder/data/${tag}.json`;
  let medias;

  if (!fs.existsSync(path)) {
    medias = buildRandomMedia(tag, 5 + count);
  } else {
    medias = JSON.parse(fs.readFileSync(path)).concat(
      buildRandomMedia(tag, count)
    );
  }

  fs.writeFileSync(path, JSON.stringify(medias));
};

const buildRandomMedia = (tag, count = 1) => {
  let medias = [];

  for (var i = 0; i < count; i++) {
    let username = casual.word,
      likesNumber = Math.floor(Math.random() * 1000) + 1,
      photoNumber = Math.floor(Math.random() * 1000) + 0,
      commentsNumber = Math.floor(Math.random() * 1000) + 1;

    medias.push({
      id: casual.random.toString(),
      private: casual.boolean,
      user: {
        username: username
      },
      images: {
        thumbnail: {
          width: 150,
          height: 150,
          url: `https://picsum.photos/150/150/?image=${photoNumber}`
        },
        low_resolution: {
          width: 320,
          height: 320,
          url: `https://picsum.photos/320/320/?image=${photoNumber}`
        },
        standard_resolution: {
          width: 640,
          height: 640,
          url: `https://picsum.photos/650/650/?image=${photoNumber}`
        }
      },
      created_time: Math.round(new Date().getTime() / 1000) + 10 * i,
      caption: {
        id: "17863225864247137",
        text: casual.text,
        from: {
          username: username
        }
      },
      user_has_liked: false,
      likes: {
        count: likesNumber
      },
      tags: [tag],
      filter: "Normal",
      comments: {
        count: commentsNumber
      },
      type: "image",
      link: casual.url,
      location: {
        latitude: casual.latitude,
        longitude: casual.longitude,
        name: "",
        id: 213088733
      },
      attribution: null,
      users_in_photo: []
    });
  }

  return medias;
};

const paginate = (array, page_size, page_number) => {
  page_number = page_number < 1 ? 1 : page_number;
  --page_number;
  return array.slice(page_number * page_size, (page_number + 1) * page_size);
};

module.exports = {
  fetchMediaByTag,
  fetchAllMediaByTag,
  buildTagAndAddMedias
};
