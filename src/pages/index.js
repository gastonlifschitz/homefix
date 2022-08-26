import React from 'react';
import ListWorkers from '../components/ListWorkers';

const Home = () => {
  // Redirect to loin if not logged
  return (
    <>
      <ListWorkers id="listWorkers" showCategories={true} />
    </>
  );
};

export default Home;
