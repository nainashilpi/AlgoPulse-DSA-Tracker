// const axios = require('axios');

// /**
//  * @desc    Fetches real-time statistics for a given LeetCode username via GraphQL API
//  * @param   {string} handle - LeetCode username
//  * @returns {object|null} - Processed stats or null if fetch fails
//  */
// const fetchLeetCodeStats = async (handle) => {
//   const query = `
//     query userProfile($username: String!) {
//       matchedUser(username: $username) {
//         submitStats {
//           acSubmissionNum { difficulty count }
//         }
//         submissionCalendar
//         tagProblemCounts {
//           fundamental { tagName problemsSolved }
//           intermediate { tagName problemsSolved }
//           advanced { tagName problemsSolved }
//         }
//       }
//     }
//   `;

//   try {
//     const response = await axios.post(
//       'https://leetcode.com/graphql', 
//       {
//         query: query,
//         variables: { username: handle }
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
//           'Referer': 'https://leetcode.com/'
//         },
//         timeout: 10000 // 10 seconds timeout for stability
//       }
//     );

//     // Safety check for GraphQL errors
//     if (response.data.errors) {
//       console.error("LeetCode User Not Found or Restricted:", handle);
//       return null;
//     }

//     const data = response.data.data.matchedUser;
//     if (!data) return null;

//     const stats = data.submitStats.acSubmissionNum;
    
//     // Consolidate all difficulty tags into a single array with optional chaining
//     const allTags = [
//       ...(data.tagProblemCounts?.fundamental || []),
//       ...(data.tagProblemCounts?.intermediate || []),
//       ...(data.tagProblemCounts?.advanced || [])
//     ];

//     // Sort by most problems solved and pick the Top 9
//     const sortedTopics = allTags
//       .sort((a, b) => b.problemsSolved - a.problemsSolved)
//       .slice(0, 9)
//       .map(t => ({
//         name: t.tagName,
//         solved: t.problemsSolved
//       }));

//     return {
//       totalSolved: stats.find(s => s.difficulty === 'All')?.count || 0,
//       easySolved: stats.find(s => s.difficulty === 'Easy')?.count || 0,
//       mediumSolved: stats.find(s => s.difficulty === 'Medium')?.count || 0,
//       hardSolved: stats.find(s => s.difficulty === 'Hard')?.count || 0,
//       calendar: data.submissionCalendar, 
//       topics: sortedTopics 
//     };
//   } catch (error) {
//     console.error(`LeetCode Fetch Error (${handle}):`, error.message);
//     return null;
//   }
// };

// module.exports = { fetchLeetCodeStats };


const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const path = require('path');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

/**
 * @desc Fetches LeetCode stats (Unchanged)
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
        timeout: 10000 
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
 * @desc Fetches GFG total solved count (Updated with Stealth)
 */
const fetchGFGStats = async (handle) => {
  if (!handle) return { totalSolved: 0 };
  
  let browser;
  try {
    const isRender = process.env.RENDER === 'true' || process.env.NODE_ENV === 'production';
    
    const puppeteerPath = isRender ? puppeteer.executablePath() : undefined;
    
    browser = await puppeteer.launch({
      headless: "new",
      executablePath: puppeteerPath, // Yahan auto-detected path use karo
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox', 
        '--disable-dev-shm-usage',
        '--single-process', 
        '--no-zygote'
      ]
    });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36');

    const url = `https://www.geeksforgeeks.org/profile/${handle}?tab=activity`;
    console.log(`🔍 Attempting Sync for GFG: ${handle}`);

    const response = await page.goto(url, {
      waitUntil: 'networkidle2', 
      timeout: 60000 
    });

    if (response.status() === 404) {
      console.log(`❌ GFG Handle '${handle}' not found (404).`);
      await browser.close();
      return { totalSolved: 0 };
    }

    await new Promise(r => setTimeout(r, 5000));

    const totalSolved = await page.evaluate(() => {
      const selectors = [
        '.scoreCard_head_left--score__39_Zz',
        '.scoreCard_head_card_left',
        '.problem_solved_value'
      ];

      for (let s of selectors) {
        const el = document.querySelector(s);
        if (el && el.innerText && /\d+/.test(el.innerText)) {
          return parseInt(el.innerText.match(/\d+/)[0]);
        }
      }
      
      const bodyText = document.body.innerText;
      const match = bodyText.match(/Problems Solved[:\s]+(\d+)/i);
      return match ? parseInt(match[1]) : 0;
    });

    console.log(`✅ SUCCESS: GFG Result for ${handle} -> ${totalSolved}`);
    await browser.close();
    return { totalSolved: totalSolved, platform: 'GFG' };

  } catch (error) {
    console.error(`GFG Error (${handle}):`, error.message);
    if (browser) await browser.close();
    return { totalSolved: 0 };
  }
};

module.exports = { fetchLeetCodeStats, fetchGFGStats };