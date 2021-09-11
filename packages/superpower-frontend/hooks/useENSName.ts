import useActiveWeb3React from "@/hooks/useActiveWeb3React";
import { useEffect, useState } from "react";

export default function useENSName(address?: string | null) {
  const { library } = useActiveWeb3React();

  const [ENSName, setENSName] = useState("");

  useEffect(() => {
    if (library && typeof address === "string") {
      let stale = false;

      library
        .lookupAddress(address)
        .then((name) => {
          if (!stale && typeof name === "string") {
            setENSName(name);
          }
        })
        .catch(() => {});

      return () => {
        stale = true;
        setENSName("");
      };
    }
  }, [library, address]);

  return ENSName;
}
