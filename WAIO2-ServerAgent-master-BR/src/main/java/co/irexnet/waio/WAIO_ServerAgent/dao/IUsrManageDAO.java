package co.irexnet.waio.WAIO_ServerAgent.dao;

import co.irexnet.waio.WAIO_ServerAgent.ai_dto.UsrManageDTO;

public interface IUsrManageDAO {
	UsrManageDTO select(String item);
	int update(String item, String value);
}
