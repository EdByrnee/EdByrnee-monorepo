import { Inject, Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { IRepositoryPort } from '../../core/database/ports/repository-port';
import { DelliDrop } from './entities/delli-drop.entity';
import {
  DELLI_DROP_REPO,
  DELLI_STOCK_REPO,
  SCRAPE_LOG_REPO,
  TOKEN_LOG_REPO,
} from './reporting.providers';
import * as uuid from 'uuid';
import { DelliDropQtySnapshot } from './entities/delli-drop-qty';
import { TokenLog } from './entities/token-log';
import { ScrapeLog } from './entities/scrape-log';

@Injectable()
export class ReportingService {
  private delliUserGQL = 'https://api.prod.delli.app/user/graphql?';

  SCRAPE_TIMEOUT_BETWEEN_REQUESTS = 0; // 1 second

  constructor(
    @Inject(DELLI_DROP_REPO)
    private readonly delliDropRepo: IRepositoryPort<DelliDrop>,
    @Inject(DELLI_STOCK_REPO)
    private readonly delliStockRepo: IRepositoryPort<DelliDropQtySnapshot>,
    @Inject(TOKEN_LOG_REPO)
    private readonly tokenLogRepo: IRepositoryPort<TokenLog>,
    @Inject(SCRAPE_LOG_REPO)
    private readonly scrapeLogRepo: IRepositoryPort<ScrapeLog>
  ) {
  //  this.scrapeDelliDrops();
  }

  private deeplyNestedJsonToQueryString(json) {
    const str = [];
    for (const p in json) {
      // eslint-disable-next-line no-prototype-builtins
      if (json.hasOwnProperty(p)) {
        str.push(
          encodeURIComponent(p) +
            '=' +
            encodeURIComponent(JSON.stringify(json[p]))
        );
      }
    }
    return str.join('&');
  }

  async getDelliDrops() {
    const drops = await this.delliDropRepo.findAll({
      order: [['sales', 'DESC']],
    });
    return drops;
  }

  async getMD5Hash() {
    // Get the latest refresh token from the token log
    const tokenLog: TokenLog = await this.tokenLogRepo.findOneQuery({
      order: [['createdAt', 'DESC']],
      where: {
        token_name: 'md5_hash',
      },
    });

    return tokenLog.token_value;
  }

  async getStartCursor() {
    // Get the latest refresh token from the token log
    const tokenLog: TokenLog = await this.tokenLogRepo.findOneQuery({
      order: [['createdAt', 'DESC']],
      where: {
        token_name: 'start_cursor',
      },
    });

    return tokenLog.token_value;
  }

  async getRefreshToken() {
    // Get the latest refresh token from the token log
    const tokenLog: TokenLog = await this.tokenLogRepo.findOneQuery({
      order: [['createdAt', 'DESC']],
      where: {
        token_name: 'refresh_token',
      },
    });

    return tokenLog.token_value;
  }

  async getAccessToken() {
    // Get the latest access token from the token log
    const tokenLog: TokenLog = await this.tokenLogRepo.findOneQuery({
      order: [['createdAt', 'DESC']],
      where: {
        token_name: 'access_token',
      },
    });

    return tokenLog.token_value;
  }

  async scrapeDelliDrops() {
    Logger.log(`Scraping drops from Delli...`);

    const urlParams = {
      variables: {
        after: await this.getStartCursor(),
        first: 50,
        order: [{ liveDate: 'DESC' }],
        where: { state: { in: ['LIVE', 'SOLD_OUT', 'ENDED'] } },
      },
      extensions: {
        persistedQuery: { md5Hash: await this.getMD5Hash() },
      },
    };

    Logger.log('Contverting these url params');
    Logger.log(urlParams);

    const url =
      this.delliUserGQL + this.deeplyNestedJsonToQueryString(urlParams);

    return await this.requestAndSaveDrops(url);
  }

  async makeRequest(url: string, retry = true) {
    // Get response with url request and access token
    const requestOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await this.getAccessToken()}`,
      },
    };

    Logger.log(`Request options`);
    Logger.log(requestOptions);

    const response = await fetch(url, requestOptions);

    // If response 401, get new access token and try again
    Logger.log(`Delli returned status code ${response.status}`);
    if (response.status === 401) {
      if (retry) {
        Logger.log('Access token expired, getting new one...');
        Logger.log(JSON.stringify(response));
        await this.refreshAccessToken();
        return await this.makeRequest(url, false);
      } else {
        Logger.error(
          'Access token expired, could not get new one using refresh token. Scraping Delli Drops failed.'
        );
        return;
      }
    }
    if (response.status !== 200) {
      Logger.error(
        `Delli returned status code ${response.status}, scraping Delli Drops failed while making request to ${url}`
      );
      Logger.error(`Here is the response body`)
      const json = await response.json();
      Logger.error(json)
      return;
    }
    const json = await response.json();
    return json;
  }

  async refreshAccessToken() {
    const refreshToken = await this.getRefreshToken();

    const url = 'https://api.prod.delli.app/identity/token';

    const body = {
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const json = await response.json();

    Logger.log(`Here is the response from Delli...`);

    const access_token = json.access_token;
    const refresh_token = json.refresh_token;

    Logger.log(`Here is the new access token: ${access_token}`);

    Logger.log(`Here is the new refresh token: ${refresh_token}`);

    const tokenLog = new TokenLog({
      uuid: uuid.v4(),
      token_name: 'access_token',
      token_value: access_token,
    });

    await this.tokenLogRepo.create(tokenLog);

    const refreshLog = new TokenLog({
      uuid: uuid.v4(),
      token_name: 'refresh_token',
      token_value: refresh_token,
    });

    await this.tokenLogRepo.create(refreshLog);

    return access_token;
  }

  async requestAndSaveDrops2(url: string, dropCount = 0) {
    const scrapeLog = new ScrapeLog({
      uuid: uuid.v4(),
      scrapeName: 'test_scrape',
      scrapeResult: 'See drop count for amount returned',
      scrapeCount: 0,
      scrapedAt: new Date().toString(),
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });
    Logger.log(`Creating scrape log...`);
    Logger.log(scrapeLog);
    Logger.log(JSON.stringify(scrapeLog))
    try {
      await scrapeLog.save();
    }catch(err){
      console.log(err);
      throw err;
    }
    await this.scrapeLogRepo.create(scrapeLog);
  }

  async requestAndSaveDrops(url: string, dropCount = 0) {
    Logger.log('Making this request');
    Logger.log(url);

    const json = await this.makeRequest(url);

    if (!json) {
      Logger.error('Could not get Delli Drops, check logs for more info.');
      return {
        dropCount: 0,
        dropWithSalesCount: 0,
      };
    }

    Logger.log(`Got response from Delli...`);

    const drops = json.data.listings.nodes;
    dropCount = dropCount + drops.length;

    const hasNextPage = json.data.listings.pageInfo.hasNextPage;
    const endCursor = json.data.listings.pageInfo.endCursor;

    let dropWithSalesCount = 0;

    for (const drop of drops) {
      try {
        const dropObject = {
          uuid: drop.id,
          name: drop.name.replace(/,/g, ''),
          description: drop.description.replace(/,/g, ''),
          price: drop.price?.value,
          stock: drop.stock,
          createdAt: drop.created,
          likes: drop.interactions?.likedByCount,
          madeByUsername: drop.account?.username,
          collectionAvailable: drop.collectionOption === null,
          localDeliveryAvailable: drop.localDeliveryOption === null,
          nationalDeliveryAvailable: drop.nationalDeliveryOption === null,
        };
        Logger.log(`Creating drop ${drop.name}...`);

        const exists = await this.delliDropRepo.findOne({ uuid: drop.id });
        if (exists) {
          exists.collectionAvailable = drop.collectionOption === null;
          exists.localDeliveryAvailable = drop.localDeliveryOption === null;
          exists.nationalDeliveryAvailable =
            drop.nationalDeliveryOption === null;
          await this.delliDropRepo.update(exists);

          if (dropObject.stock !== exists.stock) {
            dropWithSalesCount++;
            await this.delliStockRepo.create(
              new DelliDropQtySnapshot({
                uuid: uuid.v4(),
                delliDropId: exists.id,
                stock: dropObject.stock,
                createdAt: new Date(),
                updatedAt: new Date(),
              })
            );

            if (dropObject.stock < exists.stock) {
              Logger.error('YES, one has sold!');
              const soldQty = exists.stock - dropObject.stock;
              exists.sales = exists.sales + soldQty;
              await this.delliDropRepo.update(exists);
            }

            // Update the figure we have on record
            exists.stock = dropObject.stock;
            await this.delliDropRepo.update(exists);
          } else {
            Logger.log(
              `Drop ${drop.name} already exists, but stock is the same`
            );
          }
        } else {
          const drop = new DelliDrop(dropObject);
          await this.delliDropRepo.create(drop);

          await this.delliStockRepo.create(
            new DelliDropQtySnapshot({
              uuid: uuid.v4(),
              delliDropId: drop.id,
              stock: dropObject.stock,
              createdAt: new Date(),
              updatedAt: new Date(),
            })
          );
        }
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          //handleHttpErrors(SYSTEM_ERRORS.USER_ALREADY_EXISTS);
          Logger.error(`Drop ${drop.name} already exists`);
        } else {
          //handleHttpErrors(err.message);
          Logger.log(err);
          Logger.error(`Unknown error creating drop ${drop.name}...`);
        }
      }
    }
    if (hasNextPage) {
      Logger.log(`Getting next page of drops...`);
      const urlParams = {
        variables: {
          after: endCursor,
          first: 50,
          order: [{ liveDate: 'DESC' }],
          where: { state: { in: ['LIVE', 'SOLD_OUT', 'ENDED'] } },
        },
        extensions: {
          persistedQuery: { md5Hash: await this.getMD5Hash() },
        },
      };

      const url =
        this.delliUserGQL + this.deeplyNestedJsonToQueryString(urlParams);

      await new Promise((r) =>
        setTimeout(r, this.SCRAPE_TIMEOUT_BETWEEN_REQUESTS)
      );
      await this.requestAndSaveDrops(url, dropCount);
    } else {
      const scrapeLog = new ScrapeLog({
        uuid: uuid.v4(),
        scrapeName: 'delli_drops',
        scrapeResult: 'See drop count for amount returned',
        scrapeCount: dropCount,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      Logger.log(`Creating scrape log...`);
      try {
        await this.scrapeLogRepo.create(scrapeLog);
      }
      catch(err){
        Logger.warn(`There was an error creating the scrape log: ${err}...`)
      }

      Logger.log(
        `There was a total of ${dropCount} drops, ${dropWithSalesCount} of which had sales`
      );
      return {
        dropCount,
        dropWithSalesCount,
      };
    }
  }

  async getScrapeLogs() {
    return await this.scrapeLogRepo.findAll({});
  }
}
