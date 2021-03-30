import React from "react";
import { withStyle, useStyletron, styled } from "baseui";
import { Card, StyledBody } from "baseui/card";
import { Select } from "baseui/select";
import { Accordion, Panel } from "baseui/accordion";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Skeleton } from "baseui/skeleton";
import { StyledLink } from "baseui/link";

import Amplify, { API } from 'aws-amplify';

const CenteredBody = withStyle(StyledBody, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
})


const InputRow = styled("div", {
  display: "flex",
  flexDirection: "row",
  height: "35px",
  marginBottom: "5px",
  width: "80%"
});


const RaceItem = ({team, race, teamNameMap}) => {
  const team1Win = race.time_1 < race.time_2;
  const isWin = (team == race.team_1_id) ? team1Win : !team1Win;
  const backgroundColor = !race.is_done ? "mono300" : isWin ? "positive200" : "negative200";

  const lineStyle = {width: "200px", display: "flex", justifyContent: "space-between", fontSize: "20px"}
  return (
    <FlexGridItem
      backgroundColor={backgroundColor}
      display="flex"
      flexDirection="row"
      alignItems="center"
      justifyContent="space-between"
      margin="5px"
      padding="10px"
      >
      <div>
        <div style={{fontWeight: team1Win ? "bold": "normal", ...lineStyle}}>
          <div>{teamNameMap.get(race.team_1_id)}</div>
          <div>{race.time_1}</div>
        </div>

        <div style={{fontWeight: !team1Win ? "bold": "normal", ...lineStyle}}>
          <div>{teamNameMap.get(race.team_2_id)}</div>
          <div>{race.time_2}</div>
        </div>
      </div>
      <StyledLink href="/maps">Map 1</StyledLink>
      <Skeleton width="300px" height="150px" animation/>
    </FlexGridItem>);
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      teams: [],
      selectedTeam: [],
    }
  }

  async componentDidMount() {
    await API.get('f1tenth', '/races').then(races =>
      this.setState({races: races}
    ));
    await API.get('f1tenth', '/teams').then(teams =>
      this.setState({teams:  teams.sort((a, b) => a.name < b.name ? -1 : 1)}
    ));
  }

  render() {

    const teamRaces = this.state.races.filter(
      race => this.state.selectedTeam.length > 0 &&
      (this.state.selectedTeam[0].id == race.team_1_id ||
      this.state.selectedTeam[0].id == race.team_2_id)
    );
    const pastRaces = teamRaces.filter(race => race.is_done);
    const upcomingRaces = teamRaces.filter(race => !race.is_done);
    const teamNameMap = new Map(this.state.teams.map(t => [t.id, t.name]));

    return (
      <Card>
        <CenteredBody>
          <InputRow>
            <Select
              autoFocus
              options={this.state.teams}
              value={this.state.selectedTeam}
              placeholder="Select Team"
              onChange={params => this.setState({selectedTeam: params.value})}
              labelKey="name"
              valueKey="id"
              />
          </InputRow>
          <Accordion>
            <Panel title={`Upcoming Races (${upcomingRaces.length})`}>
              <FlexGrid
                flexGridColumnGap="scale800"
                flexGridRowGap="scale800"
                >
                {upcomingRaces.map((race, i) => (
                  <RaceItem
                    key={i}
                    team={this.state.selectedTeam[0].id}
                    race={race}
                    teamNameMap={teamNameMap}/>
                ))}
              </FlexGrid>
            </Panel>
            <Panel title={`Past Races (${pastRaces.length})`}>
              <FlexGrid
                flexGridColumnCount={[ 2, 4, 8]}
                flexGridColumnGap="scale800"
                flexGridRowGap="scale800"
                >
                {pastRaces.map((race, i) => (
                  <RaceItem
                    key={i}
                    team={this.state.selectedTeam[0].id}
                    race={race}
                    teamNameMap={teamNameMap}/>
                ))}
              </FlexGrid>
            </Panel>
          </Accordion>
        </CenteredBody>
      </Card>
    );
  }
}
