import { Request, Response, response } from 'express';
import shortId from 'shortid';
import { config } from '../config/Constants';
import { URLModel } from '../database/model/URL';

export class URLController {
  public async shorten(req: Request, res: Response): Promise<void> {
    //check if the url doesn't exist
    const { originURL } = req.body;
    const url = await URLModel.findOne({ originURL });
    if (url) {
      response.json(url);
      return;
    }
    //create hash for the url

    const hash = shortId.generate();
    const shortURL = `${config.API_URL}/${hash}`;

    //save url in the database
    const newURL = await URLModel.create({ originURL, hash, shortURL });

    //return url created
    response.json({ newURL });
  }

  public async redirect(req: Request, response: Response): Promise<void> {
    //get the hash
    const { hash } = req.params;
    const url = await URLModel.findOne({ hash });
    if (url) {
      //find the original url by the hash

      // redirect to the original url
      response.redirect(url.originURL);
      return;
    }
    response.status(400).json({ err: 'URL not found' });
  }
}
