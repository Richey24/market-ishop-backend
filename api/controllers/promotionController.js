var Odoo = require("async-odoo-xmlrpc");

const {
     getPromotionRewards,
     addPromotionRewards,
     getPromotionCondition,
} = require("../../services/promotion.service");
const Promotion = require("../../model/Promotion");

exports.getPromotions = async (req, res) => {
     try {
          let company_id = req.params.company_id;
          if (!company_id) {
               return res.status(400).json({ message: "Company ID is required" });
          }
          const promo = await Promotion.find({ company_id: company_id });
          if (!promo) {
               return res.status(400).json({ message: "No Promotion Found with this company ID" });
          }
          res.status(200).json(promo);
     } catch (error) {
          res.status(500).json({ message: "An error occured" });
     }
};

exports.getCondtions = async (req, res) => {
     let user = req.userData;
     let company_id = 1;

     var odoo = new Odoo({
          url: "http://104.43.252.217/",
          port: 80,
          db: "bitnami_odoo",
          username: "user@example.com",
          password: "850g6dHsX1TQ",
     });

     let params = {
          odoo: odoo,
          promo: req.body,
          user: user,
     };

     const conditions = await getPromotionCondition(params);
     res.status(201).json({ conditions });
};

exports.getPromotionBanner = async (req, res) => {
     let user = req.userData;
     let company_id = 1;

     let params = {
          promo: req.body,
          user: user,
     };

     const rewards = await getRewards(params);
     res.status(201).json(rewards);
};
