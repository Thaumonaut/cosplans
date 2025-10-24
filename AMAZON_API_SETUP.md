# Amazon Product API Setup

The equipment search feature uses Amazon's Product Advertising API to provide auto-complete suggestions with real product data and pricing.

## Setup Steps

### 1. Sign Up for Amazon Associates

1. Go to https://affiliate-program.amazon.com/
2. Sign up for an Amazon Associates account
3. Complete the application process (may take 1-3 business days)

### 2. Request Product Advertising API Access

1. Once approved for Associates, go to https://webservices.amazon.com/paapi5/documentation/
2. Sign in with your Associates account
3. Request access to the Product Advertising API
4. You'll receive:
   - Access Key ID
   - Secret Access Key
   - Associate Tag (from your Associates account)

### 3. Add Credentials to Environment Variables

Add these to your `.env` file:

```env
# Amazon Product Advertising API
AMAZON_ACCESS_KEY=your_access_key_here
AMAZON_SECRET_KEY=your_secret_key_here
AMAZON_ASSOCIATE_TAG=your_associate_tag_here
```

### 4. Test the Integration

1. Restart your development server
2. Go to `/equipment/new`
3. Start typing in the equipment name field
4. You should see Amazon product suggestions appear

## Features

- **Auto-complete**: Type equipment names to see real products
- **Auto-fill**: Select a product to automatically fill:
  - Name
  - Brand
  - Model
  - Estimated purchase price
  - Product image
  - Purchase link (with your affiliate tag)
- **Affiliate Revenue**: Purchase links include your Associate tag, earning you commission on sales

## API Limits

- **Free Tier**: 8,640 requests per day
- **Rate Limit**: 1 request per second
- **Requirements**: Must generate at least 3 sales within 180 days to maintain access

## Fallback Behavior

If API credentials are not configured:
- Equipment search will still work
- Will search your existing equipment database
- No external product suggestions

## Alternative APIs

If you prefer not to use Amazon, you can integrate:
- **B&H Photo API** (requires business partnership)
- **Best Buy API** (requires developer account)
- **eBay API** (for used equipment pricing)

See `src/lib/server/external/` for API implementations.
