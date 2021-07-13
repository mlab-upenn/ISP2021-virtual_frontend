import React from 'react';
import { withAuthenticator, AmplifySignOut, AmplifyAuthenticator } from "@aws-amplify/ui-react";
import  { API, Auth } from 'aws-amplify';

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
//  height: '40px',
//  marginBottom: '5px',
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

const Row = ({row, index}) => {
  const striped = index % 2 == 0;
  const [expanded, setExpanded] = React.useState(false);

  return (
  <div role="row" key={index} style={{display: "contents"}} key={index}>
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
)}

class Garage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitModalOpen: false,
    }
  }

  render() {


    Auth.currentAuthenticatedUser().then((user) => {
      console.log('user email = ' + user.attributes.email);
    });
    return (
      <>
      <Modal
        onClose={() => this.setState({submitModalOpen: false})}
        closeable
        isOpen={this.state.submitModalOpen}
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
            onClick={() => this.setState({submitModalOpen: false})}>Cancel</ModalButton>
          <ModalButton kind={KIND.primary} size={SIZE.compact}>Add</ModalButton>
        </ModalFooter>
      </Modal>

      <Card>
        <StyledBody>
          <InputRow>
            <p style={{display: 'flex', alignItems: 'center'}}>Team 1</p>
            <AmplifySignOut theme={{fontSize: '10'}}/>
            <Button
              startEnhancer={Plus}
              onClick={() => this.setState({submitModalOpen: true})}
              size={SIZE.compact}>
              Submit
            </Button>
          </InputRow>
          <StyledTable
            role="grid"
            $gridTemplateColumns="auto max-content max-content max-content">
            <div role="row" style={{display: "contents"}}>
              <StyledHeadCell>DockerHub Link</StyledHeadCell>
              <StyledHeadCell>Last Executed</StyledHeadCell>
              <StyledHeadCell>Evaluation</StyledHeadCell>
              <StyledHeadCell>Actions</StyledHeadCell>
            </div>

            {DATA.map((row, index) => <Row row={row} index={index} /> )}
          </StyledTable>
        </StyledBody>
      </Card>
      </>
    );
  }
};

export default withAuthenticator(Garage, {
  signUpConfig: {
    hiddenDefaults: ["phone_number"],
    //hideAllDefaults: true,
}});
