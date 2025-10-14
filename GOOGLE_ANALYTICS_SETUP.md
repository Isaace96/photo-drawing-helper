# Google Analytics Setup Guide

## Overview
Your Photo Drawing Helper app is ready for Google Analytics tracking! The analytics system tracks:

- **Page Views**: When users visit your app
- **Image Uploads**: File size, type, and session upload count  
- **Image Processing**: Processing time and success tracking
- **Individual Downloads**: Which tonal range images users download
- **Bulk Downloads**: When users download all images at once

## Setup Instructions

### 1. Create Google Analytics Account
1. Go to [Google Analytics](https://analytics.google.com/)
2. Create a new account or use existing one
3. Create a new **GA4 Property** for your app
4. Get your **Measurement ID** (format: G-XXXXXXXXXX)

### 2. Enable Analytics in Your App
1. Open `src/App.tsx`
2. Find this line around line 25:
   ```typescript
   // analytics.Analytics.initializeGA('G-XXXXXXXXXX');
   ```
3. Uncomment it and replace `G-XXXXXXXXXX` with your real Measurement ID:
   ```typescript
   analytics.Analytics.initializeGA('G-1234567890');
   ```

### 3. Deploy and Test
1. Deploy your changes:
   ```bash
   npm run deploy
   ```
2. Visit your live site
3. Check Google Analytics Real-time reports to verify tracking

## Events Being Tracked

### Custom Events
- `image_upload` - When users upload images
  - Properties: file_size (KB), file_type, session_uploads
- `image_processed` - When processing completes  
  - Properties: processing_time (seconds), session_processed
- `individual_download` - When users download single images
  - Properties: image_type (highlights/midtones/shadows/darks), session_downloads
- `bulk_download` - When users download all images
  - Properties: image_count, session_downloads

### Standard Events
- `page_view` - Automatic page view tracking

## Analytics Dashboard
You can view all this data in your Google Analytics dashboard:
- **Real-time**: See current users and activity
- **Events**: Track custom events and their frequency
- **Engagement**: See session duration and user flow
- **Demographics**: User location and device info

## Privacy Note
This implementation respects user privacy:
- No personal information is tracked
- Only usage patterns and technical metrics
- Users can block analytics with browser settings
- Data is processed by Google according to their privacy policy

Your app is now ready for professional analytics tracking! 📊