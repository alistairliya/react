import React, { useEffect } from "react";

const Child = ({trigger}) => {
    const log = () => {
        console.log("call from parent...");
      };
    
      useEffect(() => {
        if (trigger) {
          log();
        }
      }, [trigger]);
    
      return <h1>Child</h1>;
}

export default Child