import dgram from "dgram";

import { udp } from "../setting";
const { prot, address } = udp;

const client = dgram.createSocket("udp4");
client.bind(prot, address);

export const initUdp = (option = {}) => {
  const { success, error, close } = option;
  client.on("message", (msg, info) => {
    if (!success) return;
    success(msg, info);
  });

  client.on("error", (err) => {
    if (!error) return;
    error(err);
  });

  client.on("close", () => {
    if (!close) return;
    close();
  });
};
