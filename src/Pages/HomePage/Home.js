import React from 'react';
import ProfilePic from '../SharedPage/ProfilePic';
//import Employee from './Employee';
//import HomeBanner from './HomeBanner';
import NavbarItem from './NavbarItem';
import OutstandingTask from './OutstandingTask';
//import OutstandingTask from './OutstandingTask';


const Home = () => {
    return (
      <div className="h-full">
         <ProfilePic />  
       {/*  <HomeBanner /> */}
        <NavbarItem />
        {/*  <Employee /> */}
       {/*  <OutstandingTask />  */}
       
      </div>
    );
};

export default Home;