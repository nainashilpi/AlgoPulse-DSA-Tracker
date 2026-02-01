const axios = require('axios');

/**
 * @desc    Fetches real-time statistics for a given LeetCode username via GraphQL API
 * @param   {string} handle - LeetCode username
 * @returns {object|null} - Processed stats or null if fetch fails
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
    const response = await axios.post('https://leetcode.com/graphql', {
      query: query,
      variables: { username: handle }
    });

    const data = response.data.data.matchedUser;
    if (!data) return null;

    const stats = data.submitStats.acSubmissionNum;
    
    // Consolidate all difficulty tags into a single array
    const allTags = [
      ...data.tagProblemCounts.fundamental,
      ...data.tagProblemCounts.intermediate,
      ...data.tagProblemCounts.advanced
    ];

    // Sort by most problems solved and pick the Top 9
    const sortedTopics = allTags
      .sort((a, b) => b.problemsSolved - a.problemsSolved)
      .slice(0, 9)
      .map(t => ({
        name: t.tagName,
        solved: t.problemsSolved
      }));

    return {
      totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
      easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 0,
      mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 0,
      hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 0,
      calendar: data.submissionCalendar, 
      topics: sortedTopics 
    };
  } catch (error) {
    console.error("LeetCode Fetch Error:", error.message);
    return null;
  }
};

module.exports = { fetchLeetCodeStats };