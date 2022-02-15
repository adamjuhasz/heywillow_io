const withBase64 = {
  id: "17efa38397d89294",
  threadId: "17efa38397d89294",
  labelIds: ["UNREAD", "CATEGORY_PERSONAL", "INBOX"],
  snippet: "One more time",
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
          "by 2002:a4a:bd87:0:0:0:0:0 with SMTP id k7csp4596069oop;        Mon, 14 Feb 2022 13:51:36 -0800 (PST)",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a63:2bd1:: with SMTP id r200mr932964pgr.68.1644875495898;        Mon, 14 Feb 2022 13:51:35 -0800 (PST)",
      },
      {
        name: "ARC-Seal",
        value:
          "i=1; a=rsa-sha256; t=1644875495; cv=none;        d=google.com; s=arc-20160816;        b=rjYKdrIuFUxvU/5iQSvL5tvRuoOw3kVbZ9nbAt+Ukzi03XbSWVD8N7J2HJb3c3lp1F         dkhQLzcv+63Xfu3nyazBVWFZq3i1oM+jTWfakpE5rJPMbonN+yeBXH+i3dwwPYbtaeWJ         wpZ3Ue2YDhb/I7QA9hEzMOSmS929nG3IsSLlkDfuwy8a/O957pJM7H0TPa2PWR2SJhgY         TvUxvs0h5vzoclEG0IJKRyu9T0t3sZb068V4qZ7T3+zTbAxc3uG4Pl33v/LjaqFbKHjT         /P3E+1tT/IruYFaf32Y/3H9lOe4eG0mlEw9LPDAPpjfnXdVlGMNM7aHz+bv6za7FN8Gz         pUnw==",
      },
      {
        name: "ARC-Message-Signature",
        value:
          "i=1; a=rsa-sha256; c=relaxed/relaxed; d=google.com; s=arc-20160816;        h=mime-version:subject:message-id:to:from:date:dkim-signature;        bh=GZTsrrL+D1B339f7c+sLDqciRmZKwq7ZXmgSAoK0RBA=;        b=NZKTWnWi7DsHoH59YXJxxrSJa2sWrW6zGgUUfoFLf2X+LmERXIET/N2+GuS+kxlzXy         6radV91Wp+TnOsUpsqb/5Xl0UeIU77BiP35RMCJYPu+Ir8DEW71BJPnKl2ffpsXipCjx         DdgE8D2Ui+2TJ0yKA+eXTVa4xwG55M57mgf9fgRMRRvB9694fF/zvdWiFhld4aB9r/ra         FLMLtxilCVa6XqqO5xYXRWckw3lniA6DJbWfPb9ixWn7+Vx65qSRcBz1aw68QkMYbbhd         JMwiX0GyT2Qfi/RtVIF5Zndk2J7Dv8Qg2dFI9WSfzlEf3DrtlJZei186VzlPnS4YWQ+D         B/iA==",
      },
      {
        name: "ARC-Authentication-Results",
        value:
          "i=1; mx.google.com;       dkim=pass header.i=@akitram.com header.s=google header.b=iD8iSgfM;       spf=pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=adam@akitram.com",
      },
      {
        name: "Return-Path",
        value: "<adam@akitram.com>",
      },
      {
        name: "Received",
        value:
          "from mail-sor-f41.google.com (mail-sor-f41.google.com. [209.85.220.41])        by mx.google.com with SMTPS id l3sor1986613pjm.5.2022.02.14.13.51.35        for <hi@paytgthr.com>        (Google Transport Security);        Mon, 14 Feb 2022 13:51:35 -0800 (PST)",
      },
      {
        name: "Received-SPF",
        value:
          "pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) client-ip=209.85.220.41;",
      },
      {
        name: "Authentication-Results",
        value:
          "mx.google.com;       dkim=pass header.i=@akitram.com header.s=google header.b=iD8iSgfM;       spf=pass (google.com: domain of adam@akitram.com designates 209.85.220.41 as permitted sender) smtp.mailfrom=adam@akitram.com",
      },
      {
        name: "DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=akitram.com; s=google;        h=date:from:to:message-id:subject:mime-version;        bh=GZTsrrL+D1B339f7c+sLDqciRmZKwq7ZXmgSAoK0RBA=;        b=iD8iSgfMVtE/rVOUGbZjpLgHd9tclXgPkfL+RYU/CHfBtmmfgykEAeqs9Q6zdK7Ic/         3ptx1LaRgJJMcmlkCuPaAwjntyJ09G+IYWjIo6i1LI+rr/5GQc9r1x993aMuo+HOBNgE         598TcAcnI/TtPuDq/5RV/KXI1SIUxsmVwLITg=",
      },
      {
        name: "X-Google-DKIM-Signature",
        value:
          "v=1; a=rsa-sha256; c=relaxed/relaxed;        d=1e100.net; s=20210112;        h=x-gm-message-state:date:from:to:message-id:subject:mime-version;        bh=GZTsrrL+D1B339f7c+sLDqciRmZKwq7ZXmgSAoK0RBA=;        b=i41MwejyfgtG9hvsUUtMetBncWmXXlV4mSzoH3iC9Xk5XcLlBFwGW/vkf4VKsOGLIY         n0CjvyX+y0qYYT2BEj4OaWRwxCk3e051zhlfnjod3xOZ7VihM8XkNZbhv4iZQECnDNRM         GBXi4Z4itlgd4aLZVK3n8HzXRPKdFvIUPpu6inVSJrHo7HWKEiqTuhqqZXtM07zqRmBJ         rakZeSaZwZTixbI7yrOcCU0RKzSjgfjgR7H7oJLQB5f9x11qpgKzmgreuTALWkccI5Q5         TkIgpy1oOdMvPInN+6Alcq5Oi90ACuU5qojA/QKKsuJm7Dzuhpu2+avQQ3uxsVvvZF7n         YvdQ==",
      },
      {
        name: "X-Gm-Message-State",
        value:
          "AOAM533GFyF/fL96xsb0EjNj5/s9pQ4Bj78/UQ7N+ohBBh92if1oP4Nu tbUZru8Hco9X8rJVBWOUQ1cQYD+sY8WRZQ==",
      },
      {
        name: "X-Google-Smtp-Source",
        value:
          "ABdhPJy0/IrN5ZtBalLxGXf+BrN0ckCek6XWtVGT7WsmI0YnK6JwWcQ7NigC3EYvYxWWaos7j4qNWA==",
      },
      {
        name: "X-Received",
        value:
          "by 2002:a17:90b:4a50:b0:1b9:50b8:2b8b with SMTP id lb16-20020a17090b4a5000b001b950b82b8bmr782994pjb.45.1644875495319;        Mon, 14 Feb 2022 13:51:35 -0800 (PST)",
      },
      {
        name: "Return-Path",
        value: "<adam@akitram.com>",
      },
      {
        name: "Received",
        value:
          "from [10.1.0.53] (148-64-104-104.PUBLIC.monkeybrains.net. [148.64.104.104])        by smtp.gmail.com with ESMTPSA id z14sm32913455pfh.173.2022.02.14.13.51.34        for <hi@paytgthr.com>        (version=TLS1_2 cipher=ECDHE-ECDSA-AES128-GCM-SHA256 bits=128/128);        Mon, 14 Feb 2022 13:51:34 -0800 (PST)",
      },
      {
        name: "Date",
        value: "Mon, 14 Feb 2022 13:51:24 -0800",
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
        value: "<c800bd88-3334-48bf-adeb-f281c4849714@Spark>",
      },
      {
        name: "Subject",
        value: "ugh",
      },
      {
        name: "X-Readdle-Message-ID",
        value: "c800bd88-3334-48bf-adeb-f281c4849714@Spark",
      },
      {
        name: "MIME-Version",
        value: "1.0",
      },
      {
        name: "Content-Type",
        value: 'multipart/alternative; boundary="620acee6_2eb141f2_249a"',
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
          { name: "Content-Type", value: 'text/plain; charset="utf-8"' },
          { name: "Content-Transfer-Encoding", value: "7bit" },
          { name: "Content-Disposition", value: "inline" },
        ],
        body: { size: 15, data: "T25lIG1vcmUgdGltZQ0K" },
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
          size: 183,
          data: '<html xmlns="http://www.w3.org/1999/xhtml">\r\n<head>\r\n<title></title>\r\n</head>\r\n<body>\r\n<div name="messageBodySection">\r\n<div dir="auto">One more time</div>\r\n</div>\r\n</body>\r\n</html>\r\n',
        },
      },
    ],
  },
  sizeEstimate: 5035,
  historyId: "2677202",
  internalDate: "1644875484000",
};

export default withBase64;
