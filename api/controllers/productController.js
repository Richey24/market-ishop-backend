const Odoo = require("../../config/odoo.connection");
const Rating = require("../../model/Rating");
const User = require("../../model/User");

const { searchProducts } = require("../../services/product.service");

exports.getProductbyCategory = async (req, res) => {
     console.log("GET /api/products");

     try {
          const categoryId = +req.params.categoryId;
          const companyId = [+req.params.companyId];

          if (!req.params.category) {
               await Odoo.connect();
               console.log("Connect to Odoo XML-RPC - api/products");

               const theProducts = await Odoo.execute_kw("product.template", "search_read", [
                    [
                         ["public_categ_ids", "=", categoryId],
                         ["type", "=", "consu"],
                         ["company_id", "=", companyId],
                         ["x_disabled", "!=", true]
                    ],
                    [
                         "id",
                         "public_categ_ids",
                         "name",
                         "display_name",
                         "list_price",
                         // "image_1920",
                         "product_variant_id",
                         "standard_price",
                         "description",
                         "base_unit_count",
                         "categ_id",
                         "rating_avg",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_images",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "website_url",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_discount",
                    ],
               ]);

               const products = theProducts.map((product) => {
                    return {
                         ...product,
                         x_images: JSON.parse(product.x_images),
                         x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                    };
               });

               res.status(200).json({ products, status: true });
          } else {
               res.status(404).json({ error: "Invalid Category", status: false });
          }
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.filterProducts = async (req, res) => {
     const category = req.body.category_id;
     const offset = 5;
     const page = 0;

     try {
          await Odoo.connect();

          if (category === null) {
               let theProducts = await Odoo.execute_kw("product.product", "search_read", [
                    [["type", "=", "consu"], ["x_disabled", "!=", true]],
                    [
                         "name",
                         "list_price",
                         // "image_512",
                         "categ_id",
                         "x_rating",
                         "rating_count",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_rating",
                         "x_images",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_show_sold_count",
                    ],
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return {
                         id: product.id,
                         website_url: product.website_url,
                         name: product.name,
                         description: product.description,
                         categ_id: product.categ_id,
                         public_categ_ids: product.public_categ_ids,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         // image_1920: product.image_1920,
                         // image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_images: JSON.parse(product.x_images),
                         x_dimension: product.x_dimension,
                         x_shipping_package: product?.x_shipping_package,
                         x_show_sold_count: product?.x_show_sold_count,
                    };
               });
               res.status(201).json({ products });
          } else {
               let theProducts = await Odoo.execute_kw("product.product", "search_read", [
                    [["type", "=", "consu"]],
                    // [['type', '=', 'consu'], ['public_categ_ids', '=', Number(category)]]
                    [
                         "name",
                         "list_price",
                         "image_512",
                         "categ_id",
                         "x_color",
                         "x_dimension",
                         "x_size",
                         "x_subcategory",
                         "x_weight",
                         "x_images",
                         "x_rating",
                         "rating_count",
                         "website_url",
                         "public_categ_ids",
                         "website_meta_keywords",
                         "x_shipping_package",
                         "x_show_sold_count",
                    ], // Fields
                    0,
                    5, // Offset, Limit
               ]);
               const products = theProducts.map((product) => {
                    return {
                         id: product.id,
                         website_url: product.website_url,
                         name: product.name,
                         description: product.description,
                         categ_id: product.categ_id,
                         public_categ_ids: product.public_categ_ids,
                         list_price: product.list_price,
                         standard_price: product.standard_price,
                         company_id: product.company_id,
                         display_name: product.display_name,
                         base_unit_count: product.base_unit_count,
                         // image_1920: product.image_1920,
                         // image_1024: product.image_1024,
                         x_rating: product.x_rating,
                         create_date: product.create_date,
                         x_subcategory: product.x_subcategory,
                         x_show_sold_count: product?.x_show_sold_count,
                         x_size: product.x_size,
                         x_weight: product.x_weight,
                         x_color: product.x_color,
                         x_shipping_package: product?.x_shipping_package,
                         x_images:
                              typeof product?.x_images === "string"
                                   ? JSON?.parse(product?.x_images)
                                   : product?.x_images,
                         x_dimension: product.x_dimension,
                    };
               });
               res.status(201).json(products);
          }
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

exports.searchProduct = async (req, res) => {
     try {
          const body = req.body;
          const keys = Object.keys(body);
          const arr = [];
          keys.forEach((key) => {
               arr.push([key, "ilike", body[key]]);
          });
          const theProducts = await searchProducts(arr);

          const products = theProducts.map((product) => {
               return {
                    ...product,
                    x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                    x_images: JSON.parse(product.x_images),
               };
          });
          res.status(200).json({ products, status: true });
     } catch (err) {
          res.status(400).json({ err, status: false });
     }
};

exports.getRandomProduct = async (req, res) => {
     try {
          // Connect to Odoo
          await Odoo.connect();

          // Fetch public categories
          const categories = await Odoo.execute_kw("product.public.category", "search_read", [
               [["x_disabled", "!=", true]],
               ["id", "name"],
          ]);

          if (categories.length === 0) {
               throw new Error("No categories found.");
          }

          // Select a random set of category IDs
          const selectRandomCategoryIds = (categories, count) => {
               const shuffled = categories.sort(() => 0.5 - Math.random());
               return shuffled.slice(0, count).map((category) => category.id);
          };
          const randomCategoryIds = selectRandomCategoryIds(categories, 5); // Select 5 random category IDs

          // Fetch products based on the selected category IDs
          const fields = [
               "id",
               "name",
               "display_name",
               "list_price",
               "company_id",
               "standard_price",
               "description",
               "base_unit_count",
               "categ_id",
               "rating_avg",
               "x_color",
               "x_dimension",
               "x_size",
               "x_subcategory",
               "x_weight",
               "x_rating",
               "x_images",
               "rating_count",
               "website_url",
               "public_categ_ids",
               "x_show_sold_count",
               "x_inventory_tracking",
               "x_discount",
               "website_meta_keywords",
               "sales_count",
          ];

          const params = [
               ["public_categ_ids", "in", randomCategoryIds],
               ["sales_count", ">", 0],
          ];

          let products = await Odoo.execute_kw(
               "product.template",
               "search_read",
               [params, fields],
               null,
               200,
          );

          // If the number of products is less than 20, fetch the latest products to make up the difference
          if (products.length < 100) {
               const additionalProducts = await Odoo.execute_kw("product.template", "search_read", [
                    [],
                    fields,
                    null,
                    200 - products.length,
               ]);
               products = products.concat(additionalProducts);
          }

          if (products.length === 0) {
               throw new Error("No popular products found.");
          }

          // Randomize the products
          const randomizedProducts = products.sort(() => Math.random() - 0.5).map((product) => {
               return {
                    ...product,
                    x_discount: product?.x_discount ? JSON.parse(product?.x_discount) : null,
                    x_images: JSON.parse(product.x_images),
               };
          });

          res.status(200).json({ products: randomizedProducts, status: true });
     } catch (error) {
          console.error("Error fetching random popular product:", error);
          res.status(400).json({ error, status: false });
     }
};

exports.rateProduct = async (req, res) => {
     try {
          const { productId, userId, title, name, detail, rating } = req.body;
          if (!productId || !title || !userId || !name || !rating) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }

          const user = await User.findById(userId);
          if (user.rated.includes(productId)) {
               return res
                    .status(400)
                    .json({ message: "User already rated this product", status: false });
          }
          const rateObj = {
               productId: productId,
               ratings: {
                    title: title,
                    name: name,
                    detail: detail,
                    rating: rating,
                    date: Date.now(),
               },
          };
          const rate = await Rating.findOne({ productId: productId });
          let theRate;
          if (rate) {
               theRate = await Rating.findOneAndUpdate(
                    { productId: productId },
                    { $push: { ratings: rateObj.ratings } },
                    { new: true },
               );
          } else {
               theRate = await Rating.create(rateObj);
          }
          const mapNum = theRate.ratings.map((ra) => ra.rating);
          const ratingAvg = mapNum.reduce((a, b) => Number(a) + Number(b)) / mapNum.length;
          await Odoo.connect();
          const result = await Odoo.execute_kw("product.template", "write", [
               [+productId],
               { x_rating: ratingAvg },
          ]);
          // await Odoo.execute_kw("product.product", "write", [
          //      [+productId],
          //      { x_rating: ratingAvg },
          // ]);
          await User.findByIdAndUpdate(userId, { $push: { rated: productId } });
          res.status(200).json({
               ratingAvg: ratingAvg,
               theRate,
               result,
               status: true,
               message: "Rated Successfully",
          });
     } catch (error) {
          res.status(500).json({ message: "Something went wrong, try again", status: false });
     }
};

exports.getProductRating = async (req, res) => {
     try {
          const productId = req.params.id;
          if (!productId) {
               return res
                    .status(400)
                    .json({ message: "Send all required parameters", status: false });
          }
          const rating = await Rating.findOne({ productId: productId });
          res.status(200).json({ rating, status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

exports.getAdsProduct = async (req, res) => {
     try {
          await Odoo.connect();
          console.log("Connect to Odoo XML-RPC - api/products");
          const theProducts = await Odoo.execute_kw("product.template", "search_read", [
               [["x_ads_num", "=", "1"], ["x_disabled", "!=", true]],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "description",
                    "product_variant_id",
                    "base_unit_count",
                    "categ_id",
                    "rating_avg",
                    "rating_count",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_images",
                    "x_weight",
                    "x_rating",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
                    "x_ads_num",
                    "x_total_available_qty",
                    "x_discount",
               ],
          ]);
          const adsProduct = theProducts?.filter((pro) => pro.x_ads_num !== false);
          const notAdsProduct = theProducts?.filter((pro) => pro.x_ads_num === false);

          const finalArr = [...adsProduct, ...notAdsProduct];

          res.status(200).json({ finalArr, status: true });
     } catch (error) {
          res.status(500).json({ error: "Internal Server Error", status: false });
     }
};

const getOdooSuggestions = async (query) => {
     try {
          await Odoo.connect();
          // Fetch category suggestions from Odoo
          const categorySuggestions = await Odoo.execute_kw(
               "product.public.category",
               "search_read",
               [[["name", "ilike", query], ["x_disabled", "!=", true]], ["name"]],
          );

          // Fetch product suggestions from Odoo
          const productSuggestions = await Odoo.execute_kw("product.template", "search_read", [
               [["name", "ilike", query]],
               [
                    "name",
                    "standard_price",
                    "description",
                    "base_unit_count",
                    "public_categ_ids",
                    "product_variant_id",
                    "x_size",
                    "list_price",
                    "image_1920",
                    "x_total_available_qty",
               ],
          ]);

          // Extract names and add type information
          const categoryNames = categorySuggestions.map((category) => ({
               name: category.name,
               type: "category",
          }));
          // const productNames = productSuggestions.map((product) => ({
          //      name: product.name,
          //      type: "product",
          // }));

          // Combine and return the suggestions
          return categoryNames.concat(productSuggestions);
     } catch (error) {
          console.error("Error fetching Odoo suggestions:", error.message);
          return [];
     }
};

exports.searchProductsAndcateg = async (req, res) => {
     try {
          const query = req.query.q || "";
          // Fetch suggestions from Odoo
          const odooSuggestions = await getOdooSuggestions(query);

          // You can add additional sources and logic as needed

          // Combine and return the suggestions
          res.json({ suggestions: odooSuggestions });
     } catch (err) {
          console.log("error", err);
          res.status(500).json({ error: err, status: false });
     }
};
