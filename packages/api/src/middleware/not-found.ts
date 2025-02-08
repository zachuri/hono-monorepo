import type { NotFoundHandler } from "hono";

import { NOT_FOUND } from "@repo/api/lib/http-status-codes";
import { NOT_FOUND as NOT_FOUND_MESSAGE } from "@repo/api/lib/http-status-phrases";

const notFound: NotFoundHandler = (c) => {
  return c.json({
    message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`,
  }, NOT_FOUND);
};

export default notFound;