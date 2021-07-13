import React from 'react';
import { withStyle } from 'baseui';
import { Card, StyledBody } from 'baseui/card';
import { FlexGrid, FlexGridItem } from 'baseui/flex-grid';
import { H5 } from 'baseui/typography';
import { Spinner } from 'baseui/spinner';
import { Skeleton } from 'baseui/skeleton';

import Amplify, { API, Storage } from 'aws-amplify';

// Socket IO
import io from 'socket.io-client';
const socket = io('http://54.157.123.175:8080/')


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
      frame: undefined,
    }


  }

  //subscribeToFrameCallback(cb) {
  //  socket.on('frame', frame => cb(null, frame));
    //socket.emit('subscribeToFrameCallback', 1000);
  //}

  async componentDidMount() {
    socket.on('connect', () => {
      console.log('connected');
      //socket.emit('clientReady');
    });

    socket.on('frame', (data) => {
      //console.log(resp);
      console.log('frame received')
      console.log(data)
      const blob = new Blob([data.data], { type: "image/png" });
      //var blob = new Blob( [ arrayBufferView ] );
      const srcBlob = URL.createObjectURL(blob)
      //const img = document.getElementById( 'img' );
      //img.src = srcBlob;
      console.log(srcBlob)
      this.setState({frame: srcBlob});
      //socket.emit('clientReady');
    });

    return;
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
    //console.log(this.state.maps)
    this.state.maps.map((map, index) => {
      console.log(index)
      console.log(this.state.images[map.id])
    })
    //console.log("data:image/png;base64," + this.state.frame)
    return (
      <Card>
        <CenteredBody>

          {this.state.maps.length == 0 && this.state.frame? (
            <img src={this.state.frame} width='600px'/>
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
