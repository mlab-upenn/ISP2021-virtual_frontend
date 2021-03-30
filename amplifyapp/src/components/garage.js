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
import Delete from 'baseui/icon/delete';
import { KIND } from 'baseui/button';

let DATA = [
  {
    docker_hub_repo: 'team0/f1tenth:latest',
    status: 'queued',
    logs: 'Output logs will show up here',
  },
  {
    docker_hub_repo: 'team1/f1tenth:latest',
    status: 'running',
    logs: 'Output logs will show up here',
  },
  {
    docker_hub_repo: 'team2/f1tenth:latest',
    status: 'passed',
    logs: 'Output logs will show up here',
  },
  {
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
  justifyContent: 'space-between',
  height: '35px',
  marginBottom: '5px',
});

const DetailsPanel = ({logData}) => {

  return (
    <div style={{
        //boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)',
        gridColumn: 'span 4',
        padding: '20px'}}>
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
          <p style={{display: 'flex', alignItems: 'center'}}>Team 1</p>
          <Button startEnhancer={Plus} onClick={() => setModalOpen(true)}>
            Submit
          </Button>
        </InputRow>
        <StyledTable
          role="grid"
          $gridTemplateColumns="auto max-content max-content max-content">
          <div role="row" className={css({display: 'contents'})}>
            <StyledHeadCell>DockerHub Link</StyledHeadCell>
            <StyledHeadCell>Last Executed</StyledHeadCell>
            <StyledHeadCell>Evaluation</StyledHeadCell>
            <StyledHeadCell>Actions</StyledHeadCell>
          </div>

          {DATA.map((row, index) => {

            const striped = index % 2 == 0;
            const [expanded, setExpanded] = React.useState(false);

            return (
            <div role="row" key={index} className={css({display: 'contents'})} key={index}>
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
              <Cell $striped={striped}>
                <Button
                  size={SIZE.compact}
                  kind={KIND.minimal}
                  onClick={() => {
                    //alert('Removing Image');
                    DATA.splice(index, 1);
                    console.log(DATA.length)
                  }}
                  shape={SHAPE.square}
                  >
                  <Delete size={18}/>
                </Button>
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
