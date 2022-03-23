# 💫 Segment Partner Destination Documentation Template

> Hi Partners 👋🏼
>
> Welcome to Segment - glad to have you onboard! This doc serves as a guideline for your team to create best-in-class documentation alongside your amazing product.
>
> At Segment, we believe that documentation is crucial in delivering the best experience for our mutual customers so we want to think with the following mindset:
>
> - Be succinct and simple in your writing. Reduce text bloat where possible.
> - Avoid 1st person language as it’s confusing for customers if they don’t know who wrote the docs (Segment or the Partner).
> - Use the active voice - instead of "The destination will do this." write something like "The destination does this."
> - Where pre-reading is required, hyperlink to other more generic parts of Segment’s (or your) documentation.
>
> - Provide actionable code samples for each API method.
>
> - If you would like to include screenshots, send the original image to us via partner-support@segment.com with naming corresponding to where you've included it within the Markdown below. We prefer PNG images within 400px - 1200px. If you'd like to submit a GIF, keep under 15MB. Generally you should be able to write these out as text, so only use them when there's something really hard to explain.
>
> The below template intends to provide a standardized structure. Please **make a copy** of this template for editing and submit to the Segment team as a new note on [HackMD.io](https://hackmd.io/). You can view a sample doc as reference here: https://segment.com/docs/connections/destinations/catalog/clearbrain/.
>
> If a section does not apply to your integration, feel free to remove. Please don’t create separate sections unless absolutely necessary. In most cases, creating a H3 (###) sub-heading under an existing section is the best option!
>
> If you have any questions in the meantime, please reach out to our team at partner-support@segment.com.

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

> For each of the following call types (Page, Screen, Identify, Track, Group), update:
>
> 1. Code snippet with relevant code sample including required traits or properties.
> 2. Your integration name.
> 3. What the corresponding call looks like within your platform (eg. Segment `page` call might be a `pageview` on your platform).
> 4. It can be helpful to describe _where_ data will appear (ie. Will `identify` calls appear within a Users dashboard as well as the Real-time dashboard of your platform?)
> 5. Any other important information for customer to note when sending through the events.

## Supported methods

Willow supports the following methods, as specified in the [Segment Spec](/docs/connections/spec).

### Page

Send [Page](/docs/connections/spec/page) calls to _ADD WHAT PAGE CALLS ARE USED FOR HERE_. For example:

```js
analytics.page();
```

Segment sends Page calls to YOURINTEGRATION as a `pageview`.

### Screen

Send [Screen](/docs/connections/spec/screen) calls to _ADD WHAT SCREEN CALLS ARE USED FOR HERE_. For example:

```obj-c
[[SEGAnalytics sharedAnalytics] screen:@"Home"];
```

Segment sends Screen calls to YOURINTEGRATION as a `screenview`.

### Identify

Send [Identify](/docs/connections/spec/identify) calls to _ADD WHAT IDENTIFY CALLS ARE USED FOR HERE_. For example:

```js
analytics.identify("userId123", {
  email: "john.doe@example.com",
});
```

Segment sends Identify calls to YOURINTEGRATION as an `identify` event.

### Track

Send [Track](/docs/connections/spec/track) calls to _ADD WHAT Track CALLS ARE USED FOR HERE_. For example:

```js
analytics.track("Login Button Clicked");
```

Segment sends Track calls to YOURINTEGRATION as a `track` event.

---
