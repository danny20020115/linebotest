const axios = require("axios");

(async () => {
  const url = "https://www.landseedhospital.com.tw/tw/knowledge/knowledge_list";
  const { data } = await axios.get(url);
  const found = data.match(/\/api\/[a-zA-Z0-9_/.-]+/g);
  console.log([...new Set(found)]);
})();


fetchHTML();
