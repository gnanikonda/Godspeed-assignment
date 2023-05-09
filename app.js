const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbpath = path.join(__dirname, "restaurant.db");
const app = express();
app.use(express.json());

let db = null;
const initialize = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server is running at http://localhost/3000/:");
    });
  } catch (e) {
    console.log(`${e.message}`);
    process.exit(1);
  }
};

initialize();

app.get("/restaurant/:restaurantId/", async (request, response) => {
  const { restaurantId } = request.params;
  const query = `
    select * from Restaurant where id = '${restaurantId}';
    `;
  const res = await db.get(query);
  response.send(res);
});

app.post("/restaurant/", async (request, response) => {
  const { id } = request.body;

  const query = `
          insert into Restaurant (id,since,isOpen,opsStartTime,opsEndTime,ownerId,slug,description,location,menuItems)
          values ('${id}','${since}','${isOpen}','${opsStartTime}','${opsEndTime}','${ownerId}',
          '${slug}','${description}','${location}','${menuItems}');
          `;
  const res = await db.run(query);

  response.send(id);
});

app.post("/restaurant/search", async (request, response) => {
  const { search } = request.body;

  const query = `
     select * from Restaurant where location LIKE '%${search}%' ;
      `;
  const res = await db.all(query);
  response.send(res);
});

app.delete("/restaurant/:restaurantId/", async (request, response) => {
  const { restaurantId } = request.params;

  const query = `
    delete from Restaurant where id='${restaurantId}';
    `;
  const res = await db.run(query);
  response.send("Successfully deleted restaurant");
});

app.put("/restaurant/:restaurantId", async (request, response) => {
  const { restaurantId } = request.params;
  const { description } = request.body;

  const query = `
     update Restaurant set description = '${description}' where id='${restaurantId}' ;
      `;
  const res = await db.all(query);
  response.send("updated successfully");
});

module.exports = app;
