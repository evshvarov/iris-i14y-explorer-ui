import { QueryClient } from "@tanstack/react-query";
import { createHashHistory, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

const isIrisStaticBuild = import.meta.env.BASE_URL !== "/";

export const getRouter = () => {
  const queryClient = new QueryClient();
  const history =
    isIrisStaticBuild && typeof document !== "undefined"
      ? createHashHistory()
      : undefined;

  const router = createRouter({
    routeTree,
    ...(history ? { history } : {}),
    basepath: "/",
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  if (isIrisStaticBuild && typeof document !== "undefined") {
    const update = router.update.bind(router);
    router.update = (options) =>
      update(options?.basepath ? { ...options, basepath: "/" } : options);
  }

  return router;
};
