---
title: "Designing a developer experience oriented API"
description: "Designing a developer experience oriented API means we focus on the developer and how they'll consume the API and its documentation"
date: "2022-04-08"
author: "Adam Juhasz"
---

We've all dealt with the frustration of working with a hastily designed and badly documented API. Since we got to start fresh, we wanted to make sure the #1 focus was on the developer experience around consuming our API. The easier (and maybe even delightful) the API was to consume, the better chance we have of converting our next customer.

---

## Our design ethos

1. Be obvious and not smart
2. Say more than less
3. Be helpful not cryptic
4. Have 1 way to do something

## Link back to documentation for those that skipped it

All our our APIs return 2 extra headers `link` and `x-documentation` that both point to the correct documentation page for that API endpoint.

We also sometimes link to more specific pages. If we detect an incorrect authorization scheme, we link to the authorization page of our developer docs to help the developer out vs forcing them to use a search engine or navigate around our website.

For example, when the request has no authorization header we return the following message

> API Key invalid; No authorization header, see https://heywillow.io/docs/v1/authentication

We're always striving to add more links to our error and warning messages.

## Show what the API will do

Show how how the API will affect the platform, don't let the developer guess. If a call will affect a workflow then show a diagram of how the change will cascade through the platform, highlight any dangerous or permanent effects. If it'll be visible in the app itself, show the changes in a mockup of the application.

For Willow our developer documentation was created within our larger site and so we were able to re-use our components to [display parts of our application inside the docs](/docs/v1/user/user_id#in-app-demo). We think this makes understanding how to use the API easier as well as why to use the API endpoint.

![Live UI demonstration of request body changes](/images/blogs/designing-a-developer-experience-oriented-api/live-gui-demo.gif)

## Make choices obvious

When an API consumer can make a choice, force them to make a choice and make it obvious what that decision is. Limit the number of default options, in fact try not to have any.

We had to decide if we wanted to require the consumer to declare an api version or just allow the consumer to opt-in to a specific version. Going back to ethos 1, "be obvious and not smart", we require the consumer to declare the api version. Instead of `/api/user/[user_id]` we went with `/api/[version]/user/[user_id]`. While this may cause burden later down the road if we need to turn off an API version, we think that paying that cost then is better than auto-updating a consumer and breaking their code in unexpected ways. We all hate waking up a page that an external call has started returning `400` responses.

## Checking types and valid ranges

Not only is the api value valid for the type (did they send a string instead of a number) but does it make sense, was a float sent when an integer was expected? Be aggressive in detecting and verbose in reporting these types of mismatches. It's better to expose these errors during the development than in production. Much of the Willow team came from a Haskell background and always appreciated the errors(comfort) that [aeson](https://github.com/haskell/aeson) provided when there was a decoding issue from JSON to [Haskell ADTs](http://learnyouahaskell.com/making-our-own-types-and-typeclasses).

## Lightning round

- Be liberal with `id` anchors. Allow easy linking to sections of our pages so colleagues can link to specific sections.
- Be consistent. We do allow some optional arguments around idempotency and had to decide if the idempotency key should be sent as an optional header or be an optional key in the body. The easy thing would be to accept both, but that violated ethos 4. After a brief poll we found that some libraries made it
  easier to modify the body vs adding optional headers so we went with adding optional keys. Now all optional features will be keys.
- Match your developer docs hierarchy with your api hierarchy. For Willow, You can replace the `/api/` part of any endpoint with `/docs/` to get to the right page.
