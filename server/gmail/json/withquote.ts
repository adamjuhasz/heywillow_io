const withquote = {
  id: "17ed7054df48555f",
  threadId: "17ed6e3f4ed1e664",
  labelIds: ["CATEGORY_PERSONAL"],
  snippet:
    "Same thread as “who is this&quot; On Feb 7, 2022, 5:12 PM -0800, Adam Juhasz &lt;adam@akitram.com&gt;, wrote: Who is this?",
  payload: {
    partId: "",
    mimeType: "multipart/alternative",
    filename: "",
    headers: [
      {
        name: "Delivered-To",
        value: "hi@paytgthr.com",
      },
      {
        name: "Received",
        value:
          "by 2002:a4a:bd87:0:0:0:0:0 with SMTP id k7csp171155oop;        Mon, 7 Feb 2022 17:49:16 -0800 (PST)",
      },
      {
        name: "X-Received",
        value:
          "by 2002:aa7:9059:: with SMTP id n25mr2115783pfo.47.1644284956193;        Mon, 07 Feb 2022 17:49:16 -0800 (PST)",
      },
      {
        name: "ARC-Seal",
        value:
          "i=1; a=rsa-sha256; t=1644284956; cv=none;        d=google.com; s=arc-20160816;        b=jpSHhA5rRoKqPdFcMvgg88dahoMYvk1xjCSZhX+rr7nfToXaogycEQFDMg243CUjDL         uc6NNzLkWMtooYv8S2UNGs9lzeg2aXuTxlH18nIMj+7Kol/kKtNPuNTQ3cuzxnu6X7Nz         aHp78ubHAG/ihMPzAbKpUEGHM2ahvHTXrd6byL4naJidKVxWdJE260tWkGsRrS+lKTRX         0KxNAuZ6a3FDRdpfXt9Pg25jND/gFlu0ZmpJ+pLZL0iRLc8WFYY5LvdxWr/1cJmaMkZ4         9z9c2Z9GYIYQ2oe2WXpoVKdxjnLJTf7GWSXITWKW3xpsowHsG7g0h/aWPtTD1BgeL3Do         wy0A==",
      },
      {
        name: "ARC-Message-Signature",
        value:
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;        h=mime-version:subject:references:in-reply-to:message-id:to:from:date         :dkim-signature;        bh=apQ4cjJkjQcwArNum8lVz5Gf4UH7zEVgn6ijL4yPhP4=;        b=A06lc6oY3CUgHB3niZEmPEX5o04k/CIvXnGHMw8n5N0TCLqLYu3Zzt8++KEDb6Rw3w         g+mIh988FQq0ArbWISifw7TO0HiRYpZqajRuHNUCuGEHeIc0kIkDg6IkiAv5PMa1pGrP         lq/CSFf1JqlLS/7omKikpRvfp6IsU1uof77RMFXACepJirR2/QpYg2mk4W1nmxA2kYxF         51GINLy+vJW5DVGtjDC5XfXocc2lhKXzQ0qw0NP3ETwpysLqnkBpzQTxzCX40MtqsxFE         o9EeD7uC5Znm3IkTqKpZCdqAuhYF1ThlIZ2VfqmJwcJVpIqb9wgU4z47fzEQRXnAcUK1         lbgQ==",
      },
      {
        name: "ARC-Authentication-Results",
        value:
          "i=1; mx.google.com;       dkim=pass header.i=@akitram.com header.s=google header.b=UFq8UJEj;       spf=pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=adam@akitram.com",
      },
      {
        name: "Return-Path",
        value: "<adam@akitram.com>",
      },
      {
        name: "Received",
        value:
          "from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])        by mx.google.com with SMTPS id ob2sor468632pjb.5.2022.02.07.17.49.15        for <hi@paytgthr.com>        (Google Transport Security);        Mon, 07 Feb 2022 17:49:16 -0800 (PST)",
      },
      {
        name: "Received-SPF",
        value:
          "pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;",
      },
      {
        name: "Authentication-Results",
        value:
          "mx.google.com;       dkim=pass header.i=@akitram.com header.s=google header.b=UFq8UJEj;       spf=pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=adam@akitram.com",
      },
      {
        name: "DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=akitram.com; s=google;        h=date:from:to:message-id:in-reply-to:references:subject:mime-version;        bh=apQ4cjJkjQcwArNum8lVz5Gf4UH7zEVgn6ijL4yPhP4=;        b=UFq8UJEjcCVh9ZRRmfAB5ccThdQj0rMMqjcezvfyuAVlHHdv2IFSWpu2kvqi/u9Y0E         UycgOFh+cVhK9z/kKoLIPO3bvEmyhzeE/lv4mkGF5rLwkz5oxSSsdCHBNujsaG5pYzR7         pkse2DuxNTfFstIRi4nZ7/0yvkIAe7yQr+emY=",
      },
      {
        name: "X-Google-DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20210112;        h=x-gm-message-state:date:from:to:message-id:in-reply-to:references         :subject:mime-version;        bh=apQ4cjJkjQcwArNum8lVz5Gf4UH7zEVgn6ijL4yPhP4=;        b=Fa3Efg0SV3CuTc80nq7zDUIMqXJu1wBAYCSf29uiLxhoLkcnb7+vK6yam4ZPN5Pm8u         03qdA9hiykLb7iKfdjRfCJIPGx9ef3Ca89td0yQSLiUCdWaY3I3l/W/qiVN5Jnk5bwlN         N33u0ckxvk9m3qpnxGI6V4asXa6AnMs7dtcx7ejckrcVPOb89+nyF6rCLM/XQ5zAdeLW         xstprhuwJ+7VUXzmUN3XCZN4ismD1FHZ5nghEzu5BD4mpgdssYaoA6Kz9QzJfWkmA4Ya         MnCnSGDsKVx77LgWo4TZuynMeODHbNd5Z8bWZl15P11OqSPsLMnZWa0rE1vhJx121mzX         WBKQ==",
      },
      {
        name: "X-Gm-Message-State",
        value:
          "AOAM533mq9D5yyaQcYhPUgBqiwsbdW7d7V3eLcs+w2tZZto7X24w3Yil W7mSBv7pOq1J1JttaD7QjGutG2UImAArQw==",
      },
      {
        name: "X-Google-Smtp-Source",
        value:
          "ABdhPJxjpNeOE2f+9ukqNRpwDn+pQy2dDRtB7TS8wo6t+hysBJ31sAmiCUnB6EiExEXii1UdvjCBKg==",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a17:90b:350c:: with SMTP id ls12mr1897027pjb.44.1644284955380;        Mon, 07 Feb 2022 17:49:15 -0800 (PST)",
      },
      {
        name: "Return-Path",
        value: "<adam@akitram.com>",
      },
      {
        name: "Received",
        value:
          "from [10.1.0.22] (148-64-104-104.PUBLIC.monkeybrains.net. [148.64.104.104])        by smtp.gmail.com with ESMTPSA id y191sm13456758pfb.114.2022.02.07.17.49.14        for <hi@paytgthr.com>        (version=TLS1_2 cipher=ECDHE-ECDSA-AES128-GCM-SHA256 bits=128/128);        Mon, 07 Feb 2022 17:49:15 -0800 (PST)",
      },
      {
        name: "Date",
        value: "Mon, 7 Feb 2022 17:49:09 -0800",
      },
      {
        name: "From",
        value: "Adam Juhasz <adam@akitram.com>",
      },
      {
        name: "To",
        value: "Pay Tgthr <hi@paytgthr.com>",
      },
      {
        name: "Message-ID",
        value: "<61ca541d-7529-44db-a088-2d7f85facf17@Spark>",
      },
      {
        name: "In-Reply-To",
        value: "<2cd3a4e6-de8f-445c-b51b-fd533146dcc8@Spark>",
      },
      {
        name: "References",
        value: "<2cd3a4e6-de8f-445c-b51b-fd533146dcc8@Spark>",
      },
      {
        name: "Subject",
        value: "Re: another adam email",
      },
      {
        name: "X-Readdle-Message-ID",
        value: "61ca541d-7529-44db-a088-2d7f85facf17@Spark",
      },
      {
        name: "MIME-Version",
        value: "1.0",
      },
      {
        name: "Content-Type",
        value: 'multipart/alternative; boundary="6201cc1a_836c40e_22d"',
      },
    ],
    body: {
      size: 0,
    },
    parts: [
      {
        partId: "0",
        mimeType: "text/plain",
        filename: "",
        headers: [
          {
            name: "Content-Type",
            value: 'text/plain; charset="utf-8"',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "quoted-printable",
          },
          {
            name: "Content-Disposition",
            value: "inline",
          },
        ],
        body: {
          size: 119,
          data: 'Same thread as “who is this"\r\nOn Feb 7, 2022, 5:12 PM -0800, Adam Juhasz <adam@akitram.com>, wrote:\r\n> Who is this?\r\n',
        },
      },
      {
        partId: "1",
        mimeType: "text/html",
        filename: "",
        headers: [
          {
            name: "Content-Type",
            value: 'text/html; charset="utf-8"',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "quoted-printable",
          },
          {
            name: "Content-Disposition",
            value: "inline",
          },
        ],
        body: {
          size: 561,
          data: '<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n<title></title>\r\n</head>\r\n<body>\r\n<div name="messageBodySection">\r\n<div dir="auto">Same thread as “who is this"</div>\r\n</div>\r\n<div name="messageReplySection">On Feb 7, 2022, 5:12 PM -0800, Adam Juhasz &lt;adam@akitram.com&gt;, wrote:<br />\r\n<blockquote type="cite" style="border-left-color: grey; border-left-width: thin; border-left-style: solid; margin: 5px 5px;padding-left: 10px;">\r\n<div name="messageBodySection">\r\n<div dir="auto">Who is this?</div>\r\n</div>\r\n</blockquote>\r\n</div>\r\n</body>\r\n</html>\r\n',
        },
      },
    ],
  },
  sizeEstimate: 5769,
  historyId: "2672908",
  internalDate: "1644284949000",
};

export default withquote;
