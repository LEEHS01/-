const logger = require('../logger').logger;

exports.selectGetSetting = () => {
  /*
  설정>절감 목표("년도별 절감목표", selectGetSetting)
  */
  let query = `
    SELECT year,1m,2m,3m,4m,5m,6m,7m,8m,9m,10m,11m,12m
    FROM TB_GOALSETTING b
    UNION 
    ALL 
    (
      SELECT base,1m,2m,3m,4m,5m,6m,7m,8m,9m,10m,11m,12m 
      FROM 
      (
        (SELECT 'base' FROM DUAL) target,
        (SELECT  val 1m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '01m' and type = 'mm') a,
        (SELECT  val 2m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '02m' and type = 'mm') b,
        (SELECT  val 3m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '03m' and type = 'mm') c,
        (SELECT  val 4m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '04m' and type = 'mm') d,
        (SELECT  val 5m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '05m' and type = 'mm') e,
        (SELECT  val 6m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '06m' and type = 'mm') f,
        (SELECT  val 7m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '07m' and type = 'mm') g,
        (SELECT  val 8m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '08m' and type = 'mm') h,
        (SELECT  val 9m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '09m' and type = 'mm')  i,
        (SELECT  val 10m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '10m' and type = 'mm') j,
        (SELECT  val 11m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '11m' and type = 'mm') k,
        (SELECT  val 12m FROM TB_BASE_SAVINGS_TARGET WHERE TIME = '12m' and type = 'mm') l
      )
    )
    ORDER BY YEAR DESC	  
  `;

  return query
}

exports.updateGoal = (reqbody) => {
  /*
  설정>절감 목표("절감목표 저장", updateGoal)
  */
  logger.info('updateGoal reqbody > ', reqbody);
  let query = `
  INSERT INTO TB_GOALSETTING (YEAR`;
  const months = reqbody.list;
  for (let i = 1; i <= 12; i++) {
    if (months[`month${i}`] !== undefined) {
      query += `, ${i}m`;
    }
  }

  query += `) VALUES (DATE_FORMAT(NOW(), '%Y')`;
  for (let i = 1; i <= 12; i++) {
    if (months[`month${i}`] !== undefined) {
      query += `, '${months[`month${i}`]}'`;
    }
  }

  query += `)
  ON DUPLICATE KEY
  UPDATE YEAR = DATE_FORMAT(NOW(), '%Y')`;
  for (let i = 1; i <= 12; i++) {
    if (months[`month${i}`] !== undefined) {
      query += `, ${i}m = '${months[`month${i}`]}'`;
    }
  }

  return query;
}
