import React from 'react';
import { withStyle } from 'baseui';
import { Card, StyledBody } from 'baseui/card';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { H4 } from 'baseui/typography';
import { Spinner } from 'baseui/spinner';
import { Skeleton } from 'baseui/skeleton';

import Amplify, { API, Storage } from 'aws-amplify';
import awsconfig from '../aws-exports';

Amplify.configure({
  Storage: {
    AWSS3: {
      bucket: 'arn:aws:s3:::mapimages233412-staging',
      region: 'us-east-1'
    }
}});

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
      images: [],
    }
  }

  async componentDidMount() {
    await API.get('f1tenth', '/maps').then(maps =>
      this.setState({maps: maps})
    );
    //Storage.list('').then(result => console.log(result))
    await Promise.all(this.state.maps.map(async (map, index) => {
      const response = await Storage.get(map.image_key, { download: true });
      const newImgs = this.state.images;
      newImgs[index] = URL.createObjectURL(response.Body);
      this.setState({images: newImgs});
    }));
  }

  render() {
    console.log(this.state.maps)
    this.state.maps.map((map, index) => {
      console.log(map)
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
                  <H4>{map.name}</H4>
                  {index > this.state.images.length - 1 ? (
                    <Skeleton width='300px' height='150px'/>
                  ) : (
                    <img src={this.state.images[index]}
                      style={{maxWidth: '300px', height: 'auto'}}/>
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
