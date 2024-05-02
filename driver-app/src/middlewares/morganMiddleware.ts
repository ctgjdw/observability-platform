import morgan, {StreamOptions} from "morgan";

import Logger from "../utils/logger";

const CustomStream: StreamOptions = {
  write: (message: string) => Logger.http(message)
};

// const skip = () => {
//   const env = process.env.NODE_ENV || "development";
//   return env != "development";
// }

// const morganMiddleware = morgan(
//   ":remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms :trace_id :span_id :trace_flags",
//   {stream, skip}
// )

export default CustomStream