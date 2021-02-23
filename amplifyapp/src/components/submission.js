import React from 'react';
import { withStyle, useStyletron, styled } from 'baseui';
import { StyledLink } from 'baseui/link';
import { Card, StyledBody } from 'baseui/card';
import {
  StyledTable,
  StyledHeadCell,
  StyledBodyCell,
} from 'baseui/table-grid';
import { Tag } from 'baseui/tag';
import { Button, SHAPE } from 'baseui/button';
import { Input, SIZE } from 'baseui/input';
import { FormControl } from 'baseui/form-control';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalButton,
} from "baseui/modal";
import Plus from 'baseui/icon/plus';
import ChevronRight from 'baseui/icon/chevron-right';
import ChevronDown from 'baseui/icon/chevron-down';
import { KIND } from 'baseui/button';

const DATA = [
  {
    team_id: 'team0',
    docker_hub_repo: 'team0/f1tenth:latest',
    status: 'queued',
    logs: 'Output logs will show up here',
  },
  {
    team_id: 'team1',
    docker_hub_repo: 'team1/f1tenth:latest',
    status: 'running',
    logs: 'Output logs will show up here',
  },
  {
    team_id: 'team2',
    docker_hub_repo: 'team2/f1tenth:latest',
    status: 'passed',
    logs: 'Output logs will show up here',
  },
  {
    team_id: 'team3',
    docker_hub_repo: 'team3/f1tenth:latest',
    status: 'failed',
    logs: 'Output logs will show up here',
  },
];

const Cell = withStyle(StyledBodyCell, {
  display: 'flex',
  alignItems: 'center',
  height: '30px'
});

const InputRow = styled('div', {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  height: '35px',
  marginBottom: '5px',
});

const DetailsPanel = ({logData}) => {

  return (
    <div style={{gridColumn: 'span 4', padding: '20px'}}>
      {logData}
    </div>
  );
};

export default () => {

  const [css] = useStyletron();
  const [modalOpen, setModalOpen] = React.useState(false);

  return (
    <>
    <Modal
      onClose={() => setModalOpen(false)}
      closeable
      isOpen={modalOpen}
      animate
      >
      <ModalHeader>Submit Docker Container</ModalHeader>
      <ModalBody>
        <FormControl label={() => "Submission Code"}>
          <Input />
        </FormControl>
        <FormControl label={() => "Team ID"}>
          <Input />
        </FormControl>
        <FormControl
          label={() => "Docker Hub repository name"}
          caption={() => "Must follow user/repo:tag format. E.g. nvidia/cuda:latest"}
        >
          <Input />
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

    <Card>
      <StyledBody>
        <InputRow>
          <Button startEnhancer={Plus} onClick={() => setModalOpen(true)}>
            Submit
          </Button>
        </InputRow>
        <StyledTable
          role="grid"
          isLoading={true}
          $gridTemplateColumns="max-content auto max-content max-content">
          <div role="row" className={css({display: 'contents'})}>
            <StyledHeadCell>Team</StyledHeadCell>
            <StyledHeadCell>DockerHub Link</StyledHeadCell>
            <StyledHeadCell>Last Executed</StyledHeadCell>
            <StyledHeadCell>Evaluation</StyledHeadCell>
          </div>

          {DATA.map((row, index) => {

            const striped = index % 2 == 0;
            const [expanded, setExpanded] = React.useState(false);

            return (
            <div role="row" className={css({display: 'contents'})} key={index}>
              <Cell $striped={striped}>
                <Button
                  size={SIZE.compact}
                  kind={KIND.minimal}
                  onClick={() => setExpanded(!expanded)}
                  shape={SHAPE.square}
                  >
                  {expanded ? (
                    <ChevronDown size={18} />
                  ) : (
                    <ChevronRight size={18} />
                  )}
                </Button>
                {row.team_id}
              </Cell>
              <Cell $striped={striped}>
                {row.docker_hub_repo}
              </Cell>
              <Cell $striped={striped}>
                Jan 01, 2020
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
                  }[row.status]}
                  >
                  {row.status}
                </Tag>
              </Cell>
              {expanded && <DetailsPanel logData={row.logs} />}
            </div>

          )})}
        </StyledTable>
      </StyledBody>
    </Card>
    </>
  )
};
