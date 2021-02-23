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

import Bracket from './components/bracket';
import Livestream from './components/livestream';
import Schedule from './components/schedule';
import Submission from './components/submission';

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
const path = '/bracket';
const myInit = { // OPTIONAL
    response: true,
    headers: {}, // OPTIONAL
};

const headers = [
  {
    link: "/submission", title: "Submission", component: <Submission />,
  },
  {
    link: "/stream", title: "Livestream", component: <Livestream />,
  },
  {
    link: "/bracket", title: "Bracket", component: <Bracket />,
  },
  {
    link: "/schedule", title: "Schedule", component: <Schedule />,
  },
];

export default function App() {
  (async function () {
    const response = await head();
    console.log(response);
  })();

  //const response = await API.get('f1tenth', '/bracket');
  //console.log(response);
  API.get(apiName, path, myInit).then(response => console.log(response));
  return (
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <Router>
          <HeaderNavigation>
            <NavigationList $align={ALIGN.left}>
              {headers.map(header => (
                <NavigationItem>
                  <StyledLink href={header.link}>
                    {header.title}
                  </StyledLink>
                </NavigationItem>
              ))}
            </NavigationList>
            <NavigationList />
            <NavigationList $align={ALIGN.right}>
              <NavigationItem>
                <StyledLink href="https://f1tenth.org/index.html">
                  <img src={f1logo} width="50px" alt='logo' style={{marginRight:"20px"}}/>
                </StyledLink>
              </NavigationItem>
            </NavigationList>
          </HeaderNavigation>

          <Switch>
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
          height='80px'
          backgroundColor='primary200'>

        </Block>
      </BaseProvider>
    </StyletronProvider>
  );
}
