const advertService = require("../../services/advert.service");
const companyModel = require("../../model/Company");
const { successResponder, errorResponder } = require("../../utils/http_responder");

class AdvertController {
     async createAdvertType(req, res) {
          const type = await advertService.createAdvertType(req.body);

          return successResponder(res, type, 201, "Advert Type created successfull");
     }

     async create(req, res) {
          try {
               const advertsCount = await advertService.findAll().length;
               if (advertsCount >= 100) {
                    return errorResponder(
                         res,
                         "Ad limit reached. Cannot create more adverts.",
                         400,
                    );
               }

               const advertType = await advertService.findAdvertType(req.body.advertType);

               let targetUrl;

               if (req.body.target === "landing") {
                    // Fetch company_name from the database based on company_id
                    const company = await companyModel.findById(req.body.company_id);
                    const company_name = company ? company.subdomain : "";

                    // Construct targetUrl for landing
                    if (company.subdomain === "hops") {
                         targetUrl = "https://www.aliveshoes.com/hops-44";
                    } else if (company.subdomain === "tbm") {
                         targetUrl = `https://www.theblackmarket.deals`;
                    } else {
                         targetUrl = `https://${company_name}.ishop.black`;
                    }
               } else if (req.body.target === "product") {
                    // Fetch company_name from the database based on company_id
                    const company = await companyModel.findById(req.body.company_id);
                    const company_name = company ? company.subdomain : "";
                    if (company.subdomain === "hops") {
                         targetUrl = "https://www.aliveshoes.com/hops-44";
                    } else if (company.subdomain === "tbm") {
                         targetUrl = `https://www.theblackmarket.deals`;
                    } else {
                         targetUrl = `https://${company_name}.ishop.black/product/${req.body.productId}`;
                    }
               }

               // Update the payload with the correct targetUrl
               const payload = {
                    ...req.body,
                    advertType: advertType._id,
                    targetUrl,
               };

               const createdAdvert = await advertService.createAdvert(payload);
               // await Odoo.connect();
               // await Odoo.execute_kw("product.template", "write", [
               //      [+productId],
               //      { x_ads_num: "1" },
               // ]);
               // await Odoo.execute_kw("product.product", "write", [
               //      [+productId],
               //      { x_ads_num: "1" },
               // ]);
               return successResponder(res, createdAdvert, 201, "Advert created successfully");
          } catch (error) {
               // Handle any errors that may occur during the creation process
               return errorResponder(res, error.message, 500); // Adjust the status code as needed
          }
     }

     async findAllAdsService(req, res) {
          const adService = await advertService.findAllType();

          return successResponder(res, adService);
     }

     async getAdsLenght(req, res) {
          try {
               let adverts;

               const { startDate, endDate } = req.query;
               if (startDate && endDate) {
                    // Assuming you have a method in advertService to filter by date range
                    adverts = await advertService.findByDateRange(startDate, endDate);
               } else {
                    // If no date range is provided, get all adverts
                    adverts = await advertService.findAll();
               }

               // Send the length of ads as a response
               return successResponder(res, { length: adverts.length });
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async findAdsByCompany(req, res) {
          try {
               const adverts = await advertService.findByCompany(req.query.company_id);
               return successResponder(res, adverts);
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async findAdById(req, res) {
          try {
               const adverts = await advertService.findById(req.query.id);

               return successResponder(res, adverts);
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async findAll(req, res) {
          try {
               let adverts;
               if (req.query.advertType) {
                    adverts = await advertService.findByType(req.query.advertType);
               } else {
                    adverts = await advertService.findAll();
               }

               const activeAdverts = adverts.filter((advert) => advert.status === "ACTIVE");

               const advertsWithCompanyName = await Promise.all(
                    activeAdverts.map(async (advert) => {
                         const advertData = advert.toObject ? advert.toObject() : advert;

                         const company = await companyModel.findById(advertData.company_id);

                         return {
                              ...advertData,
                              company_name: company.company_name,
                         };
                    }),
               );

               return successResponder(res, advertsWithCompanyName, 200, "successful");
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }

     async updateOne(req, res) {
          const { advertId } = req.params;

          try {
               const updateAdvert = await advertService.updateOne(advertId, req.body);

               return successResponder(res, updateAdvert, 201, "Update successfull");
          } catch (error) {
               return errorResponder(res, error?.code, error?.message);
          }
     }
}

module.exports = new AdvertController();
