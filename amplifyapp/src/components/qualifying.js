import React from "react";
import { withStyle, useStyletron, styled } from "baseui";
import { Card, StyledBody } from "baseui/card";
import { Select } from "baseui/select";
import { Accordion, Panel } from "baseui/accordion";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Skeleton } from "baseui/skeleton";
import { StyledLink } from "baseui/link";
import { Button, KIND, SIZE } from "baseui/button";
import { Tag } from  "baseui/tag";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import { FormControl } from "baseui/form-control";
import { Input } from "baseui/input";
import { DatePicker } from "baseui/datepicker";
import Plus from "baseui/icon/plus";
import Overflow from "baseui/icon/overflow"
import {
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
} from "baseui/table-grid";

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
  justifyContent: "space-between",
  height: "35px",
  marginBottom: "5px",
});

const Cell = withStyle(StyledBodyCell, {
  display: "flex",
  alignItems: "center",
  height: "30px"
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
      modalOpen: false,
      scheduleDate: new Date(),
      races: [],
      teamNameMap: {},
      mapNameMap: {},
    }
  }

  async componentDidMount() {
    await API.get('f1tenth', '/races').then(races => this.setState({races: races}));
    let teamList = [];
    await API.get('f1tenth', '/teams').then(teams => teamList = teams);
    this.setState({teamNameMap: new Map(teamList.map(t => [t.id, t]))});
    let mapList = [];
    await API.get('f1tenth', '/maps').then(maps => mapList = maps);
    this.setState({mapNameMap: new Map(mapList.map(m => [m.id, m]))});
  }

  render() {

    const futureRaces = this.state.races.filter(race => !race.is_done);

    return (
      <Card>
        <InputRow>
          <p style={{display: "flex", fontWeight: "bold", alignItems: "center"}}>
            Upcoming Races ({futureRaces.length})
          </p>
        </InputRow>
        <StyledTable
          role="grid"
          $gridTemplateColumns="max-content max-content max-content auto max-content">
          <div role="row" style={{display: "contents"}}>
            <StyledHeadCell>Date</StyledHeadCell>
            <StyledHeadCell>Team 1</StyledHeadCell>
            <StyledHeadCell>Team 2</StyledHeadCell>
            <StyledHeadCell>Map</StyledHeadCell>
            <StyledHeadCell>Status</StyledHeadCell>
          </div>
          {futureRaces.map((race, index) => {

            const striped = index % 2 == 0;

            return (
              <div role="row" key={index} style={{display: "contents"}}>
                <Cell $striped={striped}>
                  Jan 1, 1970 - 12:00pm
                </Cell>
                <Cell $striped={striped}>
                  {
                    this.state.teamNameMap.get ?
                      this.state.teamNameMap.get(race.team_1_id).name : " "
                  }
                </Cell>
                <Cell $striped={striped}>
                  {
                    this.state.teamNameMap.get ?
                      this.state.teamNameMap.get(race.team_2_id).name : " "

                  }
                </Cell>
                <Cell $striped={striped}>
                  <StyledLink href="/maps">
                    {
                    this.state.teamNameMap.get && this.state.mapNameMap.get ?
                      this.state.mapNameMap.get(race.map_id).name : " "
                    }
                  </StyledLink>
                </Cell>
                <Cell $striped={striped}>
                  <Tag
                    closeable={false}
                    variant="outlined"
                    kind={{
                      "queued": "neutral",
                      "running": "warning",
                      "passed": "positive",
                      "failed": "negative",
                    }["queued"]}
                    >
                    {"queued"}
                  </Tag>
                </Cell>
              </div>
            )
          })}
        </StyledTable>


      </Card>
    );

  };
};
