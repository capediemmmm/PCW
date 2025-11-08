package pcw.backend.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class GoodsHistoryPrice {
    private Integer goodId;
    private String priceHistory; // JSON 格式

    // Getters and Setters
    public Integer getGoodId() {
        return goodId;
    }
    public void setGoodId(Integer goodId) {
        this.goodId = goodId;
    }
    public String getPriceHistory() {
        return priceHistory;
    }
    public void setPriceHistory(String priceHistory) {
        this.priceHistory = priceHistory;
    }
}
