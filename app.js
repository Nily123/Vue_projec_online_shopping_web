import express from 'express';
import * as fs from 'node:fs';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';

const app = express();

// 正確使用 CORS 中間件
app.use(cors());

// 使用 body-parser 來解析 JSON 請求
app.use(bodyParser.json());
// 設定靜態文件夾，若有圖片可以放在此目錄中提供靜態資源
app.use(express.static('data'));
// 讀取 JSON 檔案並解析為 JavaScript 物件
let productsData;
try {
  const data = fs.readFileSync('data/products.json', 'utf8');
  productsData = JSON.parse(data);
} catch (error) {
  console.error("Error reading products JSON file:", error);
  productsData = { products: [] };
}



// 全商品資訊
app.get('/products', (req, res) => {
  res.json(productsData.products);
});
//單一商品資訊
app.get('/products/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const product = productsData.products.find(p => p.id === productId);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
});

//登入
app.post('/login', (req, res) => {
  console.log("Login request received");
  console.log("Request body:", req.body);  // 打印請求體
  const { username, password } = req.body;

  // 檢查 users.json 文件是否正確加載
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
      console.log("Login successful for:", username);
      res.json({ success: true, role: user.role, token: 'fake-jwt-token' });
    } else {
      console.log("Login failed for:", username);
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// 新增獲取特定用戶的完整資訊
app.get('/users/:username', (req, res) => {
  const username = req.params.username;

  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading users.json:', err);
      return res.status(500).json({ success: false, message: 'Server error' });
    }

    const users = JSON.parse(data).users;
    const user = users.find(u => u.username === username);

    if (user) {
      res.json(user);  // 返回完整的用戶資訊
      console.log(user);
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  });
});

//刪除購物車內的商品
app.delete('/user/:username/cart/:productId', (req, res) => {
  const { username, productId } = req.params;
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    const users = JSON.parse(data);
    const user = users.users.find(u => u.username === username);
    if (user) {
      user.car = user.car.filter(item => item.id !== Number(productId));
      fs.writeFile('data/users.json', JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ message: 'Failed to update cart' });
        res.json({ message: 'Item removed from cart' });
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});

//清空購次車
app.post('/user/:username/checkout', (req, res) => {
  const { username } = req.params;
  fs.readFile('data/users.json', 'utf8', (err, data) => {
    if (err) return res.status(500).json({ message: 'Server error' });
    const users = JSON.parse(data);
    const user = users.users.find(u => u.username === username);
    if (user) {
      user.car = [];
      fs.writeFile('data/users.json', JSON.stringify(users, null, 2), err => {
        if (err) return res.status(500).json({ message: 'Failed to checkout' });
        res.json({ message: 'Checkout successful' });
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  });
});


// 讀取 users.json 文件
function readUsersFile() {
  return new Promise((resolve, reject) => {
    fs.readFile('data/users.json', 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(JSON.parse(data));
    });
  });
}

// 寫入 users.json 文件
function writeUsersFile(data) {
  return new Promise((resolve, reject) => {
    fs.writeFile('data/users.json', JSON.stringify(data, null, 2), (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

// 收藏商品
app.post('/users/:username/like', async (req, res) => {
  const { username } = req.params;
  const { productId } = req.body;

  try {
    const usersData = await readUsersFile();
    const user = usersData.users.find(u => u.username === username);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // 檢查商品是否已收藏
    const isLiked = user.like.some(item => item.id === productId);
    if (!isLiked) {
      user.like.push({ id: productId });
    } else {
      user.like = user.like.filter(item => item.id !== productId);
    }

    await writeUsersFile(usersData);
    res.status(200).json({ message: '收藏狀態已更新', like: user.like });
  } catch (error) {
    res.status(500).json({ error: 'Error updating like status' });
  }
});

// 加入購物車
app.post('/users/:username/car', async (req, res) => {
  const { username } = req.params;
  const { id, color, size, number } = req.body;

  try {
    const usersData = await readUsersFile();
    const user = usersData.users.find(u => u.username === username);

    if (!user) return res.status(404).json({ error: 'User not found' });

    // 檢查購物車中是否已有相同商品和規格
    const existingItem = user.car.find(item => item.id === id && item.color === color && item.size === size);
    if (existingItem) {
      existingItem.number += number;
    } else {
      user.car.push({ id, color, size, number });
    }

    await writeUsersFile(usersData);
    res.status(200).json({ message: '商品已加入購物車', car: user.car });
  } catch (error) {
    res.status(500).json({ error: 'Error adding to cart' });
  }
});


// 商品管理 API
app.put('/updateProduct/:id', (req, res) => {
  const productId = parseInt(req.params.id, 10);
  const {
    name, price, location, material, wash, notice, category, state, variations
  } = req.body;

  // 讀取現有的商品數據
  const productsData = JSON.parse(fs.readFileSync('data/products.json', 'utf8'));

  // 找到指定的商品
  const productIndex = productsData.products.findIndex(p => p.id === productId);
  if (productIndex === -1) {
    return res.status(404).json({ error: "Product not found" });
  }

  // 更新商品屬性
  productsData.products[productIndex] = {
    ...productsData.products[productIndex], // 保留原始數據
    name,
    price,
    location,
    material,
    wash,
    notice, // 更新注意事項
    category, // 更新類別
    state,
    variations // 更新 variations
  };

  // 保存更改
  fs.writeFileSync('data/products.json', JSON.stringify(productsData, null, 2));
  res.json({ success: true, product: productsData.products[productIndex] });
});



// 新增產品 API
app.post('/products', (req, res) => {
  const newProduct = req.body;
  productsData.products.push(newProduct);
  console.log("new商品");
  fs.writeFile('data/products.json', JSON.stringify(productsData), err => {
    if (err) {
      return res.status(500).send("Error saving product");
    }
    res.status(201).send("Product added successfully");
  });
});

// 圖片上傳 API
import multer from 'multer';
const upload = multer({ dest: 'temp/' });

app.post('/upload/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  
  // Define target directory based on product ID
  const targetDir = path.join('data', id);
  
  // Check if product ID directory exists; if not, create it
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Set target path within product ID directory, using original filename
  const targetPath = path.join(targetDir, req.file.originalname);

  // Move the file from the temp directory to the target path
  fs.rename(req.file.path, targetPath, err => {
    if (err) return res.status(500).send("Error uploading image");
    res.send("Image uploaded successfully");
  });
});
//上傳商品附圖
app.post('/upload/related/:id', upload.single('file'), (req, res) => {
  const { id } = req.params;
  const targetDir = path.join('data', id, 'related');
  console.log("商品附圖");
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const targetPath = path.join(targetDir, req.file.originalname);
  console.log("targetPath:"+targetPath);
  fs.rename(req.file.path, targetPath, err => {
    if (err) return res.status(500).send("Error uploading image");
    res.send("Image uploaded successfully");
  });
});

// 讀取 JSON 資料
let activityData;
try {
  const data = fs.readFileSync('data/activity.json', 'utf8');
  activityData = JSON.parse(data);
} catch (error) {
  console.error("Error reading activity JSON file:", error);
  activityData = { activity: [], announce: [] };
}

// 活動json檔
app.get('/activity', (req, res) => {
  res.json(activityData);
});


// 新增活動
app.post('/activity', (req, res) => {
  const activity = req.body;
  activityData.activity.push(activity);

  fs.writeFile('data/activity.json', JSON.stringify(activityData), err => {
    if (err) {
      return res.status(500).send("Error saving activity");
    }
    res.status(201).send("activity added successfully");
  });
});

// 新增公告
app.post('/announcements', (req, res) => {
  const announcement = req.body;
  activityData.announcement.push(announcement);

  fs.writeFile('data/activity.json', JSON.stringify(activityData), err => {
    if (err) {
      return res.status(500).send("Error saving announcement");
    }
    res.status(201).send("announcement added successfully");
  });
});

//上傳活動主圖片
app.post('/upload/activity_cover', upload.single('file'), (req, res) => {

  // Define target directory based on product ID
  const targetDir = path.join('data', 'activity');
  
  // Check if product ID directory exists; if not, create it
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Set target path within product ID directory, using original filename
  const targetPath = path.join(targetDir, req.file.originalname);

  // Move the file from the temp directory to the target path
  fs.rename(req.file.path, targetPath, err => {
    if (err) return res.status(500).send("Error uploading image");
    res.send("Image uploaded successfully");
  });
});
//上傳活動其他圖片
app.post('/upload/activity_content', upload.single('file'), (req, res) => {

  // Define target directory based on product ID
  const targetDir = path.join('data', 'activity');
  
  // Check if product ID directory exists; if not, create it
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  // Set target path within product ID directory, using original filename
  const targetPath = path.join(targetDir, req.file.originalname);

  // Move the file from the temp directory to the target path
  fs.rename(req.file.path, targetPath, err => {
    if (err) return res.status(500).send("Error uploading image");
    res.send("Image uploaded successfully");
  });
});

// 編輯活動或公告
app.put('/activity/:id', (req, res) => {
  const activityId = parseInt(req.params.id, 10);
  const {
    act_name,category,pro_id,act_con, act_cau_img,act_con_imgg,act_start,act_end,discountt,discount_rule
  } = req.body;

  // 讀取現有的商品數據
  const activityData = JSON.parse(fs.readFileSync('data/activity.json', 'utf8'));

  // 找到指定的商品
  const activityIndex = activityData.activity.findIndex(activity => activity.act_id === activityId);
  if (activityIndex === -1) {
    return res.status(404).json({ error: "activity not found" });
  }

  // 更新商品屬性
  activityData.activity[activityIndex] = {
    ...activityData.activity[activityIndex], // 保留原始數據
    act_name,category,pro_id,act_con, act_cau_img,act_con_imgg,act_start,act_end,discountt,discount_rule
  };

  // 保存更改
  fs.writeFileSync('data/activity.json', JSON.stringify(activityData, null, 2));
  res.json({ success: true, activity: activityData.activity[activityIndex] });
});
// 編輯公告
app.put('/announce/:id', (req, res) => {
  const announceID = parseInt(req.params.id, 10);
  const {ann_id,ann_name,ann_con, ann_date} = req.body;

  // 讀取現有的商品數據
  const activityData = JSON.parse(fs.readFileSync('data/activity.json', 'utf8'));

  // 找到指定的商品
  const announceIndex = activityData.announce.findIndex(announce => announce.ann_id === announceID);
  if (announceIndex === -1) {
    return res.status(404).json({ error: "announce not found" });
  }

  // 更新商品屬性
  activityData.announce[announceIndex] = {
    ...activityData.announce[announceIndex], // 保留原始數據
    ann_id,ann_name,ann_con, ann_date
  };

  // 保存更改
  fs.writeFileSync('data/activity.json', JSON.stringify(activityData, null, 2));
  res.json({ success: true, activity: activityData.announce[announceIndex] });
});

// 刪除活動或公告
app.delete('/activity/:id', (req, res) => {
  const { id } = req.params;
  const { type } = req.query;
  const list = type === "activity" ? activityData.activity : activityData.announce;
  const itemIndex = list.findIndex(item => item.id == id);

  if (itemIndex === -1) return res.status(404).json({ error: "Item not found" });

  list.splice(itemIndex, 1);
  fs.writeFileSync('data/activity.json', JSON.stringify(activityData, null, 2));
  res.status(204).send();
});


//折扣

// 過期判定
const isWithinDateRange = (start, end) => {
  const today = new Date();
  const startDate = new Date(start);
  const endDate = new Date(end);
  return today >= startDate && today <= endDate;
};

// Discount 計算
function applyDiscount(cart, activities) {
  // 讀取產品資料
  const productsData = JSON.parse(fs.readFileSync('data/products.json', 'utf8')).products;

  const updatedCart = cart.map(item => {
    // 從 productsData 中找到對應的產品
    const product = productsData.find(p => p.id === item.id);
    if (!product) return null; // 若無法找到商品則忽略此項

    // 找到該顏色的第一張圖片
    const variation = product.variations.find(v => v.color === item.color);
    const firstImage = variation ? variation.image[0] : product.image[0];

    // 設置基本商品資訊
    item.name = product.name;
    item.price = product.price;
    item.category = product.category;
    item.image = firstImage;
    item.quantity = item.number;

    // 檢查是否有適用的活動折扣
    const productActivity = activities.find(activity =>
      (activity.category.some(cat => product.category.includes(cat)) || activity.pro_id.includes(product.id)) &&
      isWithinDateRange(activity.act_start, activity.act_end)
    );

    let discountAmount = 0;
    if (productActivity) {
      const { discount, discount_rule } = productActivity;

      if (discount.startsWith('-')) { // 折扣類型如 "-50(n/2)"
        const [amount, divisor] = discount.match(/-([0-9]+)\((n\/([0-9]+))\)/).slice(1, 4);
        discountAmount = Math.floor(item.quantity / divisor) * amount;
      } else if (discount.startsWith('*')) { // 百分比折扣類型如 "*0.9"
        const multiplier = parseFloat(discount.slice(1));
        discountAmount = item.price * item.quantity * (1 - multiplier);
      } else if (discount_rule && discount_rule.type === "same_product_discount" && discount_rule.apply_to === "second_item") {
        // 每兩件第二件八折
        const applicableCount = Math.floor(item.quantity / discount_rule.quantity_condition);
        discountAmount = item.price * (1 - discount_rule.rate) * applicableCount;
      }

      // 四捨五入折扣金額
      discountAmount = Math.round(discountAmount);
    }

    // 計算最終價格，並四捨五入
    item.discount = discountAmount;
    item.finalPrice = Math.round((item.price * item.quantity) - discountAmount);

    return item;
  }).filter(item => item !== null); // 過濾掉無法找到的商品

  return updatedCart;
}

//結帳
app.post('/checkout', (req, res) => {
  const { cart } = req.body;
  const activities = activityData.activity;
  const updatedCart = applyDiscount(cart, activities);
  // Calculate total price and total discount
  const totalDiscount = updatedCart.reduce((acc, item) => acc + (item.discount || 0), 0);
  const totalPrice = updatedCart.reduce((acc, item) => acc + item.finalPrice, 0); 
  res.json({ updatedCart, totalDiscount, totalPrice });
});

//送出訂單
app.post('/sendorder', async (req, res) => { 
  const { username, cart, deliveryMethod, address, totalDiscount, totalPrice,status } = req.body;

  // 讀取 order.json，並新增一筆訂單
  const orderData = JSON.parse(fs.readFileSync('data/order.json', 'utf8'));
  if (!orderData.orders) {
    orderData.orders = [];
  }

  const newOrder = {
    orderId: orderData.orders.length + 1,
    username: username,
    items: cart,
    totalDiscount: totalDiscount,
    totalPrice: totalPrice,
    deliveryMethod: deliveryMethod,
    address: address,
    status: status,
    orderDate: new Date()
  };
  orderData.orders.push(newOrder);

  // 寫入 order.json
  fs.writeFileSync('data/order.json', JSON.stringify(orderData, null, 2), err => {
    if (err) {
      return res.status(500).send("Error saving order in order.json");
    }
  });
  console.log("order succ");
  // 讀取 users.json，並更新對應使用者的 order 欄位
  const usersData = await readUsersFile();
  const user = usersData.users.find(u => u.username === username);
  if (user) {
    user.order.push(newOrder.orderId);
  }

  // 寫入完整的 usersData 到 users.json，以保留其他使用者的資料
  try {
    fs.writeFileSync('data/users.json', JSON.stringify(usersData, null, 2));
    console.log("user succ");
    res.status(201).send("Order added successfully to users.json and order.json");
  } catch (err) {
    console.error("Error saving order in users.json:", err);
    res.status(500).send("Error saving order in users.json");
  }
});

//訂單
const ORDERS_PATH = path.join('data', 'order.json');
const PRODUCTS_PATH = path.join('data', 'products.json');

// 管理者獲取訂單
app.get('/orders', (req, res) => {
  fs.readFile(ORDERS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to fetch orders.' });
    const orders = JSON.parse(data);
    res.json(orders);
  });
});

// 管理者更新訂單
app.put('/orders/:orderId', (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  fs.readFile(ORDERS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to update order.' });

    // 解析為包含 orders 陣列的物件
    const ordersData = JSON.parse(fs.readFileSync('data/order.json', 'utf8'));
    if (!ordersData.orders) {
      ordersData.orders = [];
    }

    // 在 ordersData.orders 陣列中查找對應的訂單
    const order = ordersData.orders.find(order => order.orderId === parseInt(orderId));
    if (order) {
      order.status = status; // 更新訂單狀態

      // 寫入更新後的訂單資料
      fs.writeFile(ORDERS_PATH, JSON.stringify(ordersData, null, 2), err => {
        if (err) return res.status(500).json({ error: 'Failed to save updated order.' });
        res.json({ message: 'Order status updated successfully.' });
      });
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  });
});


// 管理者訂單狀態變化
app.post('/orders/:orderId/ship', (req, res) => {
  const { orderId } = req.params;

  fs.readFile(ORDERS_PATH, 'utf8', (err, data) => {
    if (err) return res.status(500).json({ error: 'Failed to update inventory.' });

    // 解析為包含 orders 陣列的物件
    const ordersData = JSON.parse(fs.readFileSync('data/order.json', 'utf8'));
    if (!ordersData.orders) {
      ordersData.orders = [];
    }

    // 在 ordersData.orders 陣列中查找對應的訂單
    const order = ordersData.orders.find(order => order.orderId === parseInt(orderId));

    if (order) {
      fs.readFile(PRODUCTS_PATH, 'utf8', (err, prodData) => {
        if (err) return res.status(500).json({ error: 'Failed to fetch products data.' });

        const products0 = JSON.parse(prodData);
        const products = products0.products;
        order.items.forEach(item => {
          const product = products.find(p => p.id === item.id);
          const variation = product.variations.find(v => v.color === item.color);
          const size = variation.sizes.find(s => s.size === item.size);
          if (size) size.stock -= item.quantity; // Deduct stock based on order quantity
          if (size) size.sales += item.quantity;
        });

        fs.writeFile(PRODUCTS_PATH, JSON.stringify(products0, null, 2), err => {
          if (err) return res.status(500).json({ error: 'Failed to update products file.' });
          res.json({ message: 'Order shipped and inventory updated.' });
        });
      });
    } else {
      res.status(404).json({ error: 'Order not found.' });
    }
  });
});

//使用者訂單檢視
app.get('/user/orders', (req, res) => {
  const { username } = req.query;

  fs.readFile('data/users.json', 'utf8', (err, userData) => {
    if (err) return res.status(500).json({ error: 'Failed to read user data.' });

    const users = JSON.parse(userData).users;
    const user = users.find(u => u.username === username);

    if (!user) return res.status(404).json({ error: 'User not found.' });

    fs.readFile(ORDERS_PATH, 'utf8', (err, orderData) => {
      if (err) return res.status(501).json({ error: 'Failed to read orders data.' });

      const orders = JSON.parse(orderData).orders.filter(order => order.username === username);
      res.json(orders);
    });
  });
});


// 啟動伺服器
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
