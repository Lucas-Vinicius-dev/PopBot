import axios from 'axios';
import { cache } from '../utils/cache.js';

// Busca da api do Codeforces
const cf = axios.create({
  baseURL: 'https://codeforces.com/api',
  timeout: 8000,
});

// preveting errors and normalizing responses
cf.interceptors.response.use(
  (res) => {
    if (res.data.status !== 'OK') {
      throw new Error(res.data.comment || 'Error in Codeforces API');
    }
    return res.data.result;
  },
  (err) => {
    const msg = err.response?.data?.comment || err.message;
    throw new Error(`Codeforces API: ${msg}`);
  }
);

// simple caching layer to reduce API calls
async function fetchCached(key, ttlMs, apiFn) {
  const cached = cache.get(key);
  if (cached) return cached;

  const data = await apiFn();
  cache.set(key, data, ttlMs);
  return data;
}

// interation with the Codeforces API
export const CodeforcesService = {
  async getUser(handle) {
    return fetchCached(`user:${handle}`, 5 * 60_000, async () => {
      try {
        const result = await cf.get('/user.info', { params: { handles: handle } });
        if (!result || result.length === 0) {
          throw new Error(`No User found: ${handle}`);
        }
        return result[0];
      } catch (err) {
        console.error(`Error fetching user ${handle}:`, err.message);
        throw err;
      }
    });
  },

  // Get recent submissions of a user
  async getSubmissions(handle, count = 10) {
    return fetchCached(`subs:${handle}`, 2 * 60_000, () =>
      cf.get('/user.status', { params: { handle, count } })
    );
  },

  async getUpcomingContests() {
    return fetchCached('contests:upcoming', 10 * 60_000, () =>
      cf.get('/contest.list').then((r) =>
        r.filter((c) => c.phase === 'BEFORE').slice(0, 5)
      )
    );
  },
};