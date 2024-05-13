const Odoo = require("../config/odoo.connection");
const { toDataURL } = require("../utils/imageBase64");

const unitOfMeasure = async (odoo) => {
     try {
          await odoo.connect();
          console.log("Get unit of mesasure");
          let uom = await odoo.execute_kw("uom.uom", "search_read", []);
          return { uom };
     } catch (e) {
          console.error("Error when trying to connect to odoo xml-rpc");
     }
};

const getProductById = async (id) => {
     let productId = id;

     try {
          await Odoo.connect();
          const productData = await Odoo.execute_kw("product.template", "search_read", [
               [["id", "=", productId]],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "standard_price",
                    "description",
                    "base_unit_count",
                    "product_variant_id",
                    "categ_id",
                    "rating_avg",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_images",
                    "x_free_shipping",
                    "x_brand_gate_id",
                    "x_brand_gate_variant_id",
                    "x_show_sold_count",
                    "rating_count",
                    "website_url",
                    "public_categ_ids",
                    "website_meta_keywords",
                    "x_shipping_package",
                    "x_printify_id",
                    "x_printify_variant_id",
                    "x_printify_shop_id",
                    "attribute_line_ids",
                    "x_discount",
                    "x_featured_product",
                    "x_total_available_qty",
               ],
          ]);
          if (productData.length === 0) {
               return [];
          }

          let attributeLineIds = productData[0].attribute_line_ids || [];
          attributeLineIds = attributeLineIds?.map(async (attributeLineId) => {
               let attributeLineData = await Odoo.execute_kw(
                    "product.template.attribute.line",
                    "read",
                    [[attributeLineId], []],
               );

               attributeLineData = await attributeLineData?.map(async (lineData) => {
                    // const valueIds = lineData?.value_ids || [];
                    let productTemplateValueIds = lineData?.product_template_value_ids || [];

                    // for (const valueId of valueIds) {
                    //      const attributeValueData = await Odoo.execute_kw(
                    //           "product.attribute.value",
                    //           "read",
                    //           [[valueId], []],
                    //      );

                    //      console.log("Attribute Value ID:", attributeValueData);
                    // }

                    productTemplateValueIds = productTemplateValueIds?.map(
                         async (productTemplateValueId) => {
                              const productTemplateValueData = await Odoo.execute_kw(
                                   "product.template.attribute.value",
                                   "read",
                                   [[productTemplateValueId], []],
                              );

                              return await productTemplateValueData;
                         },
                    );

                    productTemplateValueIds = await Promise.all(productTemplateValueIds);

                    return {
                         ...lineData,
                         product_template_value_ids_data: productTemplateValueIds,
                    };
                    // return lineData;
               });
               // attributeLineIds = await Promise.all(attributeLineData);
               // console.log("Attribute Line ID:", await attributeLineData);

               attributeLineData = Promise.all(attributeLineData);
               return await attributeLineData;
          });
          attributeLineIds = await Promise.all(attributeLineIds);
          // console.log("attributeLineIds", attributeLineIds);
          return [{ ...productData[0], attribute_line_ids_data: attributeLineIds }];
     } catch (e) {
          console.error("XMPLC Error", e);
     }
};
/**
 * This function get feature products
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getFeaturedProducts = async (params) => {
     console.log("GET /api/products");
     try {
          await Odoo.connect();

          // const tagName = "Featured Product";
          const products = await Odoo.execute_kw("product.template", "search_read", [
               [
                    // ["product_tag_ids.name", "=", tagName],
                    ["x_featured_product", "=", true],
                    ["company_id", "=", params.company_id],
               ],
               [
                    "id",
                    "name",
                    "display_name",
                    "list_price",
                    // "image_1920",
                    "product_tag_ids",
                    "standard_price",
                    "description",
                    "base_unit_count",
                    "product_variant_id",
                    "categ_id",
                    "rating_avg",
                    "x_color",
                    "x_dimension",
                    "x_size",
                    "x_subcategory",
                    "x_weight",
                    "x_rating",
                    "x_show_sold_count",
                    "x_images",
                    "rating_count",
                    "website_url",
                    "public_categ_ids",
                    "x_discount",
                    "website_meta_keywords",
               ],
               // null,
               params.page ? params.page * 10 - 10 : 0,
               params.page ? params.page * 10 : 10,
          ]);
          return products;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const searchProducts = async (params) => {
     console.log("GET /api/products/search");
     try {
          await Odoo.connect();
          const products = await Odoo.execute_kw(
               "product.template",
               "search_read",
               [
                    [...params],
                    [
                         "id",
                         "name",
                         "display_name",
                         "list_price",
                         "company_id",
                         // "image_1920",
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
                         "x_discount",
                         "x_total_available_qty",
                         "website_meta_keywords",
                    ],
               ],

               {},
          );
          return products;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

const addProduct = async (params) => {
     try {
          // const images = params.product.images || [];
          // Convert each image buffer to base64
          // const base64Images = images.map((image) => {
          //      return {
          //           ...image,
          //           base64: image.buffer.toString("base64"),
          //      };
          // });

          // Connect to Odoo instance
          await params.odoo.connect();

          // Create the product
          const productData = {
               base_unit_count: params.product.qty,
               public_categ_ids: [+params.product.category_id],
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               description: params.product.description,
               website_published: params.product.published,
               company_id: params.product.company_id,
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_weight: params.product.weight,
               x_images: params.product.images,
               x_dimension: params.product.dimension,
               product_tag_ids: params.product.product_tag_ids
                    ? JSON.parse(params.product.product_tag_ids)
                    : [],
               x_discount: params?.product?.discount
                    ? JSON.stringify(params?.product?.discount)
                    : null,
               // x_shipping_package: JSON?.stringify(params?.product?.x_shipping_package),
               x_shipping_package: params?.product?.x_shipping_package,
               x_free_shipping: params?.product.free_shipping,
               x_brand_gate_id: params?.product.brand_gate_id,
               x_brand_gate_variant_id: params?.product.brand_gate_variant_id,
               x_show_sold_count: params?.product.x_show_sold_count,
               x_printify_id: params?.product.x_printify_id,
               x_printify_variant_id: params?.product.x_printify_variant_id,
               x_printify_shop_id: params?.product.x_printify_shop_id,
               x_featured_product: params?.product?.x_featured_product,
          };

          const productId = await params.odoo.execute_kw("product.template", "create", [
               productData,
          ]);

          if (params.product.product_tag_ids) {
               if (JSON.parse(params.product.product_tag_ids)?.length > 0) {
                    await params.odoo.execute_kw("product.template", "write", [
                         [productId],
                         { product_tag_ids: JSON.parse(params.product.product_tag_ids) },
                    ]);
               }
          }
          return productId;
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          throw error;
     }
};

const createProductTemplate = async (params, templateData) => {
     try {
          await params.odoo.connect();
          ("product.template");
          return await params.odoo.execute_kw("product.template", "create", [templateData]);
     } catch (error) {
          console.error("Error creating product template:", error);
          throw error;
     }
};

const addProductVariant = async (params) => {
     if (params.product.is_variant) {
          const templateData = {
               base_unit_count: params.product.qty,
               public_categ_ids: [+params.product.category_id],
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               description: params.product.description,
               website_published: params.product.published,
               company_id: params.product.company_id,
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_weight: params.product.weight,
               x_images: params.product.images,
               x_dimension: params.product.dimension,
               x_shipping_package: params?.product?.x_shipping_package,
               x_brand_gate_id: params?.product.brand_gate_id,
               x_brand_gate_variant_id: params?.product.brand_gate_variant_id,
               x_shipping_package: JSON?.stringify(params?.product?.x_shipping_package),
               x_free_shipping: params?.product.free_shipping,
               x_show_sold_count: params?.product.x_show_sold_count,
               x_discount: params?.product?.discount
                    ? JSON.stringify(params?.product?.discount)
                    : null,
               x_printify_id: params?.product.x_printify_id,
               x_printify_variant_id: params?.product.x_printify_variant_id,
               x_printify_shop_id: params?.product.x_printify_shop_id,
               product_tag_ids: params.product.product_tag_idsfollow
                    ? JSON.parse(params.product.product_tag_ids)
                    : [],
               x_featured_product: params?.product?.x_featured_product,
               // qty_available: 5,
          };

          console.log("templateData", templateData);
          const templateId = await createProductTemplate(params, templateData);

          if (params?.product?.variants && params?.product?.variants.length > 0) {
               await params?.product?.variants?.forEach(async (container) => {
                    await container.forEach(async (variant, idx) => {
                         // console.log("variant", variant);

                         let attributeValueId;

                         if (!variant?.valueId) {
                              const attributeValueData = {
                                   name: variant?.value, // Replace with the actual value
                                   attribute_id: variant?.attributeId,
                                   sequence: 1, // Optional: Display sequence
                              };
                              console.log(attributeValueData);
                              attributeValueId = await params.odoo.execute_kw(
                                   "product.attribute.value",
                                   "create",
                                   [attributeValueData],
                              );
                         } else {
                              attributeValueId = variant?.valueId;
                         }
                         console.log(attributeValueId);
                         const attributeLineData = {
                              product_tmpl_id: templateId,
                              attribute_id: variant?.attributeId,
                              value_ids: [[6, 0, [attributeValueId]]],
                         };

                         const attributeLineId = await params.odoo.execute_kw(
                              "product.template.attribute.line",
                              "create",
                              [attributeLineData],
                         );

                         if (variant?.price_extra && variant?.price_extra !== 0) {
                              ///ADD PRICE_EXTRA
                              const attributeLineRespData = await Odoo.execute_kw(
                                   "product.template.attribute.line",
                                   "read",
                                   [[attributeLineId], ["product_template_value_ids"]],
                              );

                              const productTemplateValueIds =
                                   attributeLineRespData[0]?.product_template_value_ids || [];
                              const attributeValueWriteData = {
                                   price_extra: variant?.price_extra, // Set the price adjustment here
                              };

                              await params.odoo.execute_kw(
                                   "product.template.attribute.value",
                                   "write",
                                   [[productTemplateValueIds[0]], attributeValueWriteData],
                              );
                         }
                    });
               });
          }

          return templateId;
     } else {
          console.log("failed");
          // return await addProduct(params);
          return 1;
     }
};

const updateProduct = async (params) => {
     try {
          // const images = params.product.images || [];
          // Convert each image buffer to base64
          // const base64Images = images?.map((image) => {
          //      return {
          //           ...image,
          //           base64: image.buffer.toString("base64"),
          //      };
          // });

          await params.odoo.connect();
          console.log(" params.product", params.product);
          // Create the product
          const productData = {
               base_unit_count: params.product.qty,
               public_categ_ids: [+params.product.category_id],
               list_price: params.product.list_price,
               standard_price: params.product.standard_price,
               name: params.product.name,
               uom_name: params.product.uom_name,
               display_name: params.product.name,
               description: params.product.description,
               website_published: params.product.published,
               company_id: params.product.company_id,
               product_tag_ids: params.product.product_tag_ids
                    ? JSON.parse(params.product.product_tag_ids)
                    : [],
               x_color: params.product.color,
               x_subcategory: params.product.subcategory,
               x_size: params.product.size,
               x_free_shipping: params.product.free_shipping,
               x_weight: params.product.weight,
               x_images: params.product.images,
               x_show_sold_count: params?.product.x_show_sold_count,
               x_dimension: params.product.dimension,
               x_featured_product: params?.product?.x_featured_product,
          };
          // Update the product data
          const result = await params.odoo.execute_kw("product.template", "write", [
               [+params?.productId],
               productData,
          ]);
          console.log("result", result);

          if (result) {
               console.log("Product data updated successfully. Product ID:", +params?.productId);
          } else {
               console.error("Failed to update product data.");
               throw new Error("Failed to update product data.");
          }

          return result;
     } catch (error) {
          console.error("Error updating product:", error);
          throw error;
     }
};

const addMultipleProducts = async (params) => {
     try {
          const productIds = [];
          for (const product of params.products) {
               // // Connect to Odoo instance
               await params.odoo.connect();

               // // Create the product
               const productData = {
                    base_unit_count: product.qty,
                    categ_id: product.category_id,
                    list_price: product.list_price,
                    standard_price: product.standard_price,
                    name: product.name,
                    uom_name: product.uom_name,
                    display_name: product.name,
                    website_published: product.published,
                    company_id: product.company_id,
                    x_images: product.images,
               };

               const productId = await params.odoo.execute_kw("product.template", "create", [
                    productData,
               ]);

               // // Write the images if provided
               // for (const base64Image of base64Images) {
               //      await params.odoo.execute_kw("product.template", "write", [
               //           [productId],
               //           { image_1920: base64Image.base64 },
               //      ]);
               // }
               productIds.push(productId);
               // Log the ID of the created product
               console.log(`Product created with ID: ${productId}`);
          }

          // Return a success message or relevant data
          return productIds;
     } catch (error) {
          console.error("Error when trying to connect to Odoo XML-RPC.", error);
          throw error;
     }
};

const getProductDetails = async (productId) => {
     try {
          await Odoo.connect();
          console.log("Connect to odoo XML-RPC is successed.");

          const fields = ["name", "res_id", "res_model", "public", "datas"];
          let attachments = await Odoo.execute_kw("ir.attachment", "search_read", [
               [],
               // fields,
               // [["name", "=", "s_mega_menu_images_subtitles_default_image_3.jpg"]],
          ]);

          if (attachments?.length > 0) {
               const et = attachments.filter((attachment) => {
                    return attachment?.res_id === productId;
               });

               console.log("et", et);
          }
          // const productImages = await Odoo.execute_kw("product.image", "search_read", [
          //      [["product_tmpl_id", "=", id]],
          //      { fields: ["image"] },
          // ]);

          return attachments;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC.", e);
     }
};

// const updateProduct = async (params) => {
//      try {
//           await params.odoo.connect();
//           let product = await odoo.execute_kw("product.template", "write", [
//                [params.product_id],
//                {
//                     base_unit_count: params.product.qty,
//                     categ_id: params.product.category_id,
//                     list_price: params.product.list_price,
//                     standard_price: params.product.standard_price,
//                     name: params.product.name,
//                     // image: params.product.image,
//                     uom_name: params.product.uom_name,
//                     display_name: params.product.name,
//                     // product_variant_ids: 1,
//                     website_published: params.product.published,
//                },
//           ]);
//           return product;
//      } catch (e) {
//           console.error("Error when try connect Odoo XML-RPC.", e);
//      }
// };

/**
 * This function delete a user product
 * @param  {[array]} product_id [The id of the product that has been seleected]
 * @return {[productID]}        [Return the id of the product]
 */
const deleteProduct = async (id) => {
     try {
          await Odoo.connect();
          await Odoo.execute_kw("product.template", "unlink", [[Number(id)]]);
          return true;
     } catch (error) {
          console.log(error);
          return false;
     }
};

// const getProductImageUrl = async (params) => {

// 	try {
// 		await params.odoo.connect();
// 		let product = await odoo.execute_kw('product.template', 'read', [
// 			[params.product_id]
// 	} catch (e) {

// 	}
// }

module.exports = {
     addProduct,
     unitOfMeasure,
     getFeaturedProducts,
     getProductById,
     getProductDetails,
     addMultipleProducts,
     updateProduct,
     searchProducts,
     addProductVariant,
     deleteProduct,
};
