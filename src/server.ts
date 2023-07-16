import express from 'express';
import bodyParser from 'body-parser';
import { filterImageFromURL, deleteLocalFiles } from './util/util';
import { Request, Response, NextFunction } from 'express';
require('dotenv').config();

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;

  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get("/filteredimage", async (req: Request, res: Response, next: NextFunction) => {
    let imageUrl: string = req.query.image_url

    try {
      let url: string = await filterImageFromURL(imageUrl)
      res.sendFile(url, (e: any) => {
        deleteLocalFiles(Array.of(url))
      })
    } catch (error) {
      next(error)
    }
  });

  app.get("/", async (req: Request, res: Response) => {
    res.send("GET")
  });

  const errorHandler = (error: any, request: Request, response: Response, next: NextFunction) => {
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