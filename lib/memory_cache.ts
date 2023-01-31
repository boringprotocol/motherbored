import NodeCache from 'node-cache';

// Create an instance of the cache
const memoryCache = new NodeCache({ stdTTL: 60 /* seconds */, checkperiod: 120 /* seconds */ });
export default memoryCache;
