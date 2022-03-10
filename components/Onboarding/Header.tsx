import { PropsWithChildren } from "react";

import AppContainer from "components/App/Container";
import StickyBase from "components/App/Header/StickyBase";
import RightSideMenu from "components/App/Header/RightSideMenu";
import WillowLogoLink from "components/App/Header/WillowLogoLink";
import HeaderContainer from "components/App/Header/HeaderContainer";

export default function OnboardingHeader(props: PropsWithChildren<unknown>) {
  return (
    <StickyBase>
      <AppContainer>
        <HeaderContainer>
          <div className="flex h-full items-center space-x-4 ">
            <WillowLogoLink />
          </div>

          <div className="flex h-full items-center space-x-4 ">
            <RightSideMenu />
          </div>
        </HeaderContainer>
      </AppContainer>
      {props.children === undefined ? (
        <></>
      ) : (
        <AppContainer>{props.children}</AppContainer>
      )}
    </StickyBase>
  );
}
