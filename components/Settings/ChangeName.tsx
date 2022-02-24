import { useState } from "react";

import SettingsBox from "components/Settings/Box/Box";
import useGetProfile from "client/getProfile";
import useChangeProfile from "client/changeProfile";

export default function ChangeName(): JSX.Element {
  const { data: profile, isValidating } = useGetProfile();
  const [firstName, setFirstName] = useState(profile?.firstName || "");
  const [lastName, setLastName] = useState(profile?.lastName || "");

  const changeProfile = useChangeProfile();

  return (
    <SettingsBox
      disabled={isValidating}
      title="Personal information"
      explainer={<div className="h-[1px] w-full bg-zinc-600" />}
      button="Change"
      onSubmit={async () => {
        if (profile === undefined) {
          console.error("Error loading profile");
          return;
        }
        await changeProfile({
          firstName: firstName,
          lastName: lastName,
          id: profile.id,
        });
      }}
    >
      <div className="text-sm">First name</div>
      <input
        id="FirstName"
        name="FirstName"
        type="text"
        autoComplete="given-name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
        placeholder="Jane"
      />

      <div className="mt-4 text-sm">First name</div>
      <input
        id="LastName"
        name="LastName"
        type="text"
        autoComplete="family-name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="block w-72 appearance-none rounded-md border border-zinc-600 bg-zinc-900 px-3 py-2 placeholder-zinc-500 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 disabled:cursor-not-allowed sm:text-sm"
        placeholder="Appleseed"
      />
    </SettingsBox>
  );
}
