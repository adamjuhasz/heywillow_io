// http://localhost:3000/management/gmail/1/17edd1ff9b5b0da7
const exampleGmail = {
  id: "17edd1ff9b5b0da7",
  threadId: "17edd1ff9b5b0da7",
  labelIds: ["CATEGORY_PERSONAL", "INBOX"],
  snippet:
    "Y&#39;all could use a social sharing card for sites like twitter: https://cards-dev.twitter.com/validator",
  payload: {
    partId: "",
    mimeType: "multipart/related",
    filename: "",
    headers: [
      {
        name: "Delivered-To",
        value: "hi@paytgthr.com",
      },
      {
        name: "Received",
        value:
          "by 2002:a4a:bd87:0:0:0:0:0 with SMTP id k7csp924382oop;        Tue, 8 Feb 2022 22:16:07 -0800 (PST)",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a05:6808:1303:: with SMTP id y3mr689026oiv.90.1644387367083;        Tue, 08 Feb 2022 22:16:07 -0800 (PST)",
      },
      {
        name: "ARC-Seal",
        value:
          "i=1; a=rsa-sha256; t=1644387367; cv=none;        d=google.com; s=arc-20160816;        b=T8p89ondUH1p018S5vXzp3lGXlLie0V8ZxKbQ+wyZb2GQQBpj9ghoXGRHgWVzDWfzV         hGZ0xMsaLr+ZOk+V+ncjkioCQJChwwExN+yuza5akA+hsc8Rpb72gD0oN/XmhJAZymQo         FyyvkBD8YiLIqlKKTzfI7MtXtIuq2KLs+yIiUXeTGwd/VHsWNUzgfS7vLAgLcmgh6++S         cxo1Xy0MMkD91UDOy2PT2X0dCMecEAhTOwNjFngkUN+VpVTdazL2NbljiV4FOwyCo7si         oJyLBLutZ4vMIGP/zwvAVtldAmwX0AJ1WjHUvYnkySuUbZYvogmpaEhUqmFaGZAW2vsp         vYEA==",
      },
      {
        name: "ARC-Message-Signature",
        value:
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;        h=to:subject:message-id:date:from:mime-version:dkim-signature;        bh=35I41P9yWyH6hdohB5agd6undRJvl4tfcUjmULvkHbo=;        b=PsMo2pD8ProWbhGHAEZQY2k38LiiEkbpsAiJMg2WYvWEbybDW9ttbJuDgPArJCra/0         vcMWYwSVHmN/ltpPieEZhv66lsDMgpft+xtYmELW3JITHnjrJum7HSuAyVVE7ivoUuNj         H0B2cjzNh0v96BF8ouuFTEm9Ptnoha08re4LUoq3nC3pViQDAhY86B8F3KTVX/AF4GDB         6cxKykR1HxCfRZ1JZ1Sm+N24R4hd4lWIT45BiY+KySRjA0/ub5+YIi/A8q/bsLBKruvy         8Ay1x/frxzR73PcJ3tnltH24fag5o+T/kFDrimzG1tbVqxL0x79q60dkLU64nboZiU4b         fXFQ==",
      },
      {
        name: "ARC-Authentication-Results",
        value:
          "i=1; mx.google.com;       dkim=pass header.i=@gmail.com header.s=20210112 header.b=RGFxAPGe;       spf=pass (google.com: domain of oleary.gabe@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=oleary.gabe@gmail.com;       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com",
      },
      {
        name: "Return-Path",
        value: "<oleary.gabe@gmail.com>",
      },
      {
        name: "Received",
        value:
          "from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])        by mx.google.com with SMTPS id 5sor10186404oif.18.2022.02.08.22.16.06        for <hi@paytgthr.com>        (Google Transport Security);        Tue, 08 Feb 2022 22:16:07 -0800 (PST)",
      },
      {
        name: "Received-SPF",
        value:
          "pass (google.com: domain of oleary.gabe@gmail.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;",
      },
      {
        name: "Authentication-Results",
        value:
          "mx.google.com;       dkim=pass header.i=@gmail.com header.s=20210112 header.b=RGFxAPGe;       spf=pass (google.com: domain of oleary.gabe@gmail.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=oleary.gabe@gmail.com;       dmarc=pass (p=NONE sp=QUARANTINE dis=NONE) header.from=gmail.com",
      },
      {
        name: "DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=gmail.com; s=20210112;        h=mime-version:from:date:message-id:subject:to;        bh=35I41P9yWyH6hdohB5agd6undRJvl4tfcUjmULvkHbo=;        b=RGFxAPGe0iS8M4pLru0h8cYJGAQh/f0eCyonChBj2KkPM43f1Kq7Z3dH+X7uDCE0ze         8mdTFfvF8r0i/vr6kSDJrcGQ0hX3McDF81mX3MNFPhHZQVZvcP+E/XXXhNxZfpWSStjB         exrVIp2aO4bBQ4jtLj871XwjbPHITOzfhV3jU5brCpfcqZbRuqdootOiAYadI/lWHQzG         gDqZ10ySUbvNB5KTAmtu+I9+XoE1uRP03rxpGjuluV1m0u4Q0qz/968cPo17WHV+bpPU         /pjjx3eYaet1sp2iwGlkCJlDt3I1PeK2qUXYReUKS6rOc9otiNScl4BJkrKYfjStH6++         2LoA==",
      },
      {
        name: "X-Google-DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20210112;        h=x-gm-message-state:mime-version:from:date:message-id:subject:to;        bh=35I41P9yWyH6hdohB5agd6undRJvl4tfcUjmULvkHbo=;        b=CDLKCsiEz9BOHRWBY+/WDD6G82JNS+o3iLp6yFaF7EFKq8BwZHH0I+AKeYLT1tRFN0         68i2oZUgVaj/2cKht8C/8x7zLNIMQkcrrZm3CYuqcCV0fiCfstKTzMC8XD3vAb1BzHN3         opLCQ3Q0z8qqfeu1PmGY7XMi3APVb0Rq+N+sUn0prP1C5qIsZEevNIFAPjswFzBciPts         bRaKrH5xLyX0sn/ksGUBWkVwSpjAS+IuJ53UUedSIBCPLt1EEHk9E3IyvWwvHbVbQjAU         bi+GR8/Oqs/DNX/h46n/ZsE5RWeWHdJq9U53v4qOCt0qoiurrBhxWptCmlKJNUu5zf9q         nUtA==",
      },
      {
        name: "X-Gm-Message-State",
        value:
          "AOAM5309r3jztarnAIKhdyzytEDX/6sV+txgswIHxyAjT9LnoVz2obXt pq03Qx1EDTfQzR5aKhmJ52bG8e3EyA7MiVJL8LCXkWiU+ME=",
      },
      {
        name: "X-Google-Smtp-Source",
        value:
          "ABdhPJw16N9XMn+64YQa4QgC/6iuLpj+q6DV0W65iZhZyZP+Vf8qX5Mn/gg/jCI25K/rlRYk2qZM8/CazqWVqP8tXZQ=",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a05:6808:188a:: with SMTP id bi10mr306074oib.141.1644387366022; Tue, 08 Feb 2022 22:16:06 -0800 (PST)",
      },
      {
        name: "MIME-Version",
        value: "1.0",
      },
      {
        name: "From",
        value: '"Gabe O\'Leary" <oleary.gabe@gmail.com>',
      },
      {
        name: "Date",
        value: "Tue, 8 Feb 2022 22:15:54 -0800",
      },
      {
        name: "Message-ID",
        value:
          "<CAJnHKs7QOMfgNNEQHb9PXhFY29gHoSomoG4yZWwKCqT0MkTsPg@mail.gmail.com>",
      },
      {
        name: "Subject",
        value: "Twitter social card",
      },
      {
        name: "To",
        value: "Pay Tgthr <hi@paytgthr.com>",
      },
      {
        name: "Content-Type",
        value: 'multipart/related; boundary="000000000000d388e705d78fc42c"',
      },
    ],
    body: {
      size: 0,
    },
    parts: [
      {
        partId: "0",
        mimeType: "multipart/alternative",
        filename: "",
        headers: [
          {
            name: "Content-Type",
            value:
              'multipart/alternative; boundary="000000000000d388e505d78fc42b"',
          },
        ],
        body: {
          size: 0,
        },
        parts: [
          {
            partId: "0.0",
            mimeType: "text/plain",
            filename: "",
            headers: [
              {
                name: "Content-Type",
                value: 'text/plain; charset="UTF-8"',
              },
            ],
            body: {
              size: 148,
              data: "Y'all could use a social sharing card for sites like twitter:\r\n[image: image.png]\r\n\r\n[image: image.png]\r\n\r\nhttps://cards-dev.twitter.com/validator\r\n",
            },
          },
          {
            partId: "0.1",
            mimeType: "text/html",
            filename: "",
            headers: [
              {
                name: "Content-Type",
                value: 'text/html; charset="UTF-8"',
              },
              {
                name: "Content-Transfer-Encoding",
                value: "quoted-printable",
              },
            ],
            body: {
              size: 365,
              data: '<div dir="ltr">Y&#39;all could use a social sharing card for sites like twitter:<br><img src="cid:ii_kzf5qysg0" alt="image.png" width="532" height="367"><br><br><img src="cid:ii_kzf5rgjh1" alt="image.png" width="532" height="263"><br><div><br></div><div><a href="https://cards-dev.twitter.com/validator">https://cards-dev.twitter.com/validator</a><br></div></div>\r\n',
            },
          },
        ],
      },
      {
        partId: "1",
        mimeType: "image/png",
        filename: "image.png",
        headers: [
          {
            name: "Content-Type",
            value: 'image/png; name="image.png"',
          },
          {
            name: "Content-Disposition",
            value: 'inline; filename="image.png"',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "base64",
          },
          {
            name: "Content-ID",
            value: "<ii_kzf5qysg0>",
          },
          {
            name: "X-Attachment-Id",
            value: "ii_kzf5qysg0",
          },
        ],
        body: {
          attachmentId:
            "ANGjdJ_a69QnJlPNvAfP7IMqBD7xHGLXR__OD65W2og_XQOf_z_AD3mTWPCxYKwtE-Jeh5gLmnj7YIgxAEkSkiO8yfb8Roy2arKdNVKe67H-30osWqi-6TBZ9BFzE_-SzEk7sVR7Z7adEfyIjOElwyWPBwcK89UxzGAink2YhNSR_2OzpyGv3CuSv01tmLZsaL3avokr6_TXzqbrGu80Xc1FLJ3QJ-4pGGN6b2Hed9u1AXRCwpNbG-56BBuju9PwYlV1KacK91IvhOJgslzjcqKT8rMN247MdzGLskGNt3uN4iQ3swZX7ZsVPm9K-AshdRaH9cfWjRf12F_gZvz9DwqoNLAEUqE20X7Z4ebZhEvdEG0avKphoCxuYhmTPUqsKY8Z0ooRNC8C_BmeqCU8",
          size: 170615,
        },
      },
      {
        partId: "2",
        mimeType: "image/png",
        filename: "image.png",
        headers: [
          {
            name: "Content-Type",
            value: 'image/png; name="image.png"',
          },
          {
            name: "Content-Disposition",
            value: 'inline; filename="image.png"',
          },
          {
            name: "Content-Transfer-Encoding",
            value: "base64",
          },
          {
            name: "Content-ID",
            value: "<ii_kzf5rgjh1>",
          },
          {
            name: "X-Attachment-Id",
            value: "ii_kzf5rgjh1",
          },
        ],
        body: {
          attachmentId:
            "ANGjdJ9E8ip2X1fvuTvzRA1ciIOxAeoBYFVC38OH0lxL7pmQ-TQ-BAFvmthTziqg54yJOgeHEVErM4TLU9M0tmiGRGfG2h2LaqWj0jiQRAKaVjL4RIgWw59H6toJVB_aGvGeYABMXusQLCnekRo2FwOVRt8kdtNQGoyClD4mHwjm1LWmo02zEqVXEEJena5AW-hWzEsXQu0yLNMEl7YnIx0cLOdcmVuOQ5nFM0byJDpgn6oIgS4e9ftGcZn5VWypU0qFojlyW6gP2PvQyxV7EkJLJjDUSwP03JIXcKNiuXm0sLlHpQl5A-CWC003NZuDDQaUsyaNtPD5Y7qRI8KlRiTEE6L_YFmrYOscwoxYIlZ1VkiehXIYLk0irj0JneCO-ntdRpDHhoUQ1I1f1dUY",
          size: 142412,
        },
      },
    ],
  },
  sizeEstimate: 434220,
  historyId: "2674232",
  internalDate: "1644387354000",
};

export default exampleGmail;
