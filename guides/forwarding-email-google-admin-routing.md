---
title: "Configuring Gmail Forwarding Using Default Routing"
description: "Guide to forwarding Google Apps emails using default routing"
date: "2022-03-29"
updated: "2022-03-29"
author: "Adam Juhasz"
---

1. Visit the [default routing admin page](https://admin.google.com/u/5/ac/apps/gmail/defaultrouting).
2. Click "CONFIGURE".
3. Choose "Single recipient". Enter the email address you want to forward under "Email address". _ex: hi@stealth.vc_
4. Select "Add X-Gm-Original-To header".
5. Choose how to forward emails to Willow
   1. If you want to keep receiving email to the account's Gmail inbox choose "Add more recipients" and click "Add". Enter the email your inbox was assigned _ex: namespace@inbound.heywillow.io_.
   2. If you want to have email only come to Willow choose "Change envelope recipient". Choose "Replace recipient". Enter the email your inbox was assigned _ex: namespace@inbound.heywillow.io_.
6. Choose "Perform this action on non-recognized and recognized addresses".
7. Click "Save"

---

More info: [Set up default routing](https://apps.google.com/supportwidget/articlehome?hl=en&article_url=https%3A%2F%2Fsupport.google.com%2Fa%2Fanswer%2F2368153%3Fhl%3Den&product_context=2368153&product_name=UnuFlow&trigger_context=a)
