import express, { json } from "express";
import {
  FACEBOOK_POSITION_PREFIX,
  INSTAGRAM_POSITION_PREFIX,
} from "./src/constants/facebook.constant";
const bodyParser = require("body-parser");
import { FaceBookAdsProvider } from "./src/providers/facebook.ads.provider";
import {
  AD_1,
  AD_CREATIVE_1,
  AD_SET_1,
  CAMPAIGN_PARAMS,
} from "./src/statics/campagian.params";
import { AdToCreate } from "./src/types/ad";
import { AdSetForm, AdSetToCreate } from "./src/types/adSet";
import { CampaignToCreate } from "./src/types/campaign";
const app = express();
const PORT = 3000;

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

app
  .listen(PORT)
  .on("listening", () => {
    console.log(
      "Server is Successfully Running, and App is listening on port " + PORT
    );
  })
  .on("error", (err) => {
    console.log("Error occurred, server can't start", err);
  });

app.get("/", (req, res) => {
  res.redirect("/campaign");
});

// TODO: Create new folder for each module
app.get("/videos", (req, res) => {
  res.render("pages/adVideo", {
    successMessage: req.query.successMessage,
    errorMessage: req.query.errorMessage,
  });
});

app.post("/videos", async (req, res) => {
  try {
    const { url, title } = req.body as { url: string; title: string };
    const facebookProvider = FaceBookAdsProvider.getInstance();
    await facebookProvider.createAdVideo(url, title);

    res.redirect("/videos?successMessage=Video Created Successfully");
  } catch (error: any) {
    res.redirect(`/videos?errorMessage=${error.message}`);
  }
});

app.get("/campaign", (req, res) => {
  res.render("pages/campaign", {
    successMessage: req.query.successMessage,
    errorMessage: req.query.errorMessage,
  });
});

app.post("/campaign", async (req, res) => {
  try {
    const { name } = req.body as CampaignToCreate;
    const facebookProvider = FaceBookAdsProvider.getInstance();
    await facebookProvider.createCampaign(CAMPAIGN_PARAMS(name));

    res.redirect("/campaign?successMessage=Campaign Created Successfully");
  } catch (error: any) {
    res.redirect(`/campaign?errorMessage=${error.message}`);
  }
});

app.get("/ad-set", async (req, res) => {
  const facebookProvider = FaceBookAdsProvider.getInstance();
  const campaigns = await facebookProvider.getCampaigns();
  res.render("pages/adSet", {
    campaigns,
    successMessage: req.query.successMessage,
    errorMessage: req.query.errorMessage,
  });
});

app.post("/ad-set", async (req, res) => {
  try {
    const {
      dateAndTime,
      genders,
      interests,
      location,
      maxAge,
      minAge,
      name,
      platforms,
      positions,
      campaignId,
    } = req.body as AdSetForm;
    const facebookProvider = FaceBookAdsProvider.getInstance();
    const positionsToList =
      typeof positions === "string" ? [positions] : positions;
    const interestsList =
      typeof interests === "string" ? [interests] : interests;
    const adSetToCreate: AdSetToCreate = {
      name,
      dateAndTime,
      minAge: +minAge,
      maxAge: +maxAge,
      campaignId,
      genders:
        typeof genders === "string"
          ? [+genders]
          : (genders as []).map((g) => +g),
      interests: interestsList.map((int) => ({ id: int })),
      location: typeof location === "string" ? [location] : location,
      platforms: typeof platforms === "string" ? [platforms] : platforms,
      facebookPositions: [...positionsToList]
        .filter((P) => P.startsWith(FACEBOOK_POSITION_PREFIX))
        .map((f) => f.split("_")[1]),
      instagramPositions: [...positionsToList]
        .filter((P) => P.startsWith(INSTAGRAM_POSITION_PREFIX))
        .map((i) => i.split("_")[1]),
    };
    await facebookProvider.createAdSet(AD_SET_1(adSetToCreate));
    res.redirect("/ad-set?successMessage=Ad Set Created Successfully");
  } catch (error: any) {
    res.redirect(`/ad-set?errorMessage=${error.message}`);
  }
});

app.get("/ad", async (req, res) => {
  const facebookProvider = FaceBookAdsProvider.getInstance();
  const adSets = await facebookProvider.getAdSets();
  const adVideos = await facebookProvider.getAdVideos();
  res.render("pages/ad", {
    adSets,
    successMessage: req.query.successMessage,
    errorMessage: req.query.errorMessage,
    adVideos,
  });
});

app.post("/ad", async (req, res) => {
  try {
    const adToCreate = req.body as AdToCreate;
    const facebookProvider = FaceBookAdsProvider.getInstance();

    const creative = await facebookProvider.createAdCreative(
      AD_CREATIVE_1(adToCreate)
    );
    await facebookProvider.createAd(
      AD_1(adToCreate.adSetId, creative.id, adToCreate.title)
    );
    res.redirect("/ad?successMessage=Ad Created Successfully");
  } catch (error: any) {
    console.log("error", error);
    res.redirect(`/ad?errorMessage=${error.message}`);
  }
});
