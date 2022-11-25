import { FACEBOOK_PAGE_ID } from "../constants/facebook.constant";
import { AdToCreate } from "../types/ad";
import { AdSetToCreate } from "../types/adSet";

export const CAMPAIGN_PARAMS = (name: string) => ({
  name,
  objective: "OUTCOME_TRAFFIC",
  type: "Auction",
  status: "PAUSED",
  start_time: "2022-10-07T21:39:28-0700",
  special_ad_categories: [],
});

export const AD_SET_1 = ({
  dateAndTime,
  facebookPositions,
  genders,
  instagramPositions,
  interests,
  location,
  maxAge,
  minAge,
  name,
  platforms,
  campaignId,
}: AdSetToCreate) => ({
  name,
  optimization_goal: "REACH",
  start_time: dateAndTime,
  billing_event: "IMPRESSIONS",
  bid_amount: "35000",
  daily_budget: "5000",
  campaign_id: campaignId,
  is_dynamic_creative: true,
  targeting: {
    geo_locations: {
      countries: location,
    },
    age_min: minAge,
    age_max: maxAge,
    device_platforms: platforms,
    publisher_platforms: ["facebook", "instagram"],

    genders,
    ...(facebookPositions.length && { facebook_positions: facebookPositions }),
    ...(instagramPositions.length && {
      instagram_positions: instagramPositions,
    }),

    interests,
  },
  status: "PAUSED",
  promoted_object: { page_id: FACEBOOK_PAGE_ID },
});

export const AD_1 = (adSetId: string, adCreativeId: string, name: string) => ({
  name,
  adset_id: adSetId,
  creative: { creative_id: adCreativeId },
  status: "PAUSED",
});

export const AD_CREATIVE_1 = ({
  body,
  description,
  title,
  videoID,
  websiteURL,
}: AdToCreate) => ({
  name: title,
  object_story_spec: { page_id: FACEBOOK_PAGE_ID },
  asset_feed_spec: {
    videos: [
      {
        video_id: videoID,
      },
    ],
    bodies: [{ text: body }],
    titles: [{ text: title }],
    descriptions: [{ text: description }],
    ad_formats: ["SINGLE_VIDEO"],
    call_to_action_types: ["LISTEN_NOW"],
    link_urls: [{ website_url: websiteURL }],
  },
});
