package co.irexnet.waio.WAIO_ServerAgent.util;

import co.irexnet.waio.WAIO_ServerAgent.dto.TagDescriptionDTO;
import co.irexnet.waio.WAIO_ServerAgent.service.DatabaseServiceImpl;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
@Getter
@Setter
@ToString
public class TagDescriptionList
{
    @Autowired
    DatabaseServiceImpl databaseService;

    private List<TagDescriptionDTO> tagDescriptionList;

    @PostConstruct
    public void init()
    {
        tagDescriptionList = new ArrayList<>();
        // tagDescriptionList = databaseService.getAllTagDescription();
    }

    public int getSize()
    {
        int nSize = tagDescriptionList.size();
        return nSize;
    }

    public TagDescriptionDTO getTagDescriptionFromName(String name)
    {
//        tagDescriptionList
//                .stream()
//                .filter(list -> list.getName().equalsIgnoreCase(name))
//                .findAny();
        for(TagDescriptionDTO dto : tagDescriptionList)
        {
            if(dto.getTag_sn().equalsIgnoreCase(name) == true)
            {
                return dto;
            }
        }
        return null;
    }

    public void addTagDescription(TagDescriptionDTO dto)
    {
        tagDescriptionList.add(dto);
    }
}
