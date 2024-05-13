const Odoo = require("../config/odoo.connection");
/**
 * This function get all promotions
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotion = async (params) => {
     console.log("..get promotionS");
     try {
          await Odoo.connect();

          let promotions = await Odoo.execute_kw("loyalty.program", "search_read", [
               [["company_id", "=", params]],
               [
                    "name",
                    "active",
                    "applies_on",
                    "available_on",
                    "coupon_count",
                    "coupon_count_display",
                    "coupon_ids",
                    "limit_usage",
                    "program_type",
                    "reward_ids",
                    "rule_ids",
                    "trigger",
                    "trigger_product_ids",
               ],
               0,
               5, // offset, limit
          ]);

          let loyality = await Promise.all(
               promotions.map(async (obj) => {
                    let data = {
                         id: obj.id,
                         name: obj.name,
                         active: obj.active,
                         applies_on: obj.applies_on,
                         available_on: obj.available_on,
                         coupon_count: obj.coupon_count,
                         coupon_count_display: obj.coupon_count_display,
                         coupon_ids: obj.coupon_ids,
                         limit_usage: obj.limit_usage,
                         program_type: obj.program_type,
                         rewards_ids: obj.reward_ids,
                         rule_id: obj.rule_id,
                         rewards: await Odoo.execute_kw("loyalty.reward", "read", [
                              obj.reward_ids[0],
                         ]),
                    };
                    console.log(data);
                    return data;
               }),
          );

          return await loyality;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC", e);
     }
};

/**
 * This function get all promotion rewards
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotionRewards = async (params) => {
     try {
          var odoo = await Odoo.connect();
          let rewards = await odoo.execute_kw("loyalty.reward", "search_read", [
               [["company_id", "=", 1]],
               [
                    "id",
                    "display_name",
                    "active",
                    "discount_max_amount",
                    "discount_mode",
                    "discount_product_category_id",
                    "discount_product_domain",
                    "discount_product_ids",
                    "reward_product_ids",
                    "reward_product_id",
                    "reward_type",
                    "company_id",
                    "program_id",
               ],
               0,
               5, // offset, limit
          ]);

          return await rewards;
     } catch (e) {
          console.error("Error when trying to connect to Odoo XML-RPC", e);
     }
};

/**
 * This function get all company promotions
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const getPromotionCondition = async (params) => {
     try {
          var odoo = await Odoo.connect();
          let conditions = await odoo.execute_kw("loyalty.rule", "search_read", [
               [["company_id", "=", 1]],
               ["id", "display_name"],
               0,
               5, // offset, limit
          ]);

          return await conditions;
     } catch (e) {
          console.error("Error when trying to connect to Odoo XML-RPC", e);
     }
};
/**
 * This service add Promotion reward
 * @param  {[type]} params [description]
 * @return {[type]}        [description]
 */
const addPromotionRewards = async (params) => {
     try {
          var odoo = await Odoo.connect();
          let rewards = await odoo.execute_kw("loyalty.reward", "create", [
               {
                    description: params.reward.desc,
                    discount: params.reward.discount,
                    display_name: params.reward.display_name,
                    reward_type: params.reward.reward_type,
                    program_id: params.reward.program_id,
                    reward_product_qty: params.reward_product_qty,
               },
          ]);

          return await rewards;
     } catch (e) {
          console.error("Error when try connect Odoo XML-RPC", e);
     }
};

module.exports = {
     getPromotion,
     getPromotionRewards,
     getPromotionCondition,
     addPromotionRewards,
};
