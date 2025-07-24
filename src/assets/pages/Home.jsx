import React from 'react'
import Info from '../components/Info';

function Home(props) {

  return (
    <>
      {props.info && <Info setInfo={props.setInfo} />}
    </>
  )
}

export default Home;