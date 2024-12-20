package pcw.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
import org.apache.commons.io.FileUtils;
import org.openqa.selenium.*;
import org.openqa.selenium.NoSuchElementException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import pcw.backend.entity.GoodsHistoryPrice;
import pcw.backend.entity.GoodsInfo;
import pcw.backend.entity.HisPriceItem;
import pcw.backend.service.GoodsInfoService;
import pcw.backend.service.ServiceBt;
import pcw.backend.config.SeleniumProperties;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;

import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.io.File;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.time.Duration;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/goods")
// http://10.192.48.150:5173/ and http://localhost:5173

@CrossOrigin(origins = {"http://localhost:5173", "http://10.112.107.57:5173/"}, allowCredentials = "true")
public class GoodsController {

    private final GoodsInfoService GoodsInfoService;
    private final SeleniumProperties seleniumProperties;
    private final Environment environment;

    @Autowired
    public GoodsController(GoodsInfoService GoodsInfoService, SeleniumProperties seleniumProperties, Environment environment) {
        this.GoodsInfoService = GoodsInfoService;
        this.seleniumProperties = seleniumProperties;
        this.environment = environment;
    }

    // 用于存储每个用户和站点的 WebDriver
    // private static ConcurrentHashMap<String, WebDriver> driverMap = new ConcurrentHashMap<>();

    // 初始化 WebDriver
    private WebDriver initializeDriver() {
        ChromeOptions options = new ChromeOptions();
        // 使用无头模式
        options.addArguments("--headless");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-dev-shm-usage");
        // WebDriverManager.chromedriver().setup();
//        if (Arrays.asList(environment.getActiveProfiles()).contains("docker")) {
//            options.setBinary("/usr/bin/chromium");
//        }
//        return new ChromeDriver(options);
        if (Arrays.asList(environment.getActiveProfiles()).contains("docker")) {
            // 使用 RemoteWebDriver 连接到 Selenium 容器
            try {
                String seleniumUrl = String.format("http://%s:%d/wd/hub", seleniumProperties.getHost(), seleniumProperties.getPort());
                return new RemoteWebDriver(new URL(seleniumUrl), options);
            } catch (Exception e) {
                throw new RuntimeException("Failed to initialize WebDriver", e);
            }
        } else {
            // 使用本地的 ChromeDriver
            return new ChromeDriver(options);
        }
    }
    @GetMapping("/history")
    public ResponseEntity<?> getPriceHistory(@RequestParam("goodsId") Integer goodsId) {
        try {
            ServiceBt serviceBt = GoodsInfoService.getGoodsHistoryPrice(goodsId);
            if (!serviceBt.isSuccess()) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("获取历史价格失败: " + serviceBt.getData());
            } else {
                GoodsHistoryPrice history = (GoodsHistoryPrice) serviceBt.getData();
                // 解析 JSON 格式的 priceHistory
                ObjectMapper objectMapper = new ObjectMapper();
                String json = history.getPriceHistory();
                System.out.println("json: " + json);
                Map<String, String> priceMap = objectMapper.readValue(json, new TypeReference<Map<String, String>>() {});
                List<HisPriceItem> priceHistoryList = priceMap.entrySet().stream()
                        .map(entry -> new HisPriceItem(entry.getKey(), entry.getValue()))
                        .sorted(Comparator.comparing(HisPriceItem::getDate))
                        .collect(Collectors.toList());
                return ResponseEntity.ok(priceHistoryList);
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("获取历史价格失败: " + e.getMessage());
        }
    }

    @GetMapping("/database-search")
    public ResponseEntity<?> searchGoodsInDatabase(@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        try {
            List<GoodsInfo> products;
            if (keyword.isEmpty()) {
                ServiceBt serviceBt = GoodsInfoService.getAllGoods();
                if (!serviceBt.isSuccess()) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("查询商品时发生异常: " + serviceBt.getData());
                }
                else {
                    products = (List<GoodsInfo>) serviceBt.getData();
                }
            } else {
                ServiceBt serviceBt = GoodsInfoService.getGoodsInfoByGoodsName(keyword);
                if (!serviceBt.isSuccess()) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("查询商品时发生异常: " + serviceBt.getData());
                }
                else {
                    products = (List<GoodsInfo>) serviceBt.getData();
                    // 输出serviceBt.getData()
                    // System.out.println("serviceBt.getData(): " + serviceBt.getData());
                }
            }
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("查询商品时发生异常: " + e.getMessage());
        }
    }

    // 搜索商品
    @GetMapping("/search")
    public ResponseEntity<?> runSelenium(
            @RequestParam(name = "keyword", defaultValue = "iPad") String keyword,
            @RequestParam(name = "site", defaultValue = "pdd") String site,
            @RequestParam(name = "maxPage", defaultValue = "1") int maxPage) {

//        WebDriver driver = driverMap.get(sessionId);
//        if (driver == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("请先登录。");
//        }
        WebDriver driver = initializeDriver();

        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        List<GoodsInfo> allProducts = new ArrayList<>();

        try {
            String searchUrl = "";
            searchUrl = "https://search.smzdm.com/?s=" + quote(keyword) + "&p=1";
            switch (site) {
                case "pdd":
                    searchUrl += "&mall_id=8645";
                    break;
                case "jd":
                    searchUrl += "&mall_id=183";
                    break;
                case "tmall":
                    searchUrl += "&mall_id=247";
                    break;
                default:
                    break;
            }

            allProducts = indexPage(driver, wait, searchUrl, 1, maxPage, allProducts, site);

            // 将url为https://www.smzdm.com/p/135650958/的商品（如果被查到了）的价格（类型是"3499元"这样的）转换为数字，然后修改为原值的0.9倍再转换为字符串（记得带上元）存入数据库
            for (GoodsInfo product : allProducts) {
                if (product.getGoodsUrl().equals("https://www.smzdm.com/p/135650958/")) {
                    System.out.println("将要降价: " + product);
                    String priceStr = product.getGoodsPrice();
                    String price = parsePrice(priceStr);
                    double priceDouble = Double.parseDouble(price);
                    priceDouble *= 0.55;
                    String newPrice = String.format("%.2f", priceDouble) + "元";
                    product.setGoodsPrice(newPrice);
                }
            }

            System.out.println("allProducts: " + allProducts);

            // 保存商品信息到数据库
            for (GoodsInfo product : allProducts) {
                ServiceBt serviceBt = GoodsInfoService.insertOrUpdateGoodsInfo(product);
                System.out.println("insertOrUpdate Finished!");
                if (!serviceBt.isSuccess()) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("保存商品信息失败: " + serviceBt.getData());
                }
            }
            // 输出返回的东西
//            System.out.println("allProducts: " + allProducts);
            return ResponseEntity.ok(allProducts);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("运行 Selenium 过程中发生异常: " + e.getMessage());
        } finally {
            // 完成后关闭浏览器
            driver.quit();
            // driverMap.remove(sessionId);
            System.out.println("ChromeDriver 已关闭");
        }
    }

    // 翻页并抓取商品
    private List<GoodsInfo> indexPage(WebDriver driver, WebDriverWait wait, String url, int currentPage, int maxPage, List<GoodsInfo> allProducts, String site) {
        if (currentPage > maxPage) {
            return allProducts;
        }

        try {
            System.out.println("正在爬取第 " + currentPage + " 页: " + url);
            driver.get(url);

            List<GoodsInfo> products = getProducts(driver);
            allProducts.addAll(products);

            if (currentPage < maxPage) {
                WebElement nextPageBtn = wait.until(ExpectedConditions.elementToBeClickable(By.linkText("下一页")));
                nextPageBtn.click();
                // 等待页面加载完成
                Thread.sleep(2000);
                String newUrl = driver.getCurrentUrl();
                return indexPage(driver, wait, newUrl, currentPage + 1, maxPage, allProducts, site);
            }
        } catch (TimeoutException e) {
            System.out.println("第 " + currentPage + " 页抓取时超时: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("第 " + currentPage + " 页抓取时发生异常: " + e.getMessage());
        }

        return allProducts;
    }

    // 获取商品信息
    private List<GoodsInfo> getProducts(WebDriver driver) {
        List<GoodsInfo> products = new ArrayList<>();
        try {
            List<WebElement> itemElements = null;
            itemElements = driver.findElements(By.cssSelector("li.feed-row-wide"));
            if (itemElements != null) {
                for (WebElement item : itemElements) {
                    try {
                        GoodsInfo product = new GoodsInfo();
                        // 提取商品名称
                        WebElement mmTitleElement = item.findElement(By.cssSelector("h5.feed-block-title > a.feed-nowrap"));
                        String mmGoodsName = mmTitleElement.getText();
                        product.setGoodsName(mmGoodsName);
                        product.setGoodsSpec("暂无规格");

                        // 提取价格
                        WebElement mmPriceElement = item.findElement(By.cssSelector("h5.feed-block-title > a > div.z-highlight"));
                        String mmGoodsPrice = mmPriceElement.getText();
                        product.setGoodsPrice(mmGoodsPrice);

                        // 提取图片 URL
                        WebElement mmImgElement = item.findElement(By.cssSelector("div.z-feed-img > a > img"));
                        String mmGoodsImgUrl = mmImgElement.getAttribute("src");
                        if (mmGoodsImgUrl.startsWith("//")) {
                            mmGoodsImgUrl = "https:" + mmGoodsImgUrl;
                        }
                        product.setGoodsImgUrl(mmGoodsImgUrl);

                        // 提取商品链接
                        WebElement linkElement = item.findElement(By.cssSelector("div.z-feed-img > a"));
                        String goodsUrl = linkElement.getAttribute("href");
                        product.setGoodsUrl(goodsUrl);
                        products.add(product);
                        // 输出所有提取到的信息：
                        // System.out.println(product);
                    } catch (NoSuchElementException e) {
                        System.out.println("解析商品信息时出错: " + e.getMessage());
                    }
                }
            }

            System.out.println("已抓取 " + products.size() + " 个商品");
        } catch (Exception e) {
            System.out.println("获取商品信息时发生异常: " + e.getMessage());
        }
        return products;
    }

    // 解析价格字符串为 Double（保留为字符串以保留精度和格式）
    private String parsePrice(String priceStr) {
        try {
            // 去除非数字字符，如人民币符号
            String cleanPrice = priceStr.replaceAll("[^0-9.]", "");
            return cleanPrice;
        } catch (Exception e) {
            System.out.println("解析价格失败: " + priceStr);
            return "0.00";
        }
    }

    // URL编码
    private String quote(String keyword) {
        try {
            return URLEncoder.encode(keyword, StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            return keyword;
        }
    }
}