import React, { useEffect } from "react";

const Child = ({trigger}) => {
    const log = () => {
      };
    
      useEffect(() => {
        if (trigger) {
          log();
        }
      }, [trigger]);
    
      return <h1>Child</h1>;
}

export default Child