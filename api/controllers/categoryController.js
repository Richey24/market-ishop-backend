const { getFeaturedCategories } = require("../../services/category.service");
const Odoo = require("../../config/odoo.connection");
const CompanyService = require("../../services/company.service");

class CategoryController {
     async findAll(req, res) {
          try {
               await Odoo.connect();

             let categories = await Odoo.execute_kw("product.public.category", "search_read", [
               [],
               [
                    "id",
                    "name"
               ]
          ]);
               res.status(200).json({ categories, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
               // console.error("Error when trying to connect odoo xml-rpc", e);
          }
     }

     async getComapnyCategoriesByName(req, res) {
          try {
               const { name } = req.body;
               await Odoo.connect();
               const company = await CompanyService.findById(req.params.companyId);

               let categories = await Odoo.execute_kw(
                    "product.public.category",
                    "search_read",
                    [[["id", "in", company.categories]], ["id", "name"]],
                    {
                         fields: ["name"],
                         order: "id desc",
                    },
               );

               const category = categories.find((cat) => cat.name === name);

               res.status(200).json({ category, status: true });
          } catch (e) {
               res.status(500).json({ error: e, status: false });
          }
     }

     async fetchFeatureCategories(req, res) {
          console.log("../fetching feature categories");

          let user = req.userData;

          let params = {
               odoo: Odoo,
               promo: req.body,
               user: user,
          };

          const categories = await getFeaturedCategories(params);
          res.status(201).json({ categories });
     }
}

module.exports = new CategoryController();
