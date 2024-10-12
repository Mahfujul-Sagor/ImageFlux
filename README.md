# ImageFlux

**ImageFlux** is an AI-powered image enhancement app that transforms low-resolution images into high-resolution masterpieces. The app provides users with the ability to enhance, crop, and remove backgrounds, among other features, using Cloudinary’s regenerative AI. User management and authentication are handled by Appwrite.

## Features

- **AI-Powered Image Enhancement:** Transform low-res images into high-quality visuals using Cloudinary’s regenerative AI.
- **Image Upload & Storage:** Upload images directly to Cloudinary for processing and storage.
- **User Management:** Secure user registration, login, and session management using Appwrite.
- **Image Editing Tools:** Features like cropping, background removal, and more.
- **Cloud-Based:** Fast and scalable, thanks to the integration with Cloudinary for image processing.
- **Mobile-First Design:** Built using React Native and Expo for cross-platform compatibility.

## Tech Stack

- **Frontend:**
  - [Expo](https://expo.dev/): React Native framework for building mobile apps.
  - [React Native](https://reactnative.dev/): A JavaScript framework for building native mobile apps.
  
- **Backend:**
  - [Cloudinary](https://cloudinary.com/): Image storage and AI-based image transformation services.
  - [Appwrite](https://appwrite.io/): Backend server for user management and authentication.
  - **Express Server** (optional): For handling file uploads and deletions if necessary.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mahfujul-Sagor/ImageFlux.git
   cd ImageFlux

2. Install the dependencies:

   ```bash
   npm install

## Set up Appwrite

1. Install Appwrite in your native environment:

   ```bash
   npm install react-native-appwrite

2. Appwrite Client Setup:

   Create a file, appwrite.js, in your project’s root directory or src folder to configure Appwrite:

   ```jsx
   import { Client, Account, Databases, Avatars } from 'react-native-appwrite';

   const client = new Client()
   .setEndpoint(process.env.APPWRITE_ENDPOINT) // Your Appwrite Endpoint
   .setProject(process.env.APPWRITE_PROJECT_ID); // Your Appwrite Project ID
   .setPlatform(appwriteConfig.platform);

   const account = new Account(client);
   const databases = new Databases(client);
   const avatars = new Avatars(client);

   export { client, account, databases, avatars };
   ```

3. Appwrite Environment Variables:

   In your .env file, add the Appwrite configuration:

   ```bash
   APPWRITE_ENDPOINT=https://your-appwrite-endpoint.io/v1
   APPWRITE_PROJECT_ID=your-appwrite-project-id
   APPWRITE_PLATFORM=your-appwrite-platform

4. Example of Using Appwrite for Authentication:

   You can use the Appwrite SDK for user registration and login like this:

   ```jsx
   import { account } from './appwrite';

   // Sign up a new user
   const registerUser = async (email, password, name) => {
   try {
      const response = await account.create('unique()', email, password, name);
      console.log('User registered successfully:', response);
   } catch (error) {
      console.error('Error registering user:', error);
   }
   };

   // Sign in a user
   const loginUser = async (email, password) => {
   try {
      const session = await account.createEmailSession(email, password);
      console.log('User logged in successfully:', session);
   } catch (error) {
      console.error('Error logging in:', error);
   }
   };
   ```

## Cloudinary Setup

1. Install Cloudinary SDK:

   Run the following command to install the Cloudinary SDK:

   ```bash
   npm install cloudinary

2. Cloudinary Configuration:

   Create a cloudinary.js file in your project’s root directory or src folder to configure Cloudinary:

   ```jsx
   import { Cloudinary } from 'cloudinary-core';

   const cloudinary = new Cloudinary({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
   });

   export default cloudinary;
   ```

3. Cloudinary Environment Variables:

   Add the following Cloudinary credentials to your .env file:

   ```bash
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret

4. Uploading Images to Cloudinary:

   Here’s an example of how you can upload images to Cloudinary using their API:

   ```jsx
   import cloudinary from './cloudinary';

   const uploadImage = async (file) => {
   try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', 'your-upload-preset'); // Set your upload preset if needed

      const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload`, {
         method: 'POST',
         body: formData
      });

      const data = await response.json();
      console.log('Image uploaded successfully:', data);
      return data.secure_url;
   } catch (error) {
      console.error('Error uploading image:', error);
   }
   };
   ```

## Running the App

1. Start the development server:

   ```bash
   npx expo start

2. Open the app in the Expo Go app on your mobile device or emulator.

## Usage

1. Sign up / Sign in: Users can register or log in using Appwrite authentication.
2. Upload an image: Select an image from your device to upload.
3. Enhance image: The image is uploaded to Cloudinary, and AI enhancements are applied.
4. Download or Share: Users can download the enhanced image or share it.

## API Integration

- **Appwrite:** Handles user authentication and session management.
- **Cloudinary:** Processes and stores images, utilizing regenerative AI for image enhancement.

## Contribution

If you want to contribute to the project, feel free to fork the repository and submit pull requests. Contributions are always welcome.

## License

MIT
