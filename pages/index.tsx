import Head from "next/head";
import React from "react";
import Link from "next/link";

import Hero from "components/LandingPage/Hero";
import LogoCloud from "components/LandingPage/LogoCloud";
import StayOnTop from "components/LandingPage/Benefits/Left/1";
import BetterUnderstand from "components/LandingPage/Benefits/Right/1";
import Features from "components/LandingPage/Features";
import EasyAPI from "components/LandingPage/Benefits/Left/2";
import KeepPIISecure from "components/LandingPage/Benefits/Left/3";
import SecureMessaging from "components/LandingPage/Benefits/Right/2";
import Stats from "components/LandingPage/Stats";
import Header from "components/LandingPage/Header";

const footerNavigation = {
  solutions: [
    { name: "Customer Service", href: "#" },
    { name: "Customer Discovery", href: "#" },
    { name: "Customer Outreach", href: "#" },
  ],
  support: [
    { name: "Pricing", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Guides", href: "#" },
    {
      name: (
        <div className="flex items-center">
          <span className="mr-2 h-2 w-2  rounded-full bg-lime-400" /> API Status
        </div>
      ),
      href: "#",
    },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Press", href: "#" },
  ],
  legal: [
    { name: "Privacy", href: "#" },
    { name: "Terms", href: "#" },
  ],
  compare: [
    {
      name: "Willow vs Front",
      href: "/",
    },
    {
      name: "Willow vs Zendesk",
      href: "/",
    },
    {
      name: "Willow vs Gladly",
      href: "/",
    },
    {
      name: "Willow vs Customer.io",
      href: "/",
    },
    {
      name: "Willow vs Hiver",
      href: "/",
    },
  ],
};

export default function Example() {
  return (
    <>
      <Head>
        <title>Willow</title>
      </Head>
      <div className="bg-white">
        <header>
          <Header />
        </header>

        <main>
          {/* Hero section */}
          <Hero />

          {/* Logo Cloud */}
          <LogoCloud />

          {/* Alternating Feature Sections */}
          <div className="relative overflow-hidden pt-16 pb-32">
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-gray-100"
            />
            <StayOnTop />
            <div className="mt-24">
              <BetterUnderstand />
            </div>

            <div className="mt-24">
              <EasyAPI />
            </div>

            <div className="mt-24">
              <SecureMessaging />
            </div>

            <div className="mt-24">
              <KeepPIISecure />
            </div>
          </div>

          {/* Gradient Feature Section */}
          <Features />

          {/* Stats section */}
          <Stats />

          {/* CTA Section */}
          <div className="bg-white">
            <div className="mx-auto max-w-4xl py-16 px-4 sm:px-6 sm:py-24 lg:flex lg:max-w-7xl lg:items-center lg:justify-between lg:px-8">
              <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                <span className="block">Ready to get started?</span>
                <span className="block bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Get in touch or create an account.
                </span>
              </h2>
              <div className="mt-6 space-y-4 sm:flex sm:space-y-0 sm:space-x-5">
                <Link href="mailto:hi@willow.support">
                  <a className="flex items-center justify-center rounded-md border border-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 text-base font-medium text-white shadow-sm hover:from-purple-700 hover:to-indigo-700">
                    Learn more
                  </a>
                </Link>
                <Link href="/signup">
                  <a className="flex items-center justify-center rounded-md border border-transparent bg-indigo-50 px-4 py-3 text-base font-medium text-indigo-800 shadow-sm hover:bg-indigo-100">
                    Get started
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="bg-gray-50" aria-labelledby="footer-heading">
          <h2 id="footer-heading" className="sr-only">
            Footer
          </h2>
          <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8 lg:pt-24">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
              <div className="grid grid-cols-2 gap-8 xl:col-span-2">
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                      Solutions
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footerNavigation.solutions.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href}>
                            <a className="text-base text-gray-500 hover:text-gray-900">
                              {item.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 md:mt-0">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                      Support
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footerNavigation.support.map((item, id) => (
                        <li key={id}>
                          <a
                            href={item.href}
                            className="text-base text-gray-500 hover:text-gray-900"
                          >
                            {item.name}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="md:grid md:grid-cols-2 md:gap-8">
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                      Company
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footerNavigation.company.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href}>
                            <a className="text-base text-gray-500 hover:text-gray-900">
                              {item.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-12 md:mt-0">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-400">
                      Compare us
                    </h3>
                    <ul role="list" className="mt-4 space-y-4">
                      {footerNavigation.compare.map((item) => (
                        <li key={item.name}>
                          <Link href={item.href}>
                            <a className="text-base text-gray-500 hover:text-gray-900">
                              {item.name}
                            </a>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {/* <div className="mt-12 xl:mt-0">
                <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase">
                  Subscribe to our newsletter
                </h3>
                <p className="mt-4 text-base text-gray-500">
                  The latest news, articles, and resources, sent to your inbox
                  weekly.
                </p>
                <form className="mt-4 sm:flex sm:max-w-md">
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    type="email"
                    name="email-address"
                    id="email-address"
                    autoComplete="email"
                    required
                    className="appearance-none min-w-0 w-full bg-white border border-gray-300 rounded-md shadow-sm py-2 px-4 text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                  <div className="mt-3 rounded-md sm:mt-0 sm:ml-3 sm:flex-shrink-0">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-origin-border px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white hover:from-purple-700 hover:to-indigo-700"
                    >
                      Subscribe
                    </button>
                  </div>
                </form>
              </div> */}
            </div>
            <div className="mt-12 border-t border-gray-200 pt-8 md:flex md:items-center md:justify-between lg:mt-16">
              <p className="mt-8 text-base text-gray-400 md:order-1 md:mt-0">
                &copy; 2022 Willow, Inc. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
