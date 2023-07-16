import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import e from 'express';
require('dotenv').config();

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req, res, next) => {
    let publicUrl = req.query.image_url
    let url
    try {
      url = await filterImageFromURL(publicUrl)
    } catch (error) {
      next(error)
    }
    res.send(url)
    deleteLocalFiles(Array.of(url))
  });

  app.get("/", async (req, res, next) => {
    res.send("GET")
  });

  const errorHandler = (error: any, request: any, response: any, next: any) => {
    const status = error.status || 422
    response.status(status).send(error.message)
  }
  app.use(errorHandler)

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();