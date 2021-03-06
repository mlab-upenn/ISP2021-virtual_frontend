import React from 'react';
import { withStyle } from 'baseui';
import { Card, StyledBody } from 'baseui/card';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { H5 } from 'baseui/typography';
import { Spinner } from 'baseui/spinner';
import { Skeleton } from 'baseui/skeleton';

import Amplify, { API, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';


const CenteredBody = withStyle(StyledBody, {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
});

export default class extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      maps: [],
      images: {},
    }
  }

  async componentDidMount() {
    await API.get('f1tenth', '/maps').then(maps =>
      this.setState({maps: maps})
    );
    //Storage.list('').then(result => console.log(result))
    await Promise.all(this.state.maps.map(async (map) => {
      const response = await Storage.get(map.image_key, { download: true });
      const newImgs = this.state.images;
      newImgs[map.id] = URL.createObjectURL(response.Body);
      this.setState({images: newImgs});
    }));
  }

  render() {
    console.log(this.state.maps)
    this.state.maps.map((map, index) => {
      console.log(index)
      console.log(this.state.images[map.id])
    })
    return (
      <Card>
        <CenteredBody>
          {this.state.maps.length == 0 ? (
            <Spinner />
          ) : (
            <FlexGrid>
              {this.state.maps.map((map, index) => (
                <FlexGridItem key={index}
                  display='flex'
                  flexDirection='row'
                  justifyContent='space-between'
                  margin='10px'>
                  <H5>{map.name}</H5>
                  {this.state.images[map.id] === undefined ? (
                    <Skeleton width='300px' height='100px'/>
                  ) : (
                    <img src={this.state.images[map.id]}
                      style={{maxHeight: '100px', height: 'auto'}}/>
                  )}

                </FlexGridItem>
              ))}
            </FlexGrid>
          )}
        </CenteredBody>
      </Card>
    )
  }
}
