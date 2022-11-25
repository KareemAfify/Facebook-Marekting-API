import {
  FACEBOOK_ACCESS_TOKEN,
  FACEBOOK_AD_APP_ID,
} from "../constants/facebook.constant";
import {
  AdAccount,
  Campaign,
  FacebookAdsApi,
  AdSet,
} from "facebook-nodejs-business-sdk";
import fs from "fs";

export class FaceBookAdsProvider {
  private static instance: FaceBookAdsProvider;

  constructor() {
    const api = FacebookAdsApi.init(FACEBOOK_ACCESS_TOKEN);
    api.setDebug(true);
  }

  public static getInstance() {
    console.log(AdSet.Fields);
    if (!this.instance) {
      this.instance = new this();
    }
    return this.instance;
  }

  private get getAddAccount() {
    let addAccount;
    if (!addAccount) {
      addAccount = new AdAccount(
        `act_${FACEBOOK_AD_APP_ID}`,
        undefined,
        undefined,
        undefined
      );
    }
    return addAccount;
  }

  async createAdImage(path: string) {
    let content = fs.readFileSync(path).toString("base64");
    const image = await this.getAddAccount.createAdImage([], {
      bytes: content,
    });
    return image;
  }

  async createAdVideo(url: string, title: string) {
    const image = await this.getAddAccount.createAdVideo([], {
      file_url: url,
      title,
    });
    return image;
  }

  createCampaign(params: Record<string, any>) {
    return this.getAddAccount.createCampaign([Campaign.Fields.Id], params);
  }

  async getCampaigns() {
    return (
      this.getAddAccount.getCampaigns(["id", "name"]) as unknown as Promise<
        any[]
      >
    ).then((campaign) => {
      return campaign.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
    });
  }

  async getAdSets() {
    return (
      this.getAddAccount.getAdSets(["id", "name"]) as unknown as Promise<any[]>
    ).then((campaign) => {
      return campaign.map(({ id, name }) => {
        return {
          id,
          name,
        };
      });
    });
  }

  async getAdVideos() {
    return (
      this.getAddAccount.getAdVideos([
        "id",
        "filepath",
        "slideshow_spec",
        "title",
      ]) as unknown as Promise<any[]>
    ).then((videos) => {
      return videos.map((c) => {
        return {
          id: c.id,
          title: c.title,
        };
      });
    });
  }

  createAdSet(params: Record<string, any>) {
    return this.getAddAccount.createAdSet([], params);
  }

  createAdCreative(params: Record<string, any>) {
    return this.getAddAccount.createAdCreative([], params);
  }

  createAd(params: Record<string, any>) {
    return this.getAddAccount.createAd([], params);
  }
}
