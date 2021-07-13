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

const CenteredBody = withStyle(StyledBody, {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center"
})

const TEAMS = [
  {
      "name": "Team 1",
      "id": "1168bf01-018d-4150-b721-ff0b06b9710e"
  },
  {
      "name": "Team 2",
      "id": "6da0708c-2d7a-4394-80f6-ab08af95329c"
  },
  {
      "name": "Team 3",
      "id": "2eaf65c6-2d27-492f-8f94-782a834fd9ec"
  },
  {
      "name": "Team 4",
      "id": "92f5bf19-3cf4-4528-85ab-0f2dee3a156e"
  },
];
const RACES = [
  {
    "is_done": true,
    "team_1_id": "1168bf01-018d-4150-b721-ff0b06b9710e",
    "team_2_id": "6da0708c-2d7a-4394-80f6-ab08af95329c",
    "map_id": "1d0e2e47-c794-4330-94f3-c80073d403a4",
    "time_1": "0:45",
    "time_2": "0:53",
    "video_link": "s3://something",
  },
  {
    "is_done": true,
    "team_1_id": "1168bf01-018d-4150-b721-ff0b06b9710e",
    "team_2_id": "2eaf65c6-2d27-492f-8f94-782a834fd9ec",
    "map_id": "1d0e2e47-c794-4330-94f3-c80073d403a4",
    "time_1": "0:45",
    "time_2": "0:40",
    "video_link": "s3://something",
  },
  {
    "is_done": true,
    "team_1_id": "1168bf01-018d-4150-b721-ff0b06b9710e",
    "team_2_id": "6da0708c-2d7a-4394-80f6-ab08af95329c",
    "map_id": "1d0e2e47-c794-4330-94f3-c80073d403a4",
    "time_1": "0:45",
    "time_2": "0:53",
    "video_link": "s3://something",
  },
  {
    "is_done": false,
    "team_1_id": "1168bf01-018d-4150-b721-ff0b06b9710e",
    "team_2_id": "6da0708c-2d7a-4394-80f6-ab08af95329c",
    "map_id": "1d0e2e47-c794-4330-94f3-c80073d403a4",
    "time_1": null,
    "time_2": null,
    "video_link": null,
  },
];

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

export default () => {
  const [css] = useStyletron();
  const [modalOpen, setModalOpen] = React.useState(false);
  const [scheduleDate, setScheduleDate] = React.useState([new Date]);

  const futureRaces = RACES.filter(race => !race.is_done);
  const teamNameMap = new Map(TEAMS.map(t => [t.id, t.name]));
  console.log(scheduleDate)
  return (
    <Card>
      <Modal
        onClose={() => setModalOpen(false)}
        closeable
        isOpen={modalOpen}
        animate>
        <ModalHeader>Schedule Race</ModalHeader>
        <ModalBody>
          <FormControl label={() => "Team 1"}>
            <Input />
          </FormControl>
          <FormControl label={() => "Team 2"}>
            <Input />
          </FormControl>
          <FormControl label={() => "Map"}>
            <Select />
          </FormControl>
          <FormControl label={() => "Match Date"}>
            <DatePicker
              value={scheduleDate}
              onChange={({date}) => setScheduleDate(Array.isArray(date) ? date : [date])}
              clearable
              peekNextMonth
              timeSelectStart
              />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <ModalButton
            kind={KIND.secondary}
            size={SIZE.compact}
            onClick={() => setModalOpen(false)}>Cancel</ModalButton>
          <ModalButton kind={KIND.primary} size={SIZE.compact}>Add</ModalButton>
        </ModalFooter>
      </Modal>
      <InputRow>
        <p style={{display: "flex", fontWeight: "bold", alignItems: "center"}}>
          Pending Races ({futureRaces.length})
        </p>
        <Button startEnhancer={Plus} onClick={() => setModalOpen(true)}>
          Schedule
        </Button>
      </InputRow>
      <StyledTable
        role="grid"
        $gridTemplateColumns="max-content max-content max-content auto max-content max-content">
        <div role="row" className={css({display: "contents"})}>
          <StyledHeadCell>Date</StyledHeadCell>
          <StyledHeadCell>Team 1</StyledHeadCell>
          <StyledHeadCell>Team 2</StyledHeadCell>
          <StyledHeadCell>Map</StyledHeadCell>
          <StyledHeadCell>Status</StyledHeadCell>
          <StyledHeadCell>Edit</StyledHeadCell>
        </div>
        {futureRaces.map((race, index) => {

          const striped = index % 2 == 0;

          return (
            <div role="row" key={index} className={css({display: "contents"})}>
              <Cell $striped={striped}>
                Jan 1, 1970 - 12:00pm
              </Cell>
              <Cell $striped={striped}>
                {teamNameMap.get(race.team_1_id)}
              </Cell>
              <Cell $striped={striped}>
                {teamNameMap.get(race.team_2_id)}
              </Cell>
              <Cell $striped={striped}>
                <StyledLink href="/maps">Map 1</StyledLink>
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
              <Cell $striped={striped}>
                <Overflow size={18} />
              </Cell>


            </div>
          )
        })}
      </StyledTable>
    </Card>
  );
}
