import React from 'react';
import { Card, StyledBody } from 'baseui/card';

import { Bracket, RoundProps } from 'react-brackets';


const rounds: RoundProps[] = [
  {
    title: 'Round 1',
    seeds: [
      {
        id: 0,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: 'Team 1', score: 2 },
          { id: 2, name: 'Team 8', score: 6 },
        ],
      },
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: 'Team 2', score: 2 },
          { id: 3, name: 'Team 7', score: 6 },
        ],
      },
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: 'Team 3', score: 2 },
          { id: 3, name: 'Team 6', score: 6 },
        ],
      },
      {
        id: 1,
        date: new Date().toDateString(),
        teams: [
          { id: 1, name: 'Team 4', score: 2 },
          { id: 3, name: 'Team 5', score: 6 },
        ],
      },
    ],
  },
  {
    title: 'Round 2',
    seeds: [{}, {}],
  },
  {
    title: 'Round 3',
    seeds: [{}]
  },
];

export default () => (
  <Card>
    <Bracket rounds={rounds}
      mobileBreakpoint={400}
      swipeableProps={{ enableMouseEvents: true, animateHeight: true }}

      />

  </Card>
);
