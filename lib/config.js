import {
  Account,
  Avatars,
  Client,
  Databases,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.mas.imageflux",
  projectId: "66fe733e000e7494a932",
  databaseId: "66fe7582002029276abb",
  userCollectionId: "66fe758c003de9e63bfb",
};

const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint)
  .setProject(appwriteConfig.projectId)
  .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const avatars = new Avatars(client);