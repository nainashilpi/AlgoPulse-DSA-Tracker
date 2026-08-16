const axios = require('axios');


/**
 * @desc 
 */

const fetchLeetCodeStats = async (handle) => {
  const query = `
    query userProfile($username: String!) {
      matchedUser(username: $username) {
        submitStats {
          acSubmissionNum { difficulty count }
        }
        submissionCalendar
        tagProblemCounts {
          fundamental { tagName problemsSolved }
          intermediate { tagName problemsSolved }
          advanced { tagName problemsSolved }
        }
      }
    }
  `;

  try {
    const response = await axios.post(
      'https://leetcode.com/graphql', 
      { query: query, variables: { username: handle } },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://leetcode.com/'
        },
        timeout: 15000 
      }
    );

    if (response.data.errors) return null;
    const data = response.data.data.matchedUser;
    if (!data) return null;

    const stats = data.submitStats.acSubmissionNum;
    
    const allTags = [
      ...(data.tagProblemCounts?.fundamental || []),
      ...(data.tagProblemCounts?.intermediate || []),
      ...(data.tagProblemCounts?.advanced || [])
    ];

    const sortedTopics = allTags
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 9)
      .map(t => ({ name: t.tagName, solved: t.problemsSolved }));

    return {
      totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
      easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 0,
      hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 0,
      calendar: data.submissionCalendar, 
      topics: sortedTopics 
    };
  } catch (error) {
    console.error(`LeetCode Fetch Error (${handle}):`, error.message);
    return null;
  }
};

/**
 * @desc 
 */
const fetchGFGStats = async (handle) => {
  if (!handle) return { totalSolved: 0 };
  try {
    const baseUrl = process.env.GFG_STATS_API_URL || 'https://gfg-stats.tashif.codes';
    const response = await axios.get(`${baseUrl}/${handle}`, { timeout: 15000 });
    const data = response.data;

    if (!data || data.status !== 'success') return { totalSolved: 0 };

    const totalSolved = data.totalProblemsSolved ?? data.data?.totalSolved ?? 0;
    return { totalSolved: totalSolved || 0 };
  } catch (error) {
    console.error(`GFG Fetch Error (${handle}):`, error.message);
    return { totalSolved: 0 };
  }
};

module.exports = { fetchLeetCodeStats, fetchGFGStats };
