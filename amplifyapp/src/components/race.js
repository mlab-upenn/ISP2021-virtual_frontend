import React from 'react';
import { withStyle } from 'baseui';
import { Card, StyledBody } from 'baseui/card';
import { Skeleton } from 'baseui/skeleton';
import { Tabs, Tab, FILL } from 'baseui/tabs-motion';

import Bracket from './bracket';
import Qualifying from './qualifying';
import RaceNow from './raceNow';

const CenteredBody = withStyle(StyledBody, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})
export default () => {
  const [activeKey, setActiveKey] = React.useState("0");

  return (
    <Tabs
      activeKey={activeKey}
      onChange={({ activeKey }) => setActiveKey(activeKey)}
      fill={FILL.fixed}
      >
      <Tab title='Qualifying'>
        <Qualifying />
      </Tab>
      <Tab title='Tournament'>
        <Bracket />
      </Tab>
      <Tab title='Race Now'>
        <RaceNow />
      </Tab>

    </Tabs>
  )
};
