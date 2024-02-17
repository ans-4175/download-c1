const { isReady } = require("../modules/db");

const countPercentage = ({ total, incomplete }) => {
  if (total == 0) return 0;
  return (incomplete * 100) / total;
};
/**
 *
 * @template {{total: number, complete: number, incomplete: number, incompleteProgress: number}} Stats
 * @return {Promise<{all: Stats} & {[provinsiCode: string]: Stats}>}
 */
async function GetTpsCompletenessStatistics() {
  const db = await isReady;
  const resultList = await db.all(`
        SELECT 
            provinsiCode, 
            CASE WHEN driveId IS NULL THEN 'incomplete' ELSE 'complete' END AS completenessStatus,
            count(id) as count
        FROM tps_c1_download_result 
        GROUP BY provinsiCode, completenessStatus
    `);
  const initialValue = {
    all: {
      total: 0,
      complete: 0,
      incomplete: 0,
      incompleteProgress: 0,
    },
  };
  return resultList.reduce((memo, item) => {
    const provinsiCode = item.provinsiCode;
    if (!memo[provinsiCode]) {
      memo[provinsiCode] = {
        code: provinsiCode,
        total: 0,
        complete: 0,
        incomplete: 0,
        incompleteProgress: 0,
      };
    }
    memo[provinsiCode].total += item.count;
    memo[provinsiCode][item.completenessStatus] += item.count;
    memo.all.total += item.count;
    memo.all[item.completenessStatus] += item.count;
    memo[provinsiCode].incompleteProgress = countPercentage(memo[provinsiCode]);
    memo.all.incompleteProgress = countPercentage(memo.all);
    return memo;
  }, initialValue);
}

module.exports = GetTpsCompletenessStatistics;
