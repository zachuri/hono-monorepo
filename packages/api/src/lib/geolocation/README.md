# Geolocation Service

A standalone geolocation and IP address service for Cloudflare Workers that provides access to Cloudflare's built-in geolocation data without depending on external packages.

## Features

- **IP Address Detection**: Automatically detects client IP from Cloudflare headers
- **Geolocation Data**: Access to city, country, region, timezone, coordinates, and more
- **Cloudflare Metadata**: ASN, organization, colo information, and other Cloudflare-specific data
- **TypeScript Support**: Fully typed with comprehensive TypeScript definitions
- **Middleware Integration**: Easy integration with Hono middleware stack

## Usage

### Server-side (in your routes)

```typescript
import type { AppRouteHandler } from "@acme/api/types/app-context";

const myRouteHandler: AppRouteHandler<typeof myRoute> = (c) => {
  const geolocation = c.get("geolocation");

  // Get all geolocation data
  const data = geolocation.getGeolocation();

  // Get just the IP address
  const ip = geolocation.getIPAddress();

  // Get raw Cloudflare context
  const cfContext = geolocation.getCloudflareContext();

  return c.json({
    ip: data.ip,
    location: `${data.city}, ${data.country}`,
    timezone: data.timezone,
  });
};
```

### Client-side (from your frontend)

```typescript
import {
  fetchGeolocationData,
  fetchIPAddress,
} from "@acme/api/lib/geolocation/client";

// Get all geolocation data
const geolocationData = await fetchGeolocationData(
  "https://your-api-domain.com"
);

// Get just the IP address
const ip = await fetchIPAddress("https://your-api-domain.com");
```

## Available Data

The geolocation service provides access to the following data:

- `ip`: Client IP address
- `city`: City name
- `country`: Country code
- `region`: Region/state name
- `regionCode`: Region/state code
- `timezone`: Timezone (e.g., "America/New_York")
- `latitude`: Latitude coordinate
- `longitude`: Longitude coordinate
- `colo`: Cloudflare colo (data center)
- `asn`: Autonomous System Number
- `asOrganization`: AS organization name
- `continent`: Continent code
- `postalCode`: Postal/ZIP code
- `metroCode`: Metro area code
- `isEUCountry`: Whether the country is in the EU

## API Endpoints

- `GET /geolocation` - Returns all geolocation data
- `GET /geolocation/example` - Example usage demonstration

## Integration

The geolocation middleware is automatically added to all routes in your application. You can access the geolocation service in any route handler through the context:

```typescript
const geolocation = c.get("geolocation");
```

## Cloudflare Headers

The service automatically reads from these Cloudflare headers:

- `CF-Connecting-IP`: The real client IP address
- `X-Forwarded-For`: Fallback IP address header

## TypeScript Types

All types are exported from the main index file:

```typescript
import type {
  GeolocationData,
  CloudflareContext,
  GeolocationService,
} from "@acme/api/lib/geolocation";
```

## Example Response

```json
{
  "ip": "192.168.1.1",
  "city": "San Francisco",
  "country": "US",
  "region": "California",
  "regionCode": "CA",
  "timezone": "America/Los_Angeles",
  "latitude": 37.7749,
  "longitude": -122.4194,
  "colo": "SFO",
  "asn": 13335,
  "asOrganization": "Cloudflare, Inc.",
  "continent": "NA",
  "postalCode": "94102",
  "metroCode": "807",
  "isEUCountry": false
}
```
