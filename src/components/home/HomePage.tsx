import React, { useEffect, useState } from "react";
import Header from "./Header";
import CountDown from "./CountDown";
import Couple from "./Couple";
import Story from "./Story";
import Gallery from "./Gallery";
import { getSubdomain } from "../../services/api";

const HomePage: React.FC = () => {
  const [subdomain, setSubdomain] = useState<string>('');

  useEffect(() => {
    const currentSubdomain = getSubdomain();
    setSubdomain(currentSubdomain);
    
    // Here you can use the subdomain to fetch specific data for this domain
    console.log('Current subdomain:', currentSubdomain);
    // TODO: Implement API calls using the subdomain data
  }, []);

  return (
    <div className="App">
      <Header />
      <CountDown />
      <Couple />
      <Story />
      <Gallery />
    </div>
  );
};

export default HomePage;