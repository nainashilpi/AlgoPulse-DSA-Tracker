const axios = require('axios');
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());


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
  let browser;
  try {
    const isRender = process.env.RENDER === 'true';
    const renderChromePath = '/opt/render/.cache/puppeteer/chrome/linux-145.0.7632.77/chrome-linux64/chrome';
    const chromePath = isRender ? renderChromePath : undefined;

    browser = await puppeteer.launch({
      headless: "new",
      executablePath: chromePath, 
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
  
    
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const url = `https://www.geeksforgeeks.org/user/${handle}/`; 
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });

    await page.waitForSelector('.educationDetails_head_left--score__39_Zz, .problem_solved_value', { timeout: 10000 }).catch(() => null);

    const totalSolved = await page.evaluate(() => {
      const elements = document.querySelectorAll('.educationDetails_head_left--score__39_Zz');
      for (let el of elements) {
        if (el.innerText.includes("Problems Solved")) {
          const match = el.innerText.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        }
      }
      const fallback = document.querySelector('.problem_solved_value');
      return fallback ? parseInt(fallback.innerText) : 0;
    });

    await browser.close();
    return { totalSolved: totalSolved || 0 };
  } catch (error) {
    console.error(`GFG Error (${handle}):`, error.message);
    if (browser) await browser.close();
    return { totalSolved: 0 };
  }
};

module.exports = { fetchLeetCodeStats, fetchGFGStats };
