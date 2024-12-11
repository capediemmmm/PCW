package pcw.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.transaction.annotation.Transactional;
import pcw.backend.entity.GoodsHistoryPrice;
import pcw.backend.entity.GoodsInfo;
import pcw.backend.mapper.GoodsInfoMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;

@Service
public class GoodsInfoService {
    @Autowired
    private GoodsInfoMapper goodsInfoMapper;

    // get the goods information by goodsId
    public ServiceBt getGoodsInfo(Integer goodsId) {
        try {
            GoodsInfo goodsInfo = goodsInfoMapper.getGoodsInfoByGoodsId(goodsId);
            return new ServiceBt(true, goodsInfo);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

//    // get the relative goods information list
//    public ServiceBt getGoodsInfoList(String input) {
//        try {
//            List<GoodsInfo> goodsInfoList = (List<GoodsInfo>) goodsInfoMapper.getGoodsInfoList(input);
//            return new ServiceBt(true, goodsInfoList);
//        } catch (Exception e) {
//            return new ServiceBt(false, e.getMessage());
//        }
//    }

    // 插入或更新商品信息
//    @Transactional
    public ServiceBt insertOrUpdateGoodsInfo(GoodsInfo goodsInfo) {
        try {
            GoodsInfo existingGoods = goodsInfoMapper.getGoodsInfoByNameAndUrl(goodsInfo.getGoodsName(), goodsInfo.getGoodsUrl());
            System.out.println("existing Goods: " + existingGoods);
            if (existingGoods != null) {
                // 更新当前价格
                System.out.println("existingGoods: " + existingGoods);
                existingGoods.setGoodsPrice(goodsInfo.getGoodsPrice());
                goodsInfoMapper.updateGoodsInfo(existingGoods);

                // 更新历史价格
                GoodsHistoryPrice history = goodsInfoMapper.getGoodsHistoryPriceByGoodId(existingGoods.getGoodsId());
                if (history != null) {
                    HashMap<String, String> priceMap = new HashMap<>();
                    // 解析现有的 JSON
                    // 假设使用 Jackson 库
                    ObjectMapper mapper = new ObjectMapper();
                    priceMap = mapper.readValue(history.getPriceHistory(), HashMap.class);
                    priceMap.put(LocalDate.now().toString(), goodsInfo.getGoodsPrice());
                    history.setPriceHistory(mapper.writeValueAsString(priceMap));
                    goodsInfoMapper.updateGoodsHistoryPrice(history);
                } else {
                    // 初始化历史价格
                    GoodsHistoryPrice newHistory = new GoodsHistoryPrice();
                    newHistory.setGoodId(existingGoods.getGoodsId());
                    HashMap<String, String> priceMap = new HashMap<>();
                    priceMap.put(LocalDate.now().toString(), goodsInfo.getGoodsPrice());
                    ObjectMapper mapper = new ObjectMapper();
                    newHistory.setPriceHistory(mapper.writeValueAsString(priceMap));
                    goodsInfoMapper.insertGoodsHistoryPrice(newHistory);
                }
            } else {
                // 插入新商品
                goodsInfoMapper.insertGoodsInfo(goodsInfo);
                // 获取插入后的 goodsId
                Integer newGoodsId = goodsInfo.getGoodsId();

                // 初始化历史价格
                GoodsHistoryPrice newHistory = new GoodsHistoryPrice();
                newHistory.setGoodId(newGoodsId);
                HashMap<String, String> priceMap = new HashMap<>();
                priceMap.put(LocalDate.now().toString(), goodsInfo.getGoodsPrice());
                ObjectMapper mapper = new ObjectMapper();
                newHistory.setPriceHistory(mapper.writeValueAsString(priceMap));
                goodsInfoMapper.insertGoodsHistoryPrice(newHistory);
            }
            return new ServiceBt(true);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    // get the goods info by goodsName
    public ServiceBt getGoodsInfoByGoodsName(String goodsName) {
        try {
            List<GoodsInfo> goodsInfo = goodsInfoMapper.getGoodsInfoByGoodsName(goodsName);
//            List<GoodsInfo> goodsInfo = goodsInfoMapper.selectAllGoods();
            // 输出goodsInfo
            System.out.println("goodsName: " + goodsName + " service goods info: " + goodsInfoMapper.getGoodsInfoByGoodsName(goodsName));
//            System.out.println("service all goods info: " + goodsInfoMapper.selectAllGoods());
            return new ServiceBt(true, goodsInfo);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    //
    public ServiceBt getGoodsHistoryPrice(Integer goodId) {
        try {
            GoodsHistoryPrice goodsHistoryPrice = goodsInfoMapper.getGoodsHistoryPriceByGoodId(goodId);
            return new ServiceBt(true, goodsHistoryPrice);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    // get all goods
    public ServiceBt getAllGoods() {
        try {
            List<GoodsInfo> goodsInfoList = goodsInfoMapper.selectAllGoods();
            return new ServiceBt(true, goodsInfoList);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    // insert the goods info
    public ServiceBt insertGoodsInfo(GoodsInfo goodsInfo) {
        try {
            goodsInfoMapper.insertGoodsInfo(goodsInfo);
            return new ServiceBt(true);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    // update the goods info
    public ServiceBt updateGoodsInfo(GoodsInfo goodsInfo) {
        try {
            goodsInfoMapper.updateGoodsInfo(goodsInfo);
            return new ServiceBt(true);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }

    // delete the goods info by goodsID
    public ServiceBt deleteGoodsInfoByGoodsId(Integer goodsId) {
        try {
            goodsInfoMapper.deleteGoodsInfoByGoodsId(goodsId);
            return new ServiceBt(true);
        } catch (Exception e) {
            return new ServiceBt(false, e.getMessage());
        }
    }
}
