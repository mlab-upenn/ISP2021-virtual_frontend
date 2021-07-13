import React from 'react';
import Amplify, { API } from 'aws-amplify';
import awsconfig from './aws-exports';

//Baseweb
import {Client as Styletron} from 'styletron-engine-atomic';
import {Provider as StyletronProvider} from 'styletron-react';
import {LightTheme, BaseProvider, styled} from 'baseui';
import {
  HeaderNavigation,
  ALIGN,
  StyledNavigationList as NavigationList,
  StyledNavigationItem as NavigationItem,
} from "baseui/header-navigation";
import { StyledLink } from "baseui/link";
import { Block } from "baseui/block";

//Router
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Garage from './components/garage';
import Teams from './components/teams';
import Race from './components/race';
import Maps from './components/maps';
import LogIn from './components/logIn';
import Stream from './components/stream';

import f1logo from './f1_stickers_01.png';
import './App.css';

Amplify.configure(awsconfig);


const engine = new Styletron();

function head() {
  const apiName = 'f1tenth';
  const path = '/bracket';
  const myInit = { // OPTIONAL
      response: true,
      headers: {}, // OPTIONAL
  };

  return API.get(apiName, path, myInit);
}


const apiName = 'f1tenth';
const path = '/races';
const myInit = { // OPTIONAL
    response: true,
    headers: {}, // OPTIONAL
};

const headers = [
  {
    link: "/garage", title: "Garage", component: <Garage />,
  },
  {
    link: "/teams", title: "Teams", component: <Teams />,
  },
  {
    link: "/race", title: "Race", component: <Race />,
  },
  {
    link: "/maps", title: "Maps", component: <Maps />,
  },
  {
    link: "/stream", title: "Stream", component: <Stream />,
  },
];

export default function App() {

  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Router>
          <HeaderNavigation>
            <NavigationList $align={ALIGN.left}>
              {headers.map((header, index) => (
                <NavigationItem key={index}>
                  <StyledLink href={header.link}>
                    {header.title}
                  </StyledLink>
                </NavigationItem>
              ))}
            </NavigationList>
            <NavigationList />
            <NavigationList $align={ALIGN.right}>
              <NavigationItem>
                { //<LogIn />
                }
              </NavigationItem>
              <NavigationItem>
                <StyledLink href="https://f1tenth.org/index.html">
                  <img src={f1logo} width="50px" alt='logo' style={{marginRight:"20px"}}/>
                </StyledLink>
              </NavigationItem>
            </NavigationList>
          </HeaderNavigation>

          <Switch>
            {//<Route path={'/'}>
              //<h>Welcome!</h>
            //</Route>
            }
            {headers.map(header => (
              <Route path={header.link}>
                {header.component}
              </Route>)
            )}
          </Switch>

        </Router>

        <Block
          position='fixed'
          width='100%'
          left='0'
          bottom='0'
          height='40px'
          backgroundColor='primary200'>
        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
}
