---
title: "Segment Guide"
description: "Guide to setting up Willow with Segment"
date: "2022-03-23"
author: "Adam Juhasz"
---

## title: Willow Destination

[Willow](https://heywillow.io/?utm_source=segmentio&utm_medium=docs&utm_campaign=partners) is a customer support platform built for early stage startups. We focus on 3 things getting your whole team (even engineering) solving issues together with fun commenting/tagging, showing your everything in one place from from customer messages to in-app actions, and showing your entire customer's journey in one continuous feed from day 1 to today.

This destination is maintained by Willow. For any issues with the destination, [contact the Willow Support team](mailto:help@heywillow.io).

## Getting Started

{% include content/connection-modes.md %}

1. From the Destinations catalog page in the Segment App, click **Add Destination**.
2. Search for "Willow" in the Destinations Catalog, and select the "Willow" destination.
3. Choose which Source should send data to the "Willow" destination.
4. Select the correct team from your [Willow workspace](https://heywillow.io/a/workspace){:target="\_blank"}.
5. Go to your team's settings page, select "API Keys", then find and copy the "API key".
6. Enter the "API Key" in the "Willow" destination settings in Segment.

## Supported methods

Willow supports the following methods, as specified in the [Segment Spec](/docs/connections/spec).

### Page

Send [Page](/docs/connections/spec/page) calls to Willow to see what pages a user has visited to get more context around their issues. For example:

```js
analytics.page();
```

Segment sends Page calls to Willow as a `Viewed Screen`.

### Screen

Send [Screen](/docs/connections/spec/screen) calls to _ADD WHAT SCREEN CALLS ARE USED FOR HERE_. For example:

```obj-c
[[SEGAnalytics sharedAnalytics] screen:@"Home"];
```

Segment sends Screen calls to Willow as a `Viewed Page`.

### Identify

Send [Identify](/docs/connections/spec/identify) calls to _ADD WHAT IDENTIFY CALLS ARE USED FOR HERE_. For example:

```js
analytics.identify("userId123", {
  email: "john.doe@example.com",
});
```

Segment sends Identify calls to Willow as an `identify` event.

### Track

Send [Track](/docs/connections/spec/track) calls to _ADD WHAT Track CALLS ARE USED FOR HERE_. For example:

```js
analytics.track("Login Button Clicked");
```

Segment sends Track calls to YOURINTEGRATION as a `track` event.

---