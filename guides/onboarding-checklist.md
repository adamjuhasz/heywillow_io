---
title: "Onboarding checklist"
description: "Onboarding checklist for new users to Willow"
date: "2022-03-08"
author: "Adam Juhasz"
---

### Things you'll need before you can connect your team's email

- [x] Access to you company's DNS to add a TXT and CNAME record
- [x] Access to your team's email to click a verification email

### During onboarding you will

- [x] Create a team
- [x] Connect a shared email (_ex: help@stealth.ai_)
- [x] Invite all your team members (_we don't charge per seat_)
- [x] Send a test email to your shared email

---

## Onboarding steps

### 1. Create an account for yourself

[Sign up](/signup) using your own work email (_ex: jane@stealth.ai_)

### 2. Create a new team

Create a new team entering your team's name (usually your company's name) and choosing a namespace (the short form of your companies name).

### 3. Link your shared inbox

Enter your shared inbox email (_ex: hi@stealth.ai_) and we'll start linking it to Willow

### 4. Configure DNS for Willow to send emails on your behalf

You'll need to add DNS entries for your domain so Willow can send emails on your behalf and they don't get marked as SPAM. This a Return Path entry and DKIM entry.

##### Return path

The Return-Path is the address where bounces and other email feedback are sent. It is specified by the Return-Path header in an email. A custom Return-Path helps tie your email reputation with your domain. Along with a DMARC policy for your domain, a custom Return-Path that aligns with your domain achieves SPF alignment helping increase inbox deliverability.

##### DKIM

DKIM (DomainKeys Identified Mail) is an email security standard designed to make sure messages aren&apos;t altered in transit between the sending and recipient servers. While DKIM isn&apos;t required, having emails that are signed with DKIM appear more legitimate to your recipients and are less likely to go to Junk or Spam folders.

##### Helpful resources for common DNS providers (from Postmark, who we use behind the scenes)

- [Google Domains](https://postmarkapp.com/videos/setting-up-dkim-custom-return-path-dmarc-in-google-domains)
- [Linode](https://www.linode.com/docs/platform/manager/dns-manager/#add-dns-records)
- [SiteGround](https://www.siteground.com/kb/configure-spf-dkim-dmarc-records/)
- [Bluehost](https://my.bluehost.com/cgi/help/559)
- [Cloudflare](https://postmarkapp.com/videos/setting-up-dkim-custom-return-path-dmarc-in-cloudflare)
- [DNS Made Easy](http://help.dnsmadeeasy.com/managed-dns/records/txt-record/)
- [DNSimple](https://support.dnsimple.com/articles/advanced-editor/)
- [Dreamhost](https://help.dreamhost.com/hc/en-us/articles/215414867-How-do-I-add-custom-DNS-records-#TXT_record)
- [DigitalOcean](https://www.digitalocean.com/docs/networking/dns/how-to/manage-records/)
- [GoDaddy](https://postmarkapp.com/videos/godaddy-authentication)
- [Hostgator](https://support.hostgator.com/articles/cpanel/how-to-change-dns-zones-mx-cname-and-a-records)
- [Hover](https://help.hover.com/hc/en-us/articles/217282457-How-to-Edit-DNS-records-A-CNAME-MX-TXT-and-SRV-Updated-Aug-2015-)
- [Media Temple](https://mediatemple.net/community/products/dv/204403794/how-can-i-change-the-dns-records-for-my-domain)
- [Melbourne IT](http://support.melbourneit.com.au/articles/help/How-do-I-manage-advanced-DNS/)
- [Namecheap](https://www.namecheap.com/support/knowledgebase/article.aspx/317)
- [Network Solutions](http://www.networksolutions.com/support/how-to-manage-advanced-dns-records)
- [Register.com](https://forum.web.com/register/faq/#AccountInformation/What_Is_a_DNS_Record.htm)
- [Gandi](https://postmarkapp.com/videos/setting-up-dkim-custom-return-path-dmarc-in-gandi)

### 5. Start forwarding inbound emails to Willow

Final setup step! Switch your email provider to start forwarding emails from your shared inbox to Willow.

##### Helpful resources for common email providers

- [Gmail (Google Apps) forwarding](/guides/forwarding-email-gmail)
- [Google Domains forwarding](/guides/forwarding-email-google-domains)

### 6. Invite your teammates

Go to the **"settings"** page, click **"Team members"** and start inviting your entire team. We don't charge per-seat so feel free to invite everyone.

### 7. Send a test email to your shared inbox.

Test out willow by sending a test email to your shared inbox (_ex: hi@stealth.ai_)

### 8. Profit!

---

### Need help?

Give us a shout at [help@heywillow.io](mailto:help@heywillow.io)
