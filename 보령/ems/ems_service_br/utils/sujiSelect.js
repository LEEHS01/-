const logger = require('../logger').logger;

// let search3 = 'h';
// let search = '2022-02-01';
// let search2 = '한화토탈';
// let search4 = '2022-02-27';

// req 인자값 받기위해 함수로 선언
// sujiSelect1
exports.searchQuery = (reqbody) => {
    logger.info('searchQuery : ',reqbody);
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    
    return `
        SELECT 
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
            tagname, 
            nvl(FORMAT (SUM(value), 2),0) value
        FROM TB_DATA_RAW_TAG a
        WHERE 
            ${search3 === 'h' || search3 === 'd' ? `ts >= CONCAT('${search}', ' 00:00:00') AND ts <= CONCAT('${search4}', ' 23:59:00')` : ''}
            ${search3 === 'm' ? `ts >= CONCAT('${search}', '-01 00:00:00') AND ts <= CONCAT('${search4}', '-31 23:59:00')` : ''}
            ${search3 === 'y' ? `ts >= CONCAT('${search}', '-01-01 00:00:00') AND ts <= CONCAT('${search4}', '-12-31 23:59:00')` : ''}
            -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
            AND MINUTE(ts) = 0
            AND tagname IN (
                        SELECT RT_WTR_LVL
                        FROM TB_MST_RESERVOIR_TANK
        --                WHERE R_ID = '서천' 	
                        WHERE R_ID = '${search2}' 	
                        GROUP BY RT_WTR_LVL
                    )
        GROUP BY 
            ${search3 === 'h' ? 'ts' : ''}
            ${search3 === 'd' ? 'DATE(ts)' : ''}
            ${search3 === 'm' ? 'MONTH(ts)' : ''}
            ${search3 === 'y' ? 'YEAR(ts)' : ''}
    `;

};

// sujiSelect2
exports.searchQuery2 = (reqbody) => {
    logger.info('searchQuery : ',reqbody);
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    
    let query = `
        SELECT
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
            tagname,
            FORMAT (sum(value) , 0) value 
        FROM TB_DATA_RAW_TAG a 
        WHERE
    `;

    if (search3 === 'h' || search3 === 'd') {
        query += `
            ts >= CONCAT('${search}', ' 00:00:00') AND
            ts <= CONCAT('${search4}', ' 23:59:00')`;
    } else if (search3 === 'm') {
        query += `
            ts >= CONCAT('${search}', '-01 00:00:00') AND
            ts <= CONCAT('${search4}', '-31 23:59:00')`;
    } else if (search3 === 'y') {
        query += `
            ts >= CONCAT('${search}', '-01-01 00:00:00') AND
            ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
    }
    query += `
    -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
    AND MINUTE(ts) = 0
    AND tagname in (
        SELECT RT_IN_FR 
        FROM TB_MST_RESERVOIR_TANK 
    --    WHERE R_ID = '서천' 
        WHERE R_ID = '${search2}' 
        GROUP BY RT_IN_FR
    )
    GROUP BY`;
    if (search3 === 'h') {
    query += ' ts';
    } else if (search3 === 'd') {
    query += ' DATE(ts)';
    } else if (search3 === 'm') {
    query += ' MONTH(ts)';
    } else if (search3 === 'y') {
    query += ' YEAR(ts)';
    }

    return query;
};

// sujiSelect3_1
exports.searchQuery3_1 = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    
    let query =`
        SELECT
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
            tagname, 
            FORMAT (value, 0) value
        FROM TB_DATA_RAW_TAG a
        WHERE
    `;
    if( search3 == 'h' || search3 == 'd') {
        query += `
        ts >= CONCAT('${search}', ' 00:00:00') AND
        ts <= CONCAT('${search4}', ' 23:59:00')`;
    } else if(search3 == 'm') {
        query += `
        ts >= CONCAT('${search}', '-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-31 23:59:00')`;
    } else if(search3 == 'y') {
        query += `
        ts >= CONCAT('${search}', '-01-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
    }
    query += `
        -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
        AND MINUTE(ts) = 0
        AND tagname in (
            SELECT RT_FC_STTS
            FROM TB_MST_RESERVOIR_TANK 
        WHERE R_ID = '${search2}' 
--        WHERE R_ID = '서천' 
            GROUP BY RT_FC_STTS
        )
        GROUP BY 
    `;
    if (search3 === 'h') {
        query += ' ts';
    } else if (search3 === 'd') {
        query += ' DATE(ts)';
    } else if (search3 === 'm') {
        query += ' MONTH(ts)';
    } else if (search3 === 'y') {
        query += ' YEAR(ts)';
    }
    return query;
}

// sujiSelect3_2
exports.searchQuery3_2 = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    
    let query = `
        SELECT
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
            tagname,
            FORMAT(SUM(value), 0) AS value
        FROM TB_DATA_RAW_TAG a
        WHERE 
    `;
    if (search3 === 'h' || search3 === 'd') {
        query += `
        ts >= CONCAT('${search}', ' 00:00:00') AND
        ts <= CONCAT('${search4}', ' 23:59:00')`;
    } else if (search3 === 'm') {
        query += `
        ts >= CONCAT('${search}', '-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-31 23:59:00')`;
    } else if (search3 === 'y') {
        query += `
        ts >= CONCAT('${search}', '-01-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
    }
    query += `
        -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
        AND MINUTE(ts) = 0
        AND tagname in (
                    SELECT RT_FO_STTS
                    FROM TB_MST_RESERVOIR_TANK 
                    WHERE 
                    R_ID = '${search2}'
        --            R_ID = '서천'
                    GROUP BY RT_FO_STTS
                )
        GROUP BY
    `;
    if (search3 === 'h') {
        query += ' ts';
    } else if (search3 === 'd') {
        query += ' DATE(ts)';
    } else if (search3 === 'm') {
        query += ' MONTH(ts)';
    } else if (search3 === 'y') {
        query += ' YEAR(ts)';
    }
    return query;
}

// sujiSelect4
exports.searchQuery4 = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    
    let query = `
        SELECT
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
            tagname,
            FORMAT(SUM(value), 0) AS value
        FROM TB_DATA_RAW_TAG a
        WHERE 
    `;
    if (search3 === 'h' || search3 === 'd') {
        query += `
        ts >= CONCAT('${search}', ' 00:00:00') AND
        ts <= CONCAT('${search4}', ' 23:59:00')`;
    } else if (search3 === 'm') {
        query += `
        ts >= CONCAT('${search}', '-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-31 23:59:00')`;
    } else if (search3 === 'y') {
        query += `
        ts >= CONCAT('${search}', '-01-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
    }
    query += `
        -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
        AND MINUTE(ts) = 0
        -- AND tagname in ('600-359-FRI-4410')
        AND tagname IN (
              SELECT RT_OUT_FR FROM TB_MST_RESERVOIR_TANK WHERE R_ID = '${search2}' 
              GROUP BY RT_OUT_FR
          )
        GROUP BY
    `;
    if (search3 === 'h') {
        query += ' ts';
    } else if (search3 === 'd') {
        query += ' DATE(ts)';
    } else if (search3 === 'm') {
        query += ' MONTH(ts)';
    } else if (search3 === 'y') {
        query += ' YEAR(ts)';
    }

    return query;
}

// sujiSelect5
exports.searchQuery5 = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    let gubun = reqbody.gubun;

    let query = `
        SELECT
            ${search3 === 'h' ? "DATE_FORMAT(ts,'%Y-%m-%d %H:%i')" : ""}
            ${search3 === 'd' ? "DATE_FORMAT(ts,'%Y-%m-%d')" : ""}
            ${search3 === 'm' ? "DATE_FORMAT(ts,'%Y-%m')" : ""}
            ${search3 === 'y' ? "DATE_FORMAT(ts,'%Y')" : ""} AS ts,
        tagname, FORMAT (value, 2) value
        FROM TB_DATA_RAW_TAG
        WHERE 
    `;

    if (search3 === 'h' || search3 === 'd') {
        query += `
        ts >= CONCAT('${search}', ' 00:00:00') AND
        ts <= CONCAT('${search4}', ' 23:59:00')`;
    } else if (search3 === 'm') {
        query += `
        ts >= CONCAT('${search}', '-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-31 23:59:00')`;
    } else if (search3 === 'y') {
        query += `
        ts >= CONCAT('${search}', '-01-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-12-31 23:59:00')`;
    }
    query += `
        -- AND HOUR(ts) = 0 AND MINUTE(ts) = 0
        AND MINUTE(ts) = 0
        `
    if (gubun === 'BR') {
        query += ` AND tagname = '600-359-PRI-4410' `
    } else if (gubun === 'CY') {
        query += ` AND tagname = '600-459-PRI-8001' `
    } else if (gubun === 'HS') {
        query += ` AND tagname = '600-456-PRI-8030' `
    } else if (gubun === 'SS') {
        query += ` AND tagname = '600-457-PRI-8030' `
    }
    query += ` GROUP BY `
    
    if (search3 === 'h') {
        query += ' ts';
    } else if (search3 === 'd') {
        query += ' DATE(ts)';
    } else if (search3 === 'm') {
        query += ' MONTH(ts)';
    } else if (search3 === 'y') {
        query += ' YEAR(ts)';
    }
    return query;
}

// sujiSelect6
exports.searchQuery6 = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    let gubun = reqbody.gubun;

    let query = `
        SELECT DATE_FORMAT(ts, '%Y-%m-%d %H:00') AS ts,
            tagname,  
            -- CAST(SUM(value) / 60 AS char) AS value
            FORMAT(SUM(VALUE), 0) AS value
        FROM TB_DATA_RAW_TAG a
        WHERE 1=1 and 
    `;
    if (search3 === 'h' || search3 === 'd') {
        query += `
        ts >= CONCAT('${search}', ' 00:00:00') AND
        ts <= CONCAT('${search4}', ' 23:59:00') 
         AND MINUTE(ts) = 0 `;
        
    } else if (search3 === 'm') {
        query += `
        ts >= CONCAT('${search}', '-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-31 23:59:00') 
         AND MINUTE(ts) = 0 `;
    } else if (search3 === 'y') {
        query += `
        ts >= CONCAT('${search}', '-01-01 00:00:00') AND
        ts <= CONCAT('${search4}', '-12-31 23:59:00') 
         AND MINUTE(ts) = 0 `;
    }
    if (gubun === 'BR') {
        query += ` 
        --  AND tagname in ('600-359-PMB-4016','600-359-PMB-4026','600-359-PMB-4036','600-359-PMB-4046','600-359-PMB-4056','600-359-PMB-4066')
          and tagname in ('600-359-PMB-4000') 
        `
    } else if (gubun === 'CY') {
        query += `
        AND tagname in ('600-459-PMB-4000')
        `
    } else if (gubun === 'HS') {
        query += `
        AND tagname in ('600-456-PMB-4000','600-456-PMB-4001')
        `
    } else if (gubun === 'SS') {
        query += `
        AND tagname in ('600-457-PMB-4000','600-457-PMB-4001')
        `
}

query += `
        group by DATE_FORMAT(ts, '%Y-%m-%d %H:00')  -- 시간 단위로 그룹화
    -- AND ts = (SELECT MAX(ts) FROM TB_DATA_RAW_TAG)
`
    ;

    return query;
}

// suji_sunsi
exports.searchQuery_sunsi = (reqbody) => {
    let search = reqbody.search;
    let search2 = reqbody.search2;
    let search3 = reqbody.search3;
    let search4 = reqbody.search4;
    let gubun = reqbody.gubun;
    
    let query = `
    SELECT 
        IFNULL(a.수위, '0') AS '수위',
        IFNULL(b.유입유량, '0.00') AS '유입유량',
        IFNULL(c.밸브상태, 0) AS '밸브상태',
        IFNULL(d.유출유량, '0.00') AS '유출유량',
        IFNULL(e.정속토출관압, '0.00') AS '정속토출관압',
        IFNULL(g.정속가동대수, 0) AS '정속가동대수'
    FROM
        (
            SELECT 
                NVL(FORMAT(SUM(value), 0), '0.00') AS '수위'
            FROM TB_DATA_RAW_TAG a
            WHERE ts = (
                -- SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG
                DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
            )
            AND tagname IN (
                SELECT RT_WTR_LVL FROM TB_MST_RESERVOIR_TANK WHERE R_ID = '${search2}' 
                GROUP BY RT_WTR_LVL
            )
        ) a
    LEFT JOIN
        (
            SELECT 
                NVL(FORMAT(SUM(value), 0), '0.00') AS '유입유량'
            FROM TB_DATA_RAW_TAG a
            WHERE ts = (
                -- SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG
                DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
            )
            AND tagname IN (
                SELECT RT_IN_FR FROM TB_MST_RESERVOIR_TANK WHERE R_ID = '${search2}' 
                GROUP BY RT_IN_FR
            )
        ) b ON 1=1
    LEFT JOIN
        (
            SELECT FORMAT(SUM(value), 0) AS '밸브상태' 
            FROM TB_DATA_RAW_TAG a
            WHERE ts = (
                -- SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG
                DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
                )
                AND tagname IN (
                    SELECT RT_FC_STTS FROM TB_MST_RESERVOIR_TANK WHERE R_ID = '${search2}' 
                    GROUP BY RT_FC_STTS
                ) group by ts
            
        ) c ON 1=1
    LEFT JOIN
        (
            SELECT FORMAT(SUM(value), 0) AS '유출유량' 
            FROM TB_DATA_RAW_TAG a
            WHERE ts = (
              --  SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG
                DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
            )
            -- AND tagname IN ('600-359-FRI-4410')
             AND tagname IN (
              SELECT RT_OUT_FR FROM TB_MST_RESERVOIR_TANK WHERE R_ID = '${search2}' 
              GROUP BY RT_OUT_FR
          )
        ) d ON 1=1
    LEFT JOIN
        (
            SELECT FORMAT(SUM(value), 0) AS '정속토출관압' 
            FROM TB_DATA_RAW_TAG a
            WHERE ts = (
                -- SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG
                DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
            )
`
if (gubun === 'BR') {
    query += ` AND tagname = '600-359-PRI-4410' `
} else if (gubun === 'CY') {
    query += ` AND tagname = '600-459-PRI-8001' `
} else if (gubun === 'HS') {
    query += ` AND tagname = '600-456-PRI-8030' `
} else if (gubun === 'SS') {
    query += ` AND tagname = '600-457-PRI-8030' `
}
query += `
            GROUP BY a.ts
        ) e ON 1=1
    LEFT JOIN
        (
            SELECT SUM(a) AS '정속가동대수'
            FROM (
                SELECT value AS a 
                FROM TB_DATA_RAW_TAG a
                WHERE ts = (
                    -- SELECT DATE_FORMAT(MAX(ts), '%Y-%m-%d %H:%i:00') FROM TB_DATA_RAW_TAG 
                    DATE_SUB((SELECT MAX(ts) FROM TB_DATA_RAW_TAG), INTERVAL 3 MINUTE)
                ) `
        
        if (gubun === 'BR') {      
            query += `                    
                -- AND tagname IN ('600-359-PMB-4015', '600-359-PMB-4025', '600-359-PMB-4035', '600-359-PMB-4045', '600-359-PMB-4055', '600-359-PMB-4065')
                and tagname in ('600-359-PMB-4000') 
            `
        } else if (gubun === 'CY') {
            query += `
            AND tagname in ('600-459-PMB-4000') 
            `
        } else if (gubun === 'HS') {
            query += `
            AND tagname in ('600-456-PMB-4000','600-456-PMB-4001') 
            `
        } else if (gubun === 'SS') {
            query += `
            AND tagname in ('600-457-PMB-4000','600-457-PMB-4001') 
              `
        }
query += `          
            ) t
        ) g ON 1=1
        ` ;
    
    // console.log(query)
    return query
}
