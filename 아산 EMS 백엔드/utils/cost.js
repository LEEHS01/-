// selectRateInfo
exports.rateInfoQuery = () => {
	let query = `
    SELECT MNTH,
      STN_TM,
      RATE_IDX,
      SSN,
      TIMEZONE, FORMAT (BASE_RATE,0) BASE_RATE,
      ELCTR_RATE
    FROM TB_RT_RATE_INF
    WHERE RATE_IDX IN (7,8,9)	`
	return query
}
// selectRtRate
exports.monthRateQuery = (selectedMonth) => {
	let query = `
    SELECT 
      a.ANLY_DATE,
      a.DATA_BS_YMNTH,
      a.RATE_IDX,
      OPT_RATE_YN,
      DT_MSN_PRCNT
      , FORMAT (TOT_PWR, 0) TOT_PWR, FORMAT (TOT_FEE,0) TOT_FEE, FORMAT (BASE_FEE,0) BASE_FEE, FORMAT (ETC_FEE,0) ETC_FEE
      , FORMAT (L_PWR,0) L_PWR, FORMAT (M_PWR,0) M_PWR, FORMAT (H_PWR,0) H_PWR, FORMAT (L_ELCTR_FEE,0) L_ELCTR_FEE
      , FORMAT (M_ELCTR_FEE,0) M_ELCTR_FEE, FORMAT (H_ELCTR_FEE,0) H_ELCTR_FEE,
      a.DC_NMB,
      a.RGSTR_TIME,
      a.FLAG,
      b.LARGE_CTGRY,
      b.MIDDLE_CTGRY,
      b.SMALL_CTGRY, FORMAT (c.PWR, 0) PWR
    FROM TB_RT_RATE_RST a, TB_RT_MSTR_INF b, TB_RT_POWER_RST c
    WHERE 
      a.rate_idx = b.rate_idx AND a.DATA_BS_YMNTH = c.DATA_BS_YMNTH AND a.ANLY_DATE = c.ANLY_DATE AND b.USE_YN = '1' 
        AND a.ANLY_DATE = 
                    (
                    SELECT MAX(ANLY_DATE) ANLY
                    FROM TB_RT_RATE_RST
                    WHERE 
                    DATA_BS_YMNTH = '${selectedMonth}'
                    -- DATA_BS_YMNTH = '202402'
                  )
  `
	return query
}

// Origianl Query문 실행시 해당 데이터가 없어서 임시로 Query문 수정(a.rate_idx = b.rate_idx AND 삭제) -> TODO 확인 필요
// exports.monthRateQuery = (selectedMonth) => {
// 	let query = `
//     select a.ANLY_DATE,
//       a.DATA_BS_YMNTH,
//       a.RATE_IDX,
//       OPT_RATE_YN,
//       DT_MSN_PRCNT,
//       FORMAT (TOT_PWR , 0) TOT_PWR,
//       FORMAT (TOT_FEE ,0) TOT_FEE,
//       FORMAT (BASE_FEE,0) BASE_FEE,
//       FORMAT (ETC_FEE,0) ETC_FEE,
//       FORMAT (L_PWR,0) L_PWR,
//       FORMAT (M_PWR,0) M_PWR,
//       FORMAT (H_PWR,0) H_PWR,
//       FORMAT (L_ELCTR_FEE,0) L_ELCTR_FEE,
//       FORMAT (M_ELCTR_FEE,0) M_ELCTR_FEE,
//       FORMAT (H_ELCTR_FEE,0) H_ELCTR_FEE,
//       a.DC_NMB,
//       a.RGSTR_TIME,
//       a.FLAG,
//       b.LARGE_CTGRY,
//       b.MIDDLE_CTGRY,
//       b.SMALL_CTGRY,
//       FORMAT (c.PWR, 0) PWR
//     from RT_RATE_RST a, RT_MSTR_INF b, RT_POWER_RST c 
//     where a.rate_idx = b.rate_idx AND a.DATA_BS_YMNTH = c.DATA_BS_YMNTH  AND a.ANLY_DATE = c.ANLY_DATE AND b.USE_YN = '1' 
//     AND a.ANLY_DATE = (SELECT MAX(ANLY_DATE) ANLY FROM RT_RATE_RST WHERE DATA_BS_YMNTH ='${selectedMonth}')
//     and a.DATA_BS_YMNTH='${selectedMonth}'
//   `
// 	return query
// }
