
import NodeCache from 'node-cache';

const serverCache = new NodeCache({
  stdTTL: 15 * 60, // 15 minutes in seconds
  checkperiod: 60, // Check for expired entries every 60 seconds
});

export default serverCache;