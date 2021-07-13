import React from "react";
import { withStyle, useStyletron, styled } from "baseui";
import { Card, StyledBody } from "baseui/card";
import { Select } from "baseui/select";
import { Accordion, Panel } from "baseui/accordion";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Skeleton } from "baseui/skeleton";
import { StyledLink } from "baseui/link";

import  { API, Storage } from 'aws-amplify';

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


const RaceItem = ({team, race, maps, teamNameMap, mapImages}) => {
  const team1Win = race.time_1 < race.time_2;
  const isWin = (team == race.team_1_id) ? team1Win : !team1Win;
  const backgroundColor = !race.is_done ? "mono300" : isWin ? "positive200" : "negative200";
  const lineStyle = {width: "200px", display: "flex", justifyContent: "space-between", fontSize: "16px"}

  console.log(maps)
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
      <StyledLink href="/maps">{maps.get(race.map_id).name}</StyledLink>
      {
        mapImages[race.map_id] ? (
          <img src={mapImages[race.map_id]}
            style={{maxHeight: '100px', height: 'auto'}}/>
        ) : (
          <Skeleton width="200px" height="100px" animation/>
        )
      }

    </FlexGridItem>);
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      races: [],
      teams: [],
      maps: [],
      selectedTeam: [],
      mapImages: {},
    }
  }

  async componentDidMount() {
    await API.get('f1tenth', '/races').then(races =>
      this.setState({races: races}
    ));
    await API.get('f1tenth', '/teams').then(teams =>
      this.setState({teams:  teams.sort((a, b) => a.name < b.name ? -1 : 1)}
    ));
    let mapList;
    await API.get('f1tenth', '/maps').then(maps => mapList = maps);
    this.setState({maps: new Map(mapList.map(m => [m.id, m]))})

    const raceMapIds = new Set(this.state.races.map(race => race.map_id));
    await Promise.all([...raceMapIds].map(async (map_id) => {
      const response = await Storage.get(this.state.maps.get(map_id).image_key, {download: true });
      const mapImgs = this.state.mapImages;
      mapImgs[map_id] = URL.createObjectURL(response.Body);
      this.setState({mapImages: mapImgs});
    }));
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
                    maps={this.state.maps}
                    teamNameMap={teamNameMap}
                    mapImages={this.state.mapImages}/>
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
                    maps={this.state.maps}
                    teamNameMap={teamNameMap}
                    mapImages={this.state.mapImages}/>
                ))}
              </FlexGrid>
            </Panel>
          </Accordion>
        </CenteredBody>
      </Card>
    );
  }
}
