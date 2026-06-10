import React from "react";
import PageLayout from "../../Components/Layout/PageLayout";
import Feed from "../../Components/Feed/Feed";

const Home = ({ sidebar, isMobile, category }) => {
  return (
    <PageLayout sidebar={sidebar} isMobile={isMobile}>
      <Feed category={category} />
    </PageLayout>
  );
};

export default Home;
