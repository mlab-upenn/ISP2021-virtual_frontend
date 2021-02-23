import React from 'react';
import { withStyle } from 'baseui';
import { Card, StyledBody } from 'baseui/card';
import { Skeleton } from 'baseui/skeleton';

const CenteredBody = withStyle(StyledBody, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
})
export default () => (
  <Card>
    <CenteredBody>
      <Skeleton
        height='300px'
        width='80%'
        animation
      />
    </CenteredBody>
  </Card>
);
