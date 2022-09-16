import React, { useEffect, useState } from 'react'

export default function useDomain() {
    const [domain, setDomain] = useState<string>();

    useEffect(() => {
      setDomain(window.location.protocol+'//'+window.location.host);    
    }, [])
    
  return domain;
}
