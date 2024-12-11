package pcw.backend.mapper;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import pcw.backend.entity.GoodsHistoryPrice;
import pcw.backend.entity.GoodsInfo;
import java.util.List;

@Mapper
public interface GoodsInfoMapper {
    GoodsInfo getGoodsInfoByGoodsId(@Param("goodsId") Integer goodsId);
    List<GoodsInfo> selectAllGoods();
    List<GoodsInfo> getGoodsInfoByGoodsName(String goodsName);
    GoodsInfo getGoodsInfoByNameAndUrl(@Param("goodsName") String goodsName, @Param("goodsUrl") String goodsUrl);
    GoodsHistoryPrice getGoodsHistoryPriceByGoodId(@Param("goodId") Integer goodId);
    void insertGoodsInfo(GoodsInfo goodsInfo);
    void updateGoodsInfo(GoodsInfo goodsInfo);
    void deleteGoodsInfoByGoodsId(Integer goodsId);

    void insertGoodsHistoryPrice(GoodsHistoryPrice historyPrice);
    void updateGoodsHistoryPrice(GoodsHistoryPrice historyPrice);
}
