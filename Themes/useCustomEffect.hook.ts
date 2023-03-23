import { useEffect, useLayoutEffect } from "react";

const useCustomEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default useCustomEffect;
