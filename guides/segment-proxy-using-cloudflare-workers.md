---
title: "Segment custom domain proxy using Cloudflare Workers"
description: "Guide to setting up a custom domain proxy for Segment to improve data acquisition"
date: "2022-03-23"
author: "Adam Juhasz"
---

Segment's custom domains allow you to proxy Segment's Analytics.js and proxy all tracking event requests through your domain.

## Prerequisites

To set up a custom domain using Cloudflare workers, you need:

- Access to your Cloudflare account

This guide explains how to set up a custom domain in CloudFront. We'll set up one worker to

- Proxy GET requests to the Segment CDN (cdn.segment.com)
- Proxy all other requests to the Segment tracking API (api.segment.io)

## Cloudflare setup

### CDN & API Proxy

1. Log into your Cloudflare account.
2. Select the domain you'll be proxying Segment for.
3. Select "DNS" on the left side.
4. Click "Add record"
5. Change "Type" to `CNAME`, "Name" to `seg`, and "Target" to `cdn.segment.com`, verify "Proxy Status" is `Proxied` (orange). Click Save. _We'll be intercepting requests to this domain so the CNAME target doesn't matter._
6. Go back to your Cloudflare dashboard home by clicking the top left back icon.
7. Select "Workers" from the left side.
8. Click "Create a service"
9. Enter the "Service Name" `segment-cdn-proxy` and choose `HTTP handler` as the starter. Click "Create service".
10. Paste the following code into the left pane.

```javascript
addEventListener("fetch", (event) => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // new URL object based on the one being requested.
  const url = new URL(request.url);

  // redirect http to https
  if (url.protocol === "http:") {
    url.protocol = "https:";
    return Response.redirect(url, 301);
  }

  if (request.method === "GET") {
    // GET requests should be proxied to Segment's CDN
    url.hostname = "cdn.segment.com";
  } else {
    url.hostname = "api.segment.io";
  }

  const response = await fetch(url, request);
  return response;
}
```

11. Click "Save and Deploy" on the bottom of the left pane.
12. Click "Save and Deploy" in the modal.
13. Click the top left back button.
14. Click the "Triggers" tab
15. Click "Add route"
16. Set "Route" to `seg.<yourdomain.com>/*`, Set "Zone" to `<yourdomain.com>`. Click "Add route"

## Segment-side set up

Follow the directions listed to set up two Cloudflare workers. Once you completed those steps and verify that your proxy works for both cdn.segment.com and api.segment.io, [contact Segment Product Support](https://segment.com/help/contact/) with the following template email:

```
Hi,

This is {person} from {company}. I would like to configure a proxy for the following source(s) to point to the corresponding proxy url:

- Source {link to source in Segment} with source ID {source id} should point to {api host}
- Source {link to source in Segment} with source ID {source id} should point to {api host}
```

Double-check the source link, the Source ID, and the API proxy host to make sure they are correct.

A Segment Customer Success team member will respond that they have enabled this option for your account. When you receive this confirmation, open the source in your workspace, and navigate to Settings > Analytics.j. Update the Host Address setting from `api.segment.io/v1` to `[your proxy host]/v1`.

> The Host Address field does not appear in source settings until it’s enabled by Segment Customer Success.

## Post set up

Once Segment has enabled the feature on your source you'll need to modify your snippet so that bundles are also requested through your proxy.

### Using Segment's snippet generator

```
import * as snippet from "@segment/snippet";

const opts: snippet.Options = {
    apiKey: "", // add api write key here
    host: "seg.yourdomain.com",
    useHostForBundles: true, // this is so that bundles are also requested through custom domain
  };

  if (process.env.NODE_ENV === "development") {
    return snippet.max(opts);
  }

  return snippet.min(opts);
```

### If using a manual snippet

1. Add `analytics._cdn="seg.<yourdomain.com>";`.
