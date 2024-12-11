package pcw.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import pcw.backend.entity.GoodsHistoryPrice;

import java.util.List;

@Mapper
public interface GoodsHisPriceMapper {
    GoodsHistoryPrice getGoodsHisPriceByGoodsId(Integer goodsId);
    List<GoodsHistoryPrice> getGoodsHisPriceList(String input);
    void insertGoodsHisPrice(GoodsHistoryPrice goodsHisPrice);
    void updateGoodsHisPrice(GoodsHistoryPrice goodsHisPrice);
    void deleteGoodsHisPriceByGoodsId(Integer goodsId);
}
